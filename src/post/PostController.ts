import express from "express";
import { Messages } from "@util/constants";
import createLogger from "@config/logger";
import { countLikesForPost, getPost, getPostByCategory, getRandomPost } from "./PostService";

const log = createLogger({ fileName: 'PostController '});

const router = express.Router();

router.get("/:slug", async (req, res) => {
    log.info(Messages.START_SERVICE, Messages.GET_POST);
    const { slug } = req.params;
    const response = await getPost({ slug })
    res.status(response.code).send(response);
    log.info(Messages.RESPONSE_SERVICE, JSON.stringify(response));
    log.info(Messages.END_SERVICE, Messages.GET_POST);
});

router.post("/category/:categoryId", async (req, res) => {
    log.info(Messages.START_SERVICE, Messages.GET_POSTS_BY_CATEGORY);
    const { body } = req;
    const { categoryId } = req.params
    const response = await getPostByCategory({ categoryId, page: body });
    res.status(response.code).send(response);
    log.info(Messages.END_SERVICE, Messages.GET_POSTS_BY_CATEGORY);
});

router.put("/like", async (req, res) => {
    log.info(Messages.START_SERVICE, Messages.COUNTER_LIKES);
    const response = await countLikesForPost(req.body);
    res.status(response.code).send(response);
    log.info(Messages.END_SERVICE, Messages.COUNTER_LIKES);
})

router.get("/random", async (_, res) => {
    log.info(Messages.START_SERVICE, Messages.GET_RANDOM_POST);
    const response = await getRandomPost();
    res.status(response.code).send(response);
    log.info(Messages.END_SERVICE, Messages.GET_RANDOM_POST);
})

export const postController = router;