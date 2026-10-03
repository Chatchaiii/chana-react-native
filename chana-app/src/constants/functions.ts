export function getInitials(name: string, maxInitials = 2): string {
  const words = name.split(" ");
  const initials = words.map((word) => word.charAt(0).toUpperCase());
  return initials.slice(0, maxInitials).join("");
}
