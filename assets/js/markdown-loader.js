// Wait for markdown-it to load
let md;
function initMarkdown() {
    if (!window.markdownit) {
        setTimeout(initMarkdown, 100);
        return;
    }

    md = window.markdownit({
        html: true,
        linkify: true,
        typographer: true
    });
}

// Function to get URL parameter
function getUrlParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Function to load and render markdown
async function loadArticle() {
    // Ensure markdown-it is initialized
    initMarkdown();
    if (!md) {
        setTimeout(loadArticle, 100);
        return;
    }

    const articleName = getUrlParam('page') || 'index';
    const mdFile = `/assets/articles/markdown/${articleName}.md`;

    const contentDiv = document.getElementById('article-content');

    try {
        const response = await fetch(mdFile);

        if (!response.ok) {
            contentDiv.innerHTML = `<h1>Article Not Found</h1><p>Could not load: ${articleName}.md</p>`;
            return;
        }

        const markdown = await response.text();

        // Convert markdown to HTML
        const html = md.render(markdown);
        contentDiv.innerHTML = html;

        // Extract first h1 for page title
        const firstHeading = contentDiv.querySelector('h1');
        if (firstHeading) {
            document.title = firstHeading.textContent + ' | Jacob\'s Blog';
        }

        // Trigger MathJax rendering
        if (window.MathJax && window.MathJax.typesetPromise) {
            MathJax.typesetPromise([contentDiv]).catch(err => console.log(err));
        }
    } catch (error) {
        console.error('Error loading article:', error);
        contentDiv.innerHTML = `<h1>Error Loading Article</h1><p>${error.message}</p>`;
    }
}

// Load article when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadArticle);
} else {
    loadArticle();
}
