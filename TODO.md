## 1. MÓDULO: Usuarios (Completado)

Encargado de la autenticacion y el control de acceso.

- **Entidad (Usuario):**
  - `id` (UUID, Primary)
  - `nombreUsuario` (Varchar, Unico)
  - `clave` (Varchar, Encriptada con bcrypt)
  - `estado` (Enum: 'Activo', 'Baja')

- **Consultas / Rutas:**
  - `POST /usuarios/login` -> Recibe DTO con usuario y clave. Valida contra la base de datos y retorna un JWT firmado si las credenciales son validas.
  - `onModuleInit` -> Verificar si la tabla de usuarios esta vacia al arrancar. Si esta vacia, crear el usuario 'admin' con clave encriptada de forma automatica.

---

## 2. MÓDULO: Clientes (Completado)

Estructura para la gestion de clientes externos.

- **Entidad (Cliente):**
  - `id` (UUID, Primary)
  - `nombre` (Varchar)
  - `estado` (Enum: 'Activo', 'Baja')
  - Relacion: `@OneToMany` hacia Proyecto.

- **Consultas / Rutas:**
  - `POST /clientes` -> Crear cliente (nace en estado 'Activo').
  - `GET /clientes` -> Listar todos los clientes incluyendo la relacion 'proyectos'.
  - `GET /clientes/:id` -> Buscar cliente por ID.
  - `PATCH /clientes/:id` -> Modificar datos basicos.
  - `PATCH /clientes/:id/baja` -> Logica de baja: Cambiar estado a 'Baja'.
    - **Regla de negocio:** Validar que el array de proyectos asociados este vacio. Si tiene proyectos, lanzar BadRequestException.

---

## 3. MÓDULO: Proyectos (Siguiente Paso)

Gestion de los proyectos de la empresa.

- **Entidad (Proyecto):**
  - `id` (UUID, Primary)
  - `nombre` (Varchar)
  - `estado` (Enum: 'Activo', 'Finalizado', 'Baja')
  - Relacion: `@ManyToOne` hacia Cliente (nullable: true).
  - Relacion: `@OneToMany` hacia Tarea.

- **Consultas / Rutas a crear:**
  - `POST /proyectos` -> Crear proyecto. Recibe nombre y clienteId (opcional).
    - **Regla de negocio 1:** Si clienteId es enviado, buscar el cliente. Si no existe, lanzar NotFoundException.
    - **Regla de negocio 2:** Validar que el cliente encontrado tenga estado 'Activo'. Si esta en 'Baja', lanzar BadRequestException.
    - **Regla de negocio 3:** Si clienteId no es enviado, setear el campo cliente como null (Proyecto Interno).
  - `GET /proyectos` -> Listar todos los proyectos incluyendo las relaciones 'cliente' y 'tareas'.
  - `PATCH /proyectos/:id` -> Modificar datos o cambiar estado ('Activo', 'Finalizado', 'Baja').

---

## 4. MÓDULO: Tareas (Paso Final)

Gestion de las tareas asignadas a cada proyecto.

- **Entidad (Tarea):**
  - `id` (UUID, Primary)
  - `descripcion` (Varchar)
  - `estado` (Enum: 'Pendiente', 'Finalizado', 'Baja')
  - Relacion: `@ManyToOne` hacia Proyecto (nullable: false).

- **Consultas / Rutas a crear:**
  - `POST /tareas` -> Crear tarea vinculada a un proyecto (nace en estado 'Pendiente').
    - **Regla de negocio:** Buscar el proyectoId recibido. Si el proyecto no existe, lanzar NotFoundException.
  - `PATCH /tareas/:id` -> Modificar descripcion o cambiar estado ('Pendiente', 'Finalizado', 'Baja').
  - `DELETE /tareas/:id` -> Eliminar la tarea de la base de datos (Eliminacion fisica).

---

## Interconexion de Modulos (Inyeccion de Dependencias)

Para que los servicios puedan realizar las validaciones cruzadas cruzando datos, recordar configurar los export e import en los archivos module:

1. ClientesModule debe exportar su TypeOrmModule para que ProyectosModule lo importe.
2. ProyectosModule debe exportar su TypeOrmModule para que TareasModule lo importe.
