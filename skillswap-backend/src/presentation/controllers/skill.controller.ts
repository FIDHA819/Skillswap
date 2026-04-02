import { IController } from "../http/interface/IHTTPRequest";
import { IHttpRequest, IHttpResponse } from "../http/interface/IHTTPRequest";
import { HttpResponse } from "../http/helpers/HTTPResponse";
import { HttpErrors } from "../../core/errors/HTTPError";
import { HttpSuccess } from "../../core/success/HTTPSuccess";



interface ISkillUseCases {
  addSkillToLearn: any;
  addSkillToTeach: any;

}

export class SkillController implements IController {
  private httpErrors = new HttpErrors();
  private httpSuccess = new HttpSuccess();

  constructor(private useCases: ISkillUseCases) {}

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { body, query } = httpRequest;

    try {
      if (!body?.action && !query?.userId) return this.httpErrors.error_422();

      switch (body?.action) {
        case "addLearn":
          return this.httpSuccess.success_201(await this.useCases.addSkillToLearn.execute(body.userId, body.skill));
        case "addTeach":
          return this.httpSuccess.success_201(await this.useCases.addSkillToTeach.execute(body.userId, body.skill));
        
      }


      return this.httpErrors.error_400();
    } catch (error: any) {
      return this.httpErrors.error_500();
    }
  }
}
