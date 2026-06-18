<template>
  <div>
    <NavbarView v-if="$route.meta.showNavbar" />
    <router-view />
  </div>
</template>

<script>
import NavbarView from './components/NavbarView.vue'

export default {
  name: 'App',
  components: {
    NavbarView
  }
}
</script>