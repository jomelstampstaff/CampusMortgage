/* ==========================================================
   Tooltips — Popover logic for hover/tap document guides
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {

    const guides = window.documentGuides || {};

    // ---------- BUILD POPOVER HTML ----------
    function buildPopover(docKey) {
        const guide = guides[docKey];
        if (!guide) return null;

        const popover = document.createElement('div');
        popover.className = 'doc-popover';

        let html = `
            <div class="doc-popover-header">
                <h4>${guide.title}</h4>
                <button class="close-btn" aria-label="Close guide">✕</button>
            </div>
            <div class="doc-popover-body">
        `;

        if (guide.lookFor && guide.lookFor.length) {
            html += `<div class="doc-popover-section lookfor">
                <h5>✅ Look For</h5>
                <ul>${guide.lookFor.map(item => `<li>${item}</li>`).join('')}</ul>
            </div>`;
        }

        if (guide.redFlags && guide.redFlags.length) {
            html += `<div class="doc-popover-section redflags">
                <h5>⚠️ Red Flags</h5>
                <ul>${guide.redFlags.map(item => `<li>${item}</li>`).join('')}</ul>
            </div>`;
        }

        if (guide.crossCheck && guide.crossCheck.length) {
            html += `<div class="doc-popover-section crosscheck">
                <h5>🔗 Cross-Check With</h5>
                <ul class="pill-list">${guide.crossCheck.map(item => `<li>${item}</li>`).join('')}</ul>
            </div>`;
        }

        if (guide.feedsInto && guide.feedsInto.length) {
            html += `<div class="doc-popover-section feedsinto">
                <h5>📐 Feeds Into</h5>
                <ul class="pill-list">${guide.feedsInto.map(item => `<li>${item}</li>`).join('')}</ul>
            </div>`;
        }

        html += `</div>`;
        popover.innerHTML = html;

        return popover;
    }

    // ---------- ATTACH HANDLERS ----------
    const infoButtons = document.querySelectorAll('.info-btn');

    infoButtons.forEach(btn => {
        const docKey = btn.getAttribute('data-doc');
        if (!docKey || !guides[docKey]) return;

        let popover = null;
        let closeTimer = null;

        function showPopover() {
            // Close all other popovers
            document.querySelectorAll('.doc-popover.show').forEach(p => {
                p.classList.remove('show');
            });
            document.querySelectorAll('.info-btn.active').forEach(b => {
                b.classList.remove('active');
            });

            if (!popover) {
                popover = buildPopover(docKey);
                btn.closest('.checklist-item').appendChild(popover);

                // Close button handler
                popover.querySelector('.close-btn').addEventListener('click', (e) => {
                    e.stopPropagation();
                    hidePopover();
                });
            }

            popover.classList.add('show');
            btn.classList.add('active');
            btn.setAttribute('aria-expanded', 'true');
        }

        function hidePopover() {
            if (popover) popover.classList.remove('show');
            btn.classList.remove('active');
            btn.setAttribute('aria-expanded', 'false');
        }

        // Desktop: hover
        btn.addEventListener('mouseenter', () => {
            if (window.matchMedia('(min-width: 701px)').matches) {
                clearTimeout(closeTimer);
                showPopover();
            }
        });

        btn.addEventListener('mouseleave', () => {
            if (window.matchMedia('(min-width: 701px)').matches) {
                closeTimer = setTimeout(hidePopover, 300);
            }
        });

        if (popover) {
            popover.addEventListener('mouseenter', () => {
                clearTimeout(closeTimer);
            });
            popover.addEventListener('mouseleave', () => {
                if (window.matchMedia('(min-width: 701px)').matches) {
                    closeTimer = setTimeout(hidePopover, 300);
                }
            });
        }

        // Mobile/Tablet: click
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (btn.classList.contains('active')) {
                hidePopover();
            } else {
                showPopover();
            }
        });

        // Keyboard: Enter/Space
        btn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                showPopover();
            }
            if (e.key === 'Escape') {
                hidePopover();
            }
        });
    });

    // Close popover on outside click (mobile)
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.checklist-item')) {
            document.querySelectorAll('.doc-popover.show').forEach(p => {
                p.classList.remove('show');
            });
            document.querySelectorAll('.info-btn.active').forEach(b => {
                b.classList.remove('active');
            });
        }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.doc-popover.show').forEach(p => {
                p.classList.remove('show');
            });
            document.querySelectorAll('.info-btn.active').forEach(b => {
                b.classList.remove('active');
            });
        }
    });
});
