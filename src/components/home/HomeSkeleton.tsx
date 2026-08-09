'use client';

import { Skeleton } from '@seed-design/react';
import classNames from 'classnames/bind';
import styles from '@/components/home/HomeSkeleton.module.scss';

const cx = classNames.bind(styles);

/** 홈 리스트 로딩 중 표시하는 스켈레톤 (seed-design Skeleton) */
export function HomeSkeleton() {
  return (
    <div className={cx('wrap')} aria-hidden>
      {[0, 1, 2].map((i) => (
        <div key={i} className={cx('card')}>
          <div className={cx('head')}>
            <Skeleton radius="8" width="96px" height="18px" />
            <Skeleton radius="8" width="40px" height="18px" />
          </div>
          {i === 0 ? (
            <div className={cx('rows')}>
              <Skeleton radius="16" width="100%" height="58px" />
              <Skeleton radius="16" width="100%" height="58px" />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
