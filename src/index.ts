import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import routes from "./routes";

createConnection()
  .then(async (connection) => {
    // create express app
    const app = express();
    app.use(bodyParser.json());
    app.use(cors());

    //all routes
    app.use("/", routes);

    // setup express app here
    // ...

    // start express server
    app.listen(5000);

    console.log(
      "Express server has started on port 3000. Open http://localhost:5000/users to see results"
    );
  })
  .catch((error) => console.log(error));
