import { GenericObject, ScheduleObject } from "@models/GenericObject.types";

export interface PostResponse {
    postId: string,
    slug: string,
    title: string,
    description: string,
    images: Array<string>,
    categoryId: string,
    contactInfo: Array<GenericObject>,
    schedule: Array<ScheduleObject>
    mapLink: string,
    likes: number,
    isOpen: boolean
}

export interface Post extends PostResponse {
    isDeleted: boolean
    createdAt: string,
    order: number,
    updatedAt: string
}