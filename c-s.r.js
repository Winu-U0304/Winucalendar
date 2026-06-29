const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// --- 📅 カレンダーのマス目を動的に描画 ---
function renderCalendarGrid() {
    calendarGrid.innerHTML = "";
    const year = targetCurrentDate.getFullYear();
    const month = targetCurrentDate.getMonth();
    calendarYear.textContent = year;
    calendarMonthEnglish.textContent = ENGLISH_MONTHS[month];
    calendarMonthNumber.textContent = month + 1;

    let currentWeekdays = [...WEEKDAYS];
    if (window.innerWidth <= 768) {
        currentWeekdays = ["　　Sun　　", "　　Mon　　", "　　Tue　　", "　　Wed　　", "　　Thu　　", "　　Fri　　", "　　Sat　　"];
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
        
        if (userNotesData.diary && userNotesData.diary[dateKey]) {
            if (window.innerWidth > 768) {
                const previewEl = document.createElement("div");
                previewEl.className = "cell-diary-preview";
                let cleanText = userNotesData.diary[dateKey].replace(/\n/g, " ");
                if (cleanText.length > 7) { cleanText = cleanText.substring(0, 7) + "…"; }
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

// --- 📂 📱 iPhone風メモ帳：フォルダリストの描画 ---
function renderFolders() {
    folderList.innerHTML = "";
    userNotesData.folders.forEach(folder => {
        const item = document.createElement("div");
        item.className = `folder-item ${folder.id === currentFolderId ? "active" : ""}`;
        
        const nameSpan = document.createElement("span");
        nameSpan.textContent = `📁 ${folder.name}`;
        item.appendChild(nameSpan);

        // 初期フォルダ以外は削除ボタンを表示
        if (folder.id !== "f_default") {
            const delBtn = document.createElement("button");
            delBtn.className = "delete-btn";
            delBtn.textContent = "🗑️";
            delBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                if (confirm(`フォルダ「${folder.name}」とその中身をすべて削除しますか？`)) {
                    userNotesData.folders = userNotesData.folders.filter(f => f.id !== folder.id);
                    if (currentFolderId === folder.id) { currentFolderId = "f_default"; currentNoteId = "n_default"; }
                    saveToLocalStorage(); renderFolders(); renderNotesList(); loadCurrentNote();
                }
            });
            item.appendChild(delBtn);
        }

        item.addEventListener("click", () => {
            currentFolderId = folder.id;
            const activeFolder = userNotesData.folders.find(f => f.id === currentFolderId);
            currentNoteId = activeFolder && activeFolder.notes.length > 0 ? activeFolder.notes[0].id : "";
            renderFolders(); renderNotesList(); loadCurrentNote();
            if (window.innerWidth <= 768) { notesAppWrapper.className = "notes-app-wrapper view-list"; }
        });
        folderList.appendChild(item);
    });
}

// --- 📝 📱 iPhone風メモ帳：メモ一覧リストの描画 ---
function renderNotesList() {
    noteList.innerHTML = "";
    const activeFolder = userNotesData.folders.find(f => f.id === currentFolderId);
    if (!activeFolder) return;

    currentFolderName.textContent = activeFolder.name;

    // 更新日時が新しい順に並び替え
    activeFolder.notes.sort((a, b) => b.updated - a.updated);

    activeFolder.notes.forEach(note => {
        const item = document.createElement("div");
        item.className = `note-item ${note.id === currentNoteId ? "active" : ""}`;

        const contentWrap = document.createElement("div");
        contentWrap.style.overflow = "hidden";
        contentWrap.style.flexGrow = "1";

        const titleEl = document.createElement("div");
        titleEl.className = "note-item-title";
        titleEl.textContent = note.title.trim() || "タイトルなし";
        contentWrap.appendChild(titleEl);

        const previewEl = document.createElement("div");
        previewEl.className = "note-item-preview";
        previewEl.textContent = note.body.trim() || "テキストなし";
        contentWrap.appendChild(previewEl);

        item.appendChild(contentWrap);

        const delBtn = document.createElement("button");
        delBtn.className = "delete-btn";
        delBtn.textContent = "🗑️";
        delBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            activeFolder.notes = activeFolder.notes.filter(n => n.id !== note.id);
            if (currentNoteId === note.id) { currentNoteId = activeFolder.notes.length > 0 ? activeFolder.notes[0].id : ""; }
            saveToLocalStorage(); renderNotesList(); loadCurrentNote();
        });
        item.appendChild(delBtn);

        item.addEventListener("click", () => {
            currentNoteId = note.id;
            renderNotesList(); loadCurrentNote();
            if (window.innerWidth <= 768) { notesAppWrapper.className = "notes-app-wrapper view-editor"; }
        });
        noteList.appendChild(item);
    });
}

// --- 📖 📱 iPhone風メモ帳：現在選択中のメモを右側エディタにロード ---
function loadCurrentNote() {
    const activeFolder = userNotesData.folders.find(f => f.id === currentFolderId);
    if (!activeFolder || !currentNoteId) {
        noteTitleInput.value = ""; noteBodyInput.value = "";
        noteTitleInput.disabled = true; noteBodyInput.disabled = true;
        noteSavedStatus.textContent = "メモがありません"; return;
    }

    const activeNote = activeFolder.notes.find(n => n.id === currentNoteId);
    if (!activeNote) {
        noteTitleInput.value = ""; noteBodyInput.value = ""; return;
    }

    noteTitleInput.disabled = false; noteBodyInput.disabled = false;
    noteTitleInput.value = activeNote.title;
    noteBodyInput.value = activeNote.body;
    noteSavedStatus.textContent = "自動保存済";
}
