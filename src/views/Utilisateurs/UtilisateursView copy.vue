<script setup>
import {
  mdiMonitorCellphone,
  mdiAccountSwitch,
  mdiTableOff,
  mdiReload,
  mdiCogOutline,
  mdiContentCopy,
  mdiLock,
  mdiAccountAlertOutline,
  mdiGamepadCircle,
} from "@mdi/js";
import SectionMain from "@/components/SectionMain.vue";
import NotificationBar from "@/components/NotificationBar.vue";
import CardBox from "@/components/CardBox.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";

import CardBoxComponentEmpty from "@/components/CardBoxComponentEmpty.vue";

import { mdiEye, mdiTrashCan } from "@mdi/js";
import CardBoxModal from "@/components/CardBoxModal.vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import TableCheckboxCell from "@/components/TableCheckboxCell.vue";
import BaseLevel from "@/components/BaseLevel.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseButton from "@/components/BaseButton.vue";
// import UserAvatar from "@/components/UserAvatar.vue";

import { useMainStore } from "@/stores/main";
import { onMounted, computed, ref } from "vue";
import { RequestApi } from "@/boot/RequestApi";
let request = new RequestApi();

const isModalActive = ref(false);
const isModalPassword = ref(false);
const isModalStateUser = ref(false);
const perPage = ref(5);
const currentPage = ref(0);
let listUsers = ref([]);
let listUsersSave = ref([]);
let loading = ref(true);
let loadingUpdate = ref(false);
let reloading = ref(true);
let produits = ref([]);
const mainStore = useMainStore();

const itemsPaginated = computed(() =>
  listUsers.value.slice(
    perPage.value * currentPage.value,
    perPage.value * (currentPage.value + 1)
  )
);

const numPages = computed(() =>
  Math.ceil(listUsers.value.length / perPage.value)
);

const currentPageHuman = computed(() => currentPage.value + 1);

const pagesList = computed(() => {
  const pagesList = [];

  for (let i = 0; i < numPages.value; i++) {
    pagesList.push(i);
  }
  console.log(pagesList);
  return pagesList;
});

onMounted(async () => {
  await getUserList();
});

async function getUserList() {
  const response = await request.getUsersListAction();
  if (response.status) {
    reloading.value = false;
    loading.value = false;
    listUsers.value = response.data;
    listUsersSave.value = response.data;
  } else {
    reloading.value = false;
    loading.value = false;
  }
}

function getAllList() {
  listUsers.value = listUsersSave.value;
}
function getClientsList() {
  listUsers.value = listUsersSave.value.filter(
    (user) => user.type_user_id == "2"
  );
}

function getLivreursList() {
  listUsers.value = listUsersSave.value.filter(
    (user) => user.type_user_id == "3"
  );
}

function getAdminsList() {
  listUsers.value = listUsersSave.value.filter(
    (user) => user.type_user_id == "1"
  );
}

let typeUser = ref(0);

async function setType(typeselect) {
  console.log("---user", typeselect);

  typeUser.value = typeselect;

  listUsers.value = [];
  getData();
}

function getData() {
  currentPage.value = 0;

  if (typeUser.value == 0) {
    getClientsList();
  } else if (typeUser.value == 1) {
    getLivreursList();
  } else if (typeUser.value == 2) {
    getAdminsList();
  } else {
    getAllList();
  }
}

let _seletUser = ref();
function setAction(user) {
  console.log(user);
  console.log("---user");
  _seletUser.value = user;
  isModalActive.value = true;
  console.log(_seletUser.value);
}

const stateClient = async () => {
  loadingUpdate.value = true;

  const response = await request.makeClientAction(_seletUser.value.keySecret);
  if (response.status) {
    await getUserList();
    getData();
    isModalActive.value = false;
    loadingUpdate.value = false;
  } else {
    loadingUpdate.value = false;
  }
};
const makeLivreur = async () => {
  loadingUpdate.value = true;

  const response = await request.makeLivreurAction(_seletUser.value.keySecret);
  if (response.status) {
    await getUserList();
    getData();
    loadingUpdate.value = false;
    isModalActive.value = false;
  } else {
    loadingUpdate.value = false;
  }
};

const makeAdmin = async () => {
  loadingUpdate.value = true;

  const response = await request.makeAdminAction(_seletUser.value.keySecret);
  if (response.status) {
    await getUserList();
    getData();
    loadingUpdate.value = false;
    isModalActive.value = false;
  } else {
    loadingUpdate.value = false;
  }
};
function setAction2(user) {
  _seletUser.value = user;
  isModalStateUser.value = true;
  console.log(_seletUser.value);
}

const stateUserAction = async () => {
  loadingUpdate.value = true;

  const response = await request.stateUserAction(_seletUser.value.keySecret);
  if (response.status) {
    await getUserList();
    getData();
    loadingUpdate.value = false;
    isModalStateUser.value = false;
  } else {
    loadingUpdate.value = false;
  }
};

function setAction3(user) {
  _seletUser.value = user;
  isModalPassword.value = true;
  console.log(_seletUser.value);
  newPass.value = "";
}

let newPass = ref("fdfdfd");

const resetPasswordUserAction = async () => {
  loadingUpdate.value = true;

  const response = await request.resetPasswordUserAction(
    _seletUser.value.keySecret
  );
  console.log(response);
  if (response.status) {
    newPass.value = response.password;
    await getUserList();
    getData();
    loadingUpdate.value = false;
  } else {
    loadingUpdate.value = false;
  }
};
const copyText = () => {
  navigator.clipboard
    .writeText(newPass.value)
    .then(() => {
      console.log("Text copied!");
    })
    .catch((error) => {
      console.error("Copy failed:", error);
    });
};
</script>

<template>
  <CardBoxModal
    v-model="isModalActive"
    v-if="_seletUser != null"
    title="Changer de role"
  >
    <div
      class="mb-2 max-h-96 overflow-y-auto"
      v-if="_seletUser.type_user_id == '1'"
    >
      <p>Demettre cet administrateur</p>
      <div
        class="mb-2 mt-5 max-h-96 overflow-y-auto"
        v-if="_seletUser.type_user_id == '1'"
      >
        <BaseButton
          target="_blank"
          :loading="loadingUpdate"
          :icon="mdiCogOutline"
          label="Effectuer"
          color="info"
          small
          @click="stateClient"
        />
      </div>
    </div>
    <div
      class="mb-2 mt-5 max-h-96 overflow-y-auto"
      v-if="_seletUser.type_user_id == '2'"
    >
      <p>Faire de cet utilisateur un livreur ou un administrateur</p>
      <div
        class="mb-2 mt-5 max-h-96 overflow-y-auto"
        v-if="_seletUser.type_user_id == '2'"
      >
        <BaseButton
          :loading="loadingUpdate"
          target="_blank"
          :icon="mdiCogOutline"
          label="Livreur"
          color="bg-orange-800"
          small
          @click="makeLivreur"
        />
        <BaseButton
          target="_blank"
          :icon="mdiGamepadCircle"
          label="Administrateur"
          :loading="loadingUpdate"
          color="info"
          small
          @click="makeAdmin"
        />
      </div>
    </div>

    <div
      class="mb-2 max-h-96 overflow-y-auto"
      v-if="_seletUser.type_user_id == '3'"
    >
      <p>Demettre ce livreur</p>
      <div
        class="mb-2 mt-5 max-h-96 overflow-y-auto"
        v-if="_seletUser.type_user_id == '3'"
      >
        <BaseButton
          target="_blank"
          :loading="loadingUpdate"
          :icon="mdiCogOutline"
          label="Effectuer"
          color="bg-blue-800"
          small
          @click="stateClient"
        />
      </div>
    </div>
  </CardBoxModal>

  <CardBoxModal
    v-model="isModalStateUser"
    v-if="_seletUser != null"
    title="Status du compte"
    button="danger"
  >
    <p>
      Vous allez
      {{ _seletUser.status_bool == true ? "desactiver" : "activer" }} cette
      utilisateur <b>{{ _seletUser.nom }}</b>
    </p>

    <BaseButton
      label="Confirmer"
      :loading="loadingUpdate"
      color="info"
      @click="stateUserAction"
    />
  </CardBoxModal>
  <CardBoxModal
    v-model="isModalPassword"
    v-if="_seletUser != null"
    title="Mot de passe"
    button="danger"
  >
    <p>
      Vous allez reinitialiser le mot de passe du compte de
      <b>{{ _seletUser.nom }}</b> au numero <b>{{ _seletUser.phone }}</b>
    </p>

    <BaseButton
      label="Reinitialiser"
      :loading="loadingUpdate"
      color="info"
      @click="resetPasswordUserAction"
    />
    <p v-if="newPass != ''">
      Voici le nouveau mot de passe du compte de
      <b>{{ _seletUser.nom }}</b> : {{ newPass }}
      <BaseButton
        @click="copyText"
        target="_blank"
        :icon="mdiContentCopy"
        label="Copy"
        color="contrast"
        rounded-full
        small
      />
    </p>
  </CardBoxModal>

  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton
        :icon="mdiAccountSwitch"
        title="Utilisateurs"
        main
      >
        <BaseButton
          @click="setType(3)"
          target="_blank"
          label="All"
          :color="typeUser == 3 ? 'bg-blue-900' : 'contrast'"
          rounded-full
          small
        />
        <BaseButton
          @click="setType(0)"
          target="_blank"
          label="Client"
          :color="typeUser == 0 ? 'bg-blue-900' : 'contrast'"
          rounded-full
          small
        />
        <BaseButton
          @click="setType(1)"
          target="_blank"
          label="Livreur"
          :color="typeUser == 1 ? 'bg-blue-900' : 'contrast'"
          rounded-full
          small
        />
        <BaseButton
          @click="setType(2)"
          target="_blank"
          label="Administrateur"
          :color="typeUser == 2 ? 'bg-blue-900' : 'contrast'"
          rounded-full
          small
        />

        <BaseButton
          @click="getUserList"
          :loading="reloading"
          target="_blank"
          :icon="mdiReload"
          label="Actualise"
          color="contrast"
          rounded-full
          small
        />
      </SectionTitleLineWithButton>

      <Loader v-if="loading" />
      <CardBox class="mb-2" has-table v-else>
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Prenom</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Solde</th>
              <th>Ville</th>
              <th>Status du Compte</th>
              <th>Type Utilisateur</th>
              <th>Date de Creation</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in itemsPaginated" :key="user.id">
              <td data-label="nom">
                {{ user.nom }}
              </td>
              <td data-label="prenom">
                {{ user.prenom }}
              </td>
              <td data-label="email">
                {{ user.email }}
              </td>
              <td data-label="phone">
                {{ user.phone }}
              </td>
              <td data-label="solde">{{ user.solde }} XAF</td>
              <td data-label="Ville">
                {{ user.localisation.ville }}
              </td>
              <td data-label="status">
                {{ user.status }}
              </td>
              <td data-label="type_user">
                {{ user.type_user }}
              </td>
              <td data-label="date">
                {{ user.date }}
              </td>
              <!-- <td data-label="Progress" class="lg:w-32">
          <progress class="flex w-2/5 self-center lg:w-full" max="100" :value="commande.progress">
            {{ commande.progress }}
          </progress>
        </td> -->

              <td class="before:hidden lg:w-1 whitespace-nowrap">
                <BaseButtons type="justify-start lg:justify-end" no-wrap>
                  <BaseButton
                    color="info"
                    :icon="mdiGamepadCircle"
                    small
                    @click="setAction(user)"
                  />
                  <BaseButton
                    color="warning"
                    :icon="mdiLock"
                    small
                    @click="setAction3(user)"
                  />
                  <BaseButton
                    color="danger"
                    :icon="mdiAccountAlertOutline"
                    small
                    @click="setAction2(user)"
                  />
                </BaseButtons>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800">
          <BaseLevel>
            <BaseButtons>
              <BaseButton
                v-for="page in pagesList"
                :key="page"
                :active="page === currentPage"
                :label="page + 1"
                :color="page === currentPage ? 'lightDark' : 'whiteDark'"
                small
                @click="currentPage = page"
              />
            </BaseButtons>
            <small>Page {{ currentPageHuman }} of {{ numPages }}</small>
          </BaseLevel>
        </div>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
