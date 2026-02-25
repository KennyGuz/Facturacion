## Sistema de facturación

### Requisitos

- Node.js 20.x
- Docker
- make

### Instalación deps

#### Instalar make para windows
```bash
# instalar make con scoop
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression

scoop install make
```

#### Instalar make para unix
https://www.gnu.org/software/make/ 

```bash
# instalar make con brew
brew install make

```

#### Instalar docker

https://docs.docker.com/desktop/setup/install/windows-install/

#### Instalar node.js

usar nvm para instalar node.js o usar la 20.x en tu sistema (opcional si ya lo tienes)
https://github.com/coreybutler/nvm-windows/releases

```bash
# req tener nvm instalado
nvm install lts
nvm use lts
```

```bash
# instalar dependencias
make install

```

### Desarrollo

```bash
make up
```
detener la base de datos
```bash
make down
```

### Producción

Docker me  causo muchos problemas entonces por eso usa esta guia

- instalar MAKE es necesario porfavor.


- **crear un archivo .env.prod en Server** con las siguientes variables
    - DATABASE_URL
    - SALT_ROUNDS
    - JWT_SECRET

- Construir las imagenes
```bash
    make build-images
 ```

- Elevar las imagenes a producción
```bash
     make promote-images
```
- ejecutar el comando
```bash
    make up-prod
```
- para detener todo
```bash
     make down-prod
```










