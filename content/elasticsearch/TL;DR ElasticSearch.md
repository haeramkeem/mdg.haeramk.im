## Docker container 띄우기

- [github://deviantony/docker-elk](https://github.com/deviantony/docker-elk) 레포지토리를 이용하면 편하다

```bash
git clone git@github.com:deviantony/docker-elk.git
cd docker-elk
docker compose setup
docker compose up -d
```

## 키바나 접속

- `localhost:5601` 로 접속하면 되고,
- [github://deviantony/docker-elk](https://github.com/deviantony/docker-elk) 에서 설정을 하나도 건드리지 않았다면
	- ID: `elastic`
	- PW: `changeme`
- 이다

## 실습용 데이터 다운로드

1. 키바나에서 `햄버거 아이콘` → `Management` → `Integrations`

![[Pasted image 20231106213630.png]]

2. 검색창에 `Sample Data` 검색

![[Pasted image 20231106213658.png]]

3. 하단의 `Other sample data sets` 에서 세 데이터 모두 추가

## 키바나 웹 IDE 활용

- 햄버거 아이콘 → `Management` → `Dev Tools`

![[Pasted image 20231106214740.png]]