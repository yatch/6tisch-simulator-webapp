<template>
<v-container>
  <v-dialog v-model="dialog" hide-overlay persistent width="300">
    <v-card color="primary" dark>
      <v-card-text>
        <div>Loading the default settings...</div>
        <div>Please stand by</div>
        <v-progress-linear
          indeterminate
          color="white"
          class="mb-0"
          ></v-progress-linear>
      </v-card-text>
    </v-card>
  </v-dialog>
  <v-layout justify-center>
    <v-flex xs6>
      <v-card>
        <v-card-title class="subheading">Simple Configurator</v-card-title>
        <v-card-text>
          <v-list>
            <v-list-tile>
              <v-list-tile-title>Scheduling Function</v-list-tile-title>
              <v-list-tile-content>
                <v-select v-model="settings.sf_class" :items="availableSFs"/>
              </v-list-tile-content>
            </v-list-tile>
            <v-divider/>
            <v-list-tile>
              <v-list-tile-title>Topology</v-list-tile-title>
              <v-list-tile-content>
                <v-select v-model="settings.conn_class" :items="availableConnectivities"/>
              </v-list-tile-content>
            </v-list-tile>
            <v-divider/>
            <v-list-tile>
              <v-list-tile-title>Number of Motes</v-list-tile-title>
              <v-list-tile-content>
                <v-text-field v-model.number="settings.exec_numMotes" single-line type="number"/>
              </v-list-tile-content>
            </v-list-tile>
            <v-divider/>
            <v-list-tile>
              <v-list-tile-title>Random Seed</v-list-tile-title>
              <v-list-tile-content>
                <v-text-field v-model.number="settings.exec_randomSeed" single-line type="number"/>
              </v-list-tile-content>
            </v-list-tile>
            <v-divider/>
            <v-list-tile>
              <v-list-tile-title>Simulation Time (minutes)</v-list-tile-title>
              <v-list-tile-content>
                <v-text-field v-model.number="exec_minutesPerRun" single-line type="number"/>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
      <v-btn @click.stop="loadSettings()">Reset</v-btn>
      <v-btn @click.stop="saveSettings()" color="info">Save</v-btn>
    </v-card-actions>
  </v-card>
  </v-flex>
  </v-layout>
</v-container>
</template>

<script>
export default {
  data () {
    return {
      settings: {
        sf_class: undefined,
        conn_class: undefined,
        exec_numMotes: 0,
        exec_randomSeed: 0
      },
      exec_minutesPerRun: 0
    }
  },
  mounted () {
    this.loadSettings()
  },
  watch: {
    runningSettings () { this.loadSettings() }
  },
  computed: {
    runningSettings () { return this.$store.getters['simulator/settings'] },
    availableSFs() {
      return this.makeOptions(this.$store.getters['simulator/availableSFs'])
    },
    availableConnectivities () {
      return this.makeOptions(
        this.$store.getters['simulator/availableConnectivities']
      )
    },
    dialog () {
      if (this.runningSettings !== undefined &&
          this.availableSFs !== undefined &&
          this.availableConnectivities !== undefined) {
        return false
      } else {
        return true
      }
    }
  },
  methods: {
    loadSettings () {
      if (this.runningSettings !== undefined) {
        this.settings = Object.assign({}, this.runningSettings)
        if (this.settings.exec_randomSeed === 'random') {
          this.settings.exec_randomSeed = Math.floor(Math.random() * 10000)
        }
        this.exec_minutesPerRun = Math.floor(this.settings.exec_numSlotframesPerRun *
                                             this.settings.tsch_slotframeLength *
                                             this.settings.tsch_slotDuration /
                                             60)
      }
    },
    saveSettings () {
      this.settings.exec_numSlotframesPerRun = Math.ceil(this.exec_minutesPerRun *
                                                         60 /
                                                         this.settings.tsch_slotDuration /
                                                         this.settings.tsch_slotframeLength)
      this.$store.dispatch('simulator/saveSettings',
                           Object.assign({}, this.settings))
      this.$router.push('/')
    },
    makeOptions (list) {
      if (list === undefined) {
        return undefined
      } else {
        return list.map(x => ({ text: x, value: x}))
      }
    }
  }
}
</script>
