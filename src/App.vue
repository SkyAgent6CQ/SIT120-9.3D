<script setup>
import { ref, computed, nextTick, watch } from 'vue'

// Layout pieces shared by every page
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'

// The three pages planned in Task 1.1P
import HomeView from './components/HomeView.vue'
import WhatToExpectView from './components/WhatToExpectView.vue'
import VolunteerView from './components/VolunteerView.vue'

// The Task 6.3D / 8.4D sign-up form, rebuilt as a child component
import ContactForm from './components/ContactForm.vue'

import { sessions } from './data/sessions.js'

/* View management
   One piece of state (currentView) decides which page component is shown.
   Header and footer receive it as a prop to mark the current link, and ask
   to change it by emitting 'navigate'. Nothing else can change the page. */
const pages = [
  { id: 'home', label: 'Home', component: HomeView, title: 'With a Mission, free food for Deakin Residential Services students' },
  { id: 'expect', label: 'What to expect', component: WhatToExpectView, title: 'What to expect - With a Mission' },
  { id: 'volunteer', label: 'Help out', component: VolunteerView, title: 'Help out - With a Mission' }
]

const currentView = ref('home')
const activePage = computed(() => pages.find(p => p.id === currentView.value))

// navigate('expect', 'entrance') switches page, then scrolls to that section
// once Vue has rendered it. Without a section it goes back to the top.
async function navigate(viewId, sectionId) {
  currentView.value = viewId
  await nextTick()
  const target = sectionId ? document.getElementById(sectionId) : null
  if (target) {
    target.scrollIntoView({ block: 'start' })
  } else {
    window.scrollTo(0, 0)
  }
}

// Only the home page declares a sessions prop, so it is only passed there.
// Passing it to the other two would leave a stray attribute on their markup.
const viewProps = computed(() => (currentView.value === 'home' ? { sessions } : {}))

// Keep the browser tab title in step with the page being shown.
watch(activePage, page => { document.title = page.title }, { immediate: true })

/* Parent side of the form
   ContactForm emits 'submit-form' with a shallow copy of its data. The copy
   is stored here, in the parent, so the card below stays on screen after the
   child resets its own fields 2 seconds later. */
const submission = ref(null)
const ackCard = ref(null)

async function handleSubmitForm(payload) {
  submission.value = {
    ...payload,
    receivedAt: new Date().toLocaleTimeString('en-AU', { hour: 'numeric', minute: '2-digit' })
  }
  // Bring the card into view without jumping past the form.
  await nextTick()
  ackCard.value?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
}

// The form sends the session id, so the card looks up the readable date.
const firstSession = computed(() =>
  sessions.find(s => s.id === submission.value?.session)
)
</script>

<template>
  <a class="skip" href="#main">Skip to content</a>

  <AppHeader :pages="pages" :current-view="currentView" @navigate="navigate" />

  <main id="main">
    <!-- The active page view. :is swaps the component; the props and the
         navigate listener are passed to whichever page is showing. -->
    <component
      :is="activePage.component"
      v-bind="viewProps"
      @navigate="navigate"
    />

    <!-- The sign-up form belongs to the Help out page, under the roles it
         refers to, so it is only rendered on that view. -->
    <section v-if="currentView === 'volunteer'" id="signup" class="signup-section"
      aria-labelledby="form-heading">
      <div class="wrap">
        <ContactForm
          title="Sign up for a session"
          :sessions="sessions"
          @submit-form="handleSubmitForm"
        />

        <!-- Customer Acknowledgement Card. It reads only from the parent's own
             copy of the data, so the child's reset cannot clear it. -->
        <article v-if="submission" ref="ackCard" class="ack-card" aria-live="polite">
          <h3>Thanks {{ submission.name.split(' ')[0] }}, you are on the list</h3>
          <p class="ack-lead">
            You are down for <strong>{{ submission.saturdays }}
            Saturday{{ submission.saturdays === 1 ? '' : 's' }}</strong>, starting
            <strong>{{ firstSession.day }} at {{ firstSession.doors }}</strong>.
            The roster goes to {{ submission.email }} on the Monday before.
          </p>
          <ul class="ack-list">
            <li><strong>Name:</strong> {{ submission.name }}</li>
            <li><strong>Deakin email:</strong> {{ submission.email }}</li>
            <li><strong>Mobile:</strong> {{ submission.mobile || 'Not given' }}</li>
            <li><strong>Residence:</strong> {{ submission.residence }}</li>
            <li><strong>Saturdays this trimester:</strong> {{ submission.saturdays }}</li>
            <li><strong>First Saturday:</strong> {{ firstSession.day }}, {{ firstSession.where }}</li>
            <li><strong>Roles:</strong> {{ submission.roles.join(', ') }}</li>
            <li><strong>Notes:</strong> {{ submission.notes || 'Nothing added' }}</li>
          </ul>
          <p class="ack-meta">Received at {{ submission.receivedAt }}. Nothing has been sent
            anywhere, so screenshot this or email
            <a href="mailto:hello@withamission.org.au">hello@withamission.org.au</a> and an
            organiser will add you to the roster.</p>
        </article>
      </div>
    </section>
  </main>

  <AppFooter :pages="pages" :current-view="currentView" @navigate="navigate" />
</template>
