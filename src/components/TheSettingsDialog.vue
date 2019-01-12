<template>
<div>
  <v-dialog
    v-model="$_app_settingsDialog"
    persistent
    width="400px"
    >
    <v-card>
      <v-card-text>
        <v-list
          v-for="item in items"
          :key="item.name"
          >
          <v-list-tile>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            <v-text-field
              v-if="item.type === 'number'"
              v-model.number="item.model"
              single-line
              type="number"
              reverse
              />
            <v-select
              v-else
              v-model="item.model"
              :items="item.selectItems"
              class="text-xs-right"
              reverse
              />
          </v-list-tile>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click.stop="resetSettings" color="error">Reset</v-btn>
        <v-btn @click.stop="cancelSettings" color="">Cancel</v-btn>
        <v-btn @click.stop="saveSettings" color="primary">Save</v-btn>
      </v-card-actions>
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
      items: [
        {
          name: 'sf_class',
          title: 'Scheduling Function',
          model: null,
          type: 'select',
          selectItems: []
        },
        {
          name: 'conn_class',
          title: 'Connectivity Class',
          model: null,
          type: 'select',
          selectItems: []
        },
        {
          name: 'exec_numMotes',
          title: 'Number of Motes',
          model: 0,
          type: 'number'
        },
        {
          name: 'exec_randomSeed',
          title: 'Random Seed',
          model: 0,
          type: 'number'
        },
        {
          name: 'exec_numMinutes',
          title: 'Simulation Time (minutes)',
          model: 0,
          type: 'number'
        }
      ]
    }
  },
  computed: {
    sf_class: {
      get () { return this.items[0].model },
      set (value) { return this.items[0].model = value }
    },
    conn_class: {
      get () { return this.items[1].model },
      set (value) { return this.items[1].model = value }
    },
    exec_numMotes: {
      get () { return this.items[2].model },
      set (value) { return this.items[2].model = value }
    },
    exec_randomSeed: {
      get () { return this.items[3].model },
      set (value) { return this.items[3].model = value }
    },
    exec_numSlotframesPerRun: {
      get () {
        if (this.$_simulator_settings === null) {
          return 0
        } else {
          const settings = this.$_simulator_settings
          return Math.ceil(this.items[4].model *
                           60 /
                           settings.tsch_slotDuration /
                           settings.tsch_slotframeLength)
        }
      },
      set (numSlotframes) {
        const settings = this.$_simulator_settings
        const minutes = Math.floor(numSlotframes *
                                   settings.tsch_slotframeLength *
                                   settings.tsch_slotDuration /
                                   60)
        return this.items[4].model = minutes
      }
    },
    newSettings () {
      return Object.assign(
        this.$_simulator_settings,
        {
          sf_class: this.sf_class,
          conn_class: this.conn_class,
          exec_numMotes: this.exec_numMotes,
          exec_randomSeed: this.exec_randomSeed,
          exec_numSlotframesPerRun: this.exec_numSlotframesPerRun
        }
      )
    }
  },
  watch: {
    $_simulator_settings (settings) {
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
    }
  },
  methods: {
    saveSettings () {
      this.$_simulator_settings = this.newSettings
      this.$_app_settingsDialog = false
    },
    resetSettings () {
      if (this.$_simulator_settings === null) {
        this.sf_class = null
        this.conn_class = null
        this.exec_numMotes = 0
        this.exec_randomSeed = 0
        this.exec_numSlotframesPerRun = 0
      } else {
        const settings = this.$_simulator_settings
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
    }
  }
}
</script>
