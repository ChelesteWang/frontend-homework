function getColor() {
    let headColor = document.getElementById('headColor').value;
    let oddColor = document.getElementById('oddColor').value;
    let evenColor = document.getElementById('evenColor').value;
    this.colors = [headColor, oddColor, evenColor];
}

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

let defaultColor = "#333333";
let num = prompt("需要获取多少条数据", "100")
let data = randomData(num)
let page = 1
let line = 10
let len = Math.ceil(data.length / line)

function setPage(_page) {
    page = _page
    reRender()
}

function setLine(_line) {
    line = _line
    len = Math.ceil(data.length / line)
    reRender()
}

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
