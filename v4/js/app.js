// app.js - Lógica principal de la aplicación

// Variables globales
let allExercises = [];
let currentUser = null;

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticación
    if (!requireAuth()) {
        return;
    }

    // Obtener usuario actual
    currentUser = getCurrentUser();
    document.getElementById('user-name').textContent = currentUser.name;

    // Cargar ejercicios
    loadExercises();

    // Configurar navegación por tabs
    setupTabs();

    // Configurar filtros
    setupFilters();
});

// ============================================
// CARGA DE EJERCICIOS
// ============================================

async function loadExercises() {
    try {
        console.log('Intentando cargar ejercicios desde: data/ejercicios.json');
        
        // Intentar cargar desde diferentes rutas posibles
        const possiblePaths = [
            'data/ejercicios.json',
            './data/ejercicios.json',
            '../data/ejercicios.json'
        ];

        let data = null;
        let successPath = null;

        for (const path of possiblePaths) {
            try {
                const response = await fetch(path);
                if (response.ok) {
                    data = await response.json();
                    successPath = path;
                    console.log(`✅ Ejercicios cargados desde: ${path}`);
                    break;
                }
            } catch (error) {
                console.log(`❌ No se pudo cargar desde: ${path}`);
            }
        }

        if (!data) {
            throw new Error('No se pudo cargar el archivo de ejercicios desde ninguna ruta');
        }

        // Guardar ejercicios
        allExercises = data.ejercicios || [];
        console.log(`📚 Total de ejercicios cargados: ${allExercises.length}`);

        // Mostrar ejercicios
        displayExercises();

        // Llenar filtros
        populateFilters();

        // Actualizar estadísticas
        updateStats();

    } catch (error) {
        console.error('Error al cargar ejercicios:', error);
        showError('No se pudieron cargar los ejercicios. Por favor, verifica que el archivo data/ejercicios.json existe.');
    }
}

function showError(message) {
    const container = document.getElementById('exercises-container');
    container.innerHTML = `
        <div class="error-message" style="grid-column: 1/-1;">
            <h3>⚠️ Error</h3>
            <p>${message}</p>
            <p style="margin-top: 10px; font-size: 14px;">
                Asegúrate de que la estructura de carpetas es correcta:<br>
                - app.html (en la raíz)<br>
                - data/ejercicios.json
            </p>
        </div>
    `;
}

// ============================================
// VISUALIZACIÓN DE EJERCICIOS
// ============================================

function displayExercises(filteredExercises = null) {
    const container = document.getElementById('exercises-container');
    const exercises = filteredExercises || allExercises;

    if (exercises.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999; padding: 40px;">No hay ejercicios que coincidan con los filtros</p>';
        return;
    }

    // Obtener ejercicios completados del usuario
    const userData = getUserData();
    const completedExercises = userData?.progress.completedExercises || [];

    container.innerHTML = exercises.map(exercise => {
        const isCompleted = completedExercises.includes(exercise.id);
        const completedClass = isCompleted ? 'completed' : '';

        return `
            <div class="exercise-card ${completedClass}" onclick="openExercise('${exercise.id}')">
                <div class="exercise-header">
                    <div class="exercise-title">${exercise.titulo}</div>
                    <span class="difficulty-badge difficulty-${exercise.dificultad}">
                        ${exercise.dificultad.charAt(0).toUpperCase() + exercise.dificultad.slice(1)}
                    </span>
                </div>
                <div class="exercise-description">${exercise.descripcion}</div>
                <div class="exercise-meta">
                    <span>📁 ${exercise.categoria}</span>
                    <span>⏱️ ${exercise.tiempo_estimado} min</span>
                </div>
                ${isCompleted ? '<div class="completed-badge">✓ Completado</div>' : ''}
            </div>
        `;
    }).join('');

    console.log(`Mostrando ${exercises.length} ejercicios`);
}

function openExercise(exerciseId) {
    // Buscar el ejercicio
    const exercise = allExercises.find(e => e.id === exerciseId);
    if (!exercise) return;

    // Guardar en localStorage para que lo use la página de ejercicio
    localStorage.setItem('current_exercise', JSON.stringify(exercise));

    // Abrir página de ejercicio (por crear)
    window.location.href = `exercise.html?id=${exerciseId}`;
}

// ============================================
// FILTROS
// ============================================

function populateFilters() {
    // Obtener categorías únicas
    const categories = [...new Set(allExercises.map(e => e.categoria))];
    
    const categorySelect = document.getElementById('filter-category');
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
}

function setupFilters() {
    const filters = ['filter-category', 'filter-difficulty', 'filter-status'];
    
    filters.forEach(filterId => {
        document.getElementById(filterId).addEventListener('change', applyFilters);
    });
}

function applyFilters() {
    const category = document.getElementById('filter-category').value;
    const difficulty = document.getElementById('filter-difficulty').value;
    const status = document.getElementById('filter-status').value;

    let filtered = allExercises;

    // Filtrar por categoría
    if (category) {
        filtered = filtered.filter(e => e.categoria === category);
    }

    // Filtrar por dificultad
    if (difficulty) {
        filtered = filtered.filter(e => e.dificultad === difficulty);
    }

    // Filtrar por estado
    if (status) {
        const userData = getUserData();
        const completedExercises = userData?.progress.completedExercises || [];
        
        if (status === 'completed') {
            filtered = filtered.filter(e => completedExercises.includes(e.id));
        } else if (status === 'pending') {
            filtered = filtered.filter(e => !completedExercises.includes(e.id));
        }
    }

    displayExercises(filtered);
}

// ============================================
// NAVEGACIÓN POR TABS
// ============================================

function setupTabs() {
    const tabs = document.querySelectorAll('.nav-tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            
            // Actualizar tabs activos
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Mostrar contenido correcto
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`${tabName}-tab`).classList.add('active');

            // Cargar contenido específico si es necesario
            if (tabName === 'progress') {
                updateStats();
            }
        });
    });
}

// ============================================
// ESTADÍSTICAS
// ============================================

function updateStats() {
    const userData = getUserData();
    if (!userData) return;

    const completedCount = userData.progress.completedExercises.length;
    const totalExercises = allExercises.length;
    const percentage = totalExercises > 0 ? Math.round((completedCount / totalExercises) * 100) : 0;

    // Calcular tiempo promedio
    const totalTime = userData.progress.totalTime || 0;

    // Días desde el registro
    const registeredDate = new Date(userData.registeredAt);
    const today = new Date();
    const daysSinceRegistration = Math.floor((today - registeredDate) / (1000 * 60 * 60 * 24));

    const statsContainer = document.getElementById('stats-container');
    statsContainer.innerHTML = `
        <div class="stat-card">
            <div class="stat-value">${completedCount}</div>
            <div class="stat-label">Ejercicios Completados</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${percentage}%</div>
            <div class="stat-label">Progreso Total</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${totalTime}</div>
            <div class="stat-label">Minutos de Práctica</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${daysSinceRegistration}</div>
            <div class="stat-label">Días en la Plataforma</div>
        </div>
    `;
}

// ============================================
// NEWSLETTER
// ============================================

function subscribeNewsletter() {
    const email = document.getElementById('newsletter-email').value;
    
    if (!email || !email.includes('@')) {
        alert('Por favor ingresa un email válido');
        return;
    }

    // Guardar suscripción
    const subscriptions = JSON.parse(localStorage.getItem('newsletter_subscriptions') || '[]');
    
    if (!subscriptions.includes(email)) {
        subscriptions.push({
            email: email,
            userId: currentUser.id,
            subscribedAt: new Date().toISOString()
        });
        localStorage.setItem('newsletter_subscriptions', JSON.stringify(subscriptions));
    }

    // Mostrar mensaje de éxito
    document.getElementById('newsletter-success').style.display = 'block';
    document.getElementById('newsletter-email').value = '';

    setTimeout(() => {
        document.getElementById('newsletter-success').style.display = 'none';
    }, 3000);
}

// ============================================
// UTILIDADES
// ============================================

// Hacer funciones globales para que puedan ser llamadas desde HTML
window.openExercise = openExercise;
window.subscribeNewsletter = subscribeNewsletter;
