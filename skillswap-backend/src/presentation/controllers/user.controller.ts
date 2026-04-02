// src/presentation/express/User/user.controller.ts
import { IHttpRequest } from "../../http/interface/IHTTPRequest";
import { HttpResponse } from "../../http/helpers/HTTPResponse";

interface IUserUseCases {
  createUser: any;
  updateProfile: any;
  getAllUsers: any;
  activateProfile: any;
  getUserById: any;
}

export class UserController {
  constructor(private useCases: IUserUseCases) {}

  async createUser(httpRequest: IHttpRequest) {
    const { body } = httpRequest;
    const result = await this.useCases.createUser.execute(body);
    return new HttpResponse(201, result);
  }

  // src/presentation/express/User/user.controller.ts
async updateProfile(httpRequest: any) {
  const userId = httpRequest.user?.id;
  if (!userId) return new HttpResponse(400, { message: "User ID missing" });

  const payload = { ...(httpRequest.body || {}) };

  // Prefer single file if available, otherwise pick first from files array
  if (httpRequest.file) {
    payload.file = httpRequest.file;
  } else if (Array.isArray(httpRequest.files) && httpRequest.files.length > 0) {
    payload.file = httpRequest.files[0];
  }

  const result = await this.useCases.updateProfile.execute(userId, payload);
  return new HttpResponse(200, result);
}

  async getMe(httpRequest: IHttpRequest) {
    const userId = httpRequest.user?.id;
    if (!userId) return new HttpResponse(400, { message: "User ID missing" });

    const user = await this.useCases.getUserById.execute(userId);
    return new HttpResponse(200, user);
  }

  async getAllUsers(httpRequest: IHttpRequest) {
    const result = await this.useCases.getAllUsers.execute();
    return new HttpResponse(200, result);
  }

  async getUserById(httpRequest: IHttpRequest) {
    const { id } = httpRequest.params || {};
    const result = await this.useCases.getUserById.execute(id);
    return new HttpResponse(200, result);
  }

  async activateProfile(httpRequest: IHttpRequest) {
    const userId = httpRequest.user?.id;
    if (!userId) return new HttpResponse(400, { message: "User ID missing" });

    const result = await this.useCases.activateProfile.execute(userId);
    return new HttpResponse(200, result);
  }
}
