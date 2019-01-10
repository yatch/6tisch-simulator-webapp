import Vue from 'vue'

// <script src="/eel.js"/> MUST be loaded before loading the Vue code

const eel = {
  install (Vue) {
    Vue.prototype.$_eel = window.eel
  }
}

Vue.use(eel)
