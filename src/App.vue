<template>
<v-app>
  <TheToolbar/>
  <TheNavigationDrawer/>
  <v-content fluid>
    <v-layout align-center justify-center row wrap fill-height>
      <router-view/>
    </v-layout>
  </v-content>
  <TheFooter/>
  <TheAboutDialog/>
  <TheSettingsDialog/>
</v-app>
</template>

<script>
import TheToolbar from '@/components/TheToolbar'
import TheNavigationDrawer from '@/components/TheNavigationDrawer'
import TheFooter from '@/components/TheFooter'
import TheAboutDialog from '@/components/TheAboutDialog'
import TheSettingsDialog from '@/components/TheSettingsDialog'

export default {
  name: 'App',
  components: {
    TheToolbar,
    TheNavigationDrawer,
    TheFooter,
    TheAboutDialog,
    TheSettingsDialog
  },
  data () {
    return {
      //
    }
  },
  created () {
    // Websocket for Eel is instantiated by Eel on DOMContentLoaded
    // event and its event handler is expected to have already been
    // added. So, when our initializeEel() is called, the websocket
    // should be available.
    document.addEventListener('DOMContentLoaded', this.initializeEel)
  },
  methods: {
    initializeEel () {
      if (this.$_eel === undefined) {
        this.eelCloseHandler()
      } else {
        const websocket = this.$_eel._websocket
        const that = this
        if (websocket.readyState === websocket.CONNECTING) {
          websocket.addEventListener('open', () => { that.eelOpenHandler() })
        } else if (websocket.readyState === websocket.OPEN) {
          this.eelOpenHandler()
        }
        if ((websocket.readyState === websocket.CLOSING) ||
            (websocket.readyState === websocket.CLOSED)) {
          this.eelCloseHandler()
        } else {
          websocket.addEventListener('close', () => { that.eelCloseHandler() })
        }
      }
    },
    eelOpenHandler () {
      this.$store.dispatch('simulator/connect')
      this.$_eel.get_default_settings()(defaultSettings => {
        this.$store.dispatch('simulator/saveDefaultSettings', defaultSettings)
      })
      this.$_eel.get_available_scheduling_functions()(availableSFs => {
        this.$store.dispatch('simulator/setAvailableSFs', availableSFs)
      })
      this.$_eel.get_available_connectivities()(availableConnectivities => {
        this.$store.dispatch('simulator/setAvailableConnectivities',
                             availableConnectivities)
      })
      this.$_eel.get_git_info()(gitInfo => {
        this.$store.dispatch('simulator/setGitInfo', gitInfo)
      })
    },
    eelCloseHandler() {
      this.$store.dispatch('simulator/disconnect')
    }
  }
}
</script>
