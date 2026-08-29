import type { Category } from '@/lib/types';

export interface CategoryMeta {
  id: Category;
  label: string;
  /** CSS 변수명 (globals.scss에 정의된 카테고리 액센트) */
  colorVar: string;
  emoji: string;
}

export const CATEGORY_META: Record<Category, CategoryMeta> = {
  lower: { id: 'lower', label: '하체', colorVar: 'var(--cat-lower)', emoji: '🦵' },
  upper: { id: 'upper', label: '상체', colorVar: 'var(--cat-upper)', emoji: '💪' },
  core: { id: 'core', label: '코어', colorVar: 'var(--cat-core)', emoji: '🧘' },
  fullbody: {
    id: 'fullbody',
    label: '전신',
    colorVar: 'var(--cat-fullbody)',
    emoji: '🔥',
  },
  cardio: { id: 'cardio', label: '유산소', colorVar: 'var(--cat-cardio)', emoji: '🏃' },
};

export const CATEGORY_LIST: CategoryMeta[] = [
  CATEGORY_META.lower,
  CATEGORY_META.upper,
  CATEGORY_META.core,
  CATEGORY_META.fullbody,
  CATEGORY_META.cardio,
];
