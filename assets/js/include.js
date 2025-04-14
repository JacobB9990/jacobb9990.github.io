function includeHeader() {
    fetch('/assets/html/header.html')
        .then(response => response.text())
        .then(data => {
            document.querySelector('header').innerHTML = data;
        });
}

function includeFooter() {
    fetch('/assets/html/footer.html')
        .then(response => response.text())
        .then(data => {
            document.querySelector('footer').innerHTML = data;
        });
}

document.addEventListener('DOMContentLoaded', function () {
    includeHeader();
    includeFooter();
});