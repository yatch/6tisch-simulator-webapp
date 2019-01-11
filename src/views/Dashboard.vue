<template>
<v-flex xs12>
  <v-container grid-list-sm>
    <v-layout
      row
      wrap
      >
      <TheOverallE2ePdrCard/>
      <TheOverallE2eLatencyCard/>
      <TheSlotframeOccupancyCard/>
    </v-layout>
    <v-layout
      row
      wrap
      >
      <TheE2ePdrChartCard/>
      <TheE2eLatencyChartCard/>
    </v-layout>
  </v-container>
</v-flex>
</template>

<script  >
import TheOverallE2ePdrCard from '@/components/TheOverallE2ePdrCard'
import TheOverallE2eLatencyCard from '@/components/TheOverallE2eLatencyCard'
import TheSlotframeOccupancyCard from '@/components/TheSlotframeOccupancyCard'
import TheE2ePdrChartCard from '@/components/TheE2ePdrChartCard'
import TheE2eLatencyChartCard from '@/components/TheE2eLatencyChartCard'

export default {
  components: {
    TheOverallE2ePdrCard,
    TheOverallE2eLatencyCard,
    TheSlotframeOccupancyCard,
    TheE2ePdrChartCard,
    TheE2eLatencyChartCard
  }
}
</script>
