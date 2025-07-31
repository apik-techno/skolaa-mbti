export function formatString(input: string): string {
  return input
    .toLowerCase() // Convert to lowercase
    .replace(/[^a-z0-9\s]/g, '') // Remove all non-alphanumeric characters except spaces
    .replace(/\s+/g, '') // Replace spaces with hyphens
    .trim() // Remove any leading or trailing whitespace
}
