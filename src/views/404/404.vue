<template>
    <ion-page>
        <div class="h-screen bg-white flex flex-col py-20 items-center">

            <svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" fill="#000000" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><circle cx="128" cy="128" r="96" fill="none" stroke="#000000" stroke-miterlimit="10" stroke-width="16"></circle><line x1="128" y1="80" x2="128" y2="136" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></line><circle cx="128" cy="172" r="12"></circle></svg>
            <h1 
                class="text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-bold text-gray-900 uppercase"
            >
                OPS !
            </h1>
            <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 uppercase">A página não foi encontrada</h2>

        </div>
    </ion-page>
</template>

<script>
import {  defineComponent } from 'vue';
import { IonPage } from '@ionic/vue';

export default defineComponent({

    name: 'NotFound',

    components: { IonPage }
});

</script>


<style>

</style>