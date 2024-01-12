; (function () {
  init()
  var APIURL = "http://127.0.0.1:8888/api"

  var imdb = window.location.pathname
  imdb = imdb.replace('/title/', '')
  imdb = imdb.replace('/', '')


  if (imdb == null) {
    renderEmpty()
  } else {
    reqRemote(imdb)

  }

  function init() {
    var target = document.getElementsByClassName('ipc-page-section')[1]
    var ndiv = document.createElement('div')
    ndiv.className = 'ipc-page-section'

    var html = `<div class="godard" style="margin-bottom:10px;">
    <h2 style="margin-bottom:10px;">
      <span>Godard</span> 
      <button  id="req_api" style="font-size:14px;padding:2px 5px;float:right">
        <span>更新</span>
      </button>
    </h2>
   
    <div class="godard-content">
    <table id="godard-table" style="width:100%;font-size:13px;">
      <thead>
        <tr><td>名称</td><td>格式</td><td>大小</td></tr>
      </thead>
      <tbody>
      </tbody>
    </table>
    </div>
    </div>`

    target.parentNode.insertBefore(ndiv, target)
    ndiv.innerHTML = html
    var btn = document.getElementById('req_api')
    btn.addEventListener('click', function (e) {
      e.preventDefault()
      reqRemote(imdb)
    })
  }

  function render(items) {
    var table = document.querySelectorAll('#godard-table tbody')[0]
    var tpl = `<tr>
    <td class="pl"><a href="{magnet}" >{filename}</a></td>
    <td class="pl"><span>{quality}</span></td>
    <td class="pl"><span>{size}</span></td>
    </tr>`
    var arr = []
    for (i in items) {
      arr.push(
        tpl
          .replace('{magnet}', items[i].magnet)
          .replace('{filename}', items[i].filename)
          .replace('{quality}', items[i].quality)
          .replace('{size}', items[i].size)
      )
    }
    tr = arr.join('')
    table.innerHTML = tr
  }

  function renderEmpty() {
    var table = document.querySelectorAll('#gordard-table tbody')[0]
    var tpl = `<tr>
    <td colspan="3" class="pl"><span>没有找到数据</span></td>
    </tr>`
    table.innerHTML = tpl
  }

  function renderErr() {
    var table = document.querySelectorAll('#godard-table tbody')[0]
    var tpl = `<tr>
    <td colspan="3" class="pl"><span>请求出错</span></td>
    </tr>`
    table.innerHTML = tpl
  }

  function reqRemote(imdb) {
    xhr = new XMLHttpRequest()
    xhr.open('GET', APIURL + '?imdb=' + imdb)
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        var data = JSON.parse(xhr.responseText)
        if ((data.seeds.length == 0)) {
          renderEmpty()
        } else {
          render(data.seeds)
        }
        xhr = null
      } else {
        renderErr()
      }
    }
    xhr.send()
  }
})()
