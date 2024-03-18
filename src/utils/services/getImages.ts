import axios from "axios";
import { UnsplashAPI } from "../types/service";

export const getImageFromUnsplash = async ({
  search,
  page,
  per_page,
}: UnsplashAPI) => {
  const response = await axios.get(process.env.UNSPLASH_API!, {
    params: {
      query: search,
      page,
      per_page,
    },
    headers: {
      Authorization: `Client-ID ${process.env.SPLASH_ACCESS_KEY}`,
    },
  });
  const imgLinks = [];
  const result = response?.data.results;

  for (let i = 0; i < result?.length; i++) {
    const { urls } = result[i];
    const { raw } = urls;
    imgLinks.push(raw);
  }
  return {
    imgLinks,
    total: response?.data?.total,
    total_pages: response?.data?.total_pages,
  };
};
