import express from "express";
import { Messages } from "@util/constants";
import createLogger from "@config/logger";
import { getAllCategories } from "./CategoryService";

const log = createLogger({ fileName: 'CategoryController '});

const router = express.Router();

router.post("/", async (req, res) => {
    log.info(Messages.START_SERVICE, Messages.GET_CATEGORIES);
    const response = await getAllCategories(req.body);
    res.status(response.code).send(response);
    log.info(Messages.RESPONSE_SERVICE, JSON.stringify(response));
    log.info(Messages.END_SERVICE, Messages.GET_POST);
});

export const categoryController = router;