
export interface IUserPayload {
  id: string;
  email: string;
  fullName?: string;
  role?: string;
  isVerified?: boolean;
  // other JWT claims or user info fields here
}
// IHttpRequest.ts
export interface IHttpRequest {
  header?: any;
  body?: any;
  params?: any;
  query?: any;
  path?:any;
  method?:any;
   user?: IUserPayload;
}

// IHttpResponse.ts
export interface IHttpResponse {
  statusCode: number;
  body: any;
  headers?: Record<string, string>;
}


export interface IController {
  handle(httpRequest: IHttpRequest): Promise<IHttpResponse>;
}

export interface ResponseDTO {
  success: boolean;
  data?: any;
  message?: string;
}
