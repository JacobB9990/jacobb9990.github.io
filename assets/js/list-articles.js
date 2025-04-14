async function loadArticles() {
    try {
        const response = await fetch('/assets/articles/articles.json');
        if (!response.ok) throw new Error('Failed to load articles list');
        const articles = await response.json();

        articles.sort((a, b) => new Date(b.date) - new Date(a.date));

        const articlesContainer = document.getElementById('articles');
        articlesContainer.innerHTML = '<p class="article-date">Loading articles...</p>';

        const articleContents = await Promise.all(
            articles.map(async article => {
                const articleResponse = await fetch(article.file);
                if (!articleResponse.ok) throw new Error(`Failed to load ${article.title}`);
                const content = await articleResponse.text();
                return { ...article, content };
            })
        );

        articlesContainer.innerHTML = '';

        articleContents.forEach(({ title, file, date, content }) => {
            const articleElement = document.createElement('article');
            articleElement.className = 'article';

            const parser = new DOMParser();
            const doc = parser.parseFromString(content, 'text/html');
            
            const preview = doc.querySelector('.article-content p:first-of-type')?.innerHTML || 
                          '<em>Click to read full article...</em>';

            const formattedDate = new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });

            articleElement.innerHTML = `
                <a href="${file}" class="article-link">
                    <h2 class="article-title">${title}</h2>
                    <time class="article-date">${formattedDate}</time>
                    <p class="article-content">${preview}</p>
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