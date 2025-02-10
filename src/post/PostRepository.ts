import { Post } from "./Post.types";
import { Collections } from "@util/constants";
import firestoreRef from "@data/firestore";
import createLogger from "@config/logger";
import { PageRequest } from "@models/Page.types";

const log = createLogger({ fileName: 'PostRepository' });

export class PostRepository {
  static async getByCategoryId(categoryId: string, pageRequest: PageRequest | null): Promise<Array<Post> | null> {
    try {
      if (firestoreRef === null) {
        log.error("Fallo en la conexión a bd");
        return null;
      }
      
      
      const collectionRef = firestoreRef.collection(Collections.POST_COLLECTION)
      .where("categoryId", "==", categoryId)

      if (pageRequest && Object.keys(pageRequest).length > 0) {
        const { orderKey = 'createdAt', order = 'desc', limit = 10, lastItem } = pageRequest || {};
        const limitInt = parseInt(`${limit}`, 10);

        collectionRef
        .orderBy(orderKey, order as FirebaseFirestore.OrderByDirection )
        .startAfter(lastItem)
        .limit(limitInt)
      }

      const dbResponse = await collectionRef.get();

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
        .where("slug", "==", slug)
        .limit(1)
        .get();

      if (dbResponse.empty) {
        log.warn(`Post con slug ${slug} no encontrado`);
        return null;
      }
      log.info("Post encontrado");
      return dbResponse.docs[0].data() as Post;
    } catch (e) {
      log.error("Error innesperado: ", e);
      return null;
    }
  }

  static async updateLikeNumber(postId: string, state: boolean): Promise<boolean | null> {
    try {
      if (firestoreRef === null) {
        log.error("Fallo en la conexión a bd");
        return null;
      }

      const docRef = await firestoreRef.collection(Collections.POST_COLLECTION)
        .doc(postId);

      const docData = await docRef.get();

      if (!docData.exists) {
        log.warn("Post no encontrado ", postId);
        return false;
      }

      const { likes, ...all } = docData.data() as Post;

      await docRef.update({
        ...all,
        likes: state ? likes + 1 : likes - 1,
        lastModify: (new Date()).toUTCString(),
      });

      log.info("Actualización de likes realizada");
      return true;
    } catch (e) {
      log.error("Error innesperado", e);
      return null;
    }
  }
}