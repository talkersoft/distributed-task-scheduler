// Copyright Talkersoft LLC
// /backend/task-entities/src/utility/formatDateTime.ts
export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('default', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date);
}
