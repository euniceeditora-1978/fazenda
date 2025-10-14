
const IMAGES_COUNT = 10;
const slidesEl = document.getElementById('slides');
const indicatorsEl = document.getElementById('indicators') || document.createElement('div');
let current = 0;
let timer = null;
let autoplay = true;
const INTERVAL = 4000;

// build slides and indicators
for (let i=1;i<=IMAGES_COUNT;i++){
  const s = document.createElement('div');
  s.className = 'slide';
  const img = document.createElement('img');
  img.src = 'images/img' + i + '.jpg';
  img.alt = 'Imagem ' + i;
  s.appendChild(img);
  slidesEl.appendChild(s);
}

// create indicators container
const indicatorsContainer = document.createElement('div');
indicatorsContainer.className = 'indicators';
indicatorsContainer.id = 'indicators';
document.querySelector('.controls-bottom').appendChild(indicatorsContainer);

for (let i=0;i<IMAGES_COUNT;i++){
  const b = document.createElement('button');
  b.setAttribute('data-index', i);
  if (i===0) b.classList.add('active');
  b.addEventListener('click', ()=>{ goTo(i); resetAutoplay(); });
  indicatorsContainer.appendChild(b);
}

function update(){
  slidesEl.style.transform = 'translateX(' + (-current*100) + '%)';
  // indicators
  [...indicatorsContainer.children].forEach((btn, idx)=> btn.classList.toggle('active', idx===current));
}

function goTo(idx){
  if (idx<0) idx = IMAGES_COUNT-1;
  if (idx>=IMAGES_COUNT) idx = 0;
  current = idx;
  update();
}

document.getElementById('prev').addEventListener('click', ()=>{ goTo(current-1); resetAutoplay(); });
document.getElementById('next').addEventListener('click', ()=>{ goTo(current+1); resetAutoplay(); });

function startAutoplay(){ stopAutoplay(); timer = setInterval(()=>{ goTo(current+1); }, INTERVAL); document.getElementById('playPause').textContent='⏸'; autoplay=true; }
function stopAutoplay(){ if (timer) clearInterval(timer); timer = null; document.getElementById('playPause').textContent='▶'; autoplay=false; }
document.getElementById('playPause').addEventListener('click', ()=>{ if (autoplay) stopAutoplay(); else startAutoplay(); });

function resetAutoplay(){ stopAutoplay(); startAutoplay(); }

// language translations
const translations = {
  pt: {
    siteTitle: 'Fazenda',
    siteSub: 'Oportunidade única com nascente e represa',
    lead: 'Oportunidade única! Fazenda com nascente e represa.',
    features: [
      'Localização: 15 km de Varjão de Minas, MG, Brasil)',
      'Tamanho: 202 hectares',
      'Benfeitorias: sede, galpões, curral, energia, água, represa e nascente',
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
      'Legal documentation up to date',
      'Negociation directly from the owner'
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
      'Documentación actualizada',
      'Negociación directamente con el propietario'
    ],
    price: 'Valor: BRL 10.000.000,00',
    contact: 'Telefone: 31 99636-1515 (o Whatsapp) Eunice'
  }
};

const langBtns = document.querySelectorAll('.lang-btn');
function setLang(lang){
  langBtns.forEach(b=> b.classList.toggle('active', b.dataset.lang===lang));
  const t = translations[lang] || translations.pt;
  document.getElementById('site-title').textContent = t.siteTitle;
  document.getElementById('site-sub').textContent = t.siteSub;
  document.getElementById('lead').textContent = t.lead;
  const featEl = document.getElementById('features');
  featEl.innerHTML = '';
  t.features.forEach(text=>{
    const li = document.createElement('li');
    li.textContent = text;
    featEl.appendChild(li);
  });
  document.getElementById('price').textContent = t.price;
  document.documentElement.lang = (lang==='pt'?'pt-BR':(lang==='en'?'en-US':'es-ES'));
}

langBtns.forEach(b=> b.addEventListener('click', ()=> setLang(b.dataset.lang)));

setLang('pt');
startAutoplay();

// contact button placeholder - you can change to your WhatsApp/email link
document.getElementById('contactBtn').addEventListener('click', (e)=>{
  e.preventDefault();
  alert('Substitua este link pelo contato real (WhatsApp, e-mail ou formulário).');
});

// keyboard accessibility
document.addEventListener('keydown', (e)=>{
  if (e.key === 'ArrowLeft') { goTo(current-1); resetAutoplay(); }
  if (e.key === 'ArrowRight') { goTo(current+1); resetAutoplay(); }
});
