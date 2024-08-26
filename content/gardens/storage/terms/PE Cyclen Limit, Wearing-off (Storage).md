---
tags:
  - 용어집
  - storage
date: 2024-03-16
---
> [!info]- 참고한 것들
> - [블로그 글](https://metar.tistory.com/entry/NAND-flash%EB%9E%80-%EB%AC%B4%EC%97%87%EC%9D%B8%EA%B0%80)
> - [어떤 회사 블로그 글](https://www.tuxera.com/blog/what-is-write-amplification-why-is-it-bad-what-causes-it/)
> - [어떤 글](https://codecapsule.com/2014/02/12/coding-for-ssds-part-2-architecture-of-an-ssd-and-benchmarking/)
> - [카카오 테크 블로그](https://tech.kakao.com/2016/07/14/coding-for-ssd-part-2)

## P/E Cycle Limit, Wearing-off

- Write, erase 를 위해 셀에 전압을 가했을 때 일부 전자가 셀에 잔존하며 점점 쌓이게 되는 문제가 발생한다고 한다.
- 그렇게 쌓이다가 일정 수준을 넘어가면 수명을 다하게 되고, 이것을 *Wearing-off* 라고 한다.
- 따라서 SSD 에는 Write, Erase 작업 수행 횟수 제한이 있고 이걸 *P/E (Program/Erase) Cycle LImit* 이라고 한다.
- 열을 가하면 전자가 튀어 나가 다시 사용 가능해질 수도 있다는 말이 있다 ([진짜?](https://www.theregister.com/2012/12/03/macronix_thermal_annealing_extends_life_of_flash_memory/))