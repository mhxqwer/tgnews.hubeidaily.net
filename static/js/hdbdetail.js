var hdbDetail = {
    //获取点赞、收藏状态
    getCollectthumbs:function (){
        var _this = this;
        var memberId = getMemberId();
	if(cId === undefined || cId == null || cId == '')
            cId = 0;
        if(contentType === undefined || contentType == null || contentType == '')
            contentType = 0;
        if(contentId === undefined || contentId == null || contentId == '')
            contentId = 0;
        if(fromFlag === undefined || fromFlag == null || fromFlag == '')
            fromFlag = 0;
        var params = {
            "contentId" : cId,
            "contentType" : contentType,
            "memberId" : memberId,
            "deviceId" : deviceId,
            "rId" : contentId,
            "isSpecial" : fromFlag,
        };
        hdbRequest("getCollectthumbs",params,function (res){
            if(res && res.suc == 1 && res.data) {
            	if(res.data.allowComment != undefined && res.data.allowComment != null && res.data.allowComment == true){
                    $('.news-comments').show();
                }else{
                    $('.news-comments').hide();
                }
                if(res.data.likesSupport != undefined && res.data.likesSupport != null && res.data.likesSupport == 1){
                    $('.praise-box').show();
                    if(res.data.topCount === undefined || res.data.topCount == null)
                        res.data.topCount = 0;
                    changePraiseCss(res.data.isTopCount == 1,res.data.topCount);
                }else{
                    $('.praise-box').hide();
                }
                if(res.data.isCollect != undefined && res.data.isCollect != null && res.data.isCollect == 1){
                    $(".praise-collect-box .collect-box").addClass('collected');
                }
	    }
        },function (e){
            console.log(e.responseText)
        },"post");
    },
    //根据用户id、自媒体id获取自媒体详情
    getSelfMediaFreChannel: function (){
        $('.we-media').hide();
        if (mediaId == 0){
            return;
        }
        var memberId = getMemberId();
        var params = {
            "callback": "",
            "deviceId" : deviceId,
            "id" : mediaId,
            "userId" : memberId,
        };
        hdbRequest("getSelfMediaFreChannel",params,function (res){
            var html =
                "<div class=\"portrait\">" +
                "    <img src=\"{0}\">" +
                "</div>" +
                "<div class=\"text\">" +
                "    <div class=\"nick\">{1}</div>" +
                "    <div class=\"create-time\">{2}</div>" +
                "    <div class=\"follow-box\">" +
                "        <span class=\"follow-btn{3}\" data-id=\"{5}\">{4}</span>" +
                "    </div>" +
                "</div>";

            if(res && res.suc == 1 && res.data) {
                var item = res.data;

                var followStyle = "";
                var followText = "+关注";
                if(item.isSubscribe){
                    followStyle = " followed";
                    followText = "已关注";
                }

                html = html.format(getDefImg(item.lconImagePath),
                    item.name,
                    item.creationTime,
                    followStyle,
                    followText,
                    item.id);
            }
            $('#we-media').html(html);

            // 关注/取消关注
            $(".we-media .follow-btn").each(function(index){
                $(this).click(function () {
                    var _this = $(this);
                    var id = _this.attr("data-id");
                    if(!_this.hasClass('followed')){
                        hdbDetail.subscribeSelfMedia(true, id,function (){
                            _this.addClass('followed').text("已关注");
                        });
                    }else{
                        hdbDetail.subscribeSelfMedia(false, id,function (){
                            _this.removeClass('followed').text("+关注");
                        });
                    }
                });
            });
            $('.we-media').show();
        },function (e){
            console.log(e.responseText)
        },"post");
    },
    //点赞
    addTopDataByContent: function(sucFun){
        var memberId = getMemberId();
        var params = {
            "callback": "",
            "contentId" : contentId,
            "contentType" : contentType,
            "deviceId" : deviceId,
            "deviceType" : "",
            "memberId" : memberId,
            "netIp" : "",
            "request" : "",
            "sourceType" : 3,//1:苹果;2:安卓;3web;4:H5
        };
        hdbRequest("addTopDataByContent",params,function (res){
            if(res && res.suc == 1 && res.data) {
                sucFun(res);
            }else{
                Dialog.alert(res.message);
            }
        },function (e){
            console.log(e.responseText)
        },"post");
    },
    //取消点赞
    deleteTopDataByContent: function(sucFun){
        var memberId = getMemberId();
        var params = {
            "callback": "",
            "contentId" : contentId,
            "contentType" : contentType,
            "deviceId" : deviceId,
            "memberId" : memberId,
            "request" : "",
        };
        hdbRequest("deleteTopDataByContent",params,function (res){
            if(res && res.suc == 1 && res.data) {
                sucFun(res);
            }else{
                Dialog.alert(res.message);
            }
        },function (e){
            console.log(e.responseText)
        },"post");
    },
    //收藏
    addMemberCollect: function(sucFun){
        if(!isLogin()){
            return;
        }
        var memberId = getMemberId();
        var params = {
            "callback": "",
            "contentId" : cId,
            "contentType" : contentType,
            "deviceId" : deviceId,
            "isSpecial" : fromFlag,
            "memberId" : memberId,
            "request" : "",
        };
        hdbRequest("addMemberCollect",params,function (res){
            if(res && res.suc == 1 && res.data) {
                sucFun();
            }else{
                Dialog.alert(res.message);
            }
        },function (e){
            console.log(e.responseText)
        },"post");
    },
    //取消收藏
    cancelMemberCollect: function(sucFun){
        if(!isLogin()){
            return;
        }
        var memberId = getMemberId();
        var params = {
            "callback": "",
            "contentId" : cId,
            "contentType" : contentType,
            "deviceId" : deviceId,
            "isSpecial" : fromFlag,
            "memberId" : memberId,
            "request" : "",
        };
        hdbRequest("cancelMemberCollect",params,function (res){
            if(res && res.suc == 1 && res.data) {
                sucFun();
            }else{
                Dialog.alert(res.message);
            }
        },function (e){
            console.log(e.responseText)
        },"post");
    },
    //评论
    addCommentData: function(parentId,sucFun){
        if(!isLogin()){
            return;
        }
        var memberId = getMemberId();
        var comment = $("#commText").val();
        if(comment == null || comment.trim() == ''){
            Dialog.alert("评论不能为空！");
            return;
        }
        var params = {
            "audioStreamId" : "",
            "cId" : cId,
            "callback" : "",
            "comment" : comment,
            "contentCode" : "",
            "contentId" : contentId,
            "contentKeyword" : "",
            "contentTitle" : $("#news-title").text(),
            "contentType" : contentType,
            "deviceId" : deviceId,
            "deviceType" : "",
            "frechannelId" : channelId,
            "guestSpeechId" : "",
            "longitudeLatitude" : "",
            "memberId" : memberId,
            "memberName" : JSON.parse(localStorage.getItem("memberInfo")).nickName,
            "mmsProgramId" : "",
            "netIp" : "",
            "nodeCode" : "",
            "parentId" : parentId,
            "pictureIds" : "",
            "position" : "",
            "req" : "",
            "sourceType" : 3,//1:苹果;2:安卓;3web;4:H5
            "type" : 1,//评论类型1普通评论 2对主持人发布的内容评论
        };
        hdbRequest("addCommentData",params,function (res){
            if(res && res.suc == 1 && res.data) {
                sucFun();
            }
        },function (e){
            console.log(e.responseText)
        },"post");
    },
    //订阅 取消订阅自媒体号
     subscribeSelfMedia: function(flag,id,sucFun){
        if(!isLogin()){
            return;
        }
        var userId = getMemberId();
        var params = {
            "callback" : "",
            "deviceId" : deviceId,
            "id" : id,
            "nodeCode" : "",
            "userId" : userId,
        };

        var url = "subscribeSelfMedia";
        if(!flag){
            url = "unSubscribeSelfMedia";
        }
        hdbRequest(url,params,function(res){
            if(res && res.suc == 1 && res.data) {
                sucFun(res);
            }else{
                Dialog.alert(res.message);
            }
        },function(e){
            console.log(e.responseText);
        },"post");
    },
    //相关新闻
    findRelateNewsByTitleAndKeyWords: function(){
        var params = {
            "callback": "",
            "id" : cId,
            "fromFlag":fromFlag,
            "memberId" : getMemberId()
        };

        hdbRequest("getRelateNewsListForCms",params,function(res){
            if(res && res.suc == 1 && res.data) {
                if (res.data.relatedList && res.data.relatedList.length > 0) {
                    $('.related-news-title').show();
                    $('.related-news-container').show();
                    var listHtml =
                        "<li class=\"related-news-item\">" +
                        "    <div class=\"news-img\">" +
                        "        <a href=\"{0}\" target=\"_blank\">" +
                        "            <img src=\"{1}\">" +
                        "        </a>" +
                        "    </div>" +
                        "    <div class=\"news-info\">" +
                        "        <h2 class=\"title\">" +
                        "            <a href=\"{0}\" target=\"_blank\">{2}</a>" +
                        "        </h2>" +
                        "        <div class=\"share-box\">" +
                        "            <span class=\"lb\">分享到</span>" +
                        "            <span class=\"share-wechat icon-wechat\" data-type='1' data-link=\"{5}\"></span> " +
                        "            <span class=\"share-weibo icon-weibo\" data-type='1' data-link=\"{5}\" data-title=\"{2}\" data-pic=\"{1}\"></span> " +
                        "        </div>" +
                        "        <div class=\"other clearfix\">" +
                        "            <div class=\"left\">" +
                        "                <span>{3} | {4}</span>" +
                        "            </div>" +
                        "        </div>" +
                        "    </div>" +
                        "</li>";

                    var html = "";
                    $.each(res.data.relatedList, function(i, item) {
                        html += listHtml.format(transferPcUrl(item.pcUrl),
                            getImgByStyle(item),
                            item.title,
                            getContentTypeStr(item.contentType),
                            item.publishTime,
                            transferMobileUrl(item.mobileUrl));
                    });
                    $('#related-news-list').html(html);
                }else{
                    $('.related-news-title').hide();
                    $('.related-news-container').hide();
                }
            }else{
                $('.related-news-title').hide();
                $('.related-news-container').hide();
            }
        },function(e){
            console.log(e.responseText)
        },"get");
    },
    //增加阅读历史
    addHistoryRecord: function(){
        var memberId = getMemberId();

        var data = {
            "contentID" : cId,
            "title" : "",
            "imageUrl" : "",
            "contentType" : contentType,
            "videoUrl" : "",
            "superid": "",
            "typeId" : fromFlag,
            "deviceType" : "",
            "deviceId" : deviceId,
            "netIp" : "",
            "sourceType" : 3,//1:苹果;2:安卓;3web;4:H5
            "userId" : memberId || "",
        };

        var params = {
            "data" : JSON.stringify(data),
            "deviceId" : deviceId,
            "request" : "",
        };
        hdbRequest("statistics/addHistoryRecord",params,function(res){
            if(res && res.suc == 1 && res.data) {
            }else{
                Dialog.alert(res.message);
            }
        },function(e){
            console.log(e.responseText)
        },"post");
    },
};

var cId = $("#hidFromNewsId").val();
var contentId = $("#hidFromNewsContentId").val();
var contentType = $("#hidContentType").val();
var channelId = $("#hidChannelId").val();

//null或0发布库下的内容 1:专题下的内容 2自媒体的内容
var subjectId = $("#hidContentSubjectId").val();
var columnId = $("#hidContentColumnId").val();
var mediaId = $("#hidContentMediaId").val();
var fromFlag = 0;
if (mediaId != 0){
    fromFlag = 2;
}else if (subjectId != 0 || columnId != 0){
    fromFlag = 1;
}


// 点赞/取消点赞
$(".praise-collect-box .praise-box").each(function(index){
    $(this).click(function() {
        var _this = $(this);
        if(!_this.hasClass('praised')){
            praise(true,function(res){
                changePraiseCss(true,res.data.topCount,_this);
            });
        }else{
            praise(false,function(res){
                changePraiseCss(false,res.data.topCount,_this);
            });
        }
    })
});
function praise(flag,sucFun){
    if (flag){
        hdbDetail.addTopDataByContent(sucFun);
    }else{
        hdbDetail.deleteTopDataByContent(sucFun);
    }
}
function changePraiseCss(flag,topCount,praise){
    if (praise == null){
        praise = $(".praise-collect-box .praise-box");
    }
    var dom= praise.find(".praise");
    if(flag){
        praise.addClass('praised')
    }else {
        praise.removeClass('praised');
    }
    dom.css("background-size","20px 22px");
    dom.text("点赞 " + topCount);
}


// 收藏/取消收藏
$(".praise-collect-box .collect-box").each(function(index){
    $(this).click(function() {
        var _this = $(this);
        if(!_this.hasClass('collected')){
            collect(true,function(){
                _this.addClass('collected');
            });
        }else{
            collect(false,function(){
                _this.removeClass('collected');
            });
        }
    })
});
function collect(flag,sucFun){
    if (flag){
        hdbDetail.addMemberCollect(sucFun);
    }else{
        hdbDetail.cancelMemberCollect(sucFun);
    }
}


//评论
$("#submit-btn").click(function() {
    hdbDetail.addCommentData(0,function(){
        $("#commText").val("");
        $("#wordNum").text(0);
        Dialog.alert("评论成功！")
    });
});

var vm = new Vue({
    el: "#newsCommentList",
    data() {
        return {
            commentParams: {
                callback: '',
                contentId: contentId,
                orderFlag: 0, //0时间倒序 1 时间正序 2 点赞数排序
                pageNo: 0,
                pageSize: 10,
                parentId: 0,
                type: contentType,
            },
            commentList: [],
            commentTotal: 0,
            commentPage: 0,
            commentLoadOver: false,
        }
    },
    methods:{
        /* 获取评论 */
        getCommentListByNewsId:function(){
            var _this = this;

            hdbRequest("listCommentsWithChildsByContentIdAndTypeAndParentId",_this.commentParams,function(res){
                if(res && res.suc == 1 && res.data) {
                    $.each(res.data.commentList, function(i, item) {
                        if(item.memberImg == undefined || item.memberImg == null || item.memberImg == ''){
                            item.memberImg = '/r/cms/www/default/images/photo.png';
                        }
                    });
                    if (_this.commentParams.pageNo == 0) {
                        _this.commentList = res.data.commentList;
                    } else {
                        _this.commentList = _this.commentList.concat(
                            res.data.commentList
                        );
                    }
                    _this.commentTotal = res.data.totalComment;

                    _this.commentPage = Math.ceil(
                        res.data.totalComment / _this.commentParams.pageSize
                    );
                    if (_this.commentParams.pageNo >= _this.commentPage - 1) {
                        _this.commentLoadOver = true;
                    } else {
                        _this.commentLoadOver = false;
                    }
                }
            });
        },
        /* 点击加载更多评论 */
        loadMoreComment: function(){
            this.commentParams.pageNo++;
            this.getCommentListByNewsId();
        },
        /* 获取评论回复 */
        getCommentReply(item) {
            var _this = this;
            hdbRequest("listCommentsWithChildsByContentIdAndTypeAndParentId",item.replayParams,function(res){
                if (res.suc == 1) {
                    if (item.replayParams.pageNo == 0) {
                        item.childArray = res.data.commentList;
                    } else {
                        item.childArray = item.childArray.concat(res.data.commentList);
                    }
                }
            });
        },
        /* 查看更多回复 */
        onClickCommentMoreReply(item) {
            if (!!item.replayParams) {
                item.replayParams.pageNo++;
                this.getCommentReply(item);
            } else {
                item.replayParams = {
                    pageNo: 0,
                    pageSize: 10,
                    contentId: this.commentParams.contentId,
                    type: this.commentParams.type,
                    parentId: item.id,
                    commentId: item.id,
                };
                this.getCommentReply(item);
            }
        },
        /* 评论/评论回复 点赞 */
        onClickCommentPraise: function(event, item) {
            var target = event.currentTarget;
            var clsArray = target.classList;
            if (!clsArray.contains("praised")) {
                var params = {
                    commentId: item.id,

                };
                hdbRequest("addTopDataComment",params,function(res){
                    if (res.suc == 1) {
                        target.classList.add("praised");
                        item.topCount++;
                    }
                });
            }
        },
        /* 显示评论回复输入框 */
        showReplay: function(item){
            if(!!item.isReplay && item.isReplay){
                Vue.set(item, "isReplay", false);
            }else{
                Vue.set(item, "isReplay", true);
            }
        },
        /* 提交评论回复 */
        submitReplay: function(item){
            var comment = $("#commText"+item.id).val();
            if(comment == null || comment.trim() == ''){
                Dialog.alert("评论不能为空！");
                return;
            }
            var params = {
                "audioStreamId" : "",
                "cId" : cId,
                "callback" : "",
                "comment" : comment,
                "contentCode" : "",
                "contentId" : contentId,
                "contentKeyword" : "",
                "contentTitle" : $("#news-title").text(),
                "contentType" : contentType,
                "deviceId" : deviceId,
                "deviceType" : "",
                "frechannelId" : channelId,
                "guestSpeechId" : "",
                "longitudeLatitude" : "",
                "memberId" : getMemberId(),
                "memberName" : JSON.parse(localStorage.getItem("memberInfo")).nickName,
                "mmsProgramId" : "",
                "netIp" : "",
                "nodeCode" : "",
                "parentId" : item.id,
                "pictureIds" : "",
                "position" : "",
                "req" : "",
                "sourceType" : 3,//1:苹果;2:安卓;3web;4:H5
                "type" : 1,//评论类型1普通评论 2对主持人发布的内容评论
            };
            hdbRequest("addCommentData",params,function (res){
                if(res && res.suc == 1 && res.data) {
                    Vue.set(item, "isReplay", false);
                    $("#commText"+item.id).val('');
                    Dialog.alert("评论成功！");
                }
            },function (e){
                console.log(e.responseText)
            },"post");
        }
    },
    mounted: function(){
        this.getCommentListByNewsId();
    }
});


hdbDetail.getCollectthumbs();
hdbDetail.getSelfMediaFreChannel();
if (contentType == 5){
    $('.related-news-title .box-title span').html('相关阅读');
    hdbDetail.findRelateNewsByTitleAndKeyWords();
}
hdbDetail.addHistoryRecord();
