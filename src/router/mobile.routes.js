import Streaming from '@/views/Alunos/Streaming.vue';
import Dias from '@/views/Alunos/Dias/Dias.vue';

import StreamingOff from '@/views/Alunos/Offline/Streaming_offline.vue';
import DiasOffline from '@/views/Alunos/Offline/DiasOff.vue';

export default [
  {
    path: '',
    redirect: '/tabs/etapas'
  },
  {
    path: 'etapas',
    name: 'etapas',
    component: () => import('@/views/Alunos/Tabs/Index.vue')
  },
  {
    path: 'offline',
    name: 'offline',
    component: () => import('@/views/Alunos/Tabs/AulasOffline.vue')
  },
  {
    path: 'perfil',
    name: 'perfil',
    component: () => import('@/views/Alunos/Tabs/Perfil.vue')
  },
  {
    path: 'ajuda',
    name: 'ajuda',
    component: () => import('@/views/Alunos/Ajuda/Ajuda.vue')
  },
  {
    path: '/Streaming',
    name: 'Streaming',
    component: Streaming,
    props: true
  },
  {
    path: '/Dias',
    name: 'Dias',
    component: Dias,
  },
  {
    path: '/DiasOffline',
    name: 'DiasOffline',
    component: DiasOffline,
    props: true
  },
  {
    path: '/StreamingOffline',
    name: 'StreamingOffline',
    component: StreamingOff,
    props: true
  },
  {
    path: 'logout',
    redirect: { name: 'index' }
  }
]