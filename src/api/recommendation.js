import require from '@/utils/require';

export function getPersonalized(oParams){
  return require.get('/personalized', {
    params: oParams.params
  });
};
