import { User } from './user';

declare module 'iron-session' {
    interface IronSessionData {
        user?: User
    }
};