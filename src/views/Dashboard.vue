<template>
<v-flex xs12>
  <v-container grid-list-sm>
    <v-layout
      row
      wrap
      >
      <TheOverallE2ePdrCard/>
      <TheOverallE2eLatencyCard/>
    </v-layout>
  </v-container>
</v-flex>
</template>

<script  >
import TheOverallE2ePdrCard from '@/components/TheOverallE2ePdrCard'
import TheOverallE2eLatencyCard from '@/components/TheOverallE2eLatencyCard'

export default {
  components: {
    TheOverallE2ePdrCard,
    TheOverallE2eLatencyCard
  }
}
</script>
