import { user } from "./user";

export type AuthSlice = {
    isLoggedIn: boolean;
    userData: user | null;
    login: (data: user) => void;
    logout: () => void;
};