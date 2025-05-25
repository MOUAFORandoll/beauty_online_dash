<script setup>
import { computed, ref, onMounted } from "vue";
import { useMainStore } from "@/stores/main";
import {
  mdiAccountMultiple,
  mdiCartOutline,
  mdiChartTimelineVariant,
  mdiMonitorCellphone,
  mdiReload,
  mdiChartPie,
} from "@mdi/js";
import * as chartConfig from "@/components/Charts/chart.config.js";
import LineChart from "@/components/Charts/LineChart.vue";
import SectionMain from "@/components/SectionMain.vue";
import CardBoxWidget from "@/components/CardBoxWidget.vue";
import CardBox from "@/components/CardBox.vue";
import TableSampleClients from "@/components/TableSampleClients.vue";
import NotificationBar from "@/components/NotificationBar.vue";
import BaseButton from "@/components/BaseButton.vue";
import CardBoxTransaction from "@/components/CardBoxTransaction.vue";
import CardBoxClient from "@/components/CardBoxClient.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import { RequestApi } from "@/boot/RequestApi";
let request = new RequestApi();
import router from "@/router";

const chartData = ref(null);
const dashData = ref({ nbr_projets: 0, nbr_commandes: 0, nbr_livraisons: 0 });

const fillChartData = () => {
  chartData.value = chartConfig.sampleChartData();
};

const mainStore = useMainStore();

const clientBarItems = computed(() => mainStore.clients.slice(0, 4));

const transactionBarItems = computed(() => mainStore.history);
onMounted(async () => {
  // connected();
  fillChartData();
});

const connected = () => {
  router.beforeEach(() => {
    if (mainStore.nom == null) {
      console.log("------------", "Vas te connecter");

      router.push("/login");
    } else {
      console.log("------------", "Vas te connecter");
    }
  });
};
let loading = ref(true);
let reloading = ref(true);
async function getDashBoard() {
  await request.getListAllTransaction();
  dashData.value = {
    nbr_projets: mainStore.listProjet.length,
    nbr_Livraisons: mainStore.listLivraisons.length,
  };
  // reloading.value = true;
  // const response = await request.getDashBoardAction();
  // if (response.status) {
  //   reloading.value = false;
  //   loading.value = false;
  //   dashData.value = response.data;
  // } else {
  //   reloading.value = false;
  //   loading.value = false;
  // }
}
function projet() {
  console.log("------");
  router.push("utilisateurs");
}
function commande() {
  console.log("------");
  router.push("commandes");
}
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton
        :icon="mdiChartTimelineVariant"
        title="DashBoard"
        main
      >
        <BaseButton
          target="_blank"
          :icon="mdiReload"
          label="Actualise"
          color="contrast"
          rounded-full
          small
          @click="getDashBoard"
        />
      </SectionTitleLineWithButton>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <CardBoxWidget
          trend-type="up"
          color="text-emerald-500"
          :icon="mdiAccountMultiple"
          :number="dashData.nbr_projets"
          label="Livraisons de Colis"
          :navigate="projet"
        />
        <CardBoxWidget
          trend-type="up"
          color="text-emerald-500"
          :icon="mdiAccountMultiple"
          :number="dashData.nbr_Livraisons"
          label="Livraisons de Medicament"
          :navigate="boutique"
        />
        <CardBoxWidget
          trend-type="up"
          color="text-emerald-500"
          :icon="mdiAccountMultiple"
          :number="dashData.nbr_projets"
          label="Livraisons de Produit"
          :navigate="projet"
        />
      </div>
      <!-- <CardBoxWidget trend="12%" trend-type="down" color="text-blue-500" :icon="mdiCartOutline"
          :number="dashData.nbr_commandes" prefix="" :navigate="commande" label="Commandes" />
        <CardBoxWidget trend="Overflow" trend-type="alert" color="text-red-500" :icon="mdiChartTimelineVariant"
          :number="dashData.nbr_livraisons" suffix="" :navigate="projet" label="Livraisons" /> -->

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div class="flex flex-col justify-between">
          <CardBoxTransaction
            v-for="(transaction, index) in transactionBarItems"
            :key="index"
            :amount="transaction.amount"
            :date="transaction.date"
            :business="transaction.business"
            :type="transaction.type"
            :name="transaction.name"
            :account="transaction.account"
          />
        </div>
        <div class="flex flex-col justify-between">
          <CardBoxClient
            v-for="client in clientBarItems"
            :key="client.id"
            :name="client.name"
            :login="client.login"
            :date="client.created"
            :progress="client.progress"
          />
        </div>
      </div>

      <!-- <SectionBannerStarOnGitHub class="mt-6 mb-6" /> -->

      <SectionTitleLineWithButton :icon="mdiChartPie" title="Trends overview">
        <BaseButton
          :icon="mdiReload"
          color="whiteDark"
          @click="fillChartData"
        />
      </SectionTitleLineWithButton>

      <CardBox class="mb-6">
        <div v-if="chartData">
          <line-chart :data="chartData" class="h-96" />
        </div>
      </CardBox>

      <SectionTitleLineWithButton :icon="mdiAccountMultiple" title="Clients" />

      <NotificationBar color="info" :icon="mdiMonitorCellphone">
        <b>Responsive table.</b> Collapses on mobile
      </NotificationBar>

      <CardBox has-table>
        <TableSampleClients />
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
