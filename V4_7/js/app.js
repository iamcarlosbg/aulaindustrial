// app.js - Lógica principal de la aplicación (V4 mejorada con 600 ejercicios)

// Variables globales
let allExercises = [];
let currentUser = null;

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Obtener usuario actual (puede ser null si no está logeado)
    currentUser = getCurrentUser();
    
    // Actualizar header según estado de autenticación
    updateUserHeader();

    // Cargar ejercicios (funciona con o sin login)
    loadExercises();

    // Configurar navegación por tabs
    setupTabs();

    // Configurar filtros
    setupFilters();
    
    // Configurar formularios de auth
    setupAuthForms();
});

// ============================================
// CARGA DE EJERCICIOS (MEJORADO - 4 ARCHIVOS JSON)
// ============================================

async function loadExercises() {
    try {
        console.log('🔄 Cargando 600 ejercicios desde 4 archivos JSON...');
        
        // Archivos JSON de ejercicios
        const dataFiles = [
            'data/electricidad_basica.json',
            'data/maniobra_potencia.json',
            'data/plc_siemens.json',
            'data/diagnostico_industrial.json'
        ];

        // Cargar todos los archivos en paralelo
        const promises = dataFiles.map(file => loadJSONFile(file));
        const results = await Promise.all(promises);

        // Combinar todos los ejercicios
        allExercises = results
            .filter(result => result !== null)
            .flatMap(data => data.exercises || []);

        console.log(`✅ ${allExercises.length} ejercicios cargados correctamente`);

        if (allExercises.length === 0) {
            showError('No se pudieron cargar los ejercicios. Verifica que los archivos JSON existan en la carpeta data/');
            return;
        }

        // Convertir formato al esperado por la UI
        allExercises = allExercises.map(ej => ({
            id: ej.id,
            titulo: ej.titulo,
            categoria: ej.area, // area → categoria
            dificultad: mapDificultad(ej.nivel),
            tiempo_estimado: 20, // Valor por defecto
            descripcion: ej.problema || ej.contexto,
            contenido: {
                teoria: ej.contexto || '',
                problema: ej.problema || '',
                datos_tecnicos: ej.datos_tecnicos || {},
                opciones: ej.opciones || [],
                respuesta_correcta: ej.respuesta_correcta || 0,
                explicacion: ej.explicacion || ''
            }
        }));

        // Renderizar ejercicios
        renderExercises(allExercises);

    } catch (error) {
        console.error('❌ Error cargando ejercicios:', error);
        showError('Error al cargar los ejercicios: ' + error.message);
    }
}

// Cargar un archivo JSON
async function loadJSONFile(filepath) {
    try {
        const response = await fetch(filepath);
        if (!response.ok) {
            console.warn(`⚠️ No se pudo cargar ${filepath}: ${response.status}`);
            return null;
        }
        const data = await response.json();
        console.log(`✓ Cargado: ${filepath} - ${data.exercises?.length || 0} ejercicios`);
        return data;
    } catch (error) {
        console.warn(`⚠️ Error cargando ${filepath}:`, error.message);
        return null;
    }
}

// Mapear niveles al formato esperado
function mapDificultad(nivel) {
    const map = {
        'básico': 'facil',
        'intermedio': 'medio',
        'avanzado': 'dificil'
    };
    return map[nivel] || 'medio';
}

// ============================================
// RENDERIZADO DE EJERCICIOS
// ============================================

function renderExercises(exercises) {
    const grid = document.getElementById('exercises-container'); // CORREGIDO: era 'exercises-grid'
    if (!grid) {
        console.error('No se encontró el elemento exercises-container');
        return;
    }

    grid.innerHTML = '';

    if (exercises.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #666;">No hay ejercicios que coincidan con los filtros</p>';
        return;
    }

    exercises.forEach(exercise => {
        const card = createExerciseCard(exercise);
        grid.appendChild(card);
    });
}

function createExerciseCard(exercise) {
    const card = document.createElement('div');
    card.className = 'exercise-card';
    card.onclick = () => openExercise(exercise);

    const dificultadClass = exercise.dificultad || 'medio';
    const dificultadText = {
        'facil': 'Fácil',
        'medio': 'Medio',
        'dificil': 'Difícil'
    }[dificultadClass] || 'Medio';

    card.innerHTML = `
        <h3>${exercise.titulo}</h3>
        <p>${exercise.descripcion || ''}</p>
        <div class="exercise-meta">
            <span class="category">📁 ${exercise.categoria}</span>
            <span class="time">⏱️ ${exercise.tiempo_estimado} min</span>
        </div>
        <span class="difficulty-badge ${dificultadClass}">${dificultadText}</span>
    `;

    return card;
}

// ============================================
// ABRIR EJERCICIO
// ============================================

function openExercise(exercise) {
    console.log('Abriendo ejercicio:', exercise);
    
    // Crear modal para mostrar el ejercicio
    const modal = document.createElement('div');
    modal.className = 'exercise-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        padding: 20px;
        overflow-y: auto;
    `;

    const content = exercise.contenido || {};
    const opciones = content.opciones || [];

    modal.innerHTML = `
        <div style="
            background: white;
            border-radius: 12px;
            max-width: 800px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            padding: 2rem;
        ">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1.5rem;">
                <h2 style="margin: 0; color: #333;">${exercise.titulo}</h2>
                <button onclick="this.closest('.exercise-modal').remove()" style="
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    padding: 0;
                    width: 32px;
                    height: 32px;
                ">✕</button>
            </div>

            <div style="background: #f5f5f5; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                <strong>📍 Contexto:</strong>
                <p>${content.teoria || exercise.descripcion}</p>
            </div>

            ${content.problema ? `
                <div style="background: #fff3cd; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                    <strong>⚠️ Problema:</strong>
                    <p>${content.problema}</p>
                </div>
            ` : ''}

            ${content.datos_tecnicos && Object.keys(content.datos_tecnicos).length > 0 ? `
                <div style="background: #e7f3ff; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem;">
                    <strong>📊 Datos Técnicos:</strong>
                    <ul style="margin: 0.5rem 0; padding-left: 1.5rem;">
                        ${Object.entries(content.datos_tecnicos).map(([key, value]) => 
                            `<li><strong>${key}:</strong> ${value}</li>`
                        ).join('')}
                    </ul>
                </div>
            ` : ''}

            ${opciones.length > 0 ? `
                <div style="margin-bottom: 1.5rem;">
                    <strong>🤔 Selecciona la respuesta correcta:</strong>
                    <div id="opciones-container" style="margin-top: 1rem;">
                        ${opciones.map((opcion, index) => `
                            <button class="opcion-btn" data-index="${index}" style="
                                display: block;
                                width: 100%;
                                padding: 1rem;
                                margin-bottom: 0.5rem;
                                background: white;
                                border: 2px solid #ddd;
                                border-radius: 8px;
                                text-align: left;
                                cursor: pointer;
                                transition: all 0.2s;
                            " onmouseover="this.style.borderColor='#4CAF50'" onmouseout="this.style.borderColor='#ddd'">
                                ${String.fromCharCode(65 + index)}. ${opcion}
                            </button>
                        `).join('')}
                    </div>
                    <div id="resultado-container" style="margin-top: 1rem;"></div>
                </div>
            ` : ''}
        </div>
    `;

    document.body.appendChild(modal);

    // Configurar listeners para las opciones
    if (opciones.length > 0) {
        const opcionBtns = modal.querySelectorAll('.opcion-btn');
        opcionBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const selectedIndex = parseInt(this.dataset.index);
                const correctIndex = content.respuesta_correcta || 0;
                const isCorrect = selectedIndex === correctIndex;

                // Deshabilitar todos los botones
                opcionBtns.forEach(b => b.disabled = true);

                // Marcar respuesta
                this.style.borderWidth = '3px';
                this.style.borderColor = isCorrect ? '#4CAF50' : '#f44336';
                this.style.background = isCorrect ? '#e8f5e9' : '#ffebee';

                // GUARDAR PROGRESO si es correcto y usuario logeado
                if (isCorrect && currentUser) {
                    markExerciseAsCompleted(exercise.id);
                }

                // Mostrar resultado
                const resultadoContainer = document.getElementById('resultado-container');
                resultadoContainer.innerHTML = `
                    <div style="
                        padding: 1rem;
                        border-radius: 8px;
                        background: ${isCorrect ? '#e8f5e9' : '#ffebee'};
                        border: 2px solid ${isCorrect ? '#4CAF50' : '#f44336'};
                    ">
                        <strong>${isCorrect ? '✅ ¡Correcto!' : '❌ Incorrecto'}</strong>
                        ${content.explicacion ? `<p style="margin-top: 0.5rem;">${content.explicacion}</p>` : ''}
                        ${!isCorrect ? `<p style="margin-top: 0.5rem;">La respuesta correcta es: <strong>${String.fromCharCode(65 + correctIndex)}. ${opciones[correctIndex]}</strong></p>` : ''}
                        ${isCorrect && currentUser ? '<p style="margin-top: 0.5rem; color: #4CAF50;">💾 Progreso guardado</p>' : ''}
                        ${isCorrect && !currentUser ? '<p style="margin-top: 0.5rem; color: #ff9800;">⚠️ Inicia sesión para guardar tu progreso</p>' : ''}
                    </div>
                `;
            });
        });
    }
}

// ============================================
// CONFIGURACIÓN DE TABS
// ============================================

function setupTabs() {
    const tabs = document.querySelectorAll('.nav-tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.dataset.tab + '-tab'; // CORREGIDO: añadir '-tab'

            // Actualizar tabs activos
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            // Mostrar contenido correspondiente
            tabContents.forEach(content => {
                if (content.id === targetTab) {
                    content.style.display = 'block';
                    content.classList.add('active');
                } else {
                    content.style.display = 'none';
                    content.classList.remove('active');
                }
            });
            
            console.log('Tab activado:', targetTab);
        });
    });
}

// ============================================
// CONFIGURACIÓN DE FILTROS
// ============================================

function setupFilters() {
    const categoryFilter = document.getElementById('filter-category');
    const difficultyFilter = document.getElementById('filter-difficulty');
    const statusFilter = document.getElementById('filter-status');

    if (categoryFilter) {
        categoryFilter.addEventListener('change', applyFilters);
    }
    if (difficultyFilter) {
        difficultyFilter.addEventListener('change', applyFilters);
    }
    if (statusFilter) {
        statusFilter.addEventListener('change', applyFilters);
    }
}

function applyFilters() {
    const category = document.getElementById('filter-category')?.value;
    const difficulty = document.getElementById('filter-difficulty')?.value;
    const status = document.getElementById('filter-status')?.value;

    let filtered = [...allExercises];

    if (category && category !== 'all') {
        filtered = filtered.filter(ex => ex.categoria === category);
    }

    if (difficulty && difficulty !== 'all') {
        filtered = filtered.filter(ex => ex.dificultad === difficulty);
    }

    // TODO: Implementar filtro por estado (requiere tracking de progreso)

    renderExercises(filtered);
}

// ============================================
// UTILIDADES
// ============================================

function showError(message) {
    const grid = document.getElementById('exercises-container'); // CORREGIDO
    if (grid) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; padding: 2rem; background: #ffebee; border: 2px solid #f44336; border-radius: 8px;">
                <h3 style="color: #d32f2f; margin-top: 0;">⚠️ Error</h3>
                <p style="color: #666;">${message}</p>
            </div>
        `;
    }
}

// ============================================
// GESTIÓN DE AUTENTICACIÓN Y HEADER
// ============================================

function updateUserHeader() {
    const container = document.getElementById('user-info-container');
    
    if (currentUser) {
        // Usuario logeado: mostrar nombre + botón salir
        container.innerHTML = `
            <span class="user-name">${currentUser.name}</span>
            <button class="btn-logout" onclick="handleLogout()">Salir</button>
        `;
    } else {
        // Modo invitado: mostrar "Modo Invitado" + botón login
        container.innerHTML = `
            <span class="user-name">Modo Invitado</span>
            <button class="btn-login-header" onclick="openLoginModal()">Login</button>
        `;
    }
}

function openLoginModal() {
    document.getElementById('login-modal').style.display = 'flex';
    // Limpiar formularios
    document.getElementById('login-form').reset();
    document.getElementById('register-form').reset();
    // Mostrar tab de login
    showAuthTab('login');
    // Ocultar mensajes
    document.getElementById('auth-error').style.display = 'none';
    document.getElementById('auth-success').style.display = 'none';
}

function closeLoginModal() {
    document.getElementById('login-modal').style.display = 'none';
}

function showAuthTab(tab) {
    const tabs = document.querySelectorAll('.auth-tab');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    tabs.forEach(t => t.classList.remove('active'));
    
    if (tab === 'login') {
        tabs[0].classList.add('active');
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        document.getElementById('modal-title').textContent = 'Iniciar Sesión';
    } else {
        tabs[1].classList.add('active');
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        document.getElementById('modal-title').textContent = 'Crear Cuenta';
    }
    
    // Ocultar mensajes
    document.getElementById('auth-error').style.display = 'none';
    document.getElementById('auth-success').style.display = 'none';
}

function setupAuthForms() {
    // Formulario de login
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        const result = login(email, password);
        
        if (result) {
            showAuthSuccess('¡Login exitoso! Bienvenido.');
            setTimeout(() => {
                closeLoginModal();
                currentUser = getCurrentUser();
                updateUserHeader();
                // Recargar página para actualizar datos del usuario
                window.location.reload();
            }, 1000);
        } else {
            showAuthError('Email o contraseña incorrectos');
        }
    });
    
    // Formulario de registro
    document.getElementById('register-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirm = document.getElementById('register-confirm').value;
        
        if (password !== confirm) {
            showAuthError('Las contraseñas no coinciden');
            return;
        }
        
        if (password.length < 6) {
            showAuthError('La contraseña debe tener al menos 6 caracteres');
            return;
        }
        
        const result = register(name, email, password);
        
        if (result) {
            showAuthSuccess('¡Cuenta creada! Iniciando sesión...');
            // Auto-login después de registro
            setTimeout(() => {
                login(email, password);
                closeLoginModal();
                currentUser = getCurrentUser();
                updateUserHeader();
                window.location.reload();
            }, 1000);
        } else {
            showAuthError('Este email ya está registrado');
        }
    });
}

function showAuthError(message) {
    const errorDiv = document.getElementById('auth-error');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    document.getElementById('auth-success').style.display = 'none';
}

function showAuthSuccess(message) {
    const successDiv = document.getElementById('auth-success');
    successDiv.textContent = message;
    successDiv.style.display = 'block';
    document.getElementById('auth-error').style.display = 'none';
}

function handleLogout() {
    if (confirm('¿Seguro que quieres cerrar sesión?')) {
        logout();
        currentUser = null;
        updateUserHeader();
        // Recargar para volver a modo invitado
        window.location.reload();
    }
}

// Cerrar modal al hacer click fuera
document.addEventListener('click', function(e) {
    const modal = document.getElementById('login-modal');
    if (e.target === modal) {
        closeLoginModal();
    }
});

// ============================================
// GESTIÓN DE PROGRESO
// ============================================

function markExerciseAsCompleted(exerciseId) {
    if (!currentUser) {
        console.log('Usuario no logeado, no se guarda progreso');
        return;
    }

    // Inicializar progress si no existe
    if (!currentUser.progress) {
        currentUser.progress = {
            completedExercises: [],
            totalTime: 0,
            lastAccess: new Date().toISOString()
        };
    }

    // Verificar si ya está completado
    if (!currentUser.progress.completedExercises) {
        currentUser.progress.completedExercises = [];
    }

    if (!currentUser.progress.completedExercises.includes(exerciseId)) {
        // Añadir ejercicio a completados
        currentUser.progress.completedExercises.push(exerciseId);
        
        // Actualizar tiempo (simulado: 15 min por ejercicio)
        currentUser.progress.totalTime = (currentUser.progress.totalTime || 0) + 15;
        
        // Actualizar último acceso
        currentUser.progress.lastAccess = new Date().toISOString();
        
        // Guardar en localStorage
        const users = getUsers();
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            users[userIndex].progress = currentUser.progress;
            saveUsers(users);
            setCurrentUser(currentUser);
        }
        
        console.log(`✅ Ejercicio ${exerciseId} marcado como completado`);
        console.log(`📊 Total completados: ${currentUser.progress.completedExercises.length}`);
    } else {
        console.log('Ejercicio ya estaba completado');
    }
}

// ============================================
// GESTIÓN DE PERFIL
// ============================================

function loadProfileData() {
    if (!currentUser) {
        // Mostrar mensaje de invitado
        document.querySelector('.profile-container > h2').style.display = 'none';
        document.querySelectorAll('.profile-section').forEach(section => {
            section.style.display = 'none';
        });
        document.getElementById('profile-guest-message').style.display = 'block';
        return;
    }

    // Ocultar mensaje de invitado
    document.querySelector('.profile-container > h2').style.display = 'block';
    document.querySelectorAll('.profile-section').forEach(section => {
        section.style.display = 'block';
    });
    document.getElementById('profile-guest-message').style.display = 'none';

    // Cargar información básica
    document.getElementById('profile-name').textContent = currentUser.name;
    document.getElementById('profile-email').textContent = currentUser.email;
    
    // Fecha de registro
    const regDate = new Date(currentUser.registeredAt);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('profile-since').textContent = regDate.toLocaleDateString('es-ES', options);

    // Cargar estadísticas
    loadUserStats();
    
    // Cargar estado de newsletter
    const newsletterToggle = document.getElementById('newsletter-toggle');
    newsletterToggle.checked = currentUser.newsletter || false;
}

function loadUserStats() {
    if (!currentUser || !currentUser.progress) {
        return;
    }

    const progress = currentUser.progress;
    const completed = progress.completedExercises || [];
    
    // Estadísticas generales
    document.getElementById('stat-completed').textContent = completed.length;
    
    // Calcular precisión (100% para ejercicios correctos)
    const accuracy = completed.length > 0 ? 100 : 0;
    document.getElementById('stat-accuracy').textContent = accuracy + '%';
    
    // Tiempo total (del guardado)
    const totalMinutes = progress.totalTime || 0;
    const totalHours = (totalMinutes / 60).toFixed(1);
    document.getElementById('stat-time').textContent = totalHours + 'h';
    
    // Racha (días consecutivos - simplificado)
    const streak = completed.length > 0 ? Math.min(Math.floor(completed.length / 5) + 1, 30) : 0;
    document.getElementById('stat-streak').textContent = streak;

    // Progreso por categoría
    const categories = {
        'Electricidad Básica': { id: 'elec', total: 150, completed: 0 },
        'Maniobra y Potencia': { id: 'man', total: 150, completed: 0 },
        'PLC Siemens': { id: 'plc', total: 150, completed: 0 },
        'Diagnóstico Industrial': { id: 'diag', total: 150, completed: 0 }
    };

    // Contar completados por categoría
    completed.forEach(exerciseId => {
        const exercise = allExercises.find(ex => ex.id === exerciseId);
        if (exercise && categories[exercise.categoria]) {
            categories[exercise.categoria].completed++;
        }
    });

    // Actualizar UI
    Object.entries(categories).forEach(([name, data]) => {
        const percentage = (data.completed / data.total) * 100;
        document.getElementById(`progress-${data.id}`).textContent = `${data.completed}/${data.total}`;
        document.getElementById(`progress-bar-${data.id}`).style.width = percentage + '%';
    });
    
    console.log(`📊 Estadísticas cargadas: ${completed.length} ejercicios completados`);
}

function editName() {
    const currentName = document.getElementById('profile-name').textContent;
    const newName = prompt('Nuevo nombre:', currentName);
    
    if (newName && newName.trim() !== '' && newName !== currentName) {
        // Actualizar en currentUser
        currentUser.name = newName.trim();
        
        // Actualizar en localStorage
        const users = getUsers();
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            users[userIndex].name = newName.trim();
            saveUsers(users);
            setCurrentUser(currentUser);
        }
        
        // Actualizar UI
        document.getElementById('profile-name').textContent = newName.trim();
        updateUserHeader();
        
        alert('✅ Nombre actualizado correctamente');
    }
}

function toggleNewsletter() {
    if (!currentUser) return;
    
    const isSubscribed = document.getElementById('newsletter-toggle').checked;
    
    // Actualizar en currentUser
    currentUser.newsletter = isSubscribed;
    
    // Actualizar en localStorage
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex].newsletter = isSubscribed;
        saveUsers(users);
        setCurrentUser(currentUser);
    }
    
    const message = isSubscribed 
        ? '✅ Te has suscrito al newsletter' 
        : 'Has cancelado tu suscripción al newsletter';
    
    // Mostrar mensaje temporal
    showTemporaryMessage(message);
}

function showChangePassword() {
    const currentPassword = prompt('Contraseña actual:');
    if (!currentPassword) return;
    
    // Verificar contraseña actual
    if (btoa(currentPassword) !== currentUser.password) {
        alert('❌ Contraseña actual incorrecta');
        return;
    }
    
    const newPassword = prompt('Nueva contraseña (mínimo 6 caracteres):');
    if (!newPassword || newPassword.length < 6) {
        alert('❌ La contraseña debe tener al menos 6 caracteres');
        return;
    }
    
    const confirmPassword = prompt('Confirmar nueva contraseña:');
    if (newPassword !== confirmPassword) {
        alert('❌ Las contraseñas no coinciden');
        return;
    }
    
    // Actualizar contraseña
    currentUser.password = btoa(newPassword);
    
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex].password = btoa(newPassword);
        saveUsers(users);
        setCurrentUser(currentUser);
    }
    
    alert('✅ Contraseña actualizada correctamente');
}

function showForgotPassword() {
    const email = prompt('Ingresa tu email para recuperar tu contraseña:');
    if (!email) return;
    
    const users = getUsers();
    const user = users.find(u => u.email === email);
    
    if (user) {
        // En un sistema real, aquí se enviaría un email
        alert('📧 Se ha enviado un email con instrucciones para recuperar tu contraseña.\n\n(En esta versión demo, tu contraseña se muestra aquí: ' + atob(user.password) + ')');
    } else {
        alert('❌ No existe una cuenta con ese email');
    }
}

function showTemporaryMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4caf50;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10001;
        animation: slideIn 0.3s ease;
    `;
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => messageDiv.remove(), 300);
    }, 3000);
}

// Cargar perfil cuando se accede al tab
document.addEventListener('DOMContentLoaded', function() {
    // Listener para cuando se abre el tab de perfil
    const profileTab = document.querySelector('[data-tab="profile"]');
    if (profileTab) {
        profileTab.addEventListener('click', function() {
            setTimeout(loadProfileData, 100);
        });
    }
});

console.log('✅ App.js cargado - Versión mejorada con 600 ejercicios + Perfil');
