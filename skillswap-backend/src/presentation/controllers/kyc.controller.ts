import { IController } from "../http/interface/IHTTPRequest";
import { IHttpRequest, IHttpResponse } from "../http/interface/IHTTPRequest";
import { HttpResponse } from "../http/helpers/HTTPResponse";

interface IKYCUseCases {
  submitKYC: any;
  approveKYC: any;
  rejectKYC: any;
 
}

export class KYCController implements IController {
  constructor(private useCases: IKYCUseCases) {}

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { body, params } = httpRequest;

    try {
      if (body?.action === "submit") {
        const result = await this.useCases.submitKYC.execute(body.userId, body.files);
        return new HttpResponse(201, result);
      }

      if (body?.action === "approve") {
        const result = await this.useCases.approveKYC.execute(body.userId);
        return new HttpResponse(200, result);
      }

      if (body?.action === "reject") {
        const result = await this.useCases.rejectKYC.execute(body.userId);
        return new HttpResponse(200, result);
      }

     

      return new HttpResponse(400, { error: "Invalid KYC action" });
    } catch (error: any) {
      return new HttpResponse(500, { error: error.message });
    }
  }
}
