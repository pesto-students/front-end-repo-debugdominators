import { s3bucket } from "@/constants/service";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getFileExtFromType, getFileTypeFomBase64 } from "../helpers/methods";
import { fileType } from "@/constants/random";

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY!,
    secretAccessKey: process.env.SECRET_KEY!,
  },
  region: process.env.REGION!,
});

const { SVG, PNG, GIF, JPG, JPEG } = fileType;
const imgFileTypes = [SVG, PNG, GIF, JPG, JPEG];

export const imageUpload = async (img: string) => {
  const base64 = img.split("/");
  if (base64[0] === "data:image") {
    const type = getFileTypeFomBase64(img);
    const ext = getFileExtFromType(type);
    if (imgFileTypes.find((elem) => elem === type)) {
      const buffer = Buffer.from(img.split(",")[1], "base64");
      const key: string = `${Date.now()}.${ext}`;
      const params = {
        Bucket: s3bucket.BLOG_IMAGE,
        Key: key,
        Body: buffer,
        ContentType: type,
      };
      const uploadCommand = new PutObjectCommand(params);
      const response = await s3.send(uploadCommand);
      if (response) return `${s3bucket.BUCKET_URL}/${key}`;
      return false;
    }
    return false;
  }
  return false;
};
