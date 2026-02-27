## Servicio API de facturación

### Requisitos
- Correr la base de datos desde docker (`docker compose up` en la raíz)
- [pnpm](https://pnpm.io/es/installation) (requerido por configuración de Prisma)

### Instalación
```bash
pnpm install
```

### Prisma
⚠️ **Importante**: Usar `pnpm` para todas las operaciones de Prisma

```bash
# 1. Generar la base de datos por primera vez (NECESARIO antes de cualquier operación)
pnpm db:init 
```

### Migraciones
```bash
# 1. Crear migraciones
pnpm db:migrate-new -- NOMBRE_MIGRACION


# 2. Validar migraciones
pnpm db:validate


### Ejecución
```bash
pnpm run dev
```
### Reiniciar la base de datos completamente

```bash
pnpm db:reset
```

### Swagger
Documentación disponible en: http://localhost:42069/api-docs

> Los endpoints protegidos usan tokens en cookies httpOnly. Usar Postman/Yaak para pruebas autenticadas.


