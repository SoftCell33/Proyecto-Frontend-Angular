export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    email: string;
    nombreCompleto: string;
}

export interface RegisterRequest {
    nombreCompleto: string;
    email: string;
    telefono: string;
    direccion: string;
    municipio: string;
    password: string;
    confirmPassword: string;
}



export interface RegisterFormData {
    nombreCompleto: string;
    email: string;
    telefono: string;
    direccion: string;
    municipio: string;
    password: string;
    confirmPassword: string;
}