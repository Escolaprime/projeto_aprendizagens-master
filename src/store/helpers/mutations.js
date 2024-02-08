export default {
  SET_NETWORK(state, payload) {
    state.networkStatus = payload;
  },
  SET_ESCOLAS(state, payload) {
    state.arrEscolas = payload;
  },

  SET_ETAPAS(state, payload) {
    state.arrEtapas = payload;
  },

  SET_NUMERO(state, payload) {
    state.numero_suporte = payload;
  },
};
