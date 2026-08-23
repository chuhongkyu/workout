import type { Category, Lift, WorkoutEntry } from '@/lib/types';

export interface LiftMeta {
  id: Lift;
  label: string;
  /** 기록에 자동으로 들어가는 운동명 */
  name: string;
  category: Category;
  emoji: string;
}

export const LIFTS: LiftMeta[] = [
  { id: 'squat', label: '스쿼트', name: '스쿼트', category: 'lower', emoji: '🦵' },
  { id: 'bench', label: '벤치프레스', name: '벤치프레스', category: 'upper', emoji: '💪' },
  { id: 'deadlift', label: '데드리프트', name: '데드리프트', category: 'lower', emoji: '🏋️' },
];

export const LIFT_META: Record<Lift, LiftMeta> = {
  squat: LIFTS[0],
  bench: LIFTS[1],
  deadlift: LIFTS[2],
};

export interface BigThree {
  squat: number | null;
  bench: number | null;
  deadlift: number | null;
  total: number;
}

/** 기록에서 3대 종목별 최고 무게를 뽑아 합산 */
export function computeBigThree(entries: WorkoutEntry[]): BigThree {
  const maxOf = (lift: Lift): number | null => {
    const weights = entries
      .filter((e) => e.lift === lift)
      .map((e) => e.weight);
    return weights.length > 0 ? Math.max(...weights) : null;
  };
  const squat = maxOf('squat');
  const bench = maxOf('bench');
  const deadlift = maxOf('deadlift');
  const total = (squat ?? 0) + (bench ?? 0) + (deadlift ?? 0);
  return { squat, bench, deadlift, total };
}
