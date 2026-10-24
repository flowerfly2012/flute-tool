// Global State Variables
let selectedGroupIds = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
let targetMode = 'pair'; // 'pair', 'major_only', 'minor_only', 'random_single'
let practicedItemKeys = new Set();
let activePool = [];
let currentDrawnItem = null;
let isFlipped = false;
let isAnswerShown = false;

// DOM Elements
const modeSelect = document.getElementById('mode-select');
const keyCheckboxesGrid = document.getElementById('key-checkboxes-grid');
const activeFilterCountEl = document.getElementById('active-filter-count');
const cardInner = document.getElementById('card-inner');
const drawBtn = document.getElementById('draw-btn');
const toggleAnswerBtn = document.getElementById('toggle-answer-btn');
const markPracticedBtn = document.getElementById('mark-practiced-btn');
const resetPoolBtn = document.getElementById('reset-pool-btn');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const coverModeTag = document.getElementById('cover-mode-tag');

const historyModal = document.getElementById('history-modal');
const historyDrawer = document.getElementById('history-drawer');
const toggleHistoryBtn = document.getElementById('toggle-history-btn');
const closeHistoryBtn = document.getElementById('close-history-btn');
const historyList = document.getElementById('history-list');
const historyBadge = document.getElementById('history-badge');
const resetFilteredHistoryBtn = document.getElementById('reset-filtered-history-btn');
const resetAllHistoryBtn = document.getElementById('reset-all-history-btn');

const completionModal = document.getElementById('completion-modal');
const completionBox = document.getElementById('completion-box');
const restartGameBtn = document.getElementById('restart-game-btn');
const cardKeySigBadge = document.getElementById('card-key-sig-badge');

// Application Initialization
function initApp() {
    loadFromLocalStorage();
    renderKeyCheckboxes();
    updateActivePool();
    updateUIProgress();

    modeSelect.value = targetMode;
    modeSelect.addEventListener('change', (e) => {
        targetMode = e.target.value;
        updateCoverModeTag();
        updateActivePool();
        updateUIProgress();
        saveToLocalStorage();
        if (isFlipped) {
            cardInner.classList.remove('rotate-y-180');
            isFlipped = false;
        }
    });

    drawBtn.addEventListener('click', drawCard);
    toggleAnswerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleAnswerShow();
    });
    markPracticedBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        markCurrentCardPracticed();
    });

    resetPoolBtn.addEventListener('click', () => {
        if(confirm("確定要重設當前已勾選調性的練習紀錄嗎？")) {
            resetFilteredHistory();
        }
    });

    toggleHistoryBtn.addEventListener('click', openHistoryModal);
    closeHistoryBtn.addEventListener('click', closeHistoryModal);
    
    historyModal.addEventListener('click', (e) => {
        if (e.target === historyModal) closeHistoryModal();
    });

    resetFilteredHistoryBtn.addEventListener('click', () => {
        resetFilteredHistory();
        closeHistoryModal();
    });

    resetAllHistoryBtn.addEventListener('click', () => {
        resetAllHistory();
        closeHistoryModal();
    });

    restartGameBtn.addEventListener('click', () => {
        closeCompletionModal();
        resetFilteredHistory();
    });

    // Card Click Interaction
    cardInner.addEventListener('click', (e) => {
        if (e.target.closest('button')) return; 
        
        if (!isFlipped) {
            drawCard();
        } else {
            cardInner.classList.remove('rotate-y-180');
            isFlipped = false;
        }
    });

    updateCoverModeTag();
}

// Render 15 Key Checkboxes Grid
function renderKeyCheckboxes() {
    keyCheckboxesGrid.innerHTML = '';
    
    scaleData.forEach(group => {
        let labelText = '';
        if (group.sharps_count === 0 && group.flats_count === 0) {
            labelText = '0 自然 (C/a)';
        } else if (group.flats_count > 0) {
            labelText = `${group.flats_count}♭ (${group.major_key.german_name}/${group.minor_key.german_name})`;
        } else {
            labelText = `${group.sharps_count}♯ (${group.major_key.german_name}/${group.minor_key.german_name})`;
        }

        const isChecked = selectedGroupIds.has(group.group_id);

        const box = document.createElement('label');
        box.className = `flex items-center gap-1.5 px-2 py-1.5 rounded-xl border text-xs cursor-pointer transition select-none ${
            isChecked 
                ? 'bg-gold-500/15 border-gold-500/60 text-gold-200 font-bold shadow-md' 
                : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:border-slate-600'
        }`;
        
        box.innerHTML = `
            <input type="checkbox" value="${group.group_id}" ${isChecked ? 'checked' : ''} class="hidden">
            <i class="fa-solid ${isChecked ? 'fa-square-check text-gold-400' : 'fa-square text-slate-600'} text-sm"></i>
            <span class="truncate">${labelText}</span>
        `;

        box.querySelector('input').addEventListener('change', (e) => {
            const id = parseInt(e.target.value);
            if (e.target.checked) {
                selectedGroupIds.add(id);
            } else {
                selectedGroupIds.delete(id);
            }
            renderKeyCheckboxes();
            updateActivePool();
            updateUIProgress();
            saveToLocalStorage();
        });

        keyCheckboxesGrid.appendChild(box);
    });

    activeFilterCountEl.textContent = `已選取 ${selectedGroupIds.size} / 15 組別`;
}

// Quick Preset Selections
window.setPreset = function(type) {
    selectedGroupIds.clear();

    scaleData.forEach(g => {
        const count = g.sharps_count + g.flats_count;
        if (type === 'all') {
            selectedGroupIds.add(g.group_id);
        } else if (type === 'common' && count <= 3) {
            selectedGroupIds.add(g.group_id);
        } else if (type === 'advanced' && count >= 4) {
            selectedGroupIds.add(g.group_id);
        }
    });

    renderKeyCheckboxes();
    updateActivePool();
    updateUIProgress();
    saveToLocalStorage();
};

// Recalculate active pool
function updateActivePool() {
    activePool = [];
    const selectedGroups = scaleData.filter(g => selectedGroupIds.has(g.group_id));

    selectedGroups.forEach(group => {
        if (targetMode === 'pair') {
            const key = `${group.group_id}_pair`;
            if (!practicedItemKeys.has(key)) {
                activePool.push({ type: 'pair', group: group, key: key });
            }
        } else if (targetMode === 'major_only') {
            const key = `${group.group_id}_major`;
            if (!practicedItemKeys.has(key)) {
                activePool.push({ type: 'major', group: group, key: key });
            }
        } else if (targetMode === 'minor_only') {
            const key = `${group.group_id}_minor`;
            if (!practicedItemKeys.has(key)) {
                activePool.push({ type: 'minor', group: group, key: key });
            }
        } else if (targetMode === 'random_single') {
            const majorKey = `${group.group_id}_major`;
            const minorKey = `${group.group_id}_minor`;
            if (!practicedItemKeys.has(majorKey)) {
                activePool.push({ type: 'major', group: group, key: majorKey });
            }
            if (!practicedItemKeys.has(minorKey)) {
                activePool.push({ type: 'minor', group: group, key: minorKey });
            }
        }
    });
}

// Draw Card
function drawCard() {
    updateActivePool();

    if (selectedGroupIds.size === 0) {
        alert('請先在上方勾選至少一個欲練習的調號！');
        return;
    }

    if (activePool.length === 0) {
        showCompletionModal();
        return;
    }

    const randomIndex = Math.floor(Math.random() * activePool.length);
    currentDrawnItem = activePool[randomIndex];
    isAnswerShown = false; 

    renderCardContent(currentDrawnItem);

    if (isFlipped) {
        cardInner.classList.remove('rotate-y-180');
        isFlipped = false;
        setTimeout(() => {
            cardInner.classList.add('rotate-y-180');
            isFlipped = true;
        }, 200);
    } else {
        cardInner.classList.add('rotate-y-180');
        isFlipped = true;
    }
}

// Toggle Answer Display
function toggleAnswerShow() {
    if (!currentDrawnItem) return;
    isAnswerShown = !isAnswerShown;
    renderCardContent(currentDrawnItem);
}

// Render card details
function renderCardContent(item) {
    const g = item.group;
    document.getElementById('card-group-id').textContent = `Group ${String(g.group_id).padStart(2, '0')}`;
    
    cardKeySigBadge.textContent = g.key_signature;

    const stageBadge = document.getElementById('stage-badge');
    const container = document.getElementById('card-details-container');
    container.innerHTML = '';

    if (!isAnswerShown) {
        stageBadge.className = "px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold";
        stageBadge.innerHTML = `<i class="fa-solid"></i> 第一階段：調性背誦`;
        toggleAnswerBtn.innerHTML = `<i class="fa-solid fa-eye"></i> 顯示答案 / 升降與琶音`;

        let questionContent = '';
        if (item.type === 'pair') {
            questionContent = `
                <div class="flex flex-col gap-3 my-auto">
                    <div class="bg-slate-800/90 border-2 border-gold-400/80 rounded-2xl p-4 sm:p-5 text-center shadow-lg">
                        <span class="px-2.5 py-0.5 bg-gold-400/20 text-gold-300 font-bold text-xs rounded-md">大調 Major</span>
                        <h2 class="text-3xl sm:text-4xl font-black text-gold-300 font-serif mt-2">${g.major_key.name}</h2>
                        <p class="text-gold-200/80 text-sm font-semibold tracking-widest mt-1">(${g.major_key.german_name})</p>
                    </div>
                    <div class="bg-slate-800/90 border-2 border-indigo-400/80 rounded-2xl p-4 sm:p-5 text-center shadow-lg">
                        <span class="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 font-bold text-xs rounded-md">和聲小調 Harmonic Minor</span>
                        <h2 class="text-3xl sm:text-4xl font-black text-indigo-300 font-serif mt-2">${g.minor_key.name}</h2>
                        <p class="text-indigo-200/80 text-sm font-semibold tracking-widest mt-1">(${g.minor_key.german_name})</p>
                    </div>
                </div>
            `;
        } else if (item.type === 'major') {
            questionContent = `
                <div class="bg-slate-800/90 border-2 border-gold-400/80 rounded-2xl p-6 text-center shadow-lg my-auto">
                    <span class="px-3 py-1 bg-gold-400/20 text-gold-300 font-bold text-xs sm:text-sm rounded-md">大調 Major</span>
                    <h2 class="text-4xl sm:text-5xl font-black text-gold-300 font-serif mt-3">${g.major_key.name}</h2>
                    <p class="text-gold-200/80 text-base font-semibold tracking-widest mt-1">(${g.major_key.german_name})</p>
                </div>
            `;
        } else if (item.type === 'minor') {
            questionContent = `
                <div class="bg-slate-800/90 border-2 border-indigo-400/80 rounded-2xl p-6 text-center shadow-lg my-auto">
                    <span class="px-3 py-1 bg-indigo-500/20 text-indigo-300 font-bold text-xs sm:text-sm rounded-md">和聲小調 Harmonic Minor</span>
                    <h2 class="text-4xl sm:text-5xl font-black text-indigo-300 font-serif mt-3">${g.minor_key.name}</h2>
                    <p class="text-indigo-200/80 text-base font-semibold tracking-widest mt-1">(${g.minor_key.german_name})</p>
                </div>
            `;
        }
        container.innerHTML = questionContent;

    } else {
        stageBadge.className = "px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold";
        stageBadge.innerHTML = `<i class="fa-solid"></i> 第二階段：吹奏練習`;
        toggleAnswerBtn.innerHTML = `<i class="fa-solid fa-eye-slash"></i> 隱藏答案`;

        const majorHTML = `
            <div class="bg-slate-800/90 border-l-4 border-gold-400 rounded-2xl p-3.5 sm:p-4 shadow-lg flex flex-col justify-between">
                <div class="flex items-center justify-between border-b border-slate-700/60 pb-1.5 mb-2">
                    <span class="px-2 py-0.5 bg-gold-400/20 text-gold-300 font-extrabold text-xs rounded-md">
                        大調 Major Scale
                    </span>
                    <div class="text-right">
                        <span class="text-xl sm:text-2xl font-black text-gold-300 font-serif">${g.major_key.name}</span>
                        <span class="text-xs text-gold-200/70 font-mono ml-1">(${g.major_key.german_name})</span>
                    </div>
                </div>
                <div class="space-y-1.5 text-xs text-slate-200">
                    <div class="flex items-start"><span class="text-slate-400 w-16 flex-shrink-0 font-medium">調號變化:</span><span class="font-semibold text-amber-200">${g.major_key.alterations}</span></div>
                    <div class="flex items-start"><span class="text-slate-400 w-16 flex-shrink-0 font-medium">吹奏音域:</span><span class="font-bold text-emerald-300">${g.major_key.range}</span></div>
                    <div class="flex items-start"><span class="text-slate-400 w-16 flex-shrink-0 font-medium">琶音組成:</span><span class="font-extrabold text-gold-200 tracking-wide">${g.major_key.arpeggio}</span></div>
                </div>
            </div>
        `;

        const minorHTML = `
            <div class="bg-slate-800/90 border-l-4 border-indigo-400 rounded-2xl p-3.5 sm:p-4 shadow-lg flex flex-col justify-between">
                <div class="flex items-center justify-between border-b border-slate-700/60 pb-1.5 mb-2">
                    <span class="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 font-extrabold text-xs rounded-md">
                        和聲小調 Harmonic Minor
                    </span>
                    <div class="text-right">
                        <span class="text-xl sm:text-2xl font-black text-indigo-300 font-serif">${g.minor_key.name}</span>
                        <span class="text-xs text-indigo-200/70 font-mono ml-1">(${g.minor_key.german_name})</span>
                    </div>
                </div>
                <div class="space-y-1.5 text-xs text-slate-200">
                    <div class="flex items-start"><span class="text-slate-400 w-16 flex-shrink-0 font-medium">調號變化:</span><span class="font-semibold text-indigo-200">${g.minor_key.alterations}</span></div>
                    <div class="flex items-start"><span class="text-slate-400 w-16 flex-shrink-0 font-medium">吹奏音域:</span><span class="font-bold text-emerald-300">${g.minor_key.range}</span></div>
                    <div class="flex items-start"><span class="text-slate-400 w-16 flex-shrink-0 font-medium">琶音組成:</span><span class="font-extrabold text-indigo-200 tracking-wide">${g.minor_key.arpeggio}</span></div>
                </div>
            </div>
        `;

        if (item.type === 'pair') {
            container.innerHTML = majorHTML + minorHTML;
        } else if (item.type === 'major') {
            container.innerHTML = majorHTML;
        } else if (item.type === 'minor') {
            container.innerHTML = minorHTML;
        }
    }

    // Update practiced button status
    if (practicedItemKeys.has(item.key)) {
        markPracticedBtn.disabled = true;
        markPracticedBtn.className = "w-full sm:w-auto px-4 py-2 bg-slate-800 text-slate-400 rounded-xl font-bold border border-slate-700 cursor-not-allowed";
        markPracticedBtn.innerHTML = `<i class="fa-solid fa-check-double text-emerald-400"></i> 已完成練習`;
    } else {
        markPracticedBtn.disabled = false;
        markPracticedBtn.className = "w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition flex items-center justify-center gap-1.5 shadow-lg active:scale-95";
        markPracticedBtn.innerHTML = `<i class="fa-solid fa-circle-check"></i> 標記此卡已練習`;
    }
}

// Mark practiced
function markCurrentCardPracticed() {
    if (!currentDrawnItem) return;
    
    practicedItemKeys.add(currentDrawnItem.key);
    saveToLocalStorage();
    updateActivePool();
    updateUIProgress();

    markPracticedBtn.disabled = true;
    markPracticedBtn.className = "w-full sm:w-auto px-4 py-2 bg-slate-800 text-slate-400 rounded-xl font-bold border border-slate-700 cursor-not-allowed";
    markPracticedBtn.innerHTML = `<i class="fa-solid fa-check-double text-emerald-400"></i> 已完成練習`;

    if (activePool.length === 0) {
        setTimeout(() => {
            showCompletionModal();
        }, 400);
    }
}

// Update progress UI
function updateUIProgress() {
    let totalPossibleInFilter = 0;
    let totalPracticedInFilter = 0;

    const selectedGroups = scaleData.filter(g => selectedGroupIds.has(g.group_id));

    selectedGroups.forEach(group => {
        if (targetMode === 'pair') {
            totalPossibleInFilter += 1;
            if (practicedItemKeys.has(`${group.group_id}_pair`)) totalPracticedInFilter += 1;
        } else if (targetMode === 'major_only') {
            totalPossibleInFilter += 1;
            if (practicedItemKeys.has(`${group.group_id}_major`)) totalPracticedInFilter += 1;
        } else if (targetMode === 'minor_only') {
            totalPossibleInFilter += 1;
            if (practicedItemKeys.has(`${group.group_id}_minor`)) totalPracticedInFilter += 1;
        } else if (targetMode === 'random_single') {
            totalPossibleInFilter += 2;
            if (practicedItemKeys.has(`${group.group_id}_major`)) totalPracticedInFilter += 1;
            if (practicedItemKeys.has(`${group.group_id}_minor`)) totalPracticedInFilter += 1;
        }
    });

    const remainingInFilter = totalPossibleInFilter - totalPracticedInFilter;
    const percentage = totalPossibleInFilter > 0 ? (remainingInFilter / totalPossibleInFilter) * 100 : 0;

    progressText.textContent = `剩餘 ${remainingInFilter} / ${totalPossibleInFilter} 張卡片未練`;
    progressBar.style.width = `${percentage}%`;
    historyBadge.textContent = practicedItemKeys.size;
}

// Cover tag text
function updateCoverModeTag() {
    const map = {
        'pair': '模式：大小調雙卡一組',
        'major_only': '模式：僅練大調 (Major Only)',
        'minor_only': '模式：僅練小調 (Minor Only)',
        'random_single': '模式：隨機單一大小調'
    };
    coverModeTag.textContent = map[targetMode] || '長笛音階特訓';
}

// Reset history
function resetFilteredHistory() {
    const selectedGroups = scaleData.filter(g => selectedGroupIds.has(g.group_id));
    selectedGroups.forEach(g => {
        practicedItemKeys.delete(`${g.group_id}_pair`);
        practicedItemKeys.delete(`${g.group_id}_major`);
        practicedItemKeys.delete(`${g.group_id}_minor`);
    });

    saveToLocalStorage();
    updateActivePool();
    updateUIProgress();
    renderHistoryList();

    if (currentDrawnItem && !practicedItemKeys.has(currentDrawnItem.key)) {
        markPracticedBtn.disabled = false;
        markPracticedBtn.className = "w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition flex items-center justify-center gap-1.5 shadow-lg active:scale-95";
        markPracticedBtn.innerHTML = `<i class="fa-solid fa-circle-check"></i> 標記此卡已練習`;
    }
}

function resetAllHistory() {
    practicedItemKeys.clear();
    saveToLocalStorage();
    updateActivePool();
    updateUIProgress();
    renderHistoryList();

    if (currentDrawnItem) {
        markPracticedBtn.disabled = false;
        markPracticedBtn.className = "w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition flex items-center justify-center gap-1.5 shadow-lg active:scale-95";
        markPracticedBtn.innerHTML = `<i class="fa-solid fa-circle-check"></i> 標記此卡已練習`;
    }
}

// Render History Modal
function renderHistoryList() {
    historyList.innerHTML = '';
    const selectedGroups = scaleData.filter(g => selectedGroupIds.has(g.group_id));
    let hasAny = false;

    selectedGroups.forEach(g => {
        const isPairDone = practicedItemKeys.has(`${g.group_id}_pair`);
        const isMajorDone = practicedItemKeys.has(`${g.group_id}_major`);
        const isMinorDone = practicedItemKeys.has(`${g.group_id}_minor`);

        if (isPairDone || isMajorDone || isMinorDone) {
            hasAny = true;
            const card = document.createElement('div');
            card.className = 'bg-slate-800/80 border border-slate-700/80 rounded-xl p-2.5 text-xs flex items-center justify-between shadow-sm';
            
            let doneBadges = '';
            if (isPairDone) doneBadges += `<span class="px-2 py-0.5 bg-gold-500/20 text-gold-300 rounded border border-gold-500/30 font-bold">雙卡組 (${g.major_key.german_name}/${g.minor_key.german_name})</span> `;
            if (isMajorDone) doneBadges += `<span class="px-2 py-0.5 bg-gold-400/20 text-gold-300 rounded border border-gold-400/30">${g.major_key.name} (${g.major_key.german_name})</span> `;
            if (isMinorDone) doneBadges += `<span class="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30">${g.minor_key.name} (${g.minor_key.german_name})</span> `;

            card.innerHTML = `
                <div>
                    <div class="font-bold text-slate-200 mb-1">
                        Group ${String(g.group_id).padStart(2, '0')} (${g.key_signature})
                    </div>
                    <div class="flex flex-wrap gap-1">
                        ${doneBadges}
                    </div>
                </div>
                <button onclick="removeHistoryGroup(${g.group_id})" class="text-slate-500 hover:text-rose-400 p-1.5 transition" title="移除紀錄">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            `;
            historyList.appendChild(card);
        }
    });

    if (!hasAny) {
        historyList.innerHTML = `
            <div class="text-center py-10 text-slate-500 text-xs">
                <i class="fa-solid fa-box-open text-2xl mb-2 text-slate-600 block"></i>
                所選調性中尚無完成之卡片紀錄
            </div>
        `;
    }
}

window.removeHistoryGroup = function(groupId) {
    practicedItemKeys.delete(`${groupId}_pair`);
    practicedItemKeys.delete(`${groupId}_major`);
    practicedItemKeys.delete(`${groupId}_minor`);
    saveToLocalStorage();
    updateActivePool();
    updateUIProgress();
    renderHistoryList();

    if (currentDrawnItem && currentDrawnItem.group.group_id === groupId) {
        markPracticedBtn.disabled = false;
        markPracticedBtn.className = "w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition flex items-center justify-center gap-1.5 shadow-lg active:scale-95";
        markPracticedBtn.innerHTML = `<i class="fa-solid fa-circle-check"></i> 標記此卡已練習`;
    }
};

// Modal Controls
function openHistoryModal() {
    renderHistoryList();
    historyModal.classList.remove('opacity-0', 'pointer-events-none');
    historyDrawer.classList.remove('translate-x-full');
}

function closeHistoryModal() {
    historyDrawer.classList.add('translate-x-full');
    historyModal.classList.add('opacity-0', 'pointer-events-none');
}

function showCompletionModal() {
    const messages = [
        "辛苦了！練習永遠不會背叛你，每次吹奏都是累積🎵",
        "太棒了！音樂沒有捷徑，但努力的你正在發光🌟",
        "音樂的養分已悄悄累積！給堅持的自己一個掌聲👏"
    ];

    const randomMsg = messages[Math.floor(Math.random() * messages.length)];

    const completionText = completionBox.querySelector('p');
    if (completionText) {
        completionText.textContent = randomMsg;
    }

    completionModal.classList.remove('opacity-0', 'pointer-events-none');
    completionBox.classList.remove('scale-90');
    completionBox.classList.add('scale-100');
}

function closeCompletionModal() {
    completionBox.classList.remove('scale-100');
    completionBox.classList.add('scale-90');
    completionModal.classList.add('opacity-0', 'pointer-events-none');
}

// Local Storage
function saveToLocalStorage() {
    try {
        const data = {
            selectedGroupIds: Array.from(selectedGroupIds),
            targetMode: targetMode,
            practicedItemKeys: Array.from(practicedItemKeys)
        };
        localStorage.setItem('flute_scale_draw_game_data', JSON.stringify(data));
    } catch (e) {
        console.warn('LocalStorage save error:', e);
    }
}

function loadFromLocalStorage() {
    try {
        const raw = localStorage.getItem('flute_scale_draw_game_data');
        if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed.selectedGroupIds) selectedGroupIds = new Set(parsed.selectedGroupIds);
            if (parsed.targetMode) targetMode = parsed.targetMode;
            if (parsed.practicedItemKeys) practicedItemKeys = new Set(parsed.practicedItemKeys);
        }
    } catch (e) {
        console.warn('LocalStorage load error:', e);
    }
}

// Initialize application on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}