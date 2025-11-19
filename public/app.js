// App State
let stocks = [];
let settings = {
    apiEndpoint: 'http://localhost:8787',
    refreshInterval: 30
};
let refreshTimer = null;
let isDarkTheme = false;

// DOM Elements (will be initialized in init())
let stockInput, addBtn, watchlist, emptyState, themeToggle, themeIcon;
let settingsBtn, settingsModal, closeSettings, saveSettings, cancelSettings;
let apiEndpointInput, refreshIntervalInput, refreshBtn, lastUpdateSpan;
let toast, loadingOverlay, quickAddButtons;

// Initialize App
function init() {
    console.log('Initializing app...');

    // Get DOM elements
    stockInput = document.getElementById('stockInput');
    addBtn = document.getElementById('addBtn');
    watchlist = document.getElementById('watchlist');
    emptyState = document.getElementById('emptyState');
    themeToggle = document.getElementById('themeToggle');
    themeIcon = document.getElementById('themeIcon');
    settingsBtn = document.getElementById('settingsBtn');
    settingsModal = document.getElementById('settingsModal');
    closeSettings = document.getElementById('closeSettings');
    saveSettings = document.getElementById('saveSettings');
    cancelSettings = document.getElementById('cancelSettings');
    apiEndpointInput = document.getElementById('apiEndpoint');
    refreshIntervalInput = document.getElementById('refreshInterval');
    refreshBtn = document.getElementById('refreshBtn');
    lastUpdateSpan = document.getElementById('lastUpdate');
    toast = document.getElementById('toast');
    loadingOverlay = document.getElementById('loadingOverlay');
    quickAddButtons = document.querySelectorAll('.chip');

    console.log('DOM elements loaded:', {
        stockInput: !!stockInput,
        themeToggle: !!themeToggle,
        settingsBtn: !!settingsBtn
    });

    loadSettings();
    loadStocks();
    applyTheme();
    setupEventListeners();

    if (stocks.length > 0) {
        fetchAllStocks();
        startAutoRefresh();
    }

    console.log('App initialized successfully');
}

// Event Listeners
function setupEventListeners() {
    if (!addBtn || !themeToggle || !settingsBtn) {
        console.error('Required DOM elements not found!');
        return;
    }

    addBtn.addEventListener('click', handleAddStock);
    stockInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleAddStock();
    });

    themeToggle.addEventListener('click', toggleTheme);
    settingsBtn.addEventListener('click', openSettings);
    closeSettings.addEventListener('click', closeSettingsModal);
    cancelSettings.addEventListener('click', closeSettingsModal);
    saveSettings.addEventListener('click', handleSaveSettings);
    refreshBtn.addEventListener('click', () => fetchAllStocks());

    // Quick add buttons
    quickAddButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const code = btn.dataset.code;
            addStock(code);
        });
    });

    // Close modal on backdrop click
    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) closeSettingsModal();
    });

    console.log('Event listeners setup complete');
}

// Stock Management
function addStock(code) {
    const trimmedCode = code.trim().toUpperCase();

    if (!trimmedCode) {
        showToast('銘柄コードを入力してください', 'error');
        return;
    }

    if (stocks.includes(trimmedCode)) {
        showToast('この銘柄は既に追加されています', 'error');
        return;
    }

    stocks.push(trimmedCode);
    saveStocks();
    showToast(`${trimmedCode} を追加しました`, 'success');
    fetchAllStocks();

    if (stocks.length === 1) {
        startAutoRefresh();
    }
}

function handleAddStock() {
    const code = stockInput.value;
    addStock(code);
    stockInput.value = '';
}

function removeStock(code) {
    stocks = stocks.filter(s => s !== code);
    saveStocks();
    showToast(`${code} を削除しました`, 'success');
    renderStocks([]);

    if (stocks.length === 0) {
        stopAutoRefresh();
        emptyState.classList.remove('hidden');
    } else {
        fetchAllStocks();
    }
}

// Make removeStock available globally for onclick handlers
window.removeStock = removeStock;

// API Calls
async function fetchAllStocks() {
    if (stocks.length === 0) {
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');

    try {
        const codesParam = stocks.join(',');
        const url = `${settings.apiEndpoint}/?code=${encodeURIComponent(codesParam)}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        renderStocks(data);
        updateLastUpdateTime();

    } catch (error) {
        console.error('Error fetching stocks:', error);
        showToast('データの取得に失敗しました', 'error');
        renderStocks([]);
    }
}

// Rendering
function renderStocks(data) {
    watchlist.innerHTML = '';

    if (stocks.length === 0) {
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');

    stocks.forEach(code => {
        const stockData = data.find(d => d.code === code);
        const card = createStockCard(code, stockData);
        watchlist.appendChild(card);
    });
}

function createStockCard(code, stockData) {
    const card = document.createElement('div');
    card.className = 'stock-card';

    if (!stockData || stockData.error) {
        card.innerHTML = `
            <div class="card-header">
                <div class="stock-info">
                    <h3>${code}</h3>
                    <p class="stock-code">エラー</p>
                </div>
                <button class="remove-btn" onclick="removeStock('${code}')">✕</button>
            </div>
            <div class="price-section">
                <p style="color: var(--text-tertiary);">
                    ${stockData?.error || 'データを取得できませんでした'}
                </p>
            </div>
            <div class="card-footer">
                <span class="status-badge error">ERROR</span>
            </div>
        `;
        return card;
    }

    const data = stockData.data;
    const name = data.name || code;
    const price = data.price || '--';
    const priceChange = parseFloat(data.price_change) || 0;
    const priceChangeRate = parseFloat(data.price_change_rate) || 0;
    const updateTime = data.update_time || '--';
    const source = data.source || 'unknown';
    const status = data.status || 'OK';

    const isPositive = priceChange >= 0;
    const changeClass = isPositive ? 'positive' : 'negative';
    const changeSymbol = isPositive ? '▲' : '▼';

    card.innerHTML = `
        <div class="card-header">
            <div class="stock-info">
                <h3>${name}</h3>
                <p class="stock-code">${code}</p>
            </div>
            <button class="remove-btn" onclick="removeStock('${code}')">✕</button>
        </div>
        <div class="price-section">
            <div class="current-price">${formatNumber(price)}</div>
            <div class="price-change ${changeClass}">
                <span>${changeSymbol} ${formatNumber(Math.abs(priceChange))}</span>
                <span>(${formatPercentage(priceChangeRate)})</span>
            </div>
        </div>
        <div class="card-footer">
            <span class="status-badge ${status.toLowerCase()}">${source}</span>
            <span>${updateTime}</span>
        </div>
    `;

    return card;
}

// Utility Functions
function formatNumber(num) {
    if (typeof num === 'string') {
        // Remove commas and parse
        num = parseFloat(num.replace(/,/g, ''));
    }
    if (isNaN(num)) return '--';
    return num.toLocaleString('ja-JP', { maximumFractionDigits: 2 });
}

function formatPercentage(num) {
    if (typeof num === 'string') {
        num = parseFloat(num.replace(/%/g, ''));
    }
    if (isNaN(num)) return '--';
    const sign = num >= 0 ? '+' : '';
    return `${sign}${num.toFixed(2)}%`;
}

function updateLastUpdateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('ja-JP');
    lastUpdateSpan.textContent = `最終更新: ${timeString}`;
}

// Theme Management
function toggleTheme() {
    console.log('Toggle theme clicked');
    isDarkTheme = !isDarkTheme;
    applyTheme();
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
}

function applyTheme() {
    console.log('Applying theme:', isDarkTheme ? 'dark' : 'light');
    if (isDarkTheme) {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (themeIcon) themeIcon.textContent = '☀️';
    } else {
        document.documentElement.removeAttribute('data-theme');
        if (themeIcon) themeIcon.textContent = '🌙';
    }
}

// Settings Management
function openSettings() {
    apiEndpointInput.value = settings.apiEndpoint;
    refreshIntervalInput.value = settings.refreshInterval;
    settingsModal.classList.add('active');
}

function closeSettingsModal() {
    settingsModal.classList.remove('active');
}

function handleSaveSettings() {
    const newEndpoint = apiEndpointInput.value.trim();
    const newInterval = parseInt(refreshIntervalInput.value);

    if (!newEndpoint) {
        showToast('APIエンドポイントを入力してください', 'error');
        return;
    }

    if (newInterval < 10 || newInterval > 300) {
        showToast('更新間隔は10秒から300秒の間で設定してください', 'error');
        return;
    }

    settings.apiEndpoint = newEndpoint;
    settings.refreshInterval = newInterval;

    saveSettings();
    closeSettingsModal();
    showToast('設定を保存しました', 'success');

    // Restart auto-refresh with new interval
    if (stocks.length > 0) {
        stopAutoRefresh();
        startAutoRefresh();
        fetchAllStocks();
    }
}

// Auto-refresh
function startAutoRefresh() {
    stopAutoRefresh();
    refreshTimer = setInterval(() => {
        fetchAllStocks();
    }, settings.refreshInterval * 1000);
}

function stopAutoRefresh() {
    if (refreshTimer) {
        clearInterval(refreshTimer);
        refreshTimer = null;
    }
}

// Toast Notifications
function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = `toast show ${type}`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Local Storage
function saveStocks() {
    localStorage.setItem('stocks', JSON.stringify(stocks));
}

function loadStocks() {
    const saved = localStorage.getItem('stocks');
    if (saved) {
        stocks = JSON.parse(saved);
    }
}

function saveSettings() {
    localStorage.setItem('settings', JSON.stringify(settings));
}

function loadSettings() {
    const saved = localStorage.getItem('settings');
    if (saved) {
        settings = { ...settings, ...JSON.parse(saved) };
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        isDarkTheme = savedTheme === 'dark';
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
