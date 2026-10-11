export interface ParsedRow {
  category: string;
  amount: number;
  unit: string;
  date: Date;
}

export interface RowError {
  line: number;
  message: string;
}

export interface ParseResult {
  validRows: ParsedRow[];
  errors: RowError[];
  totalRows: number;
}

export class CsvParserService {
  private static EXPECTED_HEADER = ['category', 'amount', 'unit', 'date'];

  parse(content: string): ParseResult {
    const lines = content.split('\n').map((line) => line.trim());
    const nonEmptyLines = lines.filter((line) => line !== '');

    const validRows: ParsedRow[] = [];
    const errors: RowError[] = [];

    if (nonEmptyLines.length === 0) {
      errors.push({ line: 1, message: 'El archivo está vacío' });
      return { validRows, errors, totalRows: 0 };
    }

    // 1. Validar encabezado
    const headerLine = nonEmptyLines[0];

    if (headerLine === undefined) {
      errors.push({ line: 1, message: 'El archivo está vacío' });
      return { validRows, errors, totalRows: 0 };
    }

    const header = headerLine.split(',').map((h) => h.trim().toLowerCase());

    if (header.join(',') !== CsvParserService.EXPECTED_HEADER.join(',')) {
      errors.push({
        line: 1,
        message: 'Encabezado inválido. Se esperaba: category,amount,unit,date',
      });
      return { validRows, errors, totalRows: 0 };
    }

    // 2. Validar cada fila de datos
    const dataLines = nonEmptyLines.slice(1);
    for (let i = 0; i < dataLines.length; i++) {
      const lineNumber = i + 2;
      const currentLine = dataLines[i];

      if (currentLine === undefined) {
        continue;
      }

      const result = this.parseLine(currentLine);

      if (result.error) {
        errors.push({ line: lineNumber, message: result.error });
      } else if (result.row) {
        validRows.push(result.row);
      }
    }

    return { validRows, errors, totalRows: dataLines.length };
  }

  private parseLine(line: string): { row?: ParsedRow; error?: string } {
    const columns = line.split(',').map((c) => c.trim());

    if (columns.length !== 4) {
      return { error: 'La fila debe tener 4 columnas' };
    }

    const category = columns[0];
    const amountText = columns[1];
    const unit = columns[2];
    const dateText = columns[3];

    if (category === '') {
      return { error: 'category no puede estar vacío' };
    }
    if (unit === '') {
      return { error: 'unit no puede estar vacío' };
    }

    const amount = Number(amountText);

    if (amountText === '' || isNaN(amount) || amount <= 0) {
      return { error: 'amount debe ser un número positivo' };
    }

    if (!category || !amountText || !unit || !dateText) {
      return { error: 'La fila debe tener 4 columnas' };
    }

    const date = this.parseDate(dateText);

    if (!date) {
      return { error: 'date debe tener formato YYYY-MM-DD y ser una fecha válida' };
    }

    return { row: { category, amount, unit, date } };
  }

  private parseDate(text: string): Date | null {
    // Formato exacto: 4 dígitos - 2 dígitos - 2 dígitos
    if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) {
      return null;
    }

    const date = new Date(text + 'T00:00:00.000Z');
    if (isNaN(date.getTime())) {
      return null;
    }

    // Detecta fechas imposibles como 2024-02-31 (JavaScript las "corrige" a marzo)
    if (date.toISOString().slice(0, 10) !== text) {
      return null;
    }

    return date;
  }
}