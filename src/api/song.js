import require from '@/utils/require';

//获取音乐url接口
export function getSongUrl(oParams){
  return require.get('/song/url', {
    params: oParams.params
  });
};

//获取歌曲详情接口
export function getSongDetail(oParams){
  return require.get('/song/detail', {
    params: oParams.params
  });
};

//获取歌词接口
export function getSongLyric(oParams){
  return require.get('/lyric', {
    params: oParams.params
  });
};