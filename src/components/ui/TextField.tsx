'use client';

import type { HTMLInputTypeAttribute } from 'react';
import {
  TextFieldInput,
  TextFieldRoot,
  TextFieldSuffixText,
} from '@seed-design/react';

interface TextFieldProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  inputMode?: 'text' | 'numeric' | 'decimal';
  variant?: 'outline' | 'underline';
  size?: 'large' | 'medium' | 'responsive';
  suffix?: string;
  maxLength?: number;
  autoFocus?: boolean;
  'aria-label'?: string;
}

export function TextField({
  value,
  onValueChange,
  placeholder,
  type = 'text',
  inputMode,
  variant = 'outline',
  size = 'large',
  suffix,
  maxLength,
  autoFocus,
  'aria-label': ariaLabel,
}: TextFieldProps) {
  return (
    <TextFieldRoot
      value={value}
      onValueChange={onValueChange}
      variant={variant}
      size={size}
    >
      <TextFieldInput
        type={type}
        inputMode={inputMode}
        placeholder={placeholder}
        maxLength={maxLength}
        autoFocus={autoFocus}
        aria-label={ariaLabel}
      />
      {suffix ? <TextFieldSuffixText>{suffix}</TextFieldSuffixText> : null}
    </TextFieldRoot>
  );
}
