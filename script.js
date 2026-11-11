const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle?.addEventListener('click', () => {
    if (!navLinks) return;
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
});

// Auto-close the mobile menu if window is resized back to desktop width
window.addEventListener('resize', () => {
    if (window.innerWidth > 640 && navLinks?.classList.contains('open')) {
        navLinks.classList.remove('open');
        navToggle?.classList.remove('open');
        navToggle?.setAttribute('aria-expanded', 'false');
    }
});

document.body.classList.add('motion-ready');

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const typewriterTargets = new Set();
const motionTargets = new Set();
let revealObserver;
const pageElements = [...document.body.children].filter(element =>
    !element.matches('.site-header, footer, script, .overlay')
);

function isAnimatable(element) {
    return element instanceof Element &&
        !element.closest('.site-header, footer, script, .overlay, template');
}

function registerHeading(element) {
    if (
        !isAnimatable(element) ||
        !element.matches('h1, h2, h3') ||
        typewriterTargets.has(element)
    ) return;

    typewriterTargets.add(element);
    element.dataset.fullText = element.textContent.trim();
    element.classList.add('typewriter');
}

function registerMotionTarget(element) {
    if (!isAnimatable(element) || motionTargets.has(element)) return;
    motionTargets.add(element);
    element.classList.add('motion-target');
}

document.querySelectorAll('h1, h2, h3').forEach(registerHeading);
pageElements.forEach(registerMotionTarget);

function typeText(element) {
    if (reducedMotion || !typewriterTargets.has(element) || element.dataset.typed === 'true') {
        return Promise.resolve();
    }

    const text = element.dataset.fullText;
    if (!text) return Promise.resolve();

    element.dataset.typed = 'true';
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    let node;
    while ((node = walker.nextNode())) {
        if (node.data.trim()) textNodes.push(node);
    }

    const speed = element.matches('h1') ? 55 : 35;

    return textNodes.reduce((sequence, textNode) => sequence.then(() => {
        const text = textNode.data;
        textNode.data = '';
        let index = 0;

        return new Promise(resolve => {
            const timer = window.setInterval(() => {
                textNode.data += text[index];
                index += 1;
                if (index >= text.length) {
                    window.clearInterval(timer);
                    resolve();
                }
            }, speed);
        });
    }), Promise.resolve());
}

function revealSectionContent(heading) {
    const section = heading.parentElement;
    if (!section) return;

    let sibling = heading.nextElementSibling;
    while (sibling && !sibling.matches('h1, h2, h3')) {
        sibling.classList.add('is-visible');
        sibling.querySelectorAll('.motion-target').forEach(target => {
            target.classList.add('is-visible');
        });
        sibling = sibling.nextElementSibling;
    }
}

async function revealHeading(heading) {
    if (heading.dataset.revealed === 'true') return;
    heading.dataset.revealed = 'true';
    heading.classList.add('is-visible');
    await typeText(heading);
    revealSectionContent(heading);
}

if ('IntersectionObserver' in window && !reducedMotion) {
    revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            if (typewriterTargets.has(entry.target)) {
                revealHeading(entry.target);
            } else {
                entry.target.classList.add('is-visible');
            }
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.1 });

    typewriterTargets.forEach(target => revealObserver.observe(target));
} else {
    typewriterTargets.forEach(target => {
        target.classList.add('is-visible');
        target.dataset.typed = 'true';
    });
    motionTargets.forEach(target => {
        target.classList.add('is-visible');
    });
}

const dynamicContentObserver = new MutationObserver(records => {
    records.forEach(record => {
        record.addedNodes.forEach(node => {
            if (!(node instanceof Element)) return;
            if (node.matches('h1, h2, h3')) registerHeading(node);
            node.querySelectorAll('h1, h2, h3').forEach(registerHeading);
            if (revealObserver) {
                if (node.matches('h1, h2, h3')) revealObserver.observe(node);
                node.querySelectorAll('h1, h2, h3').forEach(heading => {
                    revealObserver.observe(heading);
                });
            } else if (reducedMotion) {
                node.querySelectorAll('h1, h2, h3').forEach(heading => {
                    heading.classList.add('is-visible');
                });
            }
            if (pageElements.includes(node)) registerMotionTarget(node);
            node.querySelectorAll('.motion-target').forEach(registerMotionTarget);
        });
    });
});

dynamicContentObserver.observe(document.body, { childList: true, subtree: true });
