import { users } from "@prisma/client";

// export type UserType = users;
export type UserType = {
    id: number;
    username: string;
    password: string;
    email: string;
    create_at: Date;
    update_at: Date | null;
    active: boolean;
};
