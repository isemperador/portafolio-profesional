/**
 * PORTAFOLIO PROFESIONAL - ISMAEL JHOSTIN BRACO RUIZ
 * Controlador Principal: Efectos de Cursor (Rayos / Códigos),
 * Generador QR, Modo Claro/Oscuro, Filtros de Proyectos y Modal de CV.
 */

// ===================================================================
// 1. GESTIÓN DE TEMA (MODO CLARO / MODO OSCURO)
// ===================================================================
const themeToggleBtn = document.getElementById('themeToggleBtn');
const htmlElement = document.documentElement;

function initTheme() {
  const savedTheme = localStorage.getItem('ismael_theme');
  if (savedTheme) {
    htmlElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
  } else {
    // Modo Oscuro futurista por defecto
    htmlElement.setAttribute('data-theme', 'dark');
    updateThemeIcon('dark');
  }
}

function toggleTheme() {
  const currentTheme = htmlElement.getAttribute('data-theme') || 'dark';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  htmlElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('ismael_theme', newTheme);
  updateThemeIcon(newTheme);
  showToast(newTheme === 'dark' ? '🌙 Modo Oscuro activado' : '☀️ Modo Claro activado');
  
  // Actualizar color de QR si es necesario
  generateCurrentQR();
}

function updateThemeIcon(theme) {
  if (!themeToggleBtn) return;
  if (theme === 'light') {
    themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
    themeToggleBtn.setAttribute('title', 'Cambiar a Modo Oscuro');
  } else {
    themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    themeToggleBtn.setAttribute('title', 'Cambiar a Modo Claro');
  }
}

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', toggleTheme);
}

// ===================================================================
// 2. EFECTOS INTERACTIVOS DE CURSOR (RAYOS / CÓDIGOS DE PROGRAMACIÓN)
// ===================================================================
const cursorCanvas = document.getElementById('cursorCanvas');
const ctx = cursorCanvas ? cursorCanvas.getContext('2d') : null;
const cursorReticle = document.getElementById('cursorReticle');
const cursorRing = document.getElementById('cursorRing');
const fxToggleBtn = document.getElementById('fxToggleBtn');

let mouseX = -100;
let mouseY = -100;
let ringX = -100;
let ringY = -100;
let prevMouseX = -100;
let prevMouseY = -100;
let isMouseMoving = false;
let mouseMoveTimeout;

// Modos de Cursor: 'lightning' (Rayos), 'code' (Códigos de programación), 'off' (Desactivado)
let currentCursorEffect = 'lightning'; 

const codeSnippets = [
  '<?php', '$db->query()', 'function()', '=>', '{ ... }', 
  'const', 'let', 'async', 'await', '0101', '0x2F', 'SELECT *', 
  'FROM users', 'SQL', 'C++', 'Java', 'Python', 'SENATI', 
  'API.post()', 'Workers.fetch()', 'IPERC', 'vCard', 'JSON.parse()'
];

class Particle {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type; // 'spark', 'lightning-branch', 'code'
    this.alpha = 1;
    this.life = 1;
    
    if (type === 'code') {
      this.text = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
      this.vx = (Math.random() - 0.5) * 1.8;
      this.vy = -(Math.random() * 1.5 + 0.8);
      this.decay = Math.random() * 0.015 + 0.012;
      this.size = Math.floor(Math.random() * 4) + 11; // 11px - 14px
    } else {
      // Rayos / Chispas eléctricas
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3.5 + 1;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.decay = Math.random() * 0.035 + 0.025;
      this.size = Math.random() * 2.8 + 1.2;
    }
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= this.decay;
  }

  draw(context, isLight) {
    if (this.alpha <= 0) return;
    context.save();
    context.globalAlpha = Math.max(0, this.alpha);

    if (this.type === 'code') {
      context.font = `600 ${this.size}px 'JetBrains Mono', Consolas, monospace`;
      context.fillStyle = isLight ? '#dc2626' : '#ff2b4c';
      context.shadowColor = isLight ? 'rgba(220, 38, 38, 0.5)' : '#ff1e42';
      context.shadowBlur = 10;
      context.fillText(this.text, this.x, this.y);
    } else {
      // Rayo / Chispa
      context.fillStyle = isLight ? '#dc2626' : '#ff3b5c';
      context.shadowColor = isLight ? 'rgba(220, 38, 38, 0.8)' : '#ff0033';
      context.shadowBlur = 12;
      context.beginPath();
      context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      context.fill();
    }
    context.restore();
  }
}

// Historial para dibujar arcos de rayos entre puntos recientes
const mouseHistory = [];
const particles = [];

function resizeCanvas() {
  if (!cursorCanvas) return;
  cursorCanvas.width = window.innerWidth;
  cursorCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  if (cursorReticle) {
    cursorReticle.style.left = `${mouseX}px`;
    cursorReticle.style.top = `${mouseY}px`;
  }

  // Registrar movimiento
  if (currentCursorEffect !== 'off') {
    mouseHistory.push({ x: mouseX, y: mouseY, time: Date.now() });
    if (mouseHistory.length > 8) {
      mouseHistory.shift();
    }

    // Spawn partículas según el modo
    if (currentCursorEffect === 'lightning') {
      const count = Math.random() < 0.7 ? 2 : 3;
      for (let i = 0; i < count; i++) {
        particles.push(new Particle(mouseX, mouseY, 'spark'));
      }
    } else if (currentCursorEffect === 'code') {
      if (Math.random() < 0.45) {
        particles.push(new Particle(mouseX, mouseY, 'code'));
      }
    }
  }

  clearTimeout(mouseMoveTimeout);
  isMouseMoving = true;
  mouseMoveTimeout = setTimeout(() => {
    isMouseMoving = false;
  }, 100);
});

// Cursor hover effect en elementos clickeables
document.querySelectorAll('a, button, input, textarea, .project-card, .metric-card').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

// Función para dibujar un rayo dentado tipo eléctrico
function drawLightningBolt(x1, y1, x2, y2, displace, isLight) {
  if (displace < 2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    return;
  }
  const midX = (x1 + x2) / 2 + (Math.random() - 0.5) * displace;
  const midY = (y1 + y2) / 2 + (Math.random() - 0.5) * displace;
  drawLightningBolt(x1, y1, midX, midY, displace / 2, isLight);
  drawLightningBolt(midX, midY, x2, y2, displace / 2, isLight);
}

function animateCursorCanvas() {
  if (!ctx || !cursorCanvas) return;

  ctx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);
  const isLight = htmlElement.getAttribute('data-theme') === 'light';

  // Suavizado del anillo del cursor
  ringX += (mouseX - ringX) * 0.18;
  ringY += (mouseY - ringY) * 0.18;
  if (cursorRing) {
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
  }

  // Si está activado el modo rayos y hay movimiento
  if (currentCursorEffect === 'lightning' && mouseHistory.length > 2) {
    ctx.save();
    ctx.strokeStyle = isLight ? '#dc2626' : '#ff2b4c';
    ctx.shadowColor = isLight ? '#ef4444' : '#ff0033';
    ctx.shadowBlur = 14;
    ctx.lineWidth = 1.8;

    for (let i = 0; i < mouseHistory.length - 1; i++) {
      const p1 = mouseHistory[i];
      const p2 = mouseHistory[i + 1];
      const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
      if (dist > 3) {
        drawLightningBolt(p1.x, p1.y, p2.x, p2.y, Math.min(dist * 0.5, 18), isLight);
      }
    }
    ctx.restore();
  }

  // Animar y dibujar partículas
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.update();
    p.draw(ctx, isLight);
    if (p.alpha <= 0) {
      particles.splice(i, 1);
    }
  }

  // Limpiar historial antiguo
  const now = Date.now();
  while (mouseHistory.length > 0 && now - mouseHistory[0].time > 180) {
    mouseHistory.shift();
  }

  requestAnimationFrame(animateCursorCanvas);
}
requestAnimationFrame(animateCursorCanvas);

// Botón para alternar el efecto del cursor
function cycleCursorEffect() {
  if (currentCursorEffect === 'lightning') {
    currentCursorEffect = 'code';
    fxToggleBtn.innerHTML = '<i class="fa-solid fa-code"></i> <span>Cursor: Código</span>';
    showToast('💻 Efecto de cursor: Códigos de Programación');
  } else if (currentCursorEffect === 'code') {
    currentCursorEffect = 'off';
    fxToggleBtn.innerHTML = '<i class="fa-solid fa-ban"></i> <span>Cursor: Normal</span>';
    showToast('🚫 Efectos de cursor desactivados');
  } else {
    currentCursorEffect = 'lightning';
    fxToggleBtn.innerHTML = '<i class="fa-solid fa-bolt"></i> <span>Cursor: Rayos</span>';
    showToast('⚡ Efecto de cursor: Rayos Eléctricos');
  }
}

if (fxToggleBtn) {
  fxToggleBtn.addEventListener('click', cycleCursorEffect);
}

// ===================================================================
// 3. GENERADOR DE CÓDIGO QR PROFESIONAL (INTERACTIVO)
// ===================================================================
const qrcodeContainer = document.getElementById('qrcodeContainer');
const qrCustomInput = document.getElementById('qrCustomInput');
const qrTabButtons = document.querySelectorAll('.qr-tab-btn');
const downloadQrBtn = document.getElementById('downloadQrBtn');
const copyQrLinkBtn = document.getElementById('copyQrLinkBtn');
const presentQrBtn = document.getElementById('presentQrBtn');

let currentQrData = window.location.href;
let activeQrMode = 'portfolio';

// Datos de vCard listos para escaneo directo a la agenda telefónica
const vCardData = `BEGIN:VCARD
VERSION:3.0
N:Braco Ruiz;Ismael;Jhostin;;
FN:Ismael Jhostin Braco Ruiz
TITLE:Practicante de Desarrollo de Software | Web & Backend
TEL;TYPE=CELL:+51952388325
EMAIL:ismaeljhostinbracoruiz@gmail.com
ADR;TYPE=HOME:;;Los Olivos;Lima;;Perú
ORG:SENATI - Ing. de Software con IA
NOTE:Portafolio: Desarrollador Backend PHP, Python, Java, Oracle Database y Cloudflare.
URL:${window.location.href}
END:VCARD`;

const contactDataMap = {
  portfolio: window.location.href.startsWith('file:') ? 'https://ismael-braco-portfolio.dev' : window.location.href,
  vcard: vCardData,
  whatsapp: 'https://wa.me/51952388325?text=Hola%20Ismael,%20vi%20tu%20portafolio%20profesional%20y%20me%20gustar%C3%ADa%20contactarte.',
  email: 'mailto:ismaeljhostinbracoruiz@gmail.com?subject=Contacto%20Laboral%20-%20Portafolio%20Ismael%20Braco'
};

function renderQRCode(text) {
  if (!qrcodeContainer) return;
  qrcodeContainer.innerHTML = '';

  const isLight = htmlElement.getAttribute('data-theme') === 'light';
  // Rojo vibrante o negro elegante para el código QR
  const darkColor = '#0f172a';
  const lightColor = '#ffffff';

  try {
    if (typeof QRCode !== 'undefined') {
      new QRCode(qrcodeContainer, {
        text: text,
        width: 200,
        height: 200,
        colorDark: darkColor,
        colorLight: lightColor,
        correctLevel: QRCode.CorrectLevel.M
      });
    } else {
      // Fallback seguro usando API de QR si la librería local tardara
      const encoded = encodeURIComponent(text);
      qrcodeContainer.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encoded}" alt="Código QR Profesional" style="width:200px; height:200px; display:block;" />`;
    }
  } catch (err) {
    console.error('Error generando QR:', err);
  }
}

function generateCurrentQR() {
  if (activeQrMode === 'custom' && qrCustomInput && qrCustomInput.value.trim() !== '') {
    currentQrData = qrCustomInput.value.trim();
  } else {
    currentQrData = contactDataMap[activeQrMode] || contactDataMap.portfolio;
    if (qrCustomInput) {
      qrCustomInput.value = (activeQrMode === 'vcard') ? 'Tarjeta de Contacto Completa (vCard)' : currentQrData;
    }
  }
  renderQRCode(currentQrData);
}

// Manejo de tabs de QR
qrTabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    qrTabButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeQrMode = btn.getAttribute('data-qr-mode');
    generateCurrentQR();
  });
});

if (qrCustomInput) {
  qrCustomInput.addEventListener('input', () => {
    activeQrMode = 'custom';
    qrTabButtons.forEach(b => b.classList.remove('active'));
    renderQRCode(qrCustomInput.value.trim() || 'https://ismael-braco.dev');
  });
}

// Descargar QR como imagen PNG
if (downloadQrBtn) {
  downloadQrBtn.addEventListener('click', () => {
    const canvas = qrcodeContainer.querySelector('canvas');
    const img = qrcodeContainer.querySelector('img');

    if (canvas) {
      const a = document.createElement('a');
      a.download = `QR-Ismael-Braco-${activeQrMode}.png`;
      a.href = canvas.toDataURL('image/png');
      a.click();
      showToast('📥 Código QR descargado exitosamente');
    } else if (img && img.src) {
      const a = document.createElement('a');
      a.download = `QR-Ismael-Braco-${activeQrMode}.png`;
      a.href = img.src;
      a.target = '_blank';
      a.click();
      showToast('📥 Guardando imagen QR');
    }
  });
}

// Copiar Enlace
if (copyQrLinkBtn) {
  copyQrLinkBtn.addEventListener('click', () => {
    const textToCopy = (activeQrMode === 'vcard') 
      ? `Ismael Jhostin Braco Ruiz - Cel: +51 952 388 325 - Correo: ismaeljhostinbracoruiz@gmail.com - Portafolio: ${window.location.href}` 
      : (qrCustomInput ? qrCustomInput.value : window.location.href);

    navigator.clipboard.writeText(textToCopy).then(() => {
      showToast('📋 Enlace / Datos copiados al portapapeles');
    }).catch(() => {
      showToast('⚠️ No se pudo copiar automáticamente');
    });
  });
}

// Modo Presentar QR (Abre modal en pantalla completa para que lo escaneen directo en el celular)
if (presentQrBtn) {
  presentQrBtn.addEventListener('click', () => {
    openQrFullscreenModal();
  });
}

function openQrFullscreenModal() {
  const modal = document.getElementById('qrModal');
  const targetContainer = document.getElementById('qrModalContainer');
  if (!modal || !targetContainer) return;

  targetContainer.innerHTML = '';
  if (typeof QRCode !== 'undefined') {
    new QRCode(targetContainer, {
      text: currentQrData,
      width: 260,
      height: 260,
      colorDark: '#0f172a',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.H
    });
  } else {
    targetContainer.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(currentQrData)}" alt="QR" />`;
  }
  modal.classList.add('active');
}

// ===================================================================
// 4. FILTRO DE PROYECTOS
// ===================================================================
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    const filterCategory = button.getAttribute('data-filter');

    projectCards.forEach(card => {
      const categories = card.getAttribute('data-categories') || '';
      if (filterCategory === 'all' || categories.includes(filterCategory)) {
        card.style.display = 'flex';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      } else {
        card.style.display = 'none';
        card.style.opacity = '0';
      }
    });
  });
});

// ===================================================================
// 5. VISTA PREVIA RÁPIDA DE PROYECTOS (MODAL)
// ===================================================================
const projectDetails = {
  neurolee: {
    title: 'Neurolee - Plataforma Educativa con Login Multi-Rol',
    url: 'https://neurolee.netlify.app/',
    category: 'Web App / Frontend & Auth',
    desc: 'Plataforma con interfaz gráfica sumamente llamativa y moderna, equipada con un sistema de login con roles diferenciados que permite ingresar como maestro o usuario alumno para acceder a materiales de lectura y herramientas dinámicas.',
    tech: ['HTML5', 'CSS3 Moderno', 'JavaScript', 'Auth Roles', 'Netlify'],
    features: [
      'Roles de acceso diferenciados (Maestro y Usuario Alumno)',
      'Diseño visual responsivo de alto impacto estético',
      'Panel educativo con navegación interactiva y módulos didácticos'
    ]
  },
  invoice: {
    title: 'Invoice Platform - Sistema de Facturación y Reportería',
    url: 'https://chimerical-valkyrie-fa5cbb.netlify.app/',
    category: 'FinTech / Web Application',
    desc: 'Plataforma de INVOICE encargada de la consulta, visualización y desglose de facturas electrónicas. Explica las funciones clave de la aplicación para el control financiero ágil.',
    tech: ['JavaScript', 'Facturación Web', 'UI Analytics', 'Netlify'],
    features: [
      'Visualización detallada de facturas y comprobantes',
      'Desglose analítico de totales, impuestos y conceptos',
      'Explicación guiada e intuitiva de los flujos de facturación'
    ]
  },
  firmadoc: {
    title: 'FirmaDoc / Firma Digital - Gestión Segura de Documentos',
    url: 'https://pcomedicalperu.com/firma-digital/panel_admin.php',
    category: 'Backend / LegalTech / PHP',
    desc: 'Plataforma web de firma digital desarrollada para permitir a los usuarios cargar documentos PDF, emitir enlaces seguros para firmantes y consultar el estado en tiempo real (pendiente o firmado) desde un completo panel de administración.',
    tech: ['PHP', 'MySQL', 'Procesamiento PDF', 'Panel Admin', 'Seguridad Web'],
    features: [
      'Carga y procesamiento de constancias y documentos en formato PDF',
      'Generación de enlaces únicos e intransferibles para firmantes',
      'Panel de control administrativo con auditoría de estados de firma'
    ]
  },
  reservas: {
    title: 'Sistema de Reservas Docentes - Sala en Línea Simultánea',
    url: 'https://reservas.isemperadorbr.workers.dev/',
    category: 'Cloud / Edge Computing / Cloudflare',
    desc: 'Plataforma de reservaciones para sala de profesores en línea. Desarrollada para permitir que múltiples usuarios reserven espacios y horarios de manera simultánea sin conflictos ni colisiones.',
    tech: ['Cloudflare Workers', 'Edge Computing', 'JavaScript', 'Concurrencia en Tiempo Real'],
    features: [
      'Gestión de cupos y horarios para salas docentes virtuales',
      'Atención de reservas simultáneas mediante arquitectura Serverless Edge',
      'Baja latencia y alta disponibilidad global garantizada por Cloudflare'
    ]
  },
  nexoCards: {
    title: 'NEXO Digital Cards - Tarjetas de Presentación con QR y Base de Datos',
    url: 'https://nexo-tarjetas-digitales.isemperadorbr.workers.dev/',
    category: 'Fullstack / Networking / Cloudflare',
    desc: 'Proyecto construido con base de datos para autenticación y login. Permite crear perfiles interactivos para que cualquier persona escanee el código QR con su celular y acceda instantáneamente a la tarjeta de presentación con descarga vCard y métricas.',
    tech: ['Cloudflare Workers', 'Base de Datos Relacional', 'Generación QR', 'Métricas de Escaneo'],
    features: [
      'Autenticación y registro de usuarios con base de datos',
      'Generación automática de códigos QR para cada tarjeta personal',
      'Métricas de escaneos y descargas de contacto en tiempo real'
    ]
  },
  nexoIperc: {
    title: 'NEXO SST - Plataforma de Automatización Matriz IPERC',
    url: 'https://31b001d9.nexo-sst-plataforma.pages.dev/',
    category: 'SafetyTech / Cloudflare Pages (En Desarrollo)',
    desc: 'Futura plataforma integral capaz de subir matrices IPERC (Identificación de Peligros, Evaluación de Riesgos y Control), automatizar procesos de validación, sugerir mejoras normativas y ofrecer asistencia inmediata ante incidentes o accidentes.',
    tech: ['Cloudflare Pages', 'Matriz IPERC', 'Automatización de Riesgos', 'En Desarrollo Activo'],
    features: [
      'Carga y análisis algorítmico de matrices IPERC industriales',
      'Automatización de sugerencias de mitigación y medidas de control',
      'Módulo de respuesta y protocolos de ayuda ante accidentes laborales'
    ]
  },
  mensajes: {
    title: 'Mensajes Masivos por Correo - Automatización Gmail & SMTP',
    url: 'https://mensajesmasivosporcorreo.netlify.app/',
    category: 'Automation / Productivity / Netlify',
    desc: 'Aplicación para despacho automatizado de correos masivos utilizando Gmail u otros proveedores SMTP, con plantillas de correo completamente customizables y variables dinámicas.',
    tech: ['JavaScript', 'Automatización Email', 'Gmail / SMTP Integration', 'Netlify'],
    features: [
      'Envío masivo con plantillas dinámicas y personalización de datos',
      'Compatibilidad con cuentas Gmail y plataformas de correo estándar',
      'Interfaz ágil para redacción, vista previa y control de envíos'
    ]
  },
  separadorCamas: {
    title: 'Separador Inteligente de Camas - Algoritmo Hospitalario de Triaje',
    url: 'https://separadorinteligente.netlify.app/',
    category: 'HealthTech / Algoritmos de Clasificación',
    desc: 'Plataforma para clasificación y asignación eficiente de camas hospitalarias mediante un sistema de puntaje algorítmico, detallando criterios médicos para optimizar la atención de pacientes.',
    tech: ['Algoritmos de Priorización', 'HealthTech', 'JavaScript', 'Netlify'],
    features: [
      'Clasificación automática de camas según puntajes de gravedad',
      'Optimización de recursos y reducción en tiempos de espera hospitalarios',
      'Guía explicativa de criterios y factores de asignación'
    ]
  }
};

const previewModal = document.getElementById('previewModal');
const previewModalTitle = document.getElementById('previewModalTitle');
const previewModalBody = document.getElementById('previewModalBody');
const previewModalExternalLink = document.getElementById('previewModalExternalLink');

function openProjectPreview(projectId) {
  const data = projectDetails[projectId];
  if (!data || !previewModal) return;

  previewModalTitle.innerHTML = `<i class="fa-solid fa-laptop-code"></i> ${data.title}`;
  previewModalExternalLink.href = data.url;

  const featuresList = data.features.map(f => `<li><i class="fa-solid fa-check" style="color:var(--accent-red); margin-right:8px;"></i>${f}</li>`).join('');
  const tagsHtml = data.tech.map(t => `<span class="project-tag">${t}</span>`).join('');

  previewModalBody.innerHTML = `
    <div style="display:flex; flex-direction:column; gap:1.2rem;">
      <div style="background:var(--bg-card); padding:1rem 1.2rem; border-radius:12px; border:1px solid var(--border-color); display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.5rem;">
        <div>
          <span style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase; font-weight:700;">Categoría</span>
          <div style="font-weight:700; color:var(--accent-red); font-size:0.92rem;">${data.category}</div>
        </div>
        <div style="font-family:monospace; font-size:0.8rem; background:rgba(0,0,0,0.3); padding:0.4rem 0.8rem; border-radius:6px; color:#38bdf8;">
          <i class="fa-solid fa-link"></i> ${data.url}
        </div>
      </div>

      <div>
        <h4 style="font-size:1rem; font-weight:700; margin-bottom:0.5rem; color:var(--text-primary);">Descripción Técnica</h4>
        <p style="color:var(--text-secondary); line-height:1.65; font-size:0.95rem;">${data.desc}</p>
      </div>

      <div>
        <h4 style="font-size:1rem; font-weight:700; margin-bottom:0.6rem; color:var(--text-primary);">Funcionalidades Destacadas</h4>
        <ul style="list-style:none; padding:0; display:flex; flex-direction:column; gap:0.5rem; font-size:0.9rem; color:var(--text-secondary);">
          ${featuresList}
        </ul>
      </div>

      <div>
        <h4 style="font-size:0.85rem; text-transform:uppercase; font-weight:700; color:var(--text-muted); margin-bottom:0.5rem;">Stack Tecnológico</h4>
        <div class="project-tags">
          ${tagsHtml}
        </div>
      </div>

      <div style="background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:12px; padding:1.2rem; text-align:center;">
        <p style="font-size:0.88rem; color:var(--text-secondary); margin-bottom:0.8rem;">
          Puedes abrir la plataforma en vivo directamente en una nueva pestaña:
        </p>
        <a href="${data.url}" target="_blank" rel="noopener noreferrer" class="btn-primary" style="display:inline-flex;">
          <i class="fa-solid fa-arrow-up-right-from-square"></i> Explorar Proyecto en Vivo
        </a>
      </div>
    </div>
  `;

  previewModal.classList.add('active');
}

// ===================================================================
// 6. MODAL Y DESCARGA DE CURRICULUM VITAE (CV)
// ===================================================================
const cvModal = document.getElementById('cvModal');
const openCvBtn = document.getElementById('openCvBtn');
const openCvBtnHero = document.getElementById('openCvBtnHero');
const printCvBtn = document.getElementById('printCvBtn');
const downloadCvHtmlBtn = document.getElementById('downloadCvHtmlBtn');

function openCvModal() {
  if (cvModal) {
    cvModal.classList.add('active');
  }
}

if (openCvBtn) openCvBtn.addEventListener('click', openCvModal);
if (openCvBtnHero) openCvBtnHero.addEventListener('click', openCvModal);

if (printCvBtn) {
  printCvBtn.addEventListener('click', () => {
    window.print();
  });
}

if (downloadCvHtmlBtn) {
  downloadCvHtmlBtn.addEventListener('click', () => {
    const cvElement = document.querySelector('.cv-document');
    if (!cvElement) return;

    const fullCvHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>CV - Ismael Jhostin Braco Ruiz</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.5; color: #1e293b; max-width: 800px; margin: 30px auto; padding: 20px; }
    h1 { margin: 0; color: #0f172a; font-size: 26px; }
    .subtitle { color: #dc2626; font-weight: bold; margin-top: 4px; font-size: 15px; }
    .contact { margin: 12px 0 20px; font-size: 13px; color: #475569; }
    h2 { font-size: 15px; border-bottom: 2px solid #dc2626; padding-bottom: 4px; margin-top: 20px; text-transform: uppercase; color: #0f172a; }
    p, li { font-size: 13.5px; color: #334155; }
    ul { padding-left: 20px; }
    .bold { font-weight: bold; color: #0f172a; }
  </style>
</head>
<body>
  ${cvElement.innerHTML}
</body>
</html>`;

    const blob = new Blob([fullCvHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'CV-Ismael-Jhostin-Braco-Ruiz.html';
    a.click();
    URL.revokeObjectURL(url);
    showToast('📄 CV descargado en formato HTML imprimible');
  });
}

// Cerrar cualquier modal al hacer clic en botón de cerrar o en el fondo
document.querySelectorAll('.modal-close-btn, .modal-backdrop').forEach(element => {
  element.addEventListener('click', (e) => {
    if (e.target === element || element.classList.contains('modal-close-btn')) {
      document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('active'));
    }
  });
});

// Cerrar modales con tecla Escape
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('active'));
  }
});

// ===================================================================
// 7. MENÚ MÓVIL Y TOAST NOTIFICACIONES
// ===================================================================
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');

if (mobileMenuBtn && navLinks) {
  mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('mobile-open');
    const isOpen = navLinks.classList.contains('mobile-open');
    mobileMenuBtn.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('mobile-open');
      mobileMenuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
    });
  });
}

// Toast flotante
const toastMsg = document.getElementById('toastMsg');
let toastTimeout;

function showToast(message) {
  if (!toastMsg) return;
  toastMsg.innerHTML = message;
  toastMsg.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toastMsg.classList.remove('show');
  }, 3200);
}

// Copiar datos de contacto al hacer clic
document.querySelectorAll('.copyable-contact').forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const val = item.getAttribute('data-copy-val');
    if (val) {
      navigator.clipboard.writeText(val).then(() => {
        showToast(`📋 Copiado: ${val}`);
      });
    }
  });
});

// Formulario de Mensaje Rápido
const contactForm = document.getElementById('quickContactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const senderName = document.getElementById('senderName')?.value || 'Contacto';
    const senderEmail = document.getElementById('senderEmail')?.value || '';
    const message = document.getElementById('senderMessage')?.value || '';

    const mailtoUrl = `mailto:ismaeljhostinbracoruiz@gmail.com?subject=Mensaje%20desde%20Portafolio%20-%20${encodeURIComponent(senderName)}&body=${encodeURIComponent(`De: ${senderName} (${senderEmail})\n\nMensaje:\n${message}`)}`;
    window.location.href = mailtoUrl;
    showToast('✉️ Abriendo tu cliente de correo para enviar mensaje');
  });
}

// Inicialización general
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  generateCurrentQR();
});
