export interface CategoryResponse {
    categoryId: string,
    title: string,
    description: string,
}

export interface Category extends CategoryResponse{
    createdAt: string,
    updatedAt: string,
    isDeleted: boolean
}