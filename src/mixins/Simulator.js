export default {
  computed: {
    $_simulator_connectionStatus () {
      return this.$store.getters['simulator/connectionStatus']
    },
    $_simulator_operationalStatus () {
      return this.$store.getters['simulator/operationalStatus']
    },
    $_simulator_defaultSettings: {
      get () { return this.$store.getters['simulator/defaultSettings'] },
      set (settings) {
        this.$store.dispatch('simulator/saveDefaultSettings', settings)
      }
    },
    $_simulator_runningSettings: {
      get () { return this.$store.getters['simulator/runningSettings'] },
      set (settings) {
        this.$store.dispatch('simulator/updateRunningSettings', settings)
      }
    },
    $_simulator_availableSFs () {
      return this.$store.getters['simulator/availableSFs']
    },
    $_simulator_availableConnectivities () {
      return this.$store.getters['simulator/availableConnectivities']
    },
    $_simulator_availableTraceFiles () {
      return this.$store.getters['simulator/availableTraceFiles']
    },
    $_simulator_gitInfo () {
      return this.$store.getters['simulator/gitInfo']
    },
    $_simulator_crashReport () {
      return this.$store.getters['simulator/crashReport']
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
    },
    $_simulator_clearCrashReport () {
      this.$store.dispatch('simulator/clearCrashReport')
    }
  }
}
