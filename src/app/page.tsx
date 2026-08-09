'use client';

import { AppShell } from '@/components/app/AppShell';
import { Login } from '@/components/auth/Login';
import { SupabaseNotice } from '@/components/auth/SupabaseNotice';
import { Onboarding } from '@/components/onboarding/Onboarding';
import { useStore } from '@/hooks/useStore';

export default function Page() {
  const store = useStore();

  // 환경변수 미설정
  if (!store.configured) {
    return <SupabaseNotice />;
  }

  // 세션 확인 중
  if (store.authStatus === 'loading') {
    return null;
  }

  // 로그아웃 상태 → 이메일+비밀번호 로그인
  if (store.authStatus === 'signed_out') {
    return <Login onSubmit={store.signInOrSignUp} />;
  }

  // 로그인됨, 프로필 조회 중
  if (!store.profileLoaded) {
    return null;
  }

  // 프로필(이름) 없음 → 이름 온보딩
  if (!store.profileName) {
    return <Onboarding onSubmit={store.setName} />;
  }

  return <AppShell store={store} />;
}
