import { Request, Response, NextFunction } from "express";
import { getRepository } from "typeorm";

import { User } from "../entity/User";

export const checkRole = (roles: Array<string>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    //get the user id from previous middleware
    const id = res.locals.jwtPayload.userId;

    // Get User role from database
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (error) {
      res.status(401).send();
    }

    //check if array of authorized role include the user's role
    if (roles.indexOf(user.role) > -1) next();
    else res.status(401).send();
  };
};
