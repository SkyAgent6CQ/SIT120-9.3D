<script setup>
import crates800 from '../assets/images/crates-800.jpg'
import crates1600 from '../assets/images/crates-1600.jpg'
import carryBag from '../assets/images/carry-bag.svg'

// The schedule rows come from App.vue as a prop, from the same array the
// sign-up form uses, so the two can never disagree about a date.
defineProps({
  sessions: { type: Array, required: true }
})

// navigate(view, sectionId): asks App.vue to switch page and scroll to a section.
const emit = defineEmits(['navigate'])

// Vite fingerprints imported images, so the srcset has to be built from the
// imported URLs rather than typed as plain file names.
const cratesSrcset = `${crates800} 800w, ${crates1600} 1600w`
</script>

<template>
  <section class="session" aria-labelledby="session-heading">
    <div class="wrap session-inner">
      <div class="session-when">
        <h1 id="session-heading">Next session</h1>
        <p class="date">Saturday 12 September</p>
        <p class="time">4:00pm - until the crates are empty</p>
      </div>
      <div class="session-where">
        <p class="countdown">That's in 6 days</p>
        <p class="place">Lower level, MA Car Park<br>
          Deakin Burwood, next to Res Reception</p>
        <p class="session-action">
          <a class="button" href="#entrance" @click.prevent="emit('navigate', 'expect', 'entrance')">How to find the entrance</a>
        </p>
      </div>
    </div>
  </section>

  <section class="glance" aria-labelledby="glance-heading">
    <div class="wrap">
      <h2 id="glance-heading">What one fortnight looks like</h2>
      <p>The whole delivery from a session in August, sorted into crates before the doors
        opened: cereal, long-life milk, rice, sauce, tinned vegetables and tinned fruit. Bread
        and frozen meals come out of the van last, so they are not in the photo.</p>
      <figure class="figure figure-wide">
        <img :src="crates1600" :srcset="cratesSrcset"
          sizes="(min-width: 64rem) 55rem, 92vw"
          width="1600" height="700"
          alt="Fifteen black crates laid out in two rows on the car park floor, filled with cereal boxes, long-life milk, bags of rice, sauce bottles and tinned food.">
        <figcaption>Photographed at the August session by one of the volunteers.</figcaption>
      </figure>
    </div>
  </section>

  <section class="bring" aria-labelledby="bring-heading">
    <div class="wrap bring-inner">
      <div class="bring-text">
        <h2 id="bring-heading">Bring a carry bag</h2>
        <p>Nothing is bagged for you. Students who forget end up carrying tins back to their
          room in their arms, so put a tote or backpack by the door the night before.</p>
        <p class="bring-note">Supplies run down as the queue moves, so come at 4:00pm rather
          than at 5:00pm.</p>
      </div>
      <figure class="figure bring-figure">
        <img :src="carryBag" width="480" height="400"
          alt="A tote bag packed with bread, a tin of vegetables and fresh greens.">
        <figcaption>About two crates' worth, in a bag someone remembered to bring.</figcaption>
      </figure>
    </div>
  </section>

  <section class="schedule" aria-labelledby="schedule-heading">
    <div class="wrap">
      <h2 id="schedule-heading">Every session this trimester</h2>
      <p>Sessions run every second Saturday. Volunteers collect the donations themselves, so
        a date occasionally moves. This table is updated the Monday before each session. If you
        want to help at one of them,
        <a href="#signup" @click.prevent="emit('navigate', 'volunteer', 'signup')">sign up for a session</a>.</p>

      <!-- Same stacking-table pattern as 5.3D: cards on a phone (each cell
           labels itself from data-label), a real table from 48rem. -->
      <table class="table-stack schedule-table">
        <caption>Session dates, times and locations to the end of Trimester 2</caption>
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Doors</th>
            <th scope="col">Where</th>
            <th scope="col">Extra that week</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="session in sessions" :key="session.id">
            <th scope="row" data-label="Date">{{ session.day }}</th>
            <td data-label="Doors">{{ session.doors }}</td>
            <td data-label="Where">{{ session.where }}</td>
            <td data-label="Extra that week">{{ session.extra }}</td>
            <td data-label="Status">{{ session.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <section class="eligibility" aria-labelledby="eligibility-heading">
    <div class="wrap">
      <h2 id="eligibility-heading">Who can come</h2>
      <p class="lead">If you live in a Deakin Residential Services building at Burwood, you are
        welcome. That is the whole requirement.</p>
      <p>There is no sign-up, no means test and no proof of income. You do not need to bring
        your student card, register in advance or explain why you have come. Turn up, join the
        queue, take your items and go.</p>
    </div>
  </section>

  <section class="cards" aria-labelledby="cards-heading">
    <div class="wrap">
      <h2 id="cards-heading">Before your first visit</h2>
      <ul class="card-list">
        <li class="card">
          <article>
            <h3>What is usually there</h3>
            <p>Frozen meals, cooked chicken, bread and pastries from local bakeries, fresh fruit,
              long-life milk, pasta and rice, tinned vegetables, and hygiene packs. Stock is
              donated, so it changes every fortnight.</p>
          </article>
          <p class="card-link"><a href="#available" @click.prevent="emit('navigate', 'expect', 'available')">See the full list</a></p>
        </li>
        <li class="card">
          <article>
            <h3>How many items you can take</h3>
            <p>A volunteer sets an item limit at the start of each session based on how much
              arrived that morning. It is usually two or three items per crate. The limit is
              announced in the queue, never before.</p>
          </article>
          <p class="card-link"><a href="#queue" @click.prevent="emit('navigate', 'expect', 'queue')">How the queue works</a></p>
        </li>
        <li class="card">
          <article>
            <h3>Who runs it</h3>
            <p>Earthen Vessels Church runs the service and covers the cost. Deakin University and
              Residential Services pass on the dates but are not affiliated with it. Nobody will
              preach at you in the queue.</p>
          </article>
          <p class="card-link"><a href="#volunteer" @click.prevent="emit('navigate', 'volunteer')">Help out at a session</a></p>
        </li>
      </ul>
    </div>
  </section>
</template>
