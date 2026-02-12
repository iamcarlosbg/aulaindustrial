// auth.js - Sistema de autenticación con LocalStorage

// Clave para almacenar usuarios
const USERS_KEY = 'aulaindustrial_users';
const CURRENT_USER_KEY = 'aulaindustrial_current_user';

// Obtener todos los usuarios registrados
function getUsers() {
    const usersJson = localStorage.getItem(USERS_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
}

// Guardar usuarios
function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Registrar nuevo usuario
function register(name, email, password) {
    const users = getUsers();
    
    // Verificar si el email ya existe
    if (users.some(user => user.email === email)) {
        return false; // Email ya registrado
    }
    
    // Crear nuevo usuario
    const newUser = {
        id: Date.now().toString(),
        name: name,
        email: email,
        password: btoa(password), // Codificación simple (no es segura para producción)
        registeredAt: new Date().toISOString(),
        progress: {
            completedExercises: [],
            totalTime: 0,
            lastAccess: null
        }
    };
    
    users.push(newUser);
    saveUsers(users);
    
    console.log('Usuario registrado:', email);
    return true;
}

// Iniciar sesión
function login(email, password) {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === btoa(password));
    
    if (user) {
        // Guardar sesión actual (sin contraseña)
        const sessionUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            registeredAt: user.registeredAt,
            loginAt: new Date().toISOString()
        };
        
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
        
        // Actualizar último acceso
        user.progress.lastAccess = new Date().toISOString();
        saveUsers(users);
        
        console.log('Login exitoso:', email);
        return true;
    }
    
    console.log('Login fallido:', email);
    return false;
}

// Cerrar sesión
function logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
    window.location.href = 'index.html';
}

// Verificar si hay sesión activa
function isLoggedIn() {
    return localStorage.getItem(CURRENT_USER_KEY) !== null;
}

// Obtener usuario actual
function getCurrentUser() {
    const userJson = localStorage.getItem(CURRENT_USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
}

// Obtener datos completos del usuario (incluyendo progreso)
function getUserData() {
    const currentUser = getCurrentUser();
    if (!currentUser) return null;
    
    const users = getUsers();
    return users.find(u => u.id === currentUser.id);
}

// Actualizar progreso del usuario
function updateUserProgress(exerciseId) {
    const userData = getUserData();
    if (!userData) return false;
    
    // Agregar ejercicio completado si no existe
    if (!userData.progress.completedExercises.includes(exerciseId)) {
        userData.progress.completedExercises.push(exerciseId);
        
        // Guardar cambios
        const users = getUsers();
        const userIndex = users.findIndex(u => u.id === userData.id);
        if (userIndex !== -1) {
            users[userIndex] = userData;
            saveUsers(users);
            console.log('Progreso actualizado:', exerciseId);
            return true;
        }
    }
    
    return false;
}

// Agregar tiempo de práctica
function addPracticeTime(minutes) {
    const userData = getUserData();
    if (!userData) return false;
    
    userData.progress.totalTime += minutes;
    
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === userData.id);
    if (userIndex !== -1) {
        users[userIndex] = userData;
        saveUsers(users);
        return true;
    }
    
    return false;
}

// Obtener estadísticas del usuario
function getUserStats() {
    const userData = getUserData();
    if (!userData) return null;
    
    return {
        completedCount: userData.progress.completedExercises.length,
        totalTime: userData.progress.totalTime,
        lastAccess: userData.progress.lastAccess,
        registeredSince: userData.registeredAt
    };
}

// Proteger páginas que requieren autenticación
function requireAuth() {
    if (!isLoggedIn()) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// Inicializar usuarios de prueba (solo primera vez)
function initTestUsers() {
    const users = getUsers();
    
    if (users.length === 0) {
        // Crear usuario de prueba
        register('Usuario Demo', 'demo@aulaindustrial.com', 'demo123');
        console.log('Usuario de prueba creado: demo@aulaindustrial.com / demo123');
    }
}

// Ejecutar inicialización al cargar
if (typeof window !== 'undefined') {
    initTestUsers();
}
