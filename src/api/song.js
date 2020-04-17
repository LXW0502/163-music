import require from '@/utils/require';

//获取音乐url接口
export function getSongUrl(oParams){
  return require.get('/song/url', {
    params: oParams.params
  });
};

