// config.js - Configuración de la aplicación

const APP_CONFIG = {
    // Información de la aplicación
    app: {
        name: "Aula Industrial",
        version: "4.0.0",
        description: "Plataforma de ejercicios interactivos para PLCs"
    },

    // Colores del tema
    theme: {
        primaryGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        primaryColor: "#667eea",
        secondaryColor: "#764ba2",
        backgroundColor: "#f5f7fa",
        cardBackground: "#ffffff",
        textColor: "#333333",
        textSecondary: "#666666"
    },

    // Configuración de ejercicios
    exercises: {
        dataPath: "data/ejercicios.json",
        categoriesEnabled: true,
        difficultyLevels: ["facil", "medio", "dificil"],
        autoSaveProgress: true
    },

    // Configuración de usuario
    user: {
        enableRegistration: true,
        minPasswordLength: 6,
        allowGuestAccess: true, // CAMBIADO: permitir acceso sin login
        sessionTimeout: 7 * 24 * 60 * 60 * 1000 // 7 días en milisegundos
    },

    // Features habilitadas
    features: {
        progress: true,         // Seguimiento de progreso
        filters: true,          // Filtros de ejercicios
        newsletter: true,       // Suscripción al newsletter
        comparison: false,      // Comparativa (en desarrollo)
        darkMode: false,        // Modo oscuro (en desarrollo)
        exportProgress: false   // Exportar progreso (en desarrollo)
    },

    // Configuración de estadísticas
    stats: {
        trackTime: true,
        showCompletion: true,
        showStreak: false,
        showRanking: false
    },

    // Textos personalizables
    texts: {
        loginTitle: "Bienvenido a Aula Industrial",
        loginSubtitle: "Aprende programación de PLCs",
        registerTitle: "Crear Cuenta",
        welcomeMessage: "¡Bienvenido {name}!",
        noExercisesMessage: "No hay ejercicios disponibles"
    },

    // Usuario demo (para testing)
    demo: {
        enabled: true,
        email: "demo@aulaindustrial.com",
        password: "demo123",
        name: "Usuario Demo"
    },

    // Categorías predefinidas (opcional)
    categories: [
        "PLC Básico",
        "Temporizadores",
        "Contadores",
        "Proyectos",
        "Detección de Flancos",
        "Señales Analógicas"
    ],

    // Configuración de dificultades
    difficulties: {
        facil: {
            label: "Fácil",
            color: "#4caf50",
            backgroundColor: "#e8f5e9"
        },
        medio: {
            label: "Medio",
            color: "#ff9800",
            backgroundColor: "#fff3e0"
        },
        dificil: {
            label: "Difícil",
            color: "#f44336",
            backgroundColor: "#ffebee"
        }
    },

    // Configuración de notificaciones
    notifications: {
        enabled: true,
        duration: 3000, // milisegundos
        position: "top-right" // top-right, top-left, bottom-right, bottom-left
    },

    // Configuración de localStorage
    storage: {
        prefix: "aulaindustrial_",
        keys: {
            users: "users",
            currentUser: "current_user",
            progress: "progress",
            newsletter: "newsletter_subscriptions"
        }
    },

    // URLs y enlaces
    links: {
        documentation: "https://github.com/tu-usuario/aulaindustrial/blob/main/README.md",
        support: "https://github.com/tu-usuario/aulaindustrial/issues",
        repository: "https://github.com/tu-usuario/aulaindustrial"
    },

    // Configuración de desarrollo
    dev: {
        debug: false,
        logToConsole: true,
        showPerformance: false
    }
};

// Hacer la configuración disponible globalmente
if (typeof window !== 'undefined') {
    window.APP_CONFIG = APP_CONFIG;
}

// Exportar para uso en Node.js (si es necesario)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = APP_CONFIG;
}
