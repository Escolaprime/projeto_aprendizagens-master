import axios from "../../configs/axios.config";
import db from "@/plugins/db";
import { Storage } from "@capacitor/storage";
import { Network } from "@capacitor/network";
const KEY_STORAGE = "offline";

export default {
  async login_aluno({ commit, dispatch }, payload) {
    const { connected } = await Network.getStatus();

    if (connected) {
      return await axios
        .get("/autenticacao/loginAluno", {
          headers: {
            numero_matricula: payload,
          },
        })
        .then(async ({ data }) => {
          const { token, ...aluno } = data;
          commit("SET_USER", aluno);
          await dispatch("set_token_storage", token);
          await dispatch("verify_aluno_storage");
          Promise.resolve();
        })
        .catch((err) => Promise.reject(err));
    }

    let { value } = await Storage.get({ key: KEY_STORAGE });
    value = JSON.parse(value);

    const [aluno] = value.filter((item) => item.numero_matricula === payload);

    if (aluno) {
      commit("SET_USER", aluno);
      dispatch("verify_aluno_storage");
      return Promise.resolve();
    }

    return Promise.reject("Nenhum aluno encontrado");
  },

  async set_token_storage({ commit }, token) {
    axios.defaults.headers["Authorization"] = `Bearer ${token}`;
    commit("SET_TOKEN", token);
    await Storage.set({
      key: "token",
      value: token,
    });
  },

  async verify_aluno_storage() {
    const { value } = await Storage.get({ key: KEY_STORAGE });
    if (!value) {
      await Storage.set({
        key: KEY_STORAGE,
        value: JSON.stringify([]),
      });
    }
  },
};
