document.addEventListener('DOMContentLoaded', function() {
    var editor = CodeMirror.fromTextArea(document.getElementById('code'), {
        lineNumbers: true,
        mode: 'text/x-csrc',
        autoCloseBrackets: true,
        theme: 'material-palenight'
    });
    const btn_run = document.querySelector('#execute-btn');

    if (localStorage.getItem("code") != null) {
        editor.setValue(localStorage.getItem("code"));
        var saved = true;
    } else {
        var saved = false;
    }

    btn_run.addEventListener('click', async function() {
        const code = editor.getValue();
        const outputBox = document.getElementById('output');
        outputBox.className = "";
        outputBox.className = "output-default";

        if (!saved) {
            outputBox.textContent = "code not saved";
            return;
        }
        
        outputBox.textContent = "> Compiling...\n> Executing...";

        try {
            const response = await fetch('/execute', {
                method: 'POST',
                body: code
            });
            const result = await response.text();
            if (!response.ok) {
                outputBox.className = "";
                outputBox.className = "output-error";
            }

            outputBox.textContent = result;
        } catch (err) {
            outputBox.className = "";
            outputBox.className = "output-error";
            outputBox.textContent = "FATAL ERROR: Could not connect to backend.";
        }
    });   

    document.addEventListener('keydown', function(event) {
        if ((event.ctrlKey || event.metaKey) && event.key === 's') {
            event.preventDefault()
            saved = true;
            localStorage.setItem("code", editor.getValue());
        } else {
            saved = false;
        }
    });
});