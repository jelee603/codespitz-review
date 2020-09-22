**sync Flow** 

- 명령이 순차적으로 실행됨

- Goto를 통해 명령의 위치를 이동함

- 명령셋을 여러번 실행함
- 서브루틴이 즉시 값을 반환함

**blocking**

- 하나의 스레드에서 다른 일을 할 수 없는 현상

- 해결방법
  - sync flow 를 짧게, 루프를 짧거나 알고리즘을 줄이자
  - 다른 스레드의 싱크 플로우를 넘기자

**non blocking**

- 납득할 만한 시간 내에 종료되는 것
- 16ms -> 초당 60 프레임을 그릴 수 있으니깐 허용가능
- 갤럭시 최저 144Hz : 16ms -> 8ms 가 되서 타임 버핏이 내려가고 있다. 
- 한 프레임 당 8ms, 6ms 안에 들어오게끔 되었다

**async** 

- 서브 루틴이 다른 수단으로 값을 반환함
- promise 
- callback 
- iteration

**sync 장점 + aync 의 장점**

- 싱크 상태를 가지고 있다가 내부적으로 async 가 반복 되고 있는 coninuation 
- 이를 활용하는 프로그래밍 - continuation passing style
- generator
- async
- aysnchrous iterators