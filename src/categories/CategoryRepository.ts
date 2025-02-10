import createLogger from "@config/logger";
import { Category } from "./Category.types";
import firestoreRef from "@data/firestore";
import { Collections } from "@util/constants";
import { PageRequest } from "@models/Page.types";
const log = createLogger({ fileName: "CategoryRepository " });

export class CategoryRepository {
  static async getAllCategories(page: PageRequest | undefined): Promise<Category[] | null> {
    try {
      if (firestoreRef === null) {
        log.error("Fallo en la conexión a bd");
        return null;
      }

      const collectionRef = await firestoreRef.collection(Collections.CATEGORY_COLLECTION)

      if (page) {
        const { orderKey = 'createdAt', order = 'desc', limit = 10, lastItem } = page;
        const limitInt = parseInt(`${limit}`, 10);
        collectionRef
          .orderBy(orderKey, order as FirebaseFirestore.OrderByDirection)
          .startAfter(lastItem)
          .limit(limitInt)
      }

      const dbResponse = await collectionRef.get();

      return dbResponse.docs.map((doc) => doc.data() as Category);
    } catch (e) {
      log.error("Error innesperado");
      return null;
    }
  }
}