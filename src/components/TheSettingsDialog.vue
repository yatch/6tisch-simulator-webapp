<template>
<div>
  <v-dialog
    v-model="$_app_settingsDialog"
    persistent
    width="500px"
    >
    <v-tabs
      fixed-tabs
      icons-and-text
      v-model="active"
      >
      <v-tab
        v-for="item in items"
        :key="item.name"
        >
        {{ item.name }}
        <v-icon>{{ item.icon }}</v-icon>
      </v-tab>
      <v-tab-item :key="items[0].name">
        <TheSimpleConfiguratorTab/>
      </v-tab-item>
      <v-tab-item :key="items[1].name">
        <TheConfigFileUploadTab/>
      </v-tab-item>
      <v-tab-item :key="items[2].name">
        <TheConfigFileDownloadTab/>
      </v-tab-item>
    </v-tabs>
  </v-dialog>
</div>
</template>

<script>
  import App from '@/mixins/App'
  import TheSimpleConfiguratorTab from '@/components/TheSimpleConfiguratorTab.vue'
  import TheConfigFileUploadTab from '@/components/TheConfigFileUploadTab.vue'
  import TheConfigFileDownloadTab from '@/components/TheConfigFileDownloadTab.vue'

  export default {
  components: {
    TheSimpleConfiguratorTab,
    TheConfigFileUploadTab,
    TheConfigFileDownloadTab
  },
  mixins: [App],
  data () {
    return {
      active: null,
      items: [
        { name: 'Edit', icon: 'edit'},
        { name: 'Upload', icon: 'cloud_upload' },
        { name: 'Download', icon: 'cloud_download' }
      ]
    }
  }
}
</script>
