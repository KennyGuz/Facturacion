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
# 1. Generar cliente Prisma (NECESARIO antes de cualquier operación)
pnpm prisma generate

# 2. Correr migraciones
pnpm prisma migrate dev

# 3. Incluir datos de prueba
pnpm prisma db seed
```

### Ejecución
```bash
pnpm run dev
```

### Swagger
Documentación disponible en: http://localhost:42069/api-docs

> Los endpoints protegidos usan tokens en cookies httpOnly. Usar Postman/Yaak para pruebas autenticadas.


