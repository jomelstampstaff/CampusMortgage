/* ==========================================================
   Tooltips — Popover logic for hover/tap document guides
   Includes auto-flip (top/bottom) + edge detection
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

    // ---------- POSITION POPOVER ----------
    function positionPopover(popover, btn) {
        // Reset position classes
        popover.classList.remove('pos-bottom', 'pos-top');

        // Mobile: always use bottom-sheet mode (handled by CSS media query)
        if (window.matchMedia('(max-width: 700px)').matches) {
            return;
        }

        // Measure
        const btnRect = btn.getBoundingClientRect();
        const popoverHeight = popover.offsetHeight || 400; // fallback estimate
        const spaceBelow = window.innerHeight - btnRect.bottom;
        const spaceAbove = btnRect.top;

        // If not enough space below but enough above, flip to top
        if (spaceBelow < popoverHeight + 40 && spaceAbove > spaceBelow) {
            popover.classList.add('pos-top');
        } else {
            popover.classList.add('pos-bottom');
        }
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

                // Close button
                popover.querySelector('.close-btn').addEventListener('click', (e) => {
                    e.stopPropagation();
                    hidePopover();
                });

                // Hover on popover itself keeps it open
                popover.addEventListener('mouseenter', () => {
                    clearTimeout(closeTimer);
                });
                popover.addEventListener('mouseleave', () => {
                    if (window.matchMedia('(min-width: 701px)').matches) {
                        closeTimer = setTimeout(hidePopover, 300);
                    }
                });
            }

            popover.classList.add('show');
            btn.classList.add('active');
            btn.setAttribute('aria-expanded', 'true');

            // Position after it's visible so we can measure height
            requestAnimationFrame(() => {
                positionPopover(popover, btn);
            });
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

        // Click (mobile + keyboard)
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (btn.classList.contains('active')) {
                hidePopover();
            } else {
                showPopover();
            }
        });

        // Keyboard
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

    // Close on outside click (mobile)
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

    // Reposition on scroll/resize when popover is open
    window.addEventListener('resize', () => {
        document.querySelectorAll('.doc-popover.show').forEach(p => {
            const btn = p.closest('.checklist-item')?.querySelector('.info-btn');
            if (btn) positionPopover(p, btn);
        });
    });
});
