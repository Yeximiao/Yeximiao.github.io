// 设置网站开始时间
const startTime = new Date("2024-12-14T13:00:00");

// 动态设置图片路径（修复GitHub Pages路径问题）
const isGitHubPages = window.location.hostname.includes('github.io');
const repositoryName = 'your-repository-name'; // 替换为你的仓库名

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
const imageBackup = document.getElementById('imageBackup');
const avatarImg = document.getElementById('avatarImg');
const avatarLoading = document.getElementById('avatarLoading');

// 图片基础路径和备用源
const localImagePath = isGitHubPages 
    ? `/${repositoryName}/images/` 
    : 'images/';
    
const backupImageBase = 'https://cdn.jsdelivr.net/gh/Yeximiao/image-repo@main/Yeximiao.github.io-web/';

// 图片资源
const imageResources = {
    avatar: 'avatar1.jpg',
    background: 'background1.jpg'
};

// 缓存控制变量
let cacheBuster = new Date().getTime();

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
let resistanceThreshold = 120; // 缩小20%
let resistanceProgress = 0;

function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const resistanceZone = document.querySelector('.resistance-zone');
    const resistanceZoneTop = resistanceZone.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    
    resistanceProgress = 1 - Math.max(0, Math.min(1, resistanceZoneTop / windowHeight));
    resistanceBar.style.setProperty('--progress', resistanceProgress * 100 + '%');
    
    if (resistanceZoneTop < windowHeight && resistanceZoneTop > 0) {
        resistanceActive = true;
        resistanceHint.style.opacity = '1';
        
        const scrollDelta = scrollTop - lastScrollTop;
        if (scrollDelta > 0) {
            window.scrollBy(0, -scrollDelta * (1 - resistanceProgress));
        }
    } else {
        resistanceActive = false;
        resistanceHint.style.opacity = '0';
    }
    
    if (scrollTop > resistanceZone.offsetTop - windowHeight/2) {
        navButtons.style.opacity = '1';
    } else {
        navButtons.style.opacity = '0';
    }
    
    lastScrollTop = scrollTop;
}

// 加载图片函数（带缓存清除功能）
function loadImage(element, imageType, isBackground = false) {
    const filename = imageResources[imageType];
    const localPath = localImagePath + filename + `?_=${cacheBuster}`;
    const backupPath = backupImageBase + filename + `?_=${cacheBuster}`;
    
    // 显示加载状态（仅头像）
    if (imageType === 'avatar') {
        avatarLoading.style.display = 'block';
    }
    
    // 创建测试图片
    const testImage = new Image();
    
    testImage.onload = function() {
        if (isBackground) {
            backgroundEffects.style.backgroundImage = `url('${localPath}'), linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)`;
        } else {
            element.src = localPath;
        }
        if (imageType === 'avatar') {
            avatarLoading.style.display = 'none';
        }
    };
    
    testImage.onerror = function() {
        // 尝试备用源
        const backupTest = new Image();
        backupTest.onload = function() {
            if (isBackground) {
                backgroundEffects.style.backgroundImage = `url('${backupPath}'), linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)`;
            } else {
                element.src = backupPath;
            }
            showBackupNotice(`使用备用${imageType === 'avatar' ? '头像' : '背景'}图片`);
            if (imageType === 'avatar') {
                avatarLoading.style.display = 'none';
            }
        };
        
        backupTest.onerror = function() {
            // 使用最后备方案
            if (isBackground) {
                backgroundEffects.style.backgroundImage = 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)';
                showErrorNotice('背景图片加载失败');
            } else {
                element.src = 'https://cdn.pixabay.com/photo/2019/11/09/20/57/german-shepherd-4614451_1280.jpg';
                showBackupNotice('使用默认头像图片');
                avatarLoading.style.display = 'none';
            }
        };
        
        backupTest.src = backupPath;
    };
    
    testImage.src = localPath;
}

// 显示备份提示
function showBackupNotice(message) {
    imageBackup.innerHTML = `<i class="fas fa-info-circle"></i> ${message}`;
    imageBackup.style.display = 'block';
    setTimeout(() => {
        imageBackup.style.display = 'none';
    }, 3000);
}

// 显示错误提示
function showErrorNotice(message) {
    imageError.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
    imageError.style.display = 'block';
    setTimeout(() => {
        imageError.style.display = 'none';
    }, 5000);
}

// 初始化页面
function initPage() {
    // 设置时间更新
    updateTime();
    setInterval(updateTime, 1000);
    
    // 设置图片
    loadImage(avatarImg, 'avatar');
    loadImage(null, 'background', true);
    
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
            const offsetX = (x * 24 - 12) * (index + 1); // 缩小20%
            const offsetY = (y * 24 - 12) * (index + 1); // 缩小20%
            circle.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        });
    });
    
    // 初始阻力条宽度
    resistanceBar.style.setProperty('--progress', '0%');
    
    // 隐藏加载状态
    setTimeout(() => {
        loading.style.opacity = '0';
        loading.style.visibility = 'hidden';
    }, 1500);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initPage);
