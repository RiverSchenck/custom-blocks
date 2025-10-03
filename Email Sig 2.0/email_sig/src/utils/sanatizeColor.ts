import { RgbaColorWithName } from "../components/fondueCustom/utilities/types";

export const sanitizeColor = (color: RgbaColorWithName): RgbaColorWithName => ({
    red: color.red,
    green: color.green,
    blue: color.blue,
    alpha: color.alpha,
    name: "", // No name
});
