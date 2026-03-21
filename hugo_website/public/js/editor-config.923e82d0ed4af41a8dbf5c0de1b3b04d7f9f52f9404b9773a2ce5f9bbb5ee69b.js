(() => {
  // <stdin>
  var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
    lineNumbers: true,
    mode: "text/x-csrc",
    autoCloseBrackets: true,
    theme: "material-palenight"
  });
  function get_editor() {
    return;
  }
  var btn_run = document.querySelector("#execute-btn");
  var saved = false;
  function change_saved(bool) {
    saved = bool;
  }
})();
