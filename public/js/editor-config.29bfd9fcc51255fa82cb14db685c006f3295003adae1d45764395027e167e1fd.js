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
  function markdown_data() {
    id = $(".problem_details").attr("problem-id");
    console.log(id);
    code = $(".problem_details").attr("code_space");
    return { id, code };
  }
})();
