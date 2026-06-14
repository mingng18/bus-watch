export function parseCsv(text: string): Record<string, string>[] {
  // Normalize line endings: a CRLF (\r\n) or bare CR (\r, legacy Mac) file
  // split on '\n' alone leaves a trailing '\r' on every row's final field.
  // That '\r' corrupts the header name (so lookups silently miss) and corrupts
  // stop/route name values. Normalize to '\n' before splitting.
  // See issue #132.
  const normalized = text.replace(/\r\n?/g, '\n');
  const trimmed = normalized.trim();
  if (!trimmed) return [];

  const lines = trimmed.split('\n');
  const headers = parseLine(lines[0]).map(h => h.trim());
  const rows: Record<string, string>[] = [];
  const headerLen = headers.length;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Performance optimization: Fast path using manual indexOf loop for unquoted lines
    // to avoid intermediate array allocations from split() or map()
    if (line.indexOf('"') === -1) {
      const row: Record<string, string> = {};
      let start = 0;
      let colIdx = 0;
      while (colIdx < headerLen) {
        const commaIdx = line.indexOf(',', start);
        if (commaIdx === -1) {
          row[headers[colIdx]] = line.substring(start).trim();
          colIdx++;
          break;
        } else {
          row[headers[colIdx]] = line.substring(start, commaIdx).trim();
          start = commaIdx + 1;
        }
        colIdx++;
      }

      // Fill remaining headers with empty string to match old behavior
      while (colIdx < headerLen) {
        row[headers[colIdx]] = '';
        colIdx++;
      }

      rows.push(row);
      continue;
    }

    // Fallback for lines with quotes
    const values = parseLine(line);
    const row: Record<string, string> = {};
    for (let j = 0; j < headerLen; j++) {
      row[headers[j]] = (values[j] || '').trim();
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
