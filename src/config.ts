import data from "../config/default.json";
import { get } from "lodash";

export const config = {
  get: (setting: string) => get(data, setting),
};
