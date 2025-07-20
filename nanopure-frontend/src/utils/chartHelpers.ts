export function formatTimeLabel(timestamp: string): string {
  // Example: convert '2024-06-01T12:34:56Z' to '12:34'
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
} 