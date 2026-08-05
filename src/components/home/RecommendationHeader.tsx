'use client';

import {
  IconGearLine,
  IconSparkle2Line,
} from '@karrotmarket/react-monochrome-icon';
import classNames from 'classnames/bind';
import { CategoryBadge } from '@/components/ui/CategoryBadge';
import type { Recommendation } from '@/lib/recommend';
import styles from '@/components/home/RecommendationHeader.module.scss';

const cx = classNames.bind(styles);

interface RecommendationHeaderProps {
  recommendation: Recommendation;
  onOpenSettings: () => void;
}

export function RecommendationHeader({
  recommendation,
  onOpenSettings,
}: RecommendationHeaderProps) {
  return (
    <header className={cx('header')}>
      <div className={cx('topbar')}>
        <span className={cx('brand')}>오운완</span>
        <button
          type="button"
          className={cx('settings')}
          onClick={onOpenSettings}
          aria-label="설정"
        >
          <IconGearLine width={22} height={22} />
        </button>
      </div>

      <div className={cx('card')}>
        <div className={cx('cardIcon')}>
          <IconSparkle2Line width={20} height={20} />
        </div>
        <div className={cx('cardBody')}>
          <p className={cx('headline')}>{recommendation.headline}</p>
          <p className={cx('reason')}>{recommendation.reason}</p>
          {recommendation.category ? (
            <div className={cx('badgeRow')}>
              <CategoryBadge category={recommendation.category} size="md" />
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
