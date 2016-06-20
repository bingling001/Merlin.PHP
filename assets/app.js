host = 'http://192.168.1.1:81/';

jQuery(document).ready(function($) {


// Mobile Safari in standalone mode
if(("standalone" in window.navigator) && window.navigator.standalone){

  // If you want to prevent remote links in standalone web apps opening Mobile Safari, change 'remotes' to true
  var noddy, remotes = false;

  document.addEventListener('click', function(event) {

    noddy = event.target;

    // Bubble up until we hit link or top HTML element. Warning: BODY element is not compulsory so better to stop on HTML
    while(noddy.nodeName !== "A" && noddy.nodeName !== "HTML") {
          noddy = noddy.parentNode;
      }

    if('href' in noddy && noddy.href.indexOf('http') !== -1 && (noddy.href.indexOf(document.location.host) !== -1 || remotes))
    {
      event.preventDefault();
      document.location.href = noddy.href;
    }

  },false);
}

  // loading()

  l = $('#loadingDIV');
  m = $('#MessageDIV');
  lname = $('#loading-Name');
  getApp('TEST', 'Clean', 'Google','google');
  RunApp('GetExec','cat ss-mode',true,'SS 模式','模式');

  $delay_time = $('#delay_time');
  $delay_icon = $('#delay_icon');
  update_delay();
  setInterval(update_delay, 2000);

  $('.btn').click(function(event) {
    e = $(this).text();
    console.log('Click: ' + e.trim());
    switch (e.trim()) {
      case 'Network':
      RunApp('RunNET');
      break;
      case 'Web 界面':
      RunApp('RunExec','/opt/etc/init.d/S80lighttpd restart');
      break;
      case 'DNSMASQ':
      RunApp('RunExec','service restart_dnsmasq');
      break;
      case 'Game-Mode':
      ui_closemenu();
      RunApp('RunSS','game');
      break;
      case 'Game-V2':
      ui_closemenu();
      RunApp('RunSS','v2');
      break;
      case 'STOP':
      ui_closemenu();
      RunApp('RunExec','/koolshare/ss/stop.sh');
      // iframeBox('/exec.php?command=/koolshare/ss/stop.sh');
      break;
      case 'ShadowSocks':
      getApp('FastReboot', 'Clean','ShadowSocks 快速重啟');
      break;
      case '網路測試':
      getApp('TEST', 'Clean', 'Baidu','baidu');
      getApp('TEST', false, 'Google','google');
      getApp('TEST', false, 'Playstation.com','ps');
      // getApp('TEST', false, 'Baidu via Proxy','baidup');
      break;
      case 'IP':
      getApp('IP','Clean');
      break;
      case 'SS 信息':
      getApp('SSConfig','Clean','SS 配置');
      RunApp('GetExec','cat ss-mode',true,'SS 模式','模式');
      break;
      case 'A':
      RunApp('RunExec','ls -l');
      break;
      default:
      console.log("nothing");
      break;
    }

  });


});

function heredoc(fn) {
    return fn.toString().split('\n').slice(1,-1).join('\n') + '\n'
}

function update_delay() {
  $.ajax({
    url: '/app.php?fun=TEST&q=google',
    dataType: "json",
    success: function(data) {
      // console.log("延遲："+data.延遲);
      if (data.延遲 < 0.01) {
        $delay_time.text('timeout');
        $delay_icon.addClass('red');
      } else {
        $delay_time.text(data.延遲+'s');
        $delay_icon.removeClass('red');
      }
    },
    error: function() {
      $delay_time.text('error');
    }
  });
}

function iframeBox(url) {
  url = url || false;
  i = $('#iframeBox');

  if (url == false) {
    i.hide();
  } else {
    i.show();
    i.removeClass('hide');
    i.attr('src',url);
  }
}

function LoadingBox(isShow,name) {
  isShow = isShow || false;
  name = name || '載入中';
  lname.text(name);
  if (isShow === true) {
    l.fadeIn();
  }
  if (isShow === false) {
    l.fadeOut();
  }
}

function RunApp(f,q,isAdd,isTitle,isDesc) {
  LoadingBox(true,'處理中：'+f);
  isAdd = isAdd || false;
  isTitle = isTitle || f;
  isDesc = isDesc || q;
  m.html('');
  $.get('/app.php', {'fun': f, 'q': q}, function(success){
    if (isAdd) {
      m.append('<h5>'+isTitle+'</h5>')
      m.append("<span><b>"+isDesc+": </b> "+success+"</span><br/>");
    } else {
      m.html(success);
    }
    LoadingBox(false);
  })
}

function getApp(f,isClear,isTitle,q) {
  isClear = isClear || false;
  isTitle = isTitle || f;
  // LoadingBox(true,'處理中：'+f);
  if (isClear) {
    m.html('');
  };

  $.ajax({
    url: '/app.php?fun='+f+'&q='+q,
    dataType: "json",
    beforeSend: function(){
      LoadingBox(true,'處理中：'+f);
    },
    success: function(data) {
      if (isTitle != 'no') {
        m.append('<h5>'+isTitle+'</h5>');
      };
      for(var k in data) {
       m.append("<span><b>"+k+":</b> "+data[k]+"</span><br/>");
      }
      m.append('<br/>');
    },
    complete: function(data) {
      LoadingBox(false);
    }
  });
}

function getURLs(url,isNol) {

  loading.show();

  d_model = 'direct';

  if (url.indexOf("baidu.com") !== -1) {
    d_model = 'baidu_yun';
  } else {
    d_model = 'direct'
  }

  if (isNol == 'nol') {
    d_model = 'direct'
  }

  if (d_model == 'baidu_yun') {
    console.log("Run Baidyun");
    loading.hide();
    // message.html('<a href="'+ host + "_baiduyun.php?url=" + url +'">百度云直連</a>')
    message.text('暫時不支持')
    model.text('百度云')
  } else {
    console.log("Run Direct");
    $.get(host + "app.php?url=" + url, function(data) {
      loading.hide();
      model.text('鏈接解釋')
      $('#result').removeClass('hide')
      $("#urls-filtering").html(data);
      show();

      var options = {
        valueNames: ['urls']
      };

      var searchList = new List('search', options);

      var templater = searchList.templater;
      templater.clear = jQuery.noop; // relying on `show`/`hide` instead
      templater.show = function(item) {
        $(item.elm)
          .removeClass('animated fadeIn fadeOut')
          .addClass('animated fadeIn')
          .slideDown(800);
      };
      templater.hide = function(item) {
        $(item.elm)
          .removeClass('animated fadeIn fadeOut')
          .addClass('animated fadeOut')
          .slideUp(800);
      };

    });
  }


}

function getUrlParameter(sParam) {
  var sPageURL = window.location.search.substring(1);
  var sURLVariables = sPageURL.split('&');
  for (var i = 0; i < sURLVariables.length; i++) {
    var sParameterName = sURLVariables[i].split('=');
    if (sParameterName[0] == sParam) {
      return sParameterName[1];
    }
  }
}

function show() {
  var items = $('.urls');

  // Animate each line individually
  for (var i = 0; i < items.length; i++) {
    var item = items[i]
      // Define initial properties
    dynamics.css(item, {
      opacity: 0,
      translateY: 20
    })

    // Animate to final properties
    dynamics.animate(item, {
      opacity: 1,
      translateY: 0
    }, {
      type: dynamics.spring,
      frequency: 300,
      friction: 435,
      duration: 1000,
      delay: 100 + i * 40
    })
  }

}

function openDownloadWindow(url, name) {
  window.open("https://d.miwifi.com/d2r/?url=" + Base64.encodeURI(url) + "&src=demo" + "&name=" + encodeURIComponent(name), "", "", true);
}