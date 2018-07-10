var setting = {'status': 'on'};


function saveSetting() {
	chrome.storage.local.set({'status': setting['status']}, function() {}); // 保存到本地
}


function setStatus(status) {
	if (status !== 'off') {
		chrome.browserAction.setBadgeText({'text': 'on'});
		chrome.browserAction.setBadgeBackgroundColor({'color': '#14892c'});

		// 开始监听
		currentIPList = {};
		chrome.webRequest.onCompleted.addListener(onCompletedFunc , { urls: [], types: ['main_frame'] }, []);
	}
	else {
		chrome.browserAction.setBadgeText({'text': 'off'});
		chrome.browserAction.setBadgeBackgroundColor({'color': '#d04437'});

		// 清楚监听
		currentIPList = {};
		chrome.webRequest.onCompleted.removeListener(onCompletedFunc);
	}
	saveSetting();
}

function toggleOnOff(tab) {
	if (setting['status'] === 'on') {
		setting['status'] = 'off';

	}
	else {
		setting['status'] = 'on';
	}
	setStatus(setting['status']);
}

function ipLocation(data) {
  var l = [];
  if (data.country !== 'XX') {
    l.push(data.country);
  }
  if (data.region !== 'XX') {
    l.push(data.region);
  }
  if (data.city !== 'XX') {
    l.push(data.city);
  }
  if (data.isp !== 'XX') {
    l.push(data.isp);
  }
  return l.join(' ');
}

// 监听点击事件
chrome.browserAction.onClicked.addListener(toggleOnOff);

// 回复状态
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	// 请求设置状态
	if ('status' === request.get) {
		sendResponse(setting);
	}
	else if ('ip' === request.get) {
		var ip = 'null';
		if (currentIPList[sender.tab.url]) {
			ip = currentIPList[sender.tab.url];
			delete currentIPList[sender.tab.url];
		}
		sendResponse({'ip': ip});
	}
	else if ('location' === request.get) {
		var location = '';
		http_ajax('http://ip.taobao.com/service/getIpInfo.php?ip=' + request.data, 'GET', false, function(data) {
			if (true === data.success) {
				try {
					var loc = JSON.parse(data.content);
          if (loc.code === 0) {
            location = ipLocation(loc.data || {});
          } else {
            location = '内网或未分配 IP';
					}
				} catch(exception) {
          location = '无法识别的 IP';
				}
			}
			else {
				location = '';
			}
		});
		sendResponse({'location': location});
	}
});

// 缓存IP，每次用完就清空
var currentIPList	= {};

function onCompletedFunc(info) {
	currentIPList[ info.url ] = info.ip;
	return;
}

// 加载配置
chrome.storage.local.get(['status'], function(data) {
	if ('off' === data['status']) {
		setting['status'] = 'off';
	}
	// 读取配置成功之后，显示图标
	setStatus(setting['status']);
});
