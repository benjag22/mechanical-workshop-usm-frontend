import * as sdk from "./sdk.gen";
import {client} from "./client.gen";
export default sdk;
export type * from "./types.gen";

client.setConfig({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  credentials: "include",
});
