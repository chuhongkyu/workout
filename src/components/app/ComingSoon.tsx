'use client';

import {
  IconMapLine,
  IconPeople3Line,
} from '@karrotmarket/react-monochrome-icon';
import classNames from 'classnames/bind';
import styles from '@/components/app/ComingSoon.module.scss';

const cx = classNames.bind(styles);

interface ComingSoonProps {
  tab: 'friends' | 'map';
}

export function ComingSoon({ tab }: ComingSoonProps) {
  const meta =
    tab === 'friends'
      ? {
          icon: <IconPeople3Line width={36} height={36} />,
          title: '친구와 함께 운동',
          text: '친구를 초대해서 서로 얼마나 운동했는지\n확인하고 응원하는 기능을 준비 중이에요.',
        }
      : {
          icon: <IconMapLine width={36} height={36} />,
          title: '운동 지도',
          text: '친구들이 어디서 운동하고 있는지\n지도에서 한눈에 보여줄 예정이에요.',
        };

  return (
    <div className={cx('screen')}>
      <div className={cx('icon')}>{meta.icon}</div>
      <span className={cx('badge')}>준비 중</span>
      <h2 className={cx('title')}>{meta.title}</h2>
      <p className={cx('text')}>{meta.text}</p>
    </div>
  );
}
