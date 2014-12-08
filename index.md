---
layout: page
title: 首页
group: navigation

--- 
{% include JB/setup %}

<script language="javascript" type="text/javascript">
        window.location.href="http://www.zhouhua.info/"; 
</script>

首页建设中……

本站不支持IE6-8，如果您使用这些浏览器，本站不保证您能正常阅读；如果页面内部显示不正常，请更换chrome、firefox等现代浏览器。

<div>
<ul class="posts">
  {% for post in site.posts %}
    <li><span>{{ post.date | date_to_string }}</span> &raquo; <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a></li>
  {% endfor %}
</ul>
</div>