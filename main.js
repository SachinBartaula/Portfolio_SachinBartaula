  // Active nav link on scroll
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('nav a');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    navLinks.forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === '#' + current) a.classList.add('active');
    });
  });

  // === Contact Form Validation ===

const fields = {
  fname: {
    el: document.querySelector('[placeholder="First name"]'),
    validate(v) {
      if (!v) return 'First name is required';
      if (!/^[a-zA-Z]/.test(v)) return 'Must start with a letter';
      if (v.length < 2) return 'Must be at least 2 characters';
      if (!/^[a-zA-Z\s'-]+$/.test(v)) return 'Letters, hyphens, and apostrophes only';
      return '';
    }
  },
  lname: {
    el: document.querySelector('[placeholder="Last name"]'),
    validate(v) {
      if (!v) return 'Last name is required';
      if (!/^[a-zA-Z]/.test(v)) return 'Must start with a letter';
      if (v.length < 2) return 'Must be at least 2 characters';
      if (!/^[a-zA-Z\s'-]+$/.test(v)) return 'Letters, hyphens, and apostrophes only';
      return '';
    }
  },
  email: {
    el: document.querySelector('[placeholder="E-mail Address"]'),
    validate(v) {
      if (!v) return 'Email address is required';
      if (!/^[a-zA-Z]/.test(v)) return 'Must start with a letter';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return 'Enter a valid email address';
      return '';
    }
  },
  phone: {
    el: document.querySelector('[placeholder="Phone no."]'),
    validate(v) {
      if (!v) return '';
      const digits = v.replace(/\D/g, '');
      if (digits.length < 7) return 'Too short — check the number';
      if (digits.length > 15) return 'Too long — check the number';
      if (!/^[0-9+\s()\-]+$/.test(v)) return 'Numbers, spaces, +, (), and - only';
      return '';
    }
  },
  msg: {
    el: document.querySelector('textarea'),
    validate(v) {
      if (!v) return 'Please write a message';
      if (!/^[a-zA-Z]/.test(v)) return 'Must start with a letter';
      if (v.trim().length < 10) return 'Message is too short — at least 10 characters';
      if (v.length > 500) return 'Message must be under 500 characters';
      return '';
    }
  }
};

// --- Pre-reserve error space under every field on page load ---
// This runs ONCE at init so layout never shifts when errors appear/disappear
function initErrorSlots() {
  Object.keys(fields).forEach(key => {
    const el = fields[key].el;

    // Wrap the input in a div that holds both the input and the error slot
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'display:flex;flex-direction:column;width:100%;';
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);

    // Create the error slot — always present, always 16px tall
    const errSpan = document.createElement('span');
    errSpan.className = 'field-error';
    errSpan.style.cssText = [
      'display:block',
      'font-size:12px',
      'color:#c0392b',
      'margin-top:4px',
      'height:16px',       // fixed height — never collapses, never expands
      'line-height:16px',
      'overflow:hidden',   // long messages clip instead of wrapping and pushing layout
      'white-space:nowrap'
    ].join(';');
    wrapper.appendChild(errSpan);

    // Store reference directly on the field object for fast access later
    fields[key].errEl = errSpan;
  });
}

// --- Apply visual state to a field ---
function setFieldState(key, errMsg) {
  const { el, errEl } = fields[key];
  const hasValue = el.value.trim().length > 0;

  el.style.borderColor = errMsg ? '#e74c3c' : hasValue ? '#27ae60' : '';
  el.style.outline     = errMsg
    ? '2px solid rgba(231,76,60,.2)'
    : hasValue
    ? '2px solid rgba(39,174,96,.2)'
    : 'none';

  errEl.textContent = errMsg || ''; // empty string keeps the 16px slot intact
}

// --- Attach listeners ---
function initListeners() {
  Object.keys(fields).forEach(key => {
    const { el } = fields[key];
    let touched = false;

    el.addEventListener('blur', () => {
      touched = true;
      setFieldState(key, fields[key].validate(el.value.trim()));
    });

    el.addEventListener('input', () => {
      if (touched) setFieldState(key, fields[key].validate(el.value.trim()));
    });
  });
}

// --- Live character counter for textarea ---
function initCharCounter() {
  const textarea = document.querySelector('textarea');
  const counter  = document.createElement('span');

  counter.style.cssText = [
    'display:block',
    'font-size:12px',
    'color:#888',
    'text-align:right',
    'height:16px',
    'line-height:16px',
    'margin-top:2px'
  ].join(';');

  // Insert AFTER the error slot of the textarea (which initErrorSlots added)
  fields.msg.errEl.insertAdjacentElement('afterend', counter);

  textarea.addEventListener('input', () => {
    const n = textarea.value.length;
    counter.textContent    = `${n} / 500`;
    counter.style.color    = n > 480 ? '#c0392b' : n > 400 ? '#e67e22' : '#888';
  });
}

// --- Submit handler ---
function initSubmit() {
  document.querySelector('button.btn-primary').addEventListener('click', () => {
    let allValid = true;

    Object.keys(fields).forEach(key => {
      const err = fields[key].validate(fields[key].el.value.trim());
      setFieldState(key, err);
      if (err) allValid = false;
    });

    if (!allValid) {
      // Focus the first field that has an error message showing
      const firstInvalid = Object.values(fields).find(f => f.errEl.textContent.trim() !== '');
      if (firstInvalid) firstInvalid.el.focus();
      return;
    }

    alert('Message sent! Thank you for reaching out.');
  });
}

// --- Boot ---
initErrorSlots();
initListeners();
initCharCounter();
initSubmit();