'use client';

import { useState } from 'react';
import { BottomNav, type TabKey } from '@/components/app/BottomNav';
import { ComingSoon } from '@/components/app/ComingSoon';
import { HomeView } from '@/components/home/HomeView';
import type { StoreApi } from '@/hooks/useStore';

interface AppShellProps {
  store: StoreApi;
}

export function AppShell({ store }: AppShellProps) {
  const [tab, setTab] = useState<TabKey>('record');

  return (
    <>
      {tab === 'record' ? (
        <HomeView
          userName={store.profileName ?? ''}
          email={store.email}
          groups={store.groups}
          entries={store.entries}
          syncing={store.syncing}
          loadError={store.loadError}
          onRetry={store.refetch}
          onAdd={store.addEntry}
          onUpdate={store.updateEntry}
          onDelete={store.removeEntry}
          onReorder={store.reorderWithinDate}
          onRename={store.setName}
          onResetAll={store.resetAll}
          onSignOut={store.signOut}
        />
      ) : tab === 'friends' ? (
        <ComingSoon tab="friends" />
      ) : (
        <ComingSoon tab="map" />
      )}

      <BottomNav active={tab} onChange={setTab} />
    </>
  );
}
