(() => {
  // Hamburger menu toggle
  const hamburger = document.getElementById('hamburger');
  const navbarMenu = document.getElementById('navbar-menu');
  
  if (hamburger && navbarMenu) {
    hamburger.addEventListener('click', () => {
      const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', !isExpanded);
      navbarMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    navbarMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.setAttribute('aria-expanded', 'false');
        navbarMenu.classList.remove('active');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.navbar')) {
        hamburger.setAttribute('aria-expanded', 'false');
        navbarMenu.classList.remove('active');
      }
    });
  }

  const backToTop = document.querySelector('.back-to-top');

  const onScroll = () => {
    if (!backToTop) return;
    if (window.scrollY > 600) backToTop.classList.add('is-visible');
    else backToTop.classList.remove('is-visible');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const revealEls = Array.from(document.querySelectorAll('.reveal'));
  revealEls.forEach((el, i) => {
    // Staggered reveal for smoother section entry
    el.style.transitionDelay = `${Math.min(i * 60, 280)}ms`;
  });
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  // Scroll-float animation for creative cards
  const floatEls = Array.from(document.querySelectorAll('.scroll-float'));
  const animateFloat = () => {
    if (!floatEls.length) return;
    const vh = window.innerHeight || 1;
    for (let i = 0; i < floatEls.length; i += 1) {
      const el = floatEls[i];
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const distance = (center - vh / 2) / vh;
      const offset = Math.max(-10, Math.min(10, distance * 18));
      el.style.setProperty('--float-offset', `${offset.toFixed(2)}px`);
    }
  };
  window.addEventListener('scroll', animateFloat, { passive: true });
  window.addEventListener('resize', animateFloat);
  animateFloat();

  // Smooth in-page anchors
  document.addEventListener('click', (ev) => {
    const a = ev.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (!id || id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    ev.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // Doctor photos: hide icon if photo loads, fallback if missing
  const initDoctorPhotos = (root = document) => {
    const avatars = Array.from(root.querySelectorAll('.doctor-avatar'));
    avatars.forEach((avatar) => {
      const img = avatar.querySelector('img.doctor-photo');
      if (!img) return;
      const onLoad = () => avatar.classList.remove('no-photo');
      const onError = () => {
        img.remove();
        avatar.classList.add('no-photo');
      };
      if (img.complete && img.naturalWidth > 0) onLoad();
      else {
        img.addEventListener('load', onLoad, { once: true });
        img.addEventListener('error', onError, { once: true });
      }
    });
  };
  initDoctorPhotos();

  // Doctor slider (About page) — live running marquee
  const slider = document.querySelector('.doctor-slider--marquee');
  if (slider) {
    const track = slider.querySelector('.doctor-track');
    if (track) {
      const original = Array.from(track.children);
      // Duplicate once for seamless loop
      original.forEach((node) => track.appendChild(node.cloneNode(true)));
      // Ensure cloned nodes also get photo fallback behavior
      initDoctorPhotos(track);

      const compute = () => {
        const firstHalfWidth = original.reduce((sum, el) => sum + el.getBoundingClientRect().width, 0);
        const styles = window.getComputedStyle(track);
        const gap = Number.parseFloat(styles.columnGap || styles.gap || '0') || 0;
        const distance = firstHalfWidth + gap * Math.max(0, original.length - 1);
        // speed: ~60px/s
        const duration = Math.max(18, distance / 60);
        slider.style.setProperty('--doctor-marquee-distance', `${Math.ceil(distance)}px`);
        slider.style.setProperty('--doctor-marquee-duration', `${duration.toFixed(2)}s`);
      };

      // Run after layout + on resize
      requestAnimationFrame(compute);
      window.addEventListener('resize', () => requestAnimationFrame(compute));
    }
  }

  // Gallery slider — live running marquee
  const gallerySlider = document.querySelector('.gallery-slider--marquee');
  if (gallerySlider) {
    const track = gallerySlider.querySelector('.gallery-track');
    if (track) {
      const original = Array.from(track.children);
      original.forEach((node) => track.appendChild(node.cloneNode(true)));

      const compute = () => {
        const firstHalfWidth = original.reduce((sum, el) => sum + el.getBoundingClientRect().width, 0);
        const styles = window.getComputedStyle(track);
        const gap = Number.parseFloat(styles.columnGap || styles.gap || '0') || 0;
        const distance = firstHalfWidth + gap * Math.max(0, original.length - 1);
        const duration = Math.max(16, distance / 70);
        gallerySlider.style.setProperty('--gallery-marquee-distance', `${Math.ceil(distance)}px`);
        gallerySlider.style.setProperty('--gallery-marquee-duration', `${duration.toFixed(2)}s`);
      };

      requestAnimationFrame(compute);
      window.addEventListener('resize', () => requestAnimationFrame(compute));
    }
  }
})();

