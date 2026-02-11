/**
 * LOADER.JS - Sistema de carga dinámica de ejercicios
 * Carga archivos JSON y gestiona datos de ejercicios
 */

class ExerciseLoader {
    constructor() {
        this.exercises = [];
        this.areas = [];
        this.dataFiles = [
            'data/electricidad_basica.json',
            'data/maniobra_potencia.json',
            'data/plc_siemens.json',
            'data/diagnostico_industrial.json'
        ];
    }

    /**
     * Carga todos los archivos JSON de ejercicios
     */
    async loadAllExercises() {
        try {
            const loadPromises = this.dataFiles.map(file => this.loadJSON(file));
            const results = await Promise.all(loadPromises);
            
            // Combinar todos los ejercicios
            this.exercises = results.flat();
            
            // Extraer áreas únicas
            this.extractAreas();
            
            console.log(`✅ ${this.exercises.length} ejercicios cargados correctamente`);
            return this.exercises;
        } catch (error) {
            console.error('❌ Error cargando ejercicios:', error);
            return [];
        }
    }

    /**
     * Carga un archivo JSON individual
     */
    async loadJSON(filepath) {
        try {
            const response = await fetch(filepath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log(`✓ Cargado: ${filepath} - ${data.exercises?.length || 0} ejercicios`);
            return data.exercises || [];
        } catch (error) {
            console.warn(`⚠️ No se pudo cargar ${filepath}:`, error.message);
            // Si hay error de CORS o file://, mostrar mensaje al usuario
            if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
                console.error('💡 SOLUCIÓN: Ejecuta la aplicación desde un servidor web local.');
                console.error('   - Python: python -m http.server 8000');
                console.error('   - Node: npx http-server -p 8000');
            }
            return [];
        }
    }

    /**
     * Extrae áreas únicas de los ejercicios cargados
     */
    extractAreas() {
        const areaMap = new Map();
        
        this.exercises.forEach(exercise => {
            const areaKey = exercise.area;
            if (!areaMap.has(areaKey)) {
                areaMap.set(areaKey, {
                    id: areaKey,
                    name: exercise.area,
                    icon: this.getAreaIcon(areaKey),
                    count: 0,
                    description: this.getAreaDescription(areaKey)
                });
            }
            areaMap.get(areaKey).count++;
        });
        
        this.areas = Array.from(areaMap.values());
    }

    /**
     * Obtiene el icono para cada área
     */
    getAreaIcon(area) {
        const icons = {
            'Electricidad Básica': '⚡',
            'Maniobra y Potencia': '🔌',
            'PLC Siemens': '🤖',
            'Diagnóstico Industrial': '🔧'
        };
        return icons[area] || '📋';
    }

    /**
     * Obtiene la descripción para cada área
     */
    getAreaDescription(area) {
        const descriptions = {
            'Electricidad Básica': 'Fundamentos de electricidad industrial',
            'Maniobra y Potencia': 'Circuitos de arranque y control de motores',
            'PLC Siemens': 'Programación y configuración TIA Portal',
            'Diagnóstico Industrial': 'Resolución de fallos en planta'
        };
        return descriptions[area] || 'Ejercicios prácticos';
    }

    /**
     * Filtra ejercicios por área
     */
    filterByArea(areaId) {
        if (!areaId || areaId === 'all') {
            return this.exercises;
        }
        return this.exercises.filter(ex => ex.area === areaId);
    }

    /**
     * Filtra ejercicios por nivel
     */
    filterByLevel(level) {
        if (!level || level === 'all') {
            return this.exercises;
        }
        return this.exercises.filter(ex => ex.nivel.toLowerCase() === level.toLowerCase());
    }

    /**
     * Filtra ejercicios por área y nivel
     */
    filter(areaId, level) {
        let filtered = this.exercises;
        
        if (areaId && areaId !== 'all') {
            filtered = filtered.filter(ex => ex.area === areaId);
        }
        
        if (level && level !== 'all') {
            filtered = filtered.filter(ex => ex.nivel.toLowerCase() === level.toLowerCase());
        }
        
        return filtered;
    }

    /**
     * Obtiene un ejercicio por ID
     */
    getExerciseById(id) {
        return this.exercises.find(ex => ex.id === id);
    }

    /**
     * Obtiene estadísticas
     */
    getStats() {
        return {
            total: this.exercises.length,
            byLevel: {
                básico: this.exercises.filter(ex => ex.nivel === 'básico').length,
                intermedio: this.exercises.filter(ex => ex.nivel === 'intermedio').length,
                avanzado: this.exercises.filter(ex => ex.nivel === 'avanzado').length
            },
            byArea: this.areas.reduce((acc, area) => {
                acc[area.id] = area.count;
                return acc;
            }, {})
        };
    }

    /**
     * Obtiene todas las áreas
     */
    getAreas() {
        return this.areas;
    }

    /**
     * Obtiene todos los ejercicios
     */
    getAllExercises() {
        return this.exercises;
    }
}

// Crear instancia global
window.exerciseLoader = new ExerciseLoader();
