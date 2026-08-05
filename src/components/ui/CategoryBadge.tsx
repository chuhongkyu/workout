import classNames from 'classnames/bind';
import { CATEGORY_META } from '@/lib/categories';
import type { Category } from '@/lib/types';
import styles from '@/components/ui/CategoryBadge.module.scss';

const cx = classNames.bind(styles);

interface CategoryBadgeProps {
  category: Category;
  size?: 'sm' | 'md';
}

export function CategoryBadge({ category, size = 'sm' }: CategoryBadgeProps) {
  const meta = CATEGORY_META[category];
  return (
    <span
      className={cx('badge', `badge--${size}`)}
      style={{ ['--badge-color' as string]: meta.colorVar }}
    >
      <span className={cx('dot')} aria-hidden />
      {meta.label}
    </span>
  );
}
