export default {
  computed: {
    $_app_status: {
      get () { return this.$store.getters['app/status'] },
      set (newStatus) { this.$store.dispatch('app/setStatus', newStatus) }
    },
    $_app_aboutDialog: {
      get () { return this.$store.getters['app/aboutDialog'] },
      set (value) { this.$store.dispatch('app/setAboutDialog', value) }
    },
    $_app_configDialog: {
      get () { return this.$store.getters['app/configDialog'] },
      set (value) { this.$store.dispatch('app/setConfigDialog', value) }
    }
  },
  methods: {
    $_app_toggleNavigationDrawer () {
      this.$store.dispatch('app/toggleNavigationDrawer')
    }
  }
}
