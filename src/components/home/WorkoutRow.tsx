'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  IconDothorizline3VerticalLine,
  IconTrashcanLine,
} from '@karrotmarket/react-monochrome-icon';
import classNames from 'classnames/bind';
import { CategoryBadge } from '@/components/ui/CategoryBadge';
import type { WorkoutEntry } from '@/lib/types';
import styles from '@/components/home/WorkoutRow.module.scss';

const cx = classNames.bind(styles);

interface WorkoutRowProps {
  entry: WorkoutEntry;
  onDelete: (id: string) => void;
}

export function WorkoutRow({ entry, onDelete }: WorkoutRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: entry.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cx('row', { dragging: isDragging })}
    >
      <button
        type="button"
        className={cx('handle')}
        aria-label="순서 변경"
        {...attributes}
        {...listeners}
      >
        <IconDothorizline3VerticalLine width={18} height={18} />
      </button>

      <div className={cx('main')}>
        <div className={cx('titleRow')}>
          <span className={cx('name')}>{entry.name}</span>
          <CategoryBadge category={entry.category} />
        </div>
        <div className={cx('meta')}>
          <span>{entry.sets}세트</span>
          <span className={cx('sep')}>·</span>
          <span>{entry.reps}회</span>
          {entry.weight > 0 ? (
            <>
              <span className={cx('sep')}>·</span>
              <span className={cx('weight')}>{entry.weight}kg</span>
            </>
          ) : null}
        </div>
      </div>

      <button
        type="button"
        className={cx('delete')}
        onClick={() => onDelete(entry.id)}
        aria-label={`${entry.name} 삭제`}
      >
        <IconTrashcanLine width={18} height={18} />
      </button>
    </li>
  );
}
