const KST = 'Asia/Seoul';

/** 오늘(또는 주어진 시각)의 KST 기준 'YYYY-MM-DD' */
export function kstDateString(date: Date = new Date()): string {
  // en-CA locale => YYYY-MM-DD
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: KST,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

/** 'YYYY-MM-DD' -> { month, day, weekday } (KST 고정 문자열이라 파싱만) */
function parseYmd(ymd: string): { year: number; month: number; day: number } {
  const [year, month, day] = ymd.split('-').map(Number);
  return { year, month, day };
}

/** 'YYYY-MM-DD' -> '8월 1일' */
export function formatMonthDay(ymd: string): string {
  const { month, day } = parseYmd(ymd);
  return `${month}월 ${day}일`;
}

/** 'YYYY-MM-DD' -> '금' */
export function formatWeekday(ymd: string): string {
  const { year, month, day } = parseYmd(ymd);
  // 정오로 고정해 타임존에 따른 날짜 밀림 방지
  const dow = new Date(Date.UTC(year, month - 1, day, 12)).getUTCDay();
  return WEEKDAYS[dow];
}

/** 오늘/어제/N일 전 같은 상대 표현 (KST 기준) */
export function formatRelative(ymd: string, today: string = kstDateString()): string {
  const diff = daysBetween(ymd, today);
  if (diff === 0) {
    return '오늘';
  }
  if (diff === 1) {
    return '어제';
  }
  if (diff === 2) {
    return '그저께';
  }
  if (diff > 0 && diff < 7) {
    return `${diff}일 전`;
  }
  return '';
}

/** from(과거) ~ to(미래) 사이 일수. to가 더 미래면 양수 */
export function daysBetween(from: string, to: string): number {
  const a = parseYmd(from);
  const b = parseYmd(to);
  const aUtc = Date.UTC(a.year, a.month - 1, a.day);
  const bUtc = Date.UTC(b.year, b.month - 1, b.day);
  return Math.round((bUtc - aUtc) / 86_400_000);
}
