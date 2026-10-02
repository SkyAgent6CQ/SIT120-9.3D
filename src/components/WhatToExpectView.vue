<script setup>
import routeMap from '../assets/images/route-to-entrance.svg'

const emit = defineEmits(['navigate'])

// The stock table is data rather than markup, so a new row is one line here.
const stock = [
  { item: 'Frozen meals', often: 'Every session', counts: 'Yes', gone: '4:20pm' },
  { item: 'Cooked chicken', often: 'Most sessions', counts: 'Yes', gone: '4:15pm' },
  { item: 'Bread, rolls and pastries', often: 'Every session', counts: 'No', gone: '4:45pm' },
  { item: 'Fresh fruit and vegetables', often: 'Every session', counts: 'Yes', gone: '4:30pm' },
  { item: 'Long-life milk and cereal', often: 'Most sessions', counts: 'Yes', gone: '5:00pm' },
  { item: 'Pasta, rice and sauce sachets', often: 'Every session', counts: 'Yes', gone: 'Usually lasts' },
  { item: 'Tinned vegetables and noodle cups', often: 'Every session', counts: 'Yes', gone: 'Usually lasts' },
  { item: 'Toiletries and hygiene packs', often: 'Every second session', counts: 'No', gone: 'Usually lasts' },
  { item: 'Soup in winter, barbecue in summer', often: 'When volunteers can arrange it', counts: 'No', gone: '5:15pm' }
]
</script>

<template>
  <section class="page-intro" aria-labelledby="intro-heading">
    <div class="wrap">
      <h1 id="intro-heading">What to expect</h1>
      <p class="lead">Everything a first-time visitor asks a volunteer, answered before you
        walk down there. The next session is Saturday 12 September at 4:00pm.</p>
    </div>
  </section>

  <section class="steps" aria-labelledby="steps-heading">
    <div class="wrap">
      <h2 id="steps-heading">Before you come</h2>
      <ol class="step-list">
        <li>
          <h3>Pack a carry bag</h3>
          <p>A tote, a backpack or a couple of shopping bags. Items are handed over loose and
            tins are heavier than they look.</p>
        </li>
        <li>
          <h3>Aim to arrive at 4:00pm</h3>
          <p>The queue is let through from four. Fresh fruit, bread and frozen meals are
            usually gone within the first half hour.</p>
        </li>
        <li>
          <h3>Expect the limit to change</h3>
          <p>How many items you can take is decided on the day, once volunteers see how much
            has been donated. It is announced when the queue starts moving.</p>
        </li>
      </ol>
    </div>
  </section>

  <section class="available" id="available" aria-labelledby="available-heading">
    <div class="wrap">
      <h2 id="available-heading">What is usually available</h2>
      <p>Stock comes from FareShare, local bakeries and supermarket surplus, so no two sessions
        are the same. Nothing in this table is promised, but most of it turns up most
        fortnights.</p>

      <p class="table-hint">Scroll the table sideways to see when each item usually runs out.</p>

      <!-- This table keeps its columns at every width and scrolls inside its own
           box instead, so the page itself never scrolls sideways. -->
      <div class="table-scroll" tabindex="0" role="region" aria-labelledby="available-heading">
        <table class="stock-table">
          <caption>How often each item arrives, whether it counts toward your limit, and how
            quickly it goes</caption>
          <thead>
            <tr>
              <th scope="col">Item</th>
              <th scope="col">How often it arrives</th>
              <th scope="col">Counts toward the limit</th>
              <th scope="col">Usually gone by</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in stock" :key="row.item">
              <th scope="row">{{ row.item }}</th>
              <td>{{ row.often }}</td>
              <td>{{ row.counts }}</td>
              <td>{{ row.gone }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>This is surplus food that would otherwise be thrown out. Taking it is not taking it
        from someone else.</p>
    </div>
  </section>

  <section class="entrance" id="entrance" aria-labelledby="entrance-heading">
    <div class="wrap entrance-inner">
      <div class="entrance-text">
        <h2 id="entrance-heading">Finding the entrance</h2>
        <p class="lead">Start at Res Reception. The lower car park entrance is on your left as
          you face the LC building, and you walk up the ramp to reach it.</p>
        <ol class="step-list step-list-stacked">
          <li>
            <h3>Walk to Res Reception</h3>
            <p>Anyone living on campus already knows this building. It is the fixed point for
              these directions, because "MA Car Park" on its own means nothing to
              most first-years.</p>
          </li>
          <li>
            <h3>Take the ramp up, not the stairs down</h3>
            <p>The session is on the lower level. If you can see sky, you have gone the wrong
              way.</p>
          </li>
          <li>
            <h3>Follow the crates</h3>
            <p>Black crates are laid out in a long row on the concrete under the lights, with a
              folding table at the near end. Volunteers wear green aprons.</p>
          </li>
        </ol>
      </div>
      <figure class="figure entrance-figure">
        <img :src="routeMap" width="640" height="400"
          alt="Plan of the walk: from Res Reception, turn right and go up the ramp, then left into the lower level where the crates and table are laid out. The roof level above is where a map pin usually drops you.">
        <figcaption>A dropped map pin lands on the roof, so this is the route on foot instead.</figcaption>
      </figure>
    </div>
  </section>

  <section class="queue" id="queue" aria-labelledby="queue-heading">
    <div class="wrap">
      <h2 id="queue-heading">How the queue works</h2>
      <p>Line up along the painted bay markings. A volunteer calls the item limit, then lets
        people through a few at a time so nobody is crowding the crates.</p>
      <p>Take your items from each crate yourself. If something has run out, it has run out,
        and there is no back stock in a van. Please do not push in or send a friend to collect
        a second share while you queue again, because the last people through are usually the
        ones who most needed the food.</p>
    </div>
  </section>

  <section class="who" id="who" aria-labelledby="who-heading">
    <div class="wrap">
      <h2 id="who-heading">Who we are</h2>
      <p>With a Mission is run by volunteers from Earthen Vessels Church, who collect the
        donations, drive them in and set up from about 2:30pm.</p>
      <p>You will not be preached at, asked to sign anything or added to a mailing list.
        Deakin Residential Services pass on the session dates by email, but the university is
        not affiliated with the service and does not fund it.</p>
      <p class="session-action">
        <a class="button" href="#volunteer" @click.prevent="emit('navigate', 'volunteer')">What helping out involves</a>
      </p>
    </div>
  </section>
</template>
