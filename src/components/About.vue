<template>
<v-dialog v-model="aboutDialog" width="600">
  <v-card>
    <v-card-title class="headline grey lighten-2">Software Version</v-card-title>
    <v-container>
      <v-layout>
        <v-flex>
        </v-flex>
      </v-layout>
      <template v-for="item in gitInfo">
        <v-layout :key="item.name" pa-2>
          <v-flex>
            <v-card>
              <v-card-title class="title">{{ item.name }}</v-card-title>
              <v-divider/>
              <v-container>
                <v-layout>
                  <v-flex xs4>Code Location</v-flex>
                  <v-flex>{{ item.repo }}</v-flex>
                </v-layout>
                <v-layout>
                  <v-flex xs4>Branch Name</v-flex>
                  <v-flex>{{ item.branch }}</v-flex>
                </v-layout>
                <v-layout>
                  <v-flex xs4>Commit Hash</v-flex>
                  <v-flex>{{ item.short_hash }}</v-flex>
                </v-layout>
              </v-container>
            </v-card>
          </v-flex>
        </v-layout>
      </template>
    </v-container>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click.stop="aboutDialog = false">
        OK
      </v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
</template>

<script>
export default {
  data () {
    return {
      unknown: {
        webapp: {
          repo: 'unknown',
          branch: 'unknown',
          commit: 'unknown'
        },
        simulator: {
          repo: 'unknown',
          branch: 'unknown',
          commit: 'unknown'
        }
      }
    }
  },
  computed: {
    aboutDialog: {
      get () { return this.$store.getters['app/aboutDialog'] },
      set (newValue) { this.$store.dispatch('app/setAboutDialog', newValue) }
    },
    gitInfo () {
      let info
      if (this.$store.getters['simulator/gitInfo'] === undefined) {
        info = this.unknown
      } else {
        info =  this.$store.getters['simulator/gitInfo']
      }
      const ret = Object.keys(info).map(key => {
        let name
        if (key === 'webapp') {
          name = '6TiSCH Simulator WebApp'
        } else if (key === 'simulator') {
          name = '6TiSCH Simulator'
        } else {
          name = key
        }
        return Object.assign({ name }, info[key])
      })
      return ret
    }
  }
}
</script>
