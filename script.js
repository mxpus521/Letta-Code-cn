// ==================== 粒子背景系统 ====================
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particles-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.isHovering = false;
        
        this.init();
        this.animate();
        this.addEventListeners();
    }
    
    init() {
        this.resize();
        this.createParticles();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 15000);
        this.particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach((particle, index) => {
            // 更新位置
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // 边界检测
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.speedX *= -1;
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.speedY *= -1;
            }
            
            // 鼠标交互
            if (this.isHovering) {
                const dx = particle.x - this.mouseX;
                const dy = particle.y - this.mouseY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    const force = (150 - distance) / 150;
                    particle.x += (dx / distance) * force * 2;
                    particle.y += (dy / distance) * force * 2;
                }
            }
            
            // 绘制粒子
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(99, 102, 241, ${particle.opacity})`;
            this.ctx.fill();
            
            // 绘制连接线
            this.particles.slice(index + 1).forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(otherParticle.x, otherParticle.y);
                    this.ctx.strokeStyle = `rgba(99, 102, 241, ${0.2 * (1 - distance / 120)})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(() => this.animate());
    }
    
    addEventListeners() {
        window.addEventListener('resize', () => {
            this.resize();
            this.createParticles();
        });
        
        window.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            this.isHovering = true;
        });
        
        window.addEventListener('mouseout', () => {
            this.isHovering = false;
        });
    }
}

// ==================== 导航栏效果 ====================
class Navbar {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.logo = document.querySelector('.logo');
        this.mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.themeToggle = document.querySelector('.theme-toggle');
        this.isDark = localStorage.getItem('theme') === 'dark';
        
        this.init();
    }
    
    init() {
        // 初始化主题
        if (this.isDark) {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
        
        // 滚动效果
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
        });
        
        // 移动端菜单
        this.mobileMenuBtn.addEventListener('click', () => {
            this.toggleMobileMenu();
        });
        
        // 导航链接点击
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (this.navMenu.classList.contains('active')) {
                    this.toggleMobileMenu();
                }
            });
        });
        
        // 主题切换
        this.themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
        
        // 平滑滚动
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 100;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    toggleMobileMenu() {
        this.navMenu.classList.toggle('active');
        
        const spans = this.mobileMenuBtn.querySelectorAll('span');
        if (this.navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    }
    
    toggleTheme() {
        this.isDark = !this.isDark;
        document.documentElement.setAttribute('data-theme', this.isDark ? 'dark' : 'light');
        localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
    }
}

// ==================== 数字动画 ====================
class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('.stat-number');
        this.animated = false;
        
        this.init();
    }
    
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animated) {
                    this.animated = true;
                    this.counters.forEach(counter => {
                        this.animateCounter(counter);
                    });
                }
            });
        }, { threshold: 0.5 });
        
        this.counters.forEach(counter => {
            observer.observe(counter);
        });
    }
    
    animateCounter(counter) {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    }
}

// ==================== 页面元素动画 ====================
class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('.section, .comparison-card, .feature-card, .install-card, .advanced-card');
        
        this.init();
    }
    
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        
        this.elements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(element);
        });
    }
}

// ==================== 代码块复制功能 ====================
class CodeCopy {
    constructor() {
        this.codeBlocks = document.querySelectorAll('.code-block');
        this.copyButtons = document.querySelectorAll('.copy-btn');
        
        this.init();
    }
    
    init() {
        this.codeBlocks.forEach(block => {
            block.style.cursor = 'pointer';
            block.addEventListener('click', () => {
                const code = block.innerText.replace('$ ', '').trim();
                this.copyToClipboard(code);
            });
        });
        
        this.copyButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const code = button.parentElement.querySelector('code')?.textContent || 
                           button.parentElement.textContent.replace('复制', '').trim().replace('$ ', '').trim();
                this.copyToClipboard(code);
            });
        });
    }
    
    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showToast('已复制到剪贴板！');
        }).catch(err => {
            console.error('复制失败:', err);
        });
    }
    
    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
            color: white;
            padding: 1rem 2rem;
            border-radius: 1rem;
            box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
            z-index: 10000;
            animation: slideIn 0.3s ease;
            font-weight: 600;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 2000);
    }
}

// ==================== 回到顶部按钮 ====================
class BackToTop {
    constructor() {
        this.button = document.querySelector('.back-to-top');
        
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                this.button.classList.add('visible');
            } else {
                this.button.classList.remove('visible');
            }
        });
        
        this.button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ==================== 表格行高亮 ====================
class TableHighlight {
    constructor() {
        this.tables = document.querySelectorAll('.commands-table, .params-table');
        
        this.init();
    }
    
    init() {
        this.tables.forEach(table => {
            const rows = table.querySelectorAll('tbody tr');
            
            rows.forEach(row => {
                row.addEventListener('mouseenter', () => {
                    row.style.transform = 'scale(1.01)';
                    row.style.transition = 'transform 0.2s ease';
                });
                
                row.addEventListener('mouseleave', () => {
                    row.style.transform = 'scale(1)';
                });
            });
        });
    }
}

// ==================== 打字机效果 ====================
class Typewriter {
    constructor(element, text, speed = 100) {
        this.element = element;
        this.text = text;
        this.speed = speed;
        this.index = 0;
        
        this.type();
    }
    
    type() {
        if (this.index < this.text.length) {
            this.element.textContent += this.text.charAt(this.index);
            this.index++;
            setTimeout(() => this.type(), this.speed);
        }
    }
}

// ==================== 性能优化：节流函数 ====================
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ==================== 性能优化：防抖函数 ====================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ==================== 添加 CSS 动画 ====================
function addAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .toast {
            animation: slideIn 0.3s ease;
        }
    `;
    document.head.appendChild(style);
}

// ==================== 全局复制函数 ====================
window.copyToClipboard = function(text) {
    navigator.clipboard.writeText(text).then(() => {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = '已复制到剪贴板！';
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
            color: white;
            padding: 1rem 2rem;
            border-radius: 1rem;
            box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
            z-index: 10000;
            animation: slideIn 0.3s ease;
            font-weight: 600;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 2000);
    }).catch(err => {
        console.error('复制失败:', err);
    });
};

// ==================== 初始化所有功能 ====================
document.addEventListener('DOMContentLoaded', () => {
    // 初始化粒子系统
    new ParticleSystem();
    
    // 初始化导航栏
    new Navbar();
    
    // 初始化数字动画
    new CounterAnimation();
    
    // 初始化滚动动画
    new ScrollAnimations();
    
    // 初始化代码复制
    new CodeCopy();
    
    // 初始化回到顶部
    new BackToTop();
    
    // 初始化表格高亮
    new TableHighlight();
    
    // 添加动画样式
    addAnimations();
    
    // 控制台欢迎信息
    console.log('%c🚀 Letta Code', 'background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%); color: white; padding: 10px 20px; border-radius: 10px; font-size: 20px; font-weight: bold;');
    console.log('%c记忆优先的编码 Agent 工具', 'color: #6366f1; font-size: 14px; font-weight: 600;');
    console.log('%c欢迎访问 Letta Code 中文文档！', 'color: #10b981; font-size: 12px;');
});

// ==================== 页面可见性 API ====================
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('页面已隐藏');
    } else {
        console.log('页面已显示');
    }
});

// ==================== 页面加载性能监控 ====================
window.addEventListener('load', () => {
    const perfData = performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    console.log(`⚡ 页面加载时间: ${pageLoadTime}ms`);
});

// ==================== 错误处理 ====================
window.addEventListener('error', (e) => {
    console.error('发生错误:', e.error);
});

// ==================== 导出模块 ====================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        throttle,
        debounce,
        ParticleSystem,
        Navbar,
        CounterAnimation,
        ScrollAnimations,
        CodeCopy,
        BackToTop,
        TableHighlight
    };
}
