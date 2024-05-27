

- OCSP
    - CA 혹은 CA 가 위임한 어떤 단체가 OCSP 서버를 운영한다
    - 이것도 마찬가지로 client 가 인증서를 받아들고 OCSP 서버에게 이 인증서가 revoke 되었는지 물어보는 형태로 진행된다
    - 이렇게 하면 revocation 정보를 실시간으로 반영할 수 있어 CRL 의 문제를 해결할 수 있다
    - 문제는 OCSP 서버가 client 가 어디 방문했는지 추적할 수 있기 때문에 privacy 문제가 있고
        - 이것은 Stapling 이라는 것으로 해결한다: client 가 OCSP 에 물어보는 것이 아니고 웹서비스 server 가 OCSP 에 물어보는 것
    - 두번째 문제는 OCSP 서버에 접근하지 못할 경우 client delay 가 걸리게 된다는 것이다
        - 이것은 soft-fail 방식으로 타협한다: 응답이 안오면 문제가 없는 것으로 판단한다는 것