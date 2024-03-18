import Joi from "joi";

const objectId = () => Joi.string().pattern(/^[0-9a-fA-F]{24}$/);

export const blogSchema = Joi.object({
  author: objectId().required(),
  heading: Joi.string().required(),
  topic: Joi.string().required(),
  bannerImg: Joi.string().required(),
  content: Joi.array().items(
    Joi.object({
      html: Joi.string().allow("").optional(),
      img: Joi.string().allow(""),
      url: Joi.string().allow(""),
      code: Joi.any(),
      youtube: Joi.string().allow("").optional(),
    }),
  ),
  isPublished: Joi.boolean().default(() => false),
  createdAt: Joi.date(),
  updatedAt: Joi.date().default(() => new Date()),
  seen: Joi.number(),
  readingTime: Joi.number(),
  likes: Joi.number(),
  unlikes: Joi.number(),
});

export const updateBlogSchema = Joi.object({
  author: objectId().required(),
  heading: Joi.string(),
  topic: Joi.string(),
  bannerImg: Joi.string(),
  updatedAt: Joi.date().default(() => new Date()),
  readingTime: Joi.number().default(() => 60 * 60 * 5),
  html: Joi.any(),
  image: Joi.string().allow(""),
  url: Joi.string().allow(""),
  code: Joi.any(),
  video: Joi.any(),
});
