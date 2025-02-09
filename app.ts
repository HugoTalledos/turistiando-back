
import express, { Application } from "express";
import Server from "./src/server";
import { ServerConfig} from "@config/config";

const app: Application = express();
new Server(app);
const PORT: number = ServerConfig.port;

app
  .listen(PORT, "localhost", function () {
    console.log(`Server is running on port ${PORT}.`);
  })
  .on("error", (err: any) => {
    if (err.code === "EADDRINUSE") {
      console.log("Error: address already in use");
    } else {
      console.log(err);
    }
  });