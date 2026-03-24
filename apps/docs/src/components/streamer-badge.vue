<script setup lang="ts">

import { computed } from 'vue';
import type { StreamerInfo } from '../../data-loaders/streamers-list.data'

const props = defineProps<StreamerInfo>()

const avatarClassesObj = computed(() => {
  return {
    'streamer-badge_avatar__empty-url': !props.avatarUrl
  }
})

console.log(props.avatarUrl)

</script>

<template>
    <a class="streamer-badge" :href="props.link">
        <img v-if="!!props.avatarUrl" class="streamer-badge_avatar-image" :src="props.avatarUrl"  loading="lazy"/>
        <div
        v-else
        class="streamer-badge_avatar-placeholder-wrapper"
        :class="avatarClassesObj"
        :style="{
          backgroundImage: `url(${props.avatarUrl})`,
          backgroundSize: 'cover'
        }"
        >
            <span
                class="streamer-badge_avatar-name-placeholder"
                v-if="!props.avatarUrl"
            >
                {{props.name[0].toUpperCase()}}
            </span>
        </div>
        <span class="streamer-badge_name">{{props.name}}</span>
    </a>
</template>

<style lang="css" scoped>
.streamer-badge {
    cursor: pointer;

    padding: 4px 6px;

    width: fit-content;

    display: flex;
    align-items: center;

    column-gap: 8px;

    border-width: 1px;
    border-color: var(--color-gray);

    text-decoration: none;

    color:var(--color-green-accent);

    &:hover {
        color: var(--color-green);
    }

    &::before {
        content: '';

        position: relative;
        display: inline-block;

        width: 4px;
        height: 4px;

        margin: 0 4px;

        border-radius: 1000px;
        background-color: var(--color-gray);
    }
}

.streamer-badge_avatar-image {
    margin: 0;

    width: 21px;
    height: 21px;

    background-color: var(--color-dark-accent);
    border-radius: 6px;
    border-width: 1px;
    border-color: var(--color-gray);
}

.streamer-badge_avatar-placeholder-wrapper {
    width: 21px;
    height: 21px;

    background-color: var(--color-dark-accent);
    border-radius: 6px;
    border-width: 1px;
    border-color: var(--color-gray);
}

.streamer-badge_avatar__empty-url {
    display: flex;
    align-items: center;
    justify-content: center;
}

.streamer-badge_avatar-name-placeholder {
    color: var(--color-gray-accent);

    font-size: 0.75rem;
}

.streamer-badge_name {
    color: inherit;
    font-size: 0.85rem;
}
</style>
