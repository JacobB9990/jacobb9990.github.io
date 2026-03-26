let md;

function initMarkdown() {
    if (!window.markdownit) {
        setTimeout(initMarkdown, 100);
        return;
    }
    md = window.markdownit({ html: true, linkify: true, typographer: true });
}

function extractExcerpt(html, maxLength = 150) {
    // Create a temporary div to parse HTML
    const temp = document.createElement('div');
    temp.innerHTML = html;

    // Get all text content and clean it up
    let text = temp.innerText || temp.textContent;
    text = text.replace(/\s+/g, ' ').trim();

    // Return first maxLength characters, cutting at word boundary
    if (text.length > maxLength) {
        text = text.substring(0, maxLength);
        text = text.substring(0, text.lastIndexOf(' ')) + '...';
    }
    return text;
}

function getPageNameFromFile(fileUrl) {
    const match = fileUrl.match(/page=([^&]*)/);
    return match ? match[1] : null;
}

async function loadArticles() {
    try {
        initMarkdown();

        const response = await fetch('/assets/articles/articles.json');
        if (!response.ok) throw new Error('Failed to load articles list');
        const articles = await response.json();

        articles.sort((a, b) => new Date(b.date) - new Date(a.date));

        const articlesContainer = document.getElementById('articles');
        articlesContainer.innerHTML = '<p class="article-date">Loading articles...</p>';

        // Wait for markdown-it to be ready
        while (!md) await new Promise(r => setTimeout(r, 100));

        const articleContents = await Promise.all(
            articles.map(async article => {
                try {
                    const pageName = getPageNameFromFile(article.file);
                    const mdFile = `/assets/articles/markdown/${pageName}.md`;
                    const mdResponse = await fetch(mdFile);

                    if (!mdResponse.ok) throw new Error(`Failed to load ${article.title}`);
                    const markdown = await mdResponse.text();
                    const html = md.render(markdown);

                    return { ...article, html };
                } catch (err) {
                    console.warn(`Could not load excerpt for ${article.title}:`, err);
                    return { ...article, html: '<p><em>Click to read full article...</em></p>' };
                }
            })
        );

        articlesContainer.innerHTML = '';

        articleContents.forEach(({ title, file, date, html }) => {
            const articleElement = document.createElement('article');
            articleElement.className = 'article';

            const excerpt = extractExcerpt(html);

            const formattedDate = new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });

            articleElement.innerHTML = `
                <a href="${file}" class="article-link">
                    <h2 class="article-title">${title}</h2>
                    <time class="article-date">${formattedDate}</time>
                    <p class="article-content">${excerpt}</p>
                </a>
            `;

            articlesContainer.appendChild(articleElement);
        });

    } catch (error) {
        console.error('Error:', error);
        const articlesContainer = document.getElementById('articles');
        articlesContainer.innerHTML = `
            <article class="warning">
                Failed to load articles. Please try again later.
            </article>
        `;
    }
}

document.addEventListener('DOMContentLoaded', loadArticles);