/* ==========================================================
   Site Navigation — single source of truth
   Injects header on every page via <div id="site-header"></div>
   ========================================================== */

(function () {
    // ---------- CONFIG: edit nav here, updates everywhere ----------
    const NAV_ITEMS = [
    { label: 'Home',       href: 'index.html',             match: 'home' },
    { label: 'Bootcamp',   href: 'modules/index.html',     match: 'modules' },
    { label: 'Summaries',  href: 'summaries/index.html',   match: 'summaries' },
    { label: 'Reference',  href: 'reference/index.html',   match: 'reference' },
    { label: 'Checklists', href: 'checklists/index.html',  match: 'checklists' },
    { label: 'About',      href: 'about.html',             match: 'about' }
];

    const BRAND_TEXT = '🎓 Certified Master Loan Processor';
    const BRAND_HREF = 'index.html';

    // ---------- DETECT DEPTH (root vs subfolder) ----------
    const path = window.location.pathname;
    const segments = path.split('/').filter(Boolean);

    // Remove trailing filename (e.g. "index.html")
    if (segments[segments.length - 1]?.includes('.')) {
        segments.pop();
    }

    // Remove the repo name if we're on a GitHub Pages project site
    // (repo is "bootcamp", so the first segment will be "bootcamp")
    if (segments[0] === 'bootcamp') {
        segments.shift();
    }

    // Depth inside the repo: 0 = root, 1 = one folder deep, etc.
    const depth = segments.length;
    const prefix = depth > 0 ? '../'.repeat(depth) : '';

    // ---------- FIGURE OUT ACTIVE SECTION ----------
    const firstFolder = segments[0] || '';
    const isAboutPage = path.endsWith('about.html');

    const activeSection =
        firstFolder === 'modules'    ? 'modules' :
        firstFolder === 'reference'  ? 'reference' :
        firstFolder === 'checklists' ? 'checklists' :
        isAboutPage                  ? 'about' :
                                       'home';

    // ---------- BUILD HEADER HTML ----------
    const linksHTML = NAV_ITEMS.map(item => {
        const isActive = item.match === activeSection ? ' class="active"' : '';
        return `<a href="${prefix}${item.href}"${isActive}>${item.label}</a>`;
    }).join('');

    const headerHTML = `
        <header class="site-header">
            <a href="${prefix}${BRAND_HREF}" class="brand">${BRAND_TEXT}</a>
            <nav>${linksHTML}</nav>
        </header>
    `;

    // ---------- INJECT ----------
    const placeholder = document.getElementById('site-header');
    if (placeholder) {
        placeholder.outerHTML = headerHTML;
    }
})();
