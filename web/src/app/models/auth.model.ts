export interface Permission {
  ID: number;
  Name: string;
}

export interface AuthUser {
  ID: number;
  Nombre: string;
  Apellido: string;
  Cedula: string;
  Email: string;
  Active: boolean;
  Permisos: Permission[];
}
