import { getRepository } from "typeorm";
import { Request, Response } from "express";
import { User } from "../entity/User";
import { validate } from "class-validator";

class UserController {
  static listAll = async (req: Request, res: Response) => {
    const userRepository = getRepository(User);
    const users = await userRepository.find({
      select: ["id", "username", "role", "createdAt"], //We dont want to send the password on response
    });

    res.send(users);
  };

  static newUser = async (req: Request, res: Response) => {
    let { username, password, role } = req.body;
    let user = new User();
    user.username = username;
    user.password = password;
    user.role = role;

    // validate if the Entity conditions are ok, i mean the parameters
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    // Hash the password before storing into db
    user.hashPassword();

    const userRepository = getRepository(User);

    try {
      await userRepository.save(user);
    } catch (error) {
      res.status(409).send("username already in use");
      return;
    }

    //if all are ok
    res.status(201).send("User Created");
  };

  static getOneById = async (req: Request, res: Response) => {
    // get the id from url
    // if you want to use id: string, you might wanna use <unknown>req.params.id as number
    // because req.params.id is string. other option is to use parseInt. I ignored diclaring the type of id
    const id = req.params.id;

    const userRepository = getRepository(User);
    try {
      const user = await userRepository.findOneOrFail(id, {
        select: ["id", "username", "role", "createdAt"],
      });
      res.send(user);
    } catch (error) {
      res.status(404).send("User Not Found");
    }
  };

  static editUser = async (req: Request, res: Response) => {
    //get id from url
    const id = req.params.id;

    // get values from body
    const { username, role } = req.body;

    const userRepository = getRepository(User);
    let user;

    try {
      user = await userRepository.findOneOrFail(id);
    } catch (error) {
      res.status(404).send("User no found");
      return;
    }

    //validate user infromation
    user.username = username;
    user.role = role;
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    try {
      await userRepository.save(user);
    } catch (error) {
      res.status(409).send("Username already in use");
      return;
    }

    res.status(204).send("user updated");
  };

  static deleteUser = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id = req.params.id;

    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (error) {
      res.status(404).send("User not found");
      return;
    }
    userRepository.delete(id);

    //After all send a 204 (no content, but accepted) response
    res.status(204).send("User deleted successfully");
  };

  static getProfilewithPayloadId = async (req: Request, res: Response) => {
    // get the user id from checkJwt middleware setted into local response
    const id = res.locals.jwtPayload.userId;

    const userRepository = getRepository(User);
    try {
      const user = await userRepository.findOneOrFail(id, {
        select: ["id", "username", "role", "createdAt"],
      });
      res.send(user);
    } catch (error) {
      res.status(404).send("User Not Found");
    }
  };
}

export default UserController;
