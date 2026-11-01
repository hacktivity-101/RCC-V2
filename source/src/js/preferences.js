import hi from './hi.json';
const reverse = new Map(Object.entries(hi).map(([en,value])=>[value,en]));
const originals = new WeakMap();
const attributes = new WeakMap();
const normalize = value => value.replace(/\s+/g,' ').trim();
let language = 'en', theme = 'light';
try { language = localStorage.getItem('rcc-language') === 'hi' ? 'hi' : 'en'; theme = localStorage.getItem('rcc-theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); } catch {}
export function translate(value) {
  if (language !== 'hi') return value;
  const key = normalize(value);
  if (/^₹[\d,.]+ L$/.test(key)) return key.replace(/ L$/,' लाख');
  if (/^₹[\d,.]+ Cr$/.test(key)) return key.replace(/ Cr$/,' करोड़');
  if (hi[key]) return value.match(/^\s*/)[0]+hi[key]+value.match(/\s*$/)[0];
  if (key === 'yrs') return ' वर्ष';
  if (key === 'Monthly investment ₹') return 'मासिक निवेश ₹';
  if ((key.includes('·') || /min read/.test(key))) { let translated=key; for(const [en,translation] of Object.entries(hi)) if (/^\d{2} [A-Z][a-z]{2} \d{4}$/.test(en)) translated=translated.replace(en,translation); if(translated!==key) return translated.replace(/(\d+) min read/g,'पढ़ने का समय: $1 मिनट'); }
  let match;
  if ((match=key.match(/^(\d+) articles?(?: in (.+))?$/))) return match[1]+' लेख'+(match[2]?' — '+(hi[match[2]]||match[2]):'');
  if ((match=key.match(/^View all (\d+) services(.*)$/))) return `सभी ${match[1]} सेवाएँ देखें${match[2]}`;
  if ((match=key.match(/^Showing (\d+) of (\d+) services$/))) return `कुल ${match[2]} में से ${match[1]} सेवाएँ`;
  if ((match=key.match(/^Load (\d+) more articles$/))) return `${match[1]} और लेख दिखाएँ`;
  if ((match=key.match(/^(\d+) more services?$/))) return `${match[1]} और जानकारी`;
  if ((match=key.match(/^(\d+) min read$/))) return `पढ़ने का समय: ${match[1]} मिनट`;
  if (/^Thank you\. Your enquiry has been received\./.test(key)) return 'धन्यवाद। आपका अनुरोध प्राप्त हो गया है। '+key.replace(/^Thank you\. Your enquiry has been received\./,'').replace('Reference:','संदर्भ संख्या:').replace('You can close this window when ready.','अब आप यह विंडो बंद कर सकते हैं।');
  return value;
}
window.RCC_TRANSLATE = translate;
const controls = document.createElement('div'); controls.className='site-preferences'; controls.dataset.noTranslate='';
controls.innerHTML='<button type="button" class="language-toggle" aria-label="Change language / भाषा बदलें"></button><button type="button" class="theme-toggle" aria-label="Change color theme"></button>';
const header = document.querySelector('#mainNav .container, .legal-header .nav-wrap');
header?.insertBefore(controls,header.querySelector('.navbar-toggler'));
function persist(key,value){try{localStorage.setItem(key,value)}catch{}}
function applyTheme(){document.documentElement.dataset.theme=theme;document.documentElement.style.colorScheme=theme;const btn=controls.querySelector('.theme-toggle');btn.innerHTML=theme==='dark'?'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg>':'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.5 13.2A8.5 8.5 0 0 1 10.8 3.5a8.5 8.5 0 1 0 9.7 9.7Z"/></svg>';document.querySelectorAll('#mainNav .navbar-brand img,.legal-header .brand img').forEach(img=>{const asset=theme==='dark'?'./assets/rcc-logo-light.svg':'./assets/rcc-logo.svg';if(img.getAttribute('src')!==asset)img.setAttribute('src',asset);});btn.setAttribute('aria-label',language==='hi'?(theme==='dark'?'लाइट मोड चुनें':'डार्क मोड चुनें'):(theme==='dark'?'Use light theme':'Use dark theme'));btn.setAttribute('aria-pressed',String(theme==='dark'));}
function localize(){
  observer.disconnect();
  document.querySelectorAll('option:not([value])').forEach(option=>option.value=option.textContent);
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
  while(walker.nextNode()){
    const node=walker.currentNode;
    if(node.parentElement?.closest('script,style,textarea,[data-no-translate],.bi'))continue;
    const previous=originals.get(node);
    const english=previous && (node.nodeValue===previous.rendered || node.nodeValue===previous.english)?previous.english:(reverse.get(normalize(node.nodeValue)) || node.nodeValue);
    const rendered=translate(english); if(node.nodeValue!==rendered)node.nodeValue=rendered;
    originals.set(node,{english,rendered});
  }
  document.querySelectorAll('[placeholder],[aria-label]').forEach(el=>{
    if(el.closest('[data-no-translate]'))return;
    let saved=attributes.get(el)||{};
    for(const key of ['placeholder','aria-label'])if(el.hasAttribute(key)){saved[key]??=el.getAttribute(key);el.setAttribute(key,translate(saved[key]));}
    attributes.set(el,saved);
  });
  document.documentElement.lang=language;
  const englishTitle=reverse.get(document.title)||document.title;document.title=translate(englishTitle);
  controls.querySelector('.language-toggle').textContent=language==='hi'?'English':'हिन्दी';
  controls.querySelector('.language-toggle').setAttribute('aria-pressed',String(language==='hi'));
  applyTheme();
  observer.observe(document.body,{childList:true,subtree:true,characterData:true});
}
const observer=new MutationObserver(localize);
controls.querySelector('.language-toggle').addEventListener('click',()=>{language=language==='en'?'hi':'en';persist('rcc-language',language);localize();document.dispatchEvent(new Event('rcc-languagechange'));});
controls.querySelector('.theme-toggle').addEventListener('click',()=>{theme=theme==='dark'?'light':'dark';persist('rcc-theme',theme);applyTheme();});
localize();
