<!-- 
  App.vue
  Root component that manages layouts
-->
<template>
  <div id="app">
    <!-- Dynamic layout component -->
    <component :is="currentLayout">
      <router-view />
    </component>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

// Import layouts
import DefaultLayout from './layouts/DefaultLayout.vue';
import AdminLayout from './layouts/AdminLayout.vue';
import BlankLayout from './layouts/BlankLayout.vue';
import ClientLayout from './layouts/ClientLayout.vue';

const route = useRoute();
const layoutName = ref('default');

// Lifecycle
onMounted(() => {
  // 移除调试日志
});

// Determine which layout to use based on the route's meta.layout property
const currentLayout = computed(() => {
  // 移除调试日志
  const layout = route.meta.layout || 'default';
  layoutName.value = layout;

  // Return the corresponding layout component
  switch (layout) {
    case 'admin':
      return AdminLayout;
    case 'blank':
      return BlankLayout;
    case 'client':
      return ClientLayout;
    default:
      return DefaultLayout;
  }
});

// Monitor layout changes
watch(currentLayout, (newLayout) => {
  // 移除调试日志
});
</script>

<style>
/* Global styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Arial', sans-serif;
  color: #333;
  line-height: 1.6;
  width: 100%;
  height: 100%;
}

#app {
  width: 100%;
  min-height: 100vh;
}

a {
  text-decoration: none;
  color: inherit;
}

ul {
  list-style: none;
}
</style>
