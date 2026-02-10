/**
 * FIREBASE-AUTH.JS - Servicio de autenticación con Firebase
 * Sistema completo de login para Aula Industrial
 */

class FirebaseAuthService {
    constructor() {
        this.auth = window.firebaseAuth;
        this.db = window.firebaseDB;
        this.currentUser = null;
        
        // Listener de cambios de autenticación
        this.auth.onAuthStateChanged(user => {
            this.currentUser = user;
            if (user) {
                console.log('✅ Usuario autenticado:', user.email || user.displayName);
                // Guardar último login
                this.updateLastLogin(user.uid);
            } else {
                console.log('❌ Usuario no autenticado');
            }
        });
    }

    /**
     * Actualizar último login del usuario
     */
    async updateLastLogin(uid) {
        try {
            await this.db.collection('users').doc(uid).set({
                lastLogin: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
        } catch (error) {
            console.error('Error actualizando último login:', error);
        }
    }

    /**
     * Registro con email/contraseña
     */
    async registerWithEmail(email, password, displayName) {
        try {
            const userCredential = await this.auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            // Actualizar perfil
            if (displayName) {
                await user.updateProfile({ displayName: displayName });
            }
            
            // Crear documento de usuario en Firestore
            await this.db.collection('users').doc(user.uid).set({
                email: email,
                displayName: displayName || email.split('@')[0],
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                provider: 'email',
                totalExercises: 0,
                completedExercises: 0
            });
            
            return { success: true, user: user };
        } catch (error) {
            console.error('Error en registro:', error);
            let errorMessage = 'Error al crear la cuenta';
            
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'Este email ya está registrado';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'La contraseña debe tener al menos 6 caracteres';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Email inválido';
            }
            
            return { success: false, error: errorMessage };
        }
    }

    /**
     * Login con email/contraseña
     */
    async loginWithEmail(email, password) {
        try {
            const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
            return { success: true, user: userCredential.user };
        } catch (error) {
            console.error('Error en login:', error);
            let errorMessage = 'Error al iniciar sesión';
            
            if (error.code === 'auth/user-not-found') {
                errorMessage = 'Usuario no encontrado';
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = 'Contraseña incorrecta';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Email inválido';
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage = 'Demasiados intentos. Intenta más tarde';
            }
            
            return { success: false, error: errorMessage };
        }
    }

    /**
     * Login con Google
     */
    async loginWithGoogle() {
        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            provider.setCustomParameters({
                prompt: 'select_account'
            });
            
            const result = await this.auth.signInWithPopup(provider);
            
            // Guardar/actualizar datos del usuario en Firestore
            await this.db.collection('users').doc(result.user.uid).set({
                email: result.user.email,
                displayName: result.user.displayName,
                photoURL: result.user.photoURL,
                provider: 'google',
                lastLogin: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
            
            return { success: true, user: result.user };
        } catch (error) {
            console.error('Error en login con Google:', error);
            let errorMessage = 'Error al iniciar sesión con Google';
            
            if (error.code === 'auth/popup-closed-by-user') {
                errorMessage = 'Popup cerrado. Intenta de nuevo';
            } else if (error.code === 'auth/popup-blocked') {
                errorMessage = 'Popup bloqueado. Permite popups en tu navegador';
            } else if (error.code === 'auth/cancelled-popup-request') {
                errorMessage = 'Operación cancelada';
            }
            
            return { success: false, error: errorMessage };
        }
    }

    /**
     * Login con Facebook
     */
    async loginWithFacebook() {
        try {
            const provider = new firebase.auth.FacebookAuthProvider();
            const result = await this.auth.signInWithPopup(provider);
            
            // Guardar/actualizar datos del usuario en Firestore
            await this.db.collection('users').doc(result.user.uid).set({
                email: result.user.email,
                displayName: result.user.displayName,
                photoURL: result.user.photoURL,
                provider: 'facebook',
                lastLogin: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
            
            return { success: true, user: result.user };
        } catch (error) {
            console.error('Error en login con Facebook:', error);
            let errorMessage = 'Error al iniciar sesión con Facebook';
            
            if (error.code === 'auth/popup-closed-by-user') {
                errorMessage = 'Popup cerrado. Intenta de nuevo';
            } else if (error.code === 'auth/popup-blocked') {
                errorMessage = 'Popup bloqueado. Permite popups en tu navegador';
            } else if (error.code === 'auth/account-exists-with-different-credential') {
                errorMessage = 'Ya existe una cuenta con este email usando otro método';
            }
            
            return { success: false, error: errorMessage };
        }
    }

    /**
     * Cerrar sesión
     */
    async logout() {
        try {
            await this.auth.signOut();
            this.currentUser = null;
            return { success: true };
        } catch (error) {
            console.error('Error cerrando sesión:', error);
            return { success: false, error: 'Error al cerrar sesión' };
        }
    }

    /**
     * Obtener usuario actual
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * Verificar si está autenticado
     */
    isAuthenticated() {
        return this.currentUser !== null;
    }

    /**
     * Registrar intento de ejercicio
     */
    async recordAttempt(exerciseId, selectedOption, isCorrect, timeSpent, area, nivel) {
        if (!this.isAuthenticated()) {
            console.warn('Usuario no autenticado, no se guarda el intento');
            return { success: false, error: 'No autenticado' };
        }
        
        try {
            const attemptData = {
                userId: this.currentUser.uid,
                exerciseId: exerciseId,
                selectedOption: selectedOption,
                isCorrect: isCorrect,
                timeSpent: timeSpent || 0,
                area: area,
                nivel: nivel,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            };
            
            // Guardar intento
            await this.db.collection('exercise_attempts').add(attemptData);
            
            // Actualizar progreso del usuario
            await this.updateUserProgress(area, nivel, isCorrect);
            
            return { success: true };
        } catch (error) {
            console.error('Error registrando intento:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Actualizar progreso del usuario
     */
    async updateUserProgress(area, nivel, isCorrect) {
        if (!this.isAuthenticated()) return;
        
        try {
            const userRef = this.db.collection('users').doc(this.currentUser.uid);
            const progressRef = this.db.collection('user_progress').doc(this.currentUser.uid);
            
            // Actualizar contador de ejercicios del usuario
            await userRef.update({
                totalExercises: firebase.firestore.FieldValue.increment(1),
                completedExercises: firebase.firestore.FieldValue.increment(isCorrect ? 1 : 0),
                lastActivity: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            // Actualizar progreso por área/nivel
            const progressDoc = await progressRef.get();
            const currentProgress = progressDoc.exists ? progressDoc.data() : {};
            
            const areaKey = `${area}_${nivel}`;
            const areaProgress = currentProgress[areaKey] || { attempts: 0, correct: 0 };
            
            areaProgress.attempts += 1;
            if (isCorrect) areaProgress.correct += 1;
            areaProgress.successRate = (areaProgress.correct / areaProgress.attempts * 100).toFixed(1);
            
            await progressRef.set({
                ...currentProgress,
                [areaKey]: areaProgress,
                lastUpdate: firebase.firestore.FieldValue.serverTimestamp()
            });
            
        } catch (error) {
            console.error('Error actualizando progreso:', error);
        }
    }

    /**
     * Obtener progreso del usuario
     */
    async getMyProgress() {
        if (!this.isAuthenticated()) return null;
        
        try {
            // Obtener datos del usuario
            const userDoc = await this.db.collection('users').doc(this.currentUser.uid).get();
            const userData = userDoc.exists ? userDoc.data() : {};
            
            // Obtener progreso por área
            const progressDoc = await this.db.collection('user_progress').doc(this.currentUser.uid).get();
            const progressData = progressDoc.exists ? progressDoc.data() : {};
            
            // Obtener ejercicios completados (últimos intentos correctos)
            const attemptsSnapshot = await this.db.collection('exercise_attempts')
                .where('userId', '==', this.currentUser.uid)
                .where('isCorrect', '==', true)
                .get();
            
            const completedExercises = new Set();
            attemptsSnapshot.docs.forEach(doc => {
                completedExercises.add(doc.data().exerciseId);
            });
            
            // Obtener ejercicios fallados (últimos intentos incorrectos)
            const failedSnapshot = await this.db.collection('exercise_attempts')
                .where('userId', '==', this.currentUser.uid)
                .where('isCorrect', '==', false)
                .orderBy('timestamp', 'desc')
                .get();
            
            const failedExercises = new Map();
            failedSnapshot.docs.forEach(doc => {
                const data = doc.data();
                if (!completedExercises.has(data.exerciseId)) {
                    if (!failedExercises.has(data.exerciseId)) {
                        failedExercises.set(data.exerciseId, {
                            selectedOption: data.selectedOption,
                            date: data.timestamp
                        });
                    }
                }
            });
            
            return {
                userData: userData,
                progressByArea: progressData,
                completedExercises: Array.from(completedExercises),
                failedExercises: Array.from(failedExercises.entries()).map(([id, data]) => ({
                    exercise_id: id,
                    selected_option: data.selectedOption,
                    attempted_at: data.date
                })),
                totalCompleted: completedExercises.size
            };
            
        } catch (error) {
            console.error('Error obteniendo progreso:', error);
            return null;
        }
    }

    /**
     * Obtener historial de intentos
     */
    async getHistory(limit = 50) {
        if (!this.isAuthenticated()) return [];
        
        try {
            const snapshot = await this.db.collection('exercise_attempts')
                .where('userId', '==', this.currentUser.uid)
                .orderBy('timestamp', 'desc')
                .limit(limit)
                .get();
            
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error obteniendo historial:', error);
            return [];
        }
    }

    /**
     * Obtener leaderboard (ranking)
     */
    async getLeaderboard(limit = 10) {
        try {
            const snapshot = await this.db.collection('users')
                .orderBy('completedExercises', 'desc')
                .limit(limit)
                .get();
            
            const leaderboard = [];
            snapshot.docs.forEach((doc, index) => {
                const data = doc.data();
                leaderboard.push({
                    position: index + 1,
                    userId: doc.id,
                    displayName: data.displayName || data.email?.split('@')[0] || 'Usuario',
                    completedExercises: data.completedExercises || 0,
                    totalExercises: data.totalExercises || 0,
                    successRate: data.totalExercises > 0 
                        ? ((data.completedExercises / data.totalExercises) * 100).toFixed(1)
                        : 0,
                    photoURL: data.photoURL || null
                });
            });
            
            return leaderboard;
        } catch (error) {
            console.error('Error obteniendo leaderboard:', error);
            return [];
        }
    }

    /**
     * Obtener estadísticas comparativas
     */
    async getComparison() {
        if (!this.isAuthenticated()) return null;
        
        try {
            const myProgress = await this.getMyProgress();
            const leaderboard = await this.getLeaderboard(100);
            
            // Encontrar mi posición en el ranking
            const myPosition = leaderboard.findIndex(entry => entry.userId === this.currentUser.uid) + 1;
            
            // Calcular promedios globales por área
            const allProgressSnapshot = await this.db.collection('user_progress').get();
            const globalStats = {};
            
            allProgressSnapshot.docs.forEach(doc => {
                const data = doc.data();
                Object.keys(data).forEach(key => {
                    if (key.includes('_') && data[key].successRate !== undefined) {
                        if (!globalStats[key]) {
                            globalStats[key] = { totalRate: 0, count: 0 };
                        }
                        globalStats[key].totalRate += parseFloat(data[key].successRate);
                        globalStats[key].count += 1;
                    }
                });
            });
            
            // Calcular promedios
            Object.keys(globalStats).forEach(key => {
                globalStats[key].avgSuccessRate = 
                    (globalStats[key].totalRate / globalStats[key].count).toFixed(1);
            });
            
            return {
                userStats: myProgress?.progressByArea || {},
                globalStats: globalStats,
                ranking: myPosition || 999
            };
            
        } catch (error) {
            console.error('Error obteniendo comparación:', error);
            return null;
        }
    }
}

// Crear instancia global
window.firebaseAuthService = new FirebaseAuthService();
console.log('✅ Servicio de autenticación Firebase listo');
