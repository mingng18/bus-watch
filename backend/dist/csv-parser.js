export function parseCsv(text) {
    const trimmed = text.trim();
    if (!trimmed)
        return [];
    const lines = trimmed.split('\n');
    const headers = parseLine(lines[0]);
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line)
            continue;
        const values = parseLine(line);
        const row = {};
        for (let j = 0; j < headers.length; j++) {
            row[headers[j].trim()] = (values[j] || '').trim();
        }
        rows.push(row);
    }
    return rows;
}
function parseLine(line) {
    const fields = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') {
            if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
                current += '"';
                i++;
            }
            else {
                inQuotes = !inQuotes;
            }
        }
        else if (ch === ',' && !inQuotes) {
            fields.push(current);
            current = '';
        }
        else {
            current += ch;
        }
    }
    fields.push(current);
    return fields;
}
