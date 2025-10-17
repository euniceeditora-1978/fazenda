const IMAGES_COUNT = 10; // number of images expected in images/ (img1.jpg ... img10.jpg)
const slidesEl = document.getElementById('slides');
let current = 0;
let timer = null;
let autoplay = true;
const INTERVAL = 7000;

// create video slide as first slide
(function createVideoSlide(){
  const s = document.createElement('div');
  s.className = 'slide';
  const video = document.createElement('video');
  video.src = 'images/video.mp4'; // expected path in images/
  video.width = 688;
  video.height = 464;
  video.setAttribute('playsinline', '');
  video.controls = true;
  s.appendChild(video);
  slidesEl.appendChild(s);
})();

// build image slides
for (let i=1;i<=IMAGES_COUNT;i++){
  const s = document.createElement('div');
  s.className = 'slide';
  const img = document.createElement('img');
  img.src = 'images/img' + i + '.jpg';
  img.alt = 'Imagem ' + i;
  s.appendChild(img);
  slidesEl.appendChild(s);
}

// create indicators container (single)
const totalSlides = IMAGES_COUNT + 1;
const indicatorsContainer = document.createElement('div');
indicatorsContainer.className = 'indicators';
indicatorsContainer.id = 'indicators';
document.querySelector('.controls-bottom').appendChild(indicatorsContainer);

for (let i=0;i<totalSlides;i++){
  const b = document.createElement('button');
  b.setAttribute('data-index', i);
  if (i===0) b.classList.add('active');
  b.addEventListener('click', ()=>{ goTo(i); resetAutoplay(); });
  indicatorsContainer.appendChild(b);
}

function update(){
  slidesEl.style.transform = 'translateX(' + (-current*100) + '%)';
  [...indicatorsContainer.children].forEach((btn, idx)=> btn.classList.toggle('active', idx===current));
}

function goTo(idx){
  if (idx<0) idx = totalSlides-1;
  if (idx>=totalSlides) idx = 0;
  current = idx;
  update();
}

document.getElementById('prev').addEventListener('click', ()=>{ goTo(current-1); resetAutoplay(); });
document.getElementById('next').addEventListener('click', ()=>{ goTo(current+1); resetAutoplay(); });

function startAutoplay(){ stopAutoplay(); timer = setInterval(()=>{ goTo(current+1); }, INTERVAL); const pp = document.getElementById('playPause'); if(pp) pp.textContent='⏸'; autoplay=true; }
function stopAutoplay(){ if (timer) clearInterval(timer); timer = null; const pp = document.getElementById('playPause'); if(pp) pp.textContent='▶'; autoplay=false; }
document.getElementById('playPause').addEventListener('click', ()=>{ if (autoplay) stopAutoplay(); else startAutoplay(); });

function resetAutoplay(){ stopAutoplay(); startAutoplay(); }

// translations and language switching
const translations = {
  pt: {
    siteTitle: 'Fazenda',
    siteSub: 'Oportunidade única com nascente e represa',
    lead: 'Oportunidade única! Fazenda com nascente e represa.',
    features: [
      'Localização: 15 km de Varjão de Minas, MG, Brasil)',
      'Tamanho: 202 hectares',
      'Benfeitorias: sede, galpões, curral, energia, água, represa e nascente',
      'Aproveitamento do terreno: turístico, lazer, agricultura e pecuária',
      'Documentação em dia',
      'Negociação diretamente com o proprietário'
    ],
    price: 'Valor: R$ 10.000.000,00',
    contact: 'Telefone: 31 99636-1515 (ou Whatsapp) Eunice'
  },
  en: {
    siteTitle: 'Farm',
    siteSub: 'Unique opportunity with spring and reservoir',
    lead: 'Unique opportunity! Farm with spring and reservoir.',
    features: [
      'Location: 15 from Varjão de Minas, MG, Brazil)',
      'Size: 202 hectares',
      'Improvements: main house, sheds, corral, electricity, water, reservoir and spring',
      'Land use: tourism, recreation, agriculture, and livestock',
      'Legal documentation up to date',
      'Negotiation directly from the owner'
    ],
    price: 'Price: BRL 10.000.000,00',
    contact: 'Number: 31 99636-1515 (or Whatsapp) Eunice'
  },
  es: {
    siteTitle: 'Finca',
    siteSub: 'Oportunidad única con manantial y represa',
    lead: '¡Oportunidad única! Finca con manantial y represa.',
    features: [
      'Ubicación: 15 km de Varjão de Minas, MG, Brasil)',
      'Tamaño: 202 hectáreas',
      'Mejoras: casa principal, galpones, corral, energía, agua, represa y manantial',
      'Aprovechamiento del terreno: turístico, ocio, agricultura y ganadería.',
      'Documentación actualizada',
      'Negociación directamente con el propietario'
    ],
    price: 'Valor: BRL 10.000.000,00',
    contact: 'Teléfono: 31 99636-1515 (o Whatsapp) Eunice'
  }
};

const langBtns = document.querySelectorAll('.lang-btn');
function setLang(lang){
  langBtns.forEach(b=> b.classList.toggle('active', b.dataset.lang===lang));
  const t = translations[lang] || translations.pt;
  document.getElementById('site-title').textContent = t.siteTitle;
  document.getElementById('site-sub').textContent = t.siteSub;
  document.getElementById('lead').textContent = t.lead;
  // update all elements that (incorrectly) share the same id 'features'
  const featEls = document.querySelectorAll('#features');
  featEls.forEach(featEl => {
    featEl.innerHTML = '';
    t.features.forEach(text=>{
      const li = document.createElement('li');
      // maintain original markup which uses <strong> around the label where appropriate
      const parts = text.split(':');
      if(parts.length>1){
        const strong = document.createElement('strong');
        strong.textContent = parts[0].trim();
        li.appendChild(strong);
        li.appendChild(document.createTextNode(': ' + parts.slice(1).join(':').trim()));
      } else {
        li.textContent = text;
      }
      featEl.appendChild(li);
    });
  });
  const priceEl = document.getElementById('price');
  if(priceEl) priceEl.textContent = t.price;
  const contactEl = document.getElementById('contact');
  if(contactEl) contactEl.textContent = t.contact;
  document.documentElement.lang = (lang==='pt'?'pt-BR':(lang==='en'?'en-US':'es-ES'));
}

langBtns.forEach(b=> b.addEventListener('click', ()=> setLang(b.dataset.lang)));

setLang('pt');
startAutoplay();

// safe contactBtn handler (only if exists)
const contactBtn = document.getElementById('contactBtn');
if(contactBtn){
  contactBtn.addEventListener('click', (e)=>{
    e.preventDefault();
    alert('Substitua este link pelo contato real (WhatsApp, e-mail ou formulário).');
  });
}

// keyboard accessibility
document.addEventListener('keydown', (e)=>{
  if (e.key === 'ArrowLeft') { goTo(current-1); resetAutoplay(); }
  if (e.key === 'ArrowRight') { goTo(current+1); resetAutoplay(); }
});
