'use client';

import {
  IconDumbbellFill,
  IconDumbbellLine,
  IconPeople3Fill,
  IconPeople3Line,
  IconTrophyFill,
  IconTrophyLine,
} from '@karrotmarket/react-monochrome-icon';
import classNames from 'classnames/bind';
import styles from '@/components/app/BottomNav.module.scss';

const cx = classNames.bind(styles);

export type TabKey = 'record' | 'achievements' | 'friends';

const TABS = [
  { key: 'record', label: '기록', Line: IconDumbbellLine, Fill: IconDumbbellFill },
  { key: 'achievements', label: '업적', Line: IconTrophyLine, Fill: IconTrophyFill },
  { key: 'friends', label: '친구', Line: IconPeople3Line, Fill: IconPeople3Fill },
] as const;

interface BottomNavProps {
  active: TabKey;
  onChange: (tab: TabKey) => void;
}

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav className={cx('nav')} aria-label="주요 메뉴">
      {TABS.map(({ key, label, Line, Fill }) => {
        const isActive = active === key;
        const Icon = isActive ? Fill : Line;
        return (
          <button
            key={key}
            type="button"
            className={cx('item', { active: isActive })}
            onClick={() => onChange(key)}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon width={24} height={24} />
            <span className={cx('label')}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
