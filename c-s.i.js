// --- 1. 画面のHTMLパーツを取得 ---
const loginSection = document.getElementById("loginSection");
const mainSection = document.getElementById("mainSection");
const memoModal = document.getElementById("memoModal");

const loginKeyInput = document.getElementById("loginKey");
const loginBtn = document.getElementById("loginBtn");
const loginError = document.getElementById("loginError");
const currentUserSpan = document.getElementById("currentUser");
const logoutBtn = document.getElementById("logoutBtn");

const prevMonthBtn = document.getElementById("prevMonthBtn");
const nextMonthBtn = document.getElementById("nextMonthBtn");
const calendarMonthEnglish = document.getElementById("calendarMonthEnglish");
const calendarYear = document.getElementById("calendarYear");
const calendarMonthNumber = document.getElementById("calendarMonthNumber");
const calendarGrid = document.getElementById("calendarGrid");

const modalDateTitle = document.getElementById("modalDateTitle");
const modalHolidayLabel = document.getElementById("modalHolidayLabel");
const diaryInput = document.getElementById("diaryInput");
const memoInput = document.getElementById("memoInput");
const backModalBtn = document.getElementById("backModalBtn");

// 🌟【新設】タブ切り替え＆左右スライド用DOM
const tabCalendarBtn = document.getElementById("tabCalendarBtn");
const tabNotesBtn = document.getElementById("tabNotesBtn");
const slideContainer = document.getElementById("slideContainer");

// 🌟【新設】iPhone風メモ帳用DOM
const notesAppWrapper = document.querySelector(".notes-app-wrapper");
const folderList = document.getElementById("folderList");
const noteList = document.getElementById("noteList");
const currentFolderName = document.getElementById("currentFolderName");
const noteTitleInput = document.getElementById("noteTitleInput");
const noteBodyInput = document.getElementById("noteBodyInput");
const noteSavedStatus = document.getElementById("noteSavedStatus");

const addFolderBtn = document.getElementById("addFolderBtn");
const addNoteBtn = document.getElementById("addNoteBtn");
const backToFoldersBtn = document.getElementById("backToFoldersBtn");
const backToNotesListBtn = document.getElementById("backToNotesListBtn");

// --- 2. カレンダーとデータの状態管理 ---
let currentLogedInUser = "";         // ログイン中のユーザー名
let targetCurrentDate = new Date();  // 現在表示しているカレンダーの年月
let selectedDateKey = "";            // 開いている日付のキー

// 🌟【データ構造進化】日記データに加えて、iPhone風フォルダ・メモ階層を完全サポート
let userNotesData = { 
    diary: {}, 
    todo: {}, 
    folders: [
        { id: "f_default", name: "メモ", notes: [{ id: "n_default", title: "最初のメモ", body: "ここに内容を入力できます。", updated: Date.now() }] }
    ]
}; 

// 🌟 メモ選択中の管理状態
let currentFolderId = "f_default";
let currentNoteId = "n_default";

const ENGLISH_MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
