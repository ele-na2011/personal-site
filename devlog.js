/* ============================================================
   EDIT ONLY THE PROJECTS ARRAY BELOW TO ADD / CHANGE PROJECTS
   ============================================================
   Fields:
     title    – project name
     teaser   – one line shown before clicking
     year     – shown as a small badge
     tags     – array of strings (also powers the filter chips)
     image    – optional image URL, or "" to skip
     links    – array of { label, url, primary?: true }
     article  – array of sections: { heading, text } or { heading, list: [] }
   ============================================================ */

const PROJECTS = [
  {
    title: "sidequest",
    year: "2026",
    image: "",
    article: [
      {
        text: "running nonprofits are a lot of work, from organizing meetings to making sure 20 something executives all get along..."
      }
    ]
  },

  

]


/* ============================================================
   BELOW THIS LINE IS THE ENGINE — no need to edit
   ============================================================ */

const list = document.getElementById('list');

/* Escape user text so stray < or & can't break the markup */
function esc(s){
  return String(s).replace(/[&<>"']/g, c => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
  }[c]));
}

function sectionHTML(sec){
  const body = sec.list
    ? `<ul>${sec.list.map(i => `<li>${esc(i)}</li>`).join('')}</ul>`
    : `<p>${esc(sec.text)}</p>`;
  return `<h3>${esc(sec.heading)}</h3>${body}`;
}

function cardHTML(p, i){
  const id = `panel-${i}`;
  return `
  <article class="project">
    <button class="head" aria-expanded="false" aria-controls="${id}">
      <span class="caret">▶</span>
      <span class="head-text">
        <h2>${esc(p.title)}</h2>
        <p class="teaser">${esc(p.teaser)}</p>
      </span>
      <span class="year">${esc(p.year)}</span>
    </button>

    <div class="body" id="${id}" role="region">
      <div class="body-inner">
        <div class="article">
          ${p.image
            ? `<img class="shot" src="${esc(p.image)}" alt="${esc(p.title)} screenshot" loading="lazy">`
            : ''}

          ${p.article.map(sectionHTML).join('')}

          ${p.links && p.links.length
            ? `<div class="links">${p.links.map(l =>
                `<a class="btn ${l.primary ? 'primary' : 'ghost'}" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a>`
              ).join('')}</div>`
            : ''}
        </div>
      </div>
    </div>
  </article>`;
}

/* ---------- Build the list ---------- */
list.innerHTML = PROJECTS.map(cardHTML).join('');

/* ---------- Expand / collapse ---------- */
list.addEventListener('click', e => {
  const btn = e.target.closest('.head');
  if (!btn) return;

  const card   = btn.closest('.project');
  const isOpen = card.classList.toggle('open');
  btn.setAttribute('aria-expanded', isOpen);

  // Accordion mode: close the others.
  // Delete this whole if-block to allow multiple cards open at once.
  if (isOpen) {
    list.querySelectorAll('.project.open').forEach(other => {
      if (other === card) return;
      other.classList.remove('open');
      other.querySelector('.head').setAttribute('aria-expanded', 'false');
    });
  }
});
