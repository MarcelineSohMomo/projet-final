import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

const signup = (payload) => api.post("/auth/signup", payload);
const signupArtisan = (payload) => api.post("/auth/signup-artisan", payload);
const signupModerator = (payload) =>
  api.post("/auth/signup-moderator", payload);
const signin = (payload) => api.post("/auth/signin", payload);
const signout = (payload) => api.put("/auth/signout/:id", payload);

const updateUser = (payload, headers) =>
  api.put(`/user/${headers.headers.id}`, payload, headers);
const updateAvailability = (payload, headers) =>
  api.put(`/user/update-availability/${headers.headers.id}`, payload, headers);
const updateUserImg = (payload, headers) =>
  api.post(`/user/upload/${headers.headers.id}`, payload, headers);
const deleteUser = (payload, headers) =>
  api.delete(`/user/${payload}`, headers);
const reinitialiseUser = (payload, headers) =>
  api.put(`/user/${payload}`, headers);
const getAdminInfo = (header) => api.get("/user/admin", header);
const getUsers = (header) => api.get("/user/", header);
const getUser = (header) => api.get(`/user/${header.headers.id}`, header);
const getProvider_Moderateur_Admin = (header) =>
  api.get("/user/without-customer", header);
const getUsersAndNotification = (header) =>
  api.get(`/user/notification/${header.headers.id}`, header);

const createService = (payload, headers) =>
  api.post("/service", payload, headers);
const services = (payload) => api.get("/service", payload);
const searchServices = (headers) =>
  api.get(
    `/service/search?key=${headers.headers.query}&lat=${headers.headers.lat}&lng=${headers.headers.lng}&dis=${headers.headers.distance}`,
    headers
  );
const getService = (headers) =>
  api.get(`/service/${headers.headers.id}`, headers);
const getServices = (headers) => api.get(`/service/`, headers);
const servicesByProvider = (headers) =>
  api.get(`/service/provider/${headers.headers.id}`, headers);
const updateServiceImgs = (payload, headers) =>
  api.post(`/service/upload/${headers.headers.id}`, payload, headers);
const updateService = (payload, headers) =>
  api.put(`/service/${headers.headers.id}`, payload, headers);
const copyServiceTo = (payload, headers) =>
  api.put(`/service/copy-to/${headers.headers.id}`, payload, headers);

const deleteService = (headers) =>
  api.delete(`/service/${headers.headers.id}`, headers);
const deleteAllServices = (headers) =>
  api.delete(`/service/allservice/${headers.headers.id}`, headers);

const getRatings = (id, headers) => api.get(`/note/${id}`, headers);
const updateRating = (payload, headers) =>
  api.patch("/note/", payload, headers);

const getCategories = (payload) => api.get("/categorie", payload);
const updateCategorie = (payload) => api.get("/categorie/:id", payload);
const createCategorie = (payload) => api.get("/categorie/:id", payload);
const deleteCategorie = (payload) => api.get("/categorie/:id", payload);

const getPrivateComments = async (headers) =>
  api.get(`/comment/private/${headers.headers.id}`, headers);
const getCommentsByIds = (payload, headers) =>
  api.post("/comment/ids", payload, headers);
const getComments = (headers) =>
  api.get(`/comment/${headers.headers.id}`, headers);
const postComment = (payload, hearders) =>
  api.post("/comment", payload, hearders);
const updateComment = (payload, headers) =>
  api.put(`/comment/${headers.headers.id}`, payload, headers);
const deleteComment = (hearders) =>
  api.delete(`/comment/${hearders.headers.id}`, hearders);

const getCommandes = (headers) =>
  api.get(`/Commande/${headers.headers.id}`, headers);
const getCommandesCustormer = (headers) =>
  api.get(`/commande/me/${headers.headers.id}`, headers);
const getCommandesByProvider = (headers) =>
  api.get(`/commande/client/${headers.headers.id}`, headers);
const groupCommandsByStatus = (headers) =>
  api.get(
    `/commande/provider/commands-by-status/${headers.headers.id}`,
    headers
  );
const updateCommande = (payload, hearders) =>
  api.put(`/commande/${hearders.headers.id}`, payload, hearders);
const deleteCommande = (hearders) =>
  api.delete(`/commande/${hearders.headers.id}`, hearders);
const createCommande = (payload, headers) =>
  api.post("/commande/", payload, headers);

const getNotesByUser = (headers) =>
  api.get(`/note/user/${headers.headers.id}`, headers);
const getNotes = (headers) => api.get(`/note/${headers.id}`, headers);

const toggleFavorite = (id, headers) =>
  api.patch(`/favorite/${id}`, headers, headers);
const getFavoriteServices = (headers) =>
  api.get(`/service/favorite/${headers.headers.id}`, headers);

const getDiscussion = (users) =>
  api.get(`/message?userId1=${users.userId1}&userId2=${users.userId2}`, users);
const getConversation = (headers) =>
  api.get(`/conversation/support${headers.headers.id}`);
const getConversations = (headers) =>
  api.get(`/conversation/${headers.headers.id}`, headers);
const createMessage = (payload, header) =>
  api.post("/message/", payload, header);
const createConversation = (payload, header) =>
  api.post("/conversation", payload, header);
const deleteMessage = (payload, header) =>
  api.delete(`/message/${payload.id}`, header);
const editMessage = (payload, header) =>
  api.put(`/message/${payload.id}`, payload, header);

const getHistorique = (headers) =>
  api.get(`/historique/${headers.headers.id}`, headers);
const createHistorique = (payload) => api.post("/historique/", payload);
const updateHistorique = (headers) =>
  api.put(`/historique/${headers.headers.id}`, headers);
const deleteHistorique = (headers) =>
  api.delete(`/historique/${headers.headers.id}`, headers);

const getStats = (headers) =>
  api.get(`/service/stats/${headers.headers.id}`, headers);

export default {
  signupArtisan,
  signupModerator,
  signup,
  signin,
  signout,
  createService,
  searchServices,
  getService,
  getServices,
  updateService,
  deleteService,
  deleteAllServices,
  updateServiceImgs,
  servicesByProvider,
  services,
  getCategories,
  updateCategorie,
  createCategorie,
  deleteCategorie,
  updateUser,
  updateAvailability,
  updateUserImg,
  deleteUser,
  reinitialiseUser,
  getComments,
  getCommentsByIds,
  postComment,
  updateComment,
  deleteComment,
  getRatings,
  updateRating,
  toggleFavorite,
  getCommandes,
  groupCommandsByStatus,
  getCommandesByProvider,
  getCommandesCustormer,
  updateCommande,
  deleteCommande,
  createCommande,
  getNotesByUser,
  getFavoriteServices,
  getDiscussion,
  createMessage,
  createConversation,
  getConversation,
  getConversations,
  getPrivateComments,
  getAdminInfo,
  deleteMessage,
  editMessage,
  getUsers,
  getUser,
  getProvider_Moderateur_Admin,
  getUsersAndNotification,
  getHistorique,
  createHistorique,
  updateHistorique,
  deleteHistorique,
  copyServiceTo,
  getStats,
};
