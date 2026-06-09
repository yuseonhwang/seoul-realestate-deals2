// api/get-deals.js
const fetch = require('node-fetch');

module.exports = async (req, res) => {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 서울 주요 지역구별 가상 중심 좌표 (구현 예시를 위해 강남, 서초, 마포 등 세팅)
  // 실제 서비스 시에는 위경도 바운더리(cortarNo 등)를 유동적으로 받도록 확장 가능
  const { region } = req.query;
  
  // 네이버 부동산 모바일 API 호출 (아파트, 빌라, 주택 매매 조건 필터링)
  // rletType: A01(아파트), A02(빌라/연립), H01(단독/다가구) | tradTp: A1(매매)
  const url = `https://m.land.naver.com/cluster/ajax/articleList?rletTpCd=A01%3AA02%3AH01&tradTpCd=A1&z=12&lat=37.5665&lon=126.9780&cortarNo=${region || '1168000000'}&page=1`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
        'Referer': 'https://m.land.naver.com/'
      }
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: '데이터를 가져오는데 실패했습니다.', details: error.message });
  }
};