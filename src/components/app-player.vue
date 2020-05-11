<template>
  <div class="player" v-show="isShowPlayer"><!-- 有播放器存在,但隐藏 v-if则这个值第一次不存在 v-show="isShowPlayer"-->
    <div class="player-icon" @click="isShowControl = true"><i class="fa fa-music" :style="{ 'animation-play-state': isPlay ? 'running' : 'paused' }"></i></div><!-- 播放器图标设计 -->
    <div class="player-control" v-show="isShowControl"><!-- 整个控制器 -->
      <i class="fa fa-close" @click="isShowControl = false" ></i><!-- X关闭 -->
      <div class="player-audio">
        <div class="palyer-audio-button"><!-- 上一首和下一首切换 -->
          <i class="fa fa-step-backward" @click="palySong(-1)"></i>
          <i class="fa fa-step-forward" @click="palySong(1)"></i>
        </div>
        <audio class="song-audio" ref="audioNode" :src="url" controls="controls" autoplay="true"></audio><!-- ref:vue得到节点的一个标记  autoplay:标签属性，第一次赋值，加载完成即播放音频，-->
          
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from 'mint-ui';
import { getSongUrl, getSongDetail, getSongLyric } from '@/api/song';

export default {
  data(){
    return {
      isShowControl: false,//是否显示播放器控制台
      song: {
        id: null,
        isPlay: true,//是否在播放
        name: '',//歌名
        url: null,
        picUrl: '',//图片
        pic_str: '',
        lyric: [],//{ time: 0, content: '歌词' }
        activeIndex: 0,//歌词激活位置
      },
    };
  },

  methods: {
    async palySong(numSIgn){//numSIgn：-1表示前一首歌，1表示下一首歌
      //console.log(this.songList,this.song.id)
      var activeIndex = this.songList.indexOf(this.songStore.id);//当前歌id的为indexOf索引位置！！！改songStore
      var lastIndex = this.songList.length - 1;
      var nextIndex;
      if(activeIndex == -1){//id得不到
        Toast('出错!');
        return;
      }
      if(numSIgn == -1){//前一首歌
        nextIndex = activeIndex == 0 ? lastIndex : activeIndex - 1;//是否0位置
      }
      else if(numSIgn == 1){//后一首歌
        nextIndex = activeIndex == lastIndex ? 0 : activeIndex + 1;//是否最后位置
      }
      if(nextIndex == activeIndex){//等于当前路由
        Toast('没有更多了!');
        return;
      }
      var nextId = this.songList[nextIndex];//得到下一首歌的id
      var path = this.$route.path;//
      var reg = /^\/song\/\d+$/;
      //console.log(activeIndex,nextIndex,this.songList)
      if(reg.test(path)){//得到路由
        this.$router.replace(`/song/${nextId}`);//路由跳转，replace替换当前路由
      }
      else{
        this.song.id = nextId;//更新新的歌曲的id
        await this.getSongDetail();
        await this.getSongLyric();
        await this.getSongUrl();

        this.$store.commit('updateSong', this.song);//这里跟新歌曲信息
      }
    },

    getSongUrl(){//歌url接口
      return new Promise((resolve,reject) =>{
        var id = this.song.id;//改动!!!!id已经更新
        getSongUrl({ 
          params: {
            id
          }
        }).then(res =>{
          var data = res.data;
          if(data.code == 200){
            var song = data.data[0];
            if(song){
              if(this.url != song.url){//对同一首歌进入不做重新播放处理
                this.song.url = song.url;
                //this.songFun();//更新歌
              }
            }
          }
          resolve(true);
        });
      });
    },
    getSongDetail(){//歌详情接口
      return new Promise((resolve,reject) =>{
        var ids = this.song.id;
        getSongDetail({ 
          params: {
            ids
          }
        }).then(res =>{
          var data = res.data;
          if(data.code == 200){
            var songData = data.songs[0];
            if(songData){
              var al = songData.al;
              this.song.name = al.name;
              this.song.picUrl = al.picUrl;
              this.song.pic_str = al.pic_str;
              //this.song.id = songData.id;//得到歌的id,重复的
            }
          }
          resolve(true);
        });
      });
    },
    getSongLyric(){
      return new Promise((resolve,reject) =>{
        var id = this.song.id;
        getSongLyric({ 
          params: {
            id
          }
        }).then(res =>{
          var data = res.data;
          if(data.code == 200){
            var lyric = data.lrc.lyric
            if(lyric){
              var lyricArr = lyric.split(/\n/);
              var newLyricArr = lyricArr.map(item => {
                var arrItem = item.split(']');
                var arrTime = arrItem[0].slice(1).split(':');
                var time = arrTime[0]*60+Number(arrTime[1]);
                var content = arrItem[1];
                return { 
                  time, 
                  content 
                };
              });
              this.song.lyric = newLyricArr;
              console.log(newLyricArr)
            }
          }
          resolve(true);
        });
      });
    },
  },
  mounted(){//对节点的操作，只有在mounted节点才存在，在详情页得到
    this.$refs.audioNode.onpause = () =>{//播放器暂停的时候的操作
      this.songStore.isPlay = false;//要改songStore！！！！
      this.$store.commit('updateSong', this.songStore);
    };
    this.$refs.audioNode.onplay = () =>{//播放器播放的时候的操作
      this.songStore.isPlay = true;
      this.$store.commit('updateSong', this.songStore);
    };

    this.$refs.audioNode.ontimeupdate = ()=>{
      //console.log(this.$refs.audioNode.currentTime, this.$refs.audioNode.duration)
      //this.lyric[this.actvieIndex].time//当前歌词开始的时间点
      //this.$refs.audioNode.currentTime//当前歌播放的时间点
      var currentTime = this.$refs.audioNode.currentTime;//一直在变
      for(var index = 0; index < this.lyric.length; index++){//找最接近的
        var item = this.lyric[index];
        if(currentTime < item.time){
          this.songStore.activeIndex = index == 0 ? 0 : index - 1;//第一个从0开始；activeIndex是从计算里面来的
          break;
        }
      }
      //console.log(this.song.activeIndex)
      //对song的activeIndex进行更新
      this.$store.commit('updateSong', this.songStore);
    };
  },
  computed: {//计算属性
    songStore(){//得到歌song的数据
      return this.$store.getters.song;
    },
    url(){//歌的url，在song中得到url的数据
      return this.songStore.url;
    },
    isPlay(){
      return this.songStore.isPlay;
    },
    isShowPlayer(){//是否显示播放器
      return this.url != '' && this.url != null
    },
    actvieIndex(){
      return this.songStore.actvieIndex;
    },
    lyric(){
      return this.songStore.lyric;
    },
    songList(){//得到歌曲的列表,状态里面的list
      return this.$store.getters.songList;
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
//动画，设置动画名称
@keyframes circle
{//从0到360度img-bg做动画
  from { transform: rotate(0deg);}
  to {transform: rotate(360deg);}
}
.player{
  //位于页面中间
  .player-icon{
    position: fixed;//固定定位
    right: 0;
    top: 50%;
    transform: translate(0, -50%);//-50%高度的50%，确保一定在中间位置
    display:flex;
    justify-content: center;
    z-index: 99;
    width: 82px;
    height: 86px;
    background: #fff;
    border-radius: 43px 0 0 43px;//左上左下做圆角处理
  }
  .fa-music{
    animation: circle 5s linear infinite;
    //动画动画，可以定义多个属性，动画名 5s转一圈 匀速旋转 永久动画
  }
  .player-control{
    position:fixed;
    left:0;
    top:0;
    z-index:99;
    width:100%;
    height:100%;
    background:#fff;
    .fa-close{
      position:absolute;//绝对定位
      right:10px;
      top:10px;
      font-size:48px;/*px*/
    }
  }
  .player-audio{
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
  }
  .song-audio{
    width: 100%;
  }
  .palyer-audio-button{
    display: flex;
    width: 100%;
    font-size: 42px;/*px*/;
    &>.fa{
      margin: 10px;
    }
  }
}
</style>
