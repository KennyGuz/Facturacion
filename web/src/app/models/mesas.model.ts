export interface Mesa {
  ID: number;
  NumeroMesa: number;
  EstaOcupada: boolean;
  Active: boolean;
  CreatedAt: Date;
  UpdatedAt: Date;

}

export interface MesasData {
  mesas: Mesa[];
  pagination: Pagination;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;

}
