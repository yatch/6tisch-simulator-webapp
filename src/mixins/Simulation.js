export default {
  computed: {
    $_simulation_elapsedMinutes () {
      return this.$store.getters['simulation/elapsedMinutes']
    }
  }
}
