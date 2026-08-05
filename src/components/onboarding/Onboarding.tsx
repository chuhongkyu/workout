'use client';

import { ActionButton } from '@seed-design/react';
import { IconDumbbellLine } from '@karrotmarket/react-monochrome-icon';
import classNames from 'classnames/bind';
import { useState } from 'react';
import { TextField } from '@/components/ui/TextField';
import styles from '@/components/onboarding/Onboarding.module.scss';

const cx = classNames.bind(styles);

interface OnboardingProps {
  onSubmit: (name: string) => void;
}

export function Onboarding({ onSubmit }: OnboardingProps) {
  const [name, setName] = useState('');
  const trimmed = name.trim();

  const handleSubmit = () => {
    if (trimmed) {
      onSubmit(trimmed);
    }
  };

  return (
    <main className={cx('screen')}>
      <div className={cx('content')}>
        <div className={cx('logo')}>
          <IconDumbbellLine width={40} height={40} />
        </div>
        <h1 className={cx('title')}>오운완에 오신 걸 환영해요</h1>
        <p className={cx('subtitle')}>
          매일의 운동을 기록하고
          <br />
          오늘 뭘 하면 좋을지 추천받아 보세요.
        </p>

        <div className={cx('field')}>
          <label className={cx('label')} htmlFor="onboarding-name">
            어떻게 불러드릴까요?
          </label>
          <TextField
            aria-label="이름"
            value={name}
            onValueChange={setName}
            placeholder="이름 또는 닉네임"
            maxLength={12}
            autoFocus
          />
        </div>
      </div>

      <div className={cx('cta')}>
        <ActionButton
          variant="brandSolid"
          size="large"
          onClick={handleSubmit}
          disabled={!trimmed}
          style={{ width: '100%' }}
        >
          시작하기
        </ActionButton>
      </div>
    </main>
  );
}
