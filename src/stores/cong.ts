import { useStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { useTimerStore } from "./timer";

export const useCongStore = defineStore('cong', () => {

    const timerStore = useTimerStore()

    const TARGETS = useStorage<string[]>('COUNTDOWN_TARGETS', [])

    const readUriRequest = () => {
        const queries = window.location.search

        const params = new URLSearchParams(queries);
        const targets = params.get('targets')

        TARGETS.value = targets ? targets.split(',') : ['2PM', '6PM']

        setEnd()
    }

    const setEnd = () => {
        const now = new Date();

        const times = TARGETS.value.map(timeStr => {
            const tempDate = new Date(now);
            const match = timeStr.match(/\d{1,2}(?::\d{2})?|AM|PM/gi) || [];
            const [timePart, modifier] = match;

            if (timePart) {
                let [hr, minute] = timePart.includes(':')
                    ? timePart.split(':')
                    : [timePart, '0'];

                let hour = parseInt(hr, 10);
                minute = String(parseInt(minute, 10));

                if (modifier.toUpperCase() === 'PM' && hour !== 12) hour += 12;
                if (modifier.toUpperCase() === 'AM' && hour === 12) hour = 0;

                tempDate.setHours(Number(hour), Number(minute), 0, 0);

                // If time already passed today, use next day
                if (tempDate <= now) {
                    tempDate.setDate(tempDate.getDate() + 1);
                }

                return tempDate;
            }
        });

        // Filter out undefined values and sort to pick the soonest one
        const validTimes = times.filter((t): t is Date => t instanceof Date);
        validTimes.sort((a, b) => a.getTime() - b.getTime());
        const sortedTimes = validTimes;
        const nextTime = sortedTimes[0];

        // Call the store setter
        if (nextTime) {
            let hour = nextTime.getHours();
            let minute = nextTime.getMinutes();
            let modifier = hour >= 12 ? 'PM' : 'AM';
            hour = hour % 12 || 12;
            const timeStr = minute === 0
                ? `${hour}${modifier}`
                : `${hour}:${minute.toString().padStart(2, '0')}${modifier}`;

            timerStore.setEndTime(timeStr);
        }
    }


    return {
        TARGETS,
        readUriRequest,
    }
})