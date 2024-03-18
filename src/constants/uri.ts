export const serverEndPointsAuth = {
  REGISTER: "/auth/register",
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  API: "api",
  AUTH: "auth",
};

export const clientEndPointsAuth = {
  REGISTER: "/auth/register",
  LOGIN: "/auth/login",
  HOME: "/",
};

export const clientEndPoints = {
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
};

export const staticImgLinks = {
  NO_IMG:
    "https://academic-spehere.s3.ap-south-1.amazonaws.com/static/No_image_available.svg.png",
};

export const middlewareMatcher = [
  "/",
  "/auth/login",
  "/auth/register",
  "/dashboard",
];
