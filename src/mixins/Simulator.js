export default {
  computed: {
    $_simulator_connectionStatus () {
      return this.$store.getters['simulator/connectionStatus']
    },
    $_simulator_operationalStatus () {
      return this.$store.getters['simulator/operationalStatus']
    }
  }
}
