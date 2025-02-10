import { APIResponse, failQuery, notResultFound, successQuery } from "@models/APIResponse.types"
import { PageRequest } from "@models/Page.types"
import { CategoryResponse } from "./Category.types"
import createLogger from "@config/logger"
import { CategoryRepository } from "./CategoryRepository";

const log = createLogger({ fileName: "CategoryService "});

export const getAllCategories = async (page: PageRequest | undefined): Promise<APIResponse<CategoryResponse[] | null>> => {
  try {
    log.info("Consultando categorias");

    const categoryList = await CategoryRepository.getAllCategories(page);

    if (!categoryList) {
      log.warn("Fallo en consulta de bd");
      return failQuery();
    }

    if (categoryList.length <= 0) {
      log.warn("No se encontraron categorias");
      return notResultFound();
    }

    log.info("Categorias encontradas: {}", categoryList.length);
    return successQuery<CategoryResponse[]>(categoryList);
  } catch (e) {
    log.error("Error innesperado: ", e);
    return failQuery();
  }
}