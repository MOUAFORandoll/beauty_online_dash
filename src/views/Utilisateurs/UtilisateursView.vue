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
  mdiBell,
  mdiBellRing
} from "@mdi/js";
import SectionMain from "@/components/SectionMain.vue";
import NotificationBar from "@/components/NotificationBar.vue";
import CardBox from "@/components/CardBox.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";

import CardBoxComponentEmpty from "@/components/CardBoxComponentEmpty.vue";

import CardBoxModal from "@/components/CardBoxModal.vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import TableCheckboxCell from "@/components/TableCheckboxCell.vue";
import BaseLevel from "@/components/BaseLevel.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseButton from "@/components/BaseButton.vue";
import { onMounted, computed, ref } from "vue";
import { RequestApi } from "@/boot/RequestApi";

let request = new RequestApi();

const isModalPassword = ref(false);
const isModalStateUser = ref(false);
const isModalGeneralNotif = ref(false);
const isModalPersonalNotif = ref(false);
const perPage = ref(5);
const currentPage = ref(0);
let listUsers = ref([]);
let listUsersSave = ref([]);
let loading = ref(true);
let loadingUpdate = ref(false);
const message = ref("");
const newPass = ref("");

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
  for (let i = 0; i < numPages.value; i++) pagesList.push(i);
  return pagesList;
});

onMounted(async () => await getClientList());

async function getClientList() {
  loading.value = true;
  const response = await request.getClientList();
  loading.value = false;
  if (response.status) {
    listUsers.value = response.data;
    listUsersSave.value = response.data;
  }
}

let _seletUser = ref();

function setAction3(user) {
  _seletUser.value = user;
  isModalPassword.value = true;
  newPass.value = "";
}

function setAction2(user) {
  _seletUser.value = user;
  isModalStateUser.value = true;
  newPass.value = "";
}

function setAction4(user) {
  _seletUser.value = user;
  isModalPersonalNotif.value = true;
  message.value = "";
}

const sendWelcomeNotifications = async (userId) => {
  loadingUpdate.value = true;
  const response = await request.sendWelcomeNotifications(userId);
  loadingUpdate.value = false;
  if (response.status) toast.success("Notification envoyée");
};

const sendPersonnalNotifications = async () => {
  loadingUpdate.value = true;
  const response = await request.sendGeneraleNotifications({
    message: message.value,
    userId: _seletUser.value.id,
  });
  loadingUpdate.value = false;
  if (response.status) {
    toast.success("Notification envoyée");
    isModalPersonalNotif.value = false;
  }
};

const sendGeneraleNotifications = async () => {
  loadingUpdate.value = true;
  const response = await request.sendGeneraleNotifications({
    message: message.value,
  });
  loadingUpdate.value = false;
  if (response.status) {
    toast.success("Notification générale envoyée");
    isModalGeneralNotif.value = false;
  }
};
</script>

<template>
  <CardBoxModal v-model="isModalGeneralNotif" title="Notification Générale">
    <textarea
      v-model="message"
      placeholder="Écrivez votre message ici..."
      class="w-full h-32 p-2 border rounded mb-4"
    />
    <BaseButton
      :loading="loadingUpdate"
      label="Envoyer à tous"
      color="info"
      @click="sendGeneraleNotifications"
    />
  </CardBoxModal>

  <CardBoxModal
    v-if="_seletUser"
    v-model="isModalPersonalNotif"
    title="Notification Personnalisée"
  >
    <p>Envoyer une notification à <b>{{ _seletUser.nom }}</b></p>
    <textarea
      v-model="message"
      placeholder="Votre message ici..."
      class="w-full h-32 p-2 border rounded mb-4"
    />
    <BaseButton
      :loading="loadingUpdate"
      label="Envoyer"
      color="info"
      @click="sendPersonnalNotifications"
    />
  </CardBoxModal>

  <!-- Modal existants -->
  <!-- ... code inchangé pour mot de passe et status ... -->

  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton
        :icon="mdiAccountSwitch"
        title="Liste des clients"
        main
      >
        <BaseButtons>
          <BaseButton
            :loading="loading"
            :icon="mdiReload"
            label="Actualiser"
            color="contrast"
            rounded-full
            small
            @click="getClientList"
          />
          <BaseButton
            :icon="mdiBell"
            label="Notif Générale"
            color="info"
            rounded-full
            small
            @click="isModalGeneralNotif = true"
          />
        </BaseButtons>
      </SectionTitleLineWithButton>

      <Loader v-if="loading" />
      <CardBox v-else class="mb-2" has-table>
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Code Pays</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in itemsPaginated" :key="user.id">
              <td>{{ user.userName }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.phone }}</td>
              <td>{{ user.countryCode }}</td>
              <td>{{ user.date_created }}</td>
              <td class="whitespace-nowrap">
                <BaseButtons>
                  <BaseButton
                    color="warning"
                    :icon="mdiLock"
                    small
                    @click="setAction3(user)"
                  />
                  <BaseButton
                    :color="!user.status ? 'danger' : 'info'"
                    :icon="mdiAccountAlertOutline"
                    small
                    @click="setAction2(user)"
                  />
                  <BaseButton
                    :icon="mdiBellRing"
                    color="success"
                    small
                    @click="setAction4(user)"
                  />
                </BaseButtons>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="p-3 lg:px-6 border-t">
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
            <small>Page {{ currentPageHuman }} sur {{ numPages }}</small>
          </BaseLevel>
        </div>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
