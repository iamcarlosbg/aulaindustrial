# 🚀 AULA INDUSTRIAL V4 MEJORADA - FIREBASE HOSTING

## ✅ MEJORAS EN ESTA VERSIÓN:

- ✅ **600 ejercicios** (vs 20 anteriores)
- ✅ **4 áreas completas:**
  - ⚡ Electricidad Básica (150)
  - 🔧 Maniobra y Potencia (150)
  - 🤖 PLC Siemens (150)
  - 🔍 Diagnóstico Industrial (150)
- ✅ **Sin errores 404** (optimizado para Firebase Hosting)
- ✅ **Diseño limpio** tipo learning platform
- ✅ **Filtros funcionando** por categoría, dificultad y estado

---

## 📋 DESPLEGAR EN FIREBASE HOSTING (Windows)

### PASO 1: Instalar Firebase CLI

Abre **PowerShell** o **CMD** como Administrador:

```powershell
npm install -g firebase-tools
```

Verifica:
```powershell
firebase --version
```

### PASO 2: Login

```powershell
firebase login
```

- Se abrirá tu navegador
- Selecciona tu cuenta de Google
- Permite el acceso

### PASO 3: Ir a la carpeta del proyecto

```powershell
# Ejemplo (ajusta la ruta a donde extrajiste el ZIP):
cd C:\Users\TuUsuario\Downloads\v4-mejorada
```

Verifica que estás en la carpeta correcta:
```powershell
dir
```

Deberías ver:
- `index.html`
- `app.html`
- `firebase.json`
- `data` (carpeta con 4 archivos JSON)
- `js` (carpeta)
- `css` (carpeta)

### PASO 4: Inicializar Firebase

```powershell
firebase init hosting
```

**Responde:**
1. **Existing project** → `aula-industrial-50346`
2. **Public directory** → `.` (punto)
3. **Single-page app** → `N`
4. **GitHub deploys** → `N`
5. **Overwrite index.html** → `N`

### PASO 5: Desplegar

```powershell
firebase deploy --only hosting
```

Espera 30-60 segundos...

**¡LISTO!** ✅

Tu URL:
```
https://aula-industrial-50346.web.app
```

---

## 🔍 VERIFICAR QUE FUNCIONA:

1. Abre: https://aula-industrial-50346.web.app
2. Presiona **F12** (Consola)
3. Deberías ver:
   ```
   ✓ Cargado: data/electricidad_basica.json - 150 ejercicios
   ✓ Cargado: data/maniobra_potencia.json - 150 ejercicios
   ✓ Cargado: data/plc_siemens.json - 150 ejercicios
   ✓ Cargado: data/diagnostico_industrial.json - 150 ejercicios
   ✅ 600 ejercicios cargados correctamente
   ```

4. En los filtros deberías ver las 4 categorías:
   - ⚡ Electricidad Básica
   - 🔧 Maniobra y Potencia
   - 🤖 PLC Siemens
   - 🔍 Diagnóstico Industrial

5. Al hacer click en un ejercicio:
   - ✅ Se abre en modal
   - ✅ Muestra contexto, problema, datos técnicos
   - ✅ Muestra opciones de respuesta
   - ✅ Funciona correctamente (sin error 404)

---

## 🔄 ACTUALIZAR EN EL FUTURO:

```powershell
# 1. Edita archivos
# 2. Guarda cambios
# 3. Despliega
firebase deploy --only hosting
```

---

## 🐛 SOLUCIÓN DE PROBLEMAS:

### "command not found: firebase"
```powershell
# Reinstalar
npm install -g firebase-tools

# Cerrar y abrir PowerShell
```

### "No se cargan los ejercicios"

Verifica consola (F12). Si ves errores 404:
```
https://tu-url/data/electricidad_basica.json 404
```

**Solución:**
- Verifica que la carpeta `data/` tiene los 4 archivos JSON
- Redesplega: `firebase deploy --only hosting --force`

### "Solo aparece 1 categoría"

**Causa:** Solo se cargó 1 archivo JSON

**Solución:**
- Verifica que `data/` tiene 4 archivos
- Abre: `https://tu-url/data/electricidad_basica.json`
- Debería mostrar el JSON, no 404

---

## 📊 ESTRUCTURA DEL PROYECTO:

```
v4-mejorada/
├── index.html              ← Login/Registro
├── app.html                ← Aplicación principal
├── firebase.json           ← Configuración Firebase
├── data/                   ← 600 ejercicios
│   ├── electricidad_basica.json      (150)
│   ├── maniobra_potencia.json        (150)
│   ├── plc_siemens.json              (150)
│   └── diagnostico_industrial.json   (150)
├── js/
│   ├── app.js             ← Lógica principal (MEJORADO)
│   ├── auth.js            ← Autenticación
│   └── config.js          ← Firebase config
└── css/
    └── styles.css
```

---

## ✅ CHECKLIST:

- [ ] Firebase CLI instalado
- [ ] Login exitoso (`firebase login`)
- [ ] En carpeta correcta (`cd ...`)
- [ ] Firebase inicializado (`firebase init hosting`)
- [ ] Desplegado (`firebase deploy --only hosting`)
- [ ] URL funciona
- [ ] Login funciona
- [ ] 600 ejercicios cargan
- [ ] 4 categorías visibles
- [ ] Ejercicios se abren (sin 404)
- [ ] Filtros funcionan

---

## 🎉 RESULTADO FINAL:

**De:** V4 con 20 ejercicios de PLCs + errores 404 en GitHub Pages  
**A:** V4 mejorada con 600 ejercicios + 4 áreas + Firebase Hosting  
**Tiempo:** 5 minutos  
**Costo:** $0 (gratis)  

**Tu URL:** `https://aula-industrial-50346.web.app` ✅

---

**¡Todo funcionando perfectamente!** 🚀
