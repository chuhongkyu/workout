import type { WorkoutEntry } from '@/lib/types';

export interface DateGroup {
  date: string;
  entries: WorkoutEntry[];
}

/** 날짜별로 묶고, 날짜는 최신순 / 그룹 내부는 order 오름차순으로 정렬 */
export function groupByDate(entries: WorkoutEntry[]): DateGroup[] {
  const map = new Map<string, WorkoutEntry[]>();

  for (const entry of entries) {
    const list = map.get(entry.date);
    if (list) {
      list.push(entry);
    } else {
      map.set(entry.date, [entry]);
    }
  }

  const groups: DateGroup[] = [];
  for (const [date, list] of map) {
    list.sort((a, b) => {
      if (a.order !== b.order) {
        return a.order - b.order;
      }
      return a.createdAt - b.createdAt;
    });
    groups.push({ date, entries: list });
  }

  groups.sort((a, b) => (a.date < b.date ? 1 : -1));
  return groups;
}
