---
tags:
  - mdg
  - sw-eng
  - design-patterns
date: 2026-07-17
aliases:
  - Observer Pattern
---
> [!info] 작물단계: #seed

> [!info]- 참고한 것들
> - [[08. 디자인 패턴|충남대 김현수 교수님 소프트웨어공학 강의 (Fall 2021)]]

## 란?

- 말 그대로 '감시자 (*Observer*)' 를 두는 디자인 패턴이다.
- 좋댓구알과 비슷하다.
	- [[index|주인장]] 이 [뉴스타파 유튜브](https://www.youtube.com/@news_tapa) 에 구독하면, 뉴스타파에서 새로운 영상을 올렸을 때 나에게 알림이 온다.
	- 이건 유튜브 내의 어떤 컴포넌트가 이 채널을 감시하고 있다가, 변화가 있을 때 여기에 구독하고 있는 사용자들에게 알림을 보내는 것이다.
- React 와 같은 웹 프레임워크도 이와같은 *Observer* 패턴으로 작동한다.
	- 웹 프레임워크 안에는 데이터를 저장하는 'Store' 가 있고, 이것을 감시하는 *Observer* 인 'Channel' 가 있다.
	- 그리고 각 component 들은 저 'Channel' 을 subscribe 하게 된다.
	- 그래서 비동기로 서버에서 데이터를 받도록 해두면, 데이터가 들어와 저 'Store' 에 담긴다. 그럼 이것을 'Channel' 이 감지하여 subscribe 하고 있는 component 들에게 publish 하여 각 component 들이 적절한 행동을 취할 수 있도록 하는 것이다.