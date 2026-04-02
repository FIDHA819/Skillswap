import { IHttpRequest } from "../interface/IHTTPRequest";

export class HttpRequest implements IHttpRequest {
  header?: any;
  body?: any;
  params?: any;
  query?: any;
  path?: string;
  user?: any; // Add this if you plan to set user property manually

  constructor(data: { header?: any; body?: any; params?: any; query?: any; path?: string; user?: any }) {
    this.header = data.header;
    this.body = data.body;
    this.params = data.params;
    this.query = data.query;
    this.path = data.path;
    this.user = data.user;
  }
}
