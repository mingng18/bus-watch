export function parseCsv(text: string): Record<string, string>[] {
  const trimmed = text.trim();
  if (!trimmed) return [];

  const lines = trimmed.split('\n');
  const headers = parseLine(lines[0]);
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const values = parseLine(line);
    const row: Record<string, string> = Object.create(null);
    for (let j = 0; j < headers.length; j++) {
      const header = headers[j].trim();
      if (header === '__proto__' || header === 'constructor') continue;
      row[header] = (values[j] || '').trim();
    }
    rows.push(row);
  }
  return rows;
}

function parseLine(line: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      fields.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  fields.push(current);
  return fields;
}
