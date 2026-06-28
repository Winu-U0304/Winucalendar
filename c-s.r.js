// 曜日の並び
const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

// --- カレンダーを画面に組み立てて描画する処理 ---
function renderCalendarGrid() {
    // 1. カレンダーの中身を一度きれいにリセット
    calendarGrid.innerHTML = "";

    // 2. 上部の「〇〇年〇〇月」のタイトルを更新
    const year = targetCurrentDate.getFullYear();
    const month = targetCurrentDate.getMonth();
    calendarTitle.textContent = `${year}年 ${month + 1}月`;

    // 3. 曜日のヘッダー（日〜土）を作成して配置
    WEEKDAYS.forEach(day => {
        const headerEl = document.createElement("div");
        headerEl.className = "day-header";
        headerEl.textContent = day;
        calendarGrid.appendChild(headerEl);
    });

    // 4. 今月の「1日」が何曜日か、今月が「何日まであるか」を計算
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

    // 5. 1日が始まる前の「空のマス（前月の残りの日数分）」を配置
    for (let i = 0; i < firstDayIndex; i++) {
        const emptyCell = document.createElement("div");
        calendarGrid.appendChild(emptyCell);
    }

    // 6. 1日から月末日までの「日付マス」を順番に作成
    for (let day = 1; day <= totalDaysInMonth; day++) {
        const cell = document.createElement("div");
        cell.className = "day-cell";

        // 今日と同じ日付なら黄色くハイライトする
        const today = new Date();
        if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            cell.classList.add("today");
        }

        // マスの中に日付の数字を入れる
        const numEl = document.createElement("div");
        numEl.className = "day-number";
        numEl.textContent = day;
        cell.appendChild(numEl);

        // --- 💾 自動保存されたメモの読み込みとプレビュー表示 ---
        // 日付の一意のキー（例："2026-06-01"）を作成
        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        // この日のメモが保存されていたら、マス目の中にプレビューとして表示
        if (userNotesData[dateKey]) {
            const previewEl = document.createElement("div");
            previewEl.className = "memo-preview";
            previewEl.textContent = userNotesData[dateKey];
            cell.appendChild(previewEl);
        }

        // 日付マスをクリックしたときにメモ入力ポップアップを開くイベント
        cell.addEventListener("click", () => {
            selectedDateKey = dateKey;
            modalDateTitle.textContent = `${year}年${month + 1}月${day}日のメモ`;
            memoInput.value = userNotesData[dateKey] || ""; // 保存済みのメモがあれば表示、なければ空っぽ
            memoModal.classList.remove("hidden"); // ポップアップを表示
        });

        calendarGrid.appendChild(cell);
    }
}
