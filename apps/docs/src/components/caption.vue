<script setup lang="ts">
import { computed } from 'vue';


type CaptionProps = {
  variant?: 'warning' | 'info'
  title?: string
}

const props = defineProps<CaptionProps>()

const captionLabel = computed<Record<NonNullable<CaptionProps['variant']>, string>>(() => ({
  warning: '⚠️ Внимание',
  info: "📝 На заметку"
}))

const classes = computed(() => ({
  "caption__info": props.variant === 'info',
  "caption__warning": props.variant === 'warning'
}))

</script>

<template>
	<div class="caption" :class="classes">
    	<div class="caption_content-wrapper">
            <span class="caption_title">{{props.title ?? captionLabel[props.variant ?? 'info']}}</span>
            <slot />
    	</div>
	</div>
</template>

<style lang="css" scoped>
    .caption {
        padding: 12px 16px;

        width: 100%;
        height: fit-content;

        border-radius: 12px;
    }

    .caption_content-wrapper {
        display: flex;
        flex-direction: column;

        row-gap: 8px;
    }

    .caption_title {
        font-size: 1rem;
        font-weight: 600;
    }

    .caption__info {
        background-color: var(--color-blue-dark);
    }

    .caption__warning {
        color: var(--color-yellow);

        font-size: 1rem;
        font-weight: 500;

        background-color: var(--color-yellow-dark);
        background-opacity: 10;
    }
</style>
