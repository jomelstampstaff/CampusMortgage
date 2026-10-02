/* ==========================================================
   Hover Guide Accordion — inline expanding guides
   Content expands below the checklist item, no floating
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {

    const guides = window.documentGuides || {};

    // ---------- BUILD ACCORDION HTML ----------
    function buildAccordion(docKey) {
        const guide = guides[docKey];
        if (!guide) return null;

        const accordion = document.createElement('div');
        accordion.className = 'doc-accordion';

        let html = `
            <div class="doc-accordion-inner">
                <div class="doc-accordion-header">
                    <h4>${guide.title}</h4>
                    <button class="close-btn" aria-label="Close guide">Close</button>
                </div>
                <div class="doc-accordion-body">
        `;

        if (guide.lookFor && guide.lookFor.length) {
            html += `<div class="doc-accordion-section lookfor">
                <h5>✅ Look For</h5>
                <ul>${guide.lookFor.map(item => `<li>${item}</li>`).join('')}</ul>
            </div>`;
        }

        if (guide.redFlags && guide.redFlags.length) {
            html += `<div class="doc-accordion-section redflags">
                <h5>⚠️ Red Flags</h5>
                <ul>${guide.redFlags.map(item => `<li>${item}</li>`).join('')}</ul>
            </div>`;
        }

        if (guide.crossCheck && guide.crossCheck.length) {
            html += `<div class="doc-accordion-section crosscheck">
                <h5>🔗 Cross-Check With</h5>
                <ul class="pill-list">${guide.crossCheck.map(item => `<li>${item}</li>`).join('')}</ul>
            </div>`;
        }

        if (guide.feedsInto && guide.feedsInto.length) {
            html += `<div class="doc-accordion-section feedsinto">
                <h5>📐 Feeds Into</h5>
                <ul class="pill-list">${guide.feedsInto.map(item => `<li>${item}</li>`).join('')}</ul>
            </div>`;
        }

        html += `
                </div>
            </div>
        `;

        accordion.innerHTML = html;
        return accordion;
    }

    // ---------- TOGGLE ACCORDION ----------
    function toggleAccordion(btn) {
        const docKey = btn.getAttribute('data-doc');
        if (!docKey || !guides[docKey]) return;

        // The checklist item that contains this button
        const item = btn.closest('.checklist-item');
        if (!item) return;

        // If an accordion already exists right after this item, toggle it
        let accordion = item.nextElementSibling;
        if (accordion && accordion.classList.contains('doc-accordion')) {
            const isOpen = accordion.classList.contains('show');
            if (isOpen) {
                // Close
                accordion.classList.remove('show');
                btn.classList.remove('active');
                btn.setAttribute('aria-expanded', 'false');
            } else {
                // Open
                accordion.classList.add('show');
                btn.classList.add('active');
                btn.setAttribute('aria-expanded', 'true');
            }
            return;
        }

        // Otherwise, create a new accordion and insert after the item
        const newAccordion = buildAccordion(docKey);
        if (!newAccordion) return;

        item.parentNode.insertBefore(newAccordion, item.nextSibling);

        // Wire up the close button
        const closeBtn = newAccordion.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                newAccordion.classList.remove('show');
                btn.classList.remove('active');
                btn.setAttribute('aria-expanded', 'false');
            });
        }

        // Show it
        // Use requestAnimationFrame so the CSS transition triggers
        requestAnimationFrame(() => {
            newAccordion.classList.add('show');
            btn.classList.add('active');
            btn.setAttribute('aria-expanded', 'true');
        });
    }

    // ---------- ATTACH HANDLERS ----------
    const infoButtons = document.querySelectorAll('.info-btn');

    infoButtons.forEach(btn => {
        const docKey = btn.getAttribute('data-doc');
        if (!docKey || !guides[docKey]) return;

        // Click to toggle
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleAccordion(btn);
        });

        // Keyboard support
        btn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleAccordion(btn);
            }
            if (e.key === 'Escape') {
                const item = btn.closest('.checklist-item');
                const accordion = item && item.nextElementSibling;
                if (accordion && accordion.classList.contains('doc-accordion')) {
                    accordion.classList.remove('show');
                    btn.classList.remove('active');
                    btn.setAttribute('aria-expanded', 'false');
                }
            }
        });
    });

    // ---------- CLOSE ALL ACCORDIONS WHEN PRINTING ----------
    window.addEventListener('beforeprint', () => {
        document.querySelectorAll('.doc-accordion.show').forEach(acc => {
            acc.dataset.wasOpen = 'true';
            acc.classList.remove('show');
        });
    });

    window.addEventListener('afterprint', () => {
        document.querySelectorAll('.doc-accordion[data-was-open="true"]').forEach(acc => {
            acc.classList.add('show');
            delete acc.dataset.wasOpen;
        });
    });
});
