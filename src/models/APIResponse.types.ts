export interface APIResponse<T> {
    code: number,
    status: boolean,
    message: string,
    data: T
}

export function successQuery<T> (data: T): APIResponse<T> {
    return {
        code: 200,
        status: true,
        message: "Consulta exitosa",
        data
    }
};

export function failQuery(): APIResponse<null> {
    return {
        code: 500,
        status: false,
        message: "fallo en la consulta",
        data: null
    }
}

export function declinedQuery(message: string): APIResponse<null> {
    return {
        code: 409,
        status: false,
        message,
        data: null
    }
}

export function notResultFound(): APIResponse<null> {
    return {
        code: 404,
        status: false,
        message: "Resultado no encontrado",
        data: null
    }
}