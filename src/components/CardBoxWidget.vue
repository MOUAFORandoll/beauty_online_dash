<script setup>
import { mdiCog } from "@mdi/js";
import CardBox from "@/components/CardBox.vue";
import NumberDynamic from "@/components/NumberDynamic.vue";
import BaseIcon from "@/components/BaseIcon.vue";
import BaseLevel from "@/components/BaseLevel.vue";
import PillTagTrend from "@/components/PillTagTrend.vue";
import BaseButton from "@/components/BaseButton.vue";

defineProps({
  number: {
    type: Number,
    default: 0,
  },
  icon: {
    type: String,
    default: null,
  },
  prefix: {
    type: String,
    default: null,
  },
  suffix: {
    type: String,
    default: null,
  },
  label: {
    type: String,
    default: null,
  },
  color: {
    type: String,
    default: null,
  },
  trend: {
    type: String,
    default: null,
  },
  trendType: {
    type: String,
    default: null,
  },
  navigate: {
    type: Function,
  },
});
</script>

<template>
  <CardBox>
    <BaseLevel v-if="trend" class="mb-3" mobile>
      <PillTagTrend :trend="trend" :trend-type="trendType" small />
      <BaseButton
        :icon="mdiCog"
        icon-w="w-4"
        icon-h="h-4"
        color="lightDark"
        @click="navigate"
        small
      />
    </BaseLevel>
    <BaseLevel mobile>
      <div>
        <h3 class="text-xl leading-tight text-gray-500 dark:text-slate-400">
          {{ label }}
        </h3>
        <div class="grid grid-cols-4 gap-4 place-items-center mt-4">
          <div class=" ">
            <h1 class="leading-tight font-semibold">
              <div>En cours</div>
              <NumberDynamic
                :value="number"
                :prefix="prefix"
                :suffix="suffix"
              />
            </h1>
          </div>
          <div class=" ">
            <h1 class="leading-tight font-semibold">
              <div>Termine</div>
              <NumberDynamic
                :value="number"
                :prefix="prefix"
                :suffix="suffix"
              />
            </h1>
          </div>
          <div class=" ">
            <h1 class="leading-tight font-semibold">
              <div>Total</div>
              <NumberDynamic
                :value="number"
                :prefix="prefix"
                :suffix="suffix"
              />
            </h1>
          </div>
        </div>
      </div>
      <BaseIcon
        v-if="icon"
        :path="icon"
        size="48"
        w=""
        h="h-16"
        :class="color"
      />
    </BaseLevel>
  </CardBox>
</template>
