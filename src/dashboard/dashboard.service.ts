import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proyecto } from '../proyectos/entities/proyecto.entity';
import { ClienteEstado } from '../clientes/entities/cliente.entity';
import { ProyectoEstado } from '../proyectos/entities/proyecto.entity';
import { TareaEstado } from '../tareas/entities/tarea.entity';
import { UsuarioEstado } from '../usuarios/entities/usuario.entity';
import { Cliente } from '../clientes/entities/cliente.entity';
import { Tarea } from '../tareas/entities/tarea.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Proyecto)
    private readonly proyectoRepository: Repository<Proyecto>,
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    @InjectRepository(Tarea)
    private readonly tareaRepository: Repository<Tarea>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    ) {}

    async obtenerEstadisticasGlobales(){
        try {
            const[
                totalProyectos, proyectosActivos, proyectosFinalizados, proyectosBaja,
                totalClientes, clientesActivos, clientesBaja,
                totalTareas, tareasPendientes, tareasFinalizadas,
                totalUsuarios, usuariosActivos
            ] = await Promise.all([
                this.proyectoRepository.count(),
                this.proyectoRepository.count({where: {estado: ProyectoEstado.ACTIVO } }),
                this.proyectoRepository.count({where: {estado: ProyectoEstado.FINALIZADO } }),
                this.proyectoRepository.count({where: {estado: ProyectoEstado.BAJA } }),

                this.clienteRepository.count(),
                this.clienteRepository.count({where: {estado: ClienteEstado.ACTIVO } }),
                this.clienteRepository.count({where: {estado: ClienteEstado.BAJA } }),

                this.tareaRepository.count(),
                this.tareaRepository.count({where: {estado: TareaEstado.PENDIENTE } }),
                this.tareaRepository.count({where: {estado: TareaEstado.FINALIZADO } }),

                this.usuarioRepository.count(),
                this.usuarioRepository.count({where: {estado: UsuarioEstado.ACTIVO } }),
            ]);

            const porcentajeCompletado = totalTareas > 0 ? Math.round((tareasFinalizadas / totalTareas) * 100): 0;
            return{
                proyectos:{
                    total: totalProyectos,
                    activos: proyectosActivos,
                    finalizados: proyectosFinalizados,
                    bajas: proyectosBaja
                },
                clientes:{
                    total: totalClientes,
                    activos: clientesActivos,
                    bajas: clientesBaja
                },
                tareas:{
                    total: totalTareas,
                    pendientes: tareasPendientes,
                    finalizadas: tareasFinalizadas,
                    rendimientoPorcentaje: porcentajeCompletado
                },
                usuarios:{
                    total: totalUsuarios,
                    activos: usuariosActivos
                }
            };
        } catch (error) {
            console.error('Error al generar metricas del dashboard', error);
            throw new InternalServerErrorException('No se puedieron compilar las estadisticas del sistemas');
        }
    }

} 

