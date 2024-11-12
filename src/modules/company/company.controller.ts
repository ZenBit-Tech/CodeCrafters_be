import { Company } from 'common/database/entities/company.entity';
import { Roles } from 'common/enums/enums';
import { RolesGuard } from 'common/guards/roles.guard';
import { ResponseInterface } from 'common/types/interfaces';

import { Body, Controller, Get, Param, Patch, Post, Query, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@ApiBearerAuth()
@ApiTags('companies')
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  @UseGuards(RolesGuard)
  @SetMetadata('roles', [Roles.SUPERADMIN])
  @ApiOperation({ summary: 'Get list of companies' })
  @ApiResponse({ status: 200, type: [Company] })
  async getAll(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('searchTerm') searchTerm?: string,
    @Query('sortBy') sortBy: string = 'name',
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC',
  ): Promise<{ data: Company[]; total: number }> {
    return this.companyService.getList(page, pageSize, searchTerm, sortBy, sortOrder);
  }

  @Post()
  @UseGuards(RolesGuard)
  @SetMetadata('roles', [Roles.SUPERADMIN])
  @ApiOperation({ summary: 'Company creating' })
  @ApiResponse({ status: 201, type: Company })
  async create(@Body() createCompanyDto: CreateCompanyDto): Promise<Company> {
    return this.companyService.create(createCompanyDto);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', [Roles.SUPERADMIN])
  @ApiOperation({ summary: 'Update company by id' })
  @ApiResponse({
    status: 200,
    type: Company,
  })
  async update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto): Promise<ResponseInterface> {
    return this.companyService.update(+id, updateCompanyDto);
  }
}
