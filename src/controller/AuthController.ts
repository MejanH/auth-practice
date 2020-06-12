import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import { validate } from "class-validator";

import { User } from "../entity/User";
import config from "../config/config";

class AuthController {
  static login = async (req: Request, res: Response) => {
    //Check if username and password are set
    let { username, password } = req.body;
    if (!(username && password)) {
      res.status(400).send();
    }

    //get user from database
    const userRepository = getRepository(User);
    let user: User;

    try {
      user = await userRepository.findOneOrFail({ where: { username } });
    } catch (error) {
      res.status(401).send();
    }

    // check if encrypted password match
    if (!user.checkIfUncryptedPasswordIsValid(password)) {
      res.status(401).send();
      return;
    }

    //Sign jwt, valid for 1h
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      config.jwtSecret,
      {
        expiresIn: "1h",
      }
    );

    // Send the jwt in response
    res.send(token);
  };

  static changePassword = async (req: Request, res: Response) => {
    // Get id from logged in token
    const id = res.locals.jwtPayload.userId;

    //get parameters from body
    const { oldPassword, newPassword } = req.body;
    if (!(oldPassword && newPassword)) {
      res.status(400).send();
    }

    //get user from db
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (error) {
      res.status(401).send("user not found");
    }

    //check if the old password match
    if (!user.checkIfUncryptedPasswordIsValid(oldPassword)) {
      res.send(401).send();
      return;
    }

    // Validate user model
    user.password = newPassword;
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    //Hash the new password
    user.hashPassword();

    userRepository.save(user);

    res.status(204).send();
  };
}

export default AuthController;
