/* ==========================================================
   Certified Master Loan Processor — Shared JavaScript
   Handles: collapsible sidebars, active TOC highlighting,
   smooth scroll navigation
   ========================================================== */

// ---------- COLLAPSIBLE MODULE BLOCKS ----------
function toggleModule(id) {
    const block = document.getElementById(id);
    if (block) block.classList.toggle('collapsed');
}

// ---------- INIT ON DOM READY ----------
document.addEventListener('DOMContentLoaded', () => {

    const allSections = document.querySelectorAll('.card');
    const allNavLinks = document.querySelectorAll('.sidebar a');

    // ---------- ACTIVE TOC HIGHLIGHTING ----------
    function setActiveLink() {
        if (allSections.length === 0) return;

        let current = '';
        allSections.forEach(section => {
            const sectionTop = section.offsetTop - 130;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        allNavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
                // Auto-expand parent module block if collapsed
                const parentBlock = link.closest('.module-block');
                if (parentBlock && parentBlock.classList.contains('collapsed')) {
                    parentBlock.classList.remove('collapsed');
                }
            }
        });
    }

    window.addEventListener('scroll', setActiveLink);
    setActiveLink();

    // ---------- SMOOTH SCROLL FOR ANCHOR LINKS ----------
    allNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(targetId);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    history.pushState(null, null, targetId);
                }
            }
        });
    });
});
