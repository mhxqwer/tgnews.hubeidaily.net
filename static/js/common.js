var HDB_API_HOST = "https://hbrbapi.hubeidaily.net/amc/client/";//"http://news.hubeidaily.net:8066/amc/client/";
var CLIENT_API_HOST = "https://hbrbapi.hubeidaily.net/amc/v1/";//"http://news.hubeidaily.net:8066/amc/v1/";
var ES_TOKEN_API = "https://hbrbapi.hubeidaily.net/amc/client/getApiKey";//"http://news.hubeidaily.net:8066/amc/client/getApiKey";
var IS_START_STATICS = true;//false;
var WB_SHAREURL = 'https://service.weibo.com/share/share.php?'; // 微博分享地址
var WB_APPKEY = ""; // 微博APPKEY

var myContentTypeList = [4,5,6,7,8,9,11,12,13,15];//资讯
var specialContentTypeList = [5,6,8,9,11,12];//专题
var mediaContentTypeList = [5,6,9,11];//自媒体号

String.prototype.format = function(args) {
    var result = this;
    if (arguments.length > 0) {
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                if(args[key]!=undefined){
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        }
        else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    var reg = new RegExp("({)" + i + "(})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
    }
    return(false);
}

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


var deviceId = null;
if(localStorage.getItem("statisticsTjSa") && localStorage.getItem("statisticsTjSa").length === 32){
    deviceId = localStorage.getItem("statisticsTjSa");
}else{
    deviceId = uuid(32,16);
    localStorage.setItem("statisticsTjSa", deviceId);
}


var login = {
    time: 60,
    timePicker: null,
    verifyCodeId : '',
    getVerifyCode : function(){
        hdbRequest("cms/getLoginVerifyCode",{},function (res){
            if(res && res.suc == 1 ) {
                login.verifyCodeId = res.data.uid;
                $("#verifyCodeImage").attr("src","data:image/png;base64,"+ res.data.image);
            }else{
                console.log('获取图形验证码错误:' + e)
            }
        },function (e){
            console.log('获取栏目列表错误:' + e)
        },"post");
    },
    sendCode:function(){
        if($("#phone").val() == ""){
            Dialog.alert("请输入手机号!");
            return;
        }
        if($("#imgCode").val() == ""){
            Dialog.alert("请输入图形验证码!");
            return;
        }
        var _this = this;
        _this.time = 60;
        $("#sendCode").attr('disabled',"true");
        $("#sendCode").html('请(' + _this.time + ')秒后重新获取');
        _this.timePicker = setInterval(function () {
            _this.time--;
            if(_this.time==0){
                _this.clearPicker();
            }else{
                $("#sendCode").html('请(' + _this.time + ')秒后重新获取');
            }
        }, 1000);
        var params = {
            mobilephone : $('#phone').val(),
            uid : login.verifyCodeId,
            code : $("#imgCode").val(),
            requestTime : new Date().getTime()
        };
        hdbRequest("cms/getAuthCode",params,function (res){
            if(res && res.suc == 0){
                Dialog.alert("获取短信验证码失败！");
                _this.clearPicker();
            }
        },function (e){
            console.log('获取短信验证码失败:' + e);
            _this.clearPicker();
        },"post");
    },
    loginStatus:function(){
        $("#userDialog .title-con").text("登 录");
        $("#userDialog .login-btn").text("登 录");
        login.getVerifyCode();
        $("#userDialog .to-login").hide();
        $("#userDialog .to-regist").show();

    },
    registStatus: function(){
        $("#userDialog .title-con").text("注 册");
        $("#userDialog .login-btn").text("注 册");
        login.getVerifyCode();
        $("#userDialog .to-regist").hide();
        $("#userDialog .to-login").show();
    },
    clearForm: function(){
        $("#phone").val('');
        $("#verifyCode").val('');
        $("#imgCode").val('');
    },
    clearPicker: function(){
        var _this = this;
        clearInterval(_this.timePicker);
        _this.time = 60;
        $("#sendCode").removeAttr("disabled");
        $("#sendCode").html('发送验证码');
    }
}

function showSearch(obj){
    $(obj).hide();
    $("#searchForm").addClass("w130");
}

function refreshVerifyCodeImage() {
    login.getVerifyCode();
}

function sendCode(){
    login.sendCode();
}

function showLogin(){
    $("#mask").show();
    login.loginStatus();
    $("#userDialog").show();
}

function showRegist(){
    $("#mask").show();
    login.registStatus();
    $("#userDialog").show();
}

function hideUserDialog(){
    $("#userDialog").hide();
    login.clearForm();
    $("#mask").hide();
}

function switchRegist(){
    login.clearForm();
    login.registStatus();
    login.clearPicker();
}

function switchLogin(){
    login.clearForm();
    login.loginStatus();
    login.clearPicker();
}

function submitLogin(){
    if($("#phone").val() == ""){
        Dialog.alert("请输入手机号!");
        return;
    }
    if($("#verifyCode").val() == ""){
        Dialog.alert("请输入短信验证码!");
        return;
    }
    var info = {
        authType: "sms",
        clientId:"client_webyth",
        clientSecret:"root2021hbrbythwab542",
        phoneNumber: $("#phone").val(),
        phoneCode: $("#verifyCode").val(),
        requestTime : new Date().getTime()
    }
    request(CLIENT_API_HOST + "loginByPhone",JSON.stringify(info),function (res){
        if(res && res.suc == 1 && res.data) {
            localStorage.setItem("accessToken",JSON.stringify(res.data.accessToken));
            localStorage.setItem("refreshToken",JSON.stringify(res.data.refreshToken));
            hdbRequest("getMemberByToken",{},function (res) {
                if(res && res.suc == 1 && res.data) {
                    localStorage.setItem("memberInfo",JSON.stringify(res.data.memberInfo));
                    hideUserDialog();
                    $('#registerBtn').hide();
                    $('#loginBtn').hide();
                    $('#memberInfoDiv').html(res.data.memberInfo.nickName);
                    $('#memberInfoDiv').show();
                    $('.myCollect').show();
                    $('#btnLogout').show();
                }else{
                    Dialog.alert("登录失败！");
                }
            },function (e){
                console.log('登录失败:' + e);
            },"get","json",res.data.accessToken);
        }else{
            Dialog.alert("登录失败！");
        }
    },function (e){
        console.log('登录失败:' + e);
    },"post","json",{"Content-Type":"application/json"});
}

//判断是否登录
function isLogin() {
    if (getMemberId()){
        return true;
    }else{
        showLogin();
        return false;
    }
}

function getMemberId(){
    var memberInfo = localStorage.getItem("memberInfo");
    if (memberInfo) {
        var member = JSON.parse(memberInfo);
        if (member) {
            return member.id;
        }
    }
    return null;
}

function hdbRequest(url, params, sucFun, errFun, type, dataType,accessToken) {

    var salt = "hbrb-app-amc";
    var h5Str = "h5Client-id";
    var time = new Date().getTime();
    var str = salt + "$" + time;
    str = md5(str);
    str = h5Str + "$" + str + "$" + time;
    str = md5(str);
    var headers = {};
    if(accessToken != null && accessToken != ""){
        headers = {
            "token" : str,
            "requestTime" : time,
            "Authorization":"bearer " + accessToken
        };
    }else{
        headers = {
            "token" : str,
            "requestTime" : time,
        };
    }

    request(HDB_API_HOST + url, params, sucFun, errFun, type, dataType, headers);
}

function request(url, params, sucFun, errFun, type, dataType, headers){
    $.ajax({
        type: type ? type:"post",
        url: url,
        headers: headers,
        data: params,
        dataType: dataType ? dataType : "json",
        success: function(res) {
            sucFun(res);
        },
        error: function (e) {
            errFun(e)
        }
    });
}

function scrollH(){
    var scrollTop = document.documentElement.scrollTop;

    if ( scrollTop < 6){
        $("#header").removeClass('hdfloat');
    }else{
        $("#header").addClass('hdfloat');
    }
}

function init(){

    var memberInfo = JSON.parse(localStorage.getItem("memberInfo"));
    if(memberInfo){
        $('#registerBtn').hide();
        $('#loginBtn').hide();
        $('#memberInfoDiv').html(memberInfo.nickName);
        $('#memberInfoDiv').show();
        $('.myCollect').show();
        $('#btnLogout').show();
    }else{
        $('#btnLogout').hide();
    }

    $("#btnLogout").click(function(){
        localStorage.removeItem("memberInfo");
        $('#registerBtn').show();
        $('#loginBtn').show();
        $('#memberInfoDiv').hide();
        $('.myCollect').hide();
        $('#btnLogout').hide();
    });

    scrollH();

    $("#searchBtn").click(function(){
        var txt = $("#searchKey").val();
        var url = $('#hidFullSearch').val();
        url = url + "?q=" + encodeURI(txt);
        window.open(url,"_blank");
    });

    $("#header .head-nav .nav-item a").each(function(){
        $(this).click(function(){
            if(!$(this.parentElement).hasClass("on")){
                $(this.parentElement).addClass("on").siblings().removeClass('on');
            }
        });
    });

    // 如果没有二级栏目，不需要绑id
    /*$("#header .head-nav .nav-item a").hover(function(){
        var idStr = $(this).data("id");
        if(!!idStr){
            var left = $(this).offset().left + $(this).width()/2 + 13 - $("#channel"+idStr).width()/2;
            var top = $(this).offset().top + $(this).height() + 20 + 10;
            $("#channel"+idStr).css("left",left).css("top",top).addClass("nav-hover");
        }
    },function(){
        $("#channel"+$(this).data("id")).removeClass("nav-hover");
    });

    $(".channel-box").hover(function(){
        $(this).addClass("channel-hover");
    },function(){
        $(this).removeClass("channel-hover");
    });*/

    // 电子报切换
    var epaList = [
        { name: "湖北日报", link: "https://epaper.hubeidaily.net", imgSrc: "/r/cms/www/default/images/newspaper_hubeiribao.jpg" },
        { link: "楚天都市报", link: "https://ctdsbepaper.hubeidaily.net", imgSrc: "/r/cms/www/default/images/chutiandushi.jpg" },
        { link: "农村新报", link: "https://ncxbepaper.hubeidaily.net", imgSrc: "/r/cms/www/default/images/nongcunxinbao.jpg" },
    ];
    $(".epa-box .epa-tabs .tab-item").each(function(index){
        $(this).click(function () {
            if(!$(this).hasClass('on')){
                $(this).addClass('on').siblings().removeClass('on');
                $("#newsPic").attr("href", epaList[index].link).css("background-image", "url('" + epaList[index].imgSrc + "')");
            }
        })
    });
}

// 微信二维码分享
$("body").on('mouseenter','.share-box .share-wechat',function(){
    var sourceType = $(this).data('type')
    var url = '';
    if(sourceType === undefined || sourceType == null || sourceType == ''){
        var localUrl = window.location.href;
        url = localUrl.replace('/p1/','/m1/');
    }else{
        url = $(this).data("link");
    }
    var pos = this.getBoundingClientRect();
    var left = document.documentElement.scrollLeft + pos.left + pos.width/2 - 100;
    var top = document.documentElement.scrollTop + pos.top - 209;

    $("body").append('<div class="wechat-qrcode" style="left:' + left + 'px;top:' + top + 'px;"><h4>微信扫一扫：分享</h4><div class="qrcode"></div><div class="help"><p>微信里点“发现”，扫一下</p><p>二维码便可将本文分享至朋友圈。</p></div></div>');

    $("body").find('.qrcode').qrcode({render: 'image', size: 100, text: url });
});

// 移除微信二维码分享
$("body").on('mouseleave','.share-box .share-wechat',function(){
    $("body>.wechat-qrcode").remove();
});

// 微博分享
$("body").on('click','.share-box .share-weibo',function(){
    var _shareUrl = WB_SHAREURL;
    var sourceType = $(this).data('type')
    var url = '';
    if(sourceType === undefined || sourceType == null || sourceType == ''){
        var localUrl = window.location.href;
        url = localUrl.replace('/p1/','/m1/');
    }else{
        url = $(this).data("link");
    }
    var data = {
        title: $(this).data("title"),
        url: url,
        imgUrl: $(this).data("pic") || "",
        appkey: WB_APPKEY || '',
    }

    _shareUrl += '&url='+ encodeURIComponent( data.url );
    _shareUrl += '&title=' + encodeURIComponent( data.title );
    _shareUrl += '&pic=' + encodeURIComponent( data.imgUrl );
    _shareUrl += '&appkey=' + encodeURIComponent( data.appkey );

    window.open(_shareUrl,'_blank');
});

$(function(){
    init();
});

window.onscroll = function () {
    scrollH();
}


//1、活动；2、抽奖；3、投票调查；4、直播间；5、图文资讯；6、图集;
//7、专题；8、占位广告；9、视频 ；10、问卷调查；11、音频； 12、外链；13、自媒体；
//15 政情,16、报料 ,(统计访问量时使用22弹窗广告,23:启动页广告)
function getContentTypeStr(contentType) {
    var str = "";
    switch (contentType) {
        case 1:
            str = "活动";
            break;
        case 2:
            str = "抽奖";
            break;
        case 3:
            str = "投票";
            break;
        case 4:
            str = "直播";
            break;
        case 5:
            str = "图文";
            break;
        case 6:
            str = "图集";
            break;
        case 7:
            str = "专题";
            break;
        case 8:
            str = "广告";
            break;
        case 9:
            str = "视频";
            break;
        case 10:
            str = "问卷";
            break;
        case 11:
            str = "音频";
            break;
        case 12:
            str = "外链";
            break;
        case 13:
            str = "自媒体";
            break;
        case 15:
            str = "政情";
            break;
        case 16:
            str = "报料";
            break;
    }
    return str;
}

var defImg = "/r/cms/www/default/images/defImage.png";

function getDefImg(imgUrl) {
    var imageUrl = defImg
    if(imgUrl && imgUrl != '')
        imageUrl = imgUrl;
    return imageUrl;
}

function getImgByStyle(item){
    var imageUrl = defImg

    if (item.imgUrl){
        imageUrl = item.imgUrl;
    }

    //1无图 2小图 3大图 4三图
    switch (item.styleType){
        case 4:
            if(item.pictureUrls && item.pictureUrls.length > 0){
                imageUrl = item.pictureUrls[0];
            }
            break;
        case 3:
            if(item.imgList && item.imgList[0] && item.imgList[0].bigUrl && item.imgList[0].bigUrl != '') {
                imageUrl = item.imgList[0].bigUrl;
            }
            break;
        case 2:
            if(item.imgList && item.imgList[0] && item.imgList[0].url && item.imgList[0].url != '') {
                imageUrl = item.imgList[0].url;
            }
            break;
        default:
            break;
    }
    return imageUrl;
}


function isExistImg(item){
    var imageUrl = "";

    if (item.imgUrl){
        imageUrl = item.imgUrl;
    }

    //1无图 2小图 3大图 4三图
    switch (item.styleType){
        case 4:
            if(item.pictureUrls && item.pictureUrls.length > 0){
                imageUrl = item.pictureUrls[0];
            }
            break;
        case 3:
            if(item.imgList && item.imgList[0] && item.imgList[0].bigUrl && item.imgList[0].bigUrl != '') {
                imageUrl = item.imgList[0].bigUrl;
            }
            break;
        case 2:
            if(item.imgList && item.imgList[0] && item.imgList[0].url && item.imgList[0].url != '') {
                imageUrl = item.imgList[0].url;
            }
            break;
        default:
            break;
    }
    return imageUrl;
}


//获取点赞图标
function getAppFunButtonConfigNew(){
    if (sessionStorage.getItem("topUrlNormal") && sessionStorage.getItem("topUrlPress")){
    }else{
        var params = {
            "callback" : "",
            "deviceId" : deviceId,
        };
        hdbRequest("getAppFunButtonConfigNew",params,function (res){
            if(res && res.suc == 1 && res.data) {
                var topUrlNormal = res.data.addTopBtn.iconUrl_normal;
                var topUrlPress = res.data.addTopBtn.iconUrl_press;

                sessionStorage.setItem("topUrlNormal",topUrlNormal);
                sessionStorage.setItem("topUrlPress",topUrlPress);
            }
        },function (e){
            console.log(e.responseText)
        },"post");
    }
}

function loadTheme(){
    hdbRequest("listAppThemeType",{},function (res){
        if(res && res.suc == 1 && res.data) {
            if(res.data.id == 1  && res.data.isShow == 1){
                $('body').removeClass('gray-body').addClass('gray-body');
            }else{
                $('body').removeClass('gray-body');
            }
        }else{
            $('body').removeClass('gray-body');
        }
    },function (e){
        console.log(e.responseText)
    },"post");
}

function transferPcUrl(pcUrl){
    if(pcUrl === undefined || pcUrl == null || pcUrl == '') return '';
    return pcUrl.replace('/p1/','/pc/');
}

function transferMobileUrl(mobileUrl){
    if(mobileUrl === undefined || mobileUrl == null || mobileUrl == '') return '';
    return mobileUrl.replace('/m1/','/mobile/');
}

function addContentLinkListenner(){
	$(".detail-cont label[data-plugin-type='content']").each(function(i,lab){
		lab.onclick = onClickContentLink;
	});
}

function addActivityLinkListenner(){
	$(".detail-cont label[data-content-type='1']").each(function(i,lab){
		lab.onclick = onClickActivityLink;
	});
}

function addAdvertiseLinkListenner(){
	$(".detail-cont label[data-content-type='8']").each(function(i,lab){
		lab.onclick = onClickAdvertiseLink;
	});
}


function onClickContentLink(){
	var id = this.getAttribute('data-id');
	var originalId = this.getAttribute('data-original-id');
	var contentType = this.getAttribute('data-content-type');
	var url = "/hubeidailyshare/#/index_share?contentType=" + contentType + "&contentId=" + id + "&id=" + originalId;
	console.log(url);
	window.open(url,'_blank');
}

function onClickActivityLink(){
	var id = this.getAttribute('data-id');
	var originalId = this.getAttribute('data-original-id');
	var contentType = this.getAttribute('data-content-type');
	var url = "/hubeidailyshare/#/index_share?contentType=1&contentId=" + id ;
	console.log(url);
	window.open(url,'_blank');
}

function onClickAdvertiseLink(){
	var id = this.getAttribute('data-id');
	var url = "/hubeidailyshare/#/index_share?contentType=8&contentId=" + id ;
	console.log(url);
	window.open(url,'_blank');
}

if ($("#hidFullSearch")) {
    $('#hidFullSearch').val(transferPcUrl($('#hidFullSearch').val()));
}
if ($("#hidVideoChannel")) {
    $('#hidVideoChannel').data('url', transferPcUrl($('#hidVideoChannel').data('url')));
}
if ($("#hidVideoChannelId")) {
    $('#hidVideoChannelId').data('url', transferPcUrl($('#hidVideoChannelId').data('url')));
}
if ($("#hidSelfMediaChannel")) {
    $('#hidSelfMediaChannel').data('url', transferPcUrl($('#hidSelfMediaChannel').data('url')));
}
if ($("#hidSelfMediaChannelId")) {
    $('#hidSelfMediaChannelId').data('url', transferPcUrl($('#hidSelfMediaChannelId').data('url')));
}
$('.myCollect').each(function(){
    $(this).attr('href',transferPcUrl($(this).attr('href')));
});

setTimeout(function(){
	$('.activity-report-box .box-title span').text('政情');
},100);

setTimeout(function(){ 
	$(".link-list li a").eq(-1).attr("href",transferPcUrl($(".link-list li a").eq(-1).attr("href")));
	$(".link-list li a").eq(-2).attr("href",transferPcUrl($(".link-list li a").eq(-2).attr("href")))
	$(".copyright span").eq(0).html('Copyright © 湖北日报 [鄂ICP备12007957-2号]');
	$(".link-list li a").eq(-4).attr("href",'https://epaper.hubeidaily.net');
   	$('#newsPic').attr('href','https://epaper.hubeidaily.net');
}, 500);

loadTheme();
getAppFunButtonConfigNew();

setTimeout(function(){
	addContentLinkListenner();
	addAdvertiseLinkListenner();
	addAdvertiseLinkListenner();
}, 500);
