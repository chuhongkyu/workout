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
  onSubmit: (email: string) => Promise<void>;
}

export function Login({ onSubmit }: LoginProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [error, setError] = useState('');

  const trimmed = email.trim();
  const valid = EMAIL_RE.test(trimmed);

  const handleSend = async () => {
    if (!valid || status === 'sending') {
      return;
    }
    setStatus('sending');
    setError('');
    try {
      await onSubmit(trimmed);
      setStatus('sent');
    } catch {
      setStatus('idle');
      setError('메일 발송에 실패했어요. 잠시 후 다시 시도해주세요.');
    }
  };

  if (status === 'sent') {
    return (
      <main className={cx('screen')}>
        <div className={cx('content')}>
          <div className={cx('logo')}>
            <IconDumbbellLine width={40} height={40} />
          </div>
          <h1 className={cx('title')}>메일함을 확인해주세요</h1>
          <p className={cx('subtitle')}>
            <span className={cx('emailStrong')}>{trimmed}</span> 으로
            <br />
            로그인 링크를 보냈어요. 링크를 누르면 로그인돼요.
          </p>
          <div className={cx('sentBox')}>
            <p className={cx('sentTitle')}>여러 기기에서 함께 쓰기</p>
            <p className={cx('sentText')}>
              같은 이메일로 로그인하면 폰·PC 어디서든 운동 기록이 그대로 보여요.
            </p>
          </div>
          <button
            type="button"
            className={cx('linkButton')}
            onClick={() => setStatus('idle')}
          >
            다른 이메일로 다시 보내기
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className={cx('screen')}>
      <div className={cx('content')}>
        <div className={cx('logo')}>
          <IconDumbbellLine width={40} height={40} />
        </div>
        <h1 className={cx('title')}>오운완 시작하기</h1>
        <p className={cx('subtitle')}>
          이메일로 로그인하면
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
          {error ? <p className={cx('errorText')}>{error}</p> : null}
          <p className={cx('hint')}>비밀번호 없이, 메일로 온 링크로 로그인해요.</p>
        </div>
      </div>

      <div className={cx('cta')}>
        <ActionButton
          variant="brandSolid"
          size="large"
          onClick={handleSend}
          disabled={!valid || status === 'sending'}
          style={{ width: '100%' }}
        >
          {status === 'sending' ? '보내는 중…' : '로그인 링크 받기'}
        </ActionButton>
      </div>
    </main>
  );
}
