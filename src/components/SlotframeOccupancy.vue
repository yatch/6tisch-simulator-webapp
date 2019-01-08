<template>
<v-card width="200px">
  <v-tooltip bottom>
    <div slot="activator">
      <v-card-title>Slotframe Occupancy</v-card-title>
      <v-card-text>
        <p><span class="title">Max: {{ max }} </span>cells</p>
        <p><span class="title">Min: {{ min }} </span>cells</p>
      </v-card-text>
    </div>
    <span>
      The number of scheduled cells in one slotframe.
    </span>
  </v-tooltip>
</v-card>
</template>

<script>
export default {
  computed: {
    numCellsArray () {
      return this.$store.state.motes.map(mote => mote.numCells)
    },
    max () {
      if (this.$store.state.motes.length === 0) {
        return 'N/A'
      } else {
        return Math.max.apply(null, this.numCellsArray)
      }
    },
    min () {
      if (this.$store.state.motes.length === 0) {
        return 'N/A'
      } else {
        return Math.min.apply(null, this.numCellsArray)
      }
    }
  }
}
</script>
