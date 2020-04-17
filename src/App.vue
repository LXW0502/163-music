<template>
  <div id="app">
    <router-view/>
	<app-player></app-player>
  </div>
</template>

<script>
//添加全局组建 全局播放器
import appPlayer from '@/components/app-player';

export default {
  name: 'App',
  components: {
    appPlayer,
  }
}
</script>

<style lang="scss">

</style>
