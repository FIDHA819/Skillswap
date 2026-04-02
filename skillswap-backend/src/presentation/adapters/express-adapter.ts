// src/presentation/adapters/express-adapter.ts
import { Request } from "express";

export const expressAdapter = async (req: Request & any, controller: any, method: string) => {
  console.log("REQ BODY =>", req.body);

  // multer may attach req.file (single) or req.files (array). Prefer req.file, otherwise pick first file.
  const rawFiles = req.file ? [req.file] : (req.files ?? null);
  const firstFile = Array.isArray(rawFiles) && rawFiles.length > 0 ? rawFiles[0] : null;

  const httpRequest: any = {
    body: req.body ?? {},
    params: req.params ?? {},
    query: req.query ?? {},
    headers: req.headers ?? {},
    path: req.path ?? "",
    user: (req as any).user ?? null,
    // provide both for convenience
    file: firstFile,               // single-file convenience (may be null)
    files: Array.isArray(rawFiles) ? rawFiles : (req.files ?? null),
    rawRequest: req,
  };

  if (!controller[method] || typeof controller[method] !== "function") {
    throw new Error(`Controller method "${method}" not found`);
  }

  const httpResponse = await controller[method](httpRequest);

  return {
    statusCode: httpResponse?.statusCode ?? 200,
    body: httpResponse?.body ?? httpResponse,
  };
};
