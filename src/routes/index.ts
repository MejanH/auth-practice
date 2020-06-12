import { Router } from "express";
import user from "./user.route";
import auth from "./auth.route";

const routes = Router();

routes.use("/users", user);
routes.use("/auth", auth);

export default routes;
