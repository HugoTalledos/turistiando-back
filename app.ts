
import express, { Application } from "express";
import Server from "./src/server";
import { ServerConfig} from "@config/config";
import createLogger from "@config/logger";

const log = createLogger({ fileName: 'app.ts' })

const app: Application = express();
new Server(app);
const PORT: number = ServerConfig.port;

app
  .listen(PORT, "localhost", function () {
    log.info(`Server is running on port ${PORT}.`);
  })
  .on("error", (err: any) => {
    if (err.code === "EADDRINUSE") {
      log.warn("Error: address already in use");
    } else {
      log.error(err);
    }
  });