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
    id = $(".problem-details").attr("problem_id");
    console.log(id);
    code = $(".problem-details").attr("code_space");
    console.log(code);
    return { problem_id: id, code };
  }
})();
