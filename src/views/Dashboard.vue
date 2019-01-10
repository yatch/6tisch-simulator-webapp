<template>
<v-flex xs12>
  <v-container grid-list-sm>
    <v-layout
      row
      wrap
      >
      <TheOverallE2ePdrCard/>
    </v-layout>
  </v-container>
</v-flex>
</template>

<script  >
import TheOverallE2ePdrCard from '@/components/TheOverallE2ePdrCard'

export default {
  components: {
    TheOverallE2ePdrCard
  }
}
</script>
