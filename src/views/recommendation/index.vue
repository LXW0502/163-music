<template>
  <div>
    <app-nav></app-nav>
    <app-title>推荐歌单</app-title>
    <ul class="imgText-list">
    	<li v-for="item in imgTextData" :key="item.id"> <!-- 得到网易的真实数据 - -->
	      <router-link :to="''+item.id"><!-- 里面有图片和定位耳机 :to一定要写，不然没有图片效果 希望传的是字符串，所以加''-->
	       	<div class="img"><!-- 图片模块 -->
	       	  <img :src="item.picUrl" alt=""><!-- 图片 -->
	       	  <span><i class="fa fa-headphones"></i>{{(item.playCount/1000).toFixed(1)+"万"}}</span><!-- 耳机图标、播放数 -->
	       	</div>
	       	<div class="text"><!-- 文字模块 -->
	       		{{item.name}}
	       	</div>	       	 
	      </router-link>	
	    </li> 
    </ul>
  </div>
</template>

<script>
import appNav from '@/components/app-nav'
import appTitle from '@/components/app-title'
import {getPersonalized} from '@/api/recommendation'
export default {
  data(){
    return {
      imgTextData: [],//推荐歌单的数据,数据从getPersonalized接口里面获取
      newSongData: [],//新音乐数据
    };//返回的是对象，结束
  },
  created(){
  	this.getPersonalized();//组建被创建的时候触发，已经得到数据层了，就可以在network看见此接口及其数据了
  },
  methods:{
  	getPersonalized(){//定义一个和接口一样的方法名，只是定义要在created中触发
	  getPersonalized({//使用接口
		params:{//传参
			limit:6
		}
	  }).then(res =>{
	  	var data = res.data;
        if(data.code == 200){//biaoshi成功
          this.imgTextData = data.result;//得到数据
        }
	  })
  	}
  },
  components: {
    appNav,
    appTitle,
  }
}
</script>

<style lang="scss">
.imgText-list{
	display:flex;//默认所有元素横向排列，不可能换行
	flex-flow: wrap;//flex布局换行
	&>li{//可加快选择器的查找
	   display:flex;
	   width:33.33%;
	   a{//a是行，不能包裹div，要变成块
		  display:block;
	   }
	}
	.img{
		position:relative;//相对定位
		width:245px;
		height:245px;
		overflow: hidden;//溢出隐藏
		img{
			width:100%;
		}
		span{
			position:absolute;//耳机绝对定位
			right:12px;
			top:10px;
			color:#fff;
			font-size: 22px;/*px*///字体最好用培训做单位
		}
		.fa-headphones{
			margin-right: 6px;
		}
	}
	.text{//块
		margin: 12px 12px 32px;
		font-size:30px;/*px*/
		line-height:34px;/*px*/ //最好写字体的倍数
		height:68px;/*px*/
		//多行省略号
		overflow : hidden;
		text-overflow: ellipsis;//溢出就变省略号
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}
}

</style>
