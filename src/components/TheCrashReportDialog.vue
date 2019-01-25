<template>
<v-dialog
  v-model="dialog"
  persistent
  width="600px"
  >
  <v-card>
    <v-flex xs12>
      <v-container
        grid-list-md
        >
        <v-layout
          row
          wrap
          fill-height
          >
        </v-layout>
        <v-card-title class="headline">Simulator Crashed :-(</v-card-title>
        <v-card-text>
          <div class="title">{{ message }}</div>
          <v-textarea
            v-model="trace"
            auto-grow
            readonly
            />
          <div class="body-2">A crash report is available at {{ crashReportPath }}</div>
        </v-card-text>
      </v-container>
    </v-flex>
    <v-card-actions>
      <v-spacer/>
      <v-btn @click.stop="close">
        OK
      </v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
</template>

<script>
import Simulator from '@/mixins/Simulator'

export default {
  mixins: [Simulator],
  computed: {
    crashReport () {
      if (this.$_simulator_crashReport === null) {
        return {
          trace: null,
          message: null,
          crashReportPath: null
        }
      } else {
        return this.$_simulator_crashReport
      }
    },
    dialog () { return this.crashReport.message !== null },
    trace () { return this.crashReport.trace },
    message () { return this.crashReport.message },
    crashReportPath () { return this.crashReport.crash_report_path }
  },
  methods: {
    close () { this.$_simulator_clearCrashReport() }
  }
}
</script>
