class FarmCarousel {
    constructor() {
        this.IMAGES_COUNT = 10;
        this.slidesEl = document.getElementById('slides');
        this.current = 0;
        this.timer = null;
        this.autoplay = true;
        this.INTERVAL = 6000; // 6 segundos para cada slide
        this.totalSlides = 0;
        this.videoElement = null;
        
        this.init();
    }

    init() {
        this.createVideoSlide();
        this.createImageSlides();
        this.setupIndicators();
        this.setupEventListeners();
        this.setupTranslations();
        this.startAutoplay();
    }

    createVideoSlide() {
        const slide = document.createElement('div');
        slide.className = 'slide';
        slide.setAttribute('role', 'tabpanel');
        slide.setAttribute('aria-label', 'Vídeo da propriedade');
        
        const videoContainer = document.createElement('div');
        videoContainer.className = 'video-container';
        
        const video = document.createElement('video');
        video.src = 'images/video.mp4';
        video.setAttribute('playsinline', '');
        video.setAttribute('muted', '');
        video.setAttribute('loop', '');
        video.setAttribute('autoplay', '');
        video.setAttribute('aria-label', 'Vídeo demonstrativo da fazenda');
        
        // Configurações importantes para o vídeo
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.objectFit = 'cover';
        
        // Prevenir download do vídeo
        video.addEventListener('contextmenu', (e) => e.preventDefault());
        
        // Event listeners para controle do vídeo
        video.addEventListener('loadeddata', () => {
            console.log('Vídeo carregado com sucesso');
            this.playVideo();
        });
        
        video.addEventListener('error', (e) => {
            console.error('Erro ao carregar vídeo:', e);
        });

        // Adicionar indicador visual de vídeo
        const videoBadge = document.createElement('div');
        videoBadge.className = 'video-badge';
        videoBadge.textContent = '🎥 VÍDEO';
        
        videoContainer.appendChild(video);
        videoContainer.appendChild(videoBadge);
        slide.appendChild(videoContainer);
        this.slidesEl.appendChild(slide);
        
        // Referência ao vídeo para controle
        this.videoElement = video;
    }

    createImageSlides() {
        for (let i = 1; i <= this.IMAGES_COUNT; i++) {
            const slide = document.createElement('div');
            slide.className = 'slide';
            slide.setAttribute('role', 'tabpanel');
            slide.setAttribute('aria-label', `Imagem ${i} da propriedade`);
            
            const img = document.createElement('img');
            img.src = `images/img${i}.jpg`;
            img.alt = `Imagem ${i} da fazenda - Vista da propriedade`;
            img.loading = 'lazy';
            
            // Proteções contra download
            img.addEventListener('contextmenu', (e) => e.preventDefault());
            img.addEventListener('dragstart', (e) => e.preventDefault());
            
            // Adicionar overlay de proteção
            const overlay = document.createElement('div');
            overlay.className = 'image-protection';
            overlay.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: transparent;
                z-index: 2;
                pointer-events: none;
            `;
            
            slide.appendChild(img);
            slide.appendChild(overlay);
            this.slidesEl.appendChild(slide);
        }
        
        this.totalSlides = this.IMAGES_COUNT + 1;
    }

    playVideo() {
        if (this.videoElement) {
            this.videoElement.currentTime = 0;
            this.videoElement.play().catch(e => {
                console.log('Autoplay bloqueado, tentando com mute:', e);
                this.videoElement.muted = true;
                this.videoElement.play().catch(e2 => {
                    console.log('Play falhou mesmo com mute:', e2);
                });
            });
        }
    }

    pauseVideo() {
        if (this.videoElement) {
            this.videoElement.pause();
        }
    }

    resetVideo() {
        if (this.videoElement) {
            this.videoElement.currentTime = 0;
        }
    }

    setupIndicators() {
        const indicatorsContainer = document.getElementById('indicators');
        indicatorsContainer.innerHTML = '';

        for (let i = 0; i < this.totalSlides; i++) {
            const button = document.createElement('button');
            button.setAttribute('data-index', i);
            button.setAttribute('aria-label', i === 0 ? 'Ir para vídeo' : `Ir para imagem ${i}`);
            button.setAttribute('role', 'tab');
            
            if (i === 0) {
                button.classList.add('active');
                button.setAttribute('aria-selected', 'true');
            }
            
            button.addEventListener('click', () => {
                this.goTo(i);
                this.resetAutoplay();
            });
            
            indicatorsContainer.appendChild(button);
        }
    }

    update() {
        this.slidesEl.style.transform = `translateX(${-this.current * 100}%)`;
        
        // Controle do vídeo
        if (this.current === 0) {
            // Se estamos no slide do vídeo
            this.playVideo();
        } else {
            // Se saímos do slide do vídeo
            this.pauseVideo();
            this.resetVideo();
        }
        
        // Atualizar indicadores
        const indicators = document.querySelectorAll('#indicators button');
        indicators.forEach((btn, idx) => {
            btn.classList.toggle('active', idx === this.current);
            btn.setAttribute('aria-selected', idx === this.current ? 'true' : 'false');
        });

        // Atualizar ARIA live region para leitores de tela
        const slideType = this.current === 0 ? 'Vídeo' : `Imagem ${this.current}`;
        this.slidesEl.setAttribute('aria-label', `${slideType} ${this.current + 1} de ${this.totalSlides}`);
    }

    goTo(idx) {
        if (idx < 0) idx = this.totalSlides - 1;
        if (idx >= this.totalSlides) idx = 0;
        
        this.current = idx;
        this.update();
    }

    setupEventListeners() {
        document.getElementById('prev').addEventListener('click', () => {
            this.goTo(this.current - 1);
            this.resetAutoplay();
        });

        document.getElementById('next').addEventListener('click', () => {
            this.goTo(this.current + 1);
            this.resetAutoplay();
        });

        document.getElementById('playPause').addEventListener('click', () => {
            if (this.autoplay) this.stopAutoplay();
            else this.startAutoplay();
        });

        // Teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.goTo(this.current - 1);
                this.resetAutoplay();
            }
            if (e.key === 'ArrowRight') {
                this.goTo(this.current + 1);
                this.resetAutoplay();
            }
            if (e.key === ' ' || e.key === 'Spacebar') {
                e.preventDefault();
                if (this.autoplay) this.stopAutoplay();
                else this.startAutoplay();
            }
        });

        // Contato WhatsApp
        const contactBtn = document.getElementById('contactBtn');
        if (contactBtn) {
            contactBtn.addEventListener('click', () => {
                const phone = '5531996361515';
                const message = 'Olá! Gostaria de obter mais informações sobre a fazenda em Varjão de Minas.';
                const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
                window.open(url, '_blank');
            });
        }

        // Prevenir ações de download globais
        document.addEventListener('contextmenu', (e) => {
            if (e.target.closest('.carousel')) {
                e.preventDefault();
                return false;
            }
        });

        document.addEventListener('dragstart', (e) => {
            if (e.target.closest('.carousel')) {
                e.preventDefault();
                return false;
            }
        });

        // Desativar seleção de texto no carrossel
        document.addEventListener('selectstart', (e) => {
            if (e.target.closest('.carousel')) {
                e.preventDefault();
                return false;
            }
        });
    }

    startAutoplay() {
        this.stopAutoplay();
        this.timer = setInterval(() => {
            this.goTo(this.current + 1);
        }, this.INTERVAL);
        
        const pp = document.getElementById('playPause');
        if (pp) {
            pp.textContent = '⏸';
            pp.setAttribute('aria-label', 'Pausar apresentação automática');
        }
        this.autoplay = true;
    }

    stopAutoplay() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        const pp = document.getElementById('playPause');
        if (pp) {
            pp.textContent = '▶';
            pp.setAttribute('aria-label', 'Iniciar apresentação automática');
        }
        this.autoplay = false;
    }

    resetAutoplay() {
        this.stopAutoplay();
        this.startAutoplay();
    }

    setupTranslations() {
        this.translations = {
            pt: {
                siteTitle: 'Fazenda',
                siteSub: 'Oportunidade Única em Varjão de Minas - Fazenda com 202 Hectares!',
                lead: 'Oportunidade única! Fazenda com nascente e represas.',
                features: [
                    'Localização: 15 km de Varjão de Minas, MG, Brasil',
                    'Tamanho: 202 hectares',
                    'Benfeitorias: sede, galpões, curral, energia, água, represas e nascente',
                    'Aproveitamento do terreno: turismo, lazer, agricultura e pecuária',
                    'Documentação: em dia',
                    'Venda: diretamente com o proprietário'
                ],
                price: 'Valor: R$ 10.000.000,00',
                contact: 'Telefone: 31 99636-1515 (ou Whatsapp) Eunice',
                contactBtn: 'Entrar em Contato',
                detailsTitle: 'Descrição Detalhada'
            },
            en: {
                siteTitle: 'Farm',
                siteSub: 'Unique Opportunity in Varjão de Minas - Farm with 202 Hectares!',
                lead: 'Unique opportunity! Farm with spring and reservoir.',
                features: [
                    'Location: 15 km from Varjão de Minas, MG, Brazil',
                    'Size: 202 hectares',
                    'Improvements: main house, sheds, corral, electricity, water, reservoirs and spring',
                    'Land use: tourism, recreation, agriculture, and livestock',
                    'Documentation: up to date',
                    'Sale: directly with the owner'
                ],
                price: 'Price: BRL 10,000,000.00',
                contact: 'Phone: +55 31 99636-1515 (or WhatsApp) Eunice',
                contactBtn: 'Contact Us',
                detailsTitle: 'Detailed Description'
            },
            es: {
                siteTitle: 'Finca',
                siteSub: 'Oportunidad Única en Varjão de Minas - Finca con 202 Hectáreas!',
                lead: '¡Oportunidad única! Finca con manantial y represas.',
                features: [
                    'Ubicación: 15 km de Varjão de Minas, MG, Brasil',
                    'Tamaño: 202 hectáreas',
                    'Mejoras: casa principal, galpones, corral, energía, agua, represas y manantial',
                    'Aprovechamiento del terreno: turístico, ocio, agricultura y ganadería',
                    'Documentación: al día',
                    'Venta: directamente con el propietario'
                ],
                price: 'Valor: BRL 10.000.000,00',
                contact: 'Teléfono: +55 31 99636-1515 (o WhatsApp) Eunice',
                contactBtn: 'Contactar',
                detailsTitle: 'Descripción Detallada'
            }
        };

        this.setupLanguageSwitching();
    }

    setupLanguageSwitching() {
        const langBtns = document.querySelectorAll('.lang-btn');
        
        langBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.setLang(btn.dataset.lang);
            });
        });

        this.setLang('pt');
    }

    setLang(lang) {
        const langBtns = document.querySelectorAll('.lang-btn');
        langBtns.forEach(b => {
            b.classList.toggle('active', b.dataset.lang === lang);
            b.setAttribute('aria-pressed', b.dataset.lang === lang ? 'true' : 'false');
        });

        const t = this.translations[lang] || this.translations.pt;
        
        // Atualizar textos
        document.getElementById('site-title').textContent = t.siteTitle;
        document.getElementById('site-sub').textContent = t.siteSub;
        document.getElementById('lead').textContent = t.lead;
        document.getElementById('price').textContent = t.price;
        document.getElementById('contact').textContent = t.contact;
        document.getElementById('details-title').textContent = t.detailsTitle;

        // Botão de contato
        const contactBtn = document.getElementById('contactBtn');
        if (contactBtn) contactBtn.textContent = t.contactBtn;

        // Lista de características
        const featEl = document.getElementById('features-list');
        if (featEl) {
            featEl.innerHTML = '';
            t.features.forEach(text => {
                const li = document.createElement('li');
                const parts = text.split(':');
                if (parts.length > 1) {
                    const strong = document.createElement('strong');
                    strong.textContent = parts[0].trim() + ':';
                    li.appendChild(strong);
                    li.appendChild(document.createTextNode(' ' + parts.slice(1).join(':').trim()));
                } else {
                    li.textContent = text;
                }
                featEl.appendChild(li);
            });
        }

        // Atualizar idioma do HTML
        document.documentElement.lang = lang === 'pt' ? 'pt-BR' : (lang === 'en' ? 'en-US' : 'es-ES');
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new FarmCarousel();
});

// Prevenir qualquer comportamento de download
document.addEventListener('DOMContentLoaded', () => {
    // Desativar menu de contexto em imagens
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            return false;
        });
        img.addEventListener('dragstart', (e) => {
            e.preventDefault();
            return false;
        });
    });
});