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
// MODO LINK DIRETO (substitui "Ver mais" -> "Ver projeto")
// Converte cada <button.open> em <a.open target="_blank"> apontando para data-link
// =====================
(function convertButtonsToLinks() {
    document.querySelectorAll('.work .meta .open').forEach(btn => {
        // já é <a>? só atualiza o texto e atributos
        const linkHref = btn.dataset?.link || btn.getAttribute('href') || '#';
        const text = 'Ver projeto';

        // cria <a> do zero para evitar resquícios de eventos
        const a = document.createElement('a');
        a.className = btn.className;
        a.textContent = text;
        a.href = linkHref;
        a.target = '_blank';
        a.rel = 'noopener';

        // preserva data-attrs úteis no novo <a> (ex.: data-img, data-link, data-title)
        for (const { name, value } of Array.from(btn.attributes)) {
            if (name.startsWith('data-')) a.setAttribute(name, value);
        }

        btn.replaceWith(a);
    });
})();

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
// THUMBS: aplica imagem do data-img ao fundo (compatível com <a.open>)
// =====================
document.querySelectorAll('.work').forEach(card => {
    const thumb = card.querySelector('.thumb');
    const trigger = card.querySelector('.open'); // agora é <a>
    const img = trigger?.dataset?.img;
    if (thumb && img) {
        const image = new Image();
        image.onload = () => { thumb.style.backgroundImage = `url('${img}')`; };
        image.src = img;
    }
});

// =====================
// CAPA INICIAL: projeto em destaque (compatível com <a.open>)
// Pega o primeiro card com data-img/data-link e aponta o CTA
// =====================
(function setupHeroShowcase() {
    const firstBtn = document.querySelector('.work .open[data-img][data-link]');
    const heroImg = document.getElementById('heroCoverImg');
    const heroVisit = document.getElementById('heroVisit');
    const heroBadge = document.getElementById('heroBadge');

    if (!firstBtn || !heroImg || !heroVisit || !heroBadge) return;

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
// DESATIVAR LIGHTBOX (não é mais usado)
// Mantemos elementos no HTML, mas não registramos nenhum listener
// =====================
// (Intencionalmente sem código)

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
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        alert('Informe um e-mail válido.');
        email.focus();
        return;
    }
    const assunto = 'Novo contato • RA Sistemas';
    const corpo = `Nome: ${document.getElementById('nome').value}\nE-mail: ${email.value}\n\nMensagem:\n${document.getElementById('mensagem').value}`;
    window.location.href = `mailto:contato@rasistemas.com?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;
});
