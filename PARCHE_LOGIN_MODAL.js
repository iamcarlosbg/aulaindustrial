/**
 * PARCHE PARA APP-FIREBASE.JS
 * 
 * Reemplaza el método showLoginModal() con la versión que incluye
 * botones de login social (Google y Facebook)
 * 
 * INSTRUCCIONES:
 * Busca en app-firebase.js el método showLoginModal() (línea ~180)
 * y reemplázalo por este código completo
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
            
            <!-- BOTONES DE LOGIN SOCIAL -->
            <div style="margin-bottom: 2rem;">
                <button type="button" id="google-login-btn" style="
                    width: 100%;
                    padding: 1rem;
                    background: white;
                    color: #333;
                    border: 2px solid #ddd;
                    border-radius: 8px;
                    font-weight: bold;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.75rem;
                    margin-bottom: 0.75rem;
                    font-family: var(--font-mono);
                    font-size: 0.95rem;
                    transition: all 0.3s ease;
                ">
                    <svg width="20" height="20" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continuar con Google
                </button>
                
                <button type="button" id="facebook-login-btn" style="
                    width: 100%;
                    padding: 1rem;
                    background: #1877f2;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-weight: bold;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.75rem;
                    font-family: var(--font-mono);
                    font-size: 0.95rem;
                    transition: all 0.3s ease;
                ">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Continuar con Facebook
                </button>
            </div>
            
            <div style="
                text-align: center;
                color: var(--text-muted);
                margin: 1.5rem 0;
                font-size: 0.9rem;
                position: relative;
            ">
                <span style="background: var(--secondary-bg); padding: 0 1rem; position: relative; z-index: 1;">
                    O usa tu correo electrónico
                </span>
                <div style="
                    position: absolute;
                    top: 50%;
                    left: 0;
                    right: 0;
                    height: 1px;
                    background: var(--border-color);
                    z-index: 0;
                "></div>
            </div>
            
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
                    <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.9rem;">Email</label>
                    <input type="email" id="login-email" required style="
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
    
    // Estilos para tabs y botones
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
        #google-login-btn:hover {
            background: #f8f9fa;
            border-color: #4285F4;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(66, 133, 244, 0.3);
        }
        #facebook-login-btn:hover {
            background: #166fe5;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(24, 119, 242, 0.3);
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
            
            // Limpiar mensaje
            document.getElementById('auth-message').style.display = 'none';
        });
    });
    
    // Login con Google
    document.getElementById('google-login-btn').addEventListener('click', async () => {
        const btn = document.getElementById('google-login-btn');
        btn.disabled = true;
        btn.innerHTML = '<span style="display:inline-block;animation:spin 1s linear infinite;">⏳</span> Conectando...';
        
        const result = await window.firebaseAuthService.loginWithGoogle();
        
        if (result.success) {
            modal.remove();
            document.getElementById('login-btn')?.remove();
            this.showUserInfo(result.user);
            await this.loadServerProgress();
        } else {
            btn.disabled = false;
            btn.innerHTML = 'Continuar con Google';
            this.showAuthMessage(result.error, false);
        }
    });
    
    // Login con Facebook
    document.getElementById('facebook-login-btn').addEventListener('click', async () => {
        const btn = document.getElementById('facebook-login-btn');
        btn.disabled = true;
        btn.innerHTML = '<span style="display:inline-block;animation:spin 1s linear infinite;">⏳</span> Conectando...';
        
        const result = await window.firebaseAuthService.loginWithFacebook();
        
        if (result.success) {
            modal.remove();
            document.getElementById('login-btn')?.remove();
            this.showUserInfo(result.user);
            await this.loadServerProgress();
        } else {
            btn.disabled = false;
            btn.innerHTML = 'Continuar con Facebook';
            this.showAuthMessage(result.error, false);
        }
    });
    
    // Login con email
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
 * Muestra un mensaje en el modal de autenticación
 */
showAuthMessage(message, isSuccess) {
    const messageDiv = document.getElementById('auth-message');
    messageDiv.style.display = 'block';
    messageDiv.style.background = isSuccess 
        ? 'rgba(16, 185, 129, 0.1)' 
        : 'rgba(239, 68, 68, 0.1)';
    messageDiv.style.border = `2px solid ${isSuccess ? '#10b981' : '#ef4444'}`;
    messageDiv.style.color = isSuccess ? '#10b981' : '#ef4444';
    messageDiv.textContent = message;
}

/**
 * Maneja el login con email
 */
async handleLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    const result = await window.firebaseAuthService.loginWithEmail(email, password);
    
    if (result.success) {
        this.showAuthMessage('✅ Login exitoso!', true);
        
        setTimeout(async () => {
            document.getElementById('auth-modal').remove();
            document.getElementById('login-btn')?.remove();
            this.showUserInfo(result.user);
            await this.loadServerProgress();
        }, 1000);
    } else {
        this.showAuthMessage('❌ ' + result.error, false);
    }
}

/**
 * Maneja el registro
 */
async handleRegister() {
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const fullName = document.getElementById('register-fullname').value;
    
    const result = await window.firebaseAuthService.registerWithEmail(email, password, fullName);
    
    if (result.success) {
        this.showAuthMessage('✅ Cuenta creada! Ahora puedes iniciar sesión', true);
        
        // Cambiar a tab de login
        setTimeout(() => {
            document.querySelector('.auth-tab[data-tab="login"]').click();
            document.getElementById('login-email').value = email;
        }, 2000);
    } else {
        this.showAuthMessage('❌ ' + result.error, false);
    }
}
