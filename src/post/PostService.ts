import { PostResponse } from "./Post.types"
import createLogger from "@config/logger";
import { PostRepository } from "./PostRepository";
import { successQuery, APIResponse, failQuery, declinedQuery, notResultFound } from "@models/APIResponse.types";
import { PageRequest } from "@models/Page.types";
const log = createLogger({ fileName: "PostService " });

export const getPost = async ({ slug }: { slug: string }): Promise<APIResponse<PostResponse | null>> => {
  try {
    log.info("Buscando post: {}", slug);
    const postEntity = await PostRepository.getBySlug(slug);

    if (postEntity === null) {
      log.warn("Respuesta de repositorio vacia");
      return declinedQuery("Slug incorrecta");
    }

    const { isDeleted, ...all } = postEntity;

      if (isDeleted) {
        log.warn(`Post con slug ${slug} eliminado de bd`);
        return notResultFound();
      }

    log.info("Post encontrado exitosamente");
    return successQuery(all);
  } catch (e) {
    log.error(e);
    return failQuery();
  }
};

export const getPostByCategory = async ({ categoryId, page }: { categoryId: string, page: PageRequest }): Promise<APIResponse<PostResponse[] | null>> => {
  try {
    log.info("Consultando post con categoryId: ", categoryId);

    const postList = await PostRepository.getByCategoryId(categoryId, page);

    if (!postList) {
      log.warn("Fallo en consulta de bd");
      return failQuery();
    }

    if (postList.length <= 0) {
      log.warn("No se encontraron post relacionados a categoryId: {}", categoryId);
      return notResultFound();
    }

    log.info("Post encontrados: {}", postList.length);
    return successQuery<PostResponse[]>(postList);
  } catch (e) {
    log.error(e);
    return failQuery();
  }
}