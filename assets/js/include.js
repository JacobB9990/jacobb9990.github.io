function includeHeader() {
    fetch('/assets/html/header.html')
        .then(response => response.text())
        .then(data => {
            const headerElement = document.querySelector('header');
            if (headerElement) {
                headerElement.innerHTML = data;

                initializeThemeToggle();
            }
        });
}

function includeFooter() {
    fetch('/assets/html/footer.html')
        .then(response => response.text())
        .then(data => {
            const footerElement = document.querySelector('footer');
            if (footerElement) {
                footerElement.innerHTML = data;
            }
        });
}

document.addEventListener('DOMContentLoaded', function () {
    includeHeader();
    includeFooter();
});