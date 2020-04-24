<template>
  <div class="song"  :style="{ backgroundImage: 'url(http://music.163.com/api/img/blur/'+song.pic_str+')' }"><!-- 模糊背景的接口 -->
    <div class="song-wrap"><!-- 背景蒙层，用定位做 -->
      <div class="clearfix" @click="songFun" :style="{ height: screen.height + 'px' }"><!-- 点开来是一屏,得到高度 -->
        <div class="song-player" ref="songPlayerNode">
          <i class="pointer" :style="{ transform: song.isPlay ? 'rotate(20deg)' : 'rotate(0deg)' }"></i><!-- 播放动画 -->
        	<i class="img-bg" :style="{ 'animation-play-state': song.isPlay ? 'running' : 'paused' }"></i><!-- 圆盘作为背景  animation-play-state暂停属性通过是否播放判断-->
        	<div class="img" :style="{ 'animation-play-state': song.isPlay ? 'running' : 'paused' }"><!-- 图片也一起转 同时要在样式加实际动画名-->
        		<img :src="song.picUrl" alt="">
        		<i class="status" v-show="!song.isPlay"></i>
          </div>
        </div>

  <!-- 歌词 -->
        <div class="lyric" :style="{ height: screen.lyricHeight + 'px' }">
          <div class="lyric-wrap">
            <ul class="lyric-list" :style="{ 'transition-duration': transitionDurationTime, transform: 'translate(0, '+ -activeIndex*(80/75) +'rem)'}"><!-- 动画滚动 动态算时间 行高80-->
              <li :class="{ active: index == activeIndex }" v-for="(item,index) in song.lyric" :key="index">{{ item.content }}</li>
            </ul>
          </div>
        </div>
      </div>
<!-- 喜欢听这首歌的人也喜欢 ，一键收听  -->  
      <div class="simi">
        <div class="simi-title">喜欢这首个歌的人也听 <a class="fa fa-play-circle-o" @click="pushSongs" href="javascript:;">一键收听</a></div><!-- 点击对所有歌的id收集 -->
        <ul class="simi-list">
          <li v-for="item in simiSong" :key="item.id" @click="$router.replace(`/song/${item.id}`)">
            <div class="simi-song">
              <img :src="item.picUrl" alt="">
              <dl>
                <dt>{{ item.name }}</dt>
                <dd>{{ item.artist }} - 歌手·{{ item.albumName }}</dd>
              </dl>
            </div>
            <i class="fa fa-play-circle-o"></i>
          </li>
        </ul>
      </div>

    </div>
  </div>
</template>

<script>
import { Toast } from 'mint-ui';
import { getSongUrl,getSongDetail,getSongLyric,getSimiSong } from '@/api/song';

export default {

  
  data () {
    return {
      song:{
        id:this.$route.params.id,//通过路由获取
      	isPlay:true,//是否播放 
        name:'',//歌名
      	url:null,//歌的url
        picUrl:'',//图片
        pic_str:'',//播放背景图片//在详情赋值
        lyric:[],//歌词{time：0s，content：‘歌词’ ，间隔：}
        activeIndex:0,//当前歌词激活位置
      },

      simiSong: [],//相似歌曲
     
      screen: {
        height: null,//屏幕的高度,以px作为单位返回的值
        lyricHeight: null,//歌词可以占据的高度,以px作为单位返回的值
      },

      transitionDurationTime:0,//过渡的动画时间
    };
  },
  mounted(){//涉及节点操作，写在这里，希望得到song-player的节点高度
    //固定屏幕高度
    var dpr = document.documentElement.getAttribute('data-dpr');//
    var windowResize = ()=>{
      this.screen.height = window.screen.height * dpr;
      this.screen.lyricHeight = this.screen.height - this.$refs.songPlayerNode.clientHeight - this.$refs.songPlayerNode.offsetTop;//clientHeight得到可视高度
      
      //console.log(this.screen.height, this.screen.lyricHeight)
    };
    window.onresize = windowResize;//事件，名字
    windowResize();//默认时触发一次
  },

  async created(){//异步变同步处理的、触发接口
    //此三个接口，同步执行，目的是为了得到一首歌的完整信息
    await this.getSongDetail();
    await this.getSongLyric();
    //保证得到歌曲详情歌词，在得到url
    this.getSongUrl();
    /*this.$nextTick(()=>{//节点渲染完毕后触发运行一次,宏任务
       this.$store.commit('updateSong', this.song);
     });*/
     this.getSimiSong();
  },

  methods:{
  	songFun(){
  		this.song.isPlay = !this.song.isPlay;//点击切换播放状态
      this.$store.commit('updateSong', this.song);//点击的时候song的信息 到播放器

  	// 	if(this.song.isPlay){
			// this.$refs.audioNode.play();
  	// 	}
  	// 	else{
  	// 		this.$refs.audioNode.pause();
  	// 	} 		
  	},
//一键收听，将歌的id加入播放器列表
    pushSongs(){
      var payload = this.simiSong.map(itme => itme.id);//等价this.simiSong.map(itme =>{ return itme.id;});
      //
      Toast('收听成功！');
      this.$store.commit('updateSongList',payload);
    },   
//歌url接口
  	getSongUrl(){
      return new Promise((resolve,reject) =>{
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
              if(this.url != song.url){//computed获取当前歌曲的url，当前url遇得到的song的url一样，是同一首歌，则不做重新播放处理
                this.song.url = song.url;//得到url
                this.songFun();//进入个群详情就播放：得到接口后就手动触发一次，songFun
              }
            }
          }
          resolve(true);
        });
      });
    },
//歌详情接口
    getSongDetail(){
      //返回Promise的实例对象
      return new Promise((resolve,reject) =>{
        var ids = this.$route.params.id;
        getSongDetail({ 
          params: {
            ids
          }
        }).then(res =>{
          var data = res.data;

          if(data.code == 200){
            // console.log(data);
            // 从接口数据可以得出
            var songData = data.songs[0];
            if(songData){
              var al = songData.al;
              this.song.name = al.name;
              this.song.picUrl = al.picUrl;
              this.song.pic_str = al.pic_str;
              //this.song.id = songData.id;
            }
          }
          resolve(true);//解决
        });
      });
    },
//歌词接口
    getSongLyric(){
      //Promise
      return new Promise((resolve,reject) =>{
        var id = this.$route.params.id;
        getSongLyric({ 
          params: {
            id
          }
        }).then(res =>{
          var data = res.data;
          if(data.code == 200){
            var lyric = data.lrc.lyric
            if(lyric){
              var lyricArr = lyric.split(/\n/);//字符串转数组 换行符
              var newLyricArr = lyricArr.map(item => {//映射会生成一个新的数组，对每一个项映射
                var arrItem = item.split(']');//分割
                var arrTime = arrItem[0].slice(1).split(':');//时间分割
                var time = arrTime[0]*60+Number(arrTime[1]);
                var content = arrItem[1];
                return { 
                  time, 
                  content 
                };
              });
              this.song.lyric = newLyricArr;
              //console.log(newLyricArr)//把歌词结果给song的歌词 数组对象
            }
          }
          resolve(true);
        });
      });
    },
//获取类似音乐接口，只要id就可
    getSimiSong(){
      var id = this.$route.params.id;
      getSimiSong({
        params: {
          id
        }
      }).then(res =>{
        var data = res.data;
        if(data.code == 200){
          this.simiSong = data.songs.map(item=>{
            return {//映射，return的结果作为simiSong的元素
              id: item.id,//歌id
              name: item.name,//歌名
              picUrl: item.album.picUrl,//专辑图片
              albumName: item.album.name,//专辑名
              artist: item.artists[0] ? item.artists[0].name : '未知歌手',//歌手
            };
          })
        }
      });
    },
//得到歌词过渡时间，优化，对空歌词的处理，死循环或者递归
    transitionDuration(){
      var activeLyric = this.song.lyric[this.activeIndex];//当前歌词 this  activeIndex是计算里面来的，与song里面那个无关
      var nextIndex = this.activeIndex + 1;//得到下一个索引
      while(true){//优化，找到下一句有歌词的时间
        var nextLyric = this.song.lyric[nextIndex];//下一个索引的歌词 对象
        if(nextLyric){//下一个索引的歌词 对象存在
          if(nextLyric.content == ''){//歌词为空
            nextIndex++;
          }
          else{
            this.transitionDurationTime = nextLyric.time - activeLyric.time + "s";
            break;//跳出循环
          }
        }
        else{
          this.transitionDurationTime = 0;//无歌词了，结束
          break;//跳出循环
        }
      }
      /*var nextLyric = this.song.lyric[this.activeIndex + 1];//下一句歌词,下一首是否有歌词？？？
      if(nextLyric){
        this.transitionDurationTime = (nextLyric.time - activeLyric.time) + 's';
      }
      else{
        this.transitionDurationTime = 0;
      }*/
      console.log(this.transitionDurationTime)
    },
  },

  computed: {//computed里面的值是从全局的状态获取的
    songStore(){//得到歌song的数据，Store里面得到，可以改名
      return this.$store.getters.song;
    },
    isPlay(){//监听是否播放
      return this.songStore.isPlay;
    },
    url(){//歌的url，在song中得到url的数据
      return this.songStore.url;
    },
    activeIndex(){
      return this.songStore.activeIndex;
    },
  },

  watch:{
    isPlay(newval){//监听现在isplay状态
      this.song.isPlay = newval;//监听到变化给新值
    },
    activeIndex(newval){//监听新值，变化，就触发
      this.transitionDuration();
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
  background: #484848 no-repeat center 0 / auto 100%;//高度100%
}
.song-wrap{
  background: rgba(0,0,0,0.5);//蒙层处理
  overflow-x: hidden;//去横向滚动条
  .lyric{
    box-sizing: border-box;
    padding: 46px 0;
    display: flex;
  }
  .lyric-wrap{
    width:100%;//felx布局，auto，失去块的宽度
    text-align: center;//居中
    color: rgba(255,255,255,0.4);//歌词设为白色灰一点
    font-size: 34px; /*px*/
    overflow: hidden;
    .lyric-list{
      transition-property: transform;//过渡属性
    }
    li{
      min-height: 80px;//歌词最小高度，空的也是如此
      line-height: 80px;//行高
    }
    .active{  color: rgba(255,255,255,1); }//样式，播放到指定歌词变白
  }
}

.song-player{
  display: flex;
  justify-content: center;//水平居中
  align-items: center;//垂直居中
  position: relative;

  width: 585px;
  height: 585px;
  margin: 175px auto 0;
  // overflow:hidden;//去横向滚动条，一个个div去试,往外延
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
    animation: circle 5s linear infinite;//
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
//喜欢听这首歌的人也听模块样式
.simi{
  padding: 0 30px;
  color: #fff;
  font-size: 36px;/*px*/
  .simi-title{
    display: flex;
    justify-content: space-between;//两端对齐
    align-items: center;//垂直居中
    height: 110px;
    .fa-play-circle-o{//一键播放按钮
      border: 1px solid #fff;/*no*/
      border-radius: 24px;//圆角
      padding: 0 16px;
      color: #fff;
      line-height: 48px;
      font-size: 26px;/*px*/
    }
  }
  .simi-list{
    display: flex;
    flex-flow: wrap;//flex换行
    li{
      width: 100%;
      display: flex;
      justify-content: space-between;//两端对齐
      align-items: center;
      height: 120px;
    }
    .simi-song{
      display: flex;
      height: 82px;
      img{
        width: 82px;
        height: 82px;
        border-radius: 5px;
        margin-right: 20px;
      }
      dt{
        font-size: 32px;/*px*/
        line-height: 42px;
      }
      dd{
        font-size: 24px;/*px*/
        color: #b4b0aa;
        line-height: 40px;
      }
    }
    .fa-play-circle-o{
      font-size: 54px;/*px*/
      color: #b4b0aa;
    }
  }
}

// .song-audio{
// 	position:absolute;
// 	top:-100%;
// 	left:-100%;
// }
</style>
