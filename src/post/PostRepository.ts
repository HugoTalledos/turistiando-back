import { Post } from "./Post.types";
import { Collections } from "@util/constants";
import firestoreRef from "@data/firestore";
import createLogger from "@config/logger";
import { PageRequest } from "@models/Page.types";

const log = createLogger({ fileName: 'PostRepository' });

export class PostRepository {
  static async getByCategoryId(categoryId: string, pageRequest: PageRequest): Promise<Array<Post> | null> {
    try {
      const { orderKey = 'creationDate', order = 'desc', limit = 10, lastItem } = pageRequest;
      if (firestoreRef === null) {
        log.error("Fallo en la conexión a bd");
        return null;
      }

      const limitInt = parseInt(`${limit}`, 10);

      const dbResponse = await firestoreRef.collection(Collections.POST_COLLECTION)
        .where("categoryId", "==", categoryId)
        .orderBy(orderKey, order as FirebaseFirestore.OrderByDirection )
        .startAfter(lastItem)
        .limit(limitInt)
        .get();

      return dbResponse.docs.map((doc) => doc.data() as Post);
    } catch (e) {
      log.error("Error innesperado: ", e);
      return null;
    }
  }

  static async getBySlug(slug: string): Promise<Post | null> {
    try {
      if (firestoreRef === null) {
        log.error("Fallo en la conexión a bd");
        return null;
      }

      const dbResponse = await firestoreRef.collection(Collections.POST_COLLECTION)
        .doc(slug)
        .get();

      if (!dbResponse.exists) {
        log.warn(`Post con slug ${slug} no encontrado`);
        return null;
      }
      log.info("Post encontrado");
      return dbResponse.data() as Post;
    } catch (e) {
      log.error("Error innesperado: ", e);
      return null;
    }
  }
}