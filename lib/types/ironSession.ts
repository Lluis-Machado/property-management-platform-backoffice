import { user } from "./user";

declare module "iron-session" {
    interface IronSessionData {
        user?: user
    }
}