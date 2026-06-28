// --- 1. 画面の要素（HTMLパーツ）を取得 ---
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
const calendarTitle = document.getElementById("calendarTitle");
const calendarGrid = document.getElementById("calendarGrid");

const modalDateTitle = document.getElementById("modalDateTitle");
const memoInput = document.getElementById("memoInput");
const closeModalBtn = document.getElementById("closeModalBtn");

// --- 2. カレンダーとユーザーの状態管理 ---
let currentLogedInUser = ""; // 現在ログインしているユーザーのキー
let userNotesData = {};      // そのユーザーのメモデータを保存するオブジェクト
let targetCurrentDate = new Date(); // 現在表示しているカレンダーの年月データ
let selectedDateKey = "";    // 現在ポップアップで開いている日付のキー (例: "2026-06-28")
