import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../database/prisma/prisma.service';
import { ExcelExportService } from './excel-export.service';
import { ReportRow } from './types/report-row.type';

interface ViewColumn {
  column_name: string;
}

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly excelExportService: ExcelExportService,
  ) {}

  async generateJobsPrevChecklistExcel(): Promise<Buffer> {
    try {
      const [columns, rows] = await Promise.all([
        this.getViewColumns('view_jobs_prev_checklist'),
        this.getJobsPrevChecklistRows(),
      ]);

      return this.excelExportService.createWorkbookBuffer('Jobs Prev Checklist', columns, rows);
    } catch (error) {
      this.logger.error('Erro ao gerar relatorio de jobs de revisao previdenciaria', error);
      throw new InternalServerErrorException('Nao foi possivel gerar o relatorio');
    }
  }

  private async getJobsPrevChecklistRows(): Promise<ReportRow[]> {
    return this.prisma.$queryRaw<ReportRow[]>(Prisma.sql`
      SELECT *
      FROM view_jobs_prev_checklist
    `);
  }

  private async getViewColumns(viewName: string): Promise<string[]> {
    const columns = await this.prisma.$queryRaw<ViewColumn[]>(Prisma.sql`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = ${viewName}
      ORDER BY ordinal_position
    `);

    return columns.map((column) => column.column_name);
  }
}
