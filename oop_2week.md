## 코드스피츠 86 - 2회차 (2020.01.15)
### 1. MVVM
MVC 모델을 컨트롤러가 가공해서 뷰에게 준다. 뷰가 데이터 기반으로 쓴다. 뷰가 모델을 알고 있음.
> 모델은 비지니스 로직이므로 뷰와 변화가 서로 다른데 서로 의존성을 가지고 있어 문제가 있다.

Model 에 의존하는 Controller 가 구조를 제왕적으로 관리가 가능하다. 그래서 컨트롤러를 찍어낸다. 의존성이 복잡하다.

MVP 모델은 파워빌더, 비주얼베이직, 안드로이드 뷰에서 나온 모델링 기법.
컴포넌트의 getter, setter 로 속성을 외부에 노출해서 사용하고 있다. Presenter 는 모델을 받아서 처리한다는게 없다. 모델 의존성이 0.
> 뷰에 뭔가를 하나 만들려고 해도 getter, setter 로 만들어내야한다. 네이티브 앱으로 만들어서 인터페이스로 통제를 할 수 있어서 MVC 대체해서 쓰게 된다.

MVVM 모델은 Binder 가 사실은 필요하다. 
ViewModel 은 데이터구조에서의 View 를 말한다. View 를 대체할 수 있는 메모리에 존재하는 객체를 만들어 낸다. View 를 자동으로 감지해서 Binder 가 의존성을 가지고 상태를 바꿔준다.
> View Model 은 View 를 모르게 하는데 있다. 대신에 Binder가 View와 View Model을 의존하고 있다.

** 원리도 알고 구축도 해봐야한다.

```js
const type = (target, type) => {
  if (typeof type == "string") {
    if (typeof target != type) throw `invalid type ${target} : ${type}`;
  } else if (!(target instanceof type))  throw `invalid type ${target} : ${type}`;
  return target;
}

type(12, "number")
```
typeof 는 문자열로 체크해야한다. == 강제 형변환을 해주는 훨씬 더 느리게 되니깐, 표준 표현으로 권장하지만 실제로 형변환을 굳이 해주지 않아도 된다. 런타임 자바스크립트는 throw 로 에러를 먼저 잡아내고 추후에 조금 유연하게 바꿔준다.

```js
const test = (arr, _ = type(arr, Array)) => {
  console.log(arr)
}
test([1,2,3])
test(123)

const test2 = (a,b,c,_0 = type(a, "string", _1 = type(b, "nubmer")))
```
_ 인자를 사용하지 않겠다라는 표현. arr 은 배열 타입이라는 걸 인자 타입으로 확실히 알게 된다. 인자가 잘못들어오면 throw 로 체크를 먼저 가능함

### 2. ViewModel
html 표준으로 안 깨지려면 data-viewmodel 로 사용한다. w3c validation 체크를 꼭 통과를 해야한다. 
viewmodel 속성과 바인더가 매칭을 해준다. 특정 뷰의 셋들을 스캔해서 훅들과 뷰모델을 연결해준다.

### 3. Role Design
리액트의 컴포넌트는 자기 뷰를 자기가 직접 소유하고 있다. 사실은 프로퍼티만 관리하는 걸 합체해서 관리해야한다.

앵귤러 뷰를 스캔하는 방법은 뷰는 모델과 분리를 해서 관리를한다. 바인더 내부에서 html 을 인식하는 부분을 별도로 분리해야한다. 

Scanner 로 나눠서 분리가 필요하다. 변화율(1week, 1day, 1year twice) 등 주기에 따라 바꿀 화면들은 코드를 바꾸는 이유가 다르다. 

|viewModel| Binder(BinderItem) | Scanner| HTMLElemnt|
스캐너는 바인더를 보호하기위해서 중간에서 HTMLElement 를 변화를 막아 서로 분리해서 관리한다.

```js
const ViewMdoel = call{
  static #private = Symbol();
  static get(data){
    return new ViewModel(this.#private, data);
  }
  constructor(cheker, data) {
    if(checker != ViewModel.#private) throw "use ViewModel.get()!";
  }
}
```

private 문법은 # 으로 쓰면 클래스 내부에서만 쓰고 내부에서도 대괄호로 접근도 불가능하다. 인스턴스로 사용할 수 있고, 외부에서는 오직 static get 으로 접근하고 싶을 때 사용. 외부에서는 무조건 throw 를 해서 쓰게된다.
바벨로 컴파일 할거니깐 ES2020 는 크롬 72에서 사용가능.

Object.seal 객체에 프로퍼티를 더이상 추가할 수 없다. 

ViewModel 은 단위테스트가 잘 된다. 바인더가 잘 짰다면 단위테스트는 완료가능. 어떠한 로직이라도 순수한 모델만 짜고 바인더만 가져왔다. IOC가 성공한거임. 

### 4. Binder
```js 
const BindItem = class {
  el; viewmodel;
  constructor(el, viemodel, _0 = type(el, HTMLElement), _1 = type(viewmodel, "string")){
    this.el = el;
    this.viewmodel = viewmodel;
    Object.freeze(this);
  }
}
}
new BindItem(section, "wrapper");
```
freeze 는 더 이상 프로퍼티가 추가되지 않았으면 좋겠다. 싶은걸 표현한다. throw 를 하고 인자를 순서로 설명하는데 집중해야한다.

> 언어 스펙에 맞춰서 의도를 최대한 많이 표현해야한다. 자바스크립트는 다른 언어의 가장 어려운 컨텍스트를 가져와서 모두 추가하고 있으므로 꾸준히 공부를 해야한다. 크롬개발자 업데이트를 계속확인하고 최신 스펙문서를 확인해야한다. 

```js
const Binder = class {
  #items = new Set;
  add(v, _ = type(v, BinderItem)) { this.#items.add(v);}
  render(viewmodel, _ = type(viewmodel, ViewModel)) {
    this.#items.forEach(item => {
      // style, attribue, properites, events 타입인지 체크를 하면서 엘리먼트를 확인한다...
      Object.entries(vm.events).forEach(([k, v])=> el["on"+k]=3=>v.call(el, e, viewmodel))
    })
  }
}
```
객체의 컨테이너를 쓸 경우, Set.
배열을 쓰는 순간 값 컨테이너를 쓰게 된다. 처음부터 형(Type)을 안전하게 만들어내야한다. set 을 foreach 를 돌면 타입이 안정화될 수 있다. 그러므로 여러번 검사하지말고 확실한 검사를 한다. 어플리케이션에서는 더이상 뷰를 그리는 방법은 나오지 않는다. 

### 5. Scanner
html 에 걸려는 훅 들을 읽어서 각각 바인더에 연결해주는 역할
```js
const binder = new Binder;
const stack = [el.firstElementChild]
let target;
while(target = stack.pop()) {
  this.checkItem9binder, target);
  if(target.firstElementChild) stack.push(target.firstElementChild);
  if(target.nextElementSibling) stack.push(target.nextElementSibling)
}

return binder;
```
children 은 실제로 랩핑되어있다. 재귀함수를 함수가 함수를 부를 때 스택이 쌓이고 스택오버플로우가 발생할 수 있으므로 재귀는 파일을 돌면서 풀어낼 수 있다. 

> red black 균형트리 파일을 짜보면 가능하다. 문제에 대한 숙련도에 따라 다르기 때문에 모범답안을 다 외우고 있어야한다. 하루에 300줄 이상 짜고 어려운 문제 쉬운문제 상관없이 한번 된다고 넘기지 말고 익숙해질때까지 계속 함.


VM 은 인메모리 객체일 뿐이다. 뷰를 그릴때의 속성은 전혀 갖고 있지 않다. 바인더가 엘리먼트랑 매핑되어 있어서 스타일러 속성만 바꿔주면된다. 바인더에 렌더에 들어가 있으니깐. 뷰를 그리는 모든 로직에 제어역전을 하고 있다.
바인더에서 모델을 갱신해서 렌더를 그리면 자동으로 뷰를 그리게 된다.

### 6. ViewModel
```js
const f =_=> {
  viewmodel.changeContents();
  binder.render(viewmodel);
  if(!viewmodel.isStop) requestAnimationFrame(f)
};
requestAnimationFrame(f);
```
바인더가 도는 로직은 순수하게 다른 로직을 돌리게 된다. 인메모리에 데이터를 객체만 변경하면 되고, 전부 다 제어역전으로 바인더 렌더를 수정한다. 뷰를 조작하는 스타일 속성의 문제가 전부 없어진다. 오로지 바인더 로직만 수정하면 된다. 
> 객체간의 역할로 알아보고 MVVM 패턴을 이해한다.
뷰를 그리는 로직들을 MVVM 을 제어역전을 통해서 View 를 알지 못하게 만든다. 생명주기, 수정주기, 변화율이 다른 의존성이 다른 경우에 분리하는 방법으로 고민한다.