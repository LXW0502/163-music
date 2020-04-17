<template>
  <div class="song clearfix" @click="songFun">
    <div class="song-player">
    	<i class="pointer" :style="{ transform: song.isPlay ? 'rotate(15deg)' : 'rotate(0deg)' }"></i><!-- 播放动画 -->
    	<i class="img-bg" :style="{ 'animation-play-state': song.isPlay ? 'running' : 'paused' }"></i><!-- 圆盘作为背景  animation-play-state暂停属性通过是否播放判断-->
    	<div class="img">
    		<img src="" alt="">
    		<i class="status" v-show="!song.isPlay"></i>
    	</div> 	
    </div>
    <audio ref="audioNode" :src="song.url" controls="controls" class="song-audio"></audio><!-- ref:vue得到节点的一个标记  --> 
  </div>
</template>

<script>
import { getSongUrl} from '@/api/song';

export default {
  name: '',
  data () {
    return {
      song:{
      	isPlay:false,//是否播放 
      	url:null,//歌的url
      }
    }
  },

  created(){
	this.getSongUrl();//触发接口
  },

  methods:{
  	songFun(){
  		this.song.isPlay = !this.song.isPlay;
  		if(this.song.isPlay){
			this.$refs.audioNode.play();
  		}
  		else{
  			this.$refs.audioNode.pause();
  		}
  		
  	},

  	getSongUrl(){//歌url接口
      var id = this.$route.params.id;//id的得到，路由信息对象，里面有params所有信息
      getSongUrl({ 
        params: {
          id
        }
      }).then(res =>{
        var data = res.data;
        if(data.code == 200){//成功
          var song = data.data[0];//只要一首歌
          if(song){
            if(this.url != song.url){//对同一首歌进入不做重新播放处理
              this.song.url = song.url;//得到url
              this.songFun();
            }
          }
        }
      });
    },

  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
//动画，设置动画名称
@keyframes circle
{//从0到360度img-bg做动画
  from { transform: rotate(0deg);}
  to {transform: rotate(360deg);}
}

.song{
  background: #484848 no-repeat center 0 / auto 100%;//
}
.song-player{
  display: flex;
  justify-content: center;//水平居中
  align-items: center;//垂直居中
  position: relative;

  width: 585px;
  height: 585px;
  margin: 175px auto 0;
  .pointer{ //用clearfix去除外边距重叠
    position: absolute;
    left: 44%;
    // transform:translateX(-48px) ;
    top: -175px;//播放头距上距离
    z-index: 8;

    width: 207px;
    height: 315px;
    background: url('~@/assets/img/needle.png') no-repeat center 0 / 168px 244px;
    //引入图片斜杠/后面是background-size图的宽度
    transition: transform 0.5s;//过渡，指定做动画
    transform-origin: 80px 0;//设置顶点为中心旋转，80px
  }
  .img-bg{
    position: absolute;
    left: 0;
    top: 0;
    z-index: 2;
    width: 100%;
    height: 100%;
    background: url('~@/assets/img/disc.png') no-repeat 0 0 / 100% 100%; 

    animation: circle 5s linear infinite;
    //动画动画，可以定义多个属性，动画名 5s转一圈 匀速旋转 永久动画
  }
  .img{
    position: relative;
    z-index: 5;
    width: 370px;
    height: 370px;
    border-radius: 50%;//圆角
    overflow: hidden;
    background: #000;
    // animation: circle 5s linear infinite;//
  }
  .status{
    position: absolute;
    left: 50%;
    top: 50%;
    margin: -50px 0 0 -50px;
    width: 100px;
    height: 100px;
    background: url('~@/assets/img/play-icon.png') no-repeat 0 0 / 100% 100%;
  }
}

.song-audio{
	position:absolute;
	top:-100%;
	left:-100%;
}
</style>
