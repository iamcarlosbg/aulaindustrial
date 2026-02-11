/**
 * APP.JS - Controlador principal de la aplicación
 * Gestiona la interfaz, navegación y lógica de interacción
 */

class IndustrainApp {
    constructor() {
        this.currentArea = 'all';
        this.currentLevel = 'all';
        this.currentExercise = null;
        this.selectedOption = null;
        this.completedExercises = new Set();
        
        // Cargar estado guardado
        this.loadProgress();
    }

    /**
     * Inicializa la aplicación
     */
    async init() {
        // Cargar ejercicios
        await window.exerciseLoader.loadAllExercises();
        
        // Renderizar interfaz
        this.renderAreas();
        this.renderExercises();
        this.updateStats();
        
        // Configurar event listeners
        this.setupEventListeners();
        
        console.log('✅ IndusTrain inicializado correctamente');
    }

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
        const exercises = window.exerciseLoader.filter(this.currentArea, this.currentLevel);
        
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
     * Crea una tarjeta de ejercicio
     */
    createExerciseCard(exercise, index) {
        const div = document.createElement('div');
        div.className = 'exercise-card';
        div.style.animationDelay = `${index * 0.05}s`;
        
        const isCompleted = this.completedExercises.has(exercise.id);
        const completedBadge = isCompleted ? '<span style="color: var(--accent-success); font-size: 1.2rem; margin-left: 0.5rem;">✓</span>' : '';
        
        div.innerHTML = `
            <div class="card-header">
                <span class="level-badge ${exercise.nivel}">${exercise.nivel}</span>
                <span class="area-badge">${exercise.area}</span>
            </div>
            <h3 class="card-title">${exercise.titulo}${completedBadge}</h3>
            <p class="card-context">${exercise.contexto}</p>
            <div class="card-problem">
                <strong>⚠️ Problema:</strong> ${exercise.problema}
            </div>
            <div class="card-footer">
                <div class="tech-tags">
                    ${this.getTechTags(exercise).map(tag => `<span class="tech-tag">${tag}</span>`).join('')}
                </div>
                <button class="start-btn">INICIAR</button>
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
    submitAnswer() {
        if (this.selectedOption === null) return;
        
        const exercise = this.currentExercise;
        const isCorrect = this.selectedOption === exercise.respuesta_correcta;
        
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
        
        // Guardar progreso si es correcto
        if (isCorrect) {
            this.completedExercises.add(exercise.id);
            this.saveProgress();
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
                this.completedExercises = new Set(progress.completed);
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
