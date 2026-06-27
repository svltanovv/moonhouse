// ─── Hamburger menu ───────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');
const navOverlay = document.getElementById('navOverlay');

if (hamburger) {
  hamburger.addEventListener('click', toggleMenu);
}
if (navOverlay) {
  navOverlay.addEventListener('click', closeMenu);
}

function toggleMenu() {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  navOverlay.classList.toggle('visible', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

function closeMenu() {
  navLinks.classList.remove('open');
  hamburger.classList.remove('open');
  navOverlay.classList.remove('visible');
  document.body.style.overflow = '';
}

// Close menu on nav link click (but not on dropdown parent links)
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', function() {
    if (this.parentElement.classList.contains('has-dropdown')) return;
    closeMenu();
  });
});

// ─── Mobile dropdown accordion ────────────────────────
document.querySelectorAll('.has-dropdown > a').forEach(a => {
  a.addEventListener('click', function(e) {
    if (window.innerWidth <= 1100) {
      e.preventDefault();
      const li = this.parentElement;
      // Close other open dropdowns
      document.querySelectorAll('.has-dropdown.expanded').forEach(other => {
        if (other !== li) other.classList.remove('expanded');
      });
      li.classList.toggle('expanded');
    }
  });
});

// ─── FAQ accordion ────────────────────────────────────
document.querySelectorAll('.faq-question').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.parentElement;
    const wasOpen = item.classList.contains('open');
    // close all
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

// ─── Toast notification ───────────────────────────────
function showToast(title, message) {
  let toast = document.querySelector('.mh-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'mh-toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = '<span class="mh-toast-title">' + title + '</span>' + message;
  // Force reflow then show
  void toast.offsetWidth;
  toast.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove('show'), 3800);
}

function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v || '').trim());
}

// ─── Newsletter subscribe ─────────────────────────────
document.querySelectorAll('.newsletter-form').forEach(form => {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    const email = input ? input.value.trim() : '';
    if (!isValidEmail(email)) {
      showToast('Invalid email', 'Please enter a valid email address.');
      if (input) input.focus();
      return;
    }
    if (input) input.value = '';
    showToast('Subscribed', 'Thank you! You are now subscribed to our newsletter.');
  });
});

// ─── Consultation / contact buttons ───────────────────
document.querySelectorAll('button.btn-gold').forEach(btn => {
  // Skip newsletter button — it's handled by the form's submit event
  if (btn.closest('.newsletter-form')) return;
  btn.addEventListener('click', function(e) {
    e.preventDefault();
    const scope = btn.closest('.consult-form, form, section, .props-filter') || document;
    const nameInput = scope.querySelector('input[type="text"]');
    const phoneInput = scope.querySelector('input[type="tel"]');
    const emailInput = scope.querySelector('input[type="email"]');
    const hasContactFields = !!(nameInput || phoneInput || emailInput);

    if (hasContactFields) {
      const nameVal = nameInput ? nameInput.value.trim() : '';
      const phoneVal = phoneInput ? phoneInput.value.trim() : '';
      const emailVal = emailInput ? emailInput.value.trim() : '';
      let firstInvalid = null;
      if (nameInput && !nameVal) firstInvalid = nameInput;
      else if (phoneInput && !phoneVal) firstInvalid = phoneInput;
      else if (emailVal && !isValidEmail(emailVal)) firstInvalid = emailInput;
      if (firstInvalid) {
        showToast('Please complete the form', 'Fill in your name, phone and a valid email.');
        firstInvalid.focus();
        return;
      }
    }

    scope.querySelectorAll('input, textarea').forEach(el => { el.value = ''; });
    scope.querySelectorAll('select').forEach(el => { el.selectedIndex = 0; });
    showToast('Request sent', 'Thank you! Our specialist will contact you within 1 business day.');
  });
});
