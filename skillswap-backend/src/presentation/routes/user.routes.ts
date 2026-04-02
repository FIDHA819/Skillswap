// src/presentation/express/routes/user.routes.ts
import { Router } from "express";
import { expressAdapter } from "../adapters/express-adapter";
import { userControllerComposer } from "../../../infrastructure/Auth/services/user.composer";
import { authMiddleware } from "../../../presentation/Auth/middleware/authMiddleware";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB

const router = Router();
const userController = userControllerComposer();

router.post("/", async (req, res) => {
  const adapter = await expressAdapter(req, userController, "createUser");
  return res.status(adapter.statusCode).json(adapter.body);
});

router.get("/me", authMiddleware, async (req, res) => {
  const adapter = await expressAdapter(req, userController, "getMe");
  return res.status(adapter.statusCode).json(adapter.body);
});

router.get("/profile", authMiddleware, async (req, res) => {
  const adapter = await expressAdapter(req, userController, "getMe");
  return res.status(adapter.statusCode).json(adapter.body);
});

// src/presentation/express/routes/user.routes.ts
router.put("/me", authMiddleware, upload.any(), async (req, res) => {
  // debug headers + content-type
  console.log("HEADERS content-type:", req.headers["content-type"]);
  console.log("req.is multipart/form-data?:", req.is("multipart/form-data"));
  // multer output
  console.log("MULTER REQ.FILE (req.file) =>", (req as any).file);
  console.log("MULTER REQ.FILES (req.files) =>", (req as any).files);
  // body keys & types
  console.log("REQ.BODY keys:", Object.keys(req.body || {}));
  for (const k of Object.keys(req.body || {})) {
    const v = (req.body as any)[k];
    console.log(` - ${k}: type=${typeof v} len=${typeof v === "string" ? v.length : "-"}`);
  }

  const adapter = await expressAdapter(req, userController, "updateProfile");
  return res.status(adapter.statusCode).json(adapter.body);
});


router.post("/activate", authMiddleware, async (req, res) => {
  const adapter = await expressAdapter(req, userController, "activateProfile");
  return res.status(adapter.statusCode).json(adapter.body);
});

router.get("/", async (req, res) => {
  const adapter = await expressAdapter(req, userController, "getAllUsers");
  return res.status(adapter.statusCode).json(adapter.body);
});

router.get("/:id", async (req, res) => {
  const adapter = await expressAdapter(req, userController, "getUserById");
  return res.status(adapter.statusCode).json(adapter.body);
});

export default router;
