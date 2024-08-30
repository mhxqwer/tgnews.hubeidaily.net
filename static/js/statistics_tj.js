;(function (name, context, definition) {
    if (typeof module !== 'undefined' && module.exports) { module.exports = definition(); }
    else if (typeof define === 'function' && define.amd) { define(definition); }
    else { context[name] = definition(); }
})('uuid', this, function () {
    'use strict';

    var uuid = function(len, radix) {
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        var uuid = [], i;
        radix = radix || chars.length;
        if (len) {
            for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
        } else {
            var r;
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';
            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random()*16;
                    uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }
        return uuid.join('');
    };
    // var deviceId = null;
    // if(localStorage.getItem("statisticsTjSa") && localStorage.getItem("statisticsTjSa").length === 32){
    //     deviceId = localStorage.getItem("statisticsTjSa");
    // }else{
    //     deviceId = uuid(32,16);
    //     localStorage.setItem("statisticsTjSa", deviceId);
    // }

    var categoryType = 0;
    var channelId = document.getElementById("hidChannelId").value;
    var channelName = document.getElementById("hidChannelName").value;
    var contentCreationTime = document.getElementById("hidCreateTime").value;
    var contentId = document.getElementById("hidFromNewsContentId").value;
    var contentTitle = document.getElementById("hidContentTitle").value;
    var contentType = document.getElementById("hidContentType").value;
    var deviceType = "";
    var memberId = document.getElementById("hidMemberId").value;
    var nickName = document.getElementById("hidNickName").value;
    var request = "";
    var sourceType = 3;
    var sourceFrom = "web";

    function httpRequest(paramObj,fun,errFun) {
        var xmlhttp = null;
        if(window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
        }else if(window.ActiveXObject) {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        if(xmlhttp == null) {
            return;
        }
        var httpType = (paramObj.type || 'GET').toUpperCase();
        var dataType = paramObj.dataType || 'jsonp';
        var httpUrl = paramObj.httpUrl || '';
        var async = paramObj.async || true;
        var paramData = paramObj.data || [];
        var requestData = '';
        for(var name in paramData) {
            requestData += name + '='+ paramData[name] + '&';
        }
        requestData = requestData == '' ? '' : requestData.substring(0,requestData.length - 1);
        xmlhttp.onreadystatechange = function() {
            if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                if(typeof fun === 'function'){fun(xmlhttp.responseText)}
            }else{
                errFun;
            }
        };

        if(httpType == 'GET') {
            xmlhttp.open("GET",httpUrl,async);
            xmlhttp.send(null);
        }else if(httpType == 'POST'){
            xmlhttp.open("POST",httpUrl,async);
            xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

            var salt = "hbrb-app-amc";
            var h5Str = "h5Client-id";
            var time = new Date().getTime();
            var str = salt + "$" + time;
            str = md5(str);
            str = h5Str + "$" + str + "$" + time;
            str = md5(str);

            xmlhttp.setRequestHeader("token", str);
            xmlhttp.setRequestHeader("requestTime", time);

            xmlhttp.send(requestData);
        }
    }

    httpRequest(
        {
            httpUrl : "https://hbrbapi.hubeidaily.net/amc/client/statistics/clickPlayCount"+
                "?categoryType="+categoryType+
                "&channelId="+channelId+
                "&channelName="+channelName+
                "&contentCreationTime="+contentCreationTime+
                "&contentId="+contentId+
                "&contentTitle="+contentTitle+
                "&contentType="+contentType+
                "&deviceId="+deviceId+
                "&deviceType="+deviceType+
                "&memberId="+memberId+
                "&nickName="+nickName+
                "&request="+request+
                "&sourceType="+sourceType+
                "&sourceFrom="+sourceFrom
            , type: "POST"
        }
    );

});

