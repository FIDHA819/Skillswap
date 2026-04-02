// src/presentation/http/helpers/HTTPSuccess.ts
export interface IHttpSuccess {
  success_200(data: any, message?: string): { statusCode: number; body: { data: any; message?: string } };
  success_201(data: any, message?: string): { statusCode: number; body: { data: any; message?: string } };
  success_204(message?: string): { statusCode: number; body: { message: string } };
  success_422(data: any): { statusCode: number; body: { data: any } };
}

export class HttpSuccess implements IHttpSuccess {
  success_200(data: any, message?: string) {
    return {
      statusCode: 200,
      body: {
        data,
        message: message || "Success",
      },
    };
  }

  success_201(data: any, message?: string) {
    return {
      statusCode: 201,
      body: {
        data,
        message: message || "Created successfully",
      },
    };
  }

  success_204(message?: string) {
    return {
      statusCode: 204,
      body: {
        message: message || "No Content",
      },
    };
  }

  success_422(data: any) {
    return {
      statusCode: 422,
      body: { data },
    };
  }
}
