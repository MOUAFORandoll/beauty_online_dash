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
  await getBabanaList();
});

async function getBabanaList() {
  loading.value = true;
  const response = await request.getBabanaList();
  if (response.status) {
    loading.value = false;
    listUsers.value = response.data;
    listUsersSave.value = response.data;
  } else {
    loading.value = false;
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

const makeLivreur = async () => {
  loadingUpdate.value = true;

  const response = await request.makeLivreurAction(_seletUser.value.keySecret);
  if (response.status) {
    await getBabanaList();

    loadingUpdate.value = false;
    isModalActive.value = false;
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
function setAction2(user) {
  _seletUser.value = user;
  isModalStateUser.value = true;
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
    await getBabanaList();

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
const stateUserAction = async () => {
  loadingUpdate.value = true;

  const response = await request.stateUserAction(_seletUser.value.keySecret);
  if (response.status) {
    await getBabanaList();

    loadingUpdate.value = false;
    isModalStateUser.value = false;
  } else {
    loadingUpdate.value = false;
  }
};
</script>

<template>
  <CardBoxModal
    v-model="isModalStateUser"
    v-if="_seletUser != null"
    title="Status du compte"
    button="danger"
  >
    <p>
      Vous allez
      {{ _seletUser.status == true ? "desactiver" : "activer" }} cette
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
        title="Liste des babana"
        main
      >
        <BaseButton
          @click="getBabanaList"
          :loading="loading"
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

              <th>Status du Compte</th>

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

              <td data-label="status">
                {{ user.status == true ? "Actif" : "Inactif" }}
              </td>

              <td data-label="date">
                {{ user.date_created }}
              </td>
              <!-- <td data-label="Progress" class="lg:w-32">
          <progress class="flex w-2/5 self-center lg:w-full" max="100" :value="commande.progress">
            {{ commande.progress }}
          </progress>
        </td> -->

              <td class="before:hidden lg:w-1 whitespace-nowrap">
                <BaseButtons type="justify-start lg:justify-end" no-wrap>
                  <BaseButton
                    color="warning"
                    :icon="mdiLock"
                    small
                    @click="setAction3(user)"
                  />
                  <BaseButton
                    :color="!user.status == true ? 'danger' : 'info'"
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
