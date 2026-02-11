# 🏭 INDUSTRAIN - Plataforma de Formación Industrial Práctica

## 📋 Descripción

**IndusTrain** es una plataforma web educativa interactiva diseñada para la formación práctica en electricidad industrial y automatización, con especial enfoque en sistemas Siemens (TIA Portal, PLC S7-1200/S7-1500).

La plataforma simula situaciones industriales reales donde el usuario actúa como técnico de mantenimiento, diagnosticando y resolviendo fallos típicos de planta.

---

## 🎯 Características Principales

✅ **Aprendizaje basado en casos reales** - Ejercicios inspirados en situaciones industriales auténticas
✅ **Arquitectura modular** - Añade nuevos ejercicios sin modificar el código base
✅ **Feedback técnico detallado** - Explicaciones profesionales de cada solución
✅ **Progreso persistente** - Guarda automáticamente ejercicios completados
✅ **Diseño industrial profesional** - Interfaz inspirada en consolas de control industrial
✅ **Filtrado inteligente** - Por área formativa y nivel de dificultad
✅ **Responsive** - Funciona en desktop, tablet y móvil

---

## 📁 Estructura de Archivos

```
industrain/
│
├── index.html                      # Página principal (interfaz)
│
├── css/
│   └── style.css                   # Estilos completos de la aplicación
│
├── js/
│   ├── loader.js                   # Sistema de carga de ejercicios desde JSON
│   └── app.js                      # Lógica principal de la aplicación
│
├── data/                           # ⚙️ EJERCICIOS (archivos JSON)
│   ├── electricidad_basica.json    # Ejercicios de electricidad fundamental
│   ├── maniobra_potencia.json      # Arranque motores, contactores, etc.
│   ├── plc_siemens.json            # PLC S7-1200/1500, TIA Portal
│   └── diagnostico_industrial.json # Resolución de fallos complejos
│
└── README.md                       # Este archivo
```

---

## 🚀 Instalación y Uso

### Opción 1: Uso Local Simple

1. Descarga todos los archivos manteniendo la estructura de carpetas
2. Abre `index.html` directamente en tu navegador web
3. ¡Listo! La aplicación funciona completamente offline

### Opción 2: Servidor Web Local (Recomendado para desarrollo)

```bash
# Con Python 3
python -m http.server 8000

# Con Node.js
npx http-server -p 8000

# Luego abre: http://localhost:8000
```

### Opción 3: Despliegue en Servidor Web

Sube todos los archivos a tu hosting web (Apache, Nginx, etc.) manteniendo la estructura de carpetas.

---

## 📝 Cómo Añadir Nuevos Ejercicios

### ✨ Lo Mejor de IndusTrain: ¡No necesitas tocar el código!

Para añadir nuevos ejercicios solo necesitas editar (o crear) archivos JSON en la carpeta `data/`.

### Formato JSON de un Ejercicio

Cada ejercicio debe seguir esta estructura:

```json
{
  "id": "codigo-unico",
  "area": "Nombre del Área Formativa",
  "nivel": "básico | intermedio | avanzado",
  "titulo": "Título descriptivo del problema",
  "contexto": "Descripción del entorno industrial y situación inicial",
  "problema": "Descripción clara del fallo o incidencia detectada",
  "datos_tecnicos": {
    "Campo1": "Valor1",
    "Campo2": "Valor2",
    "CampoN": "ValorN"
  },
  "opciones": [
    "Opción de diagnóstico 1",
    "Opción de diagnóstico 2",
    "Opción de diagnóstico 3",
    "Opción de diagnóstico 4"
  ],
  "respuesta_correcta": 0,
  "explicacion": "Explicación técnica detallada de la solución correcta, causas raíz y medidas correctivas"
}
```

### Campos Explicados

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | String | Identificador único (ej: "plc-007", "elec-015") |
| `area` | String | Área formativa (debe coincidir entre ejercicios del mismo tema) |
| `nivel` | String | **Exactamente**: "básico", "intermedio" o "avanzado" (lowercase) |
| `titulo` | String | Título corto y descriptivo del problema |
| `contexto` | String | Situación inicial, equipos involucrados, historial |
| `problema` | String | Síntomas observados, qué falla exactamente |
| `datos_tecnicos` | Object/Array | Información técnica relevante (tensiones, modelos, mediciones) |
| `opciones` | Array[String] | 3-5 opciones de diagnóstico (máximo 6 recomendado) |
| `respuesta_correcta` | Number | Índice de la opción correcta (empieza en 0) |
| `explicacion` | String | Explicación detallada, razonamiento técnico, soluciones |

### Ejemplo Completo - Nuevo Ejercicio

```json
{
  "id": "plc-007",
  "area": "PLC Siemens",
  "nivel": "intermedio",
  "titulo": "Contador de piezas no se resetea",
  "contexto": "Línea de empaquetado con PLC S7-1200 contando piezas mediante sensor óptico en I0.4. Al completar 100 piezas, debe resetear el contador y activar una señal de fin de lote.",
  "problema": "El contador cuenta correctamente hasta 100, pero no se resetea. Sigue incrementando: 101, 102, 103... El operador debe resetear manualmente desde el HMI cada vez.",
  "datos_tecnicos": {
    "PLC": "S7-1200 CPU 1214C",
    "Bloque": "FC10 - Contador de piezas",
    "Variable contador": "DB10.DBD0 (DINT)",
    "Condición reset": "Contador >= 100",
    "Lenguaje": "Ladder (LAD)"
  },
  "opciones": [
    "El DB10 está configurado como 'optimized' impidiendo acceso directo",
    "Falta un network de reset con lógica SET/RESET",
    "La condición de reset usa '=' en lugar de '>='",
    "El contador se resetea pero inmediatamente vuelve a incrementar en el mismo ciclo"
  ],
  "respuesta_correcta": 3,
  "explicacion": "El contador se resetea correctamente pero se vuelve a incrementar en el mismo scan. El problema es la ejecución secuencial en un solo ciclo del PLC: 1) El sensor está activo (I0.4=TRUE), 2) El contador llega a 100, 3) La lógica de reset pone el contador en 0, 4) En el MISMO CICLO, la lógica de conteo vuelve a ejecutarse y detecta I0.4=TRUE (el sensor sigue viendo la pieza), incrementando de 0 a 1. Solución: Usar un flanco positivo (P) en la entrada de conteo en lugar de contacto directo, o implementar un bit de bloqueo que se active al resetear y se desactive cuando I0.4 vuelva a FALSE. Código correcto: usar instrucción CTU (Count Up) con entrada CU en flanco positivo, o añadir lógica de anti-rebote con memoria intermedia."
}
```

---

## 🎓 Áreas Formativas Disponibles

### ⚡ Electricidad Básica
- Circuitos trifásicos
- Protecciones eléctricas
- Fusibles y magnetotérmicos
- Diferenciales y puestas a tierra

### 🔌 Maniobra y Potencia
- Arranque directo de motores
- Arranque estrella-triángulo
- Inversión de giro
- Contactores y relés térmicos
- Variadores de frecuencia

### 🤖 PLC Siemens
- S7-1200 / S7-1500
- TIA Portal
- Entradas/Salidas digitales
- Comunicaciones industriales (PROFINET, Modbus)
- Programación en LAD, FBD, SCL
- Diagnóstico de fallos

### 🔧 Diagnóstico Industrial
- Análisis de síntomas
- Uso de instrumentación
- Resolución de averías complejas
- Interferencias electromagnéticas
- Buses de campo

---

## 🎨 Personalización

### Cambiar Colores del Tema

Edita las variables CSS en `css/style.css`:

```css
:root {
    --primary-bg: #0a0e1a;        /* Fondo principal */
    --accent-primary: #00d4ff;    /* Color de acento */
    --accent-warning: #fbbf24;    /* Advertencias */
    --accent-success: #10b981;    /* Éxito */
    --accent-danger: #ef4444;     /* Peligro */
}
```

### Añadir Nueva Área Formativa

1. Crea un nuevo archivo JSON en `data/` (ej: `neumatica.json`)
2. Añade ejercicios siguiendo el formato estándar
3. Usa el mismo nombre de área en todos los ejercicios relacionados
4. **¡La aplicación detectará automáticamente la nueva área!**

Ejemplo: `data/neumatica.json`

```json
{
  "exercises": [
    {
      "id": "neum-001",
      "area": "Neumática Industrial",
      "nivel": "básico",
      "titulo": "Cilindro neumático no retrae",
      ...
    }
  ]
}
```

### Modificar Niveles de Dificultad

Los niveles **deben ser exactamente** (respeta minúsculas):
- `básico`
- `intermedio`
- `avanzado`

---

## 💾 Sistema de Progreso

La aplicación guarda automáticamente en `localStorage` del navegador:
- Ejercicios completados
- Fecha de último acceso

Para **resetear el progreso**:
```javascript
// En la consola del navegador:
localStorage.removeItem('industrain_progress');
location.reload();
```

---

## 🔍 Troubleshooting

### Los ejercicios no se cargan

1. Verifica la consola del navegador (F12) en busca de errores
2. Confirma que los archivos JSON tienen sintaxis correcta (usa JSONLint.com)
3. Asegúrate de que las rutas en `loader.js` coinciden con tus archivos

### El diseño se ve mal

1. Verifica que `css/style.css` se carga correctamente
2. Comprueba que las fuentes de Google Fonts se cargan (requiere conexión)
3. Prueba en otro navegador (Chrome, Firefox, Edge)

### Los filtros no funcionan

Verifica que el campo `nivel` en los JSON use **exactamente**:
- "básico" (con tilde, minúsculas)
- "intermedio" (minúsculas)
- "avanzado" (minúsculas)

---

## 📊 Estadísticas del Proyecto

**Ejercicios Incluidos**: 20 ejercicios industriales reales
- ⚡ Electricidad Básica: 5 ejercicios
- 🔌 Maniobra y Potencia: 4 ejercicios
- 🤖 PLC Siemens: 5 ejercicios
- 🔧 Diagnóstico Industrial: 6 ejercicios

**Niveles de Dificultad**:
- Básico: Conceptos fundamentales
- Intermedio: Casos prácticos comunes
- Avanzado: Diagnóstico complejo, múltiples variables

---

## 🛠️ Tecnologías Utilizadas

- **HTML5** - Estructura semántica
- **CSS3** - Diseño moderno con variables CSS, Grid, Flexbox
- **JavaScript ES6+** - Lógica cliente, async/await, clases
- **LocalStorage API** - Persistencia de progreso
- **JSON** - Almacenamiento de ejercicios
- **Google Fonts** - Tipografía profesional (Rajdhani, JetBrains Mono)

---

## 📖 Mejores Prácticas para Crear Ejercicios

### ✅ Ejercicios de Calidad

1. **Contexto realista**: Basa el ejercicio en situaciones industriales reales
2. **Datos técnicos precisos**: Incluye modelos, tensiones, especificaciones reales
3. **Explicación completa**: No solo qué es correcto, sino POR QUÉ y CÓMO solucionarlo
4. **Múltiples opciones válidas**: Las opciones incorrectas deben ser plausibles
5. **Nivel apropiado**: 
   - Básico: 1 variable, solución directa
   - Intermedio: 2-3 variables, requiere análisis
   - Avanzado: Múltiples factores, diagnóstico complejo

### ❌ Evitar

- Ejercicios puramente teóricos sin aplicación práctica
- Opciones obviamente incorrectas o sin sentido
- Explicaciones vagas tipo "está roto"
- Datos técnicos irrelevantes o inventados
- Preguntas con truco sin valor formativo

---

## 🤝 Contribuir

### ¿Eres docente o profesional industrial?

¡Comparte tus casos reales! Los mejores ejercicios vienen de la experiencia práctica:

1. **Identifica un fallo real** que hayas resuelto
2. **Anonimiza** datos sensibles (nombres de empresas, ubicaciones)
3. **Documenta**: situación, síntomas, diagnóstico, solución
4. **Crea el JSON** siguiendo el formato
5. Comparte tu ejercicio

---

## 📜 Licencia

Este proyecto es de código abierto para uso educativo.

**Permitido**:
- Uso en centros educativos
- Modificación y personalización
- Distribución no comercial

**Requerido**:
- Mantener créditos originales
- Compartir mejoras con la comunidad

---

## 👨‍🏫 Para Formadores

### Uso en Aula

IndusTrain puede usarse como:
- **Evaluación diagnóstica**: Nivel inicial de estudiantes
- **Práctica guiada**: Casos para resolver en clase
- **Autoaprendizaje**: Los estudiantes practican a su ritmo
- **Evaluación formativa**: Verificar comprensión de conceptos

### Personalización para tu Curso

1. Crea un nuevo archivo JSON con ejercicios específicos de tu temario
2. Elimina los archivos JSON de áreas que no impartes
3. Ajusta niveles según tu criterio pedagógico
4. Añade ejercicios progresivos: básico → intermedio → avanzado

---

## 🎯 Roadmap (Futuras Mejoras)

- [ ] Sistema de badges/logros
- [ ] Exportar progreso a PDF
- [ ] Modo examen (tiempo limitado)
- [ ] Ejercicios con imágenes/esquemas
- [ ] Simulaciones interactivas
- [ ] Integración con LMS (Moodle, Canvas)
- [ ] Ranking y competición entre estudiantes
- [ ] Área de neumática industrial
- [ ] Área de mecánica industrial
- [ ] Ejercicios de seguridad industrial

---

## 📞 Soporte

¿Problemas técnicos? ¿Sugerencias?

1. Revisa la sección **Troubleshooting** de este README
2. Verifica la consola del navegador (F12) en busca de errores
3. Comprueba que los JSON tienen sintaxis correcta

---

## 🌟 Agradecimientos

Gracias a todos los técnicos e ingenieros industriales que compartieron sus experiencias para crear ejercicios realistas.

Este proyecto nació de la necesidad de tener formación práctica y aplicada, lejos de la teoría académica tradicional.

---

**¡Buena suerte en tu formación industrial! 🏭⚡🤖**

---

*Última actualización: 2024*
*Versión: 1.0.0*
