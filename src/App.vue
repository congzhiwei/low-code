<!--
 * @Description: 
 * @Author: zwcong
 * @Date: 2025-04-17 14:59:55
 * @LastEditors: zwcong
 * @LastEditTime: 2025-04-23 11:07:00
-->
<template>
  <div class="app-container">
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App'
});
</script>

<style lang="less" scoped>
.app-container {
  height: 100vh;
  width: 100vw;
}
</style>
