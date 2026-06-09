// api/get-deals.js (Vercel 내장 모듈 활용 및 네이버 보안 우회 버전)
module.exports = async (req, res) => {
  // CORS 보안 허용 설정
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { region } = req.query;
  const targetRegion = region || '1168000000';
  
  // 네이버가 로봇으로 의심하지 않도록 실시간 타임스탬프(시간값) 추가
  const timestamp = Date.now();
  const url = `https://m.land.naver.com/cluster/ajax/articleList?rletTpCd=A01%3AA02%3AH01&tradTpCd=A1&z=12&lat=37.5665&lon=126.9780&cortarNo=${targetRegion}&page=1&_=${timestamp}`;

  try {
    // 외부 패키지 없이 Vercel 자체에서 지원하는 내장 fetch 함수 사용
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'ko-KR,ko;q=0.9',
        'Referer': 'https://m.land.naver.com/',
        'Origin': 'https://m.land.naver.com'
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: `네이버 서버가 응답하지 않습니다. 상태코드: ${response.status}` });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: '서버 내부 연산 오류 발생', message: error.message });
  }
};