import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import  { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ApiBearerAuth,ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags ('Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService){}

    @Get('stats')
    @ApiOperation({ summary: 'Obtener metricas y estadisticas globales del negocio' })
    @ApiResponse({ status: 200, description: 'Estadisiticas obtenidas correctamente' })
    @ApiResponse({ status: 401, description: 'No autorizado. Token faltante o invalido' })
    obtenerMetricas(){
        return this.dashboardService.obtenerEstadisticasGlobales();
    }
}
