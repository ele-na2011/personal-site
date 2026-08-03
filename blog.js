const overlay  = document.getElementById('overlay');
const titleEl  = document.getElementById('panelTitle');
const metaEl   = document.getElementById('panelMeta');
const bodyEl   = document.getElementById('panelBody');
const closeBtn = document.getElementById('close');

let lastFocused = null;

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
