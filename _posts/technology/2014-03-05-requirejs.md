---
layout: post
category : 技术
tags : [requirejs, AMD, 前端模块化, node.js, commonjs, javascript]
title: 如何在node.js中使用requirejs
abstract: node.js本身支持基于commonjs的javascript模块化，并且由于node.js环境下模块加载以同步为主，没有浏览器端异步加载的需求，所以node.js不支持AMD的异步模块化格式。在Lizard框架（公司使用的）中的代码模块化采用的是requirejs这个加载器，支持AMD模块。本文档介绍了node端版本的requirejs的用法，使得AMD模块也能在node端使用。
---

{% include JB/setup %}
<link href="{{BASE_PATH}}/assets/themes/zhouhua/plugins/syntaxhighlighter/styles/shCoreRDark.css" rel="stylesheet" type="text/css" />
<link href="{{BASE_PATH}}/assets/themes/zhouhua/plugins/syntaxhighlighter/styles/shThemeRDark.css" rel="stylesheet" type="text/css" />

node.js本身支持基于commonjs的javascript模块化，并且由于node.js环境下模块加载以同步为主，没有浏览器端异步加载的需求，所以node.js不支持AMD的异步模块化格式。在Lizard框架中的代码模块化采用的是requirejs这个加载器，支持AMD模块。本文档介绍了node端版本的requirejs的用法，使得AMD模块也能在node端使用。

## 安装

### 安装requirejs

requirejs官方提供了一个可用于node的适配器`r.js`。有两种方法可以在项目里面加入此库。

#### 1. npm

在具体项目目录下使用如下命令来引入requirejs:

    npm install requirejs

windows环境下安装需要注意不要加上`-g`全局开关，否则不能正常安装。

安装完成后，可使用`require('requirejs')`来加载requirejs。

#### 2. 下载r.js

如果不想使用npm，也可以直接下载r.js，并把它放到项目中达到同样的目的。

[点击下载。](http://requirejs.org/docs/download.html#rjs)

在项目中通过`require('/path/to/r.js')`来加载requirejs。

## 配置

### 配置requirejs

```javascript
var requirejs=require('requirejs');

requirejs.config({
    //把node自身的require方法传递给requirejs
    nodeRequire: require
});

requirejs(["foo","bar"],function(foo,bar){});
```

在需要使用requirejs的地方可以用上面的代码来配置requirejs。首先加载requirejs模块，命名为`requirejs`（可以为其他命名）。然后对`requirejs`进行配置。配置的方法和参数可以参照浏览器版本的requirejs的[配置说明](http://requirejs.org/docs/node.html#2)。不过有一点不同，如代码所示，我们需要把node的`require`方法引进来。最后一行是简单地加载模块的示例，requirejs会尝试把`foo`和`bar`两个模块当成AMD模块来加载，如果失败，则会调用node的`requie`方法来把它们当作commonjs模块加载。为了实现这样的适应性，所以我们需要配置node的`require`方法。但实际测试并不尽如人意，保险起见，还是对AMD模块使用`requirejs`加载，对commonjs模块使用`require`加载。

<div style="text-decoration:line-through">

## 构造AMD格式的node模块

在node中定义的模块是commonjs模块，如果想要构造AMD模块，我们需要[amdefine](https://github.com/jrburke/amdefine)这个包。

### 安装amdefine

同样，可以使用npm进行安装，在项目目录下执行：

    npm install amdefine

在windows下也存在无法全局安装的问题，需要对项目单独安装。

### 定义define方法
```javascript
if(typeof define !== 'function'){
    var define=require('amdefine')(module);
}
```
~~amdefine提供了包装AMD模块的`define`方法。不过上面代码中对于node中是否包含define方法的检测判断请保留，最好原封不动地将这几行拷贝到自己的项目中。这样，我们就可以像使用前端requirejs一样，定义和使用AMD模块。~~

### 将node自己的common模块转换为AMD模块

</div>

原本想通过引用`amdefine`包来实现node端AMD模块的定义，不过requirejs本身定义了`define`方法，不必额外引入其他包。

<script src="{{BASE_PATH}}/assets/themes/zhouhua/plugins/syntaxhighlighter/scripts/shCore.js"> </script>
<script src="{{BASE_PATH}}/assets/themes/zhouhua/plugins/syntaxhighlighter/scripts/shBrushCss.js"> </script>
<script src="{{BASE_PATH}}/assets/themes/zhouhua/plugins/syntaxhighlighter/scripts/shBrushXml.js"> </script>
<script type="text/javascript">
    SyntaxHighlighter.defaults['smart-tabs'] = true;
    SyntaxHighlighter.defaults['tab-size'] = 4;
    SyntaxHighlighter.defaults['toolbar']=false;
    SyntaxHighlighter.all();
</script>