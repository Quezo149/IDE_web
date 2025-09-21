/* Configuracion Monaco Editor */
require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.49.0/min/vs' }});

/* Carga el módulo principal del editor y configura la instancia */
require(['vs/editor/editor.main'], function() {
    window.editor = monaco.editor.create(document.getElementById('editor-container'), {
        value: "print('Hello, World!')",    /* Valor inicial del editor */
        language: 'python',                 /* Lenguaje del editor por defecto */
        theme: 'vs-dark',                   /* Tema del editor */
        automaticLayout: true               /* Ajuste automático del layout */
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
    const terminalContainer = document.getElementById('terminal-container');

    const loadingMessage = document.createElement('div');
    loadingMessage.className = 'terminal-line output-succes'
    loadingMessage.innerText = 'Ejecutando...';
    terminalContainer.appendChild(loadingMessage);

    terminalContainer.scrollTop = terminalContainer.scrollHeight; /* Desplazamiento automático hacia abajo */

    try {
        const response = await fetch('http://127.0.0.1:8000/api/execute/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ language: language, code: code })
        });

        if (!response.ok) {
            throw new Error(`Error en la respuesta del servidor: ${response.statusText}`);
        }

        loadingMessage.remove(); /* Elimina el mensaje de "Ejecutando..." */

        const data = await response.json();

        const outLine = document.createElement('pre');
        outLine.className = 'terminal-line';

        if (data.error) {
            outLine.classList.add('output-error');
            outLine.innerText = `Error del servidor: ${data.error}`;
        } else {
            outLine.classList.add('output-success');
            outLine.innerText = `Salida:\n${data.output}`;
        }

        terminalOutput.appendChild(outLine);

    } catch (error) {
        loadingMessage.remove(); /* Elimina el mensaje de "Ejecutando..." en caso de error */
        const errorLine = document.createElement('pre');
        errorLine.className = 'terminal-line output-error';
        errorLine.innerText = `Error: ${error.message}`;
        console.error('Error al enviar el código:', error);
        terminalContainer.appendChild(errorLine);
    }

    terminalContainer.scrollTop = terminalContainer.scrollHeight; /* Desplazamiento automático hacia abajo */
});