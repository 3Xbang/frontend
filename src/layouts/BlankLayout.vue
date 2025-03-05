<!-- 
  BlankLayout.vue
  Minimal layout used for login and authentication pages
-->
<template>
  <div class="blank-layout">
    <!-- Debug message -->
    <div class="debug-message">BlankLayout loaded</div>
    
    <!-- Slot for page content -->
    <slot></slot>
  </div>
</template>

<script setup>
// No additional setup needed for this minimal layout
</script>

<style scoped>
.blank-layout {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
}

.debug-message {
  position: fixed;
  top: 10px;
  left: 10px;
  background: rgba(0,0,0,0.7);
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  z-index: 9999;
}
</style> 