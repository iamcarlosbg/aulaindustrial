# 🔧 CORRECCIÓN: Error 404 Cloudflare

## ❌ ERROR QUE ESTÁS VIENDO:

```
GET https://iamcarlosbg.github.io/cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js 
net::ERR_ABORTED 404 (Not Found)
```

---

## ✅ CAUSA:

Hay un script de Cloudflare en el `index.html` que NO debería estar ahí.

Este script se añadió por error y causa que **los ejercicios no carguen**.

---

## 🚀 SOLUCIÓN (2 minutos)

### Opción 1: Reemplazar el archivo index.html

**Descarga el nuevo ZIP** que te acabo de dar (arriba).

Este ZIP ya tiene el `index.html` **limpio y corregido**.

1. Extrae el ZIP
2. Reemplaza tu `index.html` actual en GitHub
3. Haz commit y push
4. ✅ ¡Listo!

---

### Opción 2: Editar manualmente

Si prefieres editar tú mismo:

1. Abre `index.html` en un editor de texto
2. Busca esta línea (cerca de la línea 178):

```html
<script data-cfasync="false" src="/cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js"></script>
```

3. **ELIMÍNALA COMPLETAMENTE**

4. La línea debería quedar así:

**ANTES (❌ MAL):**
```html
<script data-cfasync="false" src="/cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js"></script><script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
```

**DESPUÉS (✅ BIEN):**
```html
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
```

5. Guarda el archivo
6. Sube a GitHub

---

## 📝 PASOS PARA ACTUALIZAR EN GITHUB:

### Si editas localmente:

```bash
# 1. Edita el index.html (elimina la línea de Cloudflare)

# 2. Guarda y haz commit
git add index.html
git commit -m "Eliminar script de Cloudflare"
git push
```

### Si editas directamente en GitHub:

1. Ve a tu repositorio en GitHub
2. Navega a `v10/index.html`
3. Click en el **lápiz** (Edit)
4. Busca la línea con `cloudflare-static`
5. Elimínala
6. Scroll abajo → **Commit changes**

---

## ✅ VERIFICAR QUE FUNCIONA:

1. Espera 1-2 minutos (GitHub Pages necesita recompilar)
2. Abre tu URL: `https://iamcarlosbg.github.io/aulaindustrial/v10/`
3. Presiona **Ctrl + Shift + R** (refresco completo, limpia caché)
4. Abre consola (F12)
5. Deberías ver:

```
✓ Cargado: data/electricidad_basica.json - 150 ejercicios
✓ Cargado: data/maniobra_potencia.json - 150 ejercicios
✓ Cargado: data/plc_siemens.json - 150 ejercicios
✓ Cargado: data/diagnostico_industrial.json - 150 ejercicios
✅ 600 ejercicios cargados correctamente
```

---

## 🎯 RESUMEN:

**Problema:** Script de Cloudflare que no existe → bloquea carga de ejercicios

**Solución:** Eliminar esa línea del `index.html`

**Resultado:** ✅ 600 ejercicios cargan correctamente

---

## 🔍 POR QUÉ PASÓ ESTO:

Ese script lo añade Cloudflare automáticamente cuando sirve páginas para:
- Ofuscar emails (protección anti-spam)
- Optimizar carga

Como GitHub Pages NO usa Cloudflare, el script no existe y causa el error 404.

---

## ⚠️ IMPORTANTE:

Este error **NO afecta** a:
- Firebase (sigue funcionando)
- Login (sigue funcionando)
- CSS (sigue funcionando)

**SOLO afecta** la carga de los archivos JSON de ejercicios.

Por eso ves "0 ejercicios" pero el resto funciona.

---

## 📞 SI AÚN NO FUNCIONA:

Después de aplicar la corrección, si aún ves 0 ejercicios:

1. Limpia caché: **Ctrl + Shift + R**
2. Prueba en modo incógnito
3. Verifica consola (F12) → Dime qué errores aparecen
4. Verifica que los archivos JSON estén en: `v10/data/`

---

## ✅ ARCHIVO CORREGIDO:

El nuevo ZIP que te di arriba ya tiene el `index.html` limpio.

**Solo reemplázalo y listo** 🚀

---

**Tiempo de corrección:** 2 minutos  
**Dificultad:** Muy fácil  
**Resultado:** ✅ 600 ejercicios funcionando
