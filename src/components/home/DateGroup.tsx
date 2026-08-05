'use client';

import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { IconChevronDownLine } from '@karrotmarket/react-monochrome-icon';
import classNames from 'classnames/bind';
import { WorkoutRow } from '@/components/home/WorkoutRow';
import { CATEGORY_META } from '@/lib/categories';
import { formatMonthDay, formatRelative, formatWeekday } from '@/lib/date';
import type { DateGroup as DateGroupData } from '@/lib/group';
import type { Category } from '@/lib/types';
import styles from '@/components/home/DateGroup.module.scss';

const cx = classNames.bind(styles);

interface DateGroupProps {
  group: DateGroupData;
  expanded: boolean;
  onToggle: () => void;
  onDelete: (id: string) => void;
  onReorder: (date: string, orderedIds: string[]) => void;
}

export function DateGroup({
  group,
  expanded,
  onToggle,
  onDelete,
  onReorder,
}: DateGroupProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 8 },
    }),
  );

  const relative = formatRelative(group.date);
  const uniqueCategories = Array.from(
    new Set(group.entries.map((e) => e.category)),
  ) as Category[];

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }
    const ids = group.entries.map((e) => e.id);
    const oldIndex = ids.indexOf(String(active.id));
    const newIndex = ids.indexOf(String(over.id));
    if (oldIndex === -1 || newIndex === -1) {
      return;
    }
    onReorder(group.date, arrayMove(ids, oldIndex, newIndex));
  };

  return (
    <section className={cx('group', { expanded })}>
      <button
        type="button"
        className={cx('summary')}
        onClick={onToggle}
        aria-expanded={expanded}
      >
        <div className={cx('dateBlock')}>
          <span className={cx('date')}>{formatMonthDay(group.date)}</span>
          <span className={cx('weekday')}>{formatWeekday(group.date)}</span>
          {relative ? <span className={cx('relative')}>{relative}</span> : null}
        </div>

        <div className={cx('summaryRight')}>
          <div className={cx('dots')} aria-hidden>
            {uniqueCategories.map((c) => (
              <span
                key={c}
                className={cx('summaryDot')}
                style={{ background: CATEGORY_META[c].colorVar }}
              />
            ))}
          </div>
          <span className={cx('count')}>{group.entries.length}개</span>
          <span className={cx('chevron', { open: expanded })}>
            <IconChevronDownLine width={18} height={18} />
          </span>
        </div>
      </button>

      {expanded ? (
        <div className={cx('body')}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={group.entries.map((e) => e.id)}
              strategy={verticalListSortingStrategy}
            >
              <ul className={cx('list')}>
                {group.entries.map((entry) => (
                  <WorkoutRow key={entry.id} entry={entry} onDelete={onDelete} />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        </div>
      ) : null}
    </section>
  );
}
