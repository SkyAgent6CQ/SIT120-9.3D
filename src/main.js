import { createApp } from 'vue'
import App from './App.vue'

// One stylesheet for the whole site, carried over from Task 8.4D and extended
// for 9.3D. Importing it here (rather than in App.vue) makes it global, so
// every component shares the same tokens, breakpoints and class names.
import './assets/styles.css'

createApp(App).mount('#app')
