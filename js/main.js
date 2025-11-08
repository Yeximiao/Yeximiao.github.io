// ========================================
// 配置项
// ========================================
const CONFIG = {
    repositoryName: 'your-repository-name', // 替换为你的GitHub仓库名
    startTime: new Date("2024-12-14T13:00:00"),
    isGitHubPages: window.location.hostname.includes('github.io')
};

// ========================================
// 全局变量
// ========================================
let mottos = [];
let mottoIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;
let canScroll = true;
let isScrolling = false;
let settingsVisible = false;
let backgroundModeActive = false;
window.lastScrollY = 0;
window.scrollYDelta = 0;

// ========================================
// 星空生成
// ========================================
function createStars() {
    const starsContainer = document.querySelector('.stars');
    if (!starsContainer) return;
    
    const starCount = 150;
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        
        const size = Math.random() * 3;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.setProperty('--duration', `${Math.random() * 3 + 2}s`);
        star.style.setProperty('--delay', `${Math.random() * 5}s`);
        
        starsContainer.appendChild(star);
    }
}

// ========================================
// 座右铭加载
// ========================================
async function loadMottosFromFile() {
    try {
        const response = await fetch('mottos.txt');
        
        if (!response.ok) {
            throw new Error('文件加载失败');
        }
        
        const text = await response.text();
        return text.split('\n').filter(line => line.trim() !== '');
    } catch (error) {
        console.error('加载座右铭失败，使用默认数据:', error);
        return ["你好我是夜袭喵！"];
    }
}

// ========================================
// 打字机效果
// ========================================
function typeMotto() {
    const subtitle = document.getElementById('typing-subtitle');
    if (!subtitle || mottos.length === 0) return;
    
    const currentMotto = mottos[mottoIndex];
    
    if (isDeleting) {
        subtitle.textContent = currentMotto.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
    } else {
        subtitle.textContent = currentMotto.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = charIndex === currentMotto.length ? 1500 : 100;
    }
    
    if (isDeleting && charIndex === 0) {
        isDeleting = false;
        mottoIndex = (mottoIndex + 1) % mottos.length;
        typingSpeed = 500;
    } else if (!isDeleting && charIndex === currentMotto.length) {
        typingSpeed = 2000;
        isDeleting = true;
    }
    
    setTimeout(typeMotto, typingSpeed);
}

// ========================================
// 滚动到指定位置
// ========================================
function scrollToSection(sectionId) {
    if (isScrolling) return;
    isScrolling = true;
    
    const section = document.getElementById(sectionId);
    if (!section) {
        isScrolling = false;
        return;
    }
    
    window.scrollTo({
        top: section.offsetTop,
        behavior: 'smooth'
    });
    
    setTimeout(() => {
        isScrolling = false;
    }, 1000);
}

// ========================================
// 滚动事件处理
// ========================================
function handleScroll() {
    const logoSmall = document.querySelector('.logo-small');
    const scrollPosition = window.scrollY;
    const floatingButtons = document.getElementById('floating-buttons');
    const backgroundToggle = document.getElementById('background-toggle');
    const sideNav = document.getElementById('sideNav');
    
    window.scrollYDelta = scrollPosition - window.lastScrollY;
    window.lastScrollY = scrollPosition;
    
    if (scrollPosition === 0) {
        canScroll = true;
        if (settingsVisible) {
            closeSettings();
        }
    }
    
    // Logo显示控制
    if (scrollPosition > 50) {
        logoSmall.classList.add('visible');
    } else {
        logoSmall.classList.remove('visible');
    }
    
    // 浮动按钮在非首页时始终显示
    const homeSection = document.getElementById('home');
    const homeHeight = homeSection ? homeSection.offsetHeight : 0;
    
    if (scrollPosition > homeHeight * 0.3) {
        floatingButtons.classList.add('visible');
    } else {
        floatingButtons.classList.remove('visible');
    }
    
    // 侧边导航栏在非首页时显示
    if (scrollPosition > homeHeight * 0.5) {
        sideNav.classList.add('visible');
    } else {
        sideNav.classList.remove('visible');
    }
    
    // 更新侧边导航栏激活状态
    updateSideNavActive();
    
    // 背景欣赏按钮控制
    const profileSection = document.getElementById('profile');
    if (profileSection) {
        const profileOffset = profileSection.offsetTop;
        const windowHeight = window.innerHeight;
        
        if (settingsVisible && scrollPosition > profileOffset - windowHeight * 0.5) {
            backgroundToggle.classList.add('visible');
        } else {
            backgroundToggle.classList.remove('visible');
        }
    }
    
    // 更新分隔线进度
    updateDividerProgress();
    
    // 在个人简介页顶部向上滚动时，回到首页
    if (profileSection) {
        const profileTopThreshold = profileSection.offsetTop + 30;
        if (scrollPosition < profileTopThreshold && window.scrollYDelta < 0 && scrollPosition > homeHeight) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
}

// ========================================
// 更新分隔线进度
// ========================================
function updateDividerProgress() {
    const scrollPosition = window.scrollY;
    
    // 更新第一个分隔线(个人简介页)
    const profileSection = document.getElementById('profile');
    const dividerProgress = document.getElementById('divider-progress');
    
    if (profileSection && dividerProgress) {
        const profileOffset = profileSection.offsetTop;
        const profileHeight = profileSection.offsetHeight;
        const dividerContainers = document.querySelectorAll('.divider-container');
        
        if (dividerContainers.length > 0) {
            const dividerContainer = dividerContainers[0];
            const dividerOffset = profileOffset + dividerContainer.offsetTop;
            
            if (scrollPosition >= profileOffset && scrollPosition <= profileOffset + profileHeight) {
                const progressStart = profileOffset;
                const progressEnd = dividerOffset + dividerContainer.offsetHeight;
                const progressRange = progressEnd - progressStart;
                
                if (scrollPosition > progressStart && scrollPosition < progressEnd) {
                    const progress = (scrollPosition - progressStart) / progressRange;
                    dividerProgress.style.width = `${Math.min(100, progress * 100)}%`;
                } else if (scrollPosition >= progressEnd) {
                    dividerProgress.style.width = '100%';
                } else {
                    dividerProgress.style.width = '0%';
                }
            }
        }
    }
    
    // 更新第二个分隔线(我的装备页)
    const equipmentSection = document.getElementById('equipment');
    const dividerProgress2 = document.getElementById('divider-progress-2');
    
    if (equipmentSection && dividerProgress2) {
        const equipmentOffset = equipmentSection.offsetTop;
        const equipmentHeight = equipmentSection.offsetHeight;
        const dividerContainers = document.querySelectorAll('.divider-container');
        
        if (dividerContainers.length > 1) {
            const dividerContainer2 = dividerContainers[1];
            const dividerOffset2 = equipmentOffset + dividerContainer2.offsetTop;
            
            if (scrollPosition >= equipmentOffset && scrollPosition <= equipmentOffset + equipmentHeight) {
                const progressStart = equipmentOffset;
                const progressEnd = dividerOffset2 + dividerContainer2.offsetHeight;
                const progressRange = progressEnd - progressStart;
                
                if (scrollPosition > progressStart && scrollPosition < progressEnd) {
                    const progress = (scrollPosition - progressStart) / progressRange;
                    dividerProgress2.style.width = `${Math.min(100, progress * 100)}%`;
                } else if (scrollPosition >= progressEnd) {
                    dividerProgress2.style.width = '100%';
                } else {
                    dividerProgress2.style.width = '0%';
                }
            }
        }
    }
}

// ========================================
// 更新侧边导航栏激活状态
// ========================================
function updateSideNavActive() {
    const scrollPosition = window.scrollY + window.innerHeight / 3;
    const homeSection = document.getElementById('home');
    const profileSection = document.getElementById('profile');
    const equipmentSection = document.getElementById('equipment');
    const toolsSection = document.getElementById('tools');
    
    let currentSection = 'home';
    
    // 检查各个section
    if (homeSection && scrollPosition < homeSection.offsetHeight) {
        currentSection = 'home';
    } else if (profileSection && scrollPosition >= profileSection.offsetTop && 
               scrollPosition < profileSection.offsetTop + profileSection.offsetHeight) {
        currentSection = 'profile';
    } else if (equipmentSection && scrollPosition >= equipmentSection.offsetTop && 
               scrollPosition < equipmentSection.offsetTop + equipmentSection.offsetHeight) {
        currentSection = 'equipment';
    } else if (toolsSection && scrollPosition >= toolsSection.offsetTop) {
        currentSection = 'tools';
    }
    
    // 更新导航栏激活状态
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.section === currentSection) {
            item.classList.add('active');
        }
    });
}

// ========================================
// 背景欣赏模式切换
// ========================================
function toggleBackgroundMode() {
    backgroundModeActive = !backgroundModeActive;
    const backgroundToggle = document.getElementById('background-toggle');
    const backgroundHint = document.getElementById('background-hint');
    
    // 修改：保留左上角小标题，隐藏侧边导航栏和其他内容
    const elementsToHide = [
        document.querySelector('.content-box'),
        ...document.querySelectorAll('.divider-container'),
        ...document.querySelectorAll('.section-header'),
        document.querySelector('.equipment-wrapper'),
        document.querySelector('.tools-wrapper'),
        document.getElementById('floating-buttons'),
        document.querySelector('.site-footer-inline'),
        document.getElementById('sideNav')
    ].filter(el => el !== null);
    
    if (backgroundModeActive) {
        backgroundToggle.innerHTML = '<i class="fas fa-eye-slash"></i>';
        backgroundHint.classList.add('visible');
        elementsToHide.forEach(el => {
            el.classList.add('background-mode-hidden');
        });
        
        setTimeout(() => {
            backgroundHint.classList.remove('visible');
        }, 1000);
    } else {
        backgroundToggle.innerHTML = '<i class="fas fa-eye"></i>';
        backgroundHint.classList.remove('visible');
        elementsToHide.forEach(el => {
            el.classList.remove('background-mode-hidden');
        });
    }
    
    setTimeout(handleScroll, 100);
}

// ========================================
// 关闭设置
// ========================================
function closeSettings() {
    settingsVisible = false;
    const backgroundToggle = document.getElementById('background-toggle');
    const settingsBtn = document.getElementById('settings-btn');
    
    backgroundToggle.classList.remove('visible');
    settingsBtn.classList.remove('settings-btn');
    
    if (backgroundModeActive) {
        toggleBackgroundMode();
    }
}

// ========================================
// 更新时间
// ========================================
function updateTime() {
    const now = new Date();
    const beijingTime = new Date(now.getTime() + (8 * 60 * 60 * 1000));
    
    const year = beijingTime.getUTCFullYear();
    const month = String(beijingTime.getUTCMonth() + 1).padStart(2, '0');
    const day = String(beijingTime.getUTCDate()).padStart(2, '0');
    const hours = String(beijingTime.getUTCHours()).padStart(2, '0');
    const minutes = String(beijingTime.getUTCMinutes()).padStart(2, '0');
    const seconds = String(beijingTime.getUTCSeconds()).padStart(2, '0');
    
    const timeElement = document.getElementById('beijing-time');
    if (timeElement) {
        timeElement.innerHTML = `
            <span>${year}-${month}-${day} ${hours}:${minutes}:${seconds} (UTC+8)</span>
        `;
    }
    
    const startDate = CONFIG.startTime;
    const diff = now - startDate;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hoursDiff = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutesDiff = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secondsDiff = Math.floor((diff % (1000 * 60)) / 1000);
    
    const uptimeElement = document.getElementById('uptime');
    if (uptimeElement) {
        uptimeElement.textContent = `${days}天 ${hoursDiff}小时 ${minutesDiff}分 ${secondsDiff}秒`;
    }
}

// ========================================
// 加载备用图标
// ========================================
function loadFallbackFavicon() {
    const fallbackUrl = 'https://cdn.jsdelivr.net/gh/Yeximiao/image-repo@main/Yeximiao.github.io-web/favicon.ico';
    const favicon = document.getElementById('favicon');
    
    console.log('本地图标加载失败，切换到备用源');
    favicon.href = fallbackUrl + '?t=' + new Date().getTime();
    
    const status = document.getElementById('icon-status');
    if (status) {
        status.textContent = '使用备用图标';
        status.className = 'icon-status fallback';
        
        setTimeout(() => {
            status.style.opacity = '0';
        }, 5000);
    }
}

// ========================================
// 页面初始化
// ========================================
async function initPage() {
    // 创建星空
    createStars();
    
    // 加载座右铭
    mottos = await loadMottosFromFile();
    typeMotto();
    
    // 事件监听器
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    // Logo点击事件
    const logoSmall = document.querySelector('.logo-small');
    if (logoSmall) {
        logoSmall.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // 首页下滑箭头
    const scrollDown = document.getElementById('scroll-down');
    if (scrollDown) {
        scrollDown.addEventListener('click', function() {
            if (canScroll) {
                canScroll = false;
                scrollToSection('profile');
                setTimeout(() => { canScroll = true; }, 1500);
            }
        });
    }
    
    // 鼠标滚轮事件
    window.addEventListener('wheel', function(e) {
        const homeSection = document.getElementById('home');
        const homeHeight = homeSection ? homeSection.offsetHeight : 0;
        
        if (window.scrollY === 0 && e.deltaY > 0 && canScroll) {
            canScroll = false;
            scrollToSection('profile');
            setTimeout(() => { canScroll = true; }, 1500);
        }
    });
    
    // 返回顶部按钮
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        backToTop.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // 设置按钮
    const backgroundToggle = document.getElementById('background-toggle');
    const settingsBtn = document.getElementById('settings-btn');
    
    if (settingsBtn) {
        settingsBtn.addEventListener('click', function() {
            settingsVisible = !settingsVisible;
            
            if (settingsVisible) {
                backgroundToggle.classList.add('visible');
                settingsBtn.classList.add('settings-btn');
            } else {
                backgroundToggle.classList.remove('visible');
                settingsBtn.classList.remove('settings-btn');
            }
        });
    }
    
    if (backgroundToggle) {
        backgroundToggle.addEventListener('click', toggleBackgroundMode);
    }
    
    // ESC键退出背景欣赏模式
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && backgroundModeActive) {
            toggleBackgroundMode();
        }
    });
    
    // 图片错误处理
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            const src = this.src;
            const filename = src.split('/').pop().split('?')[0];
            this.src = `https://cdn.jsdelivr.net/gh/Yeximiao/image-repo@main/Yeximiao.github.io-web/${filename}?t=${new Date().getTime()}`;
            
            this.onerror = function() {
                this.alt = filename;
                this.src = '';
                this.style.backgroundColor = document.body.classList.contains('light-mode') ? '#eee' : '#333';
                this.style.display = 'flex';
                this.style.justifyContent = 'center';
                this.style.alignItems = 'center';
                this.style.color = document.body.classList.contains('light-mode') ? '#333' : '#fff';
                this.style.fontWeight = 'bold';
                this.innerHTML = filename.split('.')[0];
            };
        });
    });
    
    // 页面卡片点击事件
    document.querySelectorAll('.page-card').forEach(card => {
        card.addEventListener('click', function() {
            const pageName = this.dataset.page;
            window.location.href = `pages/${pageName}.html`;
        });
    });
    
    // 侧边导航栏点击事件
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            const sectionId = this.dataset.section;
            
            // 禁用滚动事件监听，避免冲突
            isScrolling = true;
            
            const section = document.getElementById(sectionId);
            if (section) {
                window.scrollTo({ 
                    top: section.offsetTop, 
                    behavior: 'smooth' 
                });
            }
            
            // 1秒后重新启用滚动检测
            setTimeout(() => {
                isScrolling = false;
            }, 1000);
        });
    });
    
    // 初始化时间
    updateTime();
    setInterval(updateTime, 1000);
    
    // 更新图标状态指示器
    const status = document.getElementById('icon-status');
    if (status) {
        setTimeout(() => {
            status.textContent = '使用本地图标';
            status.className = 'icon-status local';
            
            setTimeout(() => {
                status.style.opacity = '0';
            }, 1000);
        }, 1000);
    }
    
    // 加载 favicon(带备用源)
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) {
        const localFavicon = 'images/favicon.ico';
        const backupFavicon = 'https://cdn.jsdelivr.net/gh/Yeximiao/image-repo@main/Yeximiao.github.io-web/favicon.ico';

        const testFavicon = new Image();
        testFavicon.onerror = function() {
            favicon.href = backupFavicon;
        };
        testFavicon.src = localFavicon;
    }
}

// ========================================
// 页面加载完成后初始化
// ========================================
document.addEventListener('DOMContentLoaded', initPage);
