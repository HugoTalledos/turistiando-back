import { GenericObject } from "@models/GenericObject.types";

export interface PostResponse {
    postId: string,
    slug: string,
    title: string,
    description: string,
    images: Array<string>,
    contactInfo: Array<GenericObject>,
    schedule: Array<GenericObject>
    mapLink: string,
    likes: number,
}

export interface Post extends PostResponse {
    isDeleted: boolean
}