import { Client, Account, Databases, Storage } from "appwrite";

const client = new Client();

client
  .setEndpoint("http://localhost:8000/v1")
  .setProject(process.env.REACT_APP_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export default client;
