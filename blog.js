const overlay  = document.getElementById('overlay');
const titleEl  = document.getElementById('panelTitle');
const metaEl   = document.getElementById('panelMeta');
const bodyEl   = document.getElementById('panelBody');
const closeBtn = document.getElementById('close');
const notebookScene = document.getElementById('notebookScene');
const notebook = document.getElementById('notebook');
const previousPage = document.getElementById('previousPage');
const nextPage = document.getElementById('nextPage');
const pageStatus = document.getElementById('pageStatus');
const notebookPages = document.querySelector('.notebook-pages');
const cards = [...document.querySelectorAll('.card')];

let lastFocused = null;
const pageSize = 3;
let currentPage = 0;
let isTurning = false;
const blogReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function renderPage() {
  const pageCount = Math.ceil(cards.length / pageSize);
  const firstCard = currentPage * pageSize;

  cards.forEach((card, index) => {
    card.hidden = index < firstCard || index >= firstCard + pageSize;
  });

  if (previousPage) previousPage.disabled = currentPage === 0;
  if (nextPage) nextPage.disabled = currentPage === pageCount - 1;
  if (pageStatus) pageStatus.textContent = `page ${currentPage + 1} of ${pageCount}`;
}

renderPage();

function turnPage(direction) {
  if (isTurning || !notebookPages) return;

  const nextPageIndex = currentPage + direction;
  const lastPage = Math.ceil(cards.length / pageSize) - 1;
  if (nextPageIndex < 0 || nextPageIndex > lastPage) return;

  if (blogReducedMotion) {
    currentPage = nextPageIndex;
    renderPage();
    return;
  }

  isTurning = true;
  previousPage.disabled = true;
  nextPage.disabled = true;
  notebookPages.classList.add(direction > 0 ? 'is-turning-next' : 'is-turning-previous');

  window.setTimeout(() => {
    currentPage = nextPageIndex;
    renderPage();
  }, 500);

  window.setTimeout(() => {
    notebookPages.classList.remove('is-turning-next', 'is-turning-previous');
    isTurning = false;
    renderPage();
  }, 1150);
}

previousPage?.addEventListener('click', () => turnPage(-1));
nextPage?.addEventListener('click', () => turnPage(1));

if (notebookScene && notebook) {
  if (blogReducedMotion || !('IntersectionObserver' in window)) {
    notebook.classList.add('open');
  } else {
    let hasScrolled = window.scrollY > 0;
    let notebookObserver;

    const openNotebook = () => {
      if (!hasScrolled || notebook.getBoundingClientRect().top > window.innerHeight * .85) return;
      notebook.classList.add('open');
      notebookObserver.disconnect();
      window.removeEventListener('scroll', openNotebookOnScroll);
    };

    const openNotebookOnScroll = () => {
      hasScrolled = true;
      openNotebook();
    };

    notebookObserver = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      openNotebook();
    }, { threshold: 0.35 });

    notebookObserver.observe(notebookScene);
    window.addEventListener('scroll', openNotebookOnScroll, { passive: true });
  }
}

function openCard(card){
  lastFocused = card;
  titleEl.textContent = card.dataset.title;
  metaEl.textContent  = `${card.dataset.date} · ${card.dataset.read} read`;
  bodyEl.innerHTML = '';
  bodyEl.appendChild(card.querySelector('template').content.cloneNode(true));
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  closeBtn.focus();
}

function closeCard(){
  overlay.classList.remove('open');
  document.body.style.overflow = '';
  if (lastFocused) lastFocused.focus();
}

document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', () => openCard(card));
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openCard(card);
    }
  });
});

closeBtn.addEventListener('click', closeCard);

overlay.addEventListener('click', e => {
  if (e.target === overlay) closeCard();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && overlay.classList.contains('open')) closeCard();
});
