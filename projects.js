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
    teaser: "nonprofit magazine specifically for teens & students",
    year: "2026",
    image: "",
    article: [
      {
        heading: "the problem",
        text: "there are a LOT of opportunities out there for motivated students, but somehow only a select fraction of teens have access. in the US, there are numerous media outlets that keep track of and post about internships, scholarships, and more, while canadians seem to have...nothing"
      },
      {
        heading: "the solution",
        text: "a hub dedicated specifically for the youth of canada, complete with networking opportunities and chances to express their own opinions. available in the form of magazine, or online network"
      },
      {
        heading: "progress",
        list: [
          "07/30/2026 - assembled full executive team"
        ]
      },
      {
        heading: "what i'm learning",
        text: "running nonprofits are a lot of work, from organizing meetings to making sure 20 something executives all get along..."
      }
    ]
  },

  {
    title: "li family",
    teaser: "instagram account sidequest with my friends",
    year: "2026",
    links: "https://www.instagram.com/theli_family/"
    image: "",
    article: [
      {
        heading: "the account",
        text: "me and my friends go on sidequests a lot, whether that be notebook calls or coding projects, so we decided to create an instagram account to document all of it"
      },
      {
        heading: "progress",
        list: [
          "07/30/2026 - created account and followed everyone in the friend group"
        ]
      },
      
    ]
  },

  {
    title: "elenaOS",
    teaser: "fully function operating system that works in the browser",
    year: "2026",
    image: "",
    article: [
      {
        heading: "the code",
        text: "i created this project for hackclub stardance as the original version of this website. it was coded using html/css and javascript and features numerous apps"
      },
      {
        heading: "progress",
        list: [
          "07/30/2026 - created account and followed everyone in the friend group"
        ]
      },
      
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
