export interface JwtPayload {
  sub: string;
  email: string;
  nome: string;
  perfil: string;
  [key: string]: unknown;
}
