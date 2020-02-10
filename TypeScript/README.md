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

- 当你指定了--strictNullChecks标记时，null 只能赋值给 null、any、void 类型，undefined 只能赋值给 undefined、any、void 类型。
- null 和 undefined 是其它类型（包括 void）的子类型，可以赋值给其它类型（如：数字类型），赋值后的类型会变成 null 或 undefined

### Variable Declarations


### Interfaces

- 满足必要条件，再有多余属性也是可以的，仅限变量参数，如果以对象字面量作为参数则不行。
- 做为变量使用的话用 const，若做为属性则使用 readonly。
- 对象字面量会被特殊对待而且会经过额外属性检查。
- 类型推断：函数参数类型、函数返回值类型
- 在属性个数不确定的时候，可以使用可索引接口
- Dog 继承 Animal，所以 Dog 是 Animal 的子类型

#### 疑问

1. 字面量函数类型、接口函数类型、别名函数类型


### Classes


### Functions


### Generics


### Enums


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

- [TypeScript-CN](https://github.com/zhongsp/TypeScript)
- [TypeScript](http://www.typescriptlang.org/)
- [TypeScript Playground](http://www.typescriptlang.org/play/index.html)
- [TypeScript Evolution](https://mariusschulz.com/blog/series/typescript-evolution)
- [Object vs object vs {}](https://mariusschulz.com/blog/the-object-type-in-typescript)
