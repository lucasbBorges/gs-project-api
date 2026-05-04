import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiProduces, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { Profiles } from '../../common/decorators/profiles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ProfilesGuard } from '../../common/guards/profiles.guard';
import { ReportsService } from './reports.service';

const JOBS_PREV_CHECKLIST_FILENAME = 'relatorio-jobs-prev-checklist.xlsx';
const XLSX_CONTENT_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

@ApiTags('reports')
@ApiBearerAuth()
@Controller('reports')
@UseGuards(JwtAuthGuard, ProfilesGuard)
@Profiles('Admin')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('jobs-prev-checklist/excel')
  @ApiProduces(XLSX_CONTENT_TYPE)
  @ApiOkResponse({ description: 'Arquivo Excel gerado com sucesso.' })
  async downloadJobsPrevChecklistExcel(@Res() response: Response): Promise<void> {
    const fileBuffer = await this.reportsService.generateJobsPrevChecklistExcel();

    response.setHeader('Content-Type', XLSX_CONTENT_TYPE);
    response.setHeader(
      'Content-Disposition',
      `attachment; filename="${JOBS_PREV_CHECKLIST_FILENAME}"`,
    );
    response.setHeader('Content-Length', fileBuffer.length);
    response.send(fileBuffer);
  }
}
