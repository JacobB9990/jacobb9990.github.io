function initializeThemeToggle() {
    const themeToggleButton = document.getElementById('theme-toggle');
    const stylesheet = document.getElementById('theme-stylesheet');

    if (!themeToggleButton) {
        console.error('Theme toggle button not found!');
        return;
    }

    console.log("Theme toggle initialized");

    const currentTheme = localStorage.getItem('theme') || 'style-dark';
    console.log('Current theme from localStorage:', currentTheme);
    stylesheet.href = `/assets/css/${currentTheme}.css`;

    themeToggleButton.addEventListener('click', () => {
        const isDark = stylesheet.href.includes('style-dark.css');
        const newTheme = isDark ? 'style-light' : 'style-dark';

        console.log('Switching to theme:', newTheme);
        stylesheet.href = `/assets/css/${newTheme}.css?${new Date().getTime()}`;
        console.log('Updated stylesheet href:', stylesheet.href);

        localStorage.setItem('theme', newTheme);
        console.log('Theme updated in localStorage:', localStorage.getItem('theme'));
    });
}