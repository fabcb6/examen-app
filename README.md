# Examen App

Aplicación de escritorio para aplicar exámenes de programación a estudiantes.

## Funcionalidades implementadas (hasta ahora)

- [x] Pantalla de ingreso con Nombre + Carnet
- [x] Carga de preguntas desde `resources/questions.json`
- [x] Soporte básico para los 3 tipos de preguntas:
  - Selección única
  - Respuesta breve
  - Desarrollo (con textarea)
- [x] Visualización de puntos por pregunta

## Próximos pasos importantes

- [ ] Implementar ejecución real de código Python (local)
- [ ] Mejorar el editor de código (Monaco Editor)
- [ ] Agregar generación de PDF
- [ ] Persistencia de respuestas
- [ ] Empaquetado para Windows

## Estructura

- `resources/questions.json` → Archivo con las preguntas del examen
- `src/` → Interfaz en React
- `electron/` → Lógica de Electron (main process)

## Cómo correr (desarrollo)

```bash
npm run dev
```

## Notas

- La ejecución de código Python se hará llamando al Python instalado en la máquina del estudiante.
- El archivo de preguntas se incluirá en la carpeta de recursos de la aplicación.
