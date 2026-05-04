import { Module } from '@nestjs/common';

import { ExcelExportService } from './excel-export.service';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

@Module({
  controllers: [ReportsController],
  providers: [ReportsService, ExcelExportService],
})
export class ReportsModule {}
