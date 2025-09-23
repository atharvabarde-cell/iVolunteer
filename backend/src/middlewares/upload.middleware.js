import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";


const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "ngo-events", // all event images go in this folder
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

export const upload = multer({ storage });
