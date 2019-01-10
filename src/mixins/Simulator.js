export default {
  computed: {
    $_simulator_connectionStatus () {
      return this.$store.getters['simulator/connectionStatus']
    },
    $_simulator_operationalStatus () {
      return this.$store.getters['simulator/operationalStatus']
    },
    $_simulator_settings () {
      return this.$store.getters['simulator/settings']
    }
  },
  methods: {
    $_simulator_start () {
      return this.$store.dispatch('simulator/start', this.$_eel)
    },
    $_simulator_pause () {
      return this.$store.dispatch('simulator/pause', this.$_eel)
    },
    $_simulator_resume () {
      return this.$store.dispatch('simulator/resume', this.$_eel)
    },
    $_simulator_abort () {
      return this.$store.dispatch('simulator/abort', this.$_eel)
    }
  }
}
