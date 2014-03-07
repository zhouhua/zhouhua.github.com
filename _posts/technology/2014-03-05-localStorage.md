---
layout: post
category : 技术
tags : [node, javascript, redis, localStorage]
title: 在node中使用localStorage
plugin: [syntaxhighlighter]
abstract: 在node端模拟localStorage时，发现它与session有一些共同点：用户敏感、数据量小等。于是决定使用session来模拟。
---

{% include JB/setup %}
<link href="{{BASE_PATH}}/assets/themes/zhouhua/plugins/syntaxhighlighter/styles/shCoreRDark.css" rel="stylesheet" type="text/css" />
<link href="{{BASE_PATH}}/assets/themes/zhouhua/plugins/syntaxhighlighter/styles/shThemeRDark.css" rel="stylesheet" type="text/css" />

在node端模拟localStorage时，发现它与session有一些共同点：用户敏感、数据量小等。于是决定使用session来模拟。

`express`框架继承了`connect`，`connect`实现了session，并允许对session的存储（store）进行一些定制，通常有三种实现，一是默认的方式，直接存储于内存；二是使用mongodb，借助`connect-mongodb`库；三是使用redis，借助`connect-redis`库。考虑到session内容不太需要持久化，且读写比较频繁，所以本文档中采用了redis方案。

### 准备redis环境

使用之前，我们需要服务器上运行redis。可以从[官网](http://redis.io/download)上进行下载。windows用户请移动[这里](https://github.com/MSOpenTech/redis/tree/2.6/bin/release)。编译或解压之后，运行`redis-server.exe`。这样redis数据库就开启了，默认的访问端口是6379。

进入项目目录，运行：

```
npm install connect-redis
```

安装`connect-redis`包。

### 开启express session功能

```
var expree = require('express');
var app = express();
......

var RedisStore = require('connect-redis')(express);
app.use(express.cookieParser('Michael'));
app.use(express.session({
    secret: "Michael",
    store: new RedisStore({
        "host":"127.0.0.1",
        "port":"6379"
    })
}));
......

require('./routers');
```

由于node的session是的session_id是通过cookie来维护，所以一定需要`app.use(express.cookieParser('Michael'))`这句，参数可以为任意字符串，cookie中`secret`字段值为此参数时才会进行session的处理。初始化session的时候，创建一个`RedisStore`对象传递给session，并由`RedisStore`接管session的读写。

为了能在controller中使用session，我们应该把上述配置置于路由配置之前。

### 使用session模拟localStorage

```
var localStorage = module.exports = function localStorage(session) {
    this.session = session;
};

localStorage.prototype.getItem = function (key) {
    return this.session[key];
};

localStorage.prototype.setItem = function (key, value) {
    return this.session[key] = value;
};

localStorage.prototype.__defineGetter__("length", function () {
    var s = -7;
    for (var i in this.session) {
        ++s;
    }
    return s;
});

localStorage.prototype.removeItem = function (key) {
    // @note cookie可能被delete，引发意外
    return (key == "cookie") ? false : delete this.session[key];
};

localStorage.prototype.clear = function () {
    for (var i in this.session) {
        this.prototype.removeItem(i);
    }
};
```

以上代码模拟了一个localStorage，模拟了`getItem()`、`setItem()`、`clear()`、`remove()`方法和`length`属性。

### 使用node端localStorage

```
app.get("/time/:set", function (req, res) {
    var localStorage = new (require("./routers/utils/localStorage"))(req.session);
    var doc = "";
    if (req.params.set == "set") {
        doc = "<p>当前时间" + localStorage.getItem("time") + "</p>";
    } else {
        localStorage.setItem("time", (new Date()).toLocaleTimeString());
        doc = "<p>当前时间" + (localStorage.getItem("time") || false) ? localStorage.getItem("time") : "未知" + "</p>";
    }
    res.writeHeader(200, {'contentType': 'text/html'});
    res.write(doc);
    res.end();
});
```

必须注意一个问题，与浏览器的localStorage不同，node端的localStorage为了满足用户敏感性，没有办法做成全局对象，必须依赖`HTTPRequest`对象，因此，我们只能在controllor内部初始化localStorage。其实在使用的时候，与前端代码无异。

#### 参考3： [`w3c-xmlhttprequest`](https://github.com/ykzts/node-xmlhttprequest)

`w3c-xmlhttprequest`用法与`node-XMLHttpRequest`基本相同，暂不清楚两者区别。

---

> 2014年3月3日更新

对`node-XMLHttpRequest`和`w3c-xmlhttpquest`分别做了测试，后者能正常支撑`$.ajax`，前者无法正常运作，在`xhr.send()`阶段抛出协议错误。
