// --- 1. 🔑 ログイン・ログアウト処理 ---
loginBtn.addEventListener("click", () => {
    const key = loginKeyInput.value.trim();
    if (!key) {
        loginError.textContent = "ログインキーを入力してください。";
        return;
    }
    // ログインに成功したらユーザー名を記憶
    currentLogedInUser = key;
    currentUserSpan.textContent = key;
    loginError.textContent = "";

    // ブラウザの保存領域（LocalStorage）から、このユーザー専用のメモデータを読み込む
    const savedData = localStorage.getItem(`cal_data_${currentLogedInUser}`);
    userNotesData = savedData ? JSON.parse(savedData) : {};

    // 画面の表示を切り替える
    loginSection.classList.add("hidden");
    mainSection.classList.remove("hidden");
    
    // カレンダーを表示
    targetCurrentDate = new Date();
    renderCalendarGrid();
});

logoutBtn.addEventListener("click", () => {
    currentLogedInUser = "";
    userNotesData = {};
    loginKeyInput.value = "";
    mainSection.classList.add("hidden");
    loginSection.classList.remove("hidden");
});

// --- 2. ◀ ▶ 月の切り替え処理 ---
prevMonthBtn.addEventListener("click", () => {
    targetCurrentDate.setMonth(targetCurrentDate.getMonth() - 1);
    renderCalendarGrid();
});

nextMonthBtn.addEventListener("click", () => {
    targetCurrentDate.setMonth(targetCurrentDate.getMonth() + 1);
    renderCalendarGrid();
});

// --- 3. 💾 リアルタイム自動保存 ＆ ポップアップを閉じる処理 ---
// テキストエリアに文字が入力されるたびに、1文字ごとに即時自動保存される神機能
memoInput.addEventListener("input", () => {
    if (!selectedDateKey || !currentLogedInUser) return;

    const value = memoInput.value.trim();
    if (value === "") {
        delete userNotesData[selectedDateKey]; // 空っぽになったらデータを消す
    } else {
        userNotesData[selectedDateKey] = value; // メモを記憶
    }

    // ブラウザ（LocalStorage）にこのユーザー専用のデータを上書き保存
    localStorage.setItem(`cal_data_${currentLogedInUser}`, JSON.stringify(userNotesData));
});

// 閉じるボタンを押したときにポップアップを非表示にして、カレンダーのプレビューを更新
closeModalBtn.addEventListener("click", () => {
    memoModal.classList.add("hidden");
    renderCalendarGrid();
});
