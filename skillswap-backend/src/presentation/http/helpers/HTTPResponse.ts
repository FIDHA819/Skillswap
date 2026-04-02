import { IHttpResponse } from "../interface/IHTTPRequest";

export class HttpResponse implements IHttpResponse {
  constructor(public readonly statusCode: number, public readonly body: any) {}
}
