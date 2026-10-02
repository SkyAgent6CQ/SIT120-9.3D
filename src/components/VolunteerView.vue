<script setup>
import shiftTimeline from '../assets/images/shift-timeline.svg'

const emit = defineEmits(['navigate'])

const roles = [
  { name: 'Collection run', when: '12:30pm to 2:15pm', what: 'Van run to FareShare and two bakeries', lifting: 'Heavy', people: '2, one driver' },
  { name: 'Set-up', when: '2:30pm to 4:00pm',what: 'Lay out crates, sort stock, check dates', lifting: 'Some', people: '3' },
  { name: 'Crate host', when: '3:45pm to 5:15pm', what: 'Stay with two crates and keep them full', lifting: 'Light', people: '3' },
  { name: 'Table and limit', when: '3:45pm to 5:15pm', what: 'Call the limit, let people through, count heads', lifting: 'None', people: '1' },
  { name: 'Pack down', when: '5:15pm to 6:00pm', what: 'Stack crates, sweep the bay, load the van', lifting: 'Heavy', people: '4' }
]

const needs = [
  { title: 'A second driver', text: 'One person currently does every collection run. A full Australian or overseas licence held for a year is enough, and the van is an automatic.' },
  { title: 'Someone at the table', text: 'Once the queue passes sixty people it needs two, so the head count does not fall apart while questions are being answered.' },
  { title: 'Bags, in bulk', text: 'Students forget. Spare tote bags and unused shopping bags are worth more to a session than tinned food, which we already have plenty of.' }
]
</script>

<template>
  <section class="page-intro" aria-labelledby="intro-heading">
    <div class="wrap">
      <h1 id="intro-heading">Help out</h1>
      <p class="lead">A session needs eight people. Six turned up last fortnight, so the queue
        waited twenty minutes longer than it should have.</p>
      <p>You do not need to belong to the church, commit to every fortnight or know anyone
        already volunteering. Most people who help are students who came for the food first.</p>
    </div>
  </section>

  <section class="shift" aria-labelledby="shift-heading">
    <div class="wrap shift-inner">
      <div class="shift-text">
        <h2 id="shift-heading">How a session runs</h2>
        <p>The whole thing takes five and a half hours end to end, but almost nobody stays for
          all of it. Pick the part that fits around your Saturday and tell a volunteer which
          one you are taking.</p>
        <p class="bring-note">The shift most often short of people is pack down at 5:15pm. It
          is also the shortest.</p>
      </div>
      <figure class="figure shift-figure">
        <img :src="shiftTimeline" width="480" height="380"
          alt="Timeline of a session: the collection run leaves at 12:30pm, crates and table go out at 2:30pm, the queue moves from 4:00pm, and pack down starts at 5:15pm.">
        <figcaption>A full Saturday, from the first van run to the last crate stacked.</figcaption>
      </figure>
    </div>
  </section>

  <section class="roles" aria-labelledby="roles-heading">
    <div class="wrap">
      <h2 id="roles-heading">Roles on the day</h2>
      <p>Every role below is filled by whoever turns up. Nothing needs training beforehand,
        and a volunteer walks you through your role in the first five minutes. Once you know
        which one suits you,
        <a href="#signup" @click.prevent="emit('navigate', 'volunteer', 'signup')">put your name down for a session</a>.</p>

      <table class="table-stack roster-table">
        <caption>What each role involves, when it runs and how much lifting it needs</caption>
        <thead>
          <tr>
            <th scope="col">Role</th>
            <th scope="col">When</th>
            <th scope="col">What you do</th>
            <th scope="col">Lifting</th>
            <th scope="col">People needed</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="role in roles" :key="role.name">
            <th scope="row" data-label="Role">{{ role.name }}</th>
            <td data-label="When">{{ role.when }}</td>
            <td data-label="What you do">{{ role.what }}</td>
            <td data-label="Lifting">{{ role.lifting }}</td>
            <td data-label="People needed">{{ role.people }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <section class="cards" aria-labelledby="needs-heading">
    <div class="wrap">
      <h2 id="needs-heading">What would help most</h2>
      <ul class="card-list">
        <li v-for="need in needs" :key="need.title" class="card">
          <article>
            <h3>{{ need.title }}</h3>
            <p>{{ need.text }}</p>
          </article>
        </li>
      </ul>
    </div>
  </section>

  <section class="signup" aria-labelledby="joining-heading">
    <div class="wrap">
      <h2 id="joining-heading">Joining a session</h2>
      <p class="lead">Put your name against a Saturday in the form below. It lists every
        remaining session with the spots still open on each, so you can take the one that is
        short rather than the one that is already covered.</p>
      <p>There is no induction and no minimum. One session a trimester is useful. All of it is
        unpaid volunteer work for a registered charity, so if you are on a student visa, check
        your own visa conditions before your first shift. If you would rather not fill anything
        in, email <a href="mailto:hello@withamission.org.au">hello@withamission.org.au</a> with
        the date and the role, or turn up at 3:30pm and say you are there to help.</p>
    </div>
  </section>
</template>
