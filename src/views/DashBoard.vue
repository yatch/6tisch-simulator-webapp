<template>
<v-container>
  <v-layout align-space-around justify-space-around row fill-height>
    <OverallE2EPdr/>
    <OverallE2ELatency/>
    <SlotframeOccupancy/>
    <SimController/>
  </v-layout>
  <v-layout>
    <E2EPdrChart/>
    <E2ELatencyChart/>
    <PacketDropReasonChart/>
  </v-layout>
  <v-layout>
    <RplTopology/>
    <TschSchedule/>
  </v-layout>
</v-container>
</template>

<script>
import OverallE2EPdr from '@/components/OverallE2EPdr.vue'
import OverallE2ELatency from '@/components/OverallE2ELatency.vue'
import SlotframeOccupancy from '@/components/SlotframeOccupancy.vue'
import SimController from '@/components/SimController.vue'
import RplTopology from '@/components/RplTopology.vue'
import E2EPdrChart from '@/components/E2EPdrChart.vue'
import E2ELatencyChart from '@/components/E2ELatencyChart.vue'
import PacketDropReasonChart from '@/components/PacketDropReasonChart.vue'
import TschSchedule from '@/components/TschSchedule.vue'

export default {
  components: {
    OverallE2EPdr,
    OverallE2ELatency,
    SlotframeOccupancy,
    SimController,
    RplTopology,
    E2EPdrChart,
    E2ELatencyChart,
    PacketDropReasonChart,
    TschSchedule
  }
}
</script>
