export type Category = 'lower' | 'upper' | 'core' | 'fullbody' | 'cardio';

/** 3대 운동 (스쿼트·벤치프레스·데드리프트) */
export type Lift = 'squat' | 'bench' | 'deadlift';

export interface WorkoutEntry {
  id: string;
  /** 운동명 e.g. 스쿼트 */
  name: string;
  /** 세트 수 */
  sets: number;
  /** 세트당 반복 횟수 */
  reps: number;
  /** 무게 (kg). 맨몸/유산소는 0 */
  weight: number;
  category: Category;
  /** KST 기준 'YYYY-MM-DD' */
  date: string;
  /** 생성 시각 (epoch ms) */
  createdAt: number;
  /** 같은 날짜 그룹 내 수동 정렬 순서 (작을수록 위) */
  order: number;
  /** 3대 운동으로 지정된 경우 해당 종목 (일반 기록은 null) */
  lift?: Lift | null;
}
