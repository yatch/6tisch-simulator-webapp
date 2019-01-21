<template>
<v-dialog v-model="$_app_shutdownDialog" persistent max-width="400">
  <v-card>
    <v-layout>
      <v-card-title class="title" primary-title>
        Shutdown the backend server?
      </v-card-title>
    </v-layout>
    <v-layout align-center justify-center row>
      <v-card-actions>
        <v-btn @click.stop="$_app_shutdownDialog = false">
          Cancel
        </v-btn>
        <v-btn @click.stop="shutdown()"  color="error">
          Yes, do it now
        </v-btn>
      </v-card-actions>
    </v-layout>
  </v-card>
</v-dialog>
</template>

<script>
import App from '@/mixins/App'

export default {
  mixins: [App],
  methods: {
    shutdown () {
      this.$_app_shutdownDialog = false
      this.$_app_autoReload = false
      this.$_eel.shutdown_backend()()
    }
  }
}
</script>
