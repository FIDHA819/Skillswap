

export interface IHttpErrors {
  error_400(message?: string): { statusCode: number; body: any };
  error_401(message?: string): { statusCode: number; body: any };
  error_404(message?: string): { statusCode: number; body: any };
  error_422(message?: string): { statusCode: number; body: any };
  error_500(message?: string): { statusCode: number; body: any };
}

export class HttpErrors implements IHttpErrors {
  error_400(message?: string) {
    return { statusCode: 400, body: { message: message || "Bad Request" } };
  }

  error_401(message?: string) {
    return { statusCode: 401, body: { message: message || "Unauthorized" } };
  }

  error_404(message?: string) {
    return { statusCode: 404, body: { message: message || "Not Found" } };
  }

  error_422(message?: string) {
    return { statusCode: 422, body: { message: message || "Unprocessable Entity" } };
  }

  error_500(message?: string) {
    return { statusCode: 500, body: { message: message || "Internal Server Error" } };
  }
}

