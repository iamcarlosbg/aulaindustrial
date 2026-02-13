// auth.js - Sistema de autenticación con Firebase Authentication REAL

// Variables globales de Firebase (se cargan desde app.html)
let auth;
let db;

// Inicializar Firebase Auth y Firestore cuando estén disponibles
function initializeFirebaseAuth() {
    if (window.firebaseAuth && window.firebaseDB) {
        auth = window.firebaseAuth;
        db = window.firebaseDB;
        console.log('✅ Firebase Auth y Firestore inicializados');
        
        // Listener de cambios de autenticación
        setupAuthListener();
    } else {
        console.error('❌ Firebase no está inicializado');
    }
}

// Listener para cambios de estado de autenticación
function setupAuthListener() {
    const { onAuthStateChanged } = window.firebaseModules.auth;
    
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            console.log('👤 Usuario autenticado:', user.email);
            // Cargar o crear perfil del usuario
            await loadOrCreateUserProfile(user);
        } else {
            console.log('👋 Usuario no autenticado');
            window.currentUser = null;
        }
    });
}

// Cargar o crear perfil del usuario en Firestore
async function loadOrCreateUserProfile(firebaseUser) {
    const { doc, getDoc, setDoc, serverTimestamp } = window.firebaseModules.firestore;
    
    try {
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
            // Usuario existe, cargar datos
            const userData = userDoc.data();
            window.currentUser = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                name: userData.name || firebaseUser.displayName || 'Usuario',
                newsletter: userData.newsletter || false,
                registeredAt: userData.registeredAt || firebaseUser.metadata.creationTime,
                progress: userData.progress || {
                    completedExercises: [],
                    totalAttempts: 0,
                    correctAttempts: 0,
                    totalTime: 0,
                    lastAccess: new Date().toISOString()
                }
            };
            console.log('📄 Perfil cargado desde Firestore');
        } else {
            // Usuario nuevo, crear perfil
            const newUserData = {
                name: firebaseUser.displayName || 'Usuario',
                email: firebaseUser.email,
                newsletter: false,
                registeredAt: firebaseUser.metadata.creationTime,
                progress: {
                    completedExercises: [],
                    totalAttempts: 0,
                    correctAttempts: 0,
                    totalTime: 0,
                    lastAccess: new Date().toISOString()
                },
                createdAt: serverTimestamp()
            };
            
            await setDoc(userRef, newUserData);
            
            window.currentUser = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                name: newUserData.name,
                newsletter: newUserData.newsletter,
                registeredAt: newUserData.registeredAt,
                progress: newUserData.progress
            };
            
            console.log('✨ Nuevo perfil creado en Firestore');
        }
        
        // Actualizar UI si existe la función
        if (typeof updateUserHeader === 'function') {
            updateUserHeader();
        }
        
    } catch (error) {
        console.error('❌ Error al cargar perfil:', error);
    }
}

// Registrar nuevo usuario
async function register(name, email, password) {
    const { createUserWithEmailAndPassword, updateProfile } = window.firebaseModules.auth;
    
    try {
        // Crear usuario en Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Actualizar nombre del usuario
        await updateProfile(user, {
            displayName: name
        });
        
        console.log('✅ Usuario registrado:', email);
        return { success: true };
        
    } catch (error) {
        console.error('❌ Error en registro:', error);
        
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

// Iniciar sesión
async function login(email, password) {
    const { signInWithEmailAndPassword } = window.firebaseModules.auth;
    
    try {
        await signInWithEmailAndPassword(auth, email, password);
        console.log('✅ Login exitoso:', email);
        return { success: true };
        
    } catch (error) {
        console.error('❌ Error en login:', error);
        
        let errorMessage = 'Error al iniciar sesión';
        if (error.code === 'auth/user-not-found') {
            errorMessage = 'No existe una cuenta con este email';
        } else if (error.code === 'auth/wrong-password') {
            errorMessage = 'Contraseña incorrecta';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Email inválido';
        } else if (error.code === 'auth/invalid-credential') {
            errorMessage = 'Email o contraseña incorrectos';
        }
        
        return { success: false, error: errorMessage };
    }
}

// Cerrar sesión
async function logout() {
    const { signOut } = window.firebaseModules.auth;
    
    try {
        await signOut(auth);
        window.currentUser = null;
        console.log('👋 Sesión cerrada');
        return true;
    } catch (error) {
        console.error('❌ Error al cerrar sesión:', error);
        return false;
    }
}

// Obtener usuario actual
function getCurrentUser() {
    return window.currentUser || null;
}

// Actualizar perfil del usuario en Firestore
async function updateUserProfile(updates) {
    if (!window.currentUser) {
        console.error('No hay usuario autenticado');
        return false;
    }
    
    const { doc, updateDoc } = window.firebaseModules.firestore;
    
    try {
        const userRef = doc(db, 'users', window.currentUser.uid);
        await updateDoc(userRef, updates);
        
        // Actualizar también en currentUser local
        Object.assign(window.currentUser, updates);
        
        console.log('✅ Perfil actualizado');
        return true;
    } catch (error) {
        console.error('❌ Error al actualizar perfil:', error);
        return false;
    }
}

// Actualizar progreso del usuario
async function updateUserProgress(progressData) {
    if (!window.currentUser) {
        console.error('No hay usuario autenticado');
        return false;
    }
    
    const { doc, updateDoc } = window.firebaseModules.firestore;
    
    try {
        const userRef = doc(db, 'users', window.currentUser.uid);
        await updateDoc(userRef, {
            progress: progressData
        });
        
        // Actualizar también en currentUser local
        window.currentUser.progress = progressData;
        
        console.log('✅ Progreso actualizado en Firestore');
        return true;
    } catch (error) {
        console.error('❌ Error al actualizar progreso:', error);
        return false;
    }
}

// Recuperar contraseña
async function resetPassword(email) {
    const { sendPasswordResetEmail } = window.firebaseModules.auth;
    
    try {
        await sendPasswordResetEmail(auth, email);
        console.log('📧 Email de recuperación enviado');
        return { success: true };
    } catch (error) {
        console.error('❌ Error al enviar email:', error);
        
        let errorMessage = 'Error al enviar email de recuperación';
        if (error.code === 'auth/user-not-found') {
            errorMessage = 'No existe una cuenta con este email';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Email inválido';
        }
        
        return { success: false, error: errorMessage };
    }
}

// Cambiar contraseña
async function changePassword(currentPassword, newPassword) {
    const { updatePassword, EmailAuthProvider, reauthenticateWithCredential } = window.firebaseModules.auth;
    
    if (!auth.currentUser) {
        return { success: false, error: 'No hay usuario autenticado' };
    }
    
    try {
        // Reautenticar al usuario
        const credential = EmailAuthProvider.credential(
            auth.currentUser.email,
            currentPassword
        );
        await reauthenticateWithCredential(auth.currentUser, credential);
        
        // Cambiar contraseña
        await updatePassword(auth.currentUser, newPassword);
        
        console.log('✅ Contraseña actualizada');
        return { success: true };
        
    } catch (error) {
        console.error('❌ Error al cambiar contraseña:', error);
        
        let errorMessage = 'Error al cambiar contraseña';
        if (error.code === 'auth/wrong-password') {
            errorMessage = 'Contraseña actual incorrecta';
        } else if (error.code === 'auth/weak-password') {
            errorMessage = 'La nueva contraseña debe tener al menos 6 caracteres';
        }
        
        return { success: false, error: errorMessage };
    }
}

// Login con Google
async function loginWithGoogle() {
    const { GoogleAuthProvider, signInWithPopup } = window.firebaseModules.auth;
    
    try {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
        console.log('✅ Login con Google exitoso');
        return { success: true };
    } catch (error) {
        console.error('❌ Error en login con Google:', error);
        
        let errorMessage = 'Error al iniciar sesión con Google';
        if (error.code === 'auth/popup-closed-by-user') {
            errorMessage = 'Ventana de login cerrada';
        }
        
        return { success: false, error: errorMessage };
    }
}

// Inicializar cuando el DOM esté listo
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        // Esperar a que Firebase esté inicializado
        setTimeout(initializeFirebaseAuth, 500);
    });
}

console.log('🔥 auth.js cargado - Firebase Authentication Real');
