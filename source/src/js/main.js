/* ============================================
   Rengrow Consulting Crew — Main JavaScript
   Vanilla JS + Bootstrap 5.3.8 behaviours
   ============================================ */

/* Bootstrap 5 (latest), Bootstrap Icons and custom styles */
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../css/style.css';
import * as bootstrap from 'bootstrap';

window.bootstrap = bootstrap;

/* Render the 8 service categories (cards, filters, modals, footer, form) */
import './services-render.js';
/* Render the Articles & Blog magazine page */
import './blog-render.js';

const CONTACT_EMAIL = 'rengrowconsulting99@gmail.com';

/* ---------- Helpers ---------- */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

const inr = (n) =>
  '₹' + Math.round(n).toLocaleString('en-IN');

const inrShort = (n) => {
  if (n >= 1e7) return '₹' + (n / 1e7).toFixed(2) + ' Cr';
  if (n >= 1e5) return '₹' + (n / 1e5).toFixed(2) + ' L';
  return inr(n);
};

/* ---------- Current year ---------- */
const yearEl = $('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---------- Navbar shrink on scroll + back to top ---------- */
const nav = $('#mainNav');
const topBtn = $('#backToTop');

const onScroll = () => {
  const y = window.scrollY;
  if (nav) nav.classList.toggle('scrolled', y > 40);
  if (topBtn) topBtn.classList.toggle('show', y > 420);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

if (topBtn) {
  topBtn.addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: 'smooth' })
  );
}

/* ============================================
   SIMPLE HASH ROUTER (multi-page)
   Routes: /  /services  /blog  /contact
   ============================================ */
const PAGE_TITLES = {
  '/': 'Rengrow Consulting Crew | Financial • Taxation • Compliance • Business Solutions',
  '/services': 'Our Services | Rengrow Consulting Crew',
  '/blog': 'Articles & Blog | Rengrow Consulting Crew',
  '/contact': 'Contact Us | Rengrow Consulting Crew'
};

const pages = $$('[data-page]');
const navCollapse = $('#navMenu');
let navigationVersion = 0;
function currentTarget() {
  const raw = (location.hash || '').replace(/^#/, '').split('?')[1] || '';
  return new URLSearchParams(raw).get('section') || '';
}
function updateNav(route, section) {
  document.querySelectorAll('#mainNav .nav-link').forEach(a => {
    const active = a.dataset.route === route && (a.dataset.target || '') === section;
    a.classList.toggle('active', active);
    if (active) a.setAttribute('aria-current', section ? 'location' : 'page'); else a.removeAttribute('aria-current');
  });
}

function closeMobileMenu() {
  if (navCollapse && navCollapse.classList.contains('show')) {
    window.bootstrap?.Collapse.getOrCreateInstance(navCollapse).hide();
  }
}

function currentRoute() {
  const h = (location.hash || '').replace(/^#/, '').split('?')[0];
  return PAGE_TITLES[h] ? h : '/';
}

function renderRoute() {
  const route = currentRoute();

  pages.forEach((p) => {
    const match = p.dataset.page === route;
    p.hidden = !match;
    if (match) {
      p.classList.remove('page-in');
      void p.offsetWidth; // restart animation
      p.classList.add('page-in');
    }
  });

  document.title = PAGE_TITLES[route];

  const section = route === '/' ? currentTarget() : '';
  updateNav(route, section);
  const visible = pages.find(p => p.dataset.page === route);
  visible?.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
  const version = ++navigationVersion;
  const scroll = () => requestAnimationFrame(() => requestAnimationFrame(() => {
    if (version !== navigationVersion) return;
    const target = section ? document.getElementById(section) : null;
    const headerHeight = nav?.getBoundingClientRect().height || 0;
    target?.querySelectorAll('.reveal').forEach(el => { el.classList.add('visible'); el.style.transitionDelay = '0ms'; });
    const content = target?.querySelector(':scope > .container') || target;
    const gap = window.innerWidth < 576 ? 10 : 14;
    const toolsShift = 0;
    const top = content ? content.getBoundingClientRect().top + window.scrollY - headerHeight - gap + toolsShift : 0;
    document.documentElement.classList.add('route-scrolling');
    window.scrollTo({top:Math.max(0,top),behavior:'instant'});
    requestAnimationFrame(() => document.documentElement.classList.remove('route-scrolling'));
  }));
  if (navCollapse?.classList.contains('show') || navCollapse?.classList.contains('collapsing')) {
    navCollapse.addEventListener('hidden.bs.collapse', scroll, {once:true});
    closeMobileMenu();
  } else scroll();
}

/* Keep section destinations in the URL so refresh and back preserve them. */
document.addEventListener('click', e => {
  const link = e.target.closest('[data-nav][data-route]');
  if (!link) return;
  e.preventDefault();
  const section = link.dataset.target;
  const hash = '#' + link.dataset.route + (section ? '?section=' + encodeURIComponent(section) : '');
  if (location.hash === hash) renderRoute(); else location.hash = hash;
});
window.addEventListener('hashchange', renderRoute);

/* ---------- Reveal on scroll ---------- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObserver.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 }
);
$$('.reveal').forEach((el, i) => {
  el.style.transitionDelay = `${(i % 3) * 90}ms`;
  revealObserver.observe(el);
});

/* initial route render (after observer is ready) */
renderRoute();

/* ---------- Animated counters ---------- */
const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      const duration = 1600;
      const start = performance.now();

      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + Math.round(target * eased).toLocaleString('en-IN') + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      countObserver.unobserve(el);
    });
  },
  { threshold: 0.4 }
);
$$('[data-count]').forEach((el) => countObserver.observe(el));

/* ============================================
   SIP CALCULATOR
   ============================================ */
const sipAmt = $('#sipAmt');
const sipRate = $('#sipRate');
const sipYears = $('#sipYears');

function calcSIP() {
  if (!sipAmt) return;
  const P = +sipAmt.value;
  const annual = +sipRate.value;
  const yrs = +sipYears.value;
  const i = annual / 100 / 12;
  const n = yrs * 12;

  const maturity = i === 0 ? P * n : P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
  const invested = P * n;
  const gain = maturity - invested;

  $('#sipAmtOut').textContent = P.toLocaleString('en-IN');
  $('#sipRateOut').textContent = annual;
  $('#sipYearsOut').textContent = yrs;

  $('#sipTotal').textContent = inrShort(maturity);
  $('#sipInvested').textContent = inrShort(invested);
  $('#sipGain').textContent = inrShort(gain);
  $('#sipX').textContent = (maturity / invested).toFixed(2) + 'x';
}
[sipAmt, sipRate, sipYears].forEach((el) => el && el.addEventListener('input', calcSIP));
calcSIP();

/* ============================================
   LOAN EMI CALCULATOR
   ============================================ */
const emiAmt = $('#emiAmt');
const emiRate = $('#emiRate');
const emiYears = $('#emiYears');

function calcEMI() {
  if (!emiAmt) return;
  const P = +emiAmt.value;
  const annual = +emiRate.value;
  const yrs = +emiYears.value;
  const r = annual / 100 / 12;
  const n = yrs * 12;

  const emi = r === 0 ? P / n : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const total = emi * n;
  const interest = total - P;

  $('#emiAmtOut').textContent = P.toLocaleString('en-IN');
  $('#emiRateOut').textContent = annual.toFixed(1);
  $('#emiYearsOut').textContent = yrs;

  $('#emiMonthly').textContent = inr(emi);
  $('#emiPrincipal').textContent = inrShort(P);
  $('#emiInterest').textContent = inrShort(interest);
  $('#emiTotal').textContent = inrShort(total);
}
[emiAmt, emiRate, emiYears].forEach((el) => el && el.addEventListener('input', calcEMI));
calcEMI();

/* ============================================
   GST CALCULATOR
   ============================================ */
const gstAmount = $('#gstAmount');
const gstSlab = $('#gstSlab');

function calcGST() {
  if (!gstAmount) return;
  const amt = Math.max(0, +gstAmount.value || 0);
  const rate = +gstSlab.value;
  const type = ($('input[name="gstType"]:checked') || {}).value || 'add';
  const supply = ($('input[name="gstSupply"]:checked') || {}).value || 'intra';

  let base, tax, total;
  if (type === 'add') {
    base = amt;
    tax = (amt * rate) / 100;
    total = base + tax;
  } else {
    base = amt / (1 + rate / 100);
    tax = amt - base;
    total = amt;
  }

  $('#gstTotal').textContent = inr(total);
  $('#gstBase').textContent = inr(base);
  $('#gstTax').textContent = inr(tax);
  $('#gstRateOut').textContent = rate + '%';

  if (supply === 'intra') {
    $('#gstSplitLabel').textContent = `CGST ${rate / 2}% + SGST ${rate / 2}%`;
    $('#gstSplit').textContent = `${inr(tax / 2)} + ${inr(tax / 2)}`;
  } else {
    $('#gstSplitLabel').textContent = `IGST ${rate}%`;
    $('#gstSplit').textContent = inr(tax);
  }
}
[gstAmount, gstSlab].forEach((el) => el && el.addEventListener('input', calcGST));
$$('input[name="gstType"], input[name="gstSupply"]').forEach((el) =>
  el.addEventListener('change', calcGST)
);
calcGST();

/* ============================================
   CONTACT FORM — Bootstrap validation + mailto
   ============================================ */
const form = $('#contactForm');
const alertBox = $('#formAlert');

const showAlert = (type, html) => {
  if (!alertBox) return;
  alertBox.className = `alert alert-${type}`;
  alertBox.innerHTML = html;
  alertBox.classList.remove('d-none');
};

/* RCC public website configuration.
 * Paste the deployed Google Apps Script Web App URL below.
 * This URL is public by design; never put passwords or private keys here.
 */
window.RCC_CONFIG = {
  GOOGLE_APPS_SCRIPT_URL: "https://script.google.com/macros/s/AKfycby_fIKN7PMkfBnrZ47bG2fh6Vn8TPEPgkD0IbdrIETVcF5dn_AvZg7i03tERiFW04QmlA/exec"
};

const attempts = new WeakMap(); let activeSubmission = false; let lastSuccessAt = 0;
function setStatus(element, kind, message) {
  element.className = `form-status ${kind}`;
  element.textContent = message;
}
function validEndpoint(url) {
  try { const u = new URL(url); return u.protocol === 'https:' && u.hostname === 'script.google.com' && /^\/macros\/s\/[\w-]+\/exec$/.test(u.pathname); } catch { return false; }
}
function trustedResponseOrigin(origin) {
  try { const u = new URL(origin); return u.protocol === 'https:' && (u.hostname === 'script.google.com' || u.hostname === 'script.googleusercontent.com' || /^[a-z0-9-]+-script\.googleusercontent\.com$/.test(u.hostname)); } catch { return false; }
}
function validateForm(form) {
  const phone = form.elements.phone;
  const count = phone.value.replace(/\D/g,'').length;
  phone.setCustomValidity(/^[+\d\s().-]+$/.test(phone.value) && count >= 10 && count <= 15 ? '' : window.RCC_TRANSLATE('Enter a phone number with 10 to 15 digits.'));
  form.elements.name.setCustomValidity(form.elements.name.value.trim().length >= 2 ? '' : window.RCC_TRANSLATE('Enter your full name.'));
  form.elements.message.setCustomValidity(form.elements.message.value.trim().length >= 10 ? '' : window.RCC_TRANSLATE('Add at least 10 characters about your requirement.'));
  return form.reportValidity();
}
function sendToSheet(form, status) {
  if (activeSubmission || !validateForm(form)) return;
  if (Date.now() - lastSuccessAt < 60000) { setStatus(status,'error','Your enquiry was received. Please wait one minute before sending another.'); return; }
  const endpoint = window.RCC_CONFIG?.GOOGLE_APPS_SCRIPT_URL || '';
  if (!validEndpoint(endpoint)) { setStatus(status,'error','Enquiries are temporarily unavailable. Please try again later.'); return; }
  const data = Object.fromEntries(new FormData(form).entries());
  const fingerprint = JSON.stringify(data);
  let attempt = attempts.get(form);
  // Keep a request ID after an ambiguous timeout, so retrying cannot append twice.
  if (!attempt || attempt.fingerprint !== fingerprint) {
    attempt = { fingerprint, requestId: crypto.randomUUID() };
    attempts.set(form, attempt);
  }
  data.requestId = attempt.requestId;
  data.responseOrigin = location.origin;
  activeSubmission = true;
  const fields = [...form.querySelectorAll('input, select, textarea')];
  fields.forEach(field => field.disabled = true);
  const button = form.querySelector('[type=submit]');
  const original = button.innerHTML;
  document.querySelectorAll('button[type=submit]').forEach(b => b.disabled = true);
  
  button.textContent = 'Sending enquiry…';
  form.setAttribute('aria-busy','true');
  setStatus(status,'','Sending your enquiry…');
  const frame = document.createElement('iframe');
  frame.name = `rcc_${attempt.requestId}`; frame.hidden = true; frame.title = 'Enquiry submission';
  document.body.append(frame);
  const postForm = document.createElement('form');
  postForm.method = 'POST'; postForm.action = endpoint; postForm.target = frame.name; postForm.hidden = true;
  Object.entries(data).forEach(([name,value]) => {
    const input = document.createElement('input'); input.type='hidden'; input.name=name; input.value=String(value); postForm.append(input);
  });
  let settled = false;
  let timer;
  function finish(kind, message) {
    if (settled) return;
    settled = true; clearTimeout(timer); window.removeEventListener('message', onMessage);
    activeSubmission = false; form.removeAttribute('aria-busy');
    fields.forEach(field => field.disabled = false);
    document.querySelectorAll('button[type=submit]').forEach(b => b.disabled = false);
     button.innerHTML = original;
    frame.remove(); postForm.remove(); setStatus(status,kind,message);
  }
  function onMessage(event) {
    // GAS uses a nested sandbox frame, so event.source is not the outer iframe.
    // Require Google's origin AND the unguessable request-specific nonce.
    const reply = event.data;
    if (!trustedResponseOrigin(event.origin) || !reply || reply.rcc !== 'RCC_ENQUIRY' || reply.requestId !== attempt.requestId || typeof reply.ok !== 'boolean') return;
    if (reply.ok) {
      const selected = form.elements.service.value;
      lastSuccessAt = Date.now(); attempts.delete(form); form.reset();
      if (form.id === 'serviceEnquiryForm') form.elements.service.value = selected;
      finish('success',`Thank you. Your enquiry has been received.${reply.enquiryId ? ' Reference: '+reply.enquiryId : ''}${form.id === 'serviceEnquiryForm' ? ' You can close this window when ready.' : ''}`);
    } else finish('error',reply.message || 'We could not send your enquiry. Your details are still here; please try again.');
  }
  window.addEventListener('message', onMessage);
  timer = setTimeout(() => finish('error','We could not confirm receipt. Your details are still here. Check with RCC before retrying; an unchanged retry uses the same reference.'),30000);
  document.body.append(postForm);
  try { HTMLFormElement.prototype.submit.call(postForm); } catch { finish('error','Unable to send. Check your connection and try again.'); }
}

if (form) form.addEventListener('submit', e => {e.preventDefault(); alertBox.classList.remove('d-none'); sendToSheet(form,alertBox);});
/* ---------- Blog subscribe strip ---------- */
const blogSub = $('#blogSubscribeForm');
if (blogSub) {
  blogSub.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = $('#blogEmail');
    if (!input.value || !input.checkValidity()) {
      input.focus();
      return;
    }
    window.location.href =
      `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Subscribe to RenGrow updates')}&body=${encodeURIComponent('Please add me to the monthly compliance & finance updates: ' + input.value)}`;
    input.value = '';
    input.placeholder = 'Send the email to request updates';
  });
}

/* ---------- Newsletter ---------- */
const news = $('#newsletterForm');
if (news) {
  news.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = $('#newsEmail');
    if (!input.value || !input.checkValidity()) {
      input.focus();
      return;
    }
    window.location.href =
      `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Newsletter subscription')}&body=${encodeURIComponent('Please subscribe me: ' + input.value)}`;
    input.value = '';
    input.placeholder = 'Send the email to subscribe';
  });
}

/* Service enquiry opens in a separate form card without changing pages. */
if (form) {
  const shell = document.createElement('div');
  shell.className = 'modal fade'; shell.id = 'serviceEnquiryModal'; shell.tabIndex = -1;
  shell.setAttribute('aria-labelledby','serviceEnquiryTitle'); shell.setAttribute('aria-hidden','true');
  shell.innerHTML = '<div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg"><div class="modal-content"><div class="modal-header"><h2 class="modal-title fs-5" id="serviceEnquiryTitle">Service enquiry</h2><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div><div class="modal-body"></div></div></div>';
  const copy = form.cloneNode(true); copy.id = 'serviceEnquiryForm';
  copy.querySelectorAll('[id]').forEach(el => { const old = el.id; el.id = 'popup-'+old; copy.querySelectorAll('label').forEach(l => { if (l.htmlFor === old) l.htmlFor = el.id; }); });
  const status = copy.querySelector('[role="alert"]');
  copy.addEventListener('submit', e => { e.preventDefault(); status.classList.remove('d-none'); sendToSheet(copy,status); });
  shell.querySelector('.modal-body').append(copy); document.body.append(shell);
  document.getElementById('serviceModals')?.addEventListener('click', e => {
    const trigger = e.target.closest('[data-service]'); if (!trigger) return;
    e.preventDefault(); copy.elements.service.value = trigger.dataset.service;
    const current = trigger.closest('.modal');
    const open = () => bootstrap.Modal.getOrCreateInstance(shell).show();
    if (current) { current.addEventListener('hidden.bs.modal', open, {once:true}); bootstrap.Modal.getOrCreateInstance(current).hide(); } else open();
  });
}

import '../css/polish.css';

import './preferences.js';

import '../css/preferences.css';

document.addEventListener('rcc-languagechange',()=>{ document.querySelectorAll('input,textarea').forEach(el=>el.setCustomValidity('')); });
