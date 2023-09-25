import Cryptr from "cryptr";
import {env} from "~/env.mjs";

export const cryptoTr = new Cryptr(env.ENCRYPTION_KEY)
