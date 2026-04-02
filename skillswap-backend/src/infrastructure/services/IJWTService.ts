export interface IJWTService {
  sign(payload: object, expiresIn?: string): string;
  verify(token: string): any;
}
