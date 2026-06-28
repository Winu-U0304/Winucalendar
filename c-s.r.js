const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function renderCalendarGrid() {
    calendarGrid.innerHTML = "";
    const year = targetCurrentDate.getFullYear();
    const month = targetCurrentDate.getMonth();
    calendarYear.textContent = year;
    calendarMonthEnglish.textContent = ENGLISH_MONTHS[month];
    calendarMonthNumber.textContent = month + 1;

    WEEKDAYS.forEach((day, index) => {
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
        
        // 🔄 マス目の中には「7文字制限の日記タイトル」を改行なしで綺麗に表示
        if (userNotesData.diary && userNotesData.diary[dateKey]) {
            const previewEl = document.createElement("div");
            previewEl.className = "cell-diary-preview";
            const cleanText = userNotesData.diary[dateKey].replace(/\n/g, " ");
            previewEl.textContent = cleanText;
            cell.appendChild(previewEl);
        }

        cell.addEventListener("click", () => {
            selectedDateKey = dateKey;
            modalDateTitle.textContent = `${year} / ${String(month + 1).padStart(2, '0')} / ${String(day).padStart(2, '0')}`;
            modalHolidayLabel.textContent = holidayName || "";
            modalHolidayLabel.classList.toggle("hidden", !holidayName);

            // 題名(diary)と本文(todo)をそれぞれの入力欄へセット
            diaryInput.value = (userNotesData.diary && userNotesData.diary[dateKey]) || "";
            memoInput.value = (userNotesData.todo && userNotesData.todo[dateKey]) || "";
            memoModal.classList.remove("hidden");
        });

        calendarGrid.appendChild(cell);
    }
}
