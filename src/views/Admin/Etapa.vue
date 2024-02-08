<template>
    <ion-page>

        <div class="w-1/2 flex flex-col h-screen bg-white">
            <div class="">
                <div class="border-b p-5 flex flex-row items-center justify-between">
                    <span class="font-bold text-2xl">Etapas</span>
                    <button v-if="!showForm" @click="showForm = true">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </button>
                    <button v-else @click="showForm = false">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                        </svg>
                    </button>
                </div>

                <div class="relative text-gray-600 py-5 px-5" v-if="!showForm">
                    <input
                        type="text"
                        placeholder="Buscar etapas"
                        v-model="search"
                        @keyup.enter="obter_etapas"
                        class="bg-gray-100 w-full h-10 px-5 pr-10 rounded-full"
                    />
                    <button @click="obter_etapas" class="absolute right-0 top-5 mt-3 mr-10">
                        <svg class="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 56.966 56.966" style="enable-background:new 0 0 56.966 56.966;" xml:space="preserve" width="512px" height="512px">
                            <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z"/>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="px-5 py-5 grid grid-cols-4 gap-5" v-if="showForm">
                <div class="col-span-2">
                    <label for="titulo" class="block text-sm font-medium text-gray-700">Titulo</label>
                    <input
                        type="text"
                        name="titulo"
                        id="titulo"
                        autocomplete="given-name"
                        v-model="etapa.titulo"
                        class="mt-1 bg-white py-2 px-3 border focus:border-blue-500 block w-full shadow-sm sm:text-sm font-medium border-gray-300 rounded-md"
                    />
                </div>
                <div class="col-span-2">
                    <label for="descricao" class="block text-sm font-medium text-gray-700">Descrição</label>
                    <input
                        type="text"
                        name="descricao"
                        id="descricao"
                        autocomplete="given-name"
                        v-model="etapa.descricao"
                        class="mt-1 bg-white py-2 px-3 border focus:border-blue-500 block w-full shadow-sm sm:text-sm font-medium border-gray-300 rounded-md"
                    />
                </div>
                <div class="col-span-full">
                    <label for="escola" class="block text-sm font-medium text-gray-700">Selecione a escola</label>
                    <select
                        id="escola"
                        name="escola"
                        autocomplete="escola"
                        v-model="etapa.escola_id"
                        class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm sm:text-sm focus:outline-none"
                    >
                        <option disabled selected value="0">Selecione</option>
                        <option
                            v-for="(item, index) in get_escolas"
                            :key="index"
                            :value="item.id"
                        > 
                            {{ item.nome_escola }}
                        </option>

                    </select>
                </div>

                <button 
                    class="bg-blue-600 p-2 rounded text-white col-start-4"
                    @click="inserir_etapa"
                >
                    Cadastrar etapa
                </button>
            </div>
            <div class="h-5/6 overflow-y-auto" v-show="!showForm && !etapa_selecionada">
                
                <div class="px-5 py-5 space-y-5">

                    <div
                        v-for="(item,index) in arrEtapas"
                        :key="index"
                        class="w-full bg-gray-100 rounded border grid grid-cols-4"
                        @click="selecionar_etapa(item)"
                    >
                        <div class="p-5 col-span-full flex flex-col">
                            <span class="text-xl font-semibold text-gray-900">{{ item.titulo }}</span>
                            <label class="text-sm font-medium text-gray-600">Nome da etapa</label>
                        </div>
                    </div>
                </div>

            </div>

            <div class="px-5 py-5 flex flex-col" v-if="etapa_selecionada && !showForm">
                <div class="mb-5">
                    <label 
                        for="titulo" 
                        class="block text-sm font-medium text-gray-700"
                    >
                        Nome da etapa
                    </label>
                    <input
                        type="text"
                        name="titulo"
                        id="titulo"
                        ref="input_edit"
                        v-model="etapa_selecionada.titulo"
                        class="mt-1 bg-white py-2 px-3 border focus:border-blue-500 block w-full shadow-sm sm:text-sm font-medium border-gray-300 rounded-md"
                    />
                </div>
                <div class="flex flex-row gap-4">
                    <button 
                        class="bg-gray-600 p-2 rounded text-white"
                        @click="voltar_pesquisa"
                    >
                        Voltar
                    </button>
                    <button 
                        class="bg-red-600 p-2 rounded text-white hidden"
                        @click="excluir_escola"
                    >
                        Excluir etapa
                    </button>
                    <button 
                        class="bg-green-600 p-2 rounded text-white"
                        @click="editar_etapa"
                    >
                        Editar etapa
                    </button>
                </div>
            </div>

        </div>
    </ion-page>
</template>

<script>
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonItem,
    IonLabel,
    IonInput,IonButton,
    IonSelect,
    IonSelectOption,
    toastController
} from '@ionic/vue';
import axios from '@/configs/axios.config';

import { mapActions, mapGetters } from 'vuex';

export default  {
    name: 'Etapa',
    //components: { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonInput, IonButton, IonSelect, IonSelectOption },
    components: { IonPage },
    data() {
        return {
            etapa: {
                titulo: null,
                descricao: null,
                escola_id: null
            },
            arrEtapas: [],
            etapa_selecionada: null,
            search: '',
            showForm: false
        }
    },
    mounted() {
        this.obter_escolas();
        this.obter_etapas();
    },

    computed: {
        ...mapGetters('helper', ['get_escolas'])
    },

    watch: {
        search(val) {
            if(!val.length) {
                this.arrEtapas = [];
            }
        }
    },

    methods: {
        
        ...mapActions('helper', ['obter_escolas']),

        obter_etapas() {
            axios
                .get('/admin/obterEtapa', {
                    params: {
                        search: this.search
                    }
                }).then(({ data }) => {
                    this.arrEtapas = data;
                }).catch((err) => {

                    console.log(err);
                })
        },

        inserir_etapa() {
            axios
                .post('/etapas/inserirEtapa', {
                    ...this.etapa

                }).then(({ data }) => {
                    const { mensagem } = data;
                    this.toast(mensagem);
                    this.resetForm();
                }).catch(err => {
                    console.log(err);
                });
        },
        
        editar_etapa() {

            axios
                .put('/admin/editarEtapa', {
                    ...this.etapa_selecionada
                }).then(({ data }) => {
                    const { mensagem } = data;
                    this.toast(mensagem);
                    this.voltar_pesquisa();
                    this.obter_etapas();
                }).catch(err => {
                    console.log(err);
                })
        },

        selecionar_etapa(item) {
            this.etapa_selecionada = Object.assign({}, item);
            console.log(item);
        },

        async toast(message) {
            const toast = await toastController.create({
                header: "Notificação",
                message,
                position: "bottom",
                duration: 2000 
            });
            return await toast.present();

        },

        voltar_pesquisa() {
            this.etapa_selecionada = null;  
        },

        resetForm() {
            this.etapa = {
                titulo: null,
                descricao: null,
                escola_id: null
            };
            this.showForm = false;
        }
    },
}
</script>