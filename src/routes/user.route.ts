import { Router } from "express";
import UserController from "../controller/UserController";
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";

const router = Router();

// Get all users
router.get("/", [checkJwt, checkRole(["ADMIN"])], UserController.listAll);

// Add new user
router.post("/", [checkJwt, checkRole(["ADMIN"])], UserController.newUser);

// Get single user from Admin account
router.get(
  "/:id([0-9]+)",
  [checkJwt, checkRole(["ADMIN"])],
  UserController.getOneById
);

// Edit user
router.patch(
  "/:id([0-9]+)",
  [checkJwt, checkRole(["ADMIN"])],
  UserController.editUser
);

// Delete user
router.delete(
  "/:id([0-9]+)",
  [checkJwt, checkRole(["ADMIN"])],
  UserController.deleteUser
);

// Get Users Profile from any role
router.get(
  "/profile",
  [checkJwt, checkRole(["ADMIN", "USER", "CLIENT"])],
  UserController.getProfilewithPayloadId
);

export default router;
