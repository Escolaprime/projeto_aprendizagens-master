import axios from "../../configs/axios.config";
import { toastController } from "@ionic/vue";

export default {
  obter_escolas({ commit, dispatch }) {
    axios
      .get("/escolas/obterEscola")
      .then(({ data }) => {
        commit("SET_ESCOLAS", data);
      })
      .catch((err) => {
        console.log(err);
      });
  },

  obter_etapas({ commit }) {
    axios
      .get("/admin/obterEtapa")
      .then(({ data }) => {
        commit("SET_ETAPAS", data);
      })
      .catch((err) => {
        console.log(err);
      });
  },

  async pre_login({ commit }) {
    axios
      .get("/alunos/obter_params_app", {
        params: { CRC: 9 },
      })
      .then(({ data }) => {
        const { codigo, dados } = data;
        if (codigo == 0) {
          commit("SET_NUMERO", dados?.NUN_SUPORTE_WHATSAPP);
        }
        if (codigo == 1) {
          commit("SET_NUMERO", null);
        }
      })
      .catch((error) => {
        console.error(error);
        console.error(error.response);
        commit("SET_NUMERO", null);
      });
  },

  async toast({ c, d }, message) {
    const toast = await toastController.create({
      header: "Notificação",
      message,
      position: "bottom",
      duration: 2000,
    });
    return await toast.present();
  },
};
