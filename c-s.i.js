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
const globalMemo = document.getElementById("globalMemo");

// --- 2. カレンダーとデータの状態管理 ---
let currentLogedInUser = "";         // ログイン中のユーザー名
let userNotesData = {                 // ユーザーの日記・メモ・全体メモをまとめて保存する構造
    diary: {},   // 日付ごとの日記データ
    todo: {},    // 日付ごとのToDoデータ
    global: ""   // 日付関係ない全体メモ
};
let targetCurrentDate = new Date();  // 現在表示しているカレンダーの年月
let selectedDateKey = "";            // ポップアップで開いている日付のキー (例: "2026-06-28")

// 英語の月名の配列（デザイン画像に合わせる用）
const ENGLISH_MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

// 曜日の英語表記（デザイン用）
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
