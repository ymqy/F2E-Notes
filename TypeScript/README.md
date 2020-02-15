# TypeScript

## 目录

- [handbook](#handbook)
  - [Basic Types](#basic-types)
  - [Variable Declarations](#variable-declarations)
  - [Interfaces](#interfaces)
  - [Classes](#classes)
  - [Functions](#functions)
  - [Generics](#generics)
  - [Enums](#enums)
  - [Type Inference](#type-inference)
  - [Type Compatibility](#type-compatibility)
  - [Advanced Types](#advanced-types)
  - [Symbols](#symbols)
  - [Iterators and Generators](#iterators-and-generators)
  - [Modules](#modules)
  - [Namespaces](#namespaces)
  - [Namespaces and Modules](#namespaces-and-modules)
  - [Module Resolution](#module-resolution)
  - [Declaration Merging](#declaration-merging)
  - [JSX](#jsx)
  - [Decorators](#decorators)
  - [Mixins](#mixins)
  - [Triple-Slash Directives](#triple-slash-directives)
  - [Type Checking JavaScript Files](#type-checking-javascript-files)
  - [Utility Types](#utility-types)
- [参考](#参考)

## handbook

### Basic Types

- 当你指定了 --strictNullChecks 标记时，null 只能赋值给 null、any、void 类型，undefined 只能赋值给 undefined、any、void 类型。
- 当你没有指定 --strictNullChecks 标记时，null 和 undefined 是其它类型（包括 void）的子类型，可以赋值给其它类型（如：数字类型），赋值后的类型会变成 null 或 undefined

### Variable Declarations


### Interfaces

- 满足必要条件，再有多余属性也是可以的，仅限变量参数，如果以对象字面量作为参数则不行。
- 做为变量使用的话用 const，若做为属性则使用 readonly。
- 对象字面量会被特殊对待而且会经过额外属性检查。
- 类型推断：函数参数类型、函数返回值类型
- 在属性个数不确定的时候，可以使用可索引接口
- Dog 继承 Animal，所以 Dog 是 Animal 的子类型
- 只读属性和实例属性必须被初始化
- never、null 和 undefined 是任意类型的子类型（任意类型并非一定是指 any 类型，也可以是具体的类型，比如 number）
- 接口之间可以相互继承，实现接口的复用
- 类之间也可以相互继承，实现方法和属性的复用
- 接口可以由类来实现，类可以由接口来继承
- （接口继承类）接口可以抽离出类的成员，抽离的时候会包括公有成员、私有成员和受保护成员
- 接口可以通过类来实现，但是接口只能约束类的公有成员(public)
- 前四条总结起来，无非应该关注两个点：继承和实现，通俗地讲，继承是得到了属性，实现是需要接口的必要属性。
- 什么时候使用接口什么时候使用抽象类？- 作者回复: 首先，在抽象类中可以包含方法的实现，也可以只声明不实现；而在接口中只能声明方法，不包含实现。另外，抽象类侧重类别的抽象（定义这个对象是什么，比如：人类可以是男人的抽象类），而接口侧重功能的抽象（定义这个对象能做什么，比如：人可以吃喝跑跳）。

限定接口的使用范围：只能由子类来实现这个接口。
```ts
class Auto {
    private state = 1
}
interface AutoInterface extends Auto {

}
class C implements AutoInterface {
    state = 1
}
class Bus extends Auto implements AutoInterface {

}
```
举个例子：一个UI类库定义了一个Button类并提供了ButtonInterface接口。现在你想实现一个自己的Button类，添加些自定义属性，那么只能是Button的子类去实现ButtonInterface接口，其他的类不能实现这个接口，即使与Button具有相同的成员。

这种接口的存在，对子类起到了约束作用，保证了继承关系。

#### 疑问

1. 字面量函数类型、接口函数类型、别名函数类型之间的区别
2. 为什么 any 类型的变量可以赋值给 number 类型
```ts
let n: number = 1;
let m: any = 'a';
n = m;
n.toFixed();
```

### Classes

- 不同于接口，抽象类可以包含成员的实现细节。


### Functions


### Generics

- 泛型类指的是实例部分的类型，所以类的静态属性不能使用这个泛型类型。


### Enums

- [How do the different enum variants work in TypeScript?](https://stackoverflow.com/questions/28818849/how-do-the-different-enum-variants-work-in-typescript)

#### 困惑

- 外部枚举后续需要理清


### Type Inference


### Type Compatibility


### Advanced Types


### Symbols


### Iterators and Generators


### Modules


### Namespaces


### Namespaces and Modules


### Module Resolution


### Declaration Merging


### JSX


### Decorators


### Mixins


### Triple-Slash Directives


### Type Checking JavaScript Files


### Utility Types


## 参考
- [TypeScript Language Specification](https://github.com/Microsoft/TypeScript/blob/master/doc/spec.md)
- [TypeScript-CN](https://github.com/zhongsp/TypeScript)
- [TypeScript](http://www.typescriptlang.org/)
- [TypeScript Playground](http://www.typescriptlang.org/play/index.html)
- [TypeScript Evolution](https://mariusschulz.com/blog/series/typescript-evolution)
- [Object vs object vs {}](https://mariusschulz.com/blog/the-object-type-in-typescript)
