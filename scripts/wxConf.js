;(function () {

    window.wxShareConfig = wxShareConfig;
    function wxShareConfig(config) {
        //console.log('wx_config:',config);
        config = config || {};
        var registedHost = config.host;
        var shareLink = config.shareLink;
        var shareTitle = config.title;
        var shareDesc = config.desc;
        var shareImg = config.img;

        /*检测微信环境*/
        var isWeiXin = navigator.userAgent.toLowerCase().indexOf('micromessenger') != -1;
        if (isWeiXin) {
            /*获取微信SDK权限*/
            $(function () {
                $.ajax({
                    type: "post",
                    url: registedHost,
                    data: {
                        url: window.location.href
                    },
                    success: function (data) {
                        //console.log('jssdkInfo'+ data);
                        var json = JSON.parse(data).data;
                        wx.config({
                            debug: shareDebug,
                            appId: json.appId,
                            timestamp: json.timestamp,
                            nonceStr: json.nonceStr,
                            signature: json.signature,
                            jsApiList: [
                                'onMenuShareTimeline',
                                'onMenuShareAppMessage',
                                'onMenuShareQQ'
                            ]
                        });
                    }
                });
            });

            /*配置微信分享信息*/
            wx.ready(function () {
                /*console.log("wx_is_ready and hitDone event is binded");*/
                console.log("wechat share is ready");
                /*获取“分享给朋友”按钮点击状态及自定义分享内容接口*/
                wx.onMenuShareAppMessage({
                    title: shareTitle,
                    desc: shareDesc,
                    link: shareLink,
                    /*imgUrl: window.location.protocol + "//" + window.location.hostname + "/activity/t31_game/share_pic_other.jpg",*/
                    imgUrl: shareImg,
                    trigger: function (res) {

                    },
                    success: function (res) {
                        
                    },
                    cancel: function (res) {

                    },
                    fail: function (res) {

                    }
                });
            });
        }
    }
}());