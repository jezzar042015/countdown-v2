<template>
  <div class="bg-green-400 text-shadow-[5px_5px_4px_#000000] text-white h-screen courier-prime-regular">
    <div class="flex h-full justify-center items-center text-[22vw]">
      <div v-if="timerStore.hasRemainingHours" class="flex items-center">
        <div class="text-center">{{ timerStore.hoursTens }}</div>
        <div class="text-center">{{ timerStore.hoursUnits }}</div>
        <div class="text-[8vw]">:</div>
      </div>
      <div class="flex items-center">
        <div class="text-center">{{ timerStore.minutesTens }}</div>
        <div class="text-center">{{ timerStore.minutesUnits }}</div>
        <div class="text-[8vw]">:</div>
      </div>
      <div class="flex items-center">
        <div class="text-center">{{ timerStore.secondsTens }}</div>
        <div class="text-center">{{ timerStore.secondsUnits }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, onUnmounted, watch } from 'vue';
  import { useTimerStore } from '@/stores/timer';
  import { useCongStore } from './stores/cong';

  const congStore = useCongStore()
  const timerStore = useTimerStore();
  let intervalId: number | undefined;

  onMounted(() => {
    congStore.readUriRequest()
    timerStore.updateRemainingTime();
    intervalId = setInterval(timerStore.updateRemainingTime, 1000);
  });

  watch(() => timerStore.isActive, (newValue) => {
    if (!newValue && intervalId !== undefined) {
      clearInterval(intervalId);
      intervalId = undefined;
    }
  });

  onUnmounted(() => {
    if (intervalId !== undefined) {
      clearInterval(intervalId);
    }
  });
</script>