<template>
<v-container>
  <v-layout align-space-around justify-space-around row fill-height>
    <OverallE2EPdr/>
    <OverallE2ELatency/>
    <SlotframeOccupancy/>
    <SimController/>
  </v-layout>
</v-container>
</template>

<script>
import OverallE2EPdr from '@/components/OverallE2EPdr.vue'
import OverallE2ELatency from '@/components/OverallE2ELatency.vue'
import SlotframeOccupancy from '@/components/SlotframeOccupancy.vue'
import SimController from '@/components/SimController.vue'

export default {
  components: {
    OverallE2EPdr,
    OverallE2ELatency,
    SlotframeOccupancy,
    SimController
  }
}
</script>
