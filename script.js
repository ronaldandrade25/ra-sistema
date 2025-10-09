// =====================
// UTIL: ano no footer
// =====================
document.getElementById('year').textContent = new Date().getFullYear();

// =====================
// MENU MOBILE
// =====================
const hamb = document.getElementById('hamb');
const menu = document.getElementById('menu');
hamb.addEventListener('click', () => menu.classList.toggle('open'));
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));

// =====================
// REVEAL ON SCROLL
// =====================
const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('on');
            if (e.target.classList.contains('shine')) e.target.classList.add('anim');
            io.unobserve(e.target);
        }
    });
}, { threshold: .16 });
document.querySelectorAll('.reveal, .shine').forEach(el => io.observe(el));

// =====================
// FILTRO PORTFÓLIO
// =====================
const chips = document.querySelectorAll('.chip');
const works = document.querySelectorAll('.work');
chips.forEach(ch => ch.addEventListener('click', () => {
    chips.forEach(c => c.classList.remove('active'));
    ch.classList.add('active');
    const f = ch.dataset.filter;
    works.forEach(w => {
        const show = f === 'all' || w.dataset.cat === f;
        w.style.display = show ? '' : 'none';
    });
}));

// =====================
// THUMBS: aplica imagem do data-img ao fundo
// =====================
document.querySelectorAll('.work .thumb').forEach(thumb => {
    const btn = thumb.parentElement.querySelector('button.open');
    const img = btn?.dataset.img;
    if (img) {
        const image = new Image();
        image.onload = () => { thumb.style.backgroundImage = `url('${img}')`; };
        image.onerror = () => { /* mantém fundo escuro se falhar */ };
        image.src = img;
    }
});

// =====================
// CAPA INICIAL: projeto em destaque
// Pega o primeiro card com data-img/data-link e mostra na capa
// =====================
(function setupHeroShowcase() {
    const firstBtn = document.querySelector('.work .open[data-img][data-link]');
    const heroImg = document.getElementById('heroCoverImg');
    const heroVisit = document.getElementById('heroVisit');
    const heroBadge = document.getElementById('heroBadge');

    if (!firstBtn || !heroImg || !heroVisit) return;

    const img = firstBtn.dataset.img;
    const link = firstBtn.dataset.link;
    const tag = firstBtn.closest('.work')?.querySelector('.tag')?.textContent || 'Projeto';

    if (img) {
        heroImg.src = img;
        heroImg.hidden = false;
    }
    if (link && link !== '#') {
        heroVisit.href = link;
        heroVisit.hidden = false;
    }
    heroBadge.textContent = `${tag} • Destaque`;
})();

// =====================
// LIGHTBOX DETALHE (com iframe + fallback)
// =====================
const lb = document.getElementById('lightbox');
const lbTitle = document.getElementById('lbTitle');
const lbDesc = document.getElementById('lbDesc');
const lbHero = document.getElementById('lbHero');
const lbClose = document.getElementById('lbClose');
const lbVisit = document.getElementById('lbVisit');

function renderPreview({ link, img, embed }) {
    lbHero.innerHTML = '';

    if (embed && link && link !== '#') {
        const frame = document.createElement('iframe');
        frame.className = 'lb-iframe';
        frame.loading = 'lazy';
        frame.src = link;
        frame.title = 'Prévia do projeto';
        const fallbackTimer = setTimeout(() => {
            if (!frame.contentWindow) {
                lbHero.innerHTML = img
                    ? `<img class="lb-img" src="${img}" alt="Prévia do projeto">`
                    : `<div class="lb-fallback">Não foi possível mostrar a prévia ao vivo.<br/>Clique em <b>Abrir projeto</b> para visitar.</div>`;
            }
        }, 2500);
        frame.addEventListener('load', () => clearTimeout(fallbackTimer));
        lbHero.appendChild(frame);
        return;
    }

    if (img) {
        lbHero.innerHTML = `<img class="lb-img" src="${img}" alt="Prévia do projeto">`;
        return;
    }
    lbHero.innerHTML = `<div class="lb-fallback">Prévia indisponível. Clique em <b>Abrir projeto</b>.</div>`;
}

document.querySelectorAll('.open[data-title]').forEach(btn => {
    btn.addEventListener('click', (e) => {
        if ((e.ctrlKey || e.metaKey) && btn.dataset.link && btn.dataset.link !== '#') {
            window.open(btn.dataset.link, '_blank', 'noopener');
            return;
        }

        lbTitle.textContent = btn.dataset.title || 'Projeto';
        lbDesc.textContent = btn.dataset.desc || '';
        const link = btn.dataset.link || '#';
        const img = btn.dataset.img || '';
        const embed = String(btn.dataset.embed).toLowerCase() === 'true';

        if (link && link !== '#') {
            lbVisit.style.display = 'inline-flex';
            lbVisit.href = link;
            lbVisit.setAttribute('aria-disabled', 'false');
        } else {
            lbVisit.style.display = 'none';
            lbVisit.removeAttribute('href');
            lbVisit.setAttribute('aria-disabled', 'true');
        }

        renderPreview({ link, img, embed });

        lb.classList.add('open');
        lb.setAttribute('aria-hidden', 'false');
    });
});

lbClose.addEventListener('click', () => {
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
});
lb.addEventListener('click', (e) => { if (e.target === lb) lbClose.click(); });

// =====================
// CONTATO: WhatsApp dinâmico + validação simples
// =====================
const ZAP_NUMBER = '+5581996221060';
const form = document.getElementById('form');
const zap = document.getElementById('zap');

function buildZapURL() {
    const nome = document.getElementById('nome').value.trim();
    const mensagem = document.getElementById('mensagem').value.trim();
    const texto = `Olá, sou ${nome || 'visitante'} e vim pelo site da RA Sistemas. ${mensagem ? '\n\nResumo do projeto: ' + mensagem : ''}`;
    const url = `https://wa.me/${ZAP_NUMBER.replace(/\D/g, '')}?text=${encodeURIComponent(texto)}`;
    zap.href = url;
}
['input', 'change'].forEach(ev => form.addEventListener(ev, buildZapURL));
buildZapURL();

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { alert('Informe um e-mail válido.'); email.focus(); return; }
    const assunto = 'Novo contato • RA Sistemas';
    const corpo = `Nome: ${document.getElementById('nome').value}\nE-mail: ${email.value}\n\nMensagem:\n${document.getElementById('mensagem').value}`;
    window.location.href = `mailto:contato@rasistemas.com?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;
});
