document.addEventListener('DOMContentLoaded', function() {
    $('.problem-item').on('click', function() {
        const problem_clicked = $(this).attr("data");
        window.location.replace(String(problem_clicked));
    });
});