<template>
<v-flex
  xs12
  md4
  >
  <v-tooltip bottom>
    <v-card slot="activator" height="100%">
      <apexchart
        :type="type"
        height="200px"
        :options="options"
        :series="series"/>
    </v-card>
    <span>
      <slot name="help"/>
    </span>
  </v-tooltip>
</v-flex>
</template>

<script>
export default {
  props: ['type', 'options', 'series']
}
</script>
