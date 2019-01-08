<template>
<v-card width="200px">
  <v-tooltip bottom>
    <div slot="activator">
      <v-card-title>Overall E2E PDR</v-card-title>
      <v-card-text>
        <p class="title">PDR: {{ pdr }}</p>
        <div>Send: {{ appTxNum }}</div>
        <div>Recv: {{ appRxNum }}</div>
        <div>Drop: {{ appDropNum }}</div>
      </v-card-text>
    </div>
    <span>
      End-to-end Packet Delivery Ratio in the entire simulation
    </span>
  </v-tooltip>
</v-card>
</template>

<script>
export default {
  computed: {
    appTxNum () { return this.$store.state.appTxNum },
    appRxNum () { return this.$store.state.appRxNum },
    appDropNum () { return this.$store.state.appDropNum },
    pdr () {
      if (this.appTxNum === 0) {
        return 'N/A'
      } else {
        return (this.appRxNum / this.appTxNum * 100).toFixed(3).toString() + '%'
      }
    }
  }
}
</script>
