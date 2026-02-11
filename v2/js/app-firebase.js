/**
 * APP.JS V2 - Controlador principal con sistema de usuarios
 * Gestiona la interfaz, navegación y sincronización con backend
 */

class IndustrainApp {
    constructor() {
        this.currentArea = 'all';
        this.currentLevel = 'all';
        this.currentStatus = 'all'; // Nuevo filtro de estado
        this.currentExercise = null;
        this.selectedOption = null;
        this.completedExercises = new Set();
        this.failedExercises = new Map(); // Map de exercise_id -> {selectedOption, date}
        this.exerciseStartTime = null;
        this.userProgress = null;
        
        // Cargar estado guardado (local si no hay sesión)
        this.loadProgress();
    }

    /**
     * Inicializa la aplicación
     */
    async init() {
        // Verificar si hay sesión activa
        await this.checkUserSession();
        
        // Cargar ejercicios
        await window.exerciseLoader.loadAllExercises();
        
        // Renderizar interfaz
        this.renderAreas();
        this.renderExercises();
        this.updateStats();
        
        // Configurar event listeners
        this.setupEventListeners();
        
        console.log('✅ Aula Industrial inicializada correctamente');
    }

    /**
     * Verifica si hay una sesión de usuario activa
     */
    async checkUserSession() {
        try {
            const user = await window.firebaseAuthService.getCurrentUser();
            if (user) {
                this.showUserInfo(user);
                await this.loadServerProgress();
            } else {
                this.showLoginButton();
            }
        } catch (error) {
            console.log('Sin sesión activa, modo invitado');
            this.showLoginButton();
        }
    }

    /**
     * Carga el progreso desde el servidor
     */
    async loadServerProgress() {
        try {
            const progress = await window.firebaseAuthService.getMyProgress();
            
            // Actualizar ejercicios completados
            this.completedExercises = new Set(progress.completedExercises);
            
            // Actualizar ejercicios fallados
            this.failedExercises.clear();
            progress.failedExercises.forEach(fail => {
                this.failedExercises.set(fail.exercise_id, {
                    selectedOption: fail.selected_option,
                    date: fail.attempted_at
                });
            });
            
            // Guardar progreso por área
            this.userProgress = progress.byArea;
            
            // Actualizar UI
            this.updateStats();
            this.renderExercises();
            
        } catch (error) {
            console.error('Error cargando progreso del servidor:', error);
        }
    }

    /**
     * Muestra información del usuario en el header
     */
    showUserInfo(user) {
        const headerRight = document.querySelector('.status-panel');
        const existingUser = document.getElementById('user-info');
        
        if (existingUser) {
            existingUser.remove();
        }
        
        const userInfo = document.createElement('div');
        userInfo.id = 'user-info';
        userInfo.style.cssText = `
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 0.5rem 1rem;
            background: rgba(0, 212, 255, 0.1);
            border-radius: 8px;
            border: 1px solid var(--accent-primary);
        `;
        
        userInfo.innerHTML = `
            <div style="text-align: right;">
                <div style="font-size: 0.75rem; color: var(--text-muted);">Usuario</div>
                <div style="font-size: 0.9rem; font-weight: 600; color: var(--accent-primary);">${user.username}</div>
            </div>
            <button id="profile-btn" style="
                background: transparent;
                border: 1px solid var(--accent-primary);
                color: var(--accent-primary);
                padding: 0.5rem 1rem;
                border-radius: 6px;
                cursor: pointer;
                font-family: var(--font-mono);
                font-size: 0.8rem;
            ">MI PERFIL</button>
            <button id="logout-btn" style="
                background: var(--accent-danger);
                border: none;
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 6px;
                cursor: pointer;
                font-family: var(--font-mono);
                font-size: 0.8rem;
            ">SALIR</button>
        `;
        
        headerRight.appendChild(userInfo);
        
        // Event listeners
        document.getElementById('profile-btn').addEventListener('click', () => this.showProfile());
        document.getElementById('logout-btn').addEventListener('click', () => this.logout());
    }

    /**
     * Muestra botón de login
     */
    showLoginButton() {
        const headerRight = document.querySelector('.status-panel');
        const existingBtn = document.getElementById('login-btn');
        
        if (existingBtn) return;
        
        const loginBtn = document.createElement('button');
        loginBtn.id = 'login-btn';
        loginBtn.textContent = 'INICIAR SESIÓN';
        loginBtn.style.cssText = `
            background: var(--accent-primary);
            border: none;
            color: var(--primary-bg);
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            cursor: pointer;
            font-family: var(--font-display);
            font-weight: 700;
            font-size: 0.9rem;
            letter-spacing: 1px;
        `;
        
        loginBtn.addEventListener('click', () => this.showLoginModal());
        headerRight.appendChild(loginBtn);
    }

    /**
     * Muestra modal de login/registro
     */
    showLoginModal() {
        const modal = document.createElement('div');
        modal.id = 'auth-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(5px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
        `;
        
        modal.innerHTML = `
            <div style="
                background: var(--secondary-bg);
                border-radius: 16px;
                padding: 3rem;
                max-width: 500px;
                width: 90%;
                border: 2px solid var(--accent-primary);
                box-shadow: var(--shadow-lg), var(--glow-primary);
            ">
                <h2 style="
                    font-family: var(--font-display);
                    color: var(--accent-primary);
                    margin-bottom: 2rem;
                    text-align: center;
                    font-size: 2rem;
                ">ACCESO AL SISTEMA</h2>
                
                <div id="auth-tabs" style="
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 2rem;
                ">
                    <button class="auth-tab active" data-tab="login">INICIAR SESIÓN</button>
                    <button class="auth-tab" data-tab="register">REGISTRARSE</button>
                </div>
                
                <!-- Formulario Login -->
                <form id="login-form" style="display: block;">
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.9rem;">Usuario</label>
                        <input type="text" id="login-username" required style="
                            width: 100%;
                            padding: 0.75rem;
                            background: var(--tertiary-bg);
                            border: 1px solid var(--border-color);
                            border-radius: 8px;
                            color: var(--text-primary);
                            font-family: var(--font-mono);
                            font-size: 1rem;
                        ">
                    </div>
                    
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.9rem;">Contraseña</label>
                        <input type="password" id="login-password" required style="
                            width: 100%;
                            padding: 0.75rem;
                            background: var(--tertiary-bg);
                            border: 1px solid var(--border-color);
                            border-radius: 8px;
                            color: var(--text-primary);
                            font-family: var(--font-mono);
                            font-size: 1rem;
                        ">
                    </div>
                    
                    <button type="submit" class="btn-primary" style="width: 100%; padding: 1rem; font-size: 1.1rem;">
                        ENTRAR
                    </button>
                </form>
                
                <!-- Formulario Registro -->
                <form id="register-form" style="display: none;">
                    <div style="margin-bottom: 1rem;">
                        <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.9rem;">Nombre Completo</label>
                        <input type="text" id="register-fullname" style="
                            width: 100%;
                            padding: 0.75rem;
                            background: var(--tertiary-bg);
                            border: 1px solid var(--border-color);
                            border-radius: 8px;
                            color: var(--text-primary);
                            font-family: var(--font-mono);
                            font-size: 1rem;
                        ">
                    </div>
                    
                    <div style="margin-bottom: 1rem;">
                        <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.9rem;">Usuario *</label>
                        <input type="text" id="register-username" required style="
                            width: 100%;
                            padding: 0.75rem;
                            background: var(--tertiary-bg);
                            border: 1px solid var(--border-color);
                            border-radius: 8px;
                            color: var(--text-primary);
                            font-family: var(--font-mono);
                            font-size: 1rem;
                        ">
                    </div>
                    
                    <div style="margin-bottom: 1rem;">
                        <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.9rem;">Email *</label>
                        <input type="email" id="register-email" required style="
                            width: 100%;
                            padding: 0.75rem;
                            background: var(--tertiary-bg);
                            border: 1px solid var(--border-color);
                            border-radius: 8px;
                            color: var(--text-primary);
                            font-family: var(--font-mono);
                            font-size: 1rem;
                        ">
                    </div>
                    
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.9rem;">Contraseña * (mín. 6 caracteres)</label>
                        <input type="password" id="register-password" required minlength="6" style="
                            width: 100%;
                            padding: 0.75rem;
                            background: var(--tertiary-bg);
                            border: 1px solid var(--border-color);
                            border-radius: 8px;
                            color: var(--text-primary);
                            font-family: var(--font-mono);
                            font-size: 1rem;
                        ">
                    </div>
                    
                    <button type="submit" class="btn-primary" style="width: 100%; padding: 1rem; font-size: 1.1rem;">
                        CREAR CUENTA
                    </button>
                </form>
                
                <div id="auth-message" style="
                    margin-top: 1rem;
                    padding: 1rem;
                    border-radius: 8px;
                    display: none;
                    text-align: center;
                "></div>
                
                <button id="close-auth-modal" style="
                    margin-top: 1.5rem;
                    width: 100%;
                    padding: 0.75rem;
                    background: var(--tertiary-bg);
                    border: 1px solid var(--border-color);
                    color: var(--text-secondary);
                    border-radius: 8px;
                    cursor: pointer;
                    font-family: var(--font-mono);
                ">CANCELAR</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Estilos para tabs
        const style = document.createElement('style');
        style.textContent = `
            .auth-tab {
                flex: 1;
                padding: 0.75rem;
                background: var(--tertiary-bg);
                border: 1px solid var(--border-color);
                color: var(--text-secondary);
                border-radius: 8px;
                cursor: pointer;
                font-family: var(--font-display);
                font-weight: 600;
                transition: all 0.3s ease;
            }
            .auth-tab.active {
                background: var(--accent-primary);
                color: var(--primary-bg);
                border-color: var(--accent-primary);
            }
            .auth-tab:hover:not(.active) {
                border-color: var(--accent-primary);
                color: var(--accent-primary);
            }
        `;
        document.head.appendChild(style);
        
        // Event listeners para tabs
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabType = e.target.dataset.tab;
                
                document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                
                document.getElementById('login-form').style.display = tabType === 'login' ? 'block' : 'none';
                document.getElementById('register-form').style.display = tabType === 'register' ? 'block' : 'none';
            });
        });
        
        // Login
        document.getElementById('login-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleLogin();
        });
        
        // Registro
        document.getElementById('register-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleRegister();
        });
        
        // Cerrar modal
        document.getElementById('close-auth-modal').addEventListener('click', () => {
            modal.remove();
        });
        
        // Cerrar con click fuera
        modal.addEventListener('click', (e) => {
            if (e.target.id === 'auth-modal') {
                modal.remove();
            }
        });
    }

    /**
     * Maneja el login
     */
    async handleLogin() {
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        const messageDiv = document.getElementById('auth-message');
        
        try {
            const result = await window.firebaseAuthService.login(username, password);
            
            messageDiv.style.display = 'block';
            messageDiv.style.background = 'rgba(16, 185, 129, 0.1)';
            messageDiv.style.color = 'var(--accent-success)';
            messageDiv.textContent = '✅ Login exitoso! Cargando progreso...';
            
            setTimeout(async () => {
                document.getElementById('auth-modal').remove();
                document.getElementById('login-btn')?.remove();
                this.showUserInfo(result.user);
                await this.loadServerProgress();
            }, 1000);
            
        } catch (error) {
            messageDiv.style.display = 'block';
            messageDiv.style.background = 'rgba(239, 68, 68, 0.1)';
            messageDiv.style.color = 'var(--accent-danger)';
            messageDiv.textContent = '❌ ' + (error.message || 'Error en el login');
        }
    }

    /**
     * Maneja el registro
     */
    async handleRegister() {
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const fullName = document.getElementById('register-fullname').value;
        const messageDiv = document.getElementById('auth-message');
        
        try {
            await window.firebaseAuthService.register(username, email, password, fullName);
            
            messageDiv.style.display = 'block';
            messageDiv.style.background = 'rgba(16, 185, 129, 0.1)';
            messageDiv.style.color = 'var(--accent-success)';
            messageDiv.textContent = '✅ Cuenta creada! Ahora puedes iniciar sesión';
            
            // Cambiar a tab de login
            setTimeout(() => {
                document.querySelector('.auth-tab[data-tab="login"]').click();
                document.getElementById('login-username').value = username;
                messageDiv.style.display = 'none';
            }, 2000);
            
        } catch (error) {
            messageDiv.style.display = 'block';
            messageDiv.style.background = 'rgba(239, 68, 68, 0.1)';
            messageDiv.style.color = 'var(--accent-danger)';
            messageDiv.textContent = '❌ ' + (error.message || 'Error en el registro');
        }
    }

    /**
     * Cierra sesión
     */
    async logout() {
        if (!confirm('¿Seguro que quieres cerrar sesión?')) return;
        
        try {
            await window.firebaseAuthService.logout();
            document.getElementById('user-info')?.remove();
            this.showLoginButton();
            
            // Limpiar progreso local
            this.completedExercises.clear();
            this.failedExercises.clear();
            this.updateStats();
            this.renderExercises();
            
        } catch (error) {
            console.error('Error cerrando sesión:', error);
        }
    }

    /**
     * Muestra perfil del usuario
     */
    async showProfile() {
        try {
            const [progress, comparison, leaderboard] = await Promise.all([
                window.firebaseAuthService.getMyProgress(),
                window.firebaseAuthService.getComparison(),
                window.firebaseAuthService.getLeaderboard()
            ]);
            
            this.showProfileModal(progress, comparison, leaderboard);
            
        } catch (error) {
            console.error('Error cargando perfil:', error);
        }
    }

    /**
     * Muestra modal de perfil con estadísticas
     */
    showProfileModal(progress, comparison, leaderboard) {
        const modal = document.createElement('div');
        modal.id = 'profile-modal';
        modal.className = 'modal-overlay';
        modal.style.display = 'flex';
        
        const user = window.firebaseAuthService.getCurrentUser();
        
        // Calcular estadísticas
        const totalCompleted = progress.totalCompleted;
        const totalExercises = 20; // Actualizar si cambia
        const completionRate = ((totalCompleted / totalExercises) * 100).toFixed(1);
        
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 900px; width: 95%;">
                <div class="modal-header" style="background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), transparent);">
                    <h2 style="font-family: var(--font-display); font-size: 2rem; color: var(--accent-primary);">
                        👤 PERFIL DE USUARIO
                    </h2>
                    <p style="color: var(--text-secondary); margin-top: 0.5rem;">
                        ${user.fullName || user.username} • ${user.email}
                    </p>
                </div>
                
                <div class="modal-body" style="max-height: 70vh; overflow-y: auto;">
                    <!-- Estadísticas Generales -->
                    <div style="
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                        gap: 1rem;
                        margin-bottom: 2rem;
                    ">
                        <div style="background: var(--tertiary-bg); padding: 1.5rem; border-radius: 12px; text-align: center;">
                            <div style="font-size: 2.5rem; color: var(--accent-success); font-weight: 700;">${totalCompleted}</div>
                            <div style="color: var(--text-secondary); font-size: 0.9rem;">Ejercicios Completados</div>
                        </div>
                        
                        <div style="background: var(--tertiary-bg); padding: 1.5rem; border-radius: 12px; text-align: center;">
                            <div style="font-size: 2.5rem; color: var(--accent-primary); font-weight: 700;">${completionRate}%</div>
                            <div style="color: var(--text-secondary); font-size: 0.9rem;">Tasa de Finalización</div>
                        </div>
                        
                        <div style="background: var(--tertiary-bg); padding: 1.5rem; border-radius: 12px; text-align: center;">
                            <div style="font-size: 2.5rem; color: var(--accent-warning); font-weight: 700;">#${comparison.ranking}</div>
                            <div style="color: var(--text-secondary); font-size: 0.9rem;">Posición en Ranking</div>
                        </div>
                    </div>
                    
                    <!-- Progreso por Área -->
                    <h3 style="color: var(--accent-primary); margin-bottom: 1rem; font-family: var(--font-display);">
                        📊 PROGRESO POR ÁREA
                    </h3>
                    <div style="background: var(--tertiary-bg); padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem;">
                        ${this.renderProgressByArea(comparison.userStats, comparison.globalStats)}
                    </div>
                    
                    <!-- Ejercicios Fallados -->
                    ${progress.failedExercises.length > 0 ? `
                        <h3 style="color: var(--accent-danger); margin-bottom: 1rem; font-family: var(--font-display);">
                            ❌ EJERCICIOS A REPASAR
                        </h3>
                        <div style="background: rgba(239, 68, 68, 0.1); padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem; border: 1px solid var(--accent-danger);">
                            ${this.renderFailedExercises(progress.failedExercises)}
                        </div>
                    ` : ''}
                    
                    <!-- Leaderboard -->
                    <h3 style="color: var(--accent-warning); margin-bottom: 1rem; font-family: var(--font-display);">
                        🏆 TOP 10 USUARIOS
                    </h3>
                    <div style="background: var(--tertiary-bg); padding: 1.5rem; border-radius: 12px;">
                        ${this.renderLeaderboard(leaderboard.leaderboard, user.username)}
                    </div>
                </div>
                
                <div class="modal-footer">
                    <button class="btn-primary" id="close-profile-btn">CERRAR</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        document.getElementById('close-profile-btn').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target.id === 'profile-modal') {
                modal.remove();
            }
        });
    }

    /**
     * Renderiza progreso por área con comparativa
     */
    renderProgressByArea(userStats, globalStats) {
        const areas = ['Electricidad Básica', 'Maniobra y Potencia', 'PLC Siemens', 'Diagnóstico Industrial'];
        const niveles = ['básico', 'intermedio', 'avanzado'];
        
        let html = '<div style="display: grid; gap: 1rem;">';
        
        areas.forEach(area => {
            html += `<div style="margin-bottom: 1rem;">`;
            html += `<h4 style="color: var(--text-primary); margin-bottom: 0.5rem;">${area}</h4>`;
            
            niveles.forEach(nivel => {
                const userStat = userStats.find(s => s.area === area && s.nivel === nivel);
                const globalStat = globalStats.find(s => s.area === area && s.nivel === nivel);
                
                const userRate = userStat ? userStat.success_rate : 0;
                const avgRate = globalStat ? globalStat.avg_success_rate : 0;
                
                const comparison = userRate - avgRate;
                const comparisonText = comparison > 0 ? 
                    `+${comparison.toFixed(1)}% vs promedio` : 
                    `${comparison.toFixed(1)}% vs promedio`;
                const comparisonColor = comparison > 0 ? 'var(--accent-success)' : 'var(--accent-danger)';
                
                html += `
                    <div style="margin-bottom: 0.75rem;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem; font-size: 0.85rem;">
                            <span style="color: var(--text-secondary); text-transform: capitalize;">${nivel}</span>
                            <span style="color: var(--text-primary);">
                                ${userRate.toFixed(1)}% 
                                <span style="color: ${comparisonColor}; font-size: 0.75rem;">(${comparisonText})</span>
                            </span>
                        </div>
                        <div style="background: var(--surface-bg); height: 8px; border-radius: 4px; overflow: hidden;">
                            <div style="
                                background: linear-gradient(90deg, var(--accent-primary), var(--accent-success));
                                width: ${userRate}%;
                                height: 100%;
                                transition: width 0.3s ease;
                            "></div>
                        </div>
                    </div>
                `;
            });
            
            html += `</div>`;
        });
        
        html += '</div>';
        return html;
    }

    /**
     * Renderiza ejercicios fallados
     */
    renderFailedExercises(failedExercises) {
        let html = '<div style="display: grid; gap: 0.75rem;">';
        
        failedExercises.forEach(fail => {
            const exercise = window.exerciseLoader.getExerciseById(fail.exercise_id);
            if (!exercise) return;
            
            html += `
                <div style="
                    background: var(--tertiary-bg);
                    padding: 1rem;
                    border-radius: 8px;
                    border-left: 3px solid var(--accent-danger);
                ">
                    <div style="display: flex; justify-content: space-between; align-items: start;">
                        <div style="flex: 1;">
                            <div style="font-weight: 600; color: var(--text-primary); margin-bottom: 0.25rem;">
                                ${exercise.titulo}
                            </div>
                            <div style="font-size: 0.8rem; color: var(--text-secondary);">
                                ${exercise.area} • ${exercise.nivel}
                            </div>
                            <div style="font-size: 0.75rem; color: var(--accent-danger); margin-top: 0.5rem;">
                                Tu respuesta: ${exercise.opciones[fail.selected_option]}
                            </div>
                        </div>
                        <button 
                            class="retry-exercise-btn"
                            data-exercise-id="${fail.exercise_id}"
                            style="
                                background: var(--accent-primary);
                                border: none;
                                color: var(--primary-bg);
                                padding: 0.5rem 1rem;
                                border-radius: 6px;
                                cursor: pointer;
                                font-size: 0.8rem;
                                font-weight: 600;
                            "
                        >REINTENTAR</button>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        
        // Añadir event listeners después de renderizar
        setTimeout(() => {
            document.querySelectorAll('.retry-exercise-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const exerciseId = e.target.dataset.exerciseId;
                    document.getElementById('profile-modal').remove();
                    this.startExercise(exerciseId);
                });
            });
        }, 100);
        
        return html;
    }

    /**
     * Renderiza leaderboard
     */
    renderLeaderboard(leaderboard, currentUsername) {
        let html = '<div style="display: grid; gap: 0.5rem;">';
        
        leaderboard.forEach((entry, index) => {
            const isCurrentUser = entry.username === currentUsername;
            const medalEmoji = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
            
            html += `
                <div style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0.75rem 1rem;
                    background: ${isCurrentUser ? 'rgba(0, 212, 255, 0.1)' : 'var(--surface-bg)'};
                    border-radius: 8px;
                    border: ${isCurrentUser ? '2px solid var(--accent-primary)' : 'none'};
                ">
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <div style="
                            font-size: 1.2rem;
                            font-weight: 700;
                            color: var(--accent-warning);
                            min-width: 40px;
                        ">${medalEmoji || `#${index + 1}`}</div>
                        <div>
                            <div style="font-weight: 600; color: var(--text-primary);">
                                ${entry.full_name || entry.username}
                                ${isCurrentUser ? '<span style="color: var(--accent-primary); margin-left: 0.5rem;">(TÚ)</span>' : ''}
                            </div>
                            <div style="font-size: 0.8rem; color: var(--text-secondary);">@${entry.username}</div>
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 1.2rem; font-weight: 700; color: var(--accent-success);">
                            ${entry.total_completed}
                        </div>
                        <div style="font-size: 0.75rem; color: var(--text-secondary);">
                            ${entry.avg_success_rate.toFixed(1)}% éxito
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        return html;
    }

    // ==========================================
    // MÉTODOS ORIGINALES MODIFICADOS
    // ==========================================

    /**
     * Renderiza las áreas en el sidebar
     */
    renderAreas() {
        const areaNav = document.getElementById('area-nav');
        const areas = window.exerciseLoader.getAreas();
        
        // Opción "Todos"
        const allOption = this.createAreaElement({
            id: 'all',
            name: 'Todos los ejercicios',
            icon: '📚',
            count: window.exerciseLoader.getAllExercises().length
        }, true);
        
        areaNav.innerHTML = '';
        areaNav.appendChild(allOption);
        
        // Áreas específicas
        areas.forEach(area => {
            const areaElement = this.createAreaElement(area);
            areaNav.appendChild(areaElement);
        });
    }

    /**
     * Crea un elemento de área
     */
    createAreaElement(area, isActive = false) {
        const div = document.createElement('div');
        div.className = `area-item ${isActive ? 'active' : ''}`;
        div.dataset.area = area.id;
        
        div.innerHTML = `
            <div class="area-icon">${area.icon}</div>
            <div class="area-info">
                <div class="area-name">${area.name}</div>
                <div class="area-count">${area.count} ejercicios</div>
            </div>
        `;
        
        div.addEventListener('click', () => this.selectArea(area.id));
        
        return div;
    }

    /**
     * Selecciona un área
     */
    selectArea(areaId) {
        this.currentArea = areaId;
        
        // Actualizar UI
        document.querySelectorAll('.area-item').forEach(item => {
            item.classList.toggle('active', item.dataset.area === areaId);
        });
        
        // Actualizar título
        const area = window.exerciseLoader.getAreas().find(a => a.id === areaId);
        const titleElement = document.getElementById('current-area-title');
        const descElement = document.getElementById('current-area-description');
        
        if (areaId === 'all') {
            titleElement.textContent = 'TODOS LOS EJERCICIOS';
            descElement.textContent = 'Situaciones industriales reales para diagnóstico y resolución';
        } else {
            titleElement.textContent = area.name.toUpperCase();
            descElement.textContent = area.description;
        }
        
        // Renderizar ejercicios filtrados
        this.renderExercises();
    }

    /**
     * Renderiza la lista de ejercicios
     */
    renderExercises() {
        const grid = document.getElementById('exercises-grid');
        let exercises = window.exerciseLoader.filter(this.currentArea, this.currentLevel);
        
        // Aplicar filtro de estado
        exercises = this.filterByStatus(exercises);
        
        // Actualizar contador
        document.getElementById('filtered-count').textContent = exercises.length;
        
        if (exercises.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-secondary);">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
                    <p>No se encontraron ejercicios con los filtros seleccionados</p>
                </div>
            `;
            return;
        }
        
        grid.innerHTML = '';
        exercises.forEach((exercise, index) => {
            const card = this.createExerciseCard(exercise, index);
            grid.appendChild(card);
        });
    }
    
    /**
     * Filtra ejercicios por estado (completados/no hechos/fallados)
     */
    filterByStatus(exercises) {
        if (this.currentStatus === 'all') {
            return exercises;
        }
        
        return exercises.filter(exercise => {
            const isCompleted = this.completedExercises.has(exercise.id);
            const isFailed = this.failedExercises.has(exercise.id);
            
            switch(this.currentStatus) {
                case 'completed':
                    return isCompleted;
                case 'failed':
                    return isFailed && !isCompleted;
                case 'not-done':
                    return !isCompleted && !isFailed;
                default:
                    return true;
            }
        });
    }

    /**
     * Crea una tarjeta de ejercicio
     */
    createExerciseCard(exercise, index) {
        const div = document.createElement('div');
        div.className = 'exercise-card';
        div.style.animationDelay = `${index * 0.05}s`;
        
        const isCompleted = this.completedExercises.has(exercise.id);
        const isFailed = this.failedExercises.has(exercise.id);
        
        let statusBadge = '';
        if (isCompleted) {
            statusBadge = '<span style="color: var(--accent-success); font-size: 1.2rem; margin-left: 0.5rem;">✓</span>';
        } else if (isFailed) {
            statusBadge = '<span style="color: var(--accent-danger); font-size: 1.2rem; margin-left: 0.5rem;">✗</span>';
        }
        
        div.innerHTML = `
            <div class="card-header">
                <span class="level-badge ${exercise.nivel}">${exercise.nivel}</span>
                <span class="area-badge">${exercise.area}</span>
            </div>
            <h3 class="card-title">${exercise.titulo}${statusBadge}</h3>
            <p class="card-context">${exercise.contexto}</p>
            <div class="card-problem">
                <strong>⚠️ Problema:</strong> ${exercise.problema}
            </div>
            <div class="card-footer">
                <div class="tech-tags">
                    ${this.getTechTags(exercise).map(tag => `<span class="tech-tag">${tag}</span>`).join('')}
                </div>
                <button class="start-btn">${isCompleted ? 'REPASAR' : isFailed ? 'REINTENTAR' : 'INICIAR'}</button>
            </div>
        `;
        
        div.querySelector('.start-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.startExercise(exercise.id);
        });
        
        return div;
    }

    /**
     * Obtiene etiquetas técnicas del ejercicio
     */
    getTechTags(exercise) {
        const tags = [];
        const data = exercise.datos_tecnicos;
        
        if (typeof data === 'object' && !Array.isArray(data)) {
            Object.keys(data).slice(0, 3).forEach(key => {
                tags.push(key);
            });
        } else if (Array.isArray(data)) {
            tags.push(...data.slice(0, 3));
        }
        
        return tags.length > 0 ? tags : ['Industrial'];
    }

    /**
     * Inicia un ejercicio
     */
    startExercise(exerciseId) {
        const exercise = window.exerciseLoader.getExerciseById(exerciseId);
        if (!exercise) return;
        
        this.currentExercise = exercise;
        this.selectedOption = null;
        this.exerciseStartTime = Date.now();
        
        // Ocultar lista, mostrar detalle
        document.getElementById('exercise-list-view').style.display = 'none';
        document.getElementById('exercise-detail-view').style.display = 'block';
        
        // Renderizar ejercicio
        this.renderExerciseDetail(exercise);
        
        // Scroll al top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /**
     * Renderiza el detalle del ejercicio
     */
    renderExerciseDetail(exercise) {
        const detailView = document.getElementById('exercise-detail-view');
        
        detailView.innerHTML = `
            <div class="exercise-detail">
                <div class="detail-header">
                    <button class="back-btn" id="back-to-list">← VOLVER A LA LISTA</button>
                    
                    <div style="margin-top: 1rem;">
                        <div class="detail-meta">
                            <span class="level-badge ${exercise.nivel}">${exercise.nivel}</span>
                            <span class="area-badge" style="font-size: 0.9rem;">${exercise.area}</span>
                        </div>
                        <h1 class="detail-title">${exercise.titulo}</h1>
                    </div>
                </div>

                <div class="scenario-section">
                    <h2 class="section-title">📋 Contexto Industrial</h2>
                    <div class="section-content">
                        ${exercise.contexto}
                    </div>
                </div>

                <div class="scenario-section" style="border-left: 3px solid var(--accent-warning);">
                    <h2 class="section-title">⚠️ Problema Detectado</h2>
                    <div class="section-content">
                        <p style="font-size: 1.1rem; color: var(--text-primary); font-weight: 500;">
                            ${exercise.problema}
                        </p>
                    </div>
                </div>

                <div class="scenario-section">
                    <h2 class="section-title">🔧 Datos Técnicos</h2>
                    <div class="tech-data">
                        ${this.formatTechnicalData(exercise.datos_tecnicos)}
                    </div>
                </div>

                <div class="options-section">
                    <h2 class="section-title">💡 Diagnóstico - Selecciona la causa más probable</h2>
                    <div id="options-container">
                        ${exercise.opciones.map((option, index) => `
                            <div class="option-card" data-option="${index}">
                                <span class="option-number">${String.fromCharCode(65 + index)}</span>
                                <span>${option}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <button class="submit-btn" id="submit-answer" disabled>
                    VERIFICAR DIAGNÓSTICO
                </button>
            </div>
        `;
        
        // Event listeners
        document.getElementById('back-to-list').addEventListener('click', () => this.backToList());
        document.getElementById('submit-answer').addEventListener('click', () => this.submitAnswer());
        
        document.querySelectorAll('.option-card').forEach(card => {
            card.addEventListener('click', () => this.selectOption(card));
        });
    }

    /**
     * Formatea los datos técnicos
     */
    formatTechnicalData(data) {
        if (typeof data === 'object' && !Array.isArray(data)) {
            const items = Object.entries(data).map(([key, value]) => 
                `<li><strong>${key}:</strong> ${value}</li>`
            ).join('');
            return `<ul>${items}</ul>`;
        } else if (Array.isArray(data)) {
            return `<ul>${data.map(item => `<li>${item}</li>`).join('')}</ul>`;
        } else {
            return `<p>${data}</p>`;
        }
    }

    /**
     * Selecciona una opción
     */
    selectOption(card) {
        // Deseleccionar todas
        document.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
        
        // Seleccionar la actual
        card.classList.add('selected');
        this.selectedOption = parseInt(card.dataset.option);
        
        // Habilitar botón
        document.getElementById('submit-answer').disabled = false;
    }

    /**
     * Envía la respuesta
     */
    async submitAnswer() {
        if (this.selectedOption === null) return;
        
        const exercise = this.currentExercise;
        const isCorrect = this.selectedOption === exercise.respuesta_correcta;
        
        // Calcular tiempo empleado
        const timeSpent = this.exerciseStartTime ? 
            Math.floor((Date.now() - this.exerciseStartTime) / 1000) : null;
        
        // Marcar visualmente
        document.querySelectorAll('.option-card').forEach((card, index) => {
            if (index === exercise.respuesta_correcta) {
                card.classList.add('correct');
            } else if (index === this.selectedOption && !isCorrect) {
                card.classList.add('incorrect');
            }
        });
        
        // Deshabilitar interacción
        document.querySelectorAll('.option-card').forEach(card => {
            card.style.pointerEvents = 'none';
        });
        document.getElementById('submit-answer').disabled = true;
        
        // Guardar progreso
        if (isCorrect) {
            this.completedExercises.add(exercise.id);
            this.failedExercises.delete(exercise.id);
        } else {
            this.failedExercises.set(exercise.id, {
                selectedOption: this.selectedOption,
                date: new Date().toISOString()
            });
        }
        
        // Guardar en localStorage (fallback)
        this.saveProgress();
        
        // Si hay sesión, sincronizar con servidor
        if (window.firebaseAuthService.isAuthenticated()) {
            try {
                await window.firebaseAuthService.recordAttempt(
                    exercise.id,
                    this.selectedOption,
                    isCorrect,
                    timeSpent,
                    exercise.area,
                    exercise.nivel
                );
            } catch (error) {
                console.error('Error sincronizando con servidor:', error);
            }
        }
        
        // Mostrar modal
        this.showFeedbackModal(isCorrect, exercise);
    }

    /**
     * Muestra el modal de feedback
     */
    showFeedbackModal(isCorrect, exercise) {
        const modal = document.getElementById('modal-overlay');
        const header = document.getElementById('modal-header');
        const body = document.getElementById('modal-body');
        
        header.className = `modal-header ${isCorrect ? 'correct' : 'incorrect'}`;
        header.innerHTML = `
            <div class="modal-status-icon">${isCorrect ? '✅' : '❌'}</div>
            <div class="modal-status-text" style="color: ${isCorrect ? 'var(--accent-success)' : 'var(--accent-danger)'}">
                ${isCorrect ? '¡CORRECTO!' : 'INCORRECTO'}
            </div>
        `;
        
        body.innerHTML = `
            <p><strong>Explicación técnica:</strong></p>
            <p>${exercise.explicacion}</p>
            ${!isCorrect ? `<p style="margin-top: 1rem; color: var(--accent-warning);"><strong>Respuesta correcta:</strong> ${exercise.opciones[exercise.respuesta_correcta]}</p>` : ''}
        `;
        
        modal.style.display = 'flex';
        this.updateStats();
    }

    /**
     * Vuelve a la lista
     */
    backToList() {
        document.getElementById('exercise-detail-view').style.display = 'none';
        document.getElementById('exercise-list-view').style.display = 'block';
        this.currentExercise = null;
        this.selectedOption = null;
        this.exerciseStartTime = null;
        this.renderExercises();
    }

    /**
     * Configura event listeners globales
     */
    setupEventListeners() {
        // Filtros de nivel
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentLevel = btn.dataset.level;
                this.renderExercises();
            });
        });
        
        // Filtros de estado (NUEVO)
        document.querySelectorAll('.filter-btn-status').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn-status').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentStatus = btn.dataset.status;
                this.renderExercises();
            });
        });
        
        // Modal
        document.getElementById('modal-close-btn').addEventListener('click', () => {
            document.getElementById('modal-overlay').style.display = 'none';
        });
        
        document.getElementById('modal-next-btn').addEventListener('click', () => {
            document.getElementById('modal-overlay').style.display = 'none';
            this.backToList();
        });
        
        // Click fuera del modal
        document.getElementById('modal-overlay').addEventListener('click', (e) => {
            if (e.target.id === 'modal-overlay') {
                document.getElementById('modal-overlay').style.display = 'none';
            }
        });
    }

    /**
     * Actualiza las estadísticas
     */
    updateStats() {
        const stats = window.exerciseLoader.getStats();
        document.getElementById('total-exercises').textContent = stats.total;
        document.getElementById('completed-exercises').textContent = this.completedExercises.size;
        
        // Calcular nivel del usuario
        const completionRate = (this.completedExercises.size / stats.total) * 100;
        let level = 'BÁSICO';
        if (completionRate > 70) level = 'AVANZADO';
        else if (completionRate > 30) level = 'INTERMEDIO';
        
        document.getElementById('user-level').textContent = level;
    }

    /**
     * Guarda el progreso en localStorage
     */
    saveProgress() {
        const progress = {
            completed: Array.from(this.completedExercises),
            failed: Array.from(this.failedExercises.entries()),
            lastUpdate: new Date().toISOString()
        };
        localStorage.setItem('industrain_progress', JSON.stringify(progress));
    }

    /**
     * Carga el progreso desde localStorage
     */
    loadProgress() {
        const saved = localStorage.getItem('industrain_progress');
        if (saved) {
            try {
                const progress = JSON.parse(saved);
                this.completedExercises = new Set(progress.completed || []);
                this.failedExercises = new Map(progress.failed || []);
            } catch (e) {
                console.error('Error cargando progreso:', e);
            }
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', async () => {
    const app = new IndustrainApp();
    await app.init();
    window.app = app;
});
