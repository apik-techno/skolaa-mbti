// utils/colorUtils.ts

/**
 * Darken a hex color by a given percentage.
 * @param hex - The hex color code (e.g., "#ff0000" or "ff0000").
 * @param darken - The percentage to darken the color (e.g., 0.1 for 10%).
 * @returns The darkened hex color code.
 */
export function darkenHexColor(hex: string, darken: number): string {
  // Remove the "#" if present
  hex = hex.replace('#', '')

  // Parse the hex color components
  let r = parseInt(hex.substring(0, 2), 16)
  let g = parseInt(hex.substring(2, 4), 16)
  let b = parseInt(hex.substring(4, 6), 16)

  // Apply the darken factor to each component
  r = Math.floor(r * (1 - darken))
  g = Math.floor(g * (1 - darken))
  b = Math.floor(b * (1 - darken))

  // Ensure the values stay within the range [0, 255]
  r = Math.max(0, Math.min(255, r))
  g = Math.max(0, Math.min(255, g))
  b = Math.max(0, Math.min(255, b))

  // Convert each component back to a hex string and pad with zeros if necessary
  const darkenedHex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b
    .toString(16)
    .padStart(2, '0')}`

  return darkenedHex
}
