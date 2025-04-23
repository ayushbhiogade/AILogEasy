// src/types/models.ts (Add UserCreate)

export namespace models {

    export interface UserLoginCredentials { // Renamed for clarity maybe? Or keep using UserCreate? Let's add UserCreate distinctly.
        username: string;
        password: string;
    }

    export interface Token {
        access_token: string;
        token_type: string;
    }

    export interface UserRead {
        id: number;
        email: string;
        full_name?: string | null;
        is_active?: boolean;
        is_superuser?: boolean;
    }

    // Add UserCreate (matching backend's input model for registration)
    export interface UserCreate {
        email: string;
        password: string;
        full_name?: string | null; // Optional based on backend model
    }
}