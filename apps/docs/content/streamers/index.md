---
outline: deep
---

# Получения доступа к созданию аукционов

**На момент написания документации проект находится в ранней версии разработки** и поэтому список стримеров, 
получившие доступ к созданию аукционов, довольно короткий. В дальнейшем список будет расширяться (если проект конечно не закроется ◉‿◉ ).

Также стоит отметить что доступ будет предоставлен только стримерам платформы **Twitch** (в будущем ситуация может измениться).

Список стримеров, у которых есть доступ к созданию аукционов, представлен ниже.

## Список стримеров с доступом

<script setup>
import StreamerBadge from '../../src/components/streamer-badge.vue'

import {data as streamersList} from '../../data-loaders/streamers-list.data.ts'
</script>

<div class="streamers-badges_list-wrapper">
    <div class="streamers-badges_list">
        <StreamerBadge 
        v-for="streamer in streamersList" 
        :name="streamer.name" 
        :link="streamer.link" 
        :avatarUrl="streamer.avatarUrl">
            {{ streamer.name }}
        </StreamerBadge>
    </div>
</div>

<style lang="css" scoped>
.streamers-badges_list-wrapper {
    overflow: clip;
    
    width: 100%;
    position: relative;
}

    .streamers-badges_list {
    width: 100%;
    
    display: flex;
    flex-wrap: wrap;
    
    margin-left: -20px;
    
    row-gap: 8px;
    }
</style>
