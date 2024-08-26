---
tags:
  - terms
  - network
date: 2024-05-26
---
## 란?

- 일단 *SOP (Same Origin Policy)* 에 대해 짚고 넘어가면
    - SOP의 경우에는 뭐 당연하게도 어지간한 문제가 발생하지 않는다 → 출처가 같은데 뭐 더 할게 있나
    - 하지만 웹상에서는 같은 출처의 정보만 이용해서 뭔가를 하기에는 너무 힘들고 비효율적이기 때문에 다른 출처의 정보도 가져다가 사용하는 것을 일부 허용한다.
    - ‘일부’ 란 말을 굳이 한 이유는 제한된 (예외적인) 상황에서만 이게 허용되기 때문이다.
        - 무지성으로 전부다 되는게 아니다 이거야
        - 이 예외사항을 명시한게 *CORS (Cross-Origin Resource Sharing)* 이다.
- 즉, Origin (Scheme/Protocol + Host + Port) 가 다른 요청에 대해 응답받은 자원을 사용할까 말까에 대한것이다.

### Origin 판단 규칙

- _Protocol(Scheme)_ + _Host_ + _Port_ 세가지로 판단하기는 하는데
- 포트에 대해서는 생략할 수도 있고 브라우저마다 구현방식이 달라 좀 애매하다
- 하지만 포트까지 같다면 무조건 같은 출처이기 때문에 걍 포트까지 다 맞춰라 (앵간하면 포트가 다르면 다른 출처로 판단하긴하더라)

### CORS 작동원리 (일반 요청)

- 일단 가장 핵심은 CORS 를 판단하는 주체는 브라우저라는 것이다
- 즉, 서버에서 `200` 으로 줘도 CORS 에러가 날 수 있다.
- 일반적인 경우에 CORS 가 판단되는 과정은 다음과 같다

1. 클라이언트는 서버에게 _Preflight_ 을 날린다
    - 너가 몰랐던 내용일텐데 이전에 OPTIONS HTTP Method 가 어디 사용되는지 궁금해했었제?
    - 클라이언트가 서버에게 날리는 (거의 모든) 요청에는 Preflight가 먼저 날라가서 요청이 가능한지 확인하고
    - 요청이 가능할때 본 요청이 날라가는 방식으로 작동한다.
    - 이때 사용되는 HTTP Method 가 OPTIONS 이며 요청이 가능한지 확인하는 것 외에도 어떤 HTTP Method 를 사용할 것인지, 어떤 헤더를 보낼 것인지 서버에게 미리 알려주는 역할도 한다
    - 어쨋든 CORS 에서의 Preflight 의 핵심은 클라이언트의 `Origin` 헤더를 request header 에 붙여서 보내고, 서버는 response header 에 `Access-Control-Allow-Origin` 헤더로 CORS 를 허용하는 Origin 들을 알려주는 방식으로 Preflight 가 진행된다.
    - 즉, 이 시점에는 CORS Validation 이 이루어지지 않는다 → 걍 클라이언트는 클라이언트대로 설정된 Origin 을 보내고 서버는 서버 대로 설정된 CORS Allow Origin 만을 보낸다
2. Preflight 이후 브라우저는 Request header 의 `Origin` 헤더와 Response header 의 `Access-Control-Allow-Origin` 헤더를 비교하며 CORS 를 체크한다
    - 만일 두 값이 다르거나 `Access-Control-Allow-Origin` 이 설정도어있지 않으면 CORS 에러를 뱉는다.
3. Preflight 에서 CORS 가 발생했을 때는 본 요청을 보내지 않고 끝난다.

### CORS 작동원리 (인증 요청)

- 아마 로그인 구현하면서 이부분때문에 아주 애를 먹었을텐데
- 일단 기본적으로 `fetch()` 이나 `XMLHttpRequest` 는 인증과 관련된 헤더나 쿠키를 CORS 요청에 담지 않는다
- 만일 담고싶은 경우에는 `credentials` 옵션을 설정해줘야 한다 → 얘는 HTTP 헤더는 아닌거같은데
    - 일단 default 는 `same-origin` 이다 → 즉, 출처가 같으면 당연히 인증 혹은 쿠키가 담긴다
    - `include` 는 CORS 한 환경에서도 담을 수 있도록 해주는 옵션이고
    - `omit` 은 절대 담지 않는다는 거다
- 그래서 너가 `include` 로 설정해서 요청을 날리면 되긴 하는데 이때에는 CORS Validation 에 한가지 제약이 더 붙는다
- 바로 → `Access-Control-Allow-Origin` 헤더의 값이 `*` 면 안된다는 것
    - 즉, 모든 출처를 순풍순풍 받아들이겠다는 `*` 값은 `include` 일때는 사용할 수 없다
    - 따라서 반드시 허용할 출처를 명확히 명시해주어야 한다
- 정리해보면 다음과 같음 → 쿠키나 인증을 클라이언트 - 서버 간 와리가리하고싶다면
    1. 클라이언트에는 `credentials: include` 로 설정해주어야 한다
    2. 서버에는 `Access-Control-Allow-Origin` 값으로 `*` 가 아닌 명확한 출처를 헤더에 넣어야 한다.

## 추가적으로 읽어볼만한

- 나중에 [RFC6454](https://datatracker.ietf.org/doc/html/rfc6454) 도 한번 읽어보는 것도 나쁘지 않을거같음
- [CORS 설명과 이거 해결하는 방법 소개](https://evan-moon.github.io/2020/05/21/about-cors)
	- 특히 프론트딴에서 webpack 플러그인 중 proxy 플러그인 부분은 눈여겨볼만하다