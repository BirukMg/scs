import axios from "axios";

const state = {
  token: {},
  authenticated: false,
  status: "logged out",
  user: {}
};

const getters = {
  token: state => state.token,
  user: state => state.user,
  isAuthenticated: state => state.authenticated,
  authStatus: state => state.status
};

const mutations = {
  login: state => (state.status = "loging in..."),
  logout: state => (state.status = "logging out..."),
  loginSuccess: state => (state.status = "logged in"),
  loginError: state => (state.status = "login error"),
  logoutSuccess: state => (state.status = "logged out"),
  authenticate: state => (state.authenticated = true),
  unauthenticate: state => (state.authenticated = false),
  setToken: (state, token) => (state.token = token),
  setUser: (state, user) => (state.user = user),
  checkAuth: state => (state.status = "checking auth status..."),
  tokenError: state => (state.status = "token verification error")
};

const actions = {
  login: ({ commit, dispatch }, user) => {
    return new Promise((resolve, reject) => {
      commit("login");
      axios
        .post("http://localhost:3000/api/Customers/login", user)
        .then(response => {
          localStorage.setItem("token", JSON.stringify(response.data));
          commit("setToken", response.data);
          commit("authenticate");
          commit("loginSuccess");
          dispatch("checkAuth", response.data);
          resolve(response);
        })
        .catch(error => {
          localStorage.removeItem("token");
          commit("setToken", {});
          commit("unauthenticate");
          commit("loginError");
          reject(error);
        });
    });
  },
  logout: ({ commit }) => {
    return new Promise(resolve => {
      commit("logout");
      localStorage.removeItem("token");
      commit("setToken", {});
      commit("unauthenticate");
      commit("logoutSuccess");
      resolve();
    });
  },
  checkAuth: ({ commit }, token) => {
    commit("checkAuth");
    return new Promise((resolve, reject) => {
      commit("setToken", token);
      axios
        .get(
          "http://localhost:3000/api/Customers/" +
            token.userId +
            "?access_token=" +
            token.id
        )
        .then(response => {
          commit("authenticate");
          commit("loginSuccess");
          commit("setUser", response.data);
          resolve(response);
        })
        .catch(error => {
          commit("setToken", {});
          commit("unauthenticate");
          commit("tokenError");
          reject(error);
        });
    });
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
