import { createStore } from 'vuex';

import helper from './helpers/helper';
import autenticacao from './autenticacao/autenticacao';
import video from './videos/video';

export default createStore({
  modules: {
    helper,
    autenticacao,
    video
  }
})
