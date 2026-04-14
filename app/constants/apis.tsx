export const TopratedMovies = "/movie/top_rated?language=en-US&limit=10&page=1";
export const TopratedShows = "/tv/top_rated?language=en-US&page=1";
export const genersMovies = "/genre/movie/list?language=en";
export const trendingMovies = "/trending/movie/day?language=en-US";
export const trendingShows = "/trending/tv/day?language=en-US";
export const genresShows = "/genre/tv/list?language=en";
export const popularTvShow = "/tv/popular?language=en-US&";
export const PopularMovies = "/movie/popular?language=en-US&";
export const nowPlaying = "/movie/now_playing?language=en-US&";
export const latestShows = "/movie/now_playing?language=en-US&";
export const latestMoviesApi = "/movie/latest";
export const upcomingMovies = "/movie/upcoming?language=en-US&";
export const upcomingShows = "/tv/popular?language=en-US&";
// GET https://api.themoviedb.org/3/discover/movie?with_genres=28&language=en-US&page=1

export const API_ENDPOINTS = {
  AUTH: {
    login: "api/auth/login",
    register: "api/auth/register",
    logout: "api/auth/logout",
    verify: "api/auth/verify-email",
    updateProfile: "api/auth/update-user",
    resetPassword: "api/auth/rest-password",
    sendResetPassword: "api/auth/rest-password/send",
    verifyResetToken: "api/auth/rest-password/verify",
    currentUser: "api/auth/current-user",
  },
};
