<template>
  <div class="title">
    <slot></slot><!-- 则自定义组件可以写内容 -->
  </div>
</template>

<script>


export default {

}
</script>

<style lang="scss" scoped>
.title{
  display: flex;
  align-items: center;//
  height: 108px;
  font-size: 32px; /*px*/
  &:before{
    content: '';
    width: 4px;
    height: 31px;
    background: #d33a31;
    margin-right: 14px;
  }
}
</style>
