var _hmt = _hmt || [];
$(function(){

    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?35b53277228efa271792552f8166d6a0";
    var s = document.getElementsByTagName("script")[0]; 
    s.parentNode.insertBefore(hm, s);

    var channelList = [];
    var channelId = parseInt($('#hidChannelId').val());
    var channelFromId = parseInt($('#hidChannelFromId').val());
    var channelHtml = "";
    var areaChannel = {
        columnId: "Area",
        type: 1,
        columnName : "地方",
        url : "javascript:;",
        hasChild: true
    };
    hdbRequest("listMemberSubscribe",{"deviceId" : deviceId},function (res){
        if(res && res.data && res.data.array){
            channelList = channelList.concat(res.data.array);
            hdbRequest("listFreeMemberSubscribe", {"deviceId" : deviceId}, function (json){
                if (json && json.suc == 1 && json.data) {
                    channelList = channelList.concat(json.data.array);
                    channelList.push(areaChannel);
                    $.each(channelList, function (i, item) {
			//if(item.columnId == 1091) return true;
                        var isCurrentChannel = false;
                        //接口获取栏目
                        if(item.subscribed != undefined && item.subscribed != null){
                            if (item.columnId == channelFromId) {
                                isCurrentChannel = true;
                            }
                            if(IS_START_STATICS){
                                if(item.columnId == 1661){
                                    item.url = $('#hidSelfMediaChannel').data('url');
                                    item.url = transferPcUrl(item.url);
                                    if(window.location.href.indexOf(item.url) >= 0){
                                        isCurrentChannel = true;
                                    }
                                }else {
                                    item.url = '/pc/channel_' + item.columnId + '.html';
                                }
                            }else{
                                if(item.columnId == 1661) {
                                    item.url = $('#hidSelfMediaChannel').data('url');
                                    item.url = transferPcUrl(item.url);
                                    if(window.location.href.indexOf(item.url) >= 0){
                                        isCurrentChannel = true;
                                    }
                                }else {
                                    item.url = '/channel_' + item.columnId + '.jhtml';
                                }
                            }
                        }else{
                            if(item.type == 1 && item.columnId == channelId){
                                isCurrentChannel = true;
                            }
                        }
                        if (item.columnName.length == 3) {
                            if(!!item.hasChild && item.hasChild) {
                                if(isCurrentChannel)
                                    channelHtml = channelHtml + '<div class="nav-item on"><a href="' + item.url + '" class="three" data-id="' + item.columnId + '">' + item.columnName + '</a></div>'
                                else
                                    channelHtml = channelHtml + '<div class="nav-item"><a href="' + item.url + '" class="three" data-id="' + item.columnId + '">' + item.columnName + '</a></div>'
                            }else{
                                if(isCurrentChannel)
                                    channelHtml = channelHtml + '<div class="nav-item on"><a href="' + item.url + '" class="three">' + item.columnName + '</a></div>';
                                else
                                    channelHtml = channelHtml + '<div class="nav-item"><a href="' + item.url + '" class="three">' + item.columnName + '</a></div>'
                            }
                        } else if (item.columnName.length == 4) {
                            if(!!item.hasChild && item.hasChild) {
                                if(isCurrentChannel)
                                    channelHtml = channelHtml + '<div class="nav-item on"><a href="' + item.url + '" class="four" data-id="' + item.columnId + '">' + item.columnName + '</a></div>'
                                else
                                    channelHtml = channelHtml + '<div class="nav-item"><a href="' + item.url + '" class="four" data-id="' + item.columnId + '">' + item.columnName + '</a></div>'
                            }else{
                                if(isCurrentChannel)
                                    channelHtml = channelHtml + '<div class="nav-item on"><a href="' + item.url + '" class="four">' + item.columnName + '</a></div>';
                                else
                                    channelHtml = channelHtml + '<div class="nav-item"><a href="' + item.url + '" class="four">' + item.columnName + '</a></div>'
                            }
                        } else {
                            if(!!item.hasChild && item.hasChild) {
                                if(isCurrentChannel)
                                    channelHtml = channelHtml + '<div class="nav-item on"><a href="' + item.url + '" data-id="' + item.columnId + '">' + item.columnName + '</a></div>'
                                else
                                    channelHtml = channelHtml + '<div class="nav-item"><a href="' + item.url + '" data-id="' + item.columnId + '">' + item.columnName + '</a></div>'
                            }else{
                                if(isCurrentChannel)
                                    channelHtml = channelHtml + '<div class="nav-item on"><a href="' + item.url + '">' + item.columnName + '</a></div>';
                                else
                                    channelHtml = channelHtml + '<div class="nav-item"><a href="' + item.url + '">' + item.columnName + '</a></div>'
                            }
                        }
                    });

                    channelHtml = channelHtml + '<div class="head-more"><a href="javascript:;" id="headMore">更多</a></div>';

                    $('#head-nav').html(channelHtml);
                
                    loadAreaChannelList();

                    $("#headMore").click(function(){
                        if(!$("#header").hasClass('autoH')){
                            $("#header").addClass("autoH");
                        }else{
                            $("#header").removeClass("autoH");
                        }
                    });

                    // 如果没有二级栏目，不需要绑id
                    $("#header .head-nav .nav-item a").hover(function(){
                        var idStr = $(this).data("id");
                        if(!!idStr){
                            var left = $(this).offset().left + $(this).width()/2 + 13 - $("#channel"+idStr).width()/2 - document.documentElement.scrollLeft;
                            $("#channel"+idStr).css("left",left).addClass("nav-hover");
                            var top = $(this).offset().top + $(this).height() + 20 + 10 - document.documentElement.scrollTop;
                            $("#channel"+idStr).css("left",left).css("top",top).addClass("nav-hover");
                        }
                    },function(){
                        $("#channel"+$(this).data("id")).removeClass("nav-hover");
                    });

                    $(".channel-box").hover(function(){
                        $(this).addClass("channel-hover");
                    },function(){
                        $(this).removeClass("channel-hover");
                    });
                    }
            });
        }
    });

  function insertAreaChannel(item){
        if(item.columnId == 1540) return;
        var channelUrl = '/pc/channel_' + item.columnId + '.html' ;
        var channelHtml = '';
        if (item.columnName.length == 3) {                                
           channelHtml = channelHtml + '<div class="nav-item on"><a href="' + channelUrl + '" class="three" data-id="' + item.columnId + '">' + item.columnName + '</a></div>'
        } else if (item.columnName.length == 4) {
            channelHtml = channelHtml + '<div class="nav-item on"><a href="' + channelUrl + '" class="four" data-id="' + item.columnId + '">' + item.columnName + '</a></div>'
        } else {
            channelHtml = channelHtml + '<div class="nav-item on"><a href="' + channelUrl + '" data-id="' + item.columnId + '">' + item.columnName + '</a></div>'
        }
        $('#head-nav .nav-item').eq(1).after(channelHtml);
    }
    
    //获取地方栏目
    function loadAreaChannelList(){
        hdbRequest("getChildrenByParentId",{"isLocalColumn" : true,"parentId":0},function (res){
            if(res && res.data && res.data.list){
                var li = '';
                $.each(res.data.list, function (i, item) {
                    if(item.columnId == channelFromId){
                        insertAreaChannel(item);
                    }
                    var url = '/pc/channel_' + item.columnId + '.html' ;
                    if(IS_START_STATICS){
                        url = '/pc/channel_' + item.columnId + '.html' ;
                    }else{
                        url = '/channel_' + item.columnId + '.jhtml' ;
                    }
                    li += '<li class="channel-item">' ;
                    if(!!item.children && item.children.length > 0){
                        var width = 20 + item.children.length * 30;
                        var left = width / 2;
                        li += 	'<a href="' + url + '">' +  item.columnName + '<span class="arrow-down"></span></a>' +
                            '<div class="sub-channel-box" style="width: ' + width + 'px;margin-left: -' + left + 'px;">' +
                            '<div class="arrow-box">' +
                            '<div class="arrow-up"></div>' +
                            '</div>' +
                            '<div class="sub-channel-list-box"><ul class="sub-channel-list clearfix">' ;
                        $.each(item.children, function (j, child) {
                            if(child.columnId == channelFromId){
                                insertAreaChannel(child);
                            }
                            var channelUrl = '/pc/channel_' + child.columnId + '.html' ;
                            if(IS_START_STATICS){
                                channelUrl = '/pc/channel_' + child.columnId + '.html' ;
                            }else{
                                channelUrl = '/channel_' + child.columnId + '.jhtml' ;
                            }
                            li += '<li class="sub-channel-item"><a href="' + channelUrl + '">' + child.columnName + '</a></li>';
                        });
                        li += '</ul></div></div></li>';
                    }else{
                        li += 	'<li class="channel-item"><a href="' + url + '">' +  item.columnName + '</a></li>' ;
                    }
                });
                $('#channelAreaList').html(li);
            }
        });
    }

    $(".myCollect").click(function (){
        var url = $(this).attr("href");
        if ($(this).data("id") == "myCollect"){
            url += "?type=0"
        }else if ($(this).data("id") == "myHistory") {
            url += "?type=1"
        }
        window.location.href = url;
        return false;
    });
});
