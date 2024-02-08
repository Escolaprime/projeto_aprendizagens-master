<template>
  <ion-page>
    <div class="bg-white h-screen flex flex-row">
        
        <div class="w-32 flex flex-col gap-5 h-full border-r">

            <div class="p-3">
                <img src="../../assets/Logo_Projeto_Garanhuns.jpg" class="h-24 rounded mx-auto">
            </div>

            <ul class="px-3 flex flex-col gap-5 items-center text-white">
                <router-link
                    to="escola" 
                    class="bg-blue-600 hover:bg-blue-700 w-full rounded-md p-2 text-center cursor-pointer"
                >
                    <span class="">Escolas</span>
                </router-link>
                <router-link
                    to="etapa"
                    class="bg-blue-600 hover:bg-blue-700 w-full rounded-md p-2 text-center cursor-pointer"
                >
                    <span class="">Etapas</span>
                </router-link>
                <router-link 
                    to="aluno"
                    class="bg-blue-600 hover:bg-blue-700 w-full rounded-md p-2 text-center cursor-pointer" 
                >
                    <span class="">Alunos</span>
                </router-link>
                <router-link
                    to="professor"
                    class="bg-blue-600 w-full rounded-md p-2 text-center"
                >
                    <span class="">Professores</span>
                </router-link>
                <router-link
                    to="video"
                    class="bg-blue-600 w-full rounded-md p-2 text-center"
                >
                    <span class="">Videos</span>
                </router-link>
            </ul>
            <div class="mt-auto mb-10 px-3">
                <button 
                    @click="$router.push({ name: 'Login' })" 
                    class="bg-blue-600 w-full rounded-md p-2 text-center text-white focus:outline-none"
                >
                    <span class="">Sair</span>
                </button>
            </div>
        </div>

        <div class="flex-1 flex flex-row h-full bg-gray-100 text-black">
            <ion-router-outlet class="ml-32"/>
        </div>

    </div>
    
  </ion-page>
</template>

<script>
import { IonRouterOutlet, IonPage } from '@ionic/vue';
export default  {
    name: 'IndexAdmin',
    components: {  IonRouterOutlet, IonPage },
    methods: {
      
      to(route) {
        this.$router.push({ path: route });
      }
    }

}
</script>

<style>

</style>