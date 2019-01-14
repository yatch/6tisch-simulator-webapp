<template>
<div>
  <v-card>
    <v-layout justify-center row>
      <v-flex xs10>
        <v-alert
          :value="alert"
          outline
          type="error"
          >
          Upload Failed: {{ errorMessage }}
        </v-alert>
      </v-flex>
    </v-layout>
    <v-card-text class="text-xs-center"> {{ selectedFileName }} </v-card-text>
    <v-layout
      align-center
      justify-center
      row
      wrap
      fill-height
      >
      <v-btn
        @click="selectFile"
        >
        Select config.json on your computer
      </v-btn>
      <input
        type="file"
        ref="fileSelector"
        multiple="false"
        accept="application/json,.json"
        @change="changeSelectedFile()"
        hidden
        />
      <v-btn @click="$_app_settingsDialog = false">Cancel</v-btn>
    </v-layout>
  </v-card>
  <v-dialog
    v-model="progress"
    persistent
    width="300"
    >
    <v-card
      color="primary"
      dark
      >
      <v-card-text>
        Please stand by
        <v-progress-linear
          indeterminate
          color="white"
          class="mb-0"
          ></v-progress-linear>
    </v-card-text>
  </v-card>
</v-dialog>
</div>
</template>

<script>
import App from '@/mixins/App'
import Simulator from '@/mixins/Simulator'

export default {
  mixins: [App, Simulator],
  data () {
    return {
      progress: false,
      errorMessage: null,
      selectedFile: null
    }
  },
  computed: {
    selector () { return this.$refs.fileSelector.value },
    alert () { return this.errorMessage !== null },
    selectedFileName () {
      if (this.selectedFile === null) {
        return "No file is selected"
      } else {
        return this.selectedFile.name
      }
    }
  },
  methods: {
    selectFile () { this.$refs.fileSelector.click() },
    changeSelectedFile () {
      if (this.$refs.fileSelector.files.length !== 1) {
        return
      }
      this.errorMessage = null
      this.selectedFile = this.$refs.fileSelector.files[0]
      this.uploadConfigFile()
    },
    uploadConfigFile () {
      const reader = new FileReader()
      this.progress = true
      reader.onload = (event) => {
        this.progress = false
        this.$_eel.put_default_config(event.target.result)((ret) => {
          this.progress = false
          if (ret.config === null) {
            this.errorMessage = ret.message
          } else {
            this.$_simulator_defaultSettings = ret.config.settings
            this.$_app_settingsDialog = false
          }
          this.selectedFile = null
        })
      }
      reader.readAsText(this.selectedFile)
    }
  }
}
</script>
