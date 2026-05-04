import { nanoid } from "nanoid";

export const generateUniqueSlug = (name: string) => {
  const id = nanoid(5);
  const slug =
    id +
    "-" +
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+/g, "-");
  return slug;
};
