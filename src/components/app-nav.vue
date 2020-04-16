<template>
  <div class='nav'>
    <router-link :class="{ active: activeIndex == index }" v-for="(item,index) in navData" :key="item.name" :to="item.to">{{ item.name }}</router-link>
  </div>
</template>

<script>
export default {
	data(){
	    return {//导航数据
	      navData: [
	        { name: '推荐音乐', to: '/'},
	        { name: '热歌榜', to: '/hot'},
	        { name: '搜索', to: '/search'},
	      ],
	      activeIndex: 0,//索引那个选中显示红色下划线
	    };
	  },
}
</script>

<style lang="scss" scoped>
.nav{
  position: fixed;
  left: 0;
  top: 0;
  z-index: 99;
  width: 100%;
  background: #fff;
  display: flex;
  justify-content: center;//水平居中
  border-top: 1px solid #d43c33;/*no*/
  border-bottom: 1px solid #cccccc;/*no*/
  box-sizing: border-box;
  height: 81px;
  font-size: 28px;/*px*/
  a{
    display: flex;
    align-items: center;//垂直居中
    padding:0 10px;//左右都是10
    border-bottom: 4px solid transparent;//选中有下划线，其他的 transparent透明
    transform: translate(0,1px);/*no*/ //整体的a进行一个偏移，使下划线重叠
    margin: 0 60px;//都有左右的60
    &.active{//选中显示红色
      color: #dd001b;
      border-bottom-color: #dd001b;
    }
  }
}
</style>
