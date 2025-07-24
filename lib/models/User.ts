import { ObjectId } from "mongodb";

export interface User {
  _id?: ObjectId;
  email: string;
  name: string;
  password?: string;
  role: "user" | "admin";
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserWithoutPassword extends Omit<User, "password"> {
  password?: never;
}

export const createUser = (
  userData: Omit<User, "_id" | "createdAt" | "updatedAt">
): User => {
  return {
    ...userData,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};
