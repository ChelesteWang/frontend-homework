
## 需求：实现表格分页
1. 每页显示的记录条数由用户指定；
2. 样式种类参照以下内容：

    共（）条记录，分（）页 当前在第（）页；
    
    首页、上一页、下一页、尾页四个按钮。
3. 数字页码跳转，形如：“1 2 3 4 5 ”，要求当前页大于等于3或小于等于尾页-3时，当前页码所在位置为中间
4. 通过下拉菜单选择要查看第几页进行跳转；
5. 利用文本框输入页码跳转。
6. 给表格标题奇偶数页设置颜色

## 效果图：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cda40ca3cdd04588b60820ac5a63b332~tplv-k3u1fbpfcp-watermark.image)

## HTML 框架
基础html如下
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>分页表格demo演示</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-eOJMYsd53ii+scO/bJGFsiCZc+5NDVN2yr8+0RDqr0Ql0h+rP48ckxlpbzKgwra6" crossorigin="anonymous">
    <style>
        .container {
            margin-top: 30px;
        }

        .title {
            margin-bottom: 30px;
            color: #333;
            text-align: center;
        }

        .mr-3 {
            margin-right: 20px;
        }

        .form-color {
            height: 38px;
            width: 40px;
        }
    </style>
</head>

<body>
    <div class="container controller">
        <h1 class="title">分页表格demo演示</h1>
        <div id="allPut">
            <div class="input-group mb-3">
                <span class="input-group-text" id="inputGroup-sizing-default">每页显示行数：</span>
                <input type="text" class="form-control" >
                <button type="button" class="btn btn-primary mr-3" onclick="changeLine()">确定</button>
                <span class="input-group-text" id="inputGroup-sizing-default">请输入标题行颜色</span>
                <input class="form-color mr-3" type="color" id="headColor">
                <span class="input-group-text" id="inputGroup-sizing-default">请输入奇数行颜色：</span>
                <input class="form-color mr-3" type="color" id="oddColor">
                <span class="input-group-text" id="inputGroup-sizing-default">请输入偶数数行颜色：</span>
                <input class="form-color mr-3" type="color" id="evenColor">
            </div>
            <div class="input-group mb-3">
                <span class="input-group-text" id="inputGroup-sizing-default">请输入页数：</span>
                <input type="text" class="form-control">
                <button type="button" class="btn btn-primary mr-3" onclick="changePage()">跳转</button>
                <span class="input-group-text" id="inputGroup-sizing-default">请选择页数</span>
                <button type="button" class="btn btn-primary mr-3" onclick="selectPage()" id="button">跳转</button>
            </div>
        </div>
    </div>
    <div class="container">
        <table class="table table-striped" id="table">
            <thead>
                <tr>
                    <th scope="col">序号</th>
                    <th scope="col">姓名</th>
                    <th scope="col">年龄</th>
                    <th scope="col">性别</th>
                </tr>
            </thead>
        </table>
        <nav id='nav'>
            
        </nav>
    </div>
    <script src="./index.js"></script>
</body>

</html>
```

## 实现思路

这个需求可以分为3类

### 1. 颜色控制
颜色控制的代码可以说是相对独立一点的，只需要监听获取input中的颜色值，并同步修改表格项的颜色就好了。

- 设置默认颜色
```js
let defaultColor = "#333333";
```
- getColor：获得用户输入要求的所有颜色信息。
```js
function getColor() {
    let headColor = document.getElementById('headColor').value;
    let oddColor = document.getElementById('oddColor').value;
    let evenColor = document.getElementById('evenColor').value;
    this.colors = [headColor, oddColor, evenColor];
}
```
- initColor()：页面表格颜色初始化

```js
function initColor() {
    let headColor = document.getElementById('headColor')
    let oddColor = document.getElementById('oddColor')
    let evenColor = document.getElementById('evenColor')
    let color = [headColor, oddColor, evenColor]
    color.forEach((item) => {
        item.value = defaultColor
        item.addEventListener("input", changeColor, false);
        item.select()
    })
}
```
- changeColor(event)：改变表格颜色

```js
function changeColor(event) {
    let color = event.target.value
    let elem = []
    switch (event.target.id) {
        case 'headColor':
            let thead = document.querySelector('.table>thead')
            elem.push(thead)
            break
        case 'oddColor':
            let oddtable = document.querySelectorAll('.table-striped>tbody>tr:nth-of-type(odd)')
            elem = oddtable
            break
        case 'evenColor':
            let eventable = document.querySelectorAll('.table-striped>tbody>tr:nth-of-type(even)')
            elem = eventable
            break
    }
    if (elem)
        elem.forEach((item) => {
            item.style.backgroundColor = color
        })
}
```
### 2. 数据获取
数据获取为了方便测试使用了一个`randomData()`函数进行数据生成，也可对接异步请求数据

- randomData()

```js
function randomData(number) {
    function randomNum(minNum, maxNum) {
        switch (arguments.length) {
            case 1:
                return parseInt(Math.random() * minNum + 1, 10);
            case 2:
                return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
            default:
                return 0;

        }
    }
    let fristName = ['李', '王', '张', '赵', '孙', '朱', '刘', '陈', '白', '付']
    let lastName = ['金花', '一明', '无忌', '微', '建国', '英军']
    let gender = ['男', '女']
    let data = []
    for (let i = 0; i < number; i++) {
        let index = i + 1
        let name = `${fristName[randomNum(0, fristName.length - 1)]}${lastName[randomNum(0, lastName.length - 1)]}`
        let age = randomNum(1, 99)
        let sex = gender[randomNum(0, 1)]
        data.push({ index, name, age, sex })
    }
    console.log(data)
    return data
}
```
### 3. 列表分页
为了专注于JavaScript的逻辑，页面上使用了 bootstarp.css 完成基本布局。

列表分页的前端实现思路是在每一页的渲染时，截取当前页数据并且动态渲染。每次改变页数时，改变每页页数时，对数据重新渲染，重绘页面。
### 数据初始化

```js
let num = prompt("需要获取多少条数据", "100")
let data = randomData(num) //获取数据
let page = 1 //当前页数
let line = 10 //每页行数
let len = Math.ceil(data.length / line)//分页数
```
### 创建节点
- createTable()：创建表格
```js
function createTable() {
    let table = document.getElementById('table')
    let tbody = document.createElement('tbody')
    let tr, td;
    let start = (page - 1) * line
    let end = start + line
    dataList = data.slice(start, end)
    for (item in dataList) {
        tr = document.createElement("tr");
        for (Attribute in data[item]) {
            td = document.createElement("td");
            td.appendChild(document.createTextNode(dataList[item][Attribute]));
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
    table.appendChild(tbody)
}
```
> 关键点在于 start 和 end 控制页面渲染内容。 
- createNavItem(className, text)：创建分页内容项
```js
function createNavItem(className, text) {
    let span, li
    span = document.createElement("span")
    span.className = "page-link"
    span.appendChild(document.createTextNode(text))
    switch (text) {
        case "Previous":
            span.addEventListener('click', () => setPage(page - 1))
            break
        case "Next":
            span.addEventListener('click', () => setPage(page + 1))
            break
        default:
            span.addEventListener('click', () => setPage(text))
    }
    li = document.createElement("li")
    li.className = className
    li.appendChild(span)
    return li
}
```
> 用于创建导航栏的前进后退与页码，封装一下降低代码冗余
- createNav()：创建分页导航

```js
function createNav() {
    let nav = document.getElementById('nav')
    let span = document.createElement('span')
    span.appendChild(document.createTextNode(`共${data.length}条记录，分${len}页 当前在第${page}页`))
    nav.appendChild(span)
    let ul = document.createElement('ul')
    ul.className = "pagination justify-content-end"
    let start = page > 3 ? page - 2 : 1
    let end = page > len - 3 ? len + 1 : start + 5
    if (page == 1)
        className = "page-item disabled"
    else
        className = "page-item"
    ul.appendChild(createNavItem(className, "Previous"))
    for (i = start; i < end; i++) {
        if (i == page)
            className = "page-item active"
        else
            className = "page-item"
        ul.appendChild(createNavItem(className, i))
    }
    if (page == len)
        className = "page-item disabled"
    else
        className = "page-item"
    ul.appendChild(createNavItem(className, "Next"))
    nav.appendChild(ul)
}
```
> 重点在于对于导航项分类绘制，为不同列表项绑定不同类与事件，以及页数的start和end的控制，从start到end间隔五个，怎样在中间范围保证当前页居中。

- createSelect()：创建页面选页列表

```js
function createSelect() {
    let div = document.querySelector("#allPut > div:nth-child(2)")
    let button = document.querySelector("#button")
    let select = document.createElement('select')
    select.className = "form-select form-select-sm"
    select.id = "select"
    for (let i = 1; i < len + 1; i++) {
        let option = document.createElement('option')
        option.value = i
        option.appendChild(document.createTextNode(i))
        select.appendChild(option)
    }
    div.insertBefore(select, button)
}
```
### 修改数值（重新渲染）
- 设置（修改） page 和 line，修改数值的同时出发重绘

```js
function setPage(_page) {
    page = _page
    reRender()
}

function setLine(_line) {
    line = _line
    len = Math.ceil(data.length / line)
    reRender()
}
```
- 按钮控制的绑定函数

```js
function changeLine() {
    _line = parseInt(document.querySelector("#allPut > div:nth-child(1) > input.form-control").value)
    line = _line
    if (_line <= data.length && _line > 0) {
        setLine(parseInt(_line))
        removeElem(document.querySelector('#allPut > div:nth-child(2) > select'))
        createSelect()
    }
    else {
        alert("超出数据范围重新输入")
    }
}

function changePage() {
    _page = parseInt(document.querySelector("#allPut > div:nth-child(2) > input").value)
    if (_page <= len && _page > 0) {
        setPage(_page)
    }
    else {
        alert("超出页数范围重新输入")
    }
}

function selectPage() {
    let select = document.getElementById('select')
    let index = select.selectedIndex
    _page = parseInt(select.options[index].value)
    if (_page <= len && _page > 0) {
        setPage(_page)
    }
    else {
        alert("超出页数范围重新输入")
    }
}
```
> 注意表单获取数据的格式，与表单边缘处理。
- 初始化重绘与工具函数
```js
function removeElem(elem) {
    let parent = elem.parentElement;
    parent.removeChild(elem)
}

function initPage() {
    initColor()
    createTable()
    createNav()
    createSelect()
}

function reRender() {
    removeElem(document.querySelector('table>tbody'))
    removeElem(document.querySelector("#nav > span"))
    removeElem(document.querySelector("#nav > ul"))
    createTable()
    createNav()
}

window.addEventListener("load", initPage, false);
```
页面load加载时触发初始化函数，更新数据时重绘页面。

## 总结

[codepen在线样例](https://codepen.io/wxy521/pen/GRrQBre)
