'use client';

import { IconTrophyFill } from '@karrotmarket/react-monochrome-icon';
import classNames from 'classnames/bind';
import { LIFTS, computeBigThree } from '@/lib/bigThree';
import type { WorkoutEntry } from '@/lib/types';
import styles from '@/components/achievements/AchievementsView.module.scss';

const cx = classNames.bind(styles);

interface AchievementsViewProps {
  entries: WorkoutEntry[];
}

export function AchievementsView({ entries }: AchievementsViewProps) {
  const big3 = computeBigThree(entries);
  const measured = [big3.squat, big3.bench, big3.deadlift].filter(
    (v) => v !== null,
  ).length;

  return (
    <div className={cx('page')}>
      <header className={cx('header')}>
        <span className={cx('brand')}>업적</span>
      </header>

      <main className={cx('main')}>
        <section className={cx('hero')}>
          <div className={cx('heroIcon')}>
            <IconTrophyFill width={22} height={22} />
          </div>
          <p className={cx('heroLabel')}>내 3대</p>
          <p className={cx('heroTotal')}>
            <span className={cx('heroNum')}>{big3.total}</span>
            <span className={cx('heroUnit')}>kg</span>
          </p>
          {measured < 3 ? (
            <p className={cx('heroHint')}>
              {measured === 0
                ? '아직 3대를 측정하지 않았어요'
                : `${3 - measured}개 종목이 아직 미측정이에요`}
            </p>
          ) : null}
        </section>

        <div className={cx('cards')}>
          {LIFTS.map((meta) => {
            const value = big3[meta.id];
            return (
              <div key={meta.id} className={cx('card')}>
                <span className={cx('cardEmoji')}>{meta.emoji}</span>
                <span className={cx('cardLabel')}>{meta.label}</span>
                <span className={cx('cardValue', { empty: value === null })}>
                  {value !== null ? `${value}kg` : '미측정'}
                </span>
              </div>
            );
          })}
        </div>

        <p className={cx('note')}>
          기록을 추가할 때 <b>3대 운동</b>으로 선택하면, 그 종목의 최고 무게가
          여기에 자동으로 반영돼요.
        </p>
      </main>
    </div>
  );
}
