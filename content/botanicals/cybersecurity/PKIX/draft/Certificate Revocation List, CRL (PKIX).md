

- CRL: Certificate Revocation Lists
    - 인증서 소유자는 CA 에게 이 인증서를 revoke 해달라고 요청할 수 있는데
    - 그럼 CA 는 이 정보들을 모아다가 CRL 을 만들어서 공개한다
    - 클라이언트는 서버에 접속할 때 받은 인증서를 검증할 때 이 CRL 을 다운받아 revoke 되지 않았는지 확인한다
    - CRL 이 자주 업데이트되지 않으면 인증서가 revoke 되었다는 것을 나중에 알기 때문에 주기를 짧게 해야 된다