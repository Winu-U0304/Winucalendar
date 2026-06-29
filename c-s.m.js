// --- 1. 🔑 ログイン・ログアウト ＆ データ復元 ---
loginBtn.addEventListener("click", () => {
    const key = loginKeyInput.value.trim();
    if (!key) { loginError.textContent = "秘密のキーを入力してください。"; return; }
    currentLogedInUser = key;
    currentUserSpan.textContent = key;
    loginError.textContent = "";

    localStorage.setItem("cal_auto_login_key", key);

    const saved = localStorage.getItem(`cal_premium_${currentLogedInUser}`);// --- 1. 🔑 ログイン・ログアウト ＆ データ復元 ---
loginBtn.addEventListener("click", () => {
    const key = loginKeyInput.value.trim();
    if (!key) { loginError.textContent = "秘密のキーを入力してください。"; return; }
    currentLogedInUser = key;
    currentUserSpan.textContent = key;
    loginError.textContent = "";

    localStorage.setItem("cal_auto_login_key", key);

    const saved = localStorage.getItem(`cal_premium_${currentLogedInUser}`);
    userNotesData = saved ? JSON.parse(saved) : { diary: {}, todo: {}, schedule: {}, folders: [] };
    
    // データ構造の安全な初期化
    if (!userNotesData.schedule) userNotesData.schedule = {};
    if (!userNotesData.folders || userNotesData.folders.length === 0) {
        userNotesData.folders = [
            { id: "f_default", name: "メモ", notes: [{ id: "n_default", title: "最初のメモ", body: "ここに内容を入力できます。", updated: Date.now() }] }
        ];
    }

    loginSection.classList.add("hidden");
    mainSection.classList.remove("hidden");
    targetCurrentDate = new Date();
    
    renderCalendarGrid();
    renderFolders();
    renderNotesList();
    loadCurrentNote();
});

setTimeout(() => {
    const autoKey = localStorage.getItem("cal_auto_login_key");
    if (autoKey && loginKeyInput && loginBtn) {
        loginKeyInput.value = autoKey;
        loginBtn.click();
    }
}, 50);

logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("cal_auto_login_key");
    currentLogedInUser = ""; 
    loginKeyInput.value = ""; 
    mainSection.classList.add("hidden"); 
    loginSection.classList.remove("hidden");
});

// --- 2. 🎛️ タブ切り替え ＆ 滑らかスライドアニメーション ---
tabCalendarBtn.addEventListener("click", () => {
    tabCalendarBtn.classList.add("active");
    tabNotesBtn.classList.remove("active");
    slideContainer.style.transform = "translateX(0%)";
});

tabNotesBtn.addEventListener("click", () => {
    tabNotesBtn.classList.add("active");
    tabCalendarBtn.classList.remove("active");
    slideContainer.style.transform = "translateX(-50%)";
});

// --- 3. 📅 カレンダー月切り替え ＆ 日記・予定自動保存 ---
prevMonthBtn.addEventListener("click", () => {
    targetCurrentDate.setMonth(targetCurrentDate.getMonth() - 1); renderCalendarGrid();
});
nextMonthBtn.addEventListener("click", () => {
    targetCurrentDate.setMonth(targetCurrentDate.getMonth() + 1); renderCalendarGrid();
});

diaryInput.addEventListener("input", () => {
    if (!selectedDateKey || !currentLogedInUser) return;
    if (!userNotesData.diary) userNotesData.diary = {};
    userNotesData.diary[selectedDateKey] = diaryInput.value;
    saveToLocalStorage();
});

memoInput.addEventListener("input", () => {
    if (!selectedDateKey || !currentLogedInUser) return;
    if (!userNotesData.todo) userNotesData.todo = {};
    userNotesData.todo[selectedDateKey] = memoInput.value;
    saveToLocalStorage();
});

// 🌟【新設】予定入力欄のリアルタイム全自動保存処理
if (scheduleInput) {
    scheduleInput.addEventListener("input", () => {
        if (!selectedDateKey || !currentLogedInUser) return;
        if (!userNotesData.schedule) userNotesData.schedule = {};
        userNotesData.schedule[selectedDateKey] = scheduleInput.value;
        saveToLocalStorage();
    });
}

function saveToLocalStorage() {
    localStorage.setItem(`cal_premium_${currentLogedInUser}`, JSON.stringify(userNotesData));
}

backModalBtn.addEventListener("click", () => {
    memoModal.classList.add("hidden"); renderCalendarGrid();
});

// --- 4. 📂 📝 iPhone風メモ帳：操作＆リアルタイム自動保存イベント ---
addFolderBtn.addEventListener("click", () => {
    const fName = prompt("新しいフォルダ名を入力してください：");
    if (!fName || !fName.trim()) return;
    const newFolder = { id: "f_" + Date.now(), name: fName.trim(), notes: [] };
    userNotesData.folders.push(newFolder);
    currentFolderId = newFolder.id;
    currentNoteId = "";
    saveToLocalStorage(); renderFolders(); renderNotesList(); loadCurrentNote();
});

addNoteBtn.addEventListener("click", () => {
    const activeFolder = userNotesData.folders.find(f => f.id === currentFolderId);
    if (!activeFolder) return;
    const newNote = { id: "n_" + Date.now(), title: "", body: "", updated: Date.now() };
    activeFolder.notes.push(newNote);
    currentNoteId = newNote.id;
    saveToLocalStorage(); renderNotesList(); loadCurrentNote();
    if (window.innerWidth <= 768) { notesAppWrapper.className = "notes-app-wrapper view-editor"; }
});

noteTitleInput.addEventListener("input", () => {
    const activeFolder = userNotesData.folders.find(f => f.id === currentFolderId);
    if (!activeFolder || !currentNoteId) return;
    const activeNote = activeFolder.notes.find(n => n.id === currentNoteId);
    if (!activeNote) return;
    activeNote.title = noteTitleInput.value;
    activeNote.updated = Date.now();
    noteSavedStatus.textContent = "保存中...";
    saveToLocalStorage();
    renderNotesList();
    setTimeout(() => { noteSavedStatus.textContent = "自動保存済"; }, 300);
});

noteBodyInput.addEventListener("input", () => {
    const activeFolder = userNotesData.folders.find(f => f.id === currentFolderId);
    if (!activeFolder || !currentNoteId) return;
    const activeNote = activeFolder.notes.find(n => n.id === currentNoteId);
    if (!activeNote) return;
    activeNote.body = noteBodyInput.value;
    activeNote.updated = Date.now();
    noteSavedStatus.textContent = "保存中...";
    saveToLocalStorage();
    renderNotesList();
    setTimeout(() => { noteSavedStatus.textContent = "自動保存済"; }, 300);
});

backToFoldersBtn.addEventListener("click", () => { notesAppWrapper.className = "notes-app-wrapper"; });
backToNotesListBtn.addEventListener("click", () => { notesAppWrapper.className = "notes-app-wrapper view-list"; });

// --- 5. 🌓 大人なライト・ダークモード自動切り替え＆永続保存エンジン ---
if (themeToggleBtn) {
    const savedTheme = localStorage.getItem("diary_app_theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    themeToggleBtn.textContent = savedTheme === "dark" ? "☀️ LIGHT" : "🌙 DARK";
    themeToggleBtn.style.fontFamily = "'Georgia', serif";

    themeToggleBtn.addEventListener("click", () => {
        const currentTheme = document.documentElement.getAttribute("data-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("diary_app_theme", newTheme);
        themeToggleBtn.textContent = newTheme === "dark" ? "☀️ LIGHT" : "🌙 DARK";
        renderCalendarGrid(); 
    });
}

window.addEventListener("resize", () => { renderCalendarGrid(); });

    userNotesData = saved ? JSON.parse(saved) : { diary: {}, todo: {}, folders: [] };
    if (!userNotesData.folders || userNotesData.folders.length === 0) {
        userNotesData.folders = [
            { id: "f_default", name: "メモ", notes: [{ id: "n_default", title: "最初のメモ", body: "ここに内容を入力できます。", updated: Date.now() }] }
        ];
    }

    loginSection.classList.add("hidden");
    mainSection.classList.remove("hidden");
    targetCurrentDate = new Date();
    
    renderCalendarGrid();
    renderFolders();
    renderNotesList();
    loadCurrentNote();
});

setTimeout(() => {
    const autoKey = localStorage.getItem("cal_auto_login_key");
    if (autoKey && loginKeyInput && loginBtn) {
        loginKeyInput.value = autoKey;
        loginBtn.click();
    }
}, 50);

logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("cal_auto_login_key");
    currentLogedInUser = ""; 
    loginKeyInput.value = ""; 
    mainSection.classList.add("hidden"); 
    loginSection.classList.remove("hidden");
});

// --- 2. 🎛️ タブ切り替え ＆ 滑らかスライドアニメーション ---
tabCalendarBtn.addEventListener("click", () => {
    tabCalendarBtn.classList.add("active");
    tabNotesBtn.classList.remove("active");
    slideContainer.style.transform = "translateX(0%)";
});

tabNotesBtn.addEventListener("click", () => {
    tabNotesBtn.classList.add("active");
    tabCalendarBtn.classList.remove("active");
    slideContainer.style.transform = "translateX(-50%)";
});

// --- 3. 📅 カレンダー月切り替え ＆ 日記自動保存 ---
prevMonthBtn.addEventListener("click", () => {
    targetCurrentDate.setMonth(targetCurrentDate.getMonth() - 1); renderCalendarGrid();
});
nextMonthBtn.addEventListener("click", () => {
    targetCurrentDate.setMonth(targetCurrentDate.getMonth() + 1); renderCalendarGrid();
});

diaryInput.addEventListener("input", () => {
    if (!selectedDateKey || !currentLogedInUser) return;
    if (!userNotesData.diary) userNotesData.diary = {};
    userNotesData.diary[selectedDateKey] = diaryInput.value;
    saveToLocalStorage();
});

memoInput.addEventListener("input", () => {
    if (!selectedDateKey || !currentLogedInUser) return;
    if (!userNotesData.todo) userNotesData.todo = {};
    userNotesData.todo[selectedDateKey] = memoInput.value;
    saveToLocalStorage();
});

function saveToLocalStorage() {
    localStorage.setItem(`cal_premium_${currentLogedInUser}`, JSON.stringify(userNotesData));
}

backModalBtn.addEventListener("click", () => {
    memoModal.classList.add("hidden"); renderCalendarGrid();
});

// --- 4. 📂 📝 iPhone風メモ帳：操作＆リアルタイム自動保存イベント ---
addFolderBtn.addEventListener("click", () => {
    const fName = prompt("新しいフォルダ名を入力してください：");
    if (!fName || !fName.trim()) return;
    const newFolder = { id: "f_" + Date.now(), name: fName.trim(), notes: [] };
    userNotesData.folders.push(newFolder);
    currentFolderId = newFolder.id;
    currentNoteId = "";
    saveToLocalStorage(); renderFolders(); renderNotesList(); loadCurrentNote();
});

addNoteBtn.addEventListener("click", () => {
    const activeFolder = userNotesData.folders.find(f => f.id === currentFolderId);
    if (!activeFolder) return;
    const newNote = { id: "n_" + Date.now(), title: "", body: "", updated: Date.now() };
    activeFolder.notes.push(newNote);
    currentNoteId = newNote.id;
    saveToLocalStorage(); renderNotesList(); loadCurrentNote();
    if (window.innerWidth <= 768) { notesAppWrapper.className = "notes-app-wrapper view-editor"; }
});

noteTitleInput.addEventListener("input", () => {
    const activeFolder = userNotesData.folders.find(f => f.id === currentFolderId);
    if (!activeFolder || !currentNoteId) return;
    const activeNote = activeFolder.notes.find(n => n.id === currentNoteId);
    if (!activeNote) return;
    activeNote.title = noteTitleInput.value;
    activeNote.updated = Date.now();
    noteSavedStatus.textContent = "保存中...";
    saveToLocalStorage();
    renderNotesList();
    setTimeout(() => { noteSavedStatus.textContent = "自動保存済"; }, 300);
});

noteBodyInput.addEventListener("input", () => {
    const activeFolder = userNotesData.folders.find(f => f.id === currentFolderId);
    if (!activeFolder || !currentNoteId) return;
    const activeNote = activeFolder.notes.find(n => n.id === currentNoteId);
    if (!activeNote) return;
    activeNote.body = noteBodyInput.value;
    activeNote.updated = Date.now();
    noteSavedStatus.textContent = "保存中...";
    saveToLocalStorage();
    renderNotesList();
    setTimeout(() => { noteSavedStatus.textContent = "自動保存済"; }, 300);
});

backToFoldersBtn.addEventListener("click", () => { notesAppWrapper.className = "notes-app-wrapper"; });
backToNotesListBtn.addEventListener("click", () => { notesAppWrapper.className = "notes-app-wrapper view-list"; });

// --- 5. 🌓 大人なライト・ダークモード自動切り替え＆永続保存エンジン（LIGHT / DARK ＆ Georgia統一） ---
if (themeToggleBtn) {
    const savedTheme = localStorage.getItem("diary_app_theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    themeToggleBtn.textContent = savedTheme === "dark" ? "☀️ LIGHT" : "🌙 DARK";
    themeToggleBtn.style.fontFamily = "'Georgia', serif";

    themeToggleBtn.addEventListener("click", () => {
        const currentTheme = document.documentElement.getAttribute("data-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("diary_app_theme", newTheme);
        themeToggleBtn.textContent = newTheme === "dark" ? "☀️ LIGHT" : "🌙 DARK";
        renderCalendarGrid(); 
    });
}

window.addEventListener("resize", () => { renderCalendarGrid(); });
