<template>
  <div>
    <NavbarView v-if="$route.meta.showNavbar" />
    <router-view v-slot="{ Component }">
      <transition name="page" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    <AppToast />
  </div>
</template>

<script>
import NavbarView from './components/NavbarView.vue'
import AppToast from './components/AppToast.vue'

export default {
  name: 'App',
  components: { NavbarView, AppToast }
}
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>