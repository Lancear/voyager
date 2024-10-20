export type DateLike = Date | string | undefined;

export function formatDate(date: DateLike) {
  if (!date) return;

  if (typeof date === "string") {
    date = new Date(date);
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);

  return day + "." + month + "." + year;
}

export function formatTime(date: DateLike) {
  if (!date) return;

  if (typeof date === "string") {
    date = new Date(date);
  }

  const hour = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return hour + ":" + minutes;
}

export function formatDateTime(date: DateLike) {
  if (!date) return;

  if (typeof date === "string") {
    date = new Date(date);
  }

  return formatDate(date) + " " + formatTime(date);
}
