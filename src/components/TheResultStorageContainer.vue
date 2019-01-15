<template>
<v-container grid-list-sm fluid>
  <v-layout align-start row fill-height>
    <v-flex xs12>
      <v-container>
        <v-layout justify-end>
          <v-btn
            v-if="totalNumResults > 0"
            color="error"
            @click="confirmation = true"
            >
            Remove All
          </v-btn>
        </v-layout>
      </v-container>
    </v-flex>
  </v-layout>
  <v-layout
    v-if="totalNumResults === 0"
    justify-center
    >
    <v-flex
      x12
      class="title text-xs-center">
      <p>No Result is Available under:</p>
      <p>{{ simDataPath }}</p>
    </v-flex>
  </v-layout>
  <v-layout
    align-center
    justify-center
    row
    wrap
    fill-height
    v-for="item in items"
    :key="item.name"
    >
    <v-flex xs12>
      <v-card hover>
        <v-container pa-3>
          <v-layout align-center justify-center row>
            <v-flex xs3>{{ item.name }}</v-flex>
            <v-flex xs4>
              <v-chip v-if="item.sfClass !== null">{{ item.sfClass }}</v-chip>
              <v-chip v-if="item.connClass !== null">{{ item.connClass }}</v-chip>
              <v-chip v-if="item.connClass === 'K7'">{{ item.connTrace | traceName }}</v-chip>
              <v-chip v-if="item.numMotes !== null">{{ item.numMotes }}</v-chip>
            </v-flex>
            <v-spacer/>
            <v-flex xs2>{{ item.lastModified }}</v-flex>
            <v-flex xs2>
              <v-btn
                :href="'/result/' + item.name + '.zip'"
                download
                icon
                >
                <v-icon>save_alt</v-icon>
              </v-btn>
              <v-btn icon @click="confirmDeletion(item.name)">
                <v-icon>delete</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-flex>
  </v-layout>
  <v-layout justify-center>
    <v-flex xs6>
      <v-container>
        <v-layout v-if="totalNumPages > 0" justify-center>
          <v-pagination
            v-model="currentPage"
            :length="totalNumPages"
            />
        </v-layout>
      </v-container>
    </v-flex>
  </v-layout>
  <v-dialog v-model="confirmation" max-width="500px">
    <v-card>
      <v-card-title class="subheading">
        <div v-if="deletingItemName === null">
          Delete all the files under:
        </div>
        <div v-else>
          Delete {{ deletingItemName }} under:
        </div>
          {{ simDataPath }}?
      </v-card-title>
      <v-layout justify-center>
        <v-card-actions>
          <v-btn @click="confirmation = false">Cancel</v-btn>
          <v-btn @click="executeDeletion" color="error">Yes</v-btn>
        </v-card-actions>
      </v-layout>
    </v-card>
  </v-dialog>
</v-container>
</template>

<script>
export default {
  filters: {
    traceName (pathName) {
      const trace_file_name = pathName.replace(/^.*[/]/, '')
      if (trace_file_name.match(/.k7.gz$/)) {
        return trace_file_name.split('.').slice(0, -2).join('.')
      } else {
        return trace_file_name
      }
    }
  },
  data () {
    return {
      currentPage: 1,
      numResultsPerPage: 5,
      totalNumResults: 0,
      results: [],
      deletingItemName: null,
      confirmation: false,
      simDataPath: null
    }
  },
  computed: {
    totalNumPages () {
      if (this.numResultsPerPage === 0) {
        return 0
      } else {
        return Math.floor(this.totalNumResults / this.numResultsPerPage)
      }
    },
    now () { return Math.floor(Date.now() / 1000) },
    items () {
      return this.results.map(result => {
        const ret = {
          name: result.name,
          lastModified: result.last_modified
        }
        const keys = [
          {
            key1: 'sf_class',
            key2: 'sfClass'
          },
          {
            key1: 'conn_class',
            key2: 'connClass',
          },
          {
            key1: 'conn_trace',
            key2: 'connTrace',
          },
          {
            key1: 'exec_numMotes',
            key2: 'numMotes'
          }
        ]
        keys.forEach(k => {
          if (result.settings !== null &&
              result.settings[k.key1] !== undefined) {
            ret[k.key2] = result.settings[k.key1]
          } else {
            ret[k.key2] = null
          }
        })
        return ret
      })
    }
  },
  watch: {
    currentPage () { this.loadPage() },
    confirmation (newValue) {
      if (newValue === false) {
        // reset deletingItemName here
        this.deletingItemName = null
      }
    }
  },
  created () {
    this.$_eel.get_total_number_of_results()(totalNumResults => {
      this.totalNumResults = totalNumResults
    })
    this.$_eel.get_sim_data_path()(path => { this.simDataPath = path })
    this.loadResults(0, this.numResultsPerPage)
  },
  methods: {
    loadPage () {
      this.loadResults((this.currentPage - 1) * this.numResultsPerPage,
                       this.numResultsPerPage)
    },
    loadResults (startIndex, maxNumResults) {
      this.$_eel.get_results(startIndex, maxNumResults)(results => {
        this.results = results
      })
    },
    deleteItem (itemName) {
      this.$_eel.delete_result(itemName)(() => {
        this.totalNumResults -= 1
        this.loadPage()
      })
    },
    deleteAllItems () {
      this.$_eel.delete_all_results()(() => {
        this.totalNumResults = 0
        this.loadPage()
        this.confirmation = false
      })
    },
    confirmDeletion (itemName) {
      this.deletingItemName = itemName
      this.confirmation = true
    },
    executeDeletion () {
      if (this.deletingItemName === null) {
        this.deleteAllItems()
      } else {
        this.deleteItem(this.deletingItemName)
        this.deletingItemName = null
      }
      this.confirmation = false
    }
  }
}
</script>
