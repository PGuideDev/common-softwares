// 软件数据
let softwareData = {};

// 从JSON文件加载数据
async function loadSoftwareData() {
    try {
        const response = await fetch('software-data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        softwareData = await response.json();
    } catch (error) {
        console.error('Error loading software data:', error);
    }
}

// 打开模态框
function openModal(software) {
    const modal = document.getElementById('modalOverlay');
    const data = softwareData[software];

    if (data) {
        // 更新模态框内容
        document.getElementById('modalTitle').textContent = data.name;
        document.getElementById('modalIcon').innerHTML = `<img src="${data.icon}" alt="${data.name}" />`;
        document.getElementById('modalName').textContent = data.name;
        document.getElementById('modalTag').textContent = data.tag;
        document.getElementById('modalDescription').textContent = data.description;
        document.getElementById('modalVersion').textContent = data.version;
        document.getElementById('modalSize').textContent = data.size;
        document.getElementById('modalSystem').textContent = data.system;
        document.getElementById('modalWebsite').innerHTML = `<a href="${data.website}" target="_blank" style="color: #60a5fa; text-decoration: none;">访问官网</a>`;

        // 显示模态框
        modal.classList.add('active');
    }
}

// 关闭模态框
function closeModal() {
    const modal = document.getElementById('modalOverlay');
    modal.classList.remove('active');
}

// 初始化事件监听器
function initEventListeners() {
    // 点击卡片打开模态框
    document.querySelectorAll('.icon-card').forEach(card => {
        card.addEventListener('click', function () {
            const software = this.getAttribute('data-software');
            openModal(software);
        });
    });

    // 点击遮罩层关闭模态框
    document.getElementById('modalOverlay').addEventListener('click', function (e) {
        if (e.target === this) {
            closeModal();
        }
    });

    // ESC 键关闭模态框
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    // 搜索功能
    document.querySelector('.search-input')?.addEventListener('input', function (e) {
        const searchTerm = e.target.value.toLowerCase();
        const cards = document.querySelectorAll('.icon-card');

        cards.forEach(card => {
            const name = card.querySelector('.icon-name').textContent.toLowerCase();
            if (name.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });

    // 分类切换功能
    const tabs = document.querySelectorAll('.category-tab');
    const cards = document.querySelectorAll('.icon-card');

    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            // 移除所有标签的active类
            tabs.forEach(t => t.classList.remove('active'));
            // 添加当前标签的active类
            this.classList.add('active');

            const category = this.getAttribute('data-category');

            // 显示/隐藏软件卡片
            cards.forEach(card => {
                if (category === 'all') {
                    card.style.display = 'block';
                } else {
                    if (card.getAttribute('data-category') === category) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
    });
}

// 初始化
async function init() {
    await loadSoftwareData();
    initEventListeners();
    initGalaxy();
}

// 启动应用
init(); 