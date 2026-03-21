(() => {
  // <stdin>
  function get_editor() {
    var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
      lineNumbers: true,
      mode: "text/x-csrc",
      autoCloseBrackets: true,
      theme: "material-palenight"
    });
    return editor;
  }
  var btn_run = document.querySelector("#execute-btn");
  var saved = false;
  function change_saved(bool) {
    saved = bool;
  }
  async function markdown_data() {
    const response = await fetch("{{ .RelPermalink }}index.json");
    return response.json();
  }
})();
