<script setup>
import logo from '../assets/images/wam-logo.webp'

// The page list and the active page both come from App.vue, so the header
// never decides on its own which page is showing. It only asks to change it.
defineProps({
  pages: { type: Array, required: true },
  currentView: { type: String, required: true }
})

const emit = defineEmits(['navigate'])
</script>

<template>
  <header class="site-header">
    <div class="wrap header-inner">
      <a class="brand" href="#home" @click.prevent="emit('navigate', 'home')">
        <img class="brand-mark" :src="logo" width="240" height="240" alt="">
        <span class="wordmark"><span class="wordmark-small">With a</span> Mission</span>
      </a>
      <!-- There is no hamburger toggle, on purpose: with only three links a first-time
           visitor should see that the directions page exists without opening
           anything. On a phone the links wrap (flex-wrap in styles.css) so
           nothing scrolls sideways. -->
      <nav class="site-nav" aria-label="Main">
        <ul class="nav">
          <li v-for="page in pages" :key="page.id">
            <a
              :href="'#' + page.id"
              :aria-current="page.id === currentView ? 'page' : null"
              @click.prevent="emit('navigate', page.id)"
            >{{ page.label }}</a>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>
