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
const languageSelect = document.getElementById('language-select'); /* Selector de lenguaje */
const terminalOutput = document.getElementById('terminal-output'); /* Área de salida de la terminal */
const runButton = document.getElementById('run-button');           /* Botón "Run" */

/* Evento seleccionar lenguaje */
languageSelect.addEventListener('change', () => {
    const code = window.editor.getValue();
    terminalOutput.innerText = `Lenguaje cambiado a ${languageSelect.value}\n\n`; /* Mostrar lenguaje actual en terminal */
});

/* Evento botón "Run" */
runButton.addEventListener('click', async () => {
    const code = window.editor.getValue();
    const language = languageSelect.value;

    terminalOutput.innerText = `Enviando código en ${language}:\n${code}`; /* Mensaje de ejecución */

    try {
        const response = await fetch('http://127.0.0.1:8000/api/execute/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ language: language, code: code })
        });

        if (!response.ok) {
            throw new Error(`Error en la respuesta del servidor: ${response.statusText}`);
        }
    } catch (error) {
        terminalOutput.innerText += `\nError: ${error.message}`;
        console.error('Error al enviar el código:', error);
    }
});