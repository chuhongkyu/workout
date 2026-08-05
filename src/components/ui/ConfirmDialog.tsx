'use client';

import {
  ActionButton,
  DialogAction,
  DialogBackdrop,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
} from '@seed-design/react';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
}

/** seed-design Dialog 기반 확인창 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel = '취소',
  destructive = false,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <DialogRoot open={open} onOpenChange={(next) => onOpenChange(next)}>
      <DialogBackdrop />
      <DialogPositioner>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description ? (
              <DialogDescription>{description}</DialogDescription>
            ) : null}
          </DialogHeader>
          <DialogFooter>
            <DialogAction asChild>
              <ActionButton variant="neutralWeak" size="medium">
                {cancelLabel}
              </ActionButton>
            </DialogAction>
            <DialogAction asChild>
              <ActionButton
                variant={destructive ? 'criticalSolid' : 'brandSolid'}
                size="medium"
                onClick={onConfirm}
              >
                {confirmLabel}
              </ActionButton>
            </DialogAction>
          </DialogFooter>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  );
}
