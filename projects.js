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
    links: [
      // { label: "live demo", url: "https://example.com", primary: true },
    ],
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
          "07/30/2026 - assembled full executive team",
          "08/01/2026 - first full executive meeting"
        ]
      },
      {
        heading: "what i'm learning",
        text: "running nonprofits are a lot of work, from organizing meetings to making sure 20 something executives all get along..."
      }
    ]
  },

   {
    title: "inkless (hack the valley 11)",
    teaser: "write on anything :))",
    year: "2026",
    image: "",
    links: [
      { label: "demo", url: "https://i-want-a-drawing-tablet-but-im-brok-two.vercel.app/", primary: true },
      { label: "devpost", url: "https://devpost.com/software/inkless-9fauve"},
      { label: "github repo", url: "https://github.com/ele-na2011/i-want-a-drawing-tablet-but-im-broke"}
    ],
    article: [
      {
        heading: "the problem",
        text: "i've always wanted a drawing tablet, but they're expensive. so my team and i came up with inkless, a computer vision-based drawing app that tracks a green LED to track your hand movements in order to save your writing on any surface to a doc, which you can export to your google drive."
      },
      {
        heading: "stack",
        text: "python, yolov8, html/css/js"
      },
      {
        heading: "progress",
        list: [
          "10/16/2026 - environment setup done",
          "10/17/2026 - ui designed, stack decided",
          "10/18/2026 - yolov8 model trained, testing and debugging",
          "10/18/2026 - final touches, devpost submission"
        ]
      },
    ]
  },

   {
    title: "daydream village (sunbeam toronto)",
    teaser: "collaborate with others to create the perfect little town",
    year: "2026",
    image: "",
    links: [
      { label: "demo", url: "https://ele-na2011.github.io/perfect-day/", primary: true },
      { label: "github repo", url: "https://github.com/ele-na2011/perfect-day" }
    ],
    article: [
      {
        heading: "theme and idea",
        text: "the theme was 'perfect day', and our team decided to create a little town where people collaborated across the internet to provide the perfect day through certain actions"
      },
      {
        heading: "progress",
        list: [
          "08/23/2026 - coded the entire game in 1 day, with a team of 3"
        ]
      },
    ]
  },

   {
    title: "mythicalOS (stardance)",
    teaser: "mythical-themed web operating system",
    year: "2026",
    image: "",
    links: [
      { label: "demo", url: "https://ele-na2011.github.io/mythicalOS/", primary: true },
      { label: "github repo", url: "https://github.com/ele-na2011/mythicalOS" }
    ],
    article: [
      {
        heading: "what it is",
        text: "a mythical-themed web operating system, with a desktop, taskbar, numerous apps, as well as a hidden easter egg feature."
      },
      {
        heading: "progress",
        list: [
          "06/25/2026 - started the project",
          "06/30/2026 - ship #1, also known as elenaOS was published",
          "08/20/2026 - rebrand to mythicalOS, with a new theme and new features",
          "09/15/2026 - added new features and improvements"
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
