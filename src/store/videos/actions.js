import axios from "../../configs/axios.config";
import db from "@/plugins/db";
import { db as dexie } from "@/plugins/dexie";
export default {
  obter_semanas({ commit }) {
    axios
      .get("/alunos/obterSemanas")
      .then(async ({ data }) => {
        for (const semana of data) {
          const exist = await dexie.table("semanas").get({ id: semana.id });

          if (!exist) {
            await dexie.table("semanas").add(semana);
          }
        }
        commit("SET_SEMANAS", data);
      })
      .catch((err) => {
        console.log(err);
      });
  },

  obter_dias({ commit }) {
    axios
      .get("/alunos/obterDias")
      .then(async ({ data }) => {
        for (const dia of data) {
          const exist = await dexie.table("dias").get({ id: dia.id });

          if (!exist) {
            await dexie.table("dias").add(dia);
          }
        }
        commit("SET_DIAS", data);
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
