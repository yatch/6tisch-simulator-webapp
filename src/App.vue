<template>
  <v-app>
    <ToolBar/>
    <NavigationDrawer/>
    <AutoReload/>
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
import ToolBar from './components/ToolBar'
import NavigationDrawer from './components/NavigationDrawer'
import AutoReload from './components/AutoReload'

export default {
  name: 'App',
  components: {
    ToolBar,
    NavigationDrawer,
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
