<template>
  <v-card width="300px">
    <v-tooltip bottom>
      <div slot="activator">
        <v-card-title>RPL Topology</v-card-title>
        <cytoscape :config="config" :preConfig="preConfig" style="width: 100%; height: 250px"/>
      </div>
      <span>Current view of the RPL Topology</span>
    </v-tooltip>
  </v-card>
</template>

<script>
import dagre from 'cytoscape-dagre'

export default {
  data () {
    return {
      layoutOption: {
        name: 'dagre',
        rankDir: 'TB',
        spacingFactor: 1,
        fit: false
      },
      config: {
        elements: [],
        layout: this.layoutOption,
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
  methods: {
    preConfig (cytoscape) { cytoscape.use(dagre) },
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
        cy.layout(this.layoutOption).run()
        cy.center()
        cy.fit()
      })
    }
  },
  watch: {
    operationalStatus (newState, oldState) {
      if (newState === 'running' && oldState === 'ready') {
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
    lastRplParentChangeEvent (event) {
      if (event === undefined) {
        return
      }
      if (event.oldParentId === undefined) {
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
      if (event.newParentId === undefined) {
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
  },
  computed: {
    operationalStatus () {
      return this.$store.getters['simulator/operationalStatus']
    },
    lastRplParentChangeEvent () {
      return this.$store.getters['log/lastRplParentChangeEvent']
    },
  }
}
</script>
