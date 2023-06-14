import { Client, Account, Databases, Storage, Functions } from "appwrite";

const client = new Client();

client
  .setEndpoint(process.env.REACT_APP_APPWRITE_SERVER)
  .setProject(process.env.REACT_APP_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const functions = new Functions(client);
export default client;
