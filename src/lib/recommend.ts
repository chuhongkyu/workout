import { CATEGORY_META } from '@/lib/categories';
import { daysBetween, kstDateString } from '@/lib/date';
import type { Category, WorkoutEntry } from '@/lib/types';

const ALL_CATEGORIES: Category[] = ['lower', 'upper', 'core', 'cardio'];
const RECENT_WINDOW_DAYS = 7;

export interface Recommendation {
  /** 추천 카테고리 (없으면 첫 운동 유도) */
  category: Category | null;
  headline: string;
  reason: string;
}

/**
 * 최근 7일간 카테고리별 세트 수를 세어, 가장 적게 한 부위를 추천한다.
 * 데이터가 없으면 첫 기록을 유도한다.
 */
export function recommend(
  entries: WorkoutEntry[],
  userName: string,
  today: string = kstDateString(),
): Recommendation {
  const name = userName.trim() || '회원';

  if (entries.length === 0) {
    return {
      category: null,
      headline: `${name}님, 첫 운동을 기록해볼까요?`,
      reason: '오른쪽 아래 + 버튼으로 오늘의 운동을 남겨보세요.',
    };
  }

  const counts: Record<Category, number> = { lower: 0, upper: 0, core: 0, cardio: 0 };
  let recentTotal = 0;

  for (const entry of entries) {
    const ago = daysBetween(entry.date, today);
    if (ago >= 0 && ago < RECENT_WINDOW_DAYS) {
      counts[entry.category] += Math.max(1, entry.sets);
      recentTotal += Math.max(1, entry.sets);
    }
  }

  if (recentTotal === 0) {
    return {
      category: null,
      headline: `${name}님, 최근 일주일 운동이 없어요.`,
      reason: '오랜만에 가볍게 몸을 깨워볼까요? 💪',
    };
  }

  // 가장 적게 한 부위 = 추천, 가장 많이 한 부위 = 사유
  const least = [...ALL_CATEGORIES].sort((a, b) => counts[a] - counts[b])[0];
  const most = [...ALL_CATEGORIES].sort((a, b) => counts[b] - counts[a])[0];

  const leastLabel = CATEGORY_META[least].label;
  const mostLabel = CATEGORY_META[most].label;

  if (counts[least] === 0) {
    return {
      category: least,
      headline: `${name}님, 오늘은 ${leastLabel} 어때요?`,
      reason: `최근 일주일간 ${leastLabel} 운동이 없었어요. 균형을 맞춰봐요!`,
    };
  }

  return {
    category: least,
    headline: `${name}님, 오늘은 ${leastLabel}를 추천해요.`,
    reason: `최근엔 ${mostLabel}를 많이 하셨네요. ${leastLabel}로 밸런스를 잡아봐요!`,
  };
}
