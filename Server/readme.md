## Servicio api de facturacion

### swagger
http://localhost:42069/api-docs

Se deben realizar pruebas a los endpoints protegidos en otra plataforma
(postman, yaak) ya que el token esta en las cookies como httpOnly y swagger no puede leerlo.
Entonces usar swagger como referencia.

### Requisitos
- Correr la base de datos desde docker



### Instalación
```bash
npm install
```

### Ejecución
```bash
npm run dev
```

### prisma

#### Correr migraciones 
```bash
npx prisma migrate dev
```

#### Incluir mock data
```bash
npx prisma db seed
```


