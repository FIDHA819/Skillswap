import { IController } from "../http/interface/IHTTPRequest";
import { IHttpRequest, IHttpResponse } from "../http/interface/IHTTPRequest";
import { HttpResponse } from "../http/helpers/HTTPResponse";
import { HttpErrors } from "../../core/errors/HTTPError";
import { HttpSuccess } from "../../core/success/HTTPSuccess";

interface IAdminUseCases {
  getAllUsers: any;
  updateKYCStatus: any;
  adminLogin: any;
}

export class AdminController implements IController {
  private httpErrors = new HttpErrors();
  private httpSuccess = new HttpSuccess();

  constructor(private useCases: IAdminUseCases) {}

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { body } = httpRequest;

    try {
      if (!body || !body.action) {
        return new HttpResponse(
          this.httpErrors.error_422({ message: "Action is required" }).statusCode,
          this.httpErrors.error_422({ message: "Action is required" }).body
        );
      }

      switch (body.action) {
        case "login": {
          const result = await this.useCases.adminLogin.execute(body);
          return new HttpResponse(
            this.httpSuccess.success_200(result).statusCode,
            this.httpSuccess.success_200(result).body
          );
        }

        case "getAllUsers": {
          const result = await this.useCases.getAllUsers.execute();
          return new HttpResponse(
            this.httpSuccess.success_200(result).statusCode,
            this.httpSuccess.success_200(result).body
          );
        }

        case "updateKYC": {
          if (!body.userId || !body.status) {
            return new HttpResponse(
              this.httpErrors.error_422({ message: "userId and status are required" }).statusCode,
              this.httpErrors.error_422({ message: "userId and status are required" }).body
            );
          }
          const result = await this.useCases.updateKYCStatus.execute(
            body.userId,
            body.status
          );
          return new HttpResponse(
            this.httpSuccess.success_200(result).statusCode,
            this.httpSuccess.success_200(result).body
          );
        }

        default:
          return new HttpResponse(
            this.httpErrors.error_400({ message: "Invalid admin action" }).statusCode,
            this.httpErrors.error_400({ message: "Invalid admin action" }).body
          );
      }
    } catch (error: any) {
      return new HttpResponse(
        this.httpErrors.error_500({ message: error.message || "Internal Server Error" }).statusCode,
        this.httpErrors.error_500({ message: error.message || "Internal Server Error" }).body
      );
    }
  }
}
