export default {
  computed: {
    $_app_status: {
      get () { return this.$store.getters['app/status'] },
      set (newStatus) { this.$store.dispatch('app/setStatus', newStatus) }
    }
  },
  methods: {
    $_app_toggleNavigationDrawer () {
      this.$store.dispatch('app/toggleNavigationDrawer')
    }
  }
}
