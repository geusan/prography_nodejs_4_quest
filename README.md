# 과제 완성

프로젝트 실행 순서

```bash
  // Gecko 브라우저가 없는경우
  brew install geckodriver

  // 프로젝트 dependencies 설치
  npm install

  // 프로젝트 빌드
  npm run build

  // 프로젝트 실행
  npm run start

  // 개발모드 실행
  npm run dev
```


기록
1. Axios + JSDom 조합으로 크롤링 진행 => 인코딩에서 막힘
2. Iconv 를 이용해서 인코딩을 변환을 시도해보았으나 깨진 문자를 돌릴 수 없음
3. Selenium과 Gecko 브라우저로 페이지만 get
4. 휴우 다해따

느낀점

*euc-kr은 왜 쓰는 걸까?*

자꾸 까먹는 데, 커밋 좀 자주하자. 커밋안하면 하라고 알려주는 알림 프로그램 있으면 좋겠다.