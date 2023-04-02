import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Title = styled.h1`
  font-size: 24px;
  background-color: #4e4d4d;
  padding: 30px;
  height: 70px;
  color: #fff;
`;
function Article() {
  return (
    <Wrapper>
      <Title>[新聞] 李到晛鬆口談《黑暗榮耀》第三季去向！</Title>
      <p className="p-4 leading-6 mt-8 mx-6">
        眼睛怕到無法直視「崔惠程嗆聲朴涎鎮」
        <br />
        李到晛因演活《黑暗榮耀》中朱如炡一角，人氣持續飆漲中，
        <br />
        近日他接受雜誌專訪時也談到拍攝的幕後花絮，然而被問到是否有第三季？他也保守的表示
        「我也希望有第三季，但我不會多做發言的」。
        <br />
        李到晛透露《黑暗榮耀》中朱如炡的名台詞是在劇中，
        <br />
        他看到文同珢的全身燙傷後，願意為對方報仇所說的台詞：「我願意當劊子手，我願意跳行
        刑舞」，他也透露原因是「那個場景對我來說很特別」。
        <br />
        https://www.kpopn.com/2023/03/21/the-glory-lee-do-hyun-season-news
        <br />
        <br />
        <br />
        最近突然有很多《黑暗榮耀》第三季的消息 連李到晛都說希望有第三季
        <br />
        依照第二季的走向 《黑暗榮耀》第三季出來會很突兀嗎?
        <br />
        大家會希望能看到《黑暗榮耀》有第三季嗎?
        <br />
      </p>
      <div className="p-4 leading-6 mt-4 mx-6 h-96">
        <hr className="my-4"></hr>
        <div className="flex justify-between w-full">
          <div>furri: 韓國人說要當演員的人都開去看金編的劇，是教科書</div>
          <div>03/27 22:26</div>
        </div>
        <div className="flex justify-between w-full">
          <div>hanno3o: 到底要以編劇為主還是演員為主 還是觀眾自己解讀為主</div>
          <div>03/27 23:04</div>
        </div>
        <div className="flex justify-between w-full">
          <div>oliva: 最近重溫鬼怪， 金編的台詞都很有深度</div>
          <div>03/28 00:26</div>
        </div>
        <div className="flex justify-between w-full">
          <div>jpeg: 結果演員跟編劇想法不太一樣，這也是很妙XD</div>
          <div>03/28 00:34</div>
        </div>
      </div>
    </Wrapper>
  );
}

export default Article;
