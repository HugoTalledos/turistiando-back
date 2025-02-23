import { PostResponse } from "./Post.types"
import createLogger from "@config/logger";
import { PostRepository } from "./PostRepository";
import { successQuery, APIResponse, failQuery, declinedQuery, notResultFound } from "@models/APIResponse.types";
import { PageRequest } from "@models/Page.types";
import { GenericObject, ScheduleObject } from "@models/GenericObject.types";
const log = createLogger({ fileName: "PostService " });

export const getPost = async ({ slug }: { slug: string }): Promise<APIResponse<PostResponse | null>> => {
  try {
    log.info("Buscando post: {}", slug);
    const postEntity = await PostRepository.getBySlug(slug);

    if (postEntity === null) {
      log.warn("Respuesta de repositorio vacia");
      return declinedQuery("Slug incorrecta");
    }

    const { isDeleted, schedule, ...all } = postEntity;

    const isOpen = checkSchedule(schedule);

    if (isDeleted) {
      log.warn(`Post con slug ${slug} eliminado de bd`);
      return notResultFound();
    }

    log.info("Post encontrado exitosamente");
    return successQuery({ schedule, ...all, isOpen });
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
      log.warn("No se encontraron post relacionados a categoryId: ", categoryId);
      return notResultFound();
    }

    const newPostList = postList.map(({ schedule, ...all }) =>({...all, isOpen: checkSchedule(schedule), schedule }));

    log.info("Post encontrados: ", newPostList.length);
    return successQuery<PostResponse[]>(newPostList);
  } catch (e) {
    log.error(e);
    return failQuery();
  }
}

export const countLikesForPost = async ({ postId, state }: { postId: string, state: boolean }): Promise<APIResponse<boolean | null>> => {
  try {
    const updateStatus = await PostRepository.updateLikeNumber(postId, state);

    if (!updateStatus) {
      log.warn("Fallo en la actualización de likes del post: ", postId);
      return failQuery();
    }

    log.info("Likes actualizados correctamente");
    return successQuery(true);
  } catch (e) {
    log.error(e);
    return failQuery();
  }
}


export const getRandomPost = async (): Promise<APIResponse<PostResponse | null>> => {
  try {
    log.info("Buscando posts");
    const allPosts = await PostRepository.getAllPosts();

    if (!allPosts || allPosts.length <= 0) {
      log.warn("No se encontraron resultados en la bd");
      return failQuery();
    }

    const sizeList = allPosts.length;
    log.info("Posts encontrados: ", sizeList)
    const randomNumber = Math.floor(Math.random() * sizeList);
    log.info("Numero aleatorio generado: ", randomNumber);

    return successQuery(allPosts[randomNumber]);
  } catch (e) {
    log.error("Error innesperado: ", e);
    return failQuery();
  }
}

const checkSchedule = (scheduleList: ScheduleObject[]): boolean => {
  const date = new Date()
  const day = date.getDay()
  const { schedule: currentSchedule = null } = scheduleList[day - 1] || {};

  if (!currentSchedule) return false;

  const [time1, time2] = currentSchedule.toString().split("-");
  const formatedFirstHour = parseAMPM(time1);
  const formatedSecondHour = parseAMPM(time2.trimStart())
  const curretHour = date.getHours();
  const currentMinutes = date.getMinutes();

  const totalMinutesFirst = formatedFirstHour.hours * 60 + formatedFirstHour.minutes;
  const totalMinutesCurrent = curretHour * 60 + currentMinutes;
  const totalMinutesSecond = formatedSecondHour.hours * 60 + formatedSecondHour.minutes;
  
  const isWithinRange = totalMinutesFirst < totalMinutesCurrent && totalMinutesCurrent < totalMinutesSecond;

  return isWithinRange;
}

const parseAMPM = (timeStr: string) => {
  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (modifier === "PM" && hours !== 12) {
    hours += 12;
  }
  if (modifier === "AM" && hours === 12) {
    hours = 0;
  }

  return { hours, minutes };
};