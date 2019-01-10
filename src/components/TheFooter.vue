<template>
<v-footer
  height="auto"
  app
  >
  <v-flex xs12>
    <v-container
      pa-0
      ma-0
      fluid
      >
      <v-layout justify-center>
        <v-flex xs12>
          <v-progress-linear
            :value="progress"
            color="pink lighten-3"
            background-color="grey lighten-1"
            />
        </v-flex>
      </v-layout>
      <v-layout
        align-center
        justify-start
        row
        wrap
        >
        <v-btn
          @click="onClickPlay"
          :icon="$vuetify.breakpoint.xsOnly"
          >
          <span v-if="$vuetify.breakpoint.smAndUp">
            {{ running | playString }}
          </span>
          <v-icon>{{ running | playIcon }}</v-icon>
        </v-btn>
        <v-btn
          @click="onClickStop"
          :icon="$vuetify.breakpoint.xsOnly"
          >
          <span v-if="$vuetify.breakpoint.smAndUp">Stop</span>
          <v-icon>stop</v-icon>
        </v-btn>
        <v-flex xs2 sm3>
          <span>
            <span>{{ currentMinutes | minutesString }}</span>
            <span v-if="$vuetify.breakpoint.smAndUp">
              / {{ endMinutes | minutesString }}
            </span>
          </span>
        </v-flex>
        <v-spacer/>
        <v-tooltip top>
          <v-chip
            slot="activator"
            >
            {{ sfClass }}</v-chip>
          <span>Scheduling Function</span>
        </v-tooltip>
        <v-tooltip top>
          <v-chip
            slot="activator"
            v-if="$vuetify.breakpoint.smAndUp"
            >
            {{ connClass }}
          </v-chip>
          <span>Connectivity Class</span>
        </v-tooltip>
        <v-tooltip top>
          <v-chip
            slot="activator"
            v-if="$vuetify.breakpoint.smAndUp"
            >
            {{ numMotes }}
          </v-chip>
          <span>Number of Motes</span>
        </v-tooltip>
        <v-btn
          icon
          >
          <v-icon>settings</v-icon>
        </v-btn>
      </v-layout>
    </v-container>
  </v-flex>
</v-footer>
</template>

<script>
import Simulator from '@/mixins/Simulator'
import Simulation from '@/mixins/Simulation'

export default {
  mixins: [Simulator, Simulation],
  computed: {
    running () { return this.$_simulator_operationalStatus === 'running' },
    sfClass () {
      if (this.$_simulator_settings === null) {
        return 'unknown'
      } else {
        return this.$_simulator_settings.sf_class
      }
    },
    connClass () {
      if (this.$_simulator_settings === null) {
        return 'unknown'
      } else {
        return this.$_simulator_settings.conn_class
      }
    },
    numMotes () {
      if (this.$_simulator_settings === null) {
        return 'unknown'
      } else {
        return this.$_simulator_settings.exec_numMotes
      }
    },
    currentMinutes () {
      let minutes
      if (this.$_simulation_elapsedMinutes === null) {
        minutes = 0
      } else {
        minutes = this.$_simulation_elapsedMinutes
      }
      return minutes
    },
    endMinutes () {
      const settings = this.$_simulator_settings
      let minutes
      if (settings === null) {
        minutes = 0
      } else {
        minutes = Math.floor(settings.exec_numSlotframesPerRun *
                             settings.tsch_slotframeLength *
                             settings.tsch_slotDuration /
                             60)
      }
      return minutes
    },
    progress () {
      if (this.endMinutes === 0) {
        return 0
      } else {
        return this.currentMinutes / this.endMinutes * 100
      }
    }
  },
  filters: {
    playString (running) {
      if (running === true) {
        return 'Pause'
      } else {
        return 'Play'
      }
    },
    playIcon (running) {
      if (running === true) {
        return 'pause'
      } else {
        return 'play_arrow'
      }
    },
    minutesString (minutes) {
      const hourPart = ('0' + Math.floor(minutes / 60).toString()).slice(-2)
      const minutePart = ('0' + (minutes % 60).toString()).slice(-2)
      return hourPart + 'h' +  minutePart + 'm'
    }
  },
  methods: {
    onClickPlay () {
      if (this.$_simulator_operationalStatus === 'running') {
        this.$_simulator_pause()
      } else if (this.$_simulator_operationalStatus === 'paused') {
        this.$_simulator_resume()
      } else {
        this.$_simulator_start()
      }
    },
    onClickStop () {
      this.$_simulator_abort()
    }
  }
}
</script>
