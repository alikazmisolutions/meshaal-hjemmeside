// Each language has its own address (/ and /en), so text on the page is already right.
// This only holds the messages the page writes itself, and keeps your place when you switch.
(function () {
  const EN = {
    "Åbn menu": "Open menu",
    "Luk menu": "Close menu",
    "Beskeden sendes direkte til Meshaal.": "Your message goes directly to Meshaal.",
    "Sender beskeden …": "Sending your message …",
    "Tak! Din besked er sendt. Meshaal vender tilbage hurtigst muligt.": "Thank you! Your message has been sent. Meshaal will get back to you as soon as possible.",
    "Beskeden kunne ikke sendes. Skriv i stedet til mindshiftcoach@hotmail.com eller ring på 53 76 17 28.": "Your message could not be sent. Please write to mindshiftcoach@hotmail.com or call +45 53 76 17 28 instead.",
  };
  const lang = document.documentElement.lang === 'en' ? 'en' : 'da';
  window.i18n = { lang, t: (da) => (lang === 'en' && EN[da]) || da };

  document.querySelectorAll('.lang a').forEach((a) => a.addEventListener('click', () => {
    let id = '';
    document.querySelectorAll('section[id]').forEach((s) => { if (s.getBoundingClientRect().top <= innerHeight / 2) id = s.id; });
    if (id) a.hash = id;
  }));
})();
