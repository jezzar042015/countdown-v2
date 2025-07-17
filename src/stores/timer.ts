import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useTimerStore = defineStore('timer', () => {
    const end = ref('');
    const endTime = ref(parseEndTime(end.value));
    const remainingHours = ref(0);
    const remainingMinutes = ref(0);
    const remainingSeconds = ref(0);
    const isActive = ref(true);

    function parseEndTime(timeStr: string): Date | null {
        const regex = /(\d+)(:(\d+))?(AM|PM)/i;
        const match = regex.exec(timeStr);
        if (!match) return null;

        let hour = parseInt(match[1], 10);
        const minute = match[3] ? parseInt(match[3], 10) : 0;
        const period = match[4].toUpperCase();

        if (period === 'PM' && hour !== 12) hour += 12;
        if (period === 'AM' && hour === 12) hour = 0;

        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0, 0);
    }

    function setEndTime(timeStr: string) {
        end.value = timeStr;
        endTime.value = parseEndTime(timeStr);
        updateRemainingTime();
    }

    function updateRemainingTime() {
        const now = new Date();
        if (endTime.value && now >= endTime.value) {
            remainingHours.value = 0;
            remainingMinutes.value = 0;
            remainingSeconds.value = 0;
            isActive.value = false;
        } else if (endTime.value) {
            const diff = endTime.value.getTime() - now.getTime();
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const remainingAfterHours = diff % (1000 * 60 * 60);
            const minutes = Math.floor(remainingAfterHours / (1000 * 60));
            const seconds = Math.floor((remainingAfterHours % (1000 * 60)) / 1000);
            remainingHours.value = hours;
            remainingMinutes.value = minutes;
            remainingSeconds.value = seconds;
            isActive.value = true;
        }
    }

    const hoursTens = computed(() => Math.floor(remainingHours.value / 10));
    const hoursUnits = computed(() => remainingHours.value % 10);
    const minutesTens = computed(() => Math.floor(remainingMinutes.value / 10));
    const minutesUnits = computed(() => remainingMinutes.value % 10);
    const secondsTens = computed(() => Math.floor(remainingSeconds.value / 10));
    const secondsUnits = computed(() => remainingSeconds.value % 10);
    const hasRemainingHours = computed(() => remainingHours.value > 0);

    return {
        end,
        endTime,
        remainingHours,
        remainingMinutes,
        remainingSeconds,
        isActive,
        setEndTime,
        updateRemainingTime,
        hoursTens,
        hoursUnits,
        minutesTens,
        minutesUnits,
        secondsTens,
        secondsUnits,
        hasRemainingHours,
    };
});