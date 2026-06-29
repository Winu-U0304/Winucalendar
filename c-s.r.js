// 曜日定義（PCはフルスペル、スマホは自動判別されるのでベースはこれでOK）
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function renderCalendarGrid() {
    calendarGrid.innerHTML = "";
    const year = targetCurrentDate.getFullYear();
    const month = targetCurrentDate.getMonth();
    calendarYear.textContent = year;
    calendarMonthEnglish.textContent = ENGLISH_MONTHS[month];
    calendarMonthNumber.textContent = month + 1;

    // 📱 スマホの時は曜日を3文字に切り替える
    let currentWeekdays = [...WEEKDAYS];
    if (window.innerWidth <= 768) {
        currentWeekdays = ["　Sun　", "　Mon　", "　Tue　", "　Wed　", "　Thu　", "　Fri　", "　Sat　"];
    }

    currentWeekdays.forEach((day, index) => {
        const headerEl = document.createElement("div");
        headerEl.className = "day-header";
        if (index === 0) headerEl.classList.add("sun");
        if (index === 6) headerEl.classList.add("sat");
        headerEl.textContent = day;
        calendarGrid.appendChild(headerEl);
    });

    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDayIndex; i++) {
        calendarGrid.appendChild(document.createElement("div"));
    }

    for (let day = 1; day <= totalDaysInMonth; day++) {
        const cell = document.createElement("div");
        cell.className = "day-cell";

        const currentDayOfWeek = new Date(year, month, day).getDay();
        if (currentDayOfWeek === 0) cell.classList.add("sun");
        if (currentDayOfWeek === 6) cell.classList.add("sat");

        const today = new Date();
        if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            cell.classList.add("today");
        }

        const holidayName = checkHoliday(year, month, day);
        if (holidayName) cell.classList.add("holiday");

        const numEl = document.createElement("div");
        numEl.className = "day-number";
        numEl.textContent = day;
        cell.appendChild(numEl);

        if (holidayName) {
            const holidayEl = document.createElement("div");
            holidayEl.className = "cell-holiday-name";
            holidayEl.textContent = holidayName;
            cell.appendChild(holidayEl);
        }

        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        // 🔄 日記のタイトル表示（スマホ判別を入れて修正！）
        if (userNotesData.diary && userNotesData.diary[dateKey]) {
            // ⭐【ここを修正】画面の横幅が768pxより大きい（＝パソコン）時だけ、タイトルを表示する
            if (window.innerWidth > 768) {
                const previewEl = document.createElement("div");
                previewEl.className = "cell-diary-preview";
                
                // 改行をスペースに変換
                let cleanText = userNotesData.diary[dateKey].replace(/\n/g, " ");
                
                // パソコン時はMAX7文字でそのまま表示（念のため超過分は切り捨て）
                if (cleanText.length > 7) {
                    cleanText = cleanText.substring(0, 7) + "…";
                }
                
                previewEl.textContent = cleanText;
                cell.appendChild(previewEl);
            }
        }

        cell.addEventListener("click", () => {
            selectedDateKey = dateKey;
            modalDateTitle.textContent = `${year} / ${String(month + 1).padStart(2, '0')} / ${String(day).padStart(2, '0')}`;
            modalHolidayLabel.textContent = holidayName || "";
            modalHolidayLabel.classList.toggle("hidden", !holidayName);

            diaryInput.value = (userNotesData.diary && userNotesData.diary[dateKey]) || "";
            memoInput.value = (userNotesData.todo && userNotesData.todo[dateKey]) || "";
            memoModal.classList.remove("hidden");
        });

        calendarGrid.appendChild(cell);
    }
}
