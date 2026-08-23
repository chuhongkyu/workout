import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Category, Lift, WorkoutEntry } from '@/lib/types';

export interface NewWorkoutInput {
  name: string;
  sets: number;
  reps: number;
  weight: number;
  category: Category;
  date: string;
  lift?: Lift | null;
}

export type AuthStatus = 'loading' | 'signed_out' | 'signed_in';

export interface StoreSnapshot {
  configured: boolean;
  authStatus: AuthStatus;
  userId: string | null;
  email: string | null;
  profileName: string | null;
  /** 프로필 조회를 한 번이라도 마쳤는지 (온보딩 필요 여부 판단용) */
  profileLoaded: boolean;
  entries: WorkoutEntry[];
  /** 서버와 동기화 진행 중 */
  syncing: boolean;
  /** 기록 목록을 한 번이라도 성공적으로 받아왔는지 */
  entriesLoaded: boolean;
  /** 마지막 목록 조회가 실패했는지 (네트워크 등) */
  loadError: boolean;
}

interface WorkoutRow {
  id: string;
  user_id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number | string;
  category: Category;
  date: string;
  sort_order: number;
  created_at: string;
  lift: Lift | null;
}

const SERVER_SNAPSHOT: StoreSnapshot = {
  configured: isSupabaseConfigured,
  authStatus: 'loading',
  userId: null,
  email: null,
  profileName: null,
  profileLoaded: false,
  entries: [],
  syncing: false,
  entriesLoaded: false,
  loadError: false,
};

let snapshot: StoreSnapshot = SERVER_SNAPSHOT;
let initialized = false;
let currentUserId: string | null = null;
const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) {
    listener();
  }
}

function set(patch: Partial<StoreSnapshot>): void {
  snapshot = { ...snapshot, ...patch };
  emit();
}

// ── 오프라인 캐시 (기기별 즉시 렌더용) ────────────────────────
function entriesCacheKey(uid: string): string {
  return `workout:cache:entries:v2:${uid}`;
}
function nameCacheKey(uid: string): string {
  return `workout:cache:name:v2:${uid}`;
}

function loadEntriesCache(uid: string): WorkoutEntry[] {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(entriesCacheKey(uid));
    const parsed = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed) ? (parsed as WorkoutEntry[]) : [];
  } catch {
    return [];
  }
}

function saveEntriesCache(uid: string, entries: WorkoutEntry[]): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(entriesCacheKey(uid), JSON.stringify(entries));
  } catch {
    // 무시
  }
}

function loadNameCache(uid: string): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    return window.localStorage.getItem(nameCacheKey(uid));
  } catch {
    return null;
  }
}

function saveNameCache(uid: string, name: string): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(nameCacheKey(uid), name);
  } catch {
    // 무시
  }
}

function rowToEntry(row: WorkoutRow): WorkoutEntry {
  return {
    id: row.id,
    name: row.name,
    sets: row.sets,
    reps: row.reps,
    weight: Number(row.weight),
    category: row.category,
    date: row.date,
    order: row.sort_order,
    createdAt: new Date(row.created_at).getTime(),
    lift: row.lift ?? null,
  };
}

/** 로컬 낙관적 업데이트 + 캐시 저장 */
function applyEntries(entries: WorkoutEntry[]): void {
  set({ entries });
  if (currentUserId) {
    saveEntriesCache(currentUserId, entries);
  }
}

function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

// ── 세션 처리 ────────────────────────────────────────────────
function handleSession(
  session: { user?: { id?: string; email?: string } } | null,
): void {
  const uid = session?.user?.id ?? null;
  const email = session?.user?.email ?? null;

  if (!uid) {
    currentUserId = null;
    set({
      authStatus: 'signed_out',
      userId: null,
      email: null,
      profileName: null,
      profileLoaded: false,
      entries: [],
      syncing: false,
    });
    return;
  }

  if (uid === currentUserId) {
    // 토큰 갱신 등 — 데이터 유지
    set({ email });
    return;
  }

  currentUserId = uid;
  const cachedName = loadNameCache(uid);
  set({
    authStatus: 'signed_in',
    userId: uid,
    email,
    profileName: cachedName,
    profileLoaded: cachedName !== null,
    entries: loadEntriesCache(uid),
    syncing: true,
  });

  // Supabase auth 콜백 내부에서 다른 supabase 호출을 await 하면 데드락 위험 → 지연 실행
  setTimeout(() => {
    void fetchAll(uid);
  }, 0);
}

const FETCH_TIMEOUT_MS = 10_000;

async function fetchAll(uid: string): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) {
    return;
  }
  set({ syncing: true });

  // 응답이 너무 오래 걸리면(행업 등) 에러로 처리해 재시도 UI를 띄운다
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    if (currentUserId === uid) {
      set({ profileLoaded: true, syncing: false, loadError: true });
    }
  }, FETCH_TIMEOUT_MS);

  try {
    const [profileResult, workoutsResult] = await Promise.all([
      supabase.from('profiles').select('name').eq('id', uid).maybeSingle(),
      supabase.from('workouts').select('*').eq('user_id', uid),
    ]);
    clearTimeout(timer);
    if (timedOut || currentUserId !== uid) {
      return;
    }

    // 프로필: 조회 에러면 캐시 이름 유지 (에러를 "프로필 없음"으로 오인 방지)
    const profileName = profileResult.error
      ? (snapshot.profileName ?? null)
      : ((profileResult.data as { name: string } | null)?.name ?? null);

    // 목록 조회 실패: 기존(캐시) 목록 유지하고 에러 표시 — 빈 목록으로 덮지 않음
    if (workoutsResult.error) {
      set({ profileName, profileLoaded: true, syncing: false, loadError: true });
      return;
    }

    const rows = (workoutsResult.data as WorkoutRow[] | null) ?? [];
    const entries = rows.map(rowToEntry);
    saveEntriesCache(uid, entries);
    if (profileName) {
      saveNameCache(uid, profileName);
    }

    set({
      profileName,
      profileLoaded: true,
      entries,
      syncing: false,
      entriesLoaded: true,
      loadError: false,
    });
  } catch {
    clearTimeout(timer);
    if (!timedOut && currentUserId === uid) {
      set({ profileLoaded: true, syncing: false, loadError: true });
    }
  }
}

function ensureInitialized(): void {
  if (initialized) {
    return;
  }
  initialized = true;

  const supabase = getSupabase();
  if (!supabase) {
    snapshot = { ...SERVER_SNAPSHOT };
    return;
  }

  supabase.auth.onAuthStateChange((_event, session) => {
    handleSession(session);
  });

  if (typeof document !== 'undefined') {
    // 탭이 다시 보일 때(오랜만에 복귀 포함) 최신화
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && currentUserId) {
        void fetchAll(currentUserId);
      }
    });
  }
  if (typeof window !== 'undefined') {
    // 네트워크 복구 시 최신화
    window.addEventListener('online', () => {
      if (currentUserId) {
        void fetchAll(currentUserId);
      }
    });
  }
}

export const workoutStore = {
  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  getSnapshot(): StoreSnapshot {
    ensureInitialized();
    return snapshot;
  },

  getServerSnapshot(): StoreSnapshot {
    return SERVER_SNAPSHOT;
  },

  /** 수동 새로고침 (재시도 버튼 등) */
  refetch(): void {
    if (currentUserId) {
      void fetchAll(currentUserId);
    }
  },

  /**
   * 이메일+비밀번호 로그인. 계정이 없으면 자동 가입.
   * 반환 코드로 UI가 메시지를 구분한다.
   * @throws Error('WRONG_PASSWORD' | 'EMAIL_CONFIRM_REQUIRED' | 기타)
   */
  async signInOrSignUp(email: string, password: string): Promise<void> {
    const supabase = getSupabase();
    if (!supabase) {
      throw new Error('Supabase가 설정되지 않았습니다.');
    }
    const em = email.trim();

    const signIn = await supabase.auth.signInWithPassword({
      email: em,
      password,
    });
    if (!signIn.error) {
      return;
    }

    // 로그인 실패 → 신규 가입 시도
    const signUp = await supabase.auth.signUp({ email: em, password });
    if (signUp.error) {
      // 이미 가입된 이메일인데 로그인 실패 = 비밀번호 오류
      if (/already registered|already been registered/i.test(signUp.error.message)) {
        throw new Error('WRONG_PASSWORD');
      }
      throw signUp.error;
    }
    // 세션이 안 생기면 = 이메일 인증(Confirm email)이 켜져 있음
    if (!signUp.data.session) {
      throw new Error('EMAIL_CONFIRM_REQUIRED');
    }
  },

  async signOut(): Promise<void> {
    const supabase = getSupabase();
    if (!supabase) {
      return;
    }
    await supabase.auth.signOut();
  },

  async setName(name: string): Promise<void> {
    const uid = currentUserId;
    const supabase = getSupabase();
    if (!uid || !supabase) {
      return;
    }
    const trimmed = name.trim();
    set({ profileName: trimmed, profileLoaded: true });
    saveNameCache(uid, trimmed);
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: uid, name: trimmed });
    if (error) {
      void fetchAll(uid);
    }
  },

  async addEntry(input: NewWorkoutInput): Promise<void> {
    const uid = currentUserId;
    const supabase = getSupabase();
    if (!uid || !supabase) {
      return;
    }
    const sameDay = snapshot.entries.filter((e) => e.date === input.date);
    const minOrder = sameDay.reduce((min, e) => Math.min(min, e.order), 0);
    const entry: WorkoutEntry = {
      id: createId(),
      name: input.name.trim(),
      sets: input.sets,
      reps: input.reps,
      weight: input.weight,
      category: input.category,
      date: input.date,
      createdAt: Date.now(),
      order: minOrder - 1,
      lift: input.lift ?? null,
    };
    applyEntries([...snapshot.entries, entry]);

    const { error } = await supabase.from('workouts').insert({
      id: entry.id,
      user_id: uid,
      name: entry.name,
      sets: entry.sets,
      reps: entry.reps,
      weight: entry.weight,
      category: entry.category,
      date: entry.date,
      sort_order: entry.order,
      lift: entry.lift,
    });
    if (error) {
      void fetchAll(uid);
    }
  },

  async updateEntry(id: string, input: NewWorkoutInput): Promise<void> {
    const uid = currentUserId;
    const supabase = getSupabase();
    if (!uid || !supabase) {
      return;
    }
    applyEntries(
      snapshot.entries.map((e) =>
        e.id === id
          ? {
              ...e,
              name: input.name.trim(),
              sets: input.sets,
              reps: input.reps,
              weight: input.weight,
              category: input.category,
              date: input.date,
              lift: input.lift ?? null,
            }
          : e,
      ),
    );
    const { error } = await supabase
      .from('workouts')
      .update({
        name: input.name.trim(),
        sets: input.sets,
        reps: input.reps,
        weight: input.weight,
        category: input.category,
        date: input.date,
        lift: input.lift ?? null,
      })
      .eq('id', id);
    if (error) {
      void fetchAll(uid);
    }
  },

  async removeEntry(id: string): Promise<void> {
    const uid = currentUserId;
    const supabase = getSupabase();
    if (!uid || !supabase) {
      return;
    }
    applyEntries(snapshot.entries.filter((e) => e.id !== id));
    const { error } = await supabase.from('workouts').delete().eq('id', id);
    if (error) {
      void fetchAll(uid);
    }
  },

  async reorderWithinDate(date: string, orderedIds: string[]): Promise<void> {
    const uid = currentUserId;
    const supabase = getSupabase();
    if (!uid || !supabase) {
      return;
    }
    const orderMap = new Map<string, number>();
    orderedIds.forEach((id, index) => orderMap.set(id, index));
    applyEntries(
      snapshot.entries.map((e) =>
        e.date === date && orderMap.has(e.id)
          ? { ...e, order: orderMap.get(e.id) as number }
          : e,
      ),
    );

    const results = await Promise.all(
      orderedIds.map((id, index) =>
        supabase.from('workouts').update({ sort_order: index }).eq('id', id),
      ),
    );
    if (results.some((r) => r.error)) {
      void fetchAll(uid);
    }
  },

  async resetAll(): Promise<void> {
    const uid = currentUserId;
    const supabase = getSupabase();
    if (!uid || !supabase) {
      return;
    }
    applyEntries([]);
    const { error } = await supabase
      .from('workouts')
      .delete()
      .eq('user_id', uid);
    if (error) {
      void fetchAll(uid);
    }
  },
};
