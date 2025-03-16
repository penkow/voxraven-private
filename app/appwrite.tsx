import { Client, Account } from "appwrite";

export const client = new Client();

client.setProject("67d071130009125872b1");

export const account = new Account(client);
export { ID } from "appwrite";
