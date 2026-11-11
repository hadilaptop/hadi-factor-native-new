// src/utils/numberUtils.ts

export const toPersianDigits = (str: string | number) => {
  if (str === null || str === undefined) return "";
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return str.toString().replace(/\d/g, (x) => persianDigits[parseInt(x)]);
};

export const formatNumber = (num: number | string) => {
  if (!num) return "";
  const cleanNum = num
    .toString()
    .replace(/,/g, "")
    .replace(/[۰-۹]/g, (c) => "0123456789"[c.charCodeAt(0) - 1776]);
  if (isNaN(Number(cleanNum)) || cleanNum === "") return "";
  return toPersianDigits(Number(cleanNum).toLocaleString("en-US"));
};

export const parseNumber = (str: string | number) => {
  if (!str) return 0;
  if (typeof str === "number") return str;
  const englishStr = str
    .toString()
    .replace(/[۰-۹]/g, (c) => "0123456789"[c.charCodeAt(0) - 1776])
    .replace(/,/g, "");
  return parseInt(englishStr, 10) || 0;
};

// تابع کامل تبدیل عدد به حروف فارسی
export const convertNumberToPersianWords = (number: number) => {
  if (!number || number === 0) return "صفر ریال";

  const yekan = ["", "یک", "دو", "سه", "چهار", "پنج", "شش", "هفت", "هشت", "نه"];
  const dahgan = [
    "",
    "ده",
    "بیست",
    "سی",
    "چهل",
    "پنجاه",
    "شصت",
    "هفتاد",
    "هشتاد",
    "نود",
  ];
  const dahha = [
    "ده",
    "یازده",
    "دوازده",
    "سیزده",
    "چهارده",
    "پانزده",
    "شانزده",
    "هفده",
    "هجده",
    "نوزده",
  ];
  const sadgan = [
    "",
    "صد",
    "دویست",
    "سیصد",
    "چهارصد",
    "پانصد",
    "ششصد",
    "هفتصد",
    "هشتصد",
    "نهصد",
  ];
  const base = ["", "هزار", "میلیون", "میلیارد", "تریلیون"];

  const getGroupWords = (n: number) => {
    let words = [];
    let h = Math.floor(n / 100);
    let t = Math.floor((n % 100) / 10);
    let u = n % 10;
    if (h > 0) words.push(sadgan[h]);
    if (t === 1) {
      words.push(dahha[u]);
    } else {
      if (t > 1) words.push(dahgan[t]);
      if (u > 0) words.push(yekan[u]);
    }
    return words.join(" و ");
  };

  let numStr = number.toString();
  let result = [];
  let groupCount = 0;

  while (numStr.length > 0) {
    let chunk = numStr.slice(-3);
    numStr = numStr.slice(0, -3);
    let chunkNum = parseInt(chunk, 10);
    if (chunkNum > 0) {
      let chunkText = getGroupWords(chunkNum);
      if (base[groupCount]) chunkText += " " + base[groupCount];
      result.unshift(chunkText);
    }
    groupCount++;
  }
  return result.join(" و ") + " ریال";
};