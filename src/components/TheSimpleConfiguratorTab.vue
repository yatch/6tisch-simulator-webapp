<template>
<v-card>
  <v-card-text>
    <v-list>
      <v-list-tile
        v-for="item in items"
        :key="item.name"
        :disabled="item.disabled"
        >
        <v-list-tile-title>{{ item.title }}</v-list-tile-title>
        <v-text-field
          v-if="item.type === 'number'"
          v-model.number="item.model"
          single-line
          type="number"
          :disabled="item.disabled"
          :rules="item.rules"
          reverse
          />
        <v-select
          v-else
          v-model="item.model"
          :items="item.selectItems"
          class="text-xs-right"
          :disabled="item.disabled"
          reverse
          />
      </v-list-tile>
    </v-list>
  </v-card-text>
  <v-card-actions>
    <v-spacer></v-spacer>
    <v-btn @click.stop="resetSettings" color="error">Reset</v-btn>
    <v-btn @click.stop="cancelSettings" color="">Cancel</v-btn>
    <v-btn
      @click.stop="saveSettings"
      color="primary"
      :disabled="disabledSave"
      >
      Save
    </v-btn>
  </v-card-actions>
</v-card>
</template>

<script>
import App from '@/mixins/App'
import Simulator from '@/mixins/Simulator'

export default {
  mixins: [App, Simulator],
  data () {
    return {
      items: [
        {
          name: 'sf_class',
          title: 'Scheduling Function',
          model: '',
          type: 'select',
          selectItems: [],
          disabled: false,
          ready: false
        },
        {
          name: 'conn_class',
          title: 'Connectivity Class',
          model: '',
          type: 'select',
          selectItems: [],
          disabled: false,
          ready: false
        },
        {
          name: 'conn_trace',
          title: 'Trace File',
          model: '',
          type: 'select',
          selectItems: [],
          disabled: true,
          ready: false
        },
        {
          name: 'exec_numMotes',
          title: 'Number of Motes',
          model: '',
          modelMax: Infinity,
          type: 'number',
          disabled: false,
          rules: [
            v => v !== "" || 'input is required',
            v => v > 0 || 'input must be larger than 0'
          ],
          ready: false
        },
        {
          name: 'exec_randomSeed',
          title: 'Random Seed',
          model: '',
          type: 'number',
          disabled: false,
          rules: [
            v => v !== "" || 'input is required'
          ],
          ready: false
        },
        {
          name: 'exec_numMinutes',
          title: 'Simulation Time (minutes)',
          model: '',
          modelMax: Infinity,
          type: 'number',
          disabled: false,
          rules: [
            v => v !== "" || 'input is required',
            v => v > 0 || 'input must be larger than 0',
            v => (v <= this.exec_numMinutes.modelMax ||
                  'input must not exceed '  + this.exec_numMinutes.modelMax)

          ],
          ready: false
        }
      ],
      exec_numMotes_backup: 0
    }
  },
  computed: {
    disabledSave () {
      if (this.items.every(item => { return item.ready === true })) {
        return false
      } else {
        return true
      }
    },
    sf_class () { return this.items[0] },
    conn_class () { return this.items[1] },
    conn_trace () { return this.items[2] },
    exec_numMotes () { return this.items[3] },
    exec_randomSeed () { return this.items[4] },
    exec_numMinutes () { return this.items[5] },
    exec_numSlotframesPerRun: {
      get () {
        if (this.$_simulator_runningSettings === null) {
          return 0
        } else {
          const settings = this.$_simulator_runningSettings
          return Math.ceil(this.exec_numMinutes_model *
                           60 /
                           settings.tsch_slotDuration /
                           settings.tsch_slotframeLength)
        }
      },
      set (numSlotframes) {
        const settings = this.$_simulator_runningSettings
        const minutes = Math.floor(numSlotframes *
                                   settings.tsch_slotframeLength *
                                   settings.tsch_slotDuration /
                                   60)
        return this.exec_numMinutes_model = minutes
      }
    },
    sf_class_model: {
      get () { return this.sf_class.model },
      set (v) { this.sf_class.model = v }
    },
    conn_class_model: {
      get () { return this.conn_class.model },
      set (v) { this.conn_class.model = v }
    },
    conn_trace_model: {
      get () { return this.conn_trace.model },
      set (v) { this.conn_trace.model = v },
    },
    exec_numMotes_model: {
      get () { return this.exec_numMotes.model },
      set (v) { this.exec_numMotes.model = v }
    },
    exec_randomSeed_model: {
      get () { return this.exec_randomSeed.model },
      set (v) { this.exec_randomSeed.model = v }
    },
    exec_numMinutes_model: {
      get () { return this.exec_numMinutes.model },
      set (v) { this.exec_numMinutes.model = v }
    },
    newSettings () {
      return Object.assign(
        this.$_simulator_runningSettings,
        {
          sf_class: this.sf_class_model,
          conn_class: this.conn_class_model,
          conn_trace: this.conn_trace_model,
          exec_numMotes: this.exec_numMotes_model,
          exec_randomSeed: this.exec_randomSeed_model,
          exec_numSlotframesPerRun: this.exec_numSlotframesPerRun
        }
      )
    }
  },
  watch: {
    sf_class_model (v)  { this.sf_class.ready = (v !== '') },
    conn_class_model (v)  {
      this.conn_class.ready = (v !== '')
      if (v === 'K7') {
        // this item is for the trace file
        this.conn_trace.disabled = false
        // select the first item in the options
        if (this.conn_trace.selectItems.length > 0) {
          this.conn_trace_model = this.conn_trace.selectItems[0].value
        }
        this.exec_numMotes.disabled = true
        if (this.conn_trace_mode === '') {
          this.conn_trace.ready = false
        } else {
          this.conn_trace.ready = true
        }
      } else {
        this.conn_trace.disabled = true
        this.conn_trace_model = ''
        this.exec_numMotes.disabled = false
        this.conn_trace.ready = true
      }
    },
    conn_trace_model (traceFilePath) {
      if (this.conn_class_model !== 'K7' || traceFilePath !== '') {
        this.conn_trace.ready = true
      } else {
        this.conn_trace.ready = false
      }

      if (traceFilePath === '') {
        if (this.exec_numMotes_backup > 0) {
          this.exec_numMotes_model = this.exec_numMotes_backup
          this.exec_numMotes_backup = 0
          this.exec_numMinutes.modelMax = Infinity
        }
      } else {
        this.exec_numMotes_backup = this.exec_numMotes_model
        this.exec_numMotes_model = this.getNumMotesFromTrace(traceFilePath)
        this.exec_numMinutes.modelMax = (
          this.getMaxExecNumMinuetsFromTrace(traceFilePath)
        )
      }
    },
    exec_numMotes_model (v) {
      this.exec_numMotes.ready = (v > 0 && v < this.exec_numMotes.modelMax)
    },
    exec_randomSeed_model (v) { this.exec_randomSeed.ready = (v !== '') },
    exec_numMinutes_model (v) {
      this.exec_numMinutes.ready = (v > 0 && v < this.exec_numMinutes.modelMax)
    },
    $_simulator_runningSettings (settings) {
      if (settings !== null) {
        this.sf_class_model = settings.sf_class
        this.conn_class_model = settings.conn_class
        this.exec_numMotes_model = settings.exec_numMotes
        this.exec_randomSeed_model = settings.exec_randomSeed
        this.exec_numSlotframesPerRun = settings.exec_numSlotframesPerRun
      }
    },
    $_simulator_availableSFs (value) {
      if (value === null) {
        this.sf_class.selectItems = []
      } else {
        this.sf_class.selectItems = value
      }
    },
    $_simulator_availableConnectivities (value) {
      if (value === null) {
        this.conn_class.selectItems = []
      } else {
        this.conn_class.selectItems = value
      }
    },
    $_simulator_availableTraceFiles (value) {
      if (value === null) {
        this.conn_trace.selectItems = []
      } else {
        this.conn_trace.selectItems = value.map(v => {
          let text;
          if (v.file_name.match(/.k7.gz$/)) {
            text = v.file_name.split('.').slice(0, -2).join('.')
          } else {
            text = v.file_name
          }
          return {
            text,
            value: v.file_path
          }
        })
      }
    }
  },
  methods: {
    saveSettings () {
      this.$_simulator_runningSettings = this.newSettings
      this.$_app_settingsDialog = false
    },
    resetSettings () {
      if (this.$_simulator_runningSettings === null) {
        this.sf_class_model = ''
        this.conn_class_model = ''
        this.exec_numMotes_model = ''
        this.exec_randomSeed_model = ''
        this.exec_numSlotframesPerRun = ''
      } else {
        const settings = this.$_simulator_runningSettings
        this.sf_class_model = settings.sf_class
        this.conn_class_model = settings.conn_class
        this.exec_numMotes_model = settings.exec_numMotes
        this.exec_randomSeed_model = settings.exec_randomSeed
        this.exec_numSlotframesPerRun = settings.exec_numSlotframesPerRun
      }
    },
    cancelSettings () {
      this.resetSettings()
      this.$_app_settingsDialog = false
    },
    getNumMotesFromTrace (traceFilePath) {
      const trace = this.getTrace(traceFilePath)

      if (trace === undefined || trace.config === null) {
        return 0
      } else {
        return trace.config.node_count
      }
    },
    getMaxExecNumMinuetsFromTrace (traceFilePath) {
      const trace = this.getTrace(traceFilePath)
      const startDate = new Date(trace.config.start_date)
      const stopDate= new Date(trace.config.stop_date)
      return Math.floor((stopDate - startDate) / 1000 / 60)
    },
    getTrace(traceFilePath) {
      return this.$_simulator_availableTraceFiles.find(trace => {
        return trace.file_path === traceFilePath
      })
    },
    checkMaxExecNumMinutes () {
      return
    }
  }
}
</script>
