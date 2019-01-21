<template>
<v-flex
  xs12
  md3
  >
  <v-tooltip bottom>
    <v-card slot="activator" height="100%">
      <v-card-title class="body-2 pb-0">
        <slot name="title"/>
      </v-card-title>
      <v-card-text class="title">
        <v-layout justify-center>
          <slot name="main-contents"/>
        </v-layout>
      </v-card-text>
      <slot name="sub-contents"/>
    </v-card>
    <span>
      <slot name="help"/>
    </span>
  </v-tooltip>
</v-flex>
</template>
