// --- カレンダーをオシャレに組み立てて描画する処理 ---
function renderCalendarGrid() {
    // 1. カレンダーを一度リセット
    calendarGrid.innerHTML = "";

    // 2. 左側のサイドバー（デザイン画像再現）のテキストを更新
    const year = targetCurrentDate.getFullYear();
    const month = targetCurrentDate.getMonth();
    calendarYear.textContent = year;
    calendarMonthEnglish.textContent = ENGLISH_MONTHS[month];
    calendarMonthNumber.textContent = month + 1;

    // 3. 曜日のヘッダー（Sunday〜Saturday）を作成
    WEEKDAYS.forEach((day, index) => {
        const headerEl = document.createElement("div");
        headerEl.className = "day-header";
        if (index === 0) headerEl.classList.add("sun");
        if (index === 6) headerEl.classList.add("sat");
        headerEl.textContent = day;
        calendarGrid.appendChild(headerEl);
    });

    // 4. 今月の1日の曜日と、今月の日数を計算
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

    // 5. 1日の前の「空のマス」を配置
    for (let i = 0; i < firstDayIndex; i++) {
        const emptyCell = document.createElement("div");
        calendarGrid.appendChild(emptyCell);
    }

    // 6. 1日から月末までの「日付マス」を順番に作成
    for (let day = 1; day <= totalDaysInMonth; day++) {
        const cell = document.createElement("div");
        cell.className = "day-cell";

        // 土・日のクラスを付与
        const currentDayOfWeek = new Date(year, month, day).getDay();
        if (currentDayOfWeek === 0) cell.classList.add("sun");
        if (currentDayOfWeek === 6) cell.classList.add("sat");

        // 今日と同じ日付なら太枠のハイライト
        const today = new Date();
        if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            cell.classList.add("today");
        }

        // --- 🎌 日本の祝日チェック機能 ---
        const holidayName = checkHoliday(year, month, day);
        if (holidayName) {
            cell.classList.add("holiday"); // マス全体を祝日モード（赤文字ベース）に
        }

        // 日付の数字を配置
        const numEl = document.createElement("div");
        numEl.className = "day-number";
        numEl.textContent = day;
        cell.appendChild(numEl);

        // 祝日名があれば数字の下に小さく表示
        if (holidayName) {
            const holidayEl = document.createElement("div");
            holidayEl.className = "cell-holiday-name";
            holidayEl.textContent = holidayName;
            cell.appendChild(holidayEl);
        }

        // --- 💾 日記の自動保存プレビュー表示 ---
        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        // この日の日記データがあれば、1行だけプレビュー表示
        if (userNotesData.diary && userNotesData.diary[dateKey]) {
            const previewEl = document.createElement("div");
            previewEl.className = "cell-diary-preview";
            previewEl.textContent = userNotesData.diary[dateKey];
            cell.appendChild(previewEl);
        }

        // 日付マスをクリックしたときにダイナミックモーダルを開くイベント
        cell.addEventListener("click", () => {
            selectedDateKey = dateKey;
            modalDateTitle.textContent = `${year} / ${String(month + 1).padStart(2, '0')} / ${String(day).padStart(2, '0')}`;
            modalHolidayLabel.textContent = holidayName || "";
            if (!holidayName) modalHolidayLabel.classList.add("hidden");
            else modalHolidayLabel.classList.remove("hidden");

            // 保存済みのデータを読み込んでセット
            diaryInput.value = (userNotesData.diary && userNotesData.diary[dateKey]) || "";
            memoInput.value = (userNotesData.todo && userNotesData.todo[dateKey]) || "";
            
            memoModal.classList.remove("hidden"); // アニメーション付きで大きく開く
        });

        calendarGrid.appendChild(cell);
    }
}
