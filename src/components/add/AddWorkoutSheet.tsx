'use client';

import { ActionButton } from '@seed-design/react';
import { IconXmarkLine } from '@karrotmarket/react-monochrome-icon';
import classNames from 'classnames/bind';
import { useState } from 'react';
import { TextField } from '@/components/ui/TextField';
import { CATEGORY_LIST } from '@/lib/categories';
import { kstDateString } from '@/lib/date';
import type { Category, WorkoutEntry } from '@/lib/types';
import type { NewWorkoutInput } from '@/hooks/useStore';
import styles from '@/components/add/AddWorkoutSheet.module.scss';

const cx = classNames.bind(styles);

interface AddWorkoutSheetProps {
  /** 있으면 수정 모드, 없으면 추가 모드 */
  initial?: WorkoutEntry;
  onClose: () => void;
  onSubmit: (input: NewWorkoutInput) => void;
}

function toPositiveInt(value: string, fallback = 0): number {
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function toWeight(value: string): number {
  const n = Number.parseFloat(value);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export function AddWorkoutSheet({
  initial,
  onClose,
  onSubmit,
}: AddWorkoutSheetProps) {
  const isEdit = Boolean(initial);
  const [name, setName] = useState(initial?.name ?? '');
  const [category, setCategory] = useState<Category>(initial?.category ?? 'lower');
  const [sets, setSets] = useState(initial ? String(initial.sets) : '3');
  const [reps, setReps] = useState(initial ? String(initial.reps) : '10');
  const [weight, setWeight] = useState(
    initial && initial.weight > 0 ? String(initial.weight) : '',
  );
  const [date, setDate] = useState(() => initial?.date ?? kstDateString());

  const canSubmit =
    name.trim().length > 0 && toPositiveInt(sets) > 0 && toPositiveInt(reps) > 0;

  const handleSubmit = () => {
    if (!canSubmit) {
      return;
    }
    onSubmit({
      name: name.trim(),
      category,
      sets: toPositiveInt(sets, 1),
      reps: toPositiveInt(reps, 1),
      weight: toWeight(weight),
      date,
    });
    onClose();
  };

  return (
    <div
      className={cx('overlay')}
      role="dialog"
      aria-modal="true"
      aria-label={isEdit ? '운동 기록 수정' : '운동 기록 추가'}
    >
      <button
        type="button"
        className={cx('scrim')}
        onClick={onClose}
        aria-label="닫기"
      />
      <div className={cx('sheet')}>
        <div className={cx('grabber')} aria-hidden />
        <div className={cx('sheetHeader')}>
          <h2 className={cx('sheetTitle')}>{isEdit ? '운동 수정' : '운동 기록'}</h2>
          <button
            type="button"
            className={cx('close')}
            onClick={onClose}
            aria-label="닫기"
          >
            <IconXmarkLine width={22} height={22} />
          </button>
        </div>

        <div className={cx('form')}>
          <div className={cx('field')}>
            <span className={cx('label')}>운동명</span>
            <TextField
              value={name}
              onValueChange={setName}
              placeholder="예: 스쿼트"
              maxLength={30}
              aria-label="운동명"
              autoFocus
            />
          </div>

          <div className={cx('field')}>
            <span className={cx('label')}>부위</span>
            <div className={cx('categories')}>
              {CATEGORY_LIST.map((meta) => (
                <button
                  key={meta.id}
                  type="button"
                  className={cx('categoryChip', {
                    selected: category === meta.id,
                  })}
                  style={{ ['--chip-color' as string]: meta.colorVar }}
                  onClick={() => setCategory(meta.id)}
                  aria-pressed={category === meta.id}
                >
                  <span className={cx('chipEmoji')}>{meta.emoji}</span>
                  {meta.label}
                </button>
              ))}
            </div>
          </div>

          <div className={cx('row')}>
            <div className={cx('field')}>
              <span className={cx('label')}>세트</span>
              <TextField
                value={sets}
                onValueChange={setSets}
                inputMode="numeric"
                suffix="세트"
                aria-label="세트 수"
              />
            </div>
            <div className={cx('field')}>
              <span className={cx('label')}>반복</span>
              <TextField
                value={reps}
                onValueChange={setReps}
                inputMode="numeric"
                suffix="회"
                aria-label="반복 횟수"
              />
            </div>
          </div>

          <div className={cx('row')}>
            <div className={cx('field')}>
              <span className={cx('label')}>무게 (선택)</span>
              <TextField
                value={weight}
                onValueChange={setWeight}
                inputMode="decimal"
                placeholder="0"
                suffix="kg"
                aria-label="무게"
              />
            </div>
            <div className={cx('field')}>
              <span className={cx('label')}>날짜</span>
              <input
                type="date"
                className={cx('dateInput')}
                value={date}
                max={kstDateString()}
                onChange={(e) => setDate(e.target.value)}
                aria-label="날짜"
              />
            </div>
          </div>
        </div>

        <div className={cx('footer')}>
          <ActionButton
            variant="brandSolid"
            size="large"
            onClick={handleSubmit}
            disabled={!canSubmit}
            style={{ width: '100%' }}
          >
            {isEdit ? '저장' : '기록하기'}
          </ActionButton>
        </div>
      </div>
    </div>
  );
}
