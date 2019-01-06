<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>Vuetify</span>
        <span class="font-weight-light">MATERIAL DESIGN</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        flat
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
      >
        <span class="mr-2">Latest Release</span>
      </v-btn>
    </v-toolbar>

    <v-content>
      <AutoReload/>
    </v-content>
  </v-app>
</template>

<script>
import AutoReload from './components/AutoReload'

export default {
  name: 'App',
  components: {
    AutoReload
  },
  data () {
    return {
      //
    }
  },
  created () {
    document.addEventListener('DOMContentLoaded', () => {
      // window.eel is not initialized until DOMContentLoaded is
      // fired. checking window.eel in an DOMContentLoaded event
      // handler may work better than doing that in created() directly
      if (window.eel === undefined) {
        this.$store.dispatch('changeConnectionState', 'disconnected')
      } else {
        this.$store.dispatch('changeConnectionState', 'connected')
        window.eel._websocket.addEventListener(
          'close',
          () => {
            this.$store.dispatch('changeConnectionState', 'disconnected')
          }
        )
      }
    })
  }
}
</script>
