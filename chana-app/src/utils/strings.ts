/** "Jane Mary Doe" → "JM" */
export function getInitials(name: string, maxInitials = 2): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, maxInitials)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}
