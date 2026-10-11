/**
 * app.js — Leesa Adjustable Chill Pillow Detail Page
 * PRD v3.0 | Vanilla JS ES6+ | Revised
 */
'use strict';

const S = { sizeIdx: 0, qty: 1, imgIdx: 0 };
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => r.querySelectorAll(s);
const px = n => `$${n}`;

/* ── TOP BAR (F01) ── */
function renderTopBar(){
  const promoLink = $('#top-bar-promo-link');
  const navList   = $('#top-bar-nav');
  const detailsBtn= $('#top-bar-details');
  if(promoLink) promoLink.textContent = productData.promo.message;
  if(navList) navList.innerHTML = productData.topBar.map(i=>`<li><a href="${i.href}">${i.label}</a></li>`).join('');
  detailsBtn?.addEventListener('click',()=>alert('Promo details: '+ productData.promo.message));
}

/* ── NAV (F02) ── */
function renderNav(){
  const dl = $('#main-nav-list'), ml = $('#mobile-nav-list');
  const hb = $('#hamburger-btn'), mn = $('#mobile-nav');
  const items = productData.nav.map(i=>`<li><a href="${i.href}" class="${i.highlight?'nav-sale':''}">${i.label}</a></li>`).join('');
  if(dl) dl.innerHTML = items;
  if(ml) ml.innerHTML = items;
  if(hb && mn){
    hb.addEventListener('click',()=>{
      const open = mn.toggleAttribute('hidden') === false;
      hb.classList.toggle('is-open', !mn.hasAttribute('hidden'));
      hb.setAttribute('aria-expanded', String(!mn.hasAttribute('hidden')));
    });
  }
}

/* ── BREADCRUMB (F03) ── */
function renderBreadcrumb(){
  const ol = $('#breadcrumb-list');
  if(!ol) return;
  ol.innerHTML = productData.breadcrumb.map((b,i,a)=>{
    const last = i===a.length-1;
    const sep  = !last ? `<span class="bc-sep" aria-hidden="true">/</span>` : '';
    return `<li>${last?`<span aria-current="page">${b.label}</span>`:`<a href="${b.href}">${b.label}</a>`}${sep}</li>`;
  }).join('');
}

/* ── GALLERY (F04 — AC-01) ── */
function renderGallery(){
  const main   = $('#gallery-main');
  const thumbs = $('#gallery-thumbs');
  const badge  = $('#gallery-badge');
  const prev   = $('#gal-prev');
  const next   = $('#gal-next');
  if(!main||!thumbs) return;
  if(badge) badge.textContent = productData.promo.badge;
  thumbs.innerHTML = productData.images.map((img,i)=>`
    <div class="gallery-thumb${i===0?' is-active':''}" role="listitem" data-i="${i}" tabindex="0" aria-label="${img.alt}">
      <img src="${img.src}" alt="${img.alt}" loading="lazy"/>
    </div>`).join('');
  setImg(0);
  thumbs.addEventListener('click', e=>{
    const t=e.target.closest('.gallery-thumb');
    if(t) setImg(+t.dataset.i);
  });
  thumbs.addEventListener('keydown', e=>{
    if(e.key==='Enter'||e.key===' '){const t=e.target.closest('.gallery-thumb');if(t){e.preventDefault();setImg(+t.dataset.i);}}
  });
  prev?.addEventListener('click',()=>setImg((S.imgIdx-1+productData.images.length)%productData.images.length));
  next?.addEventListener('click',()=>setImg((S.imgIdx+1)%productData.images.length));
}
function setImg(i){
  const main=$('#gallery-main'), thumbs=$('#gallery-thumbs');
  if(!main) return;
  S.imgIdx=i;
  main.classList.add('fading');
  setTimeout(()=>{
    main.src=productData.images[i].src;
    main.alt=productData.images[i].alt;
    main.classList.remove('fading');
  },150);
  $$('.gallery-thumb',thumbs).forEach((t,j)=>t.classList.toggle('is-active',j===i));
}

/* ── PRODUCT INFO ── */
function renderProductInfo(){
  const t=$('#product-title');
  if(t) t.textContent = productData.name;
  renderTabs();
  renderPrice();
  renderSelectors();
  renderNeedHelp();
}

/* ── TABS (F05 — AC-02) ── */
function renderTabs(){
  const map={benefits:'panel-benefits',bestFor:'panel-bestfor',bonuses:'panel-bonuses'};
  Object.keys(map).forEach(k=>{
    const p=$(`#${map[k]}`);
    if(p) p.innerHTML = productData.tabs[k].map(x=>`<li>${x}</li>`).join('');
  });
  $$('.tab-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      $$('.tab-btn').forEach(b=>{b.classList.remove('tab-btn--active');b.setAttribute('aria-selected','false');});
      $$('.tab-panel').forEach(p=>{p.classList.remove('tab-panel--active');p.hidden=true;});
      btn.classList.add('tab-btn--active');
      btn.setAttribute('aria-selected','true');
      const panel=$(`#${map[btn.dataset.tab]}`);
      if(panel){panel.classList.add('tab-panel--active');panel.hidden=false;}
    });
  });
}

/* ── PRICE (F06 — AC-03) ── */
function renderPrice(){
  const sz=productData.sizes[S.sizeIdx];
  const b=$('#price-badge'), s=$('#price-sale'), o=$('#price-orig'), sv=$('#price-save');
  if(b) b.textContent=productData.promo.badge;
  if(s) s.textContent=px(sz.price);
  if(o) o.textContent=px(sz.originalPrice);
  if(sv) sv.textContent=`Save ${px(productData.promo.save)}`;
  syncSticky(); syncAtcLabel();
}

/* ── SELECTORS (F07, F08) ── */
function renderSelectors(){
  const ss=$('#size-select'), qs=$('#qty-select');
  if(ss) ss.innerHTML=productData.sizes.map((s,i)=>`<option value="${i}"${i===S.sizeIdx?' selected':''}>${s.name}</option>`).join('');
  if(qs) qs.innerHTML=Array.from({length:10},(_,i)=>i+1).map(n=>`<option value="${n}"${n===S.qty?' selected':''}>${n}</option>`).join('');
}

/* ── NEED HELP (F16) ── */
function renderNeedHelp(){
  const nh=productData.needHelp;
  const t=$('#need-help-title'), d=$('#need-help-desc'), c=$('#need-help-chat');
  if(t) t.textContent=nh.title;
  if(d) d.textContent=nh.desc;
  if(c){c.textContent=nh.chatLabel;c.addEventListener('click',()=>alert('Opening chat...'));}
}

/* ── FEATURES (F11) ── */
function renderFeatures(){
  const g=$('#features-grid');
  if(!g) return;
  const icons={
    'icon-pressure':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>',
    'icon-snap':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>',
    'icon-mesh':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 3C7 3 3 7 3 12s4 9 9 9 9-4 9-9-4-9-9-9zm0 0v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4"/></svg>',
  };
  g.innerHTML=productData.features.map(f=>`
    <article class="feature-card">
      <div class="feature-icon-wrap">${icons[f.svgId]||''}</div>
      <h3 class="feature-title">${f.title}</h3>
      <p class="feature-desc">${f.desc}</p>
    </article>`).join('');
}

/* ── DETAIL SECTIONS (F12) ── */
function renderDetail(){
  const c=$('#detail-container');
  if(!c) return;
  c.innerHTML=productData.detailSections.map(s=>`
    <div class="detail-pair${s.reverse?' is-reverse':''}">
      <div class="detail-img-wrap"><img src="${s.image}" alt="${s.imageAlt}" loading="lazy"/></div>
      <div class="detail-text"><h3>${s.title}</h3><p>${s.desc}</p></div>
    </div>`).join('');
}

/* ── FAQ ACCORDION (F13/F14 — AC-07) ── */
function renderFaq(){
  const acc=$('#accordion');
  if(!acc) return;
  const sp=productData.specifications, sh=productData.shipping;
  acc.innerHTML=productData.faq.map((item,i)=>{
    let body='';
    if(item.isSpecs){
      body=`<table class="specs-table" aria-label="Spesifikasi produk"><tbody>
        <tr><th>Size Queen</th><td>${sp.size.Queen}</td></tr>
        <tr><th>Size King</th><td>${sp.size.King}</td></tr>
        <tr class="specs-section"><th colspan="2">Materials</th></tr>
        <tr><th>Cover</th><td>${sp.materials.cover}</td></tr>
        <tr><th>Fill Cover</th><td>${sp.materials.fillCover}</td></tr>
        <tr><th>Fill</th><td>${sp.materials.fill}</td></tr>
        <tr><th>Fill Weight King</th><td>${sp.fillWeight.King}</td></tr>
        <tr><th>Fill Weight Queen</th><td>${sp.fillWeight.Queen}</td></tr>
        <tr class="specs-section"><th colspan="2">Care</th></tr>
        <tr><th>Outer Cover</th><td>${sp.care.outerCover}</td></tr>
        <tr><th>Fill Cover</th><td>${sp.care.fillCover}</td></tr>
        <tr><th>Fill</th><td><strong>${sp.care.fill}</strong></td></tr>
        </tbody></table>
        <p style="margin-top:12px;font-size:12px;color:#666">${sp.certification}</p>`;
    } else if(item.isShipping){
      body=`<div class="ship-grid">
        <div class="ship-card"><div class="ship-icon">🚚</div><h4>Free Shipping</h4><p>${sh.shippingNote}</p></div>
        <div class="ship-card"><div class="ship-icon">🛡️</div><h4>${sh.warranty} Limited Warranty</h4><p>${sh.warrantyNote}</p></div>
        <div class="ship-card"><div class="ship-icon">↩️</div><h4>${sh.trial} Risk-Free Trial</h4><p>${sh.trialNote}</p></div>
        </div>`;
    } else {
      body=`<p>${item.a}</p>`;
    }
    return `<div class="acc-item" data-idx="${i}">
      <button class="acc-btn" aria-expanded="false" aria-controls="acc-body-${i}">
        <span>${item.q}</span><span class="acc-icon" aria-hidden="true"></span>
      </button>
      <div class="acc-body" id="acc-body-${i}" role="region">
        <div class="acc-content">${body}</div>
      </div>
    </div>`;
  }).join('');

  acc.addEventListener('click', e=>{
    const btn=e.target.closest('.acc-btn');
    if(!btn) return;
    const item=btn.closest('.acc-item');
    const body=$('.acc-body', item);
    const wasOpen=item.classList.contains('is-open');
    // close all
    $$('.acc-item.is-open',acc).forEach(el=>{
      el.classList.remove('is-open');
      $('.acc-body',el).classList.remove('is-open');
      $('.acc-btn',el).setAttribute('aria-expanded','false');
    });
    if(!wasOpen){
      item.classList.add('is-open');
      body.classList.add('is-open');
      btn.setAttribute('aria-expanded','true');
    }
  });
}

/* ── SOCIAL PROOF (F15) ── */
function renderSocialProof(){
  const h=$('#social-heading'), d=$('#social-desc');
  if(h) h.textContent=productData.socialProof.heading;
  if(d) d.textContent=productData.socialProof.description;
}

/* ── FOOTER (F18, F17) ── */
function renderFooter(){
  const ft=productData.footer;
  [['f-shop',ft.shop],['f-about',ft.about],['f-support',ft.support]].forEach(([id,items])=>{
    const el=$(`#${id}`);
    if(el) el.innerHTML=items.map(i=>`<li><a href="${i.href}">${i.label}</a></li>`).join('');
  });
  const fh=$('#f-hours'), fp=$('#f-phone'), fc=$('#f-copy'), fl=$('#f-legal');
  if(fh) fh.textContent=ft.hours;
  if(fp){fp.textContent='1.844.33.LEESA';fp.href='tel:18443353372';}
  if(fc) fc.textContent=ft.copyright;
  if(fl) fl.innerHTML=ft.legal.map(l=>`<li><a href="${l.href}">${l.label}</a></li>`).join('');
  const sl=$('#social-links');
  if(sl) sl.innerHTML=ft.social.map(s=>`<a href="${s.href}" class="social-link" aria-label="${s.label}" rel="noopener noreferrer">${s.svg}</a>`).join('');
  // newsletter
  const btn=$('#nl-btn'), inp=$('#nl-email'), msg=$('#nl-msg');
  if(btn&&inp){
    const send=()=>{
      const v=inp.value.trim(), ok=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      msg.hidden=false;
      if(ok){msg.textContent=`\u2713 Thanks! ${v} subscribed.`;msg.className='nl-msg ok';inp.value='';}
      else{msg.textContent='Please enter a valid email.';msg.className='nl-msg err';}
    };
    btn.addEventListener('click',send);
    inp.addEventListener('keydown',e=>{if(e.key==='Enter')send();});
  }
}

/* ── STICKY BAR (F10 — AC-06) ── */
function initSticky(){
  const bar=$('#sticky-bar');
  const anchor=$('#atc-section');
  const sn=$('#sticky-name'), sm=$('#sticky-meta');
  const satc=$('#sticky-atc');
  if(!bar||!anchor) return;
  if(sn) sn.textContent=productData.name;
  syncSticky();
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      bar.classList.toggle('is-visible',!e.isIntersecting);
      bar.setAttribute('aria-hidden',String(e.isIntersecting));
    });
  },{threshold:0.1});
  obs.observe(anchor);
  satc?.addEventListener('click',()=>doAddToCart(true));
}
function syncSticky(){
  const sz=productData.sizes[S.sizeIdx];
  const sm=$('#sticky-meta');
  if(sm) sm.textContent=`${sz.name} · ${px(sz.price)}`;
}

/* ── EVENT HANDLERS ── */
function initHandlers(){
  const ss=$('#size-select'), qs=$('#qty-select'), ab=$('#atc-btn');
  ss?.addEventListener('change', e=>{S.sizeIdx=+e.target.value;renderPrice();clearVal();});
  qs?.addEventListener('change', e=>{S.qty=+e.target.value;});
  ab?.addEventListener('click', ()=>doAddToCart(false));
}
function doAddToCart(fromSticky){
  const sz=productData.sizes[S.sizeIdx];
  const ab=$('#atc-btn');
  clearVal();
  if(!fromSticky&&ab){
    const orig=ab.textContent;
    ab.textContent=`\u2713 Added ${S.qty}x ${sz.name} to cart!`;
    ab.classList.add('is-added'); ab.disabled=true;
    setTimeout(()=>{ab.textContent=orig;ab.classList.remove('is-added');ab.disabled=false;syncAtcLabel();},2500);
  }
  const sa=$('#sticky-atc');
  if(fromSticky&&sa){
    const o=sa.textContent; sa.textContent='\u2713 Added!'; sa.disabled=true;
    setTimeout(()=>{sa.textContent=o;sa.disabled=false;},2000);
  }
  console.info(`[Cart] ${S.qty}x ${sz.name} Adjustable Chill Pillow @ ${px(sz.price)}`);
}
function syncAtcLabel(){
  const ab=$('#atc-btn'), sz=productData.sizes[S.sizeIdx];
  if(ab&&!ab.disabled) ab.textContent=`Add ${sz.name} size Adjustable Chill Pillow to cart for ${px(sz.price)}`;
}
function clearVal(){const v=$('#atc-validation');if(v){v.hidden=true;v.textContent='';}}

/* ── COUNTER ANIMATION (F15) ── */
function initCounter(){
  const el=$('#counter-num');
  if(!el) return;
  const target=+el.dataset.target||productData.socialProof.mattressesDonated;
  let done=false;
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting&&!done){done=true;animateCount(el,0,target,2000);}
    });
  },{threshold:.3});
  obs.observe(el);
}
function animateCount(el,from,to,dur){
  const t0=performance.now();
  const step=ts=>{
    const p=Math.min((ts-t0)/dur,1);
    const e=1-Math.pow(1-p,3);
    el.textContent=Math.floor(from+(to-from)*e).toLocaleString()+'+';
    if(p<1) requestAnimationFrame(step);
    else el.textContent=to.toLocaleString()+'+';
  };
  requestAnimationFrame(step);
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded',()=>{
  renderTopBar();
  renderNav();
  renderBreadcrumb();
  renderGallery();
  renderProductInfo();
  renderFeatures();
  renderDetail();
  renderFaq();
  renderSocialProof();
  renderFooter();
  initSticky();
  initHandlers();
  initCounter();
  syncAtcLabel();
});
