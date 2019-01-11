export default {
  computed: {
    $_simulation_elapsedMinutes () {
      return this.$store.getters['simulation/elapsedMinutes']
    },
    $_simulation_lastlastAppPacketEvent () {
      return this.$store.getters['simulation/lastAppPacketEvent']
    },
    $_simulation_lastTschCellAllocationEvent () {
      return this.$store.getters['simulation/lastTschCellAllocationEvent']
    }
  }
}
