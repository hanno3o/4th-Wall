export const boardNames = {
  TaiwanDrama: '台劇版',
  KoreanDrama: '韓劇版',
  JapaneseDrama: '日劇版',
  AmericanDrama: '美劇版',
  ChinaDrama: '陸劇版',
};

export const filterData = {
  type: ['所有影集', '台劇', '韓劇', '日劇', '美劇', '陸劇'],
  filters: [
    {
      title: '類型',
      filter: [
        '愛情',
        '喜劇',
        '劇情',
        '奇幻',
        '穿越',
        '懸疑',
        '校園',
        '刑偵犯罪',
        '復仇',
        '律政',
        '職場',
        '醫療',
        '音樂',
        '時代',
        '古裝',
      ],
    },
    {
      title: '排序',
      filter: ['新上架', '評價最高', '由新到舊', '由舊到新'],
    },
    {
      title: '年份',
      filter: [
        2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012,
        2011, 2010,
      ],
    },
    {
      title: '平台',
      filter: ['Netflix', 'Disney+', 'LINE TV', '愛奇藝', 'Friday影音', 'KKTV'],
    },
  ],
};
