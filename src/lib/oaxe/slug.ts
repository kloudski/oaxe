export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 50)
    .replace(/^-|-$/g, '');
}

export function generateRunFilename(id: string, directive: string): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const slug = generateSlug(directive);
  return `${timestamp}-${slug || id}.json`;
}
