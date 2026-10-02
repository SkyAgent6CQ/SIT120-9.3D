<script setup>
defineProps({
  pages: { type: Array, required: true },
  currentView: { type: String, required: true }
})

const emit = defineEmits(['navigate'])

// Computed once rather than hard-coded, so the copyright line is never a year behind.
const year = new Date().getFullYear()
</script>

<template>
  <footer class="site-footer">
    <div class="wrap footer-inner">
      <div class="footer-contact">
        <p class="footer-lead">Questions about a session? Email
          <a href="mailto:hello@withamission.org.au">hello@withamission.org.au</a>
          and a volunteer will reply within a day or two.</p>
        <!-- Secondary navigation: the same three links again, so a phone user at
             the bottom of a long page does not have to scroll back up. -->
        <nav class="footer-nav" aria-label="Footer">
          <ul class="nav nav-footer">
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
      <div class="footer-legal">
        <p class="disclaimer">With a Mission is run by Earthen Vessels Church. It is not run by,
          funded by or affiliated with Deakin University or Deakin Residential Services.</p>
        <p class="copyright">&copy; {{ year }} With a Mission. Built by Krishna Agarwal for SIT120.</p>
      </div>
    </div>
  </footer>
</template>
