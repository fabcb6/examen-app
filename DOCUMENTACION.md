# Documentación del Proyecto - Examen App

## 1. Descripción General

**Examen App** es una aplicación de escritorio multiplataforma diseñada para aplicar exámenes de programación de forma controlada. 

La aplicación permite a los estudiantes resolver preguntas de programación directamente en la plataforma, ejecutar su código de forma local y exportar sus respuestas en formato PDF al finalizar.

**Objetivo principal:** Facilitar la evaluación de habilidades de programación en entornos educativos (colegios, universidades o cursos), manteniendo el control sobre las preguntas y permitiendo la ejecución segura del código del estudiante.

---

## 2. Tecnologías Utilizadas

- **Electron** → Para crear la aplicación de escritorio.
- **React + TypeScript + Vite** → Interfaz de usuario moderna y tipada.
- **Monaco Editor** → Editor de código profesional (el mismo que usa Visual Studio Code).
- **Python** → Ejecución local del código de los estudiantes y generación de PDFs.
- **jsPDF** → Generación de documentos PDF desde el frontend.
- **GitHub Actions** → Compilación automática del instalador para Windows.

---

## 3. Funcionalidades Actuales

### Implementadas:

- **Inicio de sesión** con Nombre y Carnet del estudiante.
- **Carga de preguntas** desde un archivo JSON (`resources/questions.json`).
- **Tres tipos de preguntas soportadas**:
  - Selección única (opciones múltiples)
  - Respuesta breve
  - Desarrollo (con editor de código)
- **Editor de código** con Monaco Editor (con resaltado de sintaxis).
- **Ejecución de código Python** de forma local (usando Python instalado en la máquina del estudiante).
- **Captura de salida** (prints y mensajes de error).
- **Exportación a PDF** con todas las preguntas y respuestas del estudiante.
- **Interfaz con pestañas**: Problema, Editor de Código, Ejecución y Retroalimentación.
- **Autocompletado desactivado** en el editor (ideal para exámenes).
- **Compilación automática para Windows** mediante GitHub Actions.

### No implementadas (pendientes):

- Persistencia de respuestas (guardar progreso si se cierra la app).
- Retroalimentación automática avanzada.
- Manejo de múltiples exámenes o niveles.
- Control de tiempo (temporizador del examen).
- Firma digital o verificación de integridad del PDF.
- Mejoras de accesibilidad y diseño visual.
- Soporte para más lenguajes de programación (actualmente solo Python).

---

## 4. Estructura del Proyecto

```
examen-app/
├── electron/                  # Proceso principal de Electron
│   ├── main.ts
│   └── preload.ts
├── src/
│   ├── components/            # Componentes de React
│   ├── types/                 # Tipos de TypeScript
│   ├── utils/                 # Funciones utilitarias (ej: generatePdf)
│   └── App.tsx                # Componente principal
├── resources/
│   └── questions.json         # Archivo de preguntas (se incluye en el instalador)
├── .github/workflows/
│   └── build-windows.yml      # Workflow para compilar en Windows
├── package.json
└── ...
```

---

## 5. Cómo Ejecutar la Aplicación en Desarrollo (Mac)

### Requisitos:
- Node.js 18 o superior
- npm
- Python instalado (para probar la ejecución de código)

### Pasos:

1. Abre una terminal y navega a la carpeta del proyecto:

```bash
cd ~/Desktop/examen-app
```

2. Instala las dependencias (solo la primera vez):

```bash
npm install
```

3. Inicia la aplicación en modo desarrollo:

```bash
npm run dev
```

Esto levantará tanto Vite (para el frontend) como Electron.

---

## 6. Cómo Generar el Ejecutable para Windows

Existen dos formas principales:

### Opción Recomendada: Usar GitHub Actions (Automático)

Esta es la forma más fácil y profesional:

1. Asegúrate de que tu código esté subido a GitHub (en la rama `main`).
2. Ve a la pestaña **Actions** de tu repositorio.
3. Selecciona el workflow **"Build Windows Installer"**.
4. Haz clic en **"Run workflow"** → **Run workflow**.
5. Espera a que termine (puede tardar entre 10-20 minutos).
6. Una vez finalizado, entra al workflow y descarga el artefacto llamado **"Examen-App-Windows"**.
7. Dentro del zip encontrarás el instalador de Windows.

### Opción Manual (usando una máquina Windows)

1. Copia la carpeta del proyecto a una máquina Windows.
2. Abre la terminal en la carpeta del proyecto.
3. Ejecuta:

```bash
npm install
npm run build:win
```

4. El instalador se generará en la carpeta `dist`.

> **Nota:** Compilar directamente desde Mac para Windows puede ser complicado y no siempre funciona bien. Se recomienda usar GitHub Actions.

---

## 7. Requisitos del Usuario Final (Windows)

Para que la aplicación funcione correctamente en las computadoras de los estudiantes, se necesita:

- **Windows 10 o superior**
- **Python instalado** (versión 3.8 o superior recomendada)
- Python debe estar agregado al **PATH** del sistema

Durante la instalación de Python en Windows, es importante marcar la opción:
> "Add Python to PATH"

---

## 8. Cómo Modificar las Preguntas Después de Instalar la App

El archivo `questions.json` se incluye dentro de la aplicación. Sin embargo, también se recomienda copiarlo a una carpeta accesible (por ejemplo, en `Documentos/ExamenApp/`) para que los profesores puedan modificarlo sin necesidad de recompilar la aplicación.

En futuras versiones se puede mejorar este flujo.

---

## 9. Notas Técnicas Importantes

- La aplicación ejecuta el código Python del estudiante **localmente** usando el Python instalado en su computadora.
- Actualmente solo soporta **Python**.
- El editor de código tiene el autocompletado desactivado por completo (ideal para exámenes).
- El PDF se genera del lado del cliente usando la librería `jsPDF`.

---

## 10. Próximos Pasos Recomendados

1. **Probar la ejecución real de código** en Windows.
2. Mejorar la generación del PDF (incluir más información, diseño más profesional).
3. Agregar persistencia de respuestas (guardar progreso).
4. Mejorar la experiencia visual de la aplicación.
5. Agregar más tipos de preguntas o retroalimentación automática.
6. Configurar firma del instalador de Windows (opcional, pero recomendado para distribución).

---

## 11. Contacto y Mantenimiento

Este documento fue generado como guía para el desarrollo y mantenimiento del proyecto **Examen App**.

Se recomienda mantener actualizada esta documentación a medida que el proyecto evolucione.

---

**Fecha de última actualización:** Mayo 2026
