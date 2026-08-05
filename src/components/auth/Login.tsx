'use client';

import { ActionButton } from '@seed-design/react';
import { IconDumbbellLine } from '@karrotmarket/react-monochrome-icon';
import classNames from 'classnames/bind';
import { useState } from 'react';
import { TextField } from '@/components/ui/TextField';
import styles from '@/components/onboarding/Onboarding.module.scss';

const cx = classNames.bind(styles);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface LoginProps {
  onSubmit: (email: string, password: string) => Promise<void>;
}

export function Login({ onSubmit }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const trimmed = email.trim();
  const valid = EMAIL_RE.test(trimmed) && password.length >= 6;

  const handleSubmit = async () => {
    if (!valid || loading) {
      return;
    }
    setLoading(true);
    setError('');
    try {
      await onSubmit(trimmed, password);
    } catch (e) {
      const code = e instanceof Error ? e.message : '';
      if (code === 'WRONG_PASSWORD') {
        setError('비밀번호가 올바르지 않아요.');
      } else if (code === 'EMAIL_CONFIRM_REQUIRED') {
        setError(
          'Supabase에서 이메일 인증(Confirm email)을 꺼주세요. 그 뒤 다시 시도하면 돼요.',
        );
      } else {
        setError('로그인에 실패했어요. 잠시 후 다시 시도해주세요.');
      }
      setLoading(false);
    }
  };

  return (
    <main className={cx('screen')}>
      <div className={cx('content')}>
        <div className={cx('logo')}>
          <IconDumbbellLine width={40} height={40} />
        </div>
        <h1 className={cx('title')}>오운완 시작하기</h1>
        <p className={cx('subtitle')}>
          이메일과 비밀번호로 로그인하면
          <br />
          모든 기기에서 운동 기록이 동기화돼요.
        </p>

        <div className={cx('field')}>
          <label className={cx('label')} htmlFor="login-email">
            이메일
          </label>
          <TextField
            aria-label="이메일"
            type="email"
            value={email}
            onValueChange={setEmail}
            placeholder="you@example.com"
            autoFocus
          />
        </div>

        <div className={cx('field')} style={{ marginTop: 16 }}>
          <label className={cx('label')} htmlFor="login-password">
            비밀번호
          </label>
          <TextField
            aria-label="비밀번호"
            type="password"
            value={password}
            onValueChange={setPassword}
            placeholder="6자 이상"
          />
          {error ? <p className={cx('errorText')}>{error}</p> : null}
          <p className={cx('hint')}>
            처음이면 자동으로 가입돼요. 다음부터 같은 이메일·비밀번호로 로그인하세요.
          </p>
        </div>
      </div>

      <div className={cx('cta')}>
        <ActionButton
          variant="brandSolid"
          size="large"
          onClick={handleSubmit}
          disabled={!valid || loading}
          style={{ width: '100%' }}
        >
          {loading ? '처리 중…' : '로그인 / 시작하기'}
        </ActionButton>
      </div>
    </main>
  );
}
