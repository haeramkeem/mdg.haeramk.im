---
tags:
  - os
  - memory
date: 2024-05-13
---
> [!info]- 참고한 것들
> - [[08. 가상메모리|충남대 컴퓨터공학과 류재철교수님 운영체제 강의 (Spring 2021)]]

## TLB?

- 얘는 저장장치의 한 종류인데
- 보통 하나의 값을 배열에서 찾거나 할때는 처음부터 serial하게 쭉쭉 찾아나가자네?(O(n))
- 근데 이걸 사용하면 배열의 모든 원소를 한번에 비교해 원하는 값을 찾는 것 같은 기능을 제공해준다(O(1))
- 저장장치의 한 종류이므로 하드웨어이고 이런 강력한 기능을 제공하는 대신 좀 비싸다
- Virtual -> physical memory ddress translation을 담당하는 lookaside buffer를 *Traslation Lookaside Buffer(TLB)* 라 하고 얘는 레지스터의 한 종류이다

### 얘를 이용해 address translation을 하는 방법

![%E1%84%8B%E1%85%B5%E1%84%85%E1%85%A9%E1%86%AB08%20-%20%E1%84%80%E1%85%A1%E1%84%89%E1%85%A1%E1%86%BC%E1%84%86%E1%85%A6%E1%84%86%E1%85%A9%E1%84%85%E1%85%B5%2048fbd51ffbd241b6acc55a40c98ab65f/image10.png](gardens/os/originals/os.spring.2021.cse.cnu.ac.kr/images/8/image10.png)

1. Page table의 일부분을 저 TLB로 올린다
2. 이제 가상주소 하나를 translation할 때 page# 을 저기 TLB에 먼저 넣어본다
3. 만약에 hit(찾음) 이면 바로 frame# 가 나오게 되고 miss(못찾음) 이면 이제 그제서야 page table로 가서 serial하게 찾게 된다 - page table의 일부분만 TLB에 올라갈 수 있으므로 miss될 수 있다
4. 찾으면 Locality를 활용하기 위해 TLB에 이 page를 넣어놓는다 - 또 사용되면 빠르게 hit시키기 위해 → 그리고 translation을 해 frame# 을 얻어내는 것
5. 하지만 page table에서 봤더니 얘가 메모리에 없을 수도 있다 - 그러면 page fault handling routine이 실행되어 이놈을 갖고오고 처음부터 다시 하게 되는 것
- 이 방법은 운이 없어서 miss가 뜨면 TLB에 접근하는 시간만큼 손해이긴 하다
- 하지만 위에서 말한 Locality를 이용하면 hit의 비율을 90퍼센트 이상으로 끌어올릴 수 있고 이러면 serial하게 비교하는 경우가 거의 없기 때문에 아주 빠르게 address translation이 가능하다