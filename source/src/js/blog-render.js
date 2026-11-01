/* ============================================
   Articles & Blog — magazine layout
   Featured post + card grid + sidebar
   ============================================ */

import { POSTS, CATEGORY_COLORS } from './blog-data.js';

const featuredWrap = document.getElementById('blogFeatured');
const grid = document.getElementById('blogGrid');
const filterWrap = document.getElementById('blogFilters');
const sideCats = document.getElementById('blogSideCats');
const popular = document.getElementById('blogPopular');
const modalWrap = document.getElementById('blogModals');
const moreBtn = document.getElementById('blogMoreBtn');
const countEl = document.getElementById('blogCount');
const searchEl = document.getElementById('blogSearch');
const footerPosts = document.getElementById('footerPosts');

const PAGE_SIZE = 4;
let activeCat = 'all';
let query = '';
let expanded = false;

const catClass = (c) => CATEGORY_COLORS[c] || 'cat-biz';
const initials = (n) => n.split(' ').map((w) => w[0]).join('');

/* ---------- Featured (newest) article ---------- */
const featured = POSTS[0];
if (featuredWrap && featured) {
  featuredWrap.innerHTML = `
    <article class="featured-post reveal">
      <div class="featured-side">
        <span class="featured-flag"><i class="bi bi-star-fill"></i> Editor's pick</span>
        <div class="featured-icon"><i class="bi ${featured.icon}"></i></div>
        <span class="cat-chip ${catClass(featured.category)}">${featured.category}</span>
      </div>
      <div class="featured-body">
        <div class="post-meta mb-2">
          <span><i class="bi bi-calendar3"></i>${featured.dateLabel}</span>
          <span><i class="bi bi-clock"></i>${featured.readTime}</span>
        </div>
        <h2>${featured.title}</h2>
        <p>${featured.excerpt}</p>
        <div class="d-flex flex-wrap align-items-center gap-3 mt-4">
          <div class="post-author">
            <span class="tl-avatar">${initials(featured.author)}</span>
            <span><strong>${featured.author}</strong><small>${featured.role}</small></span>
          </div>
          <button class="btn btn-accent ms-auto" data-bs-toggle="modal" data-bs-target="#post-${featured.id}">
            Read full article <i class="bi bi-arrow-right ms-1"></i>
          </button>
        </div>
      </div>
    </article>`;
}

/* ---------- Card grid ---------- */
function cardHTML(p) {
  return `
  <div class="col-md-6">
    <article class="post-card reveal">
      <div class="post-top ${catClass(p.category)}-bg">
        <i class="bi ${p.icon}"></i>
        <span class="cat-chip ${catClass(p.category)}">${p.category}</span>
      </div>
      <div class="post-body">
        <div class="post-meta mb-2">
          <span><i class="bi bi-calendar3"></i>${p.dateLabel}</span>
          <span><i class="bi bi-clock"></i>${p.readTime}</span>
        </div>
        <h5>${p.title}</h5>
        <p class="small">${p.excerpt}</p>
        <div class="post-tags">
          ${p.tags.slice(0, 2).map((t) => `<span class="tl-tag">#${t.replace(/\s+/g, '')}</span>`).join('')}
        </div>
      </div>
      <div class="post-foot">
        <div class="post-author">
          <span class="tl-avatar">${initials(p.author)}</span>
          <span><strong>${p.author}</strong><small>${p.role}</small></span>
        </div>
        <button class="btn btn-sm btn-ghost" data-bs-toggle="modal" data-bs-target="#post-${p.id}">
          Read <i class="bi bi-arrow-right"></i>
        </button>
      </div>
    </article>
  </div>`;
}

function filtered() {
  const q = query.trim().toLowerCase();
  return POSTS.filter((p) => {
    const catOK = activeCat === 'all' || p.category === activeCat;
    const textOK =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      p.tags.join(' ').toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      [p.title,p.excerpt,p.category,...p.tags].some(text => (window.RCC_TRANSLATE?.(text) || text).toLowerCase().includes(q));
    return catOK && textOK;
  });
}

function render() {
  if (!grid) return;
  const list = filtered();
  const limit = expanded ? list.length : Math.min(PAGE_SIZE, list.length);

  grid.innerHTML = list.length
    ? list.slice(0, limit).map(cardHTML).join('')
    : `<div class="col-12"><div class="empty-state">
         <i class="bi bi-search"></i>
         <h6 class="mb-1">No articles found</h6>
         <p class="small mb-0">Try a different keyword or category.</p>
       </div></div>`;

  grid.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i, 4) * 70}ms`;
    requestAnimationFrame(() => el.classList.add('visible'));
  });

  if (countEl) {
    countEl.textContent = `${list.length} article${list.length === 1 ? '' : 's'}${
      activeCat !== 'all' ? ' in ' + activeCat : ''
    }`;
  }

  if (moreBtn) {
    const hidden = list.length - limit;
    moreBtn.classList.toggle('d-none', list.length <= PAGE_SIZE);
    moreBtn.innerHTML =
      hidden > 0
        ? `<i class="bi bi-plus-circle me-2"></i>Load ${hidden} more article${hidden > 1 ? 's' : ''}`
        : `<i class="bi bi-dash-circle me-2"></i>Show fewer`;
  }
}

/* ---------- Filters ---------- */
const categories = [...new Set(POSTS.map((p) => p.category))];

function setCat(c) {
  activeCat = c;
  expanded = false;
  filterWrap?.querySelectorAll('.filter-pill').forEach((b) =>
    b.classList.toggle('active', b.dataset.blogFilter === c)
  );
  sideCats?.querySelectorAll('button').forEach((b) =>
    b.classList.toggle('active', b.dataset.blogFilter === c)
  );
  render();
}

if (filterWrap) {
  filterWrap.innerHTML = ['all', ...categories]
    .map(
      (c) =>
        `<button class="filter-pill ${c === 'all' ? 'active' : ''}" data-blog-filter="${c}">${
          c === 'all' ? 'All' : c
        }</button>`
    )
    .join('');
  filterWrap.addEventListener('click', (e) => {
    const b = e.target.closest('[data-blog-filter]');
    if (b) setCat(b.dataset.blogFilter);
  });
}

if (sideCats) {
  sideCats.innerHTML = categories
    .map((c) => {
      const n = POSTS.filter((p) => p.category === c).length;
      return `<li><button data-blog-filter="${c}"><span>${c}</span><em>${n}</em></button></li>`;
    })
    .join('');
  sideCats.addEventListener('click', (e) => {
    const b = e.target.closest('[data-blog-filter]');
    if (b) {
      setCat(b.dataset.blogFilter);
      document.getElementById('blogGrid')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
}

/* ---------- Search ---------- */
if (searchEl) {
  searchEl.addEventListener('input', (e) => {
    query = e.target.value;
    expanded = false;
    render();
  });
}

/* ---------- Load more ---------- */
if (moreBtn) {
  moreBtn.addEventListener('click', () => {
    expanded = !expanded;
    render();
    if (!expanded) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

/* ---------- Sidebar: most read ---------- */
if (popular) {
  popular.innerHTML = POSTS.slice(1, 5)
    .map(
      (p, i) => `
      <li>
        <button data-bs-toggle="modal" data-bs-target="#post-${p.id}">
          <span class="rank">${i + 1}</span>
          <span><strong>${p.title}</strong><small>${p.dateLabel} · ${p.readTime}</small></span>
        </button>
      </li>`
    )
    .join('');
}

/* ---------- Article modals ---------- */
if (modalWrap) {
  modalWrap.innerHTML = POSTS.map(
    (p) => `
    <div class="modal fade" id="post-${p.id}" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
        <div class="modal-content service-modal">
          <div class="modal-header border-0 pb-0">
            <div>
              <div class="post-meta mb-2">
                <span class="cat-chip ${catClass(p.category)}">${p.category}</span>
                <span><i class="bi bi-calendar3"></i>${p.dateLabel}</span>
                <span><i class="bi bi-clock"></i>${p.readTime}</span>
              </div>
              <h5 class="modal-title">${p.title}</h5>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body article-body">
            <div class="post-author mb-4">
              <span class="tl-avatar">${initials(p.author)}</span>
              <span><strong>${p.author}</strong><small>${p.role}</small></span>
            </div>
            ${p.body.map((para) => `<p>${para}</p>`).join('')}
            <div class="post-tags mt-4">
              ${p.tags.map((t) => `<span class="tl-tag">#${t.replace(/\s+/g, '')}</span>`).join('')}
            </div>
            <div class="article-note mt-4">
              <i class="bi bi-info-circle-fill"></i>
              <span>This article is general guidance, not professional advice for your specific case. Speak to our team before acting on it.</span>
            </div>
          </div>
          <div class="modal-footer border-0 flex-wrap gap-2">
            <a href="#/contact" data-nav data-route="/contact" class="btn btn-accent" data-bs-dismiss="modal"><i class="bi bi-chat-dots me-2"></i>Discuss this with us</a>
            <a href="mailto:rengrowconsulting99@gmail.com?subject=${encodeURIComponent('Query about: ' + p.title)}" class="btn btn-navy"><i class="bi bi-envelope me-2"></i>Email a question</a>
          </div>
        </div>
      </div>
    </div>`
  ).join('');
}

/* ---------- Footer: latest posts ---------- */
if (footerPosts) {
  footerPosts.innerHTML = POSTS.slice(0, 2)
    .map(
      (p) => `
      <li>
        <a href="#/blog" data-nav data-route="/blog" data-bs-toggle="modal" data-bs-target="#post-${p.id}">
          <small class="d-block text-accent">${p.dateLabel}</small>${p.title}
        </a>
      </li>`
    )
    .join('');
}

render();
