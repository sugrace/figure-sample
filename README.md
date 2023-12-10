# figure-smple

간단한 도형의 동작을 구현한 과제

## 목차

1. [프로젝트 소개](#프로젝트-소개)
2. [기능](#기능)
3. [라이브러리](#기능)
4. [실행 방법](#실행-방법)

## 프로젝트 소개

리액트의 state를 통한 랜더링 과 이벤트리스너의 이벤트의 발생을 최소화 하도록 노력 했습니다.

- 도형의 변형이 이루어 질때 마다 state를 통해서 변형 시키는것이 아닌, style을 변화 시키고 변화된 도형을 commit 할때 한번 state를 변경 시킴으로써 랜더링을 최소화 했습니다.

- 도형을 만들거나 이동시킬때만 document 이벤트를 발생 시켜서 이벤트 리스너의 이벤트 발생을 최소화 시킵니다.

- useRef Hook을 활용하여 임시적인 변수 저장을 하였습니다.

```
  const tempRect = useRef<Rect | null>(null);
  const tempDelta = useRef<Delta | null>(null);
```

## 기능

### CREATE

- 도형을 생성 합니다.

### DELETE

- 도형을 삭제 합니다.

### MOVE

- 도형을 이동 시킵니다.

### UP & DOWN

- 도형의 zIndex를 변화시켜서 가장위에 보이거나 가장 아래에 보이게 합니다.

### RESIZE

- 도형의 크기를 변형 시킵니다. 변형된 도형(회전상태)의 크기도 Resize 가능 합니다.
- resize 로직은 ResizeHandler 컴포넌트에 있는데, 변수중에 camelCase 가 아닌 A, B, C 등의 대문자 알파벳 변수를 가 있습니다. 이것은 통상 수학 공식이나 표현 법에서 도형의 가로, 세로, 대각선 길이등을 대문자 알파벳으로 표현하는 점을 착안하여 썼습니다.

```
 A = Math.asin(width / 2 / diagonal) * 2;
```

### ROTATE

- 도형을 회전 합니다.

## 라이브러리

- Jotai 전역 상태 관리 라이브러리를 사용 했습니다.
- uuid 를통해 유니크한 도형의 id를 생성 했습니다.

## 실행 방법

```bash
npm install
npm run dev


```
