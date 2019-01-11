<template>
<v-flex
  xs12
  md1
  lg4
  >
  <v-tooltip bottom>
    <v-card slot="activator" height="100%">
      <v-layout
        align-center
        justify-center
        row
        fill-height
        >
        <v-flex>
          <v-container>
            <v-layout>
              <cytoscape
                :config="config"
                :preConfig="preConfig"
                style="width: 100%; height: 200px"
                />
            </v-layout>
          </v-container>
        </v-flex>
      </v-layout>
    </v-card>
    <span>
      <slot name="help">
        Live view of the RPL Topology
      </slot>
    </span>
  </v-tooltip>
</v-flex>
</template>

<script>
import dagre from 'cytoscape-dagre'
import Simulation from '@/mixins/Simulation'
import Simulator from '@/mixins/Simulator'

export default {
  mixins: [Simulator, Simulation],
  data () {
    return {
      options: {
        name: 'dagre',
        rankDir: 'TB',
        spacingFactor: 1,
        fit: false
      },
      config: {
        elements: [],
        layout: this.options,
        style: [
          {
            selector: 'node',
            style: {
              'background-color': '#666',
              'label': 'data(id)'
            }
          },
          {
            selector: 'edge',
            style: {
              'width': 3,
              'line-color': '#ccc',
              'target-arrow-color': '#ccc',
              'target-arrow-shape': 'triangle',
              'curve-style': 'bezier'
            }
          }
        ],
        userZoomingEnabled: false,
        maxZoom: 1
      }
    }
  },
  computed: {
    breakpoint () { return this.$vuetify.breakpoint }
  },
  watch:{
    breakpoint () {
      this.refresh()
    },
    $_simulator_operationalStatus (newStatus, oldStatus) {
      if ((newStatus === 'running' && oldStatus === 'ready') ||
          (newStatus === 'aborted')) {
        this.$cytoscape.instance.then(cy => {
          cy.elements('*').remove()
        })
        // add the root node
        this.manipulate({
          operation: 'add',
          group: 'nodes',
          id: 0
        })
        this.refresh()
      }
    },
    $_simulation_lastRplParentChangeEvent (event) {
      if (event !== null) {
        if (event.oldParentId === null) {
          this.manipulate({
            operation: 'add',
            group: 'nodes',
            id: event.childId
          })
        } else {
          this.manipulate({
            operation: 'remove',
            group: 'edges',
            source: event.oldParentId,
            target: event.childId
          })
        }
        if (event.newParentId === null) {
          this.manipulate({
            operation: 'remove',
            group: 'nodes',
            id: event.childId
          })
        } else {
          this.manipulate({
            operation: 'add',
            group: 'edges',
            source: event.newParentId,
            target: event.childId
          })
        }
        this.refresh()
      }
    }
  },
  methods: {
    preConfig (cytoscape) {
      // need to call cytoscape.use with dagre in preConfig(),
      // following https://www.npmjs.com/package/vue-cytoscape
      cytoscape.use(dagre)
    },
    manipulate (args) {
      this.$cytoscape.instance.then(cy => {
        const data = { group: args.group }

        if (data.group === 'nodes') {
          data.id = args.id
        } else if (data.group === 'edges') {
          data.id = args.source + '-' + args.target
          data.source = args.source
          data.target = args.target
        }
        if (args.operation === 'add') {
          cy.add({ data })
        } else if (args.operation === 'remove') {
          const element = cy.getElementById(data.id)
          cy.remove(element)
        }
      })
    },
    refresh () {
      this.$cytoscape.instance.then(cy => {
        cy.layout(this.options).run()
        cy.center()
        cy.fit()
      })
    }
  }
}
</script>
