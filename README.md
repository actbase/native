
# Actbase

<a href="https://actba.se">
<img width="80" src="https://avatars.githubusercontent.com/u/55933025?s=200&v=4">
</a>


You can easily customize the design of the UI Library.

## Features

### Layout & Styling
- 기본적으로 사용자가 놓칠 수 있는 기능을 대응합니다.
- 다양한 컴포넌트들을 props 혹은 event에 따라 다르게 스타일을 조정할 수 있습니다.
- CSS 스타일처럼 디자인을 입힐 수 있습니다.
- React Native 에서 반응형 스타일링을 해보세요. 

### Form
- 강력한 Form 엔진을 통해 입력값부터 Validate까지 완벽하게 처리합니다.
- 기존에 HTML에서 사용하던 방식으로 사용할 수 있습니다.
- json, formdata 원하는 출력으로 손쉽게 사용합니다.

### Modal & Notification
- 다중으로 Modal을 지원합니다.
- 모든 custermize가 가능하니 걱정 ㄴㄴ

### Web Supported
- React Native Web과 어느정도 호환됨
- 그리고 일반 웹용이랑 비슷하게 생겨서 개발쪽에서도 걱정 ㄴㄴ


## Environment Support

- React Native 0.61 이상 사용 가능합니다.
- 기본적으로 react-native-safe-area-context 를 통해 SafeArea를 대응합니다.


## Install

```bash
npm install @actbase/native react-native-safe-area-context

or

yarn add @actbase/native react-native-safe-area-context

npx pod-install
```


## Usage

```jsx
import { Button, DatePicker } from 'antd';

const App = () => (
  <>
    <Button type="primary">PRESS ME</Button>
    <DatePicker placeholder="select date" />
  </>
);
```

### TypeScript

`@actbase/native` is written in TypeScript with complete definitions, check [Use in TypeScript](https://ant.design/docs/react/use-in-typescript) to getting started.

## Links

- [Home page](https://actba.se/)
- [Components Overview](https://actba.se/components/overview)
- [Actbase Pro](http://pro.actba.se/)
- [Change Log](CHANGELOG.md)
- [Actbase Pro Components](https://pro.actba.se/components/overview)
- [Developer Instruction](https://github.com/actbase/native/wiki/Development)

## Contact us


