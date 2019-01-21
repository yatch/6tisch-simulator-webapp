export default {
  computed: {
    $_app_status: {
      get () { return this.$store.getters['app/status'] },
      set (newStatus) { this.$store.dispatch('app/setStatus', newStatus) }
    },
    $_app_shutdownDialog: {
      get () { return this.$store.getters['app/shutdownDialog'] },
      set (value) { this.$store.dispatch('app/setShutdownDialog', value) }
    },
    $_app_autoReload: {
      get () { return this.$store.getters['app/autoReload'] },
      set (value) { this.$store.dispatch('app/setAutoReload', value) }
    },
    $_app_aboutDialog: {
      get () { return this.$store.getters['app/aboutDialog'] },
      set (value) { this.$store.dispatch('app/setAboutDialog', value) }
    },
    $_app_settingsDialog: {
      get () { return this.$store.getters['app/settingsDialog'] },
      set (value) { this.$store.dispatch('app/setConfigDialog', value) }
    }
  },
  methods: {
    $_app_toggleNavigationDrawer () {
      this.$store.dispatch('app/toggleNavigationDrawer')
    }
  }
}
