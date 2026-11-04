// Danish <-> English switch. Danish stays in the HTML; this holds the English, keyed by
// the exact Danish text (or attribute). Form option values stay Danish, so Meshaal's
// mails read the same whichever language the visitor picked.
(function () {
  const EN = {
    // page
    'MindShiftCoach – NLP & ICF coaching i Valby og online': 'MindShiftCoach – NLP & ICF coaching in Valby and online',
    'Personlig NLP- og ICF-coaching med Meshaal Haider. Sessioner i Valby eller online – for mere ro, klarhed og mod til at tage det første skridt. Fra 895 kr.': 'Personal NLP and ICF coaching with Meshaal Haider. Sessions in Valby or online – for more calm, clarity and the courage to take the first step. From DKK 895.',
    'Spring til indhold': 'Skip to content',
    'MindShift – til toppen': 'MindShift – back to top',
    'Åbn menu': 'Open menu',
    'Luk menu': 'Close menu',
    'Vælg sprog': 'Choose language',

    // navigation
    'Om Meshaal': 'About Meshaal',
    'Forløbet': 'The journey',
    'Priser': 'Prices',
    'Spørgsmål': 'Questions',
    'Book en session': 'Book a session',

    // hero
    'MindShift begynder': 'MindShift begins',
    'i dit sind.': 'in your mind.',
    'Måske fungerer alt udadtil, mens noget indeni længes efter forandring. Her er der plads til at mærke, hvad du vil – og hjælp til at gå efter det.': 'Maybe everything works on the outside, while something inside you longs for change. Here there is room to feel what you want – and help to go after it.',
    'Se priser': 'See prices',
    'Scroll for at udforske': 'Scroll to explore',
    'NLP- og ICF-coaching med Meshaal Haider, Valby': 'NLP and ICF coaching with Meshaal Haider, Valby',

    // topics
    'Det kan du arbejde med': 'What you can work on',
    'Stress og indre ro': 'Stress and inner calm',
    'Karriere og retning': 'Career and direction',
    'Begrænsende overbevisninger': 'Limiting beliefs',
    'Livsbalance': 'Life balance',
    'Selvværd': 'Self-worth',
    'Personlig vækst': 'Personal growth',
    'Motivation til at handle': 'Motivation to act',

    // recognise
    'Genkender du noget af det her?': 'Does any of this sound familiar?',
    'Du leverer, smiler og klarer det hele – men om aftenen er du tom.': 'You deliver, you smile, you handle it all – but by evening you feel empty.',
    'Dine tanker kører i ring, også når du burde sove.': 'Your thoughts go round in circles, even when you should be asleep.',
    'Du ved, at noget skal ændres, men ikke hvor du skal begynde.': 'You know something has to change, but not where to begin.',
    'Du siger ja, selvom alt i dig siger nej.': 'You say yes, even when everything in you says no.',
    'En indre stemme siger, at du ikke er god nok, og du er begyndt at tro på den.': 'An inner voice says you are not good enough, and you have started to believe it.',
    'Du står ved en skillevej og er bange for at vælge forkert.': 'You are at a crossroads and afraid of choosing wrong.',
    'Der er ikke noget galt med dig. Det, du tænker om dig selv, har du lært – og det, der er lært, kan ændres. Du skal bare ikke gøre det alene.': 'There is nothing wrong with you. What you think about yourself is something you have learned – and what is learned can be changed. You just don’t have to do it alone.',

    // about
    'Meshaal Haider, NLP- og ICF-coach': 'Meshaal Haider, NLP and ICF coach',
    'Hej, jeg hedder Meshaal': 'Hi, I’m Meshaal',
    'Jeg er ikke her for at fortælle dig, hvordan du skal leve dit liv. Jeg er her for at lytte til det, du siger – og til det, du endnu ikke har fundet ord for.': 'I am not here to tell you how to live your life. I am here to listen to what you say – and to what you have not yet found the words for.',
    'Som menneske er jeg nærværende, nysgerrig og oprigtigt optaget af den, der sidder over for mig. Du behøver ikke have styr på det hele, når du kommer, og du behøver ikke pynte på noget. Hos mig må du være, som du er – også på de dage, hvor alting føles tungt.': 'As a person, I am present, curious and genuinely interested in whoever is sitting across from me. You don’t need to have it all together when you come, and you don’t need to dress anything up. With me, you can be as you are – also on the days when everything feels heavy.',
    'Som professionel står jeg på et solidt fundament. Jeg er NLP-mastercoach og ICF-coach og arbejder efter de etiske standarder fra International Coaching Federation. Med visualisering, sprogmodeller og strategier til at ændre følelsesmæssige tilstande hjælper jeg dig med at få øje på de tankemønstre, der har styret dig, og skabe nye, der passer til den, du er i dag.': 'As a professional, I stand on a solid foundation. I am an NLP master coach and ICF coach and work by the ethical standards of the International Coaching Federation. Using visualisation, language models and strategies for changing emotional states, I help you notice the thought patterns that have been steering you, and create new ones that fit who you are today.',
    'Mit løfte til dig er enkelt: Du bliver set, du bliver hørt, og det, du fortæller, bliver mellem os. Svarene er dine egne. Jeg hjælper dig med at finde dem – og stole på dem.': 'My promise to you is simple: you will be seen, you will be heard, and what you tell me stays between us. The answers are your own. I help you find them – and trust them.',
    'NLP-mastercoach': 'NLP master coach',
    'ICF-coach': 'ICF coach',
    'Valby og online': 'Valby and online',

    // ways to meet
    'Tre måder at mødes på': 'Three ways to meet',
    'Det vigtigste er, at du føler dig tryg, så vælg det, der passer dig. Alle sessioner varer 45 minutter og tilpasses det, du står i.': 'What matters most is that you feel safe, so choose what suits you. All sessions last 45 minutes and are shaped around what you are going through.',
    'I Valby': 'In Valby',
    'Et roligt rum på Vigerslev Allé, hvor hverdagen bliver udenfor. Her kan du trække vejret, give slip og være helt til stede.': 'A calm room on Vigerslev Allé, where everyday life stays outside. Here you can breathe, let go and be fully present.',
    'Mød mig fra dit eget hjem, hvor du allerede føler dig tryg. Nærværet er det samme, og transporten slipper du for.': 'Meet me from your own home, where you already feel safe. The presence is the same, and you skip the journey.',
    'Telefonisk': 'By phone',
    'Nogle ting er lettere at sige, når ingen kigger på. Over telefonen kan du lukke øjnene, gå en tur eller sidde, hvor du har det bedst.': 'Some things are easier to say when no one is looking. On the phone you can close your eyes, go for a walk or sit wherever feels best.',
    '995 kr': 'DKK 995',
    '895 kr': 'DKK 895',

    // process
    'En vej, du ikke skal gå alene': 'A path you don’t have to walk alone',
    'Forandring sker sjældent på én gang. Derfor følger vi et forløb i seks trin, der giver dig overblik og tryghed – med plads til at gå i dybden, hvor det betyder mest.': 'Change rarely happens all at once. That is why we follow a six-step process that gives you overview and security – with room to go deeper where it matters most.',
    'Trin 1': 'Step 1', 'Trin 2': 'Step 2', 'Trin 3': 'Step 3', 'Trin 4': 'Step 4', 'Trin 5': 'Step 5', 'Trin 6': 'Step 6',
    'Opstart': 'Getting started',
    'Vi lærer hinanden at kende i dit tempo. Du fortæller, hvad der fylder, og vi aftaler rammerne, så du ved, hvad du kan forvente.': 'We get to know each other at your pace. You tell me what is on your mind, and we agree on the framework so you know what to expect.',
    'Målafklaring': 'Clarifying your goals',
    'Vi sætter ord på, hvad du længes efter, og hvorfor det betyder noget for netop dig.': 'We put words to what you long for, and why it matters to you in particular.',
    'Udforskning og indsigt': 'Exploration and insight',
    'Vi undersøger de tanker og mønstre, der har holdt dig tilbage – og de styrker, du måske har glemt, at du har.': 'We explore the thoughts and patterns that have held you back – and the strengths you may have forgotten you have.',
    'Muligheder og valg': 'Options and choices',
    'Når du ser din situation fra nye vinkler, opstår der veje, du ikke kunne se før. Du vælger selv, hvilken der er din.': 'When you see your situation from new angles, paths appear that you could not see before. You choose which one is yours.',
    'Handling': 'Action',
    'Du omsætter indsigt til konkrete skridt, der passer til dit liv. Små nok til, at du tør tage dem. Store nok til, at de gør en forskel.': 'You turn insight into concrete steps that fit your life. Small enough that you dare to take them. Big enough to make a difference.',
    'Evaluering og afslutning': 'Evaluation and closing',
    'Vi ser tilbage på, hvor langt du er kommet, og sikrer, at du har det, der skal til for at fortsætte på egen hånd.': 'We look back on how far you have come and make sure you have what it takes to continue on your own.',

    // what is coaching
    'Hvad er coaching?': 'What is coaching?',
    'En samtale, hvor du endelig får plads til at høre dig selv tænke.': 'A conversation where you finally get room to hear yourself think.',
    'Gennem nærværende spørgsmål, refleksion og ærlig feedback får du mere selvindsigt, klarhed over, hvad du vil, og mod til at tage de næste skridt. Det er dine egne ressourcer, svar og beslutninger, der er i centrum. Coaching kan bruges til fx karriereudvikling, stresshåndtering, livsbalance og personlig vækst.': 'Through attentive questions, reflection and honest feedback, you gain more self-insight, clarity about what you want and the courage to take the next steps. Your own resources, answers and decisions are at the centre. Coaching can be used for career development, stress management, life balance and personal growth, for example.',
    'Det kræver tillid at åbne op. Derfor arbejder jeg efter de internationale etiske standarder og principper fra International Coaching Federation, og det, du fortæller, behandles fortroligt.': 'Opening up takes trust. That is why I work by the international ethical standards and principles of the International Coaching Federation, and what you tell me is treated confidentially.',

    // prices
    'En investering i dig selv og i den måde, du har det på i hverdagen. Alle sessioner varer 45 minutter, og med et klippekort får du et sammenhængende forløb til en lavere pris pr. gang.': 'An investment in yourself and in how you feel day to day. All sessions last 45 minutes, and a session package gives you a continuous process at a lower price per session.',
    'Enkelt session': 'Single session',
    '1-til-1 med skræddersyet plan': '1-to-1 with a tailored plan',
    '5 sessioner': '5 sessions',
    '10 sessioner': '10 sessions',
    '4.475 kr': 'DKK 4,475',
    '8.950 kr': 'DKK 8,950',
    '4.025 kr': 'DKK 4,025',
    '8.050 kr': 'DKK 8,050',
    'Spar 500 kr, gælder 12 måneder': 'Save DKK 500, valid for 12 months',
    'Spar 1.000 kr, gælder 24 måneder': 'Save DKK 1,000, valid for 24 months',
    'Online og telefonisk': 'Online and by phone',
    'Over video eller telefon, hvor du er': 'By video or phone, wherever you are',
    'Online session': 'Online session',
    'Over video, fleksibel tidsplan': 'By video, flexible schedule',
    'Telefonisk session': 'Phone session',
    'Over telefonen, uden skærm': 'By phone, no screen',
    'Spar 450 kr, brug dem online eller over telefon': 'Save DKK 450, use them online or by phone',
    'Spar 900 kr, brug dem online eller over telefon': 'Save DKK 900, use them online or by phone',
    'I tvivl om, hvad der passer dig?': 'Not sure what suits you?',
    'Skriv til mig': 'Write to me',
    ', så finder vi ud af det sammen.': ', and we will figure it out together.',

    // FAQ
    'Kan du ikke finde svaret? Ring på': 'Can’t find the answer? Call',
    'Hvad sker der i den første session?': 'What happens in the first session?',
    'Du behøver ikke forberede noget eller have fundet de rigtige ord. Vi lærer hinanden at kende, du fortæller, hvad der fylder, og sammen afklarer vi, hvad du gerne vil have ud af forløbet.': 'You don’t need to prepare anything or have found the right words. We get to know each other, you tell me what is on your mind, and together we clarify what you would like to get out of the process.',
    'Jeg ved ikke præcis, hvad jeg vil arbejde med. Kan jeg godt komme?': 'I don’t know exactly what I want to work on. Can I still come?',
    'Ja. En fornemmelse af, at noget skal ændres, er nok at begynde med. At finde ud af, hvad det er, er en del af arbejdet.': 'Yes. A feeling that something needs to change is enough to begin with. Finding out what it is, is part of the work.',
    'Hvad er forskellen på coaching og terapi?': 'What is the difference between coaching and therapy?',
    'Coaching er fremadrettet og fokuserer på dine mål, ressourcer og handlinger. Det er dine egne svar og beslutninger, der er i centrum. Står du i noget, der kræver behandling, er coaching ikke det rette sted at begynde, og så siger jeg det ærligt.': 'Coaching looks forward and focuses on your goals, resources and actions. Your own answers and decisions are at the centre. If you are facing something that requires treatment, coaching is not the right place to begin, and I will tell you so honestly.',
    'Er det, jeg fortæller, fortroligt?': 'Is what I say confidential?',
    'Ja. Du skal kunne tale frit. Som ICF-coach følger jeg International Coaching Federations etiske retningslinjer, som blandt andet omfatter fortrolighed.': 'Yes. You should be able to speak freely. As an ICF coach, I follow the ethical guidelines of the International Coaching Federation, which include confidentiality.',
    'Hvor længe gælder et klippekort?': 'How long is a session package valid?',
    'Klippekort med 5 sessioner i Valby gælder i 12 måneder, og klippekort med 10 sessioner gælder i 24 måneder.': 'Packages of 5 sessions in Valby are valid for 12 months, and packages of 10 sessions are valid for 24 months.',
    'Hvor foregår de personlige sessioner?': 'Where do the in-person sessions take place?',
    'På Vigerslev Allé 294, 2500 Valby – i et roligt rum indrettet til ro og refleksion.': 'At Vigerslev Allé 294, 2500 Valby – in a quiet room set up for calm and reflection.',

    // contact and form
    'Tag det første skridt': 'Take the first step',
    'Det første skridt er ofte det sværeste, og du behøver ikke have alle svarene, før du skriver. Fortæl kort, hvad der fylder, så vender jeg tilbage med et forslag til tid.': 'The first step is often the hardest, and you don’t need to have all the answers before you write. Tell me briefly what is on your mind, and I will get back to you with a suggested time.',
    'E-mail': 'Email',
    'Telefon': 'Phone',
    'Adresse': 'Address',
    'Navn': 'Name',
    'Jeg er interesseret i': 'I am interested in',
    'Enkelt session – Valby (995 kr)': 'Single session – Valby (DKK 995)',
    'Online session (895 kr)': 'Online session (DKK 895)',
    'Telefonisk session (895 kr)': 'Phone session (DKK 895)',
    'Klippekort 5 sessioner – Valby (4.475 kr)': 'Package of 5 sessions – Valby (DKK 4,475)',
    'Klippekort 10 sessioner – Valby (8.950 kr)': 'Package of 10 sessions – Valby (DKK 8,950)',
    'Klippekort 5 sessioner – online eller telefon (4.025 kr)': 'Package of 5 sessions – online or phone (DKK 4,025)',
    'Klippekort 10 sessioner – online eller telefon (8.050 kr)': 'Package of 10 sessions – online or phone (DKK 8,050)',
    'Jeg har et spørgsmål': 'I have a question',
    'Besked': 'Message',
    'Skriv det, du har lyst til. Hvad fylder hos dig, og hvornår passer det dig?': 'Write whatever you like. What is on your mind, and when suits you?',
    'Send besked': 'Send message',
    'Beskeden sendes direkte til Meshaal.': 'Your message goes directly to Meshaal.',
    'Sender beskeden …': 'Sending your message …',
    'Tak! Din besked er sendt. Meshaal vender tilbage hurtigst muligt.': 'Thank you! Your message has been sent. Meshaal will get back to you as soon as possible.',
    'Beskeden kunne ikke sendes. Skriv i stedet til mindshiftcoach@hotmail.com eller ring på 53 76 17 28.': 'Your message could not be sent. Please write to mindshiftcoach@hotmail.com or call +45 53 76 17 28 instead.',

    // footer
    'Meshaal Haider – NLP- og ICF-coach': 'Meshaal Haider – NLP and ICF coach',
    'Ingen cookies og ingen sporing': 'No cookies and no tracking',
  };

  const ATTRS = ['alt', 'aria-label', 'placeholder'];
  const STORE = 'mindshift-lang';
  const texts = [], attrs = [];
  const meta = document.querySelector('meta[name="description"]');
  const page = { title: document.title, desc: meta && meta.content };
  const translate = (da) => EN[da.trim()];

  // Option values stay Danish: price rows select by them, and mails stay readable for Meshaal
  document.querySelectorAll('option').forEach((o) => { o.value = o.textContent; });

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => (n.parentElement.closest('script, style, #form-status') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
  });
  while (walker.nextNode()) if (translate(walker.currentNode.nodeValue)) texts.push({ node: walker.currentNode, da: walker.currentNode.nodeValue });
  document.querySelectorAll('[alt], [aria-label], [placeholder]').forEach((el) => {
    ATTRS.forEach((a) => { const v = el.getAttribute(a); if (v && translate(v)) attrs.push({ el, a, da: v }); });
  });

  const i18n = {
    lang: 'da',
    t: (da) => (i18n.lang === 'en' && EN[da]) || da,
    set(lang, save = true) {
      i18n.lang = lang === 'en' ? 'en' : 'da';
      const en = i18n.lang === 'en';
      document.documentElement.lang = i18n.lang;
      document.title = en ? EN[page.title] : page.title;
      if (meta) meta.content = en ? EN[page.desc] : page.desc;
      texts.forEach(({ node, da }) => { node.nodeValue = en ? da.replace(da.trim(), () => translate(da)) : da; });
      attrs.forEach(({ el, a, da }) => el.setAttribute(a, en ? translate(da) : da));
      document.querySelectorAll('.lang button').forEach((b) => b.setAttribute('aria-pressed', b.dataset.lang === i18n.lang));
      if (save) { try { localStorage.setItem(STORE, i18n.lang); } catch (e) {} }
      document.dispatchEvent(new CustomEvent('langchange'));
    },
  };
  window.i18n = i18n;

  document.querySelectorAll('.lang button').forEach((b) => b.addEventListener('click', () => i18n.set(b.dataset.lang)));

  // ?lang=en makes a link open in English; otherwise the visitor's last choice, then Danish
  let saved = null;
  try { saved = localStorage.getItem(STORE); } catch (e) {}
  const asked = new URLSearchParams(location.search).get('lang');
  i18n.lang = (asked || saved) === 'en' ? 'en' : 'da';
  document.documentElement.lang = i18n.lang;
  if (i18n.lang === 'en') i18n.set('en', Boolean(asked));
  else document.querySelectorAll('.lang button').forEach((b) => b.setAttribute('aria-pressed', b.dataset.lang === 'da'));
})();
