export function normalizeString(str: string): string {
    if (!str) return '';
    return str
        .toLowerCase()
        .normalize('NFD') // Decompose combined graphemes into combination of simple ones
        .replace(/[\u0300-\u036f]/g, '') // Remove combining diacritical marks
        .trim();
}
