import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
//创建vue的一个实例对象
const store = new Vuex.Store({//const只读
  state: {//放数据的
    song:{//歌曲数据
      isPlay:false,//是否播放
      url:'',//当前歌曲地址
      name:'',//歌名
      picUrl:'',//图片
      pic_str:'',//播放背景图片//在详情赋值
      lyric:[],//歌词{time：0s，content：‘歌词’ ，间隔：}
      activeIndex:0,//当前歌词激活位置
    },
  },
  getters:{//在组件中得到state
  	song :state =>state.song,//得到对象
  },

  mutations: {//同步处理state  里面是方法，方法里面有两个参数
  	updateSong(state,playload){//更新歌曲；state;playload就是更新为的值
  		state.song = playload;//将playload数据全部替换为song里面数据
  	},   
  },
  actions:{//异步处理

  },
})

export default store;//输出