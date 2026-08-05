'use client';

import { ActionButton } from '@seed-design/react';
import { IconXmarkLine } from '@karrotmarket/react-monochrome-icon';
import classNames from 'classnames/bind';
import { useState } from 'react';
import { TextField } from '@/components/ui/TextField';
import styles from '@/components/add/AddWorkoutSheet.module.scss';
import local from '@/components/home/SettingsSheet.module.scss';

const cx = classNames.bind(styles);
const lx = classNames.bind(local);

interface SettingsSheetProps {
  currentName: string;
  email: string | null;
  onClose: () => void;
  onSaveName: (name: string) => void;
  onResetAll: () => void;
  onSignOut: () => void;
}

export function SettingsSheet({
  currentName,
  email,
  onClose,
  onSaveName,
  onResetAll,
  onSignOut,
}: SettingsSheetProps) {
  const [name, setName] = useState(currentName);
  const trimmed = name.trim();

  const handleSave = () => {
    if (trimmed) {
      onSaveName(trimmed);
      onClose();
    }
  };

  const handleReset = () => {
    const ok = window.confirm(
      '모든 운동 기록을 삭제할까요?\n이 작업은 되돌릴 수 없어요.',
    );
    if (ok) {
      onResetAll();
      onClose();
    }
  };

  const handleSignOut = () => {
    onSignOut();
    onClose();
  };

  return (
    <div className={cx('overlay')} role="dialog" aria-modal="true" aria-label="설정">
      <button type="button" className={cx('scrim')} onClick={onClose} aria-label="닫기" />
      <div className={cx('sheet')}>
        <div className={cx('grabber')} aria-hidden />
        <div className={cx('sheetHeader')}>
          <h2 className={cx('sheetTitle')}>설정</h2>
          <button type="button" className={cx('close')} onClick={onClose} aria-label="닫기">
            <IconXmarkLine width={22} height={22} />
          </button>
        </div>

        <div className={cx('form')}>
          <div className={cx('field')}>
            <span className={cx('label')}>이름</span>
            <TextField
              value={name}
              onValueChange={setName}
              placeholder="이름 또는 닉네임"
              maxLength={12}
              aria-label="이름"
            />
          </div>

          {email ? (
            <div className={lx('account')}>
              <span className={lx('accountLabel')}>로그인 계정</span>
              <div className={lx('accountRow')}>
                <span className={lx('accountEmail')}>{email}</span>
                <button
                  type="button"
                  className={lx('signOutButton')}
                  onClick={handleSignOut}
                >
                  로그아웃
                </button>
              </div>
            </div>
          ) : null}

          <div className={lx('danger')}>
            <button type="button" className={lx('resetButton')} onClick={handleReset}>
              모든 기록 삭제
            </button>
          </div>
        </div>

        <div className={cx('footer')}>
          <ActionButton
            variant="brandSolid"
            size="large"
            onClick={handleSave}
            disabled={!trimmed}
            style={{ width: '100%' }}
          >
            저장
          </ActionButton>
        </div>
      </div>
    </div>
  );
}
