<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Gestor de Proyectos - Backend (NestJS)

Estructura base del proyecto integrador para la materia Desarrollo de Aplicaciones Web (2026).

## Configuración Inicial

1. Duplicar el archivo `.env` en la raíz del proyecto backend y configurar las variables de la base de datos local:

   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=tu_password
   DB_NAME=gestor_de_proyectos_tp
   NODE_ENV=development

   ```

2. Instalar las dependencias necesarias (incluye bcrypt para seguridad):

```
npm install
```

3. Iniciar el servidor en modo desarrollo:

```
npm run start:dev
```

Nota: Al arrancar por primera vez con la base de datos vacía, el sistema creará automáticamente un usuario administrador de prueba (admin / admin123).

### Endpoints Disponibles (Postman / Insomnia)

La URL base para todas las consultas es:
http://localhost:3000

1. Autenticación (Usuarios)

- Iniciar Sesión
  - Ruta: POST /usuarios/login
  - Cuerpo (JSON):

  ```
  {
    "nombreUsuario": "admin",
    "clave": "admin123"
  }
  ```

  - Respuesta Exitosa (201): Retorna los datos del usuario logueado.
  - Respuesta Errónea (401): Credenciales incorrectas o usuario inactivo.

2. Gestión de Clientes

- Crear Cliente
  - Ruta: POST /clientes
  - Cuerpo (JSON):

  ```
  {
    "nombre": "Cliente Alfa"
  }
  ```

- Listar Clientes
  - Ruta: GET /clientes
  - Descripción: Retorna todos los clientes registrados junto con sus proyectos asociados.

- Buscar Cliente por ID
  - Ruta: GET /clientes/:id
  - Ejemplo: GET /clientes/a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11

- Actualizar Cliente
  - Ruta: PATCH /clientes/:id
  - Cuerpo (JSON):

  ```
  {
    "nombre": "Cliente Alfa Modificado"
  }
  ```

- Dar de Baja Cliente (Baja Lógica)
  - Ruta: PATCH /clientes/:id/baja
  - Descripción: Cambia el estado del cliente a "Baja".
  - Restricción: El sistema arrojará un error (400 BadRequest) si el cliente tiene proyectos asociados.
