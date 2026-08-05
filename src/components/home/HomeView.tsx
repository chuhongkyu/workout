'use client';

import { IconDumbbellLine, IconPlusLine } from '@karrotmarket/react-monochrome-icon';
import classNames from 'classnames/bind';
import { useMemo, useState } from 'react';
import { AddWorkoutSheet } from '@/components/add/AddWorkoutSheet';
import { DateGroup } from '@/components/home/DateGroup';
import { RecommendationHeader } from '@/components/home/RecommendationHeader';
import { SettingsSheet } from '@/components/home/SettingsSheet';
import { recommend } from '@/lib/recommend';
import type { WorkoutEntry } from '@/lib/types';
import type { NewWorkoutInput } from '@/hooks/useStore';
import type { DateGroup as DateGroupData } from '@/lib/group';
import styles from '@/components/home/HomeView.module.scss';

const cx = classNames.bind(styles);

interface HomeViewProps {
  userName: string;
  email: string | null;
  groups: DateGroupData[];
  entries: WorkoutEntry[];
  onAdd: (input: NewWorkoutInput) => void;
  onDelete: (id: string) => void;
  onReorder: (date: string, orderedIds: string[]) => void;
  onRename: (name: string) => void;
  onResetAll: () => void;
  onSignOut: () => void;
}

export function HomeView({
  userName,
  email,
  groups,
  entries,
  onAdd,
  onDelete,
  onReorder,
  onRename,
  onResetAll,
  onSignOut,
}: HomeViewProps) {
  const [addOpen, setAddOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  // 사용자가 직접 토글한 날짜만 기록. 그 외에는 최신 날짜(첫 그룹)만 펼침.
  const [overrides, setOverrides] = useState<Map<string, boolean>>(new Map());

  const recommendation = useMemo(
    () => recommend(entries, userName),
    [entries, userName],
  );

  const isExpanded = (date: string, index: number): boolean => {
    const override = overrides.get(date);
    return override === undefined ? index === 0 : override;
  };

  const toggle = (date: string, index: number) => {
    setOverrides((prev) => {
      const next = new Map(prev);
      next.set(date, !isExpanded(date, index));
      return next;
    });
  };

  return (
    <div className={cx('page')}>
      <RecommendationHeader
        recommendation={recommendation}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <main className={cx('main')}>
        {groups.length === 0 ? (
          <div className={cx('empty')}>
            <div className={cx('emptyIcon')}>
              <IconDumbbellLine width={32} height={32} />
            </div>
            <p className={cx('emptyTitle')}>아직 기록이 없어요</p>
            <p className={cx('emptyText')}>
              아래 + 버튼으로 첫 운동을 기록해보세요.
            </p>
          </div>
        ) : (
          <div className={cx('groups')}>
            {groups.map((group, index) => (
              <DateGroup
                key={group.date}
                group={group}
                expanded={isExpanded(group.date, index)}
                onToggle={() => toggle(group.date, index)}
                onDelete={onDelete}
                onReorder={onReorder}
              />
            ))}
          </div>
        )}
      </main>

      <button
        type="button"
        className={cx('fab')}
        onClick={() => setAddOpen(true)}
        aria-label="운동 기록 추가"
      >
        <IconPlusLine width={26} height={26} />
      </button>

      {addOpen ? (
        <AddWorkoutSheet onClose={() => setAddOpen(false)} onSubmit={onAdd} />
      ) : null}
      {settingsOpen ? (
        <SettingsSheet
          currentName={userName}
          email={email}
          onClose={() => setSettingsOpen(false)}
          onSaveName={onRename}
          onResetAll={onResetAll}
          onSignOut={onSignOut}
        />
      ) : null}
    </div>
  );
}
