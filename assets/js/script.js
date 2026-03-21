import { get_editor, saved, change_saved, btn_run, markdown_data } from './editor-config.js'

document.addEventListener('DOMContentLoaded', function() {
    const editor = get_editor();
    
    const {problem_id, code_space} = markdown_data();
    console.log(problem_id);
    console.log(code_space);

    if (localStorage.getItem(problem_id) != null) {
        editor.setValue(localStorage.getItem(problem_id));
    } else {
        editor.setValue(code_space);
    }
    change_saved(true);

    btn_run.addEventListener('click', async function() {
        const code = editor.getValue();
        console.log(typeof code);
        const outputBox = document.getElementById('output');
        outputBox.className = "";
        outputBox.className = "output-default";

        if (!saved) {
            outputBox.textContent = "code not saved";
            return;
        }
        
        outputBox.textContent = "> Compiling...\n> Executing...";

        try {
            const response = await fetch('/api/execute', {
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
            change_saved(true);
            localStorage.setItem(problem_id, editor.getValue());
        } else {
            change_saved(false);
        }
    });
});