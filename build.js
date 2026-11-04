// Run `node build.js` after changing text in index.html, en-translations.js or seo-pages.js.
// index.html (Danish) is the source. This writes:
//   en.html       the English page, served at /en, so Google can index both languages
//   <slug>.html   the Danish landing pages from seo-pages.js
//   sitemap.xml   and the structured data (JSON-LD) inside every page
// It stops with a list if any text on the English page has no translation.
const fs = require('fs');
const EN = require('./en-translations.js');
const PAGES = require('./seo-pages.js');

const SITE = 'https://www.mindshiftcoach.dk';
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const plain = (s) => s.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim();
const ld = (data) => `<script type="application/ld+json" data-ld>\n${JSON.stringify(data, null, 1)}\n</script>`;
const setLd = (html, data) => html.replace(/<script type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/, () => ld(data));

// Text on the page that is the same in both languages
const SAME = new Set(['DA', 'EN', 'Online', 'Book', 'Mind', 'Shift', 'MindShift', 'Marianne Williamson',
  'You must learn a new way to think before you can master a new way to be.',
  'mindshiftcoach@hotmail.com', '+45 53 76 17 28', '53 76 17 28', 'Vigerslev Allé 294', 'Vigerslev Allé 294, 2500 Valby']);

const HEAD = {
  da: {
    title: 'Coach i Valby og København – NLP &amp; ICF | MindShiftCoach',
    description: 'Personlig coaching med Meshaal Haider, NLP-mastercoach og ICF-coach. Mød mig i Valby, online eller over telefonen – for mere ro, klarhed og retning. Fra 895 kr.',
    ogTitle: 'MindShiftCoach – MindShift begynder i dit sind',
    ogDescription: 'Personlig coaching med Meshaal Haider, NLP-mastercoach og ICF-coach. I Valby, online eller over telefonen.',
    url: `${SITE}/`,
    business: 'Personlig NLP- og ICF-coaching i Valby, København, online og over telefonen.',
    job: 'NLP-mastercoach og ICF-coach',
    offers: { valby: 'Enkelt session i Valby', online: 'Online session', phone: 'Telefonisk session', v5: 'Klippekort 5 sessioner i Valby', v10: 'Klippekort 10 sessioner i Valby', o5: 'Klippekort 5 sessioner online eller over telefon', o10: 'Klippekort 10 sessioner online eller over telefon' },
    knows: ['NLP-coaching', 'Livscoaching', 'Coaching mod stress', 'Karrierecoaching', 'Selvværd', 'Livsbalance'],
  },
  en: {
    title: 'English-speaking coach in Copenhagen – NLP &amp; ICF | MindShiftCoach',
    description: 'Personal coaching in English with Meshaal Haider, NLP master coach and ICF coach. In Valby, Copenhagen, online or by phone. From DKK 895.',
    ogTitle: 'MindShiftCoach – MindShift begins in your mind',
    ogDescription: 'Personal coaching in English with Meshaal Haider, NLP master coach and ICF coach. In Valby, Copenhagen, online or by phone.',
    url: `${SITE}/en`,
    business: 'Personal NLP and ICF coaching in Valby, Copenhagen, online and by phone.',
    job: 'NLP master coach and ICF coach',
    offers: { valby: 'Single session in Valby', online: 'Online session', phone: 'Phone session', v5: 'Package of 5 sessions in Valby', v10: 'Package of 10 sessions in Valby', o5: 'Package of 5 sessions online or by phone', o10: 'Package of 10 sessions online or by phone' },
    knows: ['NLP coaching', 'Life coaching', 'Stress coaching', 'Career coaching', 'Self-esteem', 'Work-life balance'],
  },
};
const PRICES = { valby: 995, online: 895, phone: 895, v5: 4475, v10: 8950, o5: 4025, o10: 8050 };

const faqLd = (pairs) => ({ '@type': 'FAQPage', mainEntity: pairs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) });
const faqFrom = (html) => [...html.matchAll(/<summary>([\s\S]*?)<\/summary><p>([\s\S]*?)<\/p>/g)].map((m) => [plain(m[1]), plain(m[2])]);

function homeLd(lang, html) {
  const h = HEAD[lang];
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfessionalService',
        '@id': `${SITE}/#business`,
        name: 'MindShiftCoach',
        description: h.business,
        url: h.url,
        logo: `${SITE}/icon-512.png`,
        image: `${SITE}/meshaal.jpg`,
        email: 'mindshiftcoach@hotmail.com',
        telephone: '+4553761728',
        priceRange: '895–8.950 kr',
        address: { '@type': 'PostalAddress', streetAddress: 'Vigerslev Allé 294', postalCode: '2500', addressLocality: 'Valby', addressRegion: 'København', addressCountry: 'DK' },
        areaServed: [{ '@type': 'City', name: 'København' }, { '@type': 'Country', name: 'Danmark' }],
        availableLanguage: ['Danish', 'English'],
        founder: { '@id': `${SITE}/#meshaal` },
        knowsAbout: h.knows,
        makesOffer: Object.keys(PRICES).map((k) => ({ '@type': 'Offer', name: h.offers[k], price: PRICES[k], priceCurrency: 'DKK', url: `${h.url}#priser` })),
      },
      { '@type': 'Person', '@id': `${SITE}/#meshaal`, name: 'Meshaal Haider', jobTitle: h.job, image: `${SITE}/meshaal.jpg`, url: `${h.url}#om`, worksFor: { '@id': `${SITE}/#business` }, knowsLanguage: ['da', 'en'] },
      { '@type': 'WebSite', '@id': `${SITE}/#website`, url: `${SITE}/`, name: 'MindShiftCoach', inLanguage: ['da', 'en'], publisher: { '@id': `${SITE}/#business` } },
      faqLd(faqFrom(html)),
    ],
  };
}

// --- English page ---------------------------------------------------------------------
function buildEnglish(da) {
  const h = HEAD.en, missing = new Set();
  const tr = (s) => {
    const t = s.trim();
    if (!t || /^[\s·,./–-]*$/.test(t) || SAME.has(t)) return s;
    if (!(t in EN)) { missing.add(t); return s; }
    return s.replace(t, () => EN[t]);
  };
  const [head, rest] = da.split(/(?=<body)/);
  const body = rest.replace(/<!--da-only-->[\s\S]*?<!--\/da-only-->\s*/g, '');
  let option = false;
  const out = body.replace(/<script[\s\S]*?<\/script>|<!--[\s\S]*?-->|<[^>]+>|[^<]+/g, (part) => {
    if (part.startsWith('<script') || part.startsWith('<!--')) return part;
    if (part.startsWith('<')) {
      if (part === '<option>') { option = true; return ''; }
      return part.replace(/\b(alt|aria-label|placeholder)="([^"]*)"/g, (m, a, v) => (v ? `${a}="${esc(tr(v))}"` : m));
    }
    if (option) { option = false; return `<option value="${esc(part)}">${tr(part)}`; } // value stays Danish: mails and price rows use it
    return tr(part);
  }).replace(/(<a href="\/" hreflang="da" lang="da") aria-current="true"/, '$1')
    .replace(/(<a href="\/en" hreflang="en" lang="en")/, '$1 aria-current="true"');
  if (missing.size) {
    console.error('Mangler engelsk oversættelse i en-translations.js:\n  ' + [...missing].join('\n  '));
    process.exit(1);
  }
  const hd = head
    .replace('<html lang="da">', '<html lang="en">')
    .replace(/<title>.*?<\/title>/, () => `<title>${h.title}</title>`)
    .replace(/(<meta name="description" content=")[^"]*/, (m, a) => a + esc(h.description))
    .replace(/(<link rel="canonical" href=")[^"]*/, (m, a) => a + h.url)
    .replace(/(<meta property="og:url" content=")[^"]*/, (m, a) => a + h.url)
    .replace(/(<meta property="og:title" content=")[^"]*/, (m, a) => a + esc(h.ogTitle))
    .replace(/(<meta property="og:description" content=")[^"]*/, (m, a) => a + esc(h.ogDescription))
    .replace('<meta property="og:locale" content="da_DK">', '<meta property="og:locale" content="en_GB">')
    .replace('<meta property="og:locale:alternate" content="en_GB">', '<meta property="og:locale:alternate" content="da_DK">');
  return setLd(hd + out, homeLd('en', out));
}

// --- Danish landing pages -------------------------------------------------------------
function buildLanding(p, da) {
  const url = `${SITE}/${p.slug}`;
  const style = da.match(/<style>[\s\S]*?<\/style>/)[0];
  const others = PAGES.filter((o) => o !== p);
  const section = (s) => `  <section class="section prose-section">
    <div class="wrap prose">
      <h2 class="rise">${s.h2}</h2>
${(s.body || []).map((t) => `      <p>${t}</p>`).join('\n')}${s.list ? `      <ul class="prose-list">\n${s.list.map((t) => `        <li>${t}</li>`).join('\n')}\n      </ul>` : ''}
    </div>
  </section>`;
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Service', name: p.service, description: p.description, url, serviceType: p.service, provider: { '@id': `${SITE}/#business` }, areaServed: [{ '@type': 'City', name: 'København' }, { '@type': 'Country', name: 'Danmark' }], availableLanguage: ['Danish', 'English'], offers: { '@type': 'AggregateOffer', lowPrice: 895, highPrice: 995, priceCurrency: 'DKK' } },
      { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Forside', item: `${SITE}/` }, { '@type': 'ListItem', position: 2, name: p.label, item: url }] },
      faqLd(p.faq),
    ],
  };
  return `<!doctype html>
<html lang="da">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(p.title)}</title>
<meta name="description" content="${esc(p.description)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website">
<meta property="og:url" content="${url}">
<meta property="og:site_name" content="MindShiftCoach">
<meta property="og:title" content="${esc(p.title)}">
<meta property="og:description" content="${esc(p.description)}">
<meta property="og:image" content="${SITE}/og.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="da_DK">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#05060f">
<link rel="icon" href="favicon-32.png" type="image/png" sizes="32x32">
<link rel="icon" href="icon-192.png" type="image/png" sizes="192x192">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<link rel="manifest" href="site.webmanifest">
<link rel="preload" href="instrument-serif-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="instrument-serif-italic-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="geist-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="modulepreload" href="three.module.min.js">
${ld(data)}
${style}
</head>
<body>
<a href="#indhold" class="skip">Spring til indhold</a>
<canvas id="mind" aria-hidden="true"></canvas>

<header class="site-header" id="top">
  <div class="wrap nav">
    <a href="/" class="logo" aria-label="MindShift – til forsiden"><img src="logo-hjerne.png" alt="" width="52" height="44"><span>Mind<em>Shift</em></span></a>
    <div class="lang" role="group" aria-label="Vælg sprog">
      <a href="/${p.slug}" hreflang="da" lang="da" aria-current="true">DA</a>
      <a href="/en" hreflang="en" lang="en">EN</a>
    </div>
    <button class="menu-toggle" aria-label="Åbn menu" aria-expanded="false" aria-controls="nav-links">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M4 9h16M4 15h16"/></svg>
    </button>
    <ul class="nav-links" id="nav-links">
      <li><a href="/#om">Om Meshaal</a></li>
      <li><a href="/#forloeb">Forløbet</a></li>
      <li><a href="/#priser">Priser</a></li>
      <li><a href="/#spoergsmaal">Spørgsmål</a></li>
      <li><a href="/#kontakt" class="btn btn-line"><span class="dot"></span>Book en session</a></li>
    </ul>
  </div>
</header>

<main>
  <section class="hero">
    <div class="wrap">
      <div class="hero-bottom">
        <h1><span class="kicker">${p.kicker}</span><span class="ln"><span>${p.h1[0]}</span></span><span class="ln"><span><em>${p.h1[1]}</em></span></span></h1>
        <div class="hero-side">
          <p>${p.lead}</p>
          <div class="btns">
            <a href="/#kontakt" class="btn btn-glow">Book en session</a>
            <a href="/#priser" class="btn btn-line">Se priser</a>
          </div>
        </div>
      </div>
      <div class="hero-meta"><span class="scroll-cue">Scroll for at læse mere</span><nav aria-label="Brødkrumme" class="crumbs"><a href="/">Forside</a> / ${p.label}</nav></div>
    </div>
  </section>

  <div id="indhold"></div>
${p.sections.map(section).join('\n\n')}

  <section class="section">
    <div class="wrap">
      <div class="ways-head">
        <h2 class="rise">Tre måder at mødes på</h2>
        <p class="muted">Alle sessioner varer 45 minutter. Med et klippekort får du en lavere pris pr. gang. <a href="/#priser">Se alle priser</a>.</p>
      </div>
      <div class="way"><h3>I Valby</h3><p>Et roligt rum på Vigerslev Allé 294, 2500 Valby.</p><span class="price">995 kr</span></div>
      <div class="way"><h3>Online</h3><p>Over video, hvor du er.</p><span class="price">895 kr</span></div>
      <div class="way"><h3>Telefonisk</h3><p>Over telefonen, uden skærm.</p><span class="price">895 kr</span></div>
    </div>
  </section>

  <section class="section">
    <div class="wrap faq-grid">
      <div>
        <h2 class="rise">Spørgsmål</h2>
        <p>Kan du ikke finde svaret? Ring på <a href="tel:+4553761728">53 76 17 28</a>.</p>
      </div>
      <div class="faq">
${p.faq.map(([q, a], i) => `        <details${i ? '' : ' open'}><summary>${q}</summary><p>${a}</p></details>`).join('\n')}
      </div>
    </div>
  </section>

  <section class="section what">
    <div class="wrap">
      <h2 class="rise">Tag det første skridt</h2>
      <p class="big">Du behøver ikke have alle svarene, før du skriver.</p>
      <div class="btns cta-btns">
        <a href="/#kontakt" class="btn btn-glow">Book en session</a>
        <a href="/#om" class="btn btn-line">Mød Meshaal</a>
      </div>
      <p class="muted see-also">Læs også om ${others.map((o) => `<a href="/${o.slug}">${o.label.toLowerCase()}</a>`).join(', ').replace(/, ([^,]*)$/, ' og $1')}.</p>
    </div>
  </section>
</main>

<footer>
  <div class="wrap">
    <div class="wordmark" aria-hidden="true">MindShift</div>
    <div class="foot-row">
      <span>Meshaal Haider – NLP- og ICF-coach</span>
      <a href="mailto:mindshiftcoach@hotmail.com">mindshiftcoach@hotmail.com</a>
      <span>Vigerslev Allé 294, 2500 Valby</span>
      <span>Ingen cookies og ingen sporing</span>
    </div>
  </div>
</footer>

<script src="lenis.min.js"></script>
<script type="module" src="mind.js"></script>
<script src="underside.js"></script>
</body>
</html>
`;
}

// --- Sitemap ---------------------------------------------------------------------------
function sitemap() {
  const today = new Date().toISOString().slice(0, 10);
  const alt = `\n    <xhtml:link rel="alternate" hreflang="da" href="${SITE}/"/>\n    <xhtml:link rel="alternate" hreflang="en" href="${SITE}/en"/>\n    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}/"/>`;
  const entry = (loc, extra = '') => `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>${extra}\n  </url>`;
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${[entry(`${SITE}/`, alt), entry(`${SITE}/en`, alt), ...PAGES.map((p) => entry(`${SITE}/${p.slug}`))].join('\n')}
</urlset>
`;
}

const da = setLd(fs.readFileSync('index.html', 'utf8').replace(/\r\n/g, '\n'), {});
const daBody = da.split(/(?=<body)/)[1];
const index = setLd(da, homeLd('da', daBody));
fs.writeFileSync('index.html', index);
fs.writeFileSync('en.html', buildEnglish(index));
PAGES.forEach((p) => fs.writeFileSync(`${p.slug}.html`, buildLanding(p, index)));
fs.writeFileSync('sitemap.xml', sitemap());
console.log(`OK: index.html, en.html, ${PAGES.map((p) => p.slug + '.html').join(', ')}, sitemap.xml`);
