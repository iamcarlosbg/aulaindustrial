# 🚀 Guía de Inicio Rápido

## Instalación en 3 Pasos

### 📦 Paso 1: Preparar los archivos

Asegúrate de tener esta estructura:

```
tu-proyecto/
├── index.html          ← Página de login
├── app.html           ← Aplicación principal
├── css/
│   └── styles.css
├── js/
│   ├── auth.js        ← Sistema de autenticación
│   ├── app.js         ← Lógica de ejercicios
│   └── config.js      ← Configuración (opcional)
└── data/
    └── ejercicios.json ← Base de datos de ejercicios
```

### 🌐 Paso 2: Subir a GitHub

1. **Crea un repositorio en GitHub:**
   - Ve a https://github.com/new
   - Nombre: `aulaindustrial` (o el que prefieras)
   - Público
   - No inicialices con README

2. **Sube los archivos:**

   **Opción A - Desde la terminal:**
   ```bash
   git init
   git add .
   git commit -m "Versión inicial funcional"
   git branch -M main
   git remote add origin https://github.com/tu-usuario/aulaindustrial.git
   git push -u origin main
   ```

   **Opción B - Desde GitHub Desktop:**
   - File → Add Local Repository
   - Selecciona la carpeta
   - Commit to main
   - Publish repository

   **Opción C - Arrastrando archivos:**
   - Ve a tu repositorio en GitHub
   - Click en "uploading an existing file"
   - Arrastra todos los archivos
   - Commit changes

### ⚙️ Paso 3: Activar GitHub Pages

1. Ve a tu repositorio en GitHub
2. Click en **Settings** (⚙️)
3. En el menú lateral, click en **Pages**
4. En **Source**:
   - Branch: `main`
   - Folder: `/ (root)`
5. Click en **Save**
6. ¡Espera 1-2 minutos!

### ✅ Paso 4: Verificar

Tu sitio estará disponible en:
```
https://tu-usuario.github.io/aulaindustrial/
```

## 🔐 Primer Login

Usa el usuario demo para probar:

- **Email:** `demo@aulaindustrial.com`
- **Contraseña:** `demo123`

O registra tu propia cuenta desde la pestaña "Registro"

## 📝 Agregar Tus Ejercicios

### Formato básico:

Edita `data/ejercicios.json`:

```json
{
  "ejercicios": [
    {
      "id": "tu_ejercicio_001",
      "titulo": "Título del Ejercicio",
      "categoria": "Tu Categoría",
      "dificultad": "facil",
      "tiempo_estimado": 20,
      "descripcion": "Breve descripción del ejercicio",
      "contenido": {
        "teoria": "Explicación teórica completa...",
        "elementos": []
      }
    }
  ]
}
```

### Campos importantes:

- **id**: Único para cada ejercicio (ej: `ej001`, `timer_01`)
- **titulo**: Nombre descriptivo
- **categoria**: Agrupa ejercicios similares
- **dificultad**: `facil`, `medio` o `dificil`
- **tiempo_estimado**: Minutos estimados
- **descripcion**: Texto breve para la tarjeta

## 🎨 Personalización Rápida

### Cambiar colores:

Edita `js/config.js`:

```javascript
theme: {
    primaryGradient: "linear-gradient(135deg, #TU_COLOR1 0%, #TU_COLOR2 100%)",
    primaryColor: "#TU_COLOR",
    // ...
}
```

### Cambiar nombre de la app:

En `index.html` y `app.html`, busca:
```html
<h1>🏭 Aula Industrial</h1>
```

Cambia por:
```html
<h1>🎓 Tu Nombre</h1>
```

## 🔧 Comandos Útiles

### Limpiar datos de prueba:

Abre la consola (F12) y ejecuta:
```javascript
localStorage.clear();
location.reload();
```

### Ver usuarios registrados:

```javascript
JSON.parse(localStorage.getItem('aulaindustrial_users'))
```

### Ver progreso actual:

```javascript
JSON.parse(localStorage.getItem('aulaindustrial_current_user'))
```

## 📊 Probar Localmente

### Con Python:
```bash
python -m http.server 8000
```

### Con Node.js:
```bash
npx http-server
```

### Con PHP:
```bash
php -S localhost:8000
```

Luego abre: `http://localhost:8000`

## ❓ Problemas Comunes

### "No se cargan los ejercicios"

1. **Verifica la estructura:**
   ```
   ✓ app.html (en la raíz)
   ✓ data/ejercicios.json (en carpeta data)
   ```

2. **Revisa la consola (F12)**:
   - Busca mensajes de error
   - Debe decir: "✅ Ejercicios cargados desde..."

3. **Valida el JSON**:
   - Copia el contenido de `ejercicios.json`
   - Pégalo en https://jsonlint.com/
   - Corrige errores si los hay

### "El login no funciona"

1. **Limpia el navegador:**
   ```javascript
   localStorage.clear();
   ```

2. **Recarga con Ctrl+F5**

3. **Verifica que `js/auth.js` existe**

### "404 en GitHub Pages"

1. **Espera 2-3 minutos** después de activar Pages

2. **Verifica que los archivos están en la raíz:**
   ```
   ✗ aulaindustrial/v4/index.html  (mal)
   ✓ aulaindustrial/index.html     (bien)
   ```

3. **Fuerza reconstrucción:**
   - Haz un cambio pequeño
   - Commit y push
   - Espera 1-2 minutos

## 🎯 Checklist de Verificación

Antes de reportar un problema, verifica:

- [ ] Estructura de carpetas correcta
- [ ] `ejercicios.json` es JSON válido
- [ ] No hay errores en consola (F12)
- [ ] Probaste con usuario demo
- [ ] Esperaste 2-3 minutos después de subir a GitHub
- [ ] Usas rutas relativas (`data/` no `/data/`)
- [ ] Los archivos están en la raíz del repositorio

## 📚 Recursos

- **README completo:** [README.md](README.md)
- **Diagnóstico de problemas:** [DIAGNOSTICO.md](DIAGNOSTICO.md)
- **Ejemplos de ejercicios:** [data/ejercicios.json](data/ejercicios.json)

## 🎉 ¡Listo!

Tu plataforma está funcionando. Ahora puedes:

1. ✅ Crear una cuenta
2. ✅ Ver ejercicios
3. ✅ Filtrar por categoría/dificultad
4. ✅ Hacer seguimiento de tu progreso
5. ✅ Agregar tus propios ejercicios

---

**¿Necesitas ayuda?** Abre un issue en GitHub o revisa la documentación completa.
