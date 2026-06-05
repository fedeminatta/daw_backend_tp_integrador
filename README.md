<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Gestor de Proyectos - Backend (NestJS)

Estructura base del proyecto integrador para la materia Desarrollo de Aplicaciones Web (2026).

## Configuración Inicial

1. Duplicar el archivo .env en la raíz del proyecto backend y configurar las variables de la base de datos local:

   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=tu_password
   DB_NAME=gestor_de_proyectos_tp
   NODE_ENV=development
   JWT_SECRET=clave_secreta_super_segura_para_el_tp

2. Instalar las dependencias necesarias (incluye bcrypt y esquemas de validacion):
   npm install

3. Iniciar el servidor en modo desarrollo:
   npm run start:dev

Nota: Al arrancar por primera vez con la base de datos vacía, el sistema creará automáticamente un usuario administrador de prueba (admin / admin123).

---

## Documentación Interactiva (Swagger)

Una vez que el servidor esté corriendo, podés acceder a la interfaz interactiva de Swagger para probar todos los endpoints de manera directa desde el navegador:

- URL de Documentación: http://localhost:3000/docs

---

## Endpoints Disponibles

La URL base para todas las consultas es: http://localhost:3000

Nota para el Frontend: Todos los endpoints (excepto el Login) requieren que se envíe el token JWT obtenido en las cabeceras HTTP de la consulta bajo el formato: Authorization: Bearer TOKEN_AQUI

### 1. Módulo de Usuarios & Autenticación

- Iniciar Sesión (Público)
  - Ruta: POST /usuarios/login
  - Cuerpo (JSON):
    {
    "nombreUsuario": "admin",
    "clave": "admin123"
    }
  - Respuesta Exitosa (201): Retorna los datos del usuario junto con el token JWT necesario para el resto de las consultas.

- Crear Usuario Operador (Protegido)
  - Ruta: POST /usuarios
  - Cuerpo (JSON):
    {
    "nombreUsuario": "operador1",
    "clave": "segura123"
    }

- Listar Usuarios (Protegido)
  - Ruta: GET /usuarios
  - Descripción: Retorna la lista de usuarios registrados omitiendo sus hashes de seguridad.

- Actualizar Usuario (Protegido)
  - Ruta: PATCH /usuarios/:id
  - Cuerpo Opcional (JSON): Modifica el nombre de usuario, re-encripta una nueva clave o ambos.

- Baja de Usuario (Protegido)
  - Ruta: DELETE /usuarios/:id
  - Restricción: Aplica baja logica. Lanza un error (400 BadRequest) si se intenta eliminar al usuario admin de fábrica.

---

### 2. Módulo de Clientes (Todos los endpoints protegidos)

- Crear Cliente
  - Ruta: POST /clientes
  - Cuerpo (JSON):
    {
    "nombre": "Cliente Alfa"
    }

- Listar Clientes
  - Ruta: GET /clientes
  - Descripción: Retorna todos los clientes junto con sus proyectos asociados para validar dependencias.

- Buscar Cliente por ID
  - Ruta: GET /clientes/:id

- Actualizar Cliente
  - Ruta: PATCH /clientes/:id
  - Cuerpo (JSON):
    {
    "nombre": "Cliente Alfa Modificado"
    }

- Dar de Baja Cliente (Baja Lógica)
  - Ruta: PATCH /clientes/:id/baja
  - Restricción: Cambia el estado a "Baja". El sistema arrojará un error (400 BadRequest) si el cliente tiene proyectos asociados activos o finalizados.
