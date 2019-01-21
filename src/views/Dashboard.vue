<template>
<v-flex xs12>
  <v-container
    grid-list-sm
    >
    <v-layout
      row
      wrap
      >
      <TheOverallE2ePdrCard/>
      <TheOverallE2eLatencyCard/>
      <TheSlotframeOccupancyCard/>
      <TheMoteStatsCard/>
    </v-layout>
    <v-layout
      row
      wrap
      >
      <TheE2ePdrChartCard/>
      <TheE2eLatencyChartCard/>
      <ThePacketDropChartCard/>
    </v-layout>
    <v-layout
      row
      wrap
      >
      <TheRplTopologyCard/>
      <TheTschScheduleCard/>
    </v-layout>
  </v-container>
</v-flex>
</template>

<script  >
import TheOverallE2ePdrCard from '@/components/TheOverallE2ePdrCard'
import TheOverallE2eLatencyCard from '@/components/TheOverallE2eLatencyCard'
import TheSlotframeOccupancyCard from '@/components/TheSlotframeOccupancyCard'
import TheMoteStatsCard from '@/components/TheMoteStatsCard'
import TheE2ePdrChartCard from '@/components/TheE2ePdrChartCard'
import TheE2eLatencyChartCard from '@/components/TheE2eLatencyChartCard'
import ThePacketDropChartCard from '@/components/ThePacketDropChartCard'
import TheRplTopologyCard from '@/components/TheRplTopologyCard'
import TheTschScheduleCard from '@/components/TheTschScheduleCard'

export default {
  components: {
    TheOverallE2ePdrCard,
    TheOverallE2eLatencyCard,
    TheSlotframeOccupancyCard,
    TheMoteStatsCard,
    TheE2ePdrChartCard,
    TheE2eLatencyChartCard,
    ThePacketDropChartCard,
    TheRplTopologyCard,
    TheTschScheduleCard
  }
}
</script>
