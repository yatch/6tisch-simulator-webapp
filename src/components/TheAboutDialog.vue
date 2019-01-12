<template>
  <v-dialog
    v-model="$_app_aboutDialog"
    persistent
    width="400px"
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
            <v-flex
              xs12
              v-for="item in items"
              :key="item.name"
              >
              <v-card
                flat>
                <v-card-title>{{ item.title }}</v-card-title>
                <v-divider/>
                <v-card-text>
                  <v-layout>
                    <v-flex xs2>Path</v-flex>
                    <v-flex
                      xs10
                      text-xs-right
                      >
                      {{ item.repo }}
                    </v-flex>
                  </v-layout>
                  <v-layout>
                    <v-flex xs2>Branch</v-flex>
                    <v-flex
                      xs10
                      text-xs-right
                      >
                      {{ item.branch }}
                    </v-flex>
                  </v-layout>
                  <v-layout>
                    <v-flex xs2>Commit</v-flex>
                    <v-flex
                      xs10
                      text-xs-right
                      >
                      {{ item.short_hash }}
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
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
import App from '@/mixins/App'
import Simulator from '@/mixins/Simulator'

export default {
  mixins: [App, Simulator],
  computed: {
    items () {
      const gitInfo = this.$_simulator_gitInfo
      let ret
      if (gitInfo === null) {
        ret = [
          {
            name: 'webapp',
            title: '6TiSCH Simulator WebApp',
            repo: 'unknown',
            branch: 'unknown',
            commit: 'unknown'
          },
          {
            name: 'simulator',
            title: '6TiSCH Simulator',
            repo: 'unknown',
            branch: 'unknown',
            commit: 'unknown'
          }
        ]
      } else {
        ret = Object.keys(gitInfo).map(name => {
          let title
          if (name === 'webapp') {
            title = '6TiSCH Simulator WebApp'
          } else if (name === 'simulator') {
            title = '6TiSCH Simulator'
          } else {
            title = name
          }
          return Object.assign({ name, title }, gitInfo[name])
        })
      }
      return ret
    }
  },
  methods: {
    close () {
      this.$_app_aboutDialog = false
    }
  }
}
</script>
