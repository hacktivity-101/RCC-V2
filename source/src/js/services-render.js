/* ============================================
   Renders the 8 service categories:
   - filter pills
   - service cards
   - detail modals
   - footer links + contact-form dropdown
   ============================================ */

import { SERVICES } from './services-data.js';

const grid = document.getElementById('servicesGrid');
const preview = document.getElementById('servicesPreview');
const pillWrap = document.getElementById('serviceFilters');
const modalWrap = document.getElementById('serviceModals');
const footerList = document.getElementById('footerServices');
const serviceSelect = document.getElementById('service');

/* ---------- Cards ---------- */
if (grid) {
  grid.innerHTML = SERVICES.map(
    (s) => `
    <div class="col-md-6 col-xl-3 reveal" data-cat="${s.id}">
      <article class="service-card h-100">
        <span class="service-no">${s.no}</span>
        <div class="feature-icon"><i class="bi ${s.icon}"></i></div>
        <h5>${s.title}</h5>
        <p class="small service-tag">${s.tagline}</p>
        <ul class="mini-list">
          ${s.items.slice(0, 4).map((i) => `<li><i class="bi bi-check2"></i>${i}</li>`).join('')}
          ${s.items.length > 4 ? `<li class="more-count"><i class="bi bi-plus-lg"></i>${s.items.length - 4} more service${s.items.length - 4 > 1 ? 's' : ''}</li>` : ''}
        </ul>
        <button class="btn btn-sm btn-ghost mt-auto" data-bs-toggle="modal" data-bs-target="#modal-${s.id}">
          View details <i class="bi bi-arrow-right"></i>
        </button>
      </article>
    </div>`
  ).join('');
}

/* Home cards use the same details as the services page. */
let homeFilters;
if (preview && grid) {
  preview.innerHTML = grid.innerHTML;
  homeFilters = document.createElement('div');
  homeFilters.className = 'filter-bar mb-4';
  homeFilters.hidden = true;
  preview.before(homeFilters);
}

/* Category filters and progressive disclosure. */
for (const [grid, pillWrap, home] of [[document.getElementById('servicesGrid'), document.getElementById('serviceFilters'), false], [preview, homeFilters, true]]) {
  if (!grid || !pillWrap) continue;
  let expanded = false;
  let category = 'all';
  const categories = [...new Set(SERVICES.map(s => s.tagline))];
  pillWrap.innerHTML = ['all', ...categories].map((c,i) => '<button type="button" class="filter-pill'+(i ? '' : ' active')+'" data-filter="'+c+'" aria-pressed="'+!i+'">'+(i ? c : 'All Services')+'</button>').join('');
  const controls = document.createElement('div');
  controls.className = 'services-expand text-center mt-4';
  controls.innerHTML = '<p class="small text-muted" aria-live="polite"></p><button type="button" class="btn btn-accent" aria-controls="servicesGrid" aria-expanded="false">View all services</button>';
  grid.after(controls);
  if (home) { const oldLink = preview.parentElement.querySelector('a[href="#/services"].btn-lg'); if (oldLink) oldLink.parentElement.remove(); }
  const button = controls.querySelector('button');
  function update() {
    if (home) pillWrap.hidden = !expanded && category === 'all';
    const matching = SERVICES.filter(s => category === 'all' || s.tagline === category);
    const shown = new Set((expanded ? matching : matching.slice(0,8)).map(s => s.id));
    grid.querySelectorAll('[data-cat]').forEach(col => { col.classList.toggle('d-none', !shown.has(col.dataset.cat)); col.classList.add('visible'); });
    controls.querySelector('p').textContent = 'Showing '+shown.size+' of '+matching.length+' services';
    button.hidden = matching.length <= 8;
    button.textContent = expanded ? 'Show fewer services' : 'View all '+matching.length+' services';
    button.setAttribute('aria-expanded', String(expanded));
  }
  button.addEventListener('click', () => { expanded = !expanded; update(); if (!expanded) grid.scrollIntoView({block:'start'}); });
  pillWrap.addEventListener('click', e => {
    const btn = e.target.closest('[data-filter]'); if (!btn) return;
    category = btn.dataset.filter; expanded = false;
    pillWrap.querySelectorAll('button').forEach(b => { b.classList.toggle('active', b === btn); b.setAttribute('aria-pressed', String(b === btn)); });
    update();
  });
  update();
}

/* ---------- Modals ---------- */
if (modalWrap) {
  modalWrap.innerHTML = SERVICES.map(
    (s) => `
    <div class="modal fade" id="modal-${s.id}" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
        <div class="modal-content service-modal">
          <div class="modal-header border-0">
            <div class="d-flex align-items-center gap-3">
              <div class="feature-icon mb-0"><i class="bi ${s.icon}"></i></div>
              <div>
                <h5 class="modal-title mb-0">${s.title}</h5>
                <small class="text-accent fw-semibold">${s.tagline}</small>
              </div>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body pt-0">
            <p class="small">${s.desc}</p>
            <h6 class="text-navy mt-4 mb-3">What's included</h6>
            <div class="row g-2">
              ${s.items
                .map(
                  (i) => `<div class="col-sm-6"><div class="modal-item"><i class="bi bi-check-circle-fill"></i><span>${i}</span></div></div>`
                )
                .join('')}
            </div>
          </div>
          <div class="modal-footer border-0 flex-wrap gap-2">
            <button type="button" class="btn btn-accent" data-service="${s.title}">
              <i class="bi bi-calendar2-check me-2"></i>Enquire about this service
            </button>
            <a href="mailto:rengrowconsulting99@gmail.com?subject=${encodeURIComponent('Enquiry — ' + s.title)}" class="btn btn-navy">
              <i class="bi bi-envelope me-2"></i>Email us
            </a>
          </div>
        </div>
      </div>
    </div>`
  ).join('');


}

/* ---------- Footer links ---------- */
if (footerList) {
  footerList.innerHTML = SERVICES.slice(0, 4).map(
    (s) => `<li><a href="#/services" data-nav data-route="/services">${s.title}</a></li>`
  ).join('') + '<li><a class="text-accent" href="#/services" data-nav data-route="/services">View all 37 services →</a></li>';
}

/* ---------- Contact form dropdown ---------- */
if (serviceSelect) {
  serviceSelect.innerHTML =
    `<option value="">Choose a service category…</option>` +
    SERVICES.map((s) => `<option>${s.title}</option>`).join('') +
    `<option value="General enquiry">General enquiry / help me choose</option>`;
}
