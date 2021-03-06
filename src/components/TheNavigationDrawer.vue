<template>
<div>
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
        :disabled="item.disabled"
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
  <TheShutdownDialog/>
</div>
</template>

<script>
import App from '@/mixins/App'
import Simulator from '@/mixins/Simulator'
import TheShutdownDialog from '@/components/TheShutdownDialog'

export default {
  components: { TheShutdownDialog },
  mixins: [App, Simulator],
  data () {
    return {
      items: [
        {
          name: 'Dashboard',
          path: '/',
          icon: 'home',
          action: () => { this.close() },
          disabled: true
        },
        {
          name: 'Settings',
          path: undefined,
          icon: 'settings',
          action: () => {
            this.$_app_settingsDialog = true
            this.close()
          },
          disabled: true
        },
        {
          name: 'Results',
          path: '/results',
          icon: 'storage',
          action: () => { this.close() },
          disabled: true
        },
        {
          name: 'Trace Files',
          path: '/traces',
          icon: 'folder',
          action: () => { this.close() },
          disabled: true
        },
        {
          name: 'Reload',
          path: undefined,
          icon: 'refresh',
          action: () => {
            location.reload()
          },
          disabled: true
        },
        {
          name: 'Shutdown',
          path: undefined,
          icon: 'power_settings_new',
          action: () => {
            this.$_app_shutdownDialog = true
            this.close()
          },
          disabled: true
        },
        {
          name: 'About',
          path: undefined,
          icon: 'info',
          action: () => {
            this.$_app_aboutDialog = true
            this.close()
          },
          disabled: true
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
  watch: {
    $_app_status (newStatus) {
      this.items.forEach(item => {
        if (item.name === 'Dashboard' || item.name === 'About') {
          // these are always "enabled"
          item.disabled = false
        } else {
          if (newStatus === 'ready') {
            item.disabled = false
          } else {
            item.disabled = true
          }
        }
      })
    },
    $_simulator_operationalStatus (newStatus) {
      this.items.forEach(item => {
        if (item.name === 'Dashboard' || item.name === 'About') {
          // these are always "enabled"
          item.disabled = false
        } else {
          if (newStatus === 'ready') {
            item.disabled = false
          } else {
            item.disabled = true
          }
        }
      })
    },
    $_simulator_connectionStatus (newStatus) {
      this.items.forEach(item => {
        if (newStatus === 'disconnected') {
          if (item.name === 'Reload') {
            item.disabled = false
          } else {
            item.disabled = true
          }
        }
      })
    }
  },
  methods: {
    close () { this.drawer = false }
  }
}
</script>
