
class ParticleSystem {
  constructor(containerSelector = 'body') {
    this.container = document.querySelector(containerSelector);
    if (!this.container) return;
    

    this.particlesContainer = document.createElement('div');
    this.particlesContainer.className = 'particles-container';
    this.container.insertBefore(this.particlesContainer, this.container.firstChild);
    
    this.particles = [];
    this.particleCount = 100;
    this.types = ['cyan', 'pink', 'cyan-large', 'pink-large', 'sparkle'];
    
    this.init();
    this.startAnimation();
  }

  init() {
    for (let i = 0; i < this.particleCount; i++) {
      this.createParticle();
    }
  }

  createParticle() {
    const particle = document.createElement('div');
    const type = this.types[Math.floor(Math.random() * this.types.length)];
    particle.className = `particle ${type}`;
    
    const startX = Math.random() * window.innerWidth;
    const duration = Math.random() * 10 + 8; 
    const delay = Math.random() * 5;
    const xOffset = (Math.random() - 0.5) * 200;
    
    particle.style.left = startX + 'px';
    particle.style.top = (window.innerHeight + 50) + 'px';
    particle.style.animation = `float ${duration}s linear ${delay}s infinite`;
    particle.style.setProperty('--translate-x', xOffset + 'px');
    
    this.particlesContainer.appendChild(particle);
    this.particles.push({ element: particle, duration, delay, xOffset });
  }

  startAnimation() {
    setInterval(() => {
      if (this.particles.length < this.particleCount) {
        this.createParticle();
      }
    }, 500);
  }

  destroy() {
    if (this.particlesContainer) {
      this.particlesContainer.remove();
    }
    this.particles = [];
  }
}


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ParticleSystem('body');
  });
} else {
  new ParticleSystem('body');
}


function logout() {
  fetch('/api/logout').then(() => {
    window.location.href = '/auth';
  });
}

async function checkAuth() {
  const res = await fetch('/api/user').then(r => r.json());
  
  const logoutBtn = document.getElementById('logout-btn');
  const adminLink = document.getElementById('admin-link');
  
  if (logoutBtn && adminLink) {
    if (res.user) {
      logoutBtn.style.display = 'block';
      adminLink.style.display = res.role === 'admin' ? 'inline' : 'none';
    } else {
      logoutBtn.style.display = 'none';
      adminLink.style.display = 'none';
    }
  }
  
  return res;
}


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', checkAuth);
} else {
  checkAuth();
}


document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});


const style = document.createElement('style');
style.textContent = `
  @keyframes float {
    0% {
      transform: translateY(0px) translateX(0px);
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    90% {
      opacity: 1;
    }
    100% {
      transform: translateY(-100vh) translateX(var(--translate-x, 100px));
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
