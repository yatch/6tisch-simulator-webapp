<template>
<v-container grid-list-sm fluid>
  <v-layout align-start justify-center row fill-height>
    <v-data-table
      :headers="headers"
      :items="files"
      :rows-per-page-items='[10,25,{"text":"$vuetify.dataIterator.rowsPerPageAll","value":-1}]'
      >
      <template slot="items" slot-scope="props">
        <td>{{ props.item.file_name }}</td>
        <td>{{ props.item.config.location }}</td>
        <td>{{ props.item.config.node_count }}</td>
        <td>{{ props.item.config.start_date }}</td>
        <td>{{ props.item.config.maxDuration }}</td>
        <td>{{ props.item.config.channels.length }}</td>
      </template>
    </v-data-table>
  </v-layout>
</v-container>
</template>

<script>
import Simulator from '@/mixins/Simulator'

export default {
  mixins: [Simulator],
  filters: {
  },
  data () {
    return {
      headers: [
        {
          text: 'File Name',
          value: 'file_name'
        },
        {
          text: 'Location',
          value: 'config.location'
        },
        {
          text: '# Motes',
          value: 'config.node_count'
        },
        {
          text: 'Start Date',
          value: 'config.start_date'
        },
        {
          text: 'Duration (min)',
          value: 'config.maxDuration'
        },
        {
          text: '# CHs',
          value: 'config.channels.length'
        }
      ]
    }
  },
  computed: {
    files () { return this.$_simulator_availableTraceFiles }
  },
  created () {
  },
  methods: {
  }
}
</script>
