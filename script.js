document.addEventListener('DOMContentLoaded', () => {
  // Navbar scroll effect
  const navbar = document.getElementById('navbar');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Intersection Observer for scroll animations
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        
        // Handle delayed animations
        const delay = entry.target.getAttribute('data-delay');
        if (delay) {
          entry.target.style.transitionDelay = `${delay}ms`;
        }
        
        // Optional: unobserve after animating once
        // observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all elements with data-animate attribute
  const animateElements = document.querySelectorAll('[data-animate]');
  animateElements.forEach(el => observer.observe(el));
});

// Copy code to clipboard
function copyCode(button) {
  const codeBlock = button.closest('.code-block').querySelector('code');
  const textToCopy = codeBlock.innerText;

  navigator.clipboard.writeText(textToCopy).then(() => {
    // Change icon to checkmark temporarily
    const originalIcon = button.innerHTML;
    button.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34c759" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>';
    
    setTimeout(() => {
      button.innerHTML = originalIcon;
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy: ', err);
  });
}
