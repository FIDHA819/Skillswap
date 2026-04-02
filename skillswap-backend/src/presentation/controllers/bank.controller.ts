import { IController } from "../http/interface/IHTTPRequest";
import { IHttpRequest, IHttpResponse } from "../http/interface/IHTTPRequest";
import { HttpResponse } from "../http/helpers/HTTPResponse";
import { HttpErrors } from "../../core/errors/HTTPError";
import { HttpSuccess } from "../../core/success/HTTPSuccess";


interface IBankUseCases {
  addBankDetails: any;
  updateBankDetails: any;
}

export class BankController implements IController {
  private httpErrors = new HttpErrors();
  private httpSuccess = new HttpSuccess();

  constructor(private useCases: IBankUseCases) {}

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { body } = httpRequest;

    try {
      if (!body?.action) return this.httpErrors.error_422();

      switch (body.action) {
        case "add":
          return this.httpSuccess.success_201(await this.useCases.addBankDetails.execute(body.userId, body.bankData));
        case "update":
          return this.httpSuccess.success_200(await this.useCases.updateBankDetails.execute(body.userId, body.bankData));
        default:
          return this.httpErrors.error_400();
      }
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }
}
