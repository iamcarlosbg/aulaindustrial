# 🏭 Aula Industrial - Plataforma de Ejercicios Interactivos

Plataforma web para aprendizaje de programación de PLCs con ejercicios interactivos.

## ✨ Características

- ✅ **Sistema de Login/Registro** con localStorage (sin backend)
- 📚 **Biblioteca de Ejercicios** con filtros por categoría, dificultad y estado
- 📊 **Seguimiento de Progreso** personal
- 🎯 **Comparativa de Rendimiento** (próximamente)
- 📧 **Newsletter** para actualizaciones

## 🚀 Instalación

### Opción 1: GitHub Pages (Recomendada)

1. **Sube estos archivos a tu repositorio de GitHub:**
   ```
   tu-repo/
   ├── index.html          (Página de login)
   ├── app.html           (Aplicación principal)
   ├── css/
   │   └── styles.css
   ├── js/
   │   ├── auth.js
   │   └── app.js
   └── data/
       └── ejercicios.json
   ```

2. **Activa GitHub Pages:**
   - Ve a Settings → Pages
   - Selecciona la rama `main` o `master`
   - Carpeta: `/ (root)`
   - Guarda

3. **Accede a tu sitio:**
   - `https://tu-usuario.github.io/tu-repo/`

### Opción 2: Local

1. **Clona o descarga el repositorio**

2. **Abre con un servidor local:**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   
   # Node.js (npx)
   npx http-server
   
   # PHP
   php -S localhost:8000
   ```

3. **Abre en el navegador:**
   - `http://localhost:8000`

## 📁 Estructura de Archivos

```
proyecto/
├── index.html              # Página de login/registro
├── app.html               # Aplicación principal
├── css/
│   └── styles.css         # Estilos generales
├── js/
│   ├── auth.js            # Sistema de autenticación
│   └── app.js             # Lógica de la aplicación
└── data/
    └── ejercicios.json    # Base de datos de ejercicios
```

## 🔐 Sistema de Autenticación

### Usuario de Prueba

El sistema crea automáticamente un usuario demo:

- **Email:** `demo@aulaindustrial.com`
- **Contraseña:** `demo123`

### Características

- Registro de nuevos usuarios
- Login con validación
- Sesión persistente (localStorage)
- Seguimiento de progreso por usuario

## 📚 Gestión de Ejercicios

### Formato del archivo `ejercicios.json`

```json
{
  "ejercicios": [
    {
      "id": "ej001",
      "titulo": "Nombre del ejercicio",
      "categoria": "PLC Básico",
      "dificultad": "facil",
      "tiempo_estimado": 15,
      "descripcion": "Descripción breve",
      "contenido": {
        "teoria": "Explicación teórica...",
        "elementos": []
      }
    }
  ]
}
```

### Agregar Nuevos Ejercicios

1. Edita `data/ejercicios.json`
2. Agrega un nuevo objeto al array `ejercicios`
3. Usa un `id` único
4. Guarda y recarga la aplicación

## 🎨 Personalización

### Colores

Edita las variables en `css/styles.css` o los gradientes en línea:

```css
/* Gradiente principal */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Categorías

Las categorías se generan automáticamente desde los ejercicios. Para agregar nuevas:

1. Usa el nombre de categoría en un ejercicio
2. Aparecerá automáticamente en los filtros

## 📊 Funcionalidades

### Filtros

- **Por categoría:** PLC Básico, Temporizadores, Contadores, etc.
- **Por dificultad:** Fácil, Medio, Difícil
- **Por estado:** Completados, Pendientes

### Seguimiento

- Ejercicios completados
- Porcentaje de progreso
- Tiempo de práctica
- Días en la plataforma

## 🐛 Solución de Problemas

### Los ejercicios no se cargan

1. **Verifica la estructura de carpetas:**
   ```
   ├── app.html (en la raíz)
   ├── data/
   │   └── ejercicios.json
   ```

2. **Verifica que ejercicios.json es válido:**
   - Usa un validador JSON online
   - Revisa comas, llaves y corchetes

3. **Revisa la consola del navegador:**
   - F12 → Console
   - Busca errores en rojo

### El login no funciona

1. **Limpia localStorage:**
   ```javascript
   localStorage.clear();
   ```
   Luego recarga la página

2. **Verifica que `js/auth.js` se carga correctamente**

### Errores 404 en GitHub Pages

1. **Verifica las rutas:**
   - Deben ser relativas: `data/ejercicios.json`
   - No usar rutas absolutas: `/data/ejercicios.json`

2. **Espera unos minutos:**
   - GitHub Pages puede tardar en actualizarse

## 🔄 Migración desde Versiones Antiguas

### Desde v2 o v3

Si tienes una versión anterior:

1. **Respalda tu `data/ejercicios.json`**
2. **Reemplaza todos los archivos** excepto `data/ejercicios.json`
3. **Limpia localStorage** para resetear usuarios:
   ```javascript
   localStorage.clear();
   ```

## 🚀 Próximas Funcionalidades

- [ ] Página individual de ejercicio con simulador
- [ ] Sistema de comparativa entre usuarios
- [ ] Exportar progreso a PDF
- [ ] Modo oscuro
- [ ] Ejercicios con multimedia (videos, imágenes)

## 📝 Licencia

MIT License - Libre para uso educativo y comercial

## 🤝 Contribuir

¿Quieres agregar ejercicios o mejorar la plataforma?

1. Haz un fork del repositorio
2. Crea una rama para tu función
3. Haz commit de tus cambios
4. Haz push a la rama
5. Abre un Pull Request

## 📧 Contacto

Para reportar problemas o sugerencias, abre un issue en GitHub.

---

**¡Feliz aprendizaje! 🎓**
