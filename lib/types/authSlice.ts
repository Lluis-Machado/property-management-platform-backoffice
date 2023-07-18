import { User } from './user';

export type AuthSlice = {
    isLoggedIn: boolean;
    userData: User | null;
    login: (data: User) => void;
    logout: () => void;
};
