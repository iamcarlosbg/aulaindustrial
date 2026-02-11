// =============================================
// CONFIGURACIÓN DE FIREBASE - AULA INDUSTRIAL
// =============================================

const firebaseConfig = {
  apiKey: "AIzaSyCpSbZxNuuiWazpdVGLCEI7z8Wd28dDVB8",
  authDomain: "aula-industrial-50346.firebaseapp.com",
  projectId: "aula-industrial-50346",
  storageBucket: "aula-industrial-50346.firebasestorage.app",
  messagingSenderId: "28204076155",
  appId: "1:28204076155:web:2801f450355e507784e6de",
  measurementId: "G-G56HS1R81N"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Servicios
const auth = firebase.auth();
const db = firebase.firestore();

// Exportar para uso global
window.firebaseAuth = auth;
window.firebaseDB = db;

console.log('🔥 Firebase inicializado correctamente para Aula Industrial');
