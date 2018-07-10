var ipDom = null;

function tag(type, id, className, innerHTML) {
  var el = document.createElement(type);
  el.id = id;
  el.className = className;
  el.innerHTML = innerHTML;
  return el;
}

function requestIPLocation(ip) {
  chrome.extension.sendMessage({'get': 'location', 'data': ip}, function(response) {
    if (response && response.location && ipDom) {
      ipDom.innerHTML = ipDom.innerHTML + '<br />' + response.location;
    }
  });
}

chrome.extension.sendMessage({'get': 'status'}, function(response) {
  if ('off' !== response.status) {
    // 开启状态
    chrome.extension.sendMessage({'get': 'ip'}, function(response) {
      var ip = 'null';
      if (response && response.ip) {
        ip = response.ip;
      }
      ipDom = tag('div', 'chrome_the_website_ip', 'chrome_the_website_ip_right', ip);
      document.body.appendChild(ipDom);
      ipDom.onmouseover = function() {

        if (ipDom.className === 'chrome_the_website_ip_right') {
          ipDom.className = 'chrome_the_website_ip_left';
        }
        else {
          ipDom.className = 'chrome_the_website_ip_right';
        }
      };
      // 完成之后，请求归属地数据
      if (ip && (ip != 'null'))
      requestIPLocation(ip);
    });
  }
});
