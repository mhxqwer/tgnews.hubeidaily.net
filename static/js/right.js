function getleaderData() {
    var params = {
        "column": 1091,
        "focusNo": 0,
        "pageNo": 0,
        "pageSize": 100,
    };
    hdbRequest("listContentByColumn", params, function (res) {
        if (res && res.suc == 1 && res.data) {
            if (res.data.contentList && res.data.contentList.length > 0) {
                var liHtml = "<li class=\"leader-item {0}\"><a href=\"{1}\">{2}</a></li>";

                var newsHtml = "";
                $.each(res.data.contentList, function (i, item) {
                    if((item.pcUrl == null || item.pcUrl == '')
                        && (item.contentType == 8 || item.contentType == 12)){
                        item.pcUrl = item.shareUrl;
                    }else {
                        item.pcUrl = transferPcUrl(item.pcUrl);
                    }
                    newsHtml += liHtml.format(item.title.length < 4 ? "" : "dbl", item.pcUrl, item.title.length < 8 ? item.title : item.title.substring(0, 7));
                });
                $('#leader-list').html(newsHtml);
            }
        }
    }, function (e) {
        console.log('获取列表错误:' + e)
    }, "post");
}

function getRecommendData() {
    var params = {
        "nodeCode": "",
        "pageSize": 5,
        "pushObject": "Android",
        "request": "",
    };
    hdbRequest("contentPushList", params, function (res) {
        if (res && res.suc == 1 && res.list) {
            if (res.list && res.list.length > 0) {
                var liHtml =
                    "<li>" +
                    "    <div class=\"recommend-item\">" +
                    "        <div class=\"item-text\">" +
                    "            <a href=\"{0}\" class=\"item-title\">{1}</a>" +
                    "        </div>" +
                    "    </div>" +
                    "</li>";

                var newsHtml = "";
                $.each(res.list, function (i, item) {
                    if((item.pcUrl === undefined || item.pcUrl == null || item.pcUrl == '')
                        && (item.contentType == 8 || item.contentType == 12)){
                        item.pcUrl = item.shareUrl;
                    }
                    item.pcUrl = transferPcUrl(item.pcUrl);
                    newsHtml += liHtml.format(item.pcUrl, item.contentTitle);
                });
                $('#recommend-list').html(newsHtml);
            }
        }
    }, function (e) {
        console.log('获取列表错误:' + e)
    }, "post");
}



$(function () {
    getleaderData();
    getRecommendData();
});
