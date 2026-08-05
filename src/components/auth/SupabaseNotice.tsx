'use client';

import { IconDumbbellLine } from '@karrotmarket/react-monochrome-icon';
import classNames from 'classnames/bind';
import styles from '@/components/onboarding/Onboarding.module.scss';

const cx = classNames.bind(styles);

export function SupabaseNotice() {
  return (
    <main className={cx('screen')}>
      <div className={cx('content')}>
        <div className={cx('logo')}>
          <IconDumbbellLine width={40} height={40} />
        </div>
        <h1 className={cx('title')}>Supabase 설정이 필요해요</h1>
        <p className={cx('subtitle')}>
          로그인·동기화를 쓰려면 환경변수를 설정해야 해요.
        </p>
        <div className={cx('sentBox')}>
          <p className={cx('sentTitle')}>이렇게 설정하세요</p>
          <p className={cx('sentText')}>
            1. Supabase 프로젝트 생성
            <br />
            2. <code>supabase/schema.sql</code> 을 SQL Editor에서 실행
            <br />
            3. <code>.env.local</code> 에 URL·anon key 입력 (env.example 참고)
            <br />
            4. 개발 서버 재시작
          </p>
        </div>
      </div>
    </main>
  );
}
