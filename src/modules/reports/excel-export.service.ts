import { Injectable } from '@nestjs/common';
import ExcelJS from 'exceljs';

import { ReportRow } from './types/report-row.type';

const EMPTY_REPORT_MESSAGE = 'Sem dados para exibir';

@Injectable()
export class ExcelExportService {
  async createWorkbookBuffer(
    sheetName: string,
    columns: string[],
    rows: ReportRow[],
  ): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Project Backend';
    workbook.created = new Date();
    workbook.modified = new Date();

    const worksheet = workbook.addWorksheet(sheetName);
    this.addHeader(worksheet, columns);
    this.addRows(worksheet, columns, rows);
    this.applyColumnWidths(worksheet, columns, rows);
    this.applyAutoFilter(worksheet, columns);

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);
  }

  private addHeader(worksheet: ExcelJS.Worksheet, columns: string[]): void {
    if (columns.length === 0) {
      worksheet.addRow([EMPTY_REPORT_MESSAGE]);
      worksheet.getRow(1).font = { bold: true };
      return;
    }

    worksheet.addRow(columns);
    worksheet.getRow(1).font = { bold: true };
  }

  private addRows(worksheet: ExcelJS.Worksheet, columns: string[], rows: ReportRow[]): void {
    if (columns.length === 0 || rows.length === 0) {
      return;
    }

    for (const row of rows) {
      worksheet.addRow(columns.map((column) => this.normalizeCellValue(row[column])));
    }
  }

  private applyColumnWidths(
    worksheet: ExcelJS.Worksheet,
    columns: string[],
    rows: ReportRow[],
  ): void {
    if (columns.length === 0) {
      worksheet.getColumn(1).width = EMPTY_REPORT_MESSAGE.length + 4;
      return;
    }

    columns.forEach((column, index) => {
      const maxContentLength = rows.reduce((maxLength, row) => {
        const value = this.normalizeCellValue(row[column]);
        const valueLength = value instanceof Date ? 19 : String(value ?? '').length;

        return Math.max(maxLength, valueLength);
      }, column.length);

      worksheet.getColumn(index + 1).width = Math.min(Math.max(maxContentLength + 4, 12), 60);
    });
  }

  private applyAutoFilter(worksheet: ExcelJS.Worksheet, columns: string[]): void {
    if (columns.length === 0) {
      return;
    }

    worksheet.autoFilter = {
      from: {
        row: 1,
        column: 1,
      },
      to: {
        row: Math.max(worksheet.rowCount, 1),
        column: columns.length,
      },
    };
  }

  private normalizeCellValue(value: unknown): ExcelJS.CellValue {
    if (value === undefined || value === null) {
      return null;
    }

    if (value instanceof Date || typeof value === 'string' || typeof value === 'number') {
      return value;
    }

    if (typeof value === 'boolean') {
      return value;
    }

    if (typeof value === 'bigint') {
      return value.toString();
    }

    if (typeof value === 'object' && 'toNumber' in value && typeof value.toNumber === 'function') {
      return value.toNumber();
    }

    return String(value);
  }
}
