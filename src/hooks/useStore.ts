'use client';

import { useMemo, useSyncExternalStore } from 'react';
import { groupByDate } from '@/lib/group';
import { workoutStore } from '@/lib/store';

export type { NewWorkoutInput } from '@/lib/store';

export function useStore() {
  const snapshot = useSyncExternalStore(
    workoutStore.subscribe,
    workoutStore.getSnapshot,
    workoutStore.getServerSnapshot,
  );

  const groups = useMemo(
    () => groupByDate(snapshot.entries),
    [snapshot.entries],
  );

  return {
    configured: snapshot.configured,
    authStatus: snapshot.authStatus,
    userId: snapshot.userId,
    email: snapshot.email,
    profileName: snapshot.profileName,
    profileLoaded: snapshot.profileLoaded,
    entries: snapshot.entries,
    groups,
    syncing: snapshot.syncing,
    signInOrSignUp: workoutStore.signInOrSignUp,
    signOut: workoutStore.signOut,
    setName: workoutStore.setName,
    addEntry: workoutStore.addEntry,
    updateEntry: workoutStore.updateEntry,
    removeEntry: workoutStore.removeEntry,
    reorderWithinDate: workoutStore.reorderWithinDate,
    resetAll: workoutStore.resetAll,
  };
}
