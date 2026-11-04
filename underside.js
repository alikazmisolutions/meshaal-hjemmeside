// Small script for the landing pages: smooth scroll, header, heading entrance, mobile menu.
(function () {
  document.documentElement.classList.add('js');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (window.Lenis && !reduce) {
    const lenis = new Lenis({ lerp: 0.09 });
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }

  const header = document.querySelector('.site-header');
  const onScroll = () => header.classList.toggle('solid', scrollY > innerHeight * 0.6);
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });

  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { rootMargin: '0px 0px -10% 0px' });
  document.querySelectorAll('.rise').forEach((el) => io.observe(el));

  const toggle = document.querySelector('.menu-toggle');
  const links = document.getElementById('nav-links');
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Luk menu' : 'Åbn menu');
  });
})();
