export default {
  methods: {
    $_app_toggleNavigationDrawer () {
      this.$store.dispatch('app/toggleNavigationDrawer')
    }
  }
}
