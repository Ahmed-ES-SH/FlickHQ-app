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
  LISTS: {
    base: "/api/lists",
    create: "/api/lists",
    getAll: "/api/lists",
    getById: (id: string) => `/api/lists/${id}`,
    update: (id: string) => `/api/lists/${id}`,
    delete: (id: string) => `/api/lists/${id}`,
    addItem: (listId: string) => `/api/lists/${listId}/items`,
    removeItem: (listId: string, mediaType: string, tmdbId: number) =>
      `/api/lists/${listId}/items/${mediaType}/${tmdbId}`,
  },
  AUTH: {
    register: "/api/user",
    login: "/api/auth/login",
    verifyEmail: "/api/auth/verify-email",
    verifyEmailJson: "/api/user/verify-email",
    sendResetPassword: "/api/auth/reset-password/send",
    verifyResetToken: "/api/auth/reset-password/verify",
    resetPassword: "/api/auth/reset-password",
    resendVerification: "/api/auth/resend-verification",
    google: "/api/auth/google",
    googleCallback: "/api/auth/google/callback",
    currentUser: "/api/auth/current-user",
    logout: "/api/auth/logout",
  },
  PLANS: {
    list: "/api/plans",
  },
  SUBSCRIPTIONS: {
    current: "/api/subscriptions/current",
    history: "/api/subscriptions/history",
    historyDetail: (id: string) => `/api/subscriptions/history/${id}`,
  },
  PAYMENTS: {
    history: "/api/payments/history",
    detail: (id: string) => `/api/payments/${id}`,
  },
  BILLING: {
    checkoutSubscription: "/api/billing/checkout/subscription",
    checkoutOneTime: "/api/billing/checkout/one-time",
    checkoutElements: "/api/billing/checkout/embedded-elements",
    checkoutElementsOneTime: "/api/billing/checkout/embedded-elements-one-time",
    portalSession: "/api/billing/portal/session",
    customer: "/api/billing/customer",
  },
  CONTACT: {
    submit: "/api/contact",
  },
  USER: {
    list: "/api/user",
    stats: "/api/user/stats",
    profile: (id: number) => `/api/user/${id}`,
  },
  ADMIN_PLANS: {
    create: "/api/admin/plans",
    list: "/api/admin/plans",
    detail: (id: string) => `/api/admin/plans/${id}`,
    update: (id: string) => `/api/admin/plans/${id}`,
    archive: (id: string) => `/api/admin/plans/${id}/archive`,
    addPrice: (id: string) => `/api/admin/plans/${id}/prices`,
    listPrices: (id: string) => `/api/admin/plans/${id}/prices`,
    deactivatePrice: (priceId: string) => `/api/admin/plans/prices/${priceId}`,
  },
};
