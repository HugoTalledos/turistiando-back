
import express, { Application } from "express";
import cors, { CorsOptions } from "cors";
import { Cors, ServerConfig } from "@config/config";
import { postController } from "post/PostController";

export default class Server {
  constructor(app: Application) {
    this.config(app);
  }

  private config(app: Application): void {
    const allowLocal = ServerConfig.env === 'local' ? Cors.local : [];
    const allowDev = ServerConfig.env === 'dev' ? Cors.dev : [];
    const allowList = [...allowLocal, ...allowDev, ...Cors.prod];

    const corsOptions: CorsOptions = { origin: allowList };

    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use('/api/post', postController);
  }
}

