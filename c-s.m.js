// --- 1. 🔑 ログイン・ログアウト ＆ データ復元 ---
loginBtn.addEventListener("click", () => {
    const key = loginKeyInput.value.trim();
    if (!key) { loginError.textContent = "専用の認証キーを入力してください。"; return; }
    currentLogedInUser = key;
    currentUserSpan.textContent = key;
    loginError.textContent = "";

    // 次回から自動ログインできるようにキーをブラウザに永続保存
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

// 画面が100%読み込み終わってから自動ログインを安全に実行
window.addEventListener("load", () => {
    setTimeout(() => {
        const autoKey = localStorage.getItem("cal_auto_login_key");
        if (autoKey && loginKeyInput && loginBtn) {
            loginKeyInput.value = autoKey;
            loginBtn.click();
        }
    }, 150);
});

logoutBtn.addEventListener("click", () => {
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

// --- 3. 💾 上が「題名」、下が「本文」のリアルタイム自動保存 ---
// 📖 日記の題名入力欄（15文字制限つき）の自動保存
diaryInput.addEventListener("input", () => {
    if (!selectedDateKey || !currentLogedInUser) return;
    if (!userNotesData.diary) userNotesData.diary = {};
    userNotesData.diary[selectedDateKey] = diaryInput.value;
    saveToLocalStorage();
});

// 📌 日記本文入力欄の自動保存
memoInput.addEventListener("input", () => {
    if (!selectedDateKey || !currentLogedInUser) return;
    if (!userNotesData.todo) userNotesData.todo = {};
    userNotesData.todo[selectedDateKey] = memoInput.value;
    saveToLocalStorage();
});

// ヘッダーにある自由メモの自動保存
globalMemo.addEventListener("input", () => {
    if (!currentLogedInUser) return;
    userNotesData.global = globalMemo.value;
    saveToLocalStorage();
});

function saveToLocalStorage() {
    localStorage.setItem(`cal_premium_${currentLogedInUser}`, JSON.stringify(userNotesData));
}

// ◀ 戻る ボタンを押したときにポップアップを閉じてカレンダーを更新
backModalBtn.addEventListener("click", () => {
    memoModal.classList.add("hidden"); renderCalendarGrid();
});
