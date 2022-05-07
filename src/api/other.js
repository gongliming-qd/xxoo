import { http_giphy } from "./ajax_giphy";

// get
export const gifsTrending = data => {
  return http_giphy.get("/api/gifs/trending", { params: data });
};

export const gifsSearch = data => {
  return http_giphy.get("/api/gifs/search", { params: data });
};

export const clipsTrending = data => {
  return http_giphy.get("/v1/clips/trending", { params: data });
};

export const clipsSearch = data => {
  return http_giphy.get("/v1/clips/search", { params: data });
};

export const stickersTrending = data => {
  return http_giphy.get("/api/stickers/trending", { params: data });
};

export const stickersSearch = data => {
  return http_giphy.get("/api/stickers/search", { params: data });
};


export const photosTrending = data => {
  return http_giphy.get("/api/photos", { params: data });
};

export const photosSearch = data => {
  return http_giphy.get("/api/search/photos", { params: data });
};

export const videosSearch = data => {
  return http_giphy.get("/api/search/videos", { params: data });
};

// post
export const testPost = data => {
  return http.post("/api/material/productlist", data);
};
