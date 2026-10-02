<script setup>
import { ref, computed, watch, nextTick, onBeforeUnmount } from 'vue'

/* Props: configuration passed DOWN from App.vue.
   The form does not own the session dates. App.vue holds them and passes the
   same array to HomeView (the schedule table) and to this form (the radio
   list), so a date changed in one place changes everywhere. */
const props = defineProps({
  title:       { type: String, default: 'Sign up for a session' },
  sessions:    { type: Array,  required: true },
  defaultName: { type: String, default: '' }
})

/* Emits: the one event this child sends UP to its parent. */
const emit = defineEmits(['submit-form'])

/* Options rendered with v-for. Values are the readable labels, so the
   parent can print them on the acknowledgement card without a lookup table. */
const residences = [
  'Melaluca College',
  'Waratah College',
  'Village Vikings College',
  'Another DRS building at Burwood',
  "I don't live on Res"
]

const roles = [
  { id: 'r-collection', label: 'Collection run',  note: '12:30pm to 2:15pm, heavy lifting, a driver needed' },
  { id: 'r-setup',      label: 'Set-up',          note: '2:30pm to 4:00pm, laying out and sorting crates' },
  { id: 'r-crate',      label: 'Crate host',      note: '3:45pm to 5:15pm, light, stay with two crates' },
  { id: 'r-table',      label: 'Table and limit', note: '3:45pm to 5:15pm, no lifting, call the limit' },
  { id: 'r-packdown',   label: 'Pack down',       note: '5:15pm to 6:00pm, heavy, the shift most often short' },
  { id: 'r-any',        label: 'Any of these',    note: 'Put me wherever the gap is on the day' }
]

/* Local reactive form state, bound with v-model in the template.
   blankForm() builds a brand new object every time it is called, which is
   what makes the 2-second reset clean (see resetForm below). */
function blankForm() {
  return {
    name: props.defaultName,   // text      v-model
    email: '',                 // email     v-model
    mobile: '',                // tel       v-model (optional)
    residence: '',             // select    v-model, options from v-for
    saturdays: '',             // number    v-model.number
    session: '',               // radio     v-model
    roles: [],                 // checkbox  v-model (array, one per ticked box)
    notes: ''                  // textarea  v-model (optional)
  }
}

const form = ref(blankForm())
const errors = ref({})
const status = ref('idle') // 'idle' | 'sent' (the 2 seconds before the reset)
const sentName = ref('')
const formEl = ref(null)
let resetTimer = null

const NAME_LIMIT = 60
const NOTES_LIMIT = 300
const maxSaturdays = computed(() => props.sessions.length)

/* Validation rules, carried over from signup.js in Task 8.4D.
   Each rule returns an error message, or '' when the value is fine. */
const NAME_PATTERN = /^[A-Za-z][A-Za-z' -]{0,59}$/ // a name as written on a roster
const DEAKIN_EMAIL_PATTERN = /^[a-z0-9._%+-]+@deakin\.edu\.au$/i
const AU_MOBILE_PATTERN = /^04\d{2}[ -]?\d{3}[ -]?\d{3}$/ // 

const rules = {
  name(f) {
    const v = f.name.trim()
    if (v === '') return 'We need a name so the organiser knows who turned up.'
    if (v.length > NAME_LIMIT) return `That is over ${NAME_LIMIT} characters. A first and last name is plenty.`
    if (!NAME_PATTERN.test(v)) return 'Letters, spaces, hyphens and apostrophes only, and it has to start with a letter.'
    return ''
  },
  email(f) {
    const v = f.email.trim()
    if (v === '') return 'We need an email address to send the roster to.'
    if (!v.includes('@')) return 'That is missing an @, so it is not an email address yet.'
    if (!DEAKIN_EMAIL_PATTERN.test(v)) return 'That is not a Deakin address. It has to end in @deakin.edu.au.'
    return ''
  },
  mobile(f) {
    const v = f.mobile.trim()
    if (v === '') return ''      // optional
    if (!AU_MOBILE_PATTERN.test(v)) return 'Australian mobiles are ten digits starting with 04, like 0412 345 678.'
    return ''
  },
  residence(f) {
    return f.residence === '' ? 'Pick a residence, or the last option if you do not live on Res.' : ''
  },
  /* v-model.number hands this rule a real Number, or '' when the box is
     empty, so it can check the type and the range rather than parse text. */
  saturdays(f) {
    const v = f.saturdays
    const max = maxSaturdays.value
    if (v === '' || v === null) return 'Tell us how many Saturdays you can do, even if it is just one.'
    if (typeof v !== 'number' || !Number.isInteger(v)) return 'A whole number of Saturdays, please.'
    if (v < 1 || v > max) return `There are ${max} sessions this trimester, so pick a number from 1 to ${max}.`
    // Cross-field check: you cannot commit to more Saturdays than are left
    // from the first one you picked.
    const start = props.sessions.findIndex(s => s.id === f.session)
    if (start !== -1) {
      const left = props.sessions.length - start
      if (v > left) {
        return `Only ${left} session${left === 1 ? ' is' : 's are'} left from ${props.sessions[start].day}, so ${left} is the most you can commit from that date.`
      }
    }
    return ''
  },
  session(f) {
    return f.session === '' ? 'Choose your first Saturday. Email us later if you need to swap it.' : ''
  },
  roles(f) {
    return f.roles.length === 0 ? 'Tick at least one role, or "Any of these" if you do not mind.' : ''
  },
  notes(f) {
    const over = f.notes.length - NOTES_LIMIT
    return over > 0 ? `That is ${over} characters over the ${NOTES_LIMIT} character limit.` : ''
  }
}

function check(field) {
  errors.value[field] = rules[field](form.value)
  // The saturdays rule depends on the session, so re-check it when that changes.
  if (field === 'session' && errors.value.saturdays) {
    errors.value.saturdays = rules.saturdays(form.value)
  }
}

function validateAll() {
  Object.keys(rules).forEach(check)
  return Object.values(errors.value).every(message => message === '')
}

/* Once a field is showing an error, re-check it on every keystroke so the
   message clears the moment the mistake is fixed, not at the next submit.
   Fields with no error are left alone, so nobody is told off mid-word. */
watch(form, () => {
  Object.keys(errors.value).forEach(field => {
    if (errors.value[field]) check(field)
  })
}, { deep: true })

const notesCount = computed(() => form.value.notes.length)

/* Submit: @submit.prevent in the template has already stopped the reload. */
async function handleSubmit() {
  if (status.value === 'sent') return

  if (!validateAll()) {
    // Put the cursor on the first problem so a long form on a phone does
    // not leave someone scrolling to find the message.
    await nextTick()
    formEl.value.querySelector('[aria-invalid="true"]')?.focus()
    return
  }

  // A SHALLOW copy goes up to the parent. The top-level fields are copied,
  // but form.value.roles is an array, so the copy shares that same array.
  // That is safe here only because resetForm() replaces form.value with a
  // fresh object (and a fresh roles array) instead of emptying the old one.
  // Emptying it in place would also empty the roles on the parent's card.
  emit('submit-form', { ...form.value })

  sentName.value = form.value.name.trim().split(' ')[0]
  status.value = 'sent'
  resetTimer = setTimeout(resetForm, 2000)
}

function resetForm() {
  form.value = blankForm()
  errors.value = {}
  status.value = 'idle'
  resetTimer = null
}

/* The "Clear the form" button: asks first if there is anything to lose. */
function clearForm() {
  const f = form.value
  const isEmpty = f.name === props.defaultName && !f.email && !f.mobile && !f.residence &&
    f.saturdays === '' && !f.session && f.roles.length === 0 && !f.notes
  if (!isEmpty && !window.confirm('Clear everything you have filled in? This cannot be undone.')) return
  resetForm()
}

// If the person switches page during the 2 seconds, the component is
// destroyed, so the pending timer is cancelled with it.
onBeforeUnmount(() => clearTimeout(resetTimer))
</script>

<template>
  <div class="contact-form">
    <h2 id="form-heading">{{ title }}</h2>

    <p class="form-times">Set-up starts at 2:30pm, the queue moves from 4:00pm and pack
      down finishes about 6:00pm. Most people take one part, not the whole day.</p>

    <!-- novalidate turns off the browser's own popups so every message comes from
         the rules above and appears inline, beneath its field, through v-if. -->
    <form ref="formEl" class="signup-form" novalidate aria-labelledby="form-heading"
      @submit.prevent="handleSubmit">

      <fieldset class="field-set">
        <legend>1. Who you are</legend>
        <div class="field-body">
          <div class="field-grid">

            <div class="field">
              <label for="name">Full name</label>
              <input id="name" v-model="form.name" type="text" autocomplete="name"
                aria-required="true" :aria-invalid="errors.name ? 'true' : null"
                aria-describedby="name-error" @blur="check('name')">
              <span v-if="errors.name" id="name-error" class="feedback feedback-error">{{ errors.name }}</span>
            </div>

            <div class="field">
              <label for="email">Deakin email</label>
              <input id="email" v-model="form.email" type="email" autocomplete="email"
                aria-required="true" :aria-invalid="errors.email ? 'true' : null"
                aria-describedby="email-hint email-error" @blur="check('email')">
              <span id="email-hint" class="hint">Ends in @deakin.edu.au. Rosters are only
                ever sent to Deakin addresses.</span>
              <span v-if="errors.email" id="email-error" class="feedback feedback-error">{{ errors.email }}</span>
            </div>

            <div class="field">
              <label for="mobile">Mobile <span class="optional">(optional)</span></label>
              <input id="mobile" v-model="form.mobile" type="tel" autocomplete="tel" inputmode="tel"
                :aria-invalid="errors.mobile ? 'true' : null"
                aria-describedby="mobile-hint mobile-error" @blur="check('mobile')">
              <span id="mobile-hint" class="hint">Like 0412 345 678. Only used if a session is
                moved on the day.</span>
              <span v-if="errors.mobile" id="mobile-error" class="feedback feedback-error">{{ errors.mobile }}</span>
            </div>

            <div class="field">
              <label for="residence">Your residence</label>
              <!-- Options are rendered from the residences array with v-for. -->
              <select id="residence" v-model="form.residence" aria-required="true"
                :aria-invalid="errors.residence ? 'true' : null"
                aria-describedby="residence-hint residence-error" @change="check('residence')">
                <option value="" disabled>Choose your residence</option>
                <option v-for="place in residences" :key="place" :value="place">{{ place }}</option>
              </select>
              <span id="residence-hint" class="hint">Living on Res is not required to volunteer.
                We ask so the roster reaches you the quickest way.</span>
              <span v-if="errors.residence" id="residence-error" class="feedback feedback-error">{{ errors.residence }}</span>
            </div>

          </div>
        </div>
      </fieldset>

      <fieldset class="field-set">
        <legend>2. Which Saturdays</legend>
        <div class="field-body">

          <div class="field field-narrow">
            <label for="saturdays">Saturdays you can commit this trimester</label>
            <!-- .number makes Vue store a Number, not the string the input gives it. -->
            <input id="saturdays" v-model.number="form.saturdays" type="number"
              inputmode="numeric" min="1" :max="maxSaturdays" step="1"
              aria-required="true" :aria-invalid="errors.saturdays ? 'true' : null"
              aria-describedby="saturdays-hint saturdays-error" @blur="check('saturdays')">
            <span id="saturdays-hint" class="hint">From 1 to {{ maxSaturdays }}. Three would be
              every second session.</span>
            <span v-if="errors.saturdays" id="saturdays-error" class="feedback feedback-error">{{ errors.saturdays }}</span>
          </div>

          <p id="session-label" class="field-label">Your first Saturday</p>
          <p class="field-intro">Real dates, with the spots still open on each. A list rather
            than a date picker, so nobody can pick a Saturday with no session on it.</p>

          <ul class="choice-list" role="radiogroup" aria-labelledby="session-label"
            :class="{ 'is-invalid': errors.session }">
            <li v-for="s in sessions" :key="s.id" class="choice">
              <input :id="'s-' + s.id" v-model="form.session" type="radio" name="session"
                :value="s.id" aria-required="true" :aria-invalid="errors.session ? 'true' : null"
                @change="check('session')">
              <label :for="'s-' + s.id">{{ s.day }}, {{ s.doors }}
                <span class="choice-note">{{ s.where }}. {{ s.spotsLeft }} spots left<template v-if="s.note">, {{ s.note }}</template></span>
              </label>
            </li>
          </ul>
          <span v-if="errors.session" class="feedback feedback-error">{{ errors.session }}</span>
        </div>
      </fieldset>

      <fieldset class="field-set">
        <legend>3. What you can help with</legend>
        <div class="field-body">
          <p class="field-intro">Tick at least one, and as many as you can do. The roles and
            times are the same ones in the table above.</p>

          <ul class="choice-list choice-grid" :class="{ 'is-invalid': errors.roles }">
            <li v-for="role in roles" :key="role.id" class="choice">
              <!-- v-model on several checkboxes bound to one array collects the
                   value of every ticked box into form.roles. -->
              <input :id="role.id" v-model="form.roles" type="checkbox" :value="role.label"
                :aria-invalid="errors.roles ? 'true' : null" @change="check('roles')">
              <label :for="role.id">{{ role.label }}
                <span class="choice-note">{{ role.note }}</span>
              </label>
            </li>
          </ul>
          <span v-if="errors.roles" class="feedback feedback-error">{{ errors.roles }}</span>

          <div class="field field-wide">
            <label for="notes">Anything we should know? <span class="optional">(optional)</span></label>
            <textarea id="notes" v-model="form.notes" rows="3"
              :aria-invalid="errors.notes ? 'true' : null"
              aria-describedby="notes-hint notes-counter notes-error" @blur="check('notes')"></textarea>
            <span id="notes-hint" class="hint">A licence you hold, a back you should not be
              lifting with, or a time you have to leave.</span>
            <span id="notes-counter" class="counter"
              :class="{ 'counter-warn': notesCount > NOTES_LIMIT - 40 && notesCount <= NOTES_LIMIT, 'counter-over': notesCount > NOTES_LIMIT }">
              {{ notesCount }} of {{ NOTES_LIMIT }} characters</span>
            <span v-if="errors.notes" id="notes-error" class="feedback feedback-error">{{ errors.notes }}</span>
          </div>
        </div>
      </fieldset>

      <!-- Shown for the 2 seconds between a valid submit and the reset. -->
      <p v-if="status === 'sent'" class="form-success" role="status">
        Thanks {{ sentName }}, you are on the list. This form clears in 2 seconds, and your
        details stay on the card below.
      </p>

      <div class="form-actions">
        <button type="button" class="button button-quiet" :disabled="status === 'sent'"
          @click="clearForm">Clear the form</button>
        <button type="submit" class="button" :disabled="status === 'sent'">
          {{ status === 'sent' ? 'Signed up' : 'Sign me up' }}
        </button>
      </div>

      <p class="form-footnote">Nothing is sent anywhere from this page. The roster is kept by
        the organisers, and the spots left against each session are updated by hand on the
        Monday before a session.</p>
    </form>
  </div>
</template>
