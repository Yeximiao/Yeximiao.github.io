// 设置网站开始时间
const startTime = new Date("2024-12-14T13:00:00");

// DOM元素引用
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('website-duration');
const resistanceBar = document.querySelector('.resistance-bar');
const toTopBtn = document.getElementById('toTopBtn');
const toBottomBtn = document.getElementById('toBottomBtn');
const resistanceHint = document.querySelector('.resistance-hint');
const navButtons = document.getElementById('navButtons');
const loading = document.getElementById('loading');
const backgroundEffects = document.getElementById('backgroundEffects');
const imageError = document.getElementById('imageError');

// 更新网站存在时间
function updateTime() {
    const currentTime = new Date();
    const duration = Math.floor((currentTime - startTime) / 1000);
    const days = Math.floor(duration / (3600 * 24));
    const hours = Math.floor((duration % (3600 * 24)) / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;
    
    currentTimeEl.textContent = currentTime.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
    
    durationEl.textContent = `${days}天 ${hours}小时 ${minutes}分 ${seconds}秒`;
}

// 阻力效果实现
let lastScrollTop = 0;
let resistanceActive = false;
let resistanceThreshold = 150; // 阻力生效的滚动阈值
let resistanceProgress = 0;

function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const resistanceZone = document.querySelector('.resistance-zone');
    const resistanceZoneTop = resistanceZone.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    
    // 计算阻力进度（当阻力区域在视口底部时进度为0，在顶部时进度为100%）
    resistanceProgress = 1 - Math.max(0, Math.min(1, resistanceZoneTop / windowHeight));
    
    // 更新阻力条
    resistanceBar.style.setProperty('--progress', resistanceProgress * 100 + '%');
    
    // 当阻力区域进入视口时激活阻力效果
    if (resistanceZoneTop < windowHeight && resistanceZoneTop > 0) {
        resistanceActive = true;
        resistanceHint.style.opacity = '1';
        
        // 计算滚动阻力
        const scrollDelta = scrollTop - lastScrollTop;
        
        if (scrollDelta > 0) { // 向下滚动
            // 应用阻力效果
            window.scrollBy(0, -scrollDelta * (1 - resistanceProgress));
        }
    } else {
        resistanceActive = false;
        resistanceHint.style.opacity = '0';
    }
    
    // 控制导航按钮显示
    if (scrollTop > resistanceZone.offsetTop - windowHeight/2) {
        navButtons.style.opacity = '1';
    } else {
        navButtons.style.opacity = '0';
    }
    
    lastScrollTop = scrollTop;
}

// 检查背景图加载状态
function checkBackgroundImage() {
    const img = new Image();
    img.src = 'images/background1.jpg';
    
    img.onload = function() {
        // 图片加载成功
        console.log('背景图加载成功');
        loading.style.opacity = '0';
        loading.style.visibility = 'hidden';
    };
    
    img.onerror = function() {
        // 图片加载失败
        console.error('背景图加载失败');
        imageError.style.display = 'block';
        backgroundEffects.style.background = 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)';
        
        // 3秒后隐藏错误提示
        setTimeout(() => {
            imageError.style.display = 'none';
            loading.style.opacity = '0';
            loading.style.visibility = 'hidden';
        }, 3000);
    };
}

// 初始化页面
function initPage() {
    // 设置时间更新
    updateTime();
    setInterval(updateTime, 1000);
    
    // 事件监听器
    window.addEventListener('scroll', handleScroll);
    
    // 导航按钮功能
    toTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    toBottomBtn.addEventListener('click', () => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });
    
    // 鼠标移动背景效果
    document.addEventListener('mousemove', (e) => {
        const circles = document.querySelectorAll('.circle');
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        circles.forEach((circle, index) => {
            const offsetX = (x * 30 - 15) * (index + 1);
            const offsetY = (y * 30 - 15) * (index + 1);
            circle.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        });
    });
    
    // 初始阻力条宽度
    resistanceBar.style.setProperty('--progress', '0%');
    
    // 检查背景图加载状态
    checkBackgroundImage();
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initPage);