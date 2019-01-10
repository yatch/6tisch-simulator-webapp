<template>
<v-flex
  xs12
  md4
  >
  <v-tooltip bottom>
    <v-card slot="activator" height="100%">
      <v-card-title class="subheading">
        <slot name="title"/>
      </v-card-title>
      <v-card-text class="title">
        <v-layout justify-center>
          <slot name="main-contents"/>
        </v-layout>
      </v-card-text>
      <v-card-text>
        <v-layout justify-center>
          <slot name="sub-contents"/>
        </v-layout>
      </v-card-text>
    </v-card>
    <span>
      <slot name="help"/>
    </span>
  </v-tooltip>
</v-flex>
</template>
