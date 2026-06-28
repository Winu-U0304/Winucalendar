// --- 2026年〜2050年以降も対応！日本の祝日自動計算エンジン ---
function getJapanHolidayName(year, month, day) {
    const m = month + 1; // JSの月(0~11)を通常の月(1~12)に変換
    const w = new Date(year, month, day).getDay(); // 曜日 (0:日, 1:月... 6:土)
    const n = Math.floor((day - 1) / 7) + 1; // 第何曜日か (第1, 第2...)

    // 固定祝日の判定
    if (m === 1 && day === 1) return "元日";
    if (m === 1 && n === 2 && w === 1) return "成人の日"; // 1月第2月曜
    if (m === 2 && day === 11) return "建国記念の日";
    if (m === 2 && day === 23) return "天皇誕生日";
    if (m === 4 && day === 29) return "昭和の日";
    if (m === 5 && day === 3) return "憲法記念日";
    if (m === 5 && day === 4) return "みどりの日";
    if (m === 5 && day === 5) return "こどもの日";
    if (m === 7 && n === 3 && w === 1) return "海の日"; // 7月第3月曜
    if (m === 8 && day === 11) return "山の日";
    if (m === 9 && n === 3 && w === 1) return "敬老の日"; // 9月第3月曜
    if (m === 10 && n === 2 && w === 1) return "スポーツの日"; // 10月第2月曜
    if (m === 11 && day === 3) return "文化の日";
    if (m === 11 && day === 23) return "勤労感謝の日";

    // 🌸 春分の日・秋分の日の天文学的簡易計算式 (1980年〜2050年以降も対応)
    if (m === 3) {
        const equinoxDay = Math.floor(20.8431 + 0.242194 * (year - 1980) - Math.floor((year - 1980) / 4));
        if (day === equinoxDay) return "春分の日";
    }
    if (m === 9) {
        const equinoxDay = Math.floor(23.2488 + 0.242194 * (year - 1980) - Math.floor((year - 1980) / 4));
        if (day === equinoxDay) return "秋分の日";
    }

    return null;
}

// --- 🔄 振替休日・国民の休日まで完全に判定する統合関数 ---
function checkHoliday(year, month, day) {
    // 1. 当日が通常の祝日かチェック
    let name = getJapanHolidayName(year, month, day);
    if (name) return name;

    const thisDate = new Date(year, month, day);

    // 2. 振替休日の判定 (祝日が日曜日の場合、翌月曜以降の平日が休みになるルール)
    if (thisDate.getDay() === 1) { // 月曜日の場合
        const prevDate = new Date(year, month, day - 1);
        if (getJapanHolidayName(prevDate.getFullYear(), prevDate.getMonth(), prevDate.getDate())) {
            return "振替休日";
        }
    }
    // 大型連休(5月)などで祝日が連続して日曜と重なった場合の回り込み処理
    if (month === 4 && (day === 6)) {
        const d6 = new Date(year, 4, 6);
        if (d6.getDay() === 2 || d6.getDay() === 3) {
            return "振替休日";
        }
    }

    // 3. 国民の休日の判定 (祝日と祝日に挟まれた平日は休日になるルール、例: シルバーウィーク)
    const prevD = new Date(year, month, day - 1);
    const nextD = new Date(year, month, day + 1);
    const hasPrevH = getJapanHolidayName(prevD.getFullYear(), prevD.getMonth(), prevD.getDate());
    const hasNextH = getJapanHolidayName(nextD.getFullYear(), nextD.getMonth(), nextD.getDate());
    if (hasPrevH && hasNextH && thisDate.getDay() !== 0) {
        return "国民の休日";
    }

    return null;
}
