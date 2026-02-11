# 🔧 SOLUCIÓN: 0 EJERCICIOS

## ❌ PROBLEMA

Al abrir `index.html` sale: **"0 ejercicios"**

---

## ✅ CAUSA

Estás abriendo el archivo con **`file://`** (haciendo doble click).

Los navegadores **bloquean** la carga de archivos JSON por seguridad (CORS) cuando se usa `file://`.

---

## 🚀 SOLUCIÓN (2 minutos)

### Opción 1: Python (Recomendado) ⭐

```bash
# 1. Abre terminal en la carpeta del proyecto
cd aula-industrial-final

# 2. Ejecuta el servidor
python -m http.server 8000

# 3. Abre en navegador
http://localhost:8000/index.html
```

### Opción 2: Node.js

```bash
# Si tienes Node instalado
npx http-server -p 8000

# Abre
http://localhost:8000/index.html
```

### Opción 3: PHP

```bash
php -S localhost:8000

# Abre
http://localhost:8000/index.html
```

### Opción 4: VS Code (si lo usas)

1. Instala extensión "Live Server"
2. Click derecho en `index.html`
3. "Open with Live Server"

---

## 🧪 VERIFICAR QUE FUNCIONA

### Prueba 1: Archivo de Test

1. Abre terminal en la carpeta
2. Ejecuta: `python -m http.server 8000`
3. Abre: http://localhost:8000/test.html
4. Click en "Probar Carga"
5. Debería decir: "✅ 600 ejercicios cargados"

### Prueba 2: Consola del Navegador

1. Abre http://localhost:8000/index.html
2. Presiona F12 (abrir consola)
3. Busca estos mensajes:

```
✓ Cargado: data/electricidad_basica.json - 150 ejercicios
✓ Cargado: data/maniobra_potencia.json - 150 ejercicios
✓ Cargado: data/plc_siemens.json - 150 ejercicios
✓ Cargado: data/diagnostico_industrial.json - 150 ejercicios
✅ 600 ejercicios cargados correctamente
```

---

## 📊 VERIFICACIÓN RÁPIDA

### ¿Cómo saber si estoy usando file:// o http://?

Mira la **barra de direcciones** del navegador:

❌ **MAL:** `file:///C:/Users/tu-usuario/aula-industrial/index.html`  
✅ **BIEN:** `http://localhost:8000/index.html`

---

## 🔍 DEBUG: Si aún no funciona

### 1. Verifica que los archivos JSON existen

```bash
# Debería mostrar 4 archivos
ls -la data/
```

Deberías ver:
- `electricidad_basica.json` (145K)
- `maniobra_potencia.json` (144K)
- `plc_siemens.json` (142K)
- `diagnostico_industrial.json` (144K)

### 2. Verifica el contenido de un JSON

```bash
# Ver primeras líneas
head data/electricidad_basica.json
```

Debería empezar con:
```json
{
  "exercises": [
    {
      "id": "elec-bás-001",
      ...
```

### 3. Abre la consola del navegador (F12)

**Si ves errores como:**
- `Failed to fetch` → Estás usando file://
- `CORS` → Estás usando file://
- `net::ERR_FILE_NOT_FOUND` → Los archivos JSON no están en `/data`

**Si NO ves errores** pero tampoco ve "✅ 600 ejercicios":
- El problema puede ser que no has activado Firebase aún
- Pero los ejercicios deberían cargarse igual

---

## 💡 EXPLICACIÓN TÉCNICA

### ¿Por qué NO funciona con file://?

Los navegadores modernos (Chrome, Firefox, Safari) **bloquean** las peticiones `fetch()` cuando:

1. La página se abre con `file://`
2. Intentas cargar archivos JSON locales
3. Es una medida de seguridad (CORS)

### ¿Por qué SÍ funciona con http://localhost?

Cuando usas un servidor local:

1. El navegador ve `http://localhost:8000`
2. Considera que es un servidor web "real"
3. Permite las peticiones `fetch()` sin problema

---

## 🎯 RESUMEN RÁPIDO

**Problema:** 0 ejercicios  
**Causa:** Abriendo con `file://`  
**Solución:** Usar servidor local

```bash
# 1. Terminal en la carpeta
cd aula-industrial-final

# 2. Servidor
python -m http.server 8000

# 3. Abrir
http://localhost:8000/index.html

# 4. ✅ Debería mostrar 600 ejercicios
```

---

## ✅ CHECKLIST

- [ ] Terminal abierta en carpeta correcta
- [ ] Ejecutado `python -m http.server 8000`
- [ ] Abierto http://localhost:8000/index.html (NO file://)
- [ ] Consola (F12) muestra "✅ 600 ejercicios cargados"
- [ ] Sidebar muestra 4 áreas
- [ ] Grid muestra ejercicios

**Si cumples todo eso → ¡FUNCIONA!** 🎉

---

## 🚨 IMPORTANTE PARA PRODUCCIÓN

Cuando subas a **GitHub Pages**:
- ✅ Funciona automáticamente (es servidor web)
- ✅ No necesitas hacer nada especial
- ✅ Los ejercicios se cargarán correctamente

**Este problema SOLO ocurre en desarrollo local con file://**

---

## 📞 OTRAS SOLUCIONES

### Windows: Usar IIS

1. Activa IIS en "Características de Windows"
2. Copia archivos a `C:\inetpub\wwwroot\aula`
3. Abre http://localhost/aula/index.html

### Mac: Servidor PHP integrado

```bash
php -S localhost:8000
```

### Linux: Apache/Nginx

Copia archivos a `/var/www/html`

---

**En resumen: SIEMPRE usa un servidor web, nunca file://** ⚠️
