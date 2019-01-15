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
          model: null,
          type: 'select',
          selectItems: [],
          disabled: false
        },
        {
          name: 'conn_class',
          title: 'Connectivity Class',
          model: null,
          type: 'select',
          selectItems: [],
          disabled: false
        },
        {
          name: 'conn_trace',
          title: 'Trace File',
          model: null,
          type: 'select',
          selectItems: [],
          disabled: true
        },
        {
          name: 'exec_numMotes',
          title: 'Number of Motes',
          model: 0,
          type: 'number',
          disabled: false
        },
        {
          name: 'exec_randomSeed',
          title: 'Random Seed',
          model: 0,
          type: 'number',
          disabled: false
        },
        {
          name: 'exec_numMinutes',
          title: 'Simulation Time (minutes)',
          model: 0,
          type: 'number',
          disabled: false
        }
      ]
    }
  },
  computed: {
    disabledSave () {
      if (this.exec_numMotes === 0 ||
          (this.conn_coass === 'K7' && this.conn_trace === null)) {
        return true
      } else {
        return false
      }
    },
    sf_class: {
      get () { return this.items[0].model },
      set (value) { this.items[0].model = value }
    },
    conn_class: {
      get () { return this.items[1].model },
      set (value) { this.items[1].model = value }
    },
    conn_trace: {
      get () { return this.items[2].model },
      set (value) { this.items[2].model = value }
    },
    exec_numMotes: {
      get () { return this.items[3].model },
      set (value) { this.items[3].model = value }
    },
    exec_randomSeed: {
      get () { return this.items[4].model },
      set (value) { this.items[4].model = value }
    },
    exec_numSlotframesPerRun: {
      get () {
        if (this.$_simulator_runningSettings === null) {
          return 0
        } else {
          const settings = this.$_simulator_runningSettings
          return Math.ceil(this.items[5].model *
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
        return this.items[5].model = minutes
      }
    },
    newSettings () {
      return Object.assign(
        this.$_simulator_runningSettings,
        {
          sf_class: this.sf_class,
          conn_class: this.conn_class,
          conn_trace: this.conn_trace,
          exec_numMotes: this.exec_numMotes,
          exec_randomSeed: this.exec_randomSeed,
          exec_numSlotframesPerRun: this.exec_numSlotframesPerRun
        }
      )
    }
  },
  watch: {
    conn_class ()  {
      if (this.conn_class === 'K7') {
        // this item is for the trace file
        this.items[2].disabled = false
        // select the first item in the options
        if (this.items[2].selectItems.length > 0) {
          this.conn_trace = this.items[2].selectItems[0].value
        }
        // this item is for exec_numMotes
        this.items[3].disabled = true
      } else {
        this.items[2].disabled = true
        this.conn_trace = null
        this.items[3].disabled = false
      }
    },
    conn_trace (traceFilePath) {
      this.exec_numMotes = this.getNumMotesFromTrace(traceFilePath)
    },
    $_simulator_runningSettings (settings) {
      if (settings !== null) {
        this.sf_class = settings.sf_class
        this.conn_class = settings.conn_class
        this.exec_numMotes = settings.exec_numMotes
        this.exec_randomSeed = settings.exec_randomSeed
        this.exec_numSlotframesPerRun = settings.exec_numSlotframesPerRun
      }
    },
    $_simulator_availableSFs (value) {
      if (value === null) {
        this.items[0].selectItems = []
      } else {
        this.items[0].selectItems = value
      }
    },
    $_simulator_availableConnectivities (value) {
      if (value === null) {
        this.items[1].selectItems = []
      } else {
        this.items[1].selectItems = value
      }
    },
    $_simulator_availableTraceFiles (value) {
      if (value === null) {
        this.items[2].selectItems = []
      } else {
        this.items[2].selectItems = value.map(v => {
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
        this.sf_class = null
        this.conn_class = null
        this.exec_numMotes = 0
        this.exec_randomSeed = 0
        this.exec_numSlotframesPerRun = 0
      } else {
        const settings = this.$_simulator_runningSettings
        this.sf_class = settings.sf_class
        this.conn_class = settings.conn_class
        this.exec_numMotes = settings.exec_numMotes
        this.exec_randomSeed = settings.exec_randomSeed
        this.exec_numSlotframesPerRun = settings.exec_numSlotframesPerRun
      }
    },
    cancelSettings () {
      this.resetSettings()
      this.$_app_settingsDialog = false
    },
    getNumMotesFromTrace (traceFilePath) {
      const trace = this.$_simulator_availableTraceFiles.find(trace => {
        return trace.file_path === traceFilePath
      })

      if (trace === undefined || trace.config === null) {
        return 0
      } else {
        return trace.config.node_count
      }
    },
  }
}
</script>
