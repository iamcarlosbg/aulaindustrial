# 🚀 DESPLIEGUE EN GITHUB PAGES

## ✅ Guía paso a paso para publicar Aula Industrial

---

## 📋 REQUISITOS

- [ ] Cuenta de GitHub (gratis)
- [ ] Git instalado en tu PC
- [ ] Los archivos de Aula Industrial extraídos

---

## 🎯 PASOS RÁPIDOS (10 minutos)

### 1️⃣ Crear Repositorio en GitHub (2 min)

1. Ve a https://github.com
2. Click en el **+** (arriba derecha) → "New repository"
3. **Nombre:** `aula-industrial` (o el que quieras)
4. **Público** o Privado (ambos funcionan)
5. **NO marques** "Add README"
6. Click "Create repository"

---

### 2️⃣ Subir Archivos (3 min)

**Opción A - Desde terminal/CMD:**

```bash
# 1. Abre terminal en la carpeta aula-industrial-final
cd aula-industrial-final

# 2. Inicializar Git
git init

# 3. Añadir todos los archivos
git add .

# 4. Hacer commit
git commit -m "Aula Industrial v3.0 - Plataforma completa"

# 5. Conectar con tu repositorio (copia la URL de GitHub)
git remote add origin https://github.com/TU-USUARIO/aula-industrial.git

# 6. Subir
git branch -M main
git push -u origin main
```

**Opción B - Desde GitHub Web:**

1. En tu repositorio, click "uploading an existing file"
2. Arrastra TODOS los archivos de la carpeta
3. Scroll abajo → "Commit changes"

---

### 3️⃣ Activar GitHub Pages (2 min)

1. En tu repositorio, ve a **"Settings"** (arriba)
2. Menú lateral → **"Pages"**
3. **Source:** Deploy from a branch
4. **Branch:** `main` 
5. **Folder:** `/ (root)`
6. Click **"Save"**
7. ⏳ Espera 1-2 minutos

---

### 4️⃣ ¡Listo! Tu Web Está Online (1 min)

Tu URL será:
```
https://TU-USUARIO.github.io/aula-industrial/
```

**Ejemplo:**
- Usuario: `juanperez`
- Repo: `aula-industrial`
- URL: `https://juanperez.github.io/aula-industrial/`

---

## ✅ VERIFICAR QUE FUNCIONA

1. **Abre tu URL**
2. Deberías ver "AULA INDUSTRIAL"
3. **Consola (F12):** Busca `✅ 600 ejercicios cargados`
4. **Sidebar:** 4 áreas (Electricidad, Maniobra, PLCs, Diagnóstico)
5. **Grid:** Ejercicios visibles

---

## 🔧 PERSONALIZAR TU URL

### Opción 1: Usar dominio personalizado

Si tienes un dominio (ej: `aulaindustrial.com`):

1. GitHub Pages → Settings → Pages
2. "Custom domain" → Escribe tu dominio
3. En tu proveedor de dominio (GoDaddy, etc):
   - Añade CNAME: `www` → `TU-USUARIO.github.io`
   - Añade A records apuntando a GitHub

### Opción 2: URL más corta

Si el repo se llama igual que tu usuario:

- Repo: `TU-USUARIO.github.io`
- URL: `https://TU-USUARIO.github.io/` (sin subcarpeta)

---

## 📝 ACTUALIZAR LA WEB

Cuando hagas cambios:

```bash
# 1. Modifica archivos
# 2. Guarda cambios
git add .
git commit -m "Descripción del cambio"
git push

# ⏳ Espera 1-2 minutos y se actualiza automáticamente
```

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### "404 - Page not found"

**Causa:** El archivo principal debe llamarse `index.html`

**Solución:** 
- ✅ Ya lo tenemos: El archivo se llama `index.html`
- Verifica que se subió correctamente

### "Los ejercicios no cargan"

**Causas posibles:**
1. Firebase no activado (normal, actívalo después)
2. Archivos JSON no se subieron

**Verificación:**
```
# En tu repo, deberías ver:
aula-industrial/
├── index.html          ✅
├── data/
│   ├── electricidad_basica.json     ✅
│   ├── maniobra_potencia.json       ✅
│   ├── plc_siemens.json             ✅
│   └── diagnostico_industrial.json  ✅
├── js/                 ✅
└── css/                ✅
```

### "La página tarda en cargar"

**Normal:** La primera vez GitHub Pages tarda 1-2 minutos en compilar

**Solución:** Espera y refresca la página

### "Changes not appearing"

GitHub Pages cachea agresivamente:

```bash
# Forzar recarga sin caché
Ctrl + F5 (Windows/Linux)
Cmd + Shift + R (Mac)
```

---

## 🎨 PERSONALIZACIÓN ANTES DE SUBIR

### 1. Redes Sociales

Edita `index.html` (líneas 113-143):

```html
<a href="https://facebook.com/TUPAGINA" ...>
<a href="https://instagram.com/TUPAGINA" ...>
<a href="https://youtube.com/@TUCANAL" ...>
<a href="https://twitter.com/TUPAGINA" ...>
<a href="https://linkedin.com/company/TUEMPRESA" ...>
```

### 2. Email de Contacto

Edita `index.html` (línea ~147):

```html
<a href="mailto:TU-EMAIL@example.com">TU-EMAIL@example.com</a>
```

### 3. Datos de Firebase

Ya están configurados en `js/firebase-config.js` ✅

---

## 📊 ESTRUCTURA DEL REPOSITORIO

```
aula-industrial/              ← Tu repo de GitHub
├── index.html               ← Página principal ⭐
├── test.html                ← Test de ejercicios
├── README.md                ← Documentación
├── INICIO_RAPIDO.md         ← Guía rápida
├── SOLUCION_0_EJERCICIOS.md ← Debug
├── css/
│   └── style.css
├── js/
│   ├── firebase-config.js   ← Tu Firebase
│   ├── firebase-auth.js
│   ├── social-share.js
│   ├── app-firebase.js
│   └── loader.js
└── data/                    ← 600 ejercicios
    ├── electricidad_basica.json
    ├── maniobra_potencia.json
    ├── plc_siemens.json
    └── diagnostico_industrial.json
```

---

## ⚡ COMANDOS GIT ÚTILES

```bash
# Ver estado
git status

# Ver cambios
git diff

# Deshacer cambios locales
git checkout -- archivo.html

# Ver historial
git log --oneline

# Crear rama nueva
git checkout -b nueva-funcionalidad

# Volver a main
git checkout main
```

---

## 🔒 FIREBASE + GITHUB PAGES

### Autorizar dominio en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/project/aula-industrial-50346)
2. Authentication → Settings → Authorized domains
3. Añade tu dominio de GitHub:
   ```
   TU-USUARIO.github.io
   ```
4. Save

**Importante:** Sin este paso, el login con Google/Facebook NO funcionará.

---

## 📈 ANALYTICS (Opcional)

### Google Analytics

1. Crea cuenta en analytics.google.com
2. Obtén tu ID (ej: `G-XXXXXXXXXX`)
3. Añade al final de `index.html` (antes de `</head>`):

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## 🎯 CHECKLIST COMPLETO

- [ ] Cuenta GitHub creada
- [ ] Repositorio creado
- [ ] Archivos subidos
- [ ] GitHub Pages activado
- [ ] URL funciona (https://TU-USUARIO.github.io/...)
- [ ] Ejercicios cargan (600 total)
- [ ] Firebase activado (Auth + Firestore)
- [ ] Dominio autorizado en Firebase
- [ ] URLs personalizadas (redes, email)
- [ ] Test funcionando (test.html)

---

## 🚀 DESPUÉS DE PUBLICAR

### Compartir tu plataforma:

```
🏭 Aula Industrial - Plataforma de Formación Técnica

✅ 600 ejercicios profesionales
✅ Electricidad, PLCs, Diagnóstico
✅ Sistema de progreso
✅ Ranking global
✅ 100% Gratis

👉 https://TU-USUARIO.github.io/aula-industrial/

#FormaciónIndustrial #PLCs #Electricidad #Automatización
```

---

## 💡 TIPS PRO

### 1. README.md en GitHub

Crea un `README.md` bonito para tu repo:

```markdown
# 🏭 Aula Industrial

Plataforma de formación técnica con 600 ejercicios profesionales.

## 🚀 Demo

👉 [Ver plataforma](https://TU-USUARIO.github.io/aula-industrial/)

## ✨ Características

- 600 ejercicios en 4 áreas
- Login con Google/Facebook
- Sistema de progreso
- Ranking global
- Newsletter
- Compartir en redes

## 📸 Screenshots

(Añade imágenes)
```

### 2. Usar ramas para desarrollo

```bash
# Rama para cambios
git checkout -b desarrollo

# Cuando esté listo
git checkout main
git merge desarrollo
git push
```

### 3. GitHub Actions (CI/CD)

Para testing automático, pero eso es avanzado.

---

## ✅ RESUMEN

**Pasos esenciales:**
1. Crear repo en GitHub
2. Subir archivos
3. Activar GitHub Pages
4. Listo → `https://TU-USUARIO.github.io/aula-industrial/`

**El archivo principal es `index.html`** - GitHub Pages lo reconoce automáticamente.

**¡Tu plataforma estará online en 10 minutos!** 🎉

---

**URL de ejemplo final:**
```
https://juanperez.github.io/aula-industrial/
```

**Funcionará perfecto** - Los ejercicios se cargarán, Firebase funcionará, todo estará listo. ✅
