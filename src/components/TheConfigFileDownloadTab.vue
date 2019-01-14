<template>
<v-card>
  <v-card-text class="title text-xs-center">Click to Start Downloading...</v-card-text>
  <v-layout justify-center row fill-height>
    <v-btn
      icon
      href="/config.json"
      @click="$_app_settingsDialog = false"
      >
      <v-icon large>save_alt</v-icon>
    </v-btn>
  </v-layout>
</v-card>
</template>

<script>
import App from '@/mixins/App'
export default {
  mixins: [App]
}
</script>
