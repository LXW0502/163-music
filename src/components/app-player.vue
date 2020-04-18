<template>
  <div class="player" v-show="isShowPlayer"><!-- 有播放器存在,但隐藏 v-if则这个值第一次不存在-->
    <audio ref="audioNode" :src="url" controls="controls" class="song-audio" autoplay="true"></audio><!-- ref:vue得到节点的一个标记  autoplay:标签属性，第一次赋值，加载完成即播放音频，--> 
  </div>
</template>

<script>


export default {
  mounted(){//对节点的操作，只有在mounted节点才存在，在详情页得到
    this.$refs.audioNode.onpause = () =>{//播放器暂停的时候的操作
      this.song.isPlay = false;
      this.$store.commit('updateSong', this.song);
    };
    this.$refs.audioNode.onplay = () =>{//播放器播放的时候的操作
      this.song.isPlay = true;
      this.$store.commit('updateSong', this.song);
    };

    this.$refs.audioNode.ontimeupdate = ()=>{
      //console.log(this.$refs.audioNode.currentTime, this.$refs.audioNode.duration)
      //this.lyric[this.actvieIndex].time//当前歌词开始的时间点
      //this.$refs.audioNode.currentTime//当前歌播放的时间点
      var currentTime = this.$refs.audioNode.currentTime;
      for(var index = 0; index < this.lyric.length; index++){
        var item = this.lyric[index];
        if(currentTime < item.time){
          this.song.activeIndex = index == 0 ? 0 : index - 1;
          break;
        }
      }
      //console.log(this.song.activeIndex)
      this.$store.commit('updateSong', this.song);
    };
  },
  computed: {//计算属性
    song(){//得到歌song的数据
      return this.$store.getters.song;
    },
    url(){//歌的url，在song中得到url的数据
      return this.song.url;
    },
    isPlay(){
      return this.song.isPlay;
    },
    isShowPlayer(){//是否显示播放器
      return this.url != '' && this.url != null
    },
  },
  watch: {//监听是否播放isPlay通过song得到的
    isPlay(newval,oldval){
      // console.log( this.$refs.audioNode);
      if(newval){
        this.$refs.audioNode.play();
      }
      else{
        this.$refs.audioNode.pause();
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.player{
  //位于页面中间
  position: fixed;//固定定位
  right: 0;
  top: 50%;
  transform: translate(0, -50%);//-50%高度的50%，确保一定在中间位置
  z-index: 99999;
}
</style>
