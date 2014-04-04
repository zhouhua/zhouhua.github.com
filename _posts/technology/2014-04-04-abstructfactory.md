---
layout: post
category : 技术
tags : [javascript, 设计模式, 工厂模式, 抽象工厂, 面向对象]
title: Javascript之抽象工厂
plugin: [syntaxhighlighter]
abstract: 本文仅为草稿，预计半个月后更新
---

本文仅为草稿，预计半个月后更新

## 抽象工厂类代码：

<pre class="brush: javascript">
function abstructFactory() {
}
abstructFactory.prototype._matches = {};
abstructFactory.prototype._default=null;
abstructFactory.prototype.create = abstructFactory.prototype.getInstance = function(condition) {
    var ret = this._matches[condition];
    if(!ret)ret=this._default;
    if ( typeof ret == "object")
        return ret;
    return new ret();
};
abstructFactory.prototype.setDefault=function(fn){
    this._default=fn;
}
abstructFactory.prototype.addRule = function(condition, constractor) {
    if ( typeof condition == "object") {
        for(var i in condition){
            this._matches[i]=condition[i];
        }
    } else if ( typeof condition == "array") {
        condition.forEach(function(e) {
            this.addRule(e);
        });
    } else {
        this._matches[condition] = constructor;
    }
}
abstructFactory.prototype.delRule = function(conditions) {
    var cons = (( typeof conditions == 'array') ? conditions : [conditions]);
    cons.forEach(function(e) {
        delete this._matches[conditions]
    });
}
abstructFactory.prototype.extend=function(obj){
    var that=this.clone();
    for(var i in obj){
        that[i]=obj[i];
    }
    return that;
}
abstructFactory.prototype.inherit = function(obj) {
    var that=this.clone();
    var F=function(){};
    F.prototype=that.extend(obj);
    F.prototype.constructor=F;
    var throwE=function(){throw "Cannot call abstract methrod anymore.";}
    F.prototype.delRule=F.prototype.addRule=F.prototype.create=throwE;
    return F;
}
abstructFactory.prototype.clone=function(){
    var objClone;
    if ( this.constructor == Object ) objClone = new this.constructor();
    else objClone = new this.constructor(this.valueOf());
    for ( var key in this )
    {
        if ( objClone[key] != this[key] )
        {
            if ( typeof(this[key]) == 'object' )
            {
                objClone[key] = this[key].Clone();
            }
            else
            {
                objClone[key] = this[key];
            }
        }
    }
    objClone.toString = this.toString;
    objClone.valueOf = this.valueOf;
    return objClone;
}
</pre>

## 实际调用代码

<pre class="brush: javascript">
var animal=new abstructFactory().extend({
    name:"animal",
    say:function(){console.log("")},
    eat:function(){console.log("Yummy!")}
});
var dog=animal.inherit({
    name:"dog",
    say:function(){console.log("Wong!")}
});
var cat=animal.inherit({
    name:"cat",
    say:function(){console.log("Mau!")}
});
animal.addRule({
    "cat":cat,
    "dog":dog
});
var dodo=animal.create("dog");
var caca=animal.create("cat");
</pre>