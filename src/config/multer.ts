import { cloudinaryInstance } from "./cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryInstance,
  params: async (req, file) => {
    const originalFile = file.originalname;
    const extension = originalFile.split(".").pop()?.toLocaleLowerCase();
    const fileNameWithoutExtension = file.originalname
      .split(".")
      .slice(0, -1)
      .join(".")
      .toLocaleLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9_]/g, "");

    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}-${fileNameWithoutExtension}`;

    const folder = extension === "pdf" ? "pdfs" : "images";

    return {
      folder: `medical-e-commerce/${folder}`,
      public_id: uniqueName,
      resource_type: "auto",
    };
  },
});

export const multerStorage = multer({
  storage,
});
