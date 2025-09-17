/* Configuracion Monaco Editor */
require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.49.0/min/vs' }});

/* Carga el módulo principal del editor y configura la instancia */
require(['vs/editor/editor.main'], function() {
    window.editor = monaco.editor.create(document.getElementById('editor-container'), {
        value: "print('Hello, World!')",    /* Valor inicial del editor */
        language: 'python',                 /* Lenguaje del editor por defecto */
        theme: 'vs-dark',                   /* Tema del editor */
        automaticLayout: true                /* Ajuste automático del layout */
    });
    console.log("Monaco Editor cargado correctamente");

    const initialLanguage = document.getElementById('language-select').value; /* Lenguaje inicial */
    if (initialLanguage && initialLanguage !== 'python') {
        monaco.editor.setModelLanguage(window.editor.getModel(), initialLanguage); /* Cambia el lenguaje si no es python */
    }
});

/* Referencia de elementos de la interfaz */
const runButton = document.getElementById('run-button');           /* Botón de ejecutar */
const languageSelect = document.getElementById('language-select'); /* Selector de lenguaje */
const terminalOutput = document.getElementById('terminal-output'); /* Área de salida de la terminal */

/* Evento seleccionar lenguaje */
languageSelect.addEventListener('change', () => {
    const code = window.editor.getValue();
    terminalOutput.innerText = `Lenguaje cambiado a ${languageSelect.value}\n\n`; /* Mostrar lenguaje actual en terminal */
});