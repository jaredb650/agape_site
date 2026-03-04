export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatEventDate(dateString: string): {
  month: string;
  day: string;
  year: string;
  weekday: string;
  time: string;
} {
  const date = new Date(dateString);
  return {
    month: date.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    day: date.toLocaleDateString("en-US", { day: "numeric" }),
    year: date.toLocaleDateString("en-US", { year: "numeric" }),
    weekday: date.toLocaleDateString("en-US", { weekday: "long" }),
    time: date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    }),
  };
}

export function isUpcoming(dateString: string): boolean {
  return new Date(dateString) >= new Date();
}
