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
    title: "Trail Conditions Tracker",
    teaser: "A crowd-sourced map showing which hiking trails are muddy, icy, or clear.",
    year: "2025",
    image: "",
    links: [
      { label: "Live site", url: "#", primary: true },
      { label: "GitHub", url: "#" }
    ],
    article: [
      {
        heading: "The problem",
        text: "Hikers near me constantly asked the same question in group chats: is the trail passable today? Official park pages update weekly at best, so the information was almost always stale by the time anyone needed it."
      },
      {
        heading: "What I built",
        text: "A web app where users drop a pin, pick a condition from four presets, and optionally add a photo. Reports decay in opacity over 48 hours so the map always reflects recent reality rather than last month's snow."
      },
      {
        heading: "Technical highlights",
        list: [
          "Clustered map markers so 500+ reports stay readable at low zoom",
          "Offline-first submissions queued in IndexedDB and synced when signal returns",
          "Rate limiting and a lightweight trust score to curb spam reports"
        ]
      },
      {
        heading: "What I learned",
        text: "Designing for a user standing at a trailhead with one bar of signal forced me to treat performance as a feature, not a polish step. Every asset budget decision traced back to that scenario."
      }
    ]
  },

  {
    title: "Course Conflict Resolver",
    teaser: "Scheduling tool that generates valid timetables from a student's course wishlist.",
    year: "2024",
    image: "",
    links: [
      { label: "GitHub", url: "#", primary: true }
    ],
    article: [
      {
        heading: "The problem",
        text: "Registration week meant an hour of dragging blocks around a grid to find a schedule with no overlaps and no 8 a.m. lectures. It was clearly a constraint-satisfaction problem being solved by hand."
      },
      {
        heading: "Approach",
        text: "I modelled each course section as a variable and each time slot as a domain value, then applied backtracking search with the minimum-remaining-values heuristic. Soft preferences like 'no early mornings' became a scoring pass over the valid solution set."
      },
      {
        heading: "Results",
        list: [
          "Generates all valid timetables for a 6-course load in under 200 ms",
          "Ranks results by user-weighted preferences (gaps, start time, campus travel)",
          "Used by roughly 300 students in its first term"
        ]
      }
    ]
  },

  {
    title: "Ceramics Inventory for a Small Studio",
    teaser: "A no-frills stock and pricing sheet replacement built for a local pottery business.",
    year: "2024",
    image: "",
    links: [
      { label: "Case study", url: "#", primary: true }
    ],
    article: [
      {
        heading: "Context",
        text: "A two-person studio was tracking 400 pieces across three spreadsheets that were never in sync. They did not need software so much as they needed one honest source of truth."
      },
      {
        heading: "What I built",
        text: "A single-page tool with a searchable inventory table, kiln-batch grouping, and a one-click price sheet export. Deliberately boring interface, because the owners wanted to spend zero minutes learning it."
      },
      {
        heading: "Outcome",
        text: "Stock reconciliation went from a Sunday afternoon task to about ten minutes. The best compliment I received was that they stopped mentioning the tool entirely."
      }
    ]
  }
];


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
