function http_ajax(link, method, aysnc, callback){
  //创建XMLHttpRequest对象，用原生的AJAX方式读取内容
  var xhr = new XMLHttpRequest();
  //处理细节
  xhr.onreadystatechange = function() {
    //后端已经处理完成，并已将请求response回来了
    if (xhr.readyState === 4) {
      var respData;

      //判断status是否为OK
      if (xhr.status === 200 && xhr.responseText) {
        //OK时回送给客户端的内容
        respData = {
          success : true, //成功
          content : xhr.responseText  //文件内容
        };
      } else {  //失败
        respData = {
          success : false,  //失败
          content : "load remote file content failed." //失败信息
        };
      }
      //触发回调，并将结果回送
      callback(respData);
    }
  };

  //打开读通道
  xhr.open(method, link, aysnc);

  //设置HTTP-HEADER
  // xhr.setRequestHeader("Content-Type","text/plain;charset=UTF-8");
  // xhr.setRequestHeader("Access-Control-Allow-Origin","*");

  //开始进行数据读取
  xhr.send();
};
