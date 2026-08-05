export type Category = 'lower' | 'upper' | 'core' | 'cardio';

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
}
