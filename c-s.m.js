// --- 1. 🔑 ログイン・ログアウト ＆ データ復元 ---
loginBtn.addEventListener("click", () => {
    const key = loginKeyInput.value.trim();
    if (!key) { loginError.textContent = "秘密のキーを入力してください。"; return; }
    currentLogedInUser = key;
    currentUserSpan.textContent = key;
    loginError.textContent = "";

    // 🔄 次回から自動ログインできるようにキーをブラウザに永続保存
    localStorage.setItem("cal_auto_login_key", key);

    // LocalStorageからユーザー専用データを復元
    const saved = localStorage.getItem(`cal_premium_${currentLogedInUser}`);
    userNotesData = saved ? JSON.parse(saved) : { diary: {}, todo: {}, global: "" };

    globalMemo.value = userNotesData.global || "";

    loginSection.classList.add("hidden");
    mainSection.classList.remove("hidden");
    targetCurrentDate = new Date();
    renderCalendarGrid();
});

// 🔄 サイトを開いた直後に自動ログインを安全に実行する仕組み
setTimeout(() => {
    const autoKey = localStorage.getItem("cal_auto_login_key");
    if (autoKey && loginKeyInput && loginBtn) {
        loginKeyInput.value = autoKey;
        loginBtn.click(); // 登録済みのキーで自動エンター
    }
}, 50);

logoutBtn.addEventListener("click", () => {
    // 🔄 ログアウトしたときは自動ログインを解除
    localStorage.removeItem("cal_auto_login_key");
    currentLogedInUser = ""; userNotesData = { diary: {}, todo: {}, global: "" };
    loginKeyInput.value = ""; globalMemo.value = "";
    mainSection.classList.add("hidden"); loginSection.classList.remove("hidden");
});

// --- 2. ◀ ▶ 月またぎ切り替え処理 ---
prevMonthBtn.addEventListener("click", () => {
    targetCurrentDate.setMonth(targetCurrentDate.getMonth() - 1); renderCalendarGrid();
});
nextMonthBtn.addEventListener("click", () => {
    targetCurrentDate.setMonth(targetCurrentDate.getMonth() + 1); renderCalendarGrid();
});

// --- 3. 💾 入力した瞬間にリアルタイム自動保存 ---
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

globalMemo.addEventListener("input", () => {
    if (!currentLogedInUser) return;
    userNotesData.global = globalMemo.value;
    saveToLocalStorage();
});

function saveToLocalStorage() {
    localStorage.setItem(`cal_premium_${currentLogedInUser}`, JSON.stringify(userNotesData));
}

backModalBtn.addEventListener("click", () => {
    memoModal.classList.add("hidden"); renderCalendarGrid();
});
