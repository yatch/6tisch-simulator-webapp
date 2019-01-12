<template>
<v-navigation-drawer
  fixed
  temporary
  v-model="drawer"
  mobile-break-point="false"
  right
  app
  >
  <v-list dense>
    <v-list-tile
      v-for="item in items"
      :to="item.path"
      :key="item.name"
      @click.stop="item.action"
      >
      <v-list-tile-action>
        <v-icon>{{ item.icon }}</v-icon>
      </v-list-tile-action>
      <v-list-tile-content>
        <v-list-tile-title>
          {{ item.name }}
        </v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>
  </v-list>
</v-navigation-drawer>
</template>

<script>
import App from '@/mixins/App'

export default {
  mixins: [App],
  data () {
    return {
      items: [
        {
          name: 'Dashboard',
          path: '/',
          icon: 'home',
          action: () => { this.close() },
          disabled: false
        },
        {
          name: 'Settings',
          path: undefined,
          icon: 'settings',
          action: () => {
            this.$_app_settingsDialog = true
            this.close()
          },
          disabled: () => { this.$_app_status === 'ready' }
        },
        {
          name: 'Reload',
          path: undefined,
          icon: 'refresh',
          action: () => {
            location.reload()
          }
        },
        {
          name: 'About',
          path: undefined,
          icon: 'info',
          action: () => {
            this.$_app_aboutDialog = true
            this.close()
          },
          disabled: false
        }
      ]
    }
  },
  computed: {
    drawer: {
      get () { return this.$store.getters['app/navigationDrawer'] },
      set (value) {
        if (value !== this.drawer) {
          this.$store.dispatch('app/toggleNavigationDrawer')
        }
      }
    },
  },
  methods: {
    close () { this.drawer = false }
  }
}
</script>
