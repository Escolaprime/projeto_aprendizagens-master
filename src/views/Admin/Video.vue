<template>
    <ion-page>
        <div class="w-3/4 flex flex-col h-screen bg-white">
            <div class="">
                <div class="border-b p-5 flex flex-row items-center justify-between">
                    <span class="font-bold text-2xl">Videos</span>
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
                        placeholder="Buscar video"
                        v-model="search"
                        @keyup.enter="obter_videos"
                        class="bg-gray-100 w-full h-10 px-5 pr-10 rounded-full"
                    />
                    <button @click="obter_videos" class="absolute right-0 top-5 mt-3 mr-10">
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
                        v-model="video.titulo"
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
                        v-model="video.descricao"
                        class="mt-1 bg-white py-2 px-3 border focus:border-blue-500 block w-full shadow-sm sm:text-sm font-medium border-gray-300 rounded-md"
                    />
                </div>
                <div class="col-span-2">
                    <label for="escola" class="block text-sm font-medium text-gray-700">Selecione a escola</label>
                    <select
                        id="escola"
                        name="escola"
                        autocomplete="escola"
                        v-model="video.escola_id"
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
                <div class="col-span-2">
                    <label for="etapas" class="block text-sm font-medium text-gray-700">Selecione a etapa</label>
                    <select
                        id="etapas"
                        name="etapas"
                        autocomplete="etapas"
                        v-model="video.etapa_id"
                        class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm sm:text-sm focus:outline-none"
                    >
                        <option disabled selected value="0">Selecione</option>
                        <option
                            v-for="(item, index) in get_etapas"
                            :key="index"
                            :value="item.id"
                        > 
                            {{ item.titulo }}
                        </option>

                    </select>
                </div>
                <div class="col-span-full">
                    <label for="professor" class="block text-sm font-medium text-gray-700">Selecione o professor</label>
                    <select
                        id="professor"
                        name="professor"
                        autocomplete="professor"
                        v-model="video.professor_id"
                        class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm sm:text-sm focus:outline-none"
                    >
                        <option disabled selected value="0">Selecione</option>
                        <option
                            v-for="(item, index) in arrProfessores"
                            :key="index"
                            :value="item.id"
                        > 
                            {{ item.primeiro_nome }}
                        </option>

                    </select>
                </div>
                <div class="col-span-full">
                    <label class="block text-sm font-medium text-gray-700">
                        Video
                    </label>
                    <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border border-gray-300 border-dashed rounded-md">
                        <div class="space-y-1 text-center" v-if="!video.file">

                            <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            <div class="flex text-sm text-gray-600">
                                <label for="file-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                                    <span class="">Upload video</span>
                                    <input
                                        id="file-upload"
                                        name="file-upload"
                                        type="file"
                                        class="sr-only"
                                        accept=".mp4"
                                        @change="set_file"
                                    />
                                </label>
                            </div>
                            <p class="text-xs text-gray-500">
                                *.MP4
                            </p>
                        </div>

                        <div class="text-center" v-else>

                            <div class="bg-gray-200  rounded-full overflow-hidden">
                                <div 
                                    class="bg-blue-500 0 w-0 h-1.5"
                                    :style="{'width': progressBar + '%' }"
                                    role="progressbar" 
                                    aria-valuenow="1456" 
                                    aria-valuemin="0" 
                                    aria-valuemax="4550"
                                ></div>
                            </div>
                            <span class="font-medium text-xs">{{ `${progressBar}%` }}</span>
                            <div class="flex flex-row items-center gap-3 text-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                <span class="font-medium">{{ video.file[0].name }}</span>
                                <button @click="video.file = null" class="text-gray-400 hover:text-gray-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <button 
                    class="bg-blue-600 p-2 rounded text-white col-start-4"
                    @click="upload_video"
                >
                    Postar video
                </button>
            </div>
            <!-- Lista -->
            <div class="h-5/6 overflow-y-auto" v-show="!video_selecionado && !showForm">
                
                <div class="px-5 py-5 space-y-5">
                    <div
                        v-for="(item,index) in arrVideos"
                        :key="index"
                       
                        class="w-full grid grid-cols-2 gap-2"
                    > 
                        <div  @click="selecionar_video(item,index)" class="w-full bg-gray-100 rounded border grid grid-cols-6">

                            <div class="p-5 flex flex-col col-span-3">
                                <span class="text-xl font-semibold text-gray-900">{{ item.nome_escola }}</span>
                                <label class="text-sm font-medium text-gray-600 uppercase">Nome da escola</label>
                            </div>
                            <div class="p-5 flex flex-col col-span-3">
                                <span class="text-xl font-semibold text-gray-900">{{ item.etapa_titulo }}</span>
                                <label class="text-sm font-medium text-gray-600 uppercase">etapa</label>
                            </div>
                            <div class="p-5 flex flex-col col-span-3">
                                <span class="text-xl font-semibold text-gray-900">{{ item.nome_professor }}</span>
                                <label class="text-sm font-medium text-gray-600 uppercase">Nome do professor</label>
                            </div>
                            <div class="p-5 flex flex-col col-span-2">
                                <span class="text-xl font-semibold text-gray-900">{{ formatar_data(item.data_postagem) }}</span>
                                <label class="text-sm font-medium text-gray-600 uppercase">Data de postagem</label>
                            </div>
                            <div class="p-5 flex flex-col col-span-1">
                                <span class="text-xl font-semibold text-gray-900">{{ item.ativo ? 'Sim' : 'Não' }}</span>
                                <label class="text-sm font-medium text-gray-600 uppercase">Ativo</label>
                            </div>
                            <div class="p-5 flex flex-col col-span-3">
                                <span class="text-xl font-semibold text-gray-900">{{ item.titulo }}</span>
                                <label class="text-sm font-medium text-gray-600 uppercase">Titulo</label>
                            </div>
                            <div class="p-5 flex flex-col col-span-3">
                                <span class="text-xl font-semibold text-gray-900">{{ item.descricao }}</span>
                                <label class="text-sm font-medium text-gray-600 uppercase">Descricao</label>
                            </div>

                        </div>
                        <div class="flex flex-col items-center bg-gray-100 rounded border">
                            <div class="p-5">
                                <video 
                                    :src="`${get_baseURL}/videos/streamingVideo/?hash=${item.hash_video_id}`"
                                    class=" rounded"
                                    :ref="`video_${index}`"
                                    preload
                                    controls
                                ></video>
                            </div>

                            <div class="p-5 flex flex-col gap-2 w-full">
                                <input
                                    type="file"
                                    id="input_file"
                                    name="input_file"
                                    class="hidden"
                                    @change="video_update($event, item, index)"

                                    accept=".mp4"
                                />

                                <div class="flex flex-row items-center gap-1" v-if="video_file_update && video_selecionado_index === index">
                                    <div class="bg-gray-200 w-full rounded-full overflow-hidden">
                                        <div 
                                            class="bg-blue-500 0 w-0 h-1.5"
                                            :style="{'width': progressBar + '%' }"
                                            role="progressbar" 
                                            aria-valuenow="1456" 
                                            aria-valuemin="0" 
                                            aria-valuemax="4550"
                                        ></div>
                                    </div>
                                    <span class="font-medium text-xs">{{ `${progressBar}%` }}</span>
                                </div>
                                <div class="mx-auto" v-if="!video_file_update">
                                    <label
                                        for="input_file"
                                        class="bg-blue-500 p-2 rounded text-white cursor-pointer"
                                        
                                    >
                                        Substituir video
                                    </label>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <!--  -->

            <!-- Video selecionado -->
            <div class="px-5 py-5 flex flex-col" v-if="video_selecionado && !showForm">
                
                <div class="flex flex-col gap-4 mb-5">
                    <div class="flex flex-row gap-4">
                        <div class="w-1/2">
                            <label for="escola" class="block text-sm font-medium text-gray-700">Selecione a escola</label>
                            <select
                                id="escola"
                                name="escola"
                                autocomplete="escola"
                                v-model="video_selecionado.escola_id"
                                disabled
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
                        <div class="w-1/2">
                            <label for="etapas" class="block text-sm font-medium text-gray-700">Selecione a etapa</label>
                            <select
                                id="etapas"
                                name="etapas"
                                autocomplete="etapas"
                                v-model="video_selecionado.etapa_id"
                                class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm sm:text-sm focus:outline-none"
                            >
                                <option disabled selected value="0">Selecione</option>
                                <option
                                    v-for="(item, index) in get_etapas"
                                    :key="index"
                                    :value="item.id"
                                > 
                                    {{ item.titulo }}
                                </option>

                            </select>
                        </div>
                    </div>
                    <div class="flex flex-row gap-4">
                        <div class="w-full">
                            <label for="professor" class="block text-sm font-medium text-gray-700">Selecione o professor</label>
                            <select
                                id="professor"
                                name="professor"
                                autocomplete="professor"
                                v-model="video_selecionado.professor_id"
                                class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm sm:text-sm focus:outline-none"
                            >
                                <option disabled selected value="0">Selecione</option>
                                <option
                                    v-for="(item, index) in arrProfessores"
                                    :key="index"
                                    :value="item.id"
                                > 
                                    {{ item.primeiro_nome }}
                                </option>

                            </select>
                        </div>
                    </div>
                    <div class="flex flex-row gap-4">
                        <div class="w-1/2">
                            <label 
                                for="titulo" 
                                class="block text-sm font-medium text-gray-700"
                            >
                                Titulo
                            </label>
                            <input
                                type="text"
                                name="titulo"
                                id="titulo"
                                ref="input_edit"
                                v-model="video_selecionado.titulo"
                                class="mt-1 bg-white py-2 px-3 border focus:border-blue-500 block w-full shadow-sm sm:text-sm font-medium border-gray-300 rounded-md"
                            />
                        </div>
                        <div class="w-2/5">
                            <label 
                                for="descricao" 
                                class="block text-sm font-medium text-gray-700"
                            >
                                Descrição
                            </label>
                            <input
                                type="text"
                                name="descricao"
                                id="descricao"
                                ref="input_edit"
                                v-model="video_selecionado.descricao"
                                class="mt-1 bg-white py-2 px-3 border focus:border-blue-500 block w-full shadow-sm sm:text-sm font-medium border-gray-300 rounded-md"
                            />
                        </div>
                        <div class="w-1/5">
                            <label 
                                for="ativo" 
                                class="block text-sm font-medium text-gray-700"
                            >
                                Ativo
                            </label>
                            <ion-checkbox v-model="video_selecionado.ativo" class="mt-4"></ion-checkbox>
                        </div>
                    </div>
                </div>

                <div class="flex flex-row gap-4">
                    <button 
                        class="bg-gray-600 p-2 rounded text-white col-start-4"
                        @click="voltar_pesquisa"
                    >
                        Voltar
                    </button>
                    <button 
                        class="bg-red-600 p-2 rounded text-white col-start-4"
                        
                    >
                        Excluir video
                    </button>
                    <button 
                        class="bg-green-600 p-2 rounded text-white col-start-4"
                        @click="editar_video"
                    >
                        Salvar edição
                    </button>
                </div>
            </div>
            <!--  -->
        </div>

    </ion-page>
</template>

<script>
import { IonPage, IonCheckbox, alertController } from '@ionic/vue';

import axios from '@/configs/axios.config';
import { mapActions, mapGetters } from 'vuex';
import { defineComponent } from 'vue';
export default defineComponent ({
    name: 'Upload',
    components: { IonPage, IonCheckbox },
    data() {
        return {
            video: {
                titulo: null,
                descricao: null,
                escola_id: null,
                etapa_id: null,
                professor_id: null,
                file: null
            },
            search: '',
            showForm: false,
            arrProfessores: [],
            arrVideos: [],
            video_selecionado: null,
            video_selecionado_index: -1,
            video_file_update: null,
            progressBar: 0
        }
    },

    created() {
        this.obter_escolas();
        this.obter_etapas();
        this.obter_professores();
    },

    watch: { 

        search(val) {
            if(!val.length) { this.arrVideos = [] }
        }
    },
    
    computed: {
        ...mapGetters('helper', ["get_escolas", "get_etapas", "get_baseURL"]),
    },

    methods: {

        ...mapActions('helper', ["obter_escolas", "obter_etapas", "toast"]),

        obter_professores() {

            axios
                .get('/professores/obterProfessor')
                .then(({ data }) => {
                    
                    this.arrProfessores = data;
                }).catch(err => {
                    console.log(err);
                })
        },

        obter_videos() {

            axios.get('/admin/obterVideos', {
               params: {
                    search: this.search
               }
            }).then(({ data }) => {

                this.arrVideos = data;
            }).catch(err => {

                console.log(err);
            });
        },

        editar_video() {

            axios
                .put('/admin/editarInformacoesVideo', {
                    ...this.video_selecionado
                }).then(({ data }) => {
                    const { mensagem } = data;
                    this.toast(mensagem);
                    this.obter_videos();
                    this.resetForm();
                    console.log(data);

                }).catch(err => {
                    console.log(err);
                })
        },

        async selecionar_video(item,index) {
            this.video_selecionado = Object.assign({}, item);
            
            const video_el = this.$refs[`video_${index}`];
            video_el.pause();
        },

        upload_video() {
            const { 
                file: [ file ],
                ...detalhes
            } = this.video;
            const formData = new FormData();
            formData.append('video', file);
            formData.append('detalhes', JSON.stringify(detalhes));

            axios.post('/videos/uploadVideo', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent) => {
                    const totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length');
                    if (totalLength !== null) {
                        this.progressBar = Math.round( (progressEvent.loaded * 100) / totalLength );
                    }
                }
            }).then(({ data }) => {
                const { mensagem } = data;
                this.toast(mensagem);
                this.resetForm();
            }).catch(err => {
                console.log(err);
            });
        },

        async video_update({ target }, { hash_video_id }, index) {
            this.video_file_update = target.files[0];
            this.video_selecionado_index = index;
            target.value = null;
            
            const alert = await alertController.create({
                header: "Aviso",
                subHeader: "Alteração no video",
                message: "Você irá substituir o video atual. Deseja prosseguir ?",
                buttons: [
                    {
                        text: 'Não',
                        handler: () => {
                            alert.dismiss();
                            this.video_file_update = null;
                        }
                    },
                    {
                        text: 'Sim',
                        handler: () => {
                            const formData = new FormData();

                            formData.append('video', this.video_file_update);
                            formData.append("TESTE", "TESTE");
                            
                            axios.post('/admin/editarVideo', formData, {

                                headers: {
                                    'Content-Type': 'multipart/form-data',
                                    hash_video_id,
                                },
                                onUploadProgress: (progressEvent) => {
                                    const totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length');
                                    if (totalLength !== null) {
                                        this.progressBar = Math.round( (progressEvent.loaded * 100) / totalLength );
                                    }
                                }
                            }).then(({ data }) => {
                                const { mensagem } = data;
                                this.toast(mensagem);
                                this.resetForm();   
                                this.video_file_update = null;
                            }).catch(err => {
                                console.log(err);
                            })
                        }
                    }
                ]
            });

            return alert.present();

        },

        set_file(ev) {
            this.video.file = ev.target.files;
        },


        resetForm() {
            this.video = {
                titulo: null,
                descricao: null,
                escola_id: null,
                etapa_id: null,
                professor_id: null,
                file: null
            };
            this.showForm = false;
            this.progressBar = 0;
            this.video_selecionado = null;
        },

        formatar_data(date) {
            const formatedDate = new Date(date).toLocaleDateString();
            return formatedDate;
        },
        voltar_pesquisa() {
            this.video_selecionado = null;
        }
    }

})
</script>