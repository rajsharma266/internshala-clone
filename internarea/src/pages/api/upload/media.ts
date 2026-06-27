import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import { v2 as cloudinary } from "cloudinary";

export const config = {
  api: {
    bodyParser: false,
  },
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return res.status(500).json({ error: "Cloudinary is not configured" });
    }

    const form = formidable({ multiples: false });

    const parsed = await new Promise<any>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          reject(err);
          return;
        }

        resolve({ fields, files });
      });
    });

    const file = Array.isArray(parsed.files.file)
      ? parsed.files.file[0]
      : parsed.files.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const result = await cloudinary.uploader.upload(file.filepath, {
      folder: "internarea-public-space",
      resource_type: "auto",
    });

    return res.status(200).json({
      url: result.secure_url,
      resourceType: result.resource_type,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Upload failed" });
  }
}
