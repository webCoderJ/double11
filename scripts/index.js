$(function() {
    // db
    var clothes = [
        [],
        [
            { img: "./imgs/01-brown.png", color: "01款-卡其色", code: "1-1" },
            { img: "./imgs/01-pink.png", color: "01款-粉红色", code: "1-2" }
        ],
        [
            { img: "./imgs/02-blue.png", color: "02款-蓝色", code: "2-1" },
            { img: "./imgs/02-pink.png", color: "02款-粉红色", code: "2-2" },
            { img: "./imgs/02-red.png", color: "02款-红色", code: "2-3" }
        ],
        [
            { img: "./imgs/03-blue.png", color: "03款-蓝色", code: "3-1" },
            { img: "./imgs/03-brown.png", color: "03款-卡其色", code: "3-2" },
            { img: "./imgs/03-pink.png", color: "03款-粉红色", code: "3-3" }
        ],
        [
            { img: "./imgs/04-gray.png", color: "04款-灰色", code: "4-1" },
            { img: "./imgs/04-orange.png", color: "04款-浅橙色", code: "4-2" },
            { img: "./imgs/04-white.png", color: "04款-白色", code: "4-3" }
        ],
        [
            { img: "./imgs/05-blue.png", color: "05款-驼蓝色", code: "5-1" },
            { img: "./imgs/05-pink.png", color: "05款-粉蓝色", code: "5-2" }
        ],
        [
            { img: "./imgs/06-purple.png", color: "06款-深紫色", code: "6-1" },
            { img: "./imgs/06-red.png", color: "06款-红色", code: "6-2" },
            { img: "./imgs/06-white.png", color: "06款-米白色", code: "6-3" }
        ]
    ];

    // 配置微信分享, 详见 ./wxConf.js
    wxShareConfig({
        host: "",   // 备案地址
        shareLink: location.href,
        title: "惊呆了，除了双十一还可以这样玩",
        desc: "年年11.11，关于双十一那些你还不知道的事",
        img: "",    // absulote img url
    })

    // 当前选中数据
    let curCloth = null;

    $("#full").fullpage({
        navigation: true,
        navigationPosition: "right",
        verticalCentered: false,
        // sectionsimg: "", Color: ['#f2f2f2', '#4BBFC3', '#7BAABE', 'whitesmoke', '#000'],
        afterRender: function() {},
        afterLoad: function(anchorLink, index) {
            // 竖向移动
            if (clothes[index - 1].length > 0) {
                curCloth = clothes[index - 1][0];
                console.log(curCloth);
            }
        },
        afterSlideLoad: function(section, origin, destination, direction) {
            // 横向移动
            if (
                clothes[origin - 1].length > 0 &&
                clothes[origin - 1][destination]
            ) {
                curCloth = clothes[origin - 1][destination];
                console.log(curCloth);
            }
        }
    });

    // 根据上述数据生成款式颜色分类
    function genarateColors() {
        var colorDetailWrapper =
            '<ul class="mgt5 colorDetail" class="colorDetail">';
        $.each(clothes, function(index, item) {
            if (item.length > 0) {
                if (index != 1) {
                    colorDetailWrapper += "</br>";
                }
                $.each(item, function(index, oColor) {
                    colorDetailWrapper +=
                        '<li data-action="changeColor" data-code="' +
                        oColor.code +
                        '" data-img="' +
                        oColor.img +
                        '" data-color="' +
                        oColor.color +
                        '" class="tag">' +
                        oColor.color +
                        "</li>";
                });
            }
        });
        colorDetailWrapper += "</ul>";
        $(".selectDialog_color").append($(colorDetailWrapper));
    }

    function openBuyDialog() {
        layer.open({
            type: 1,
            content: $("#selectDialog").html(),
            anim: "up",
            style:
                "position:fixed; bottom:0; left:0; width: 100%; height: 500px; border:none;border-top-left-radius: 0.25rem;border-top-right-radius: 0.25rem;"
        });
        $(".selectDialogWrapper").scroll(function() {
            return false;
        });
        return false;
    }

    function activeTag(tarCode, color) {
        $(".layui-m-layercont .colorDetail")
            .children()
            .each(function(index, item) {
                let $item = $(item);
                $item.removeClass("active");
                var code = $item.attr("data-code");
                var img = $item.attr("data-img");
                if (code === tarCode) {
                    curCloth.code = tarCode;
                    curCloth.img = img;
                    curCloth.color = color;
                    if(color){
                        curCloth.color = color;
                    }
                    $item.addClass("active");
                    $(".layui-m-layercont .selectDialog_img").css({
                        "background-image": "url(" + img + ")"
                    });
                    console.log(curCloth);
                }
            });
    }

    // 根据数据生成颜色分类
    genarateColors();

    // 页面所有按钮事件
    $(document.body).on("tap", function(e) {
        var action = $(e.target).attr("data-action");
        var targetClass = $(e.target).attr("class");
        if (targetClass == "layui-m-layershade" || action === "closeLay") {
            layer.closeAll();
            $.fn.fullpage.setAllowScrolling(true);
        }
        if (action === "buyNow") {
            $.fn.fullpage.setAllowScrolling(false);
            openBuyDialog();
            activeTag(curCloth.code, curCloth.color);
        }
        if (action === "changeColor") {
            var code = $(e.target).attr("data-code");
            var color = $(e.target).attr("data-color");
            activeTag(code, color);
        }
        if (action === "delCount") {
            console.log('del');
            var val = Number($(".layui-m-layercont .countInput").val());
            if (val > 1) {
                $(".layui-m-layercont .countInput").val(val - 1);
            }
        }
        if (action === "addCount") {
            console.log('add');
            var val = Number($(".layui-m-layercont .countInput").val());
            $(".layui-m-layercont .countInput").val(val + 1);
        }
        // 提交订单
        if (action === "buyConfirm") {
            var orderInfo = {};
            orderInfo.count = $(".layui-m-layercont .countInput").val();
            orderInfo.name = $(".layui-m-layercont .name").val();
            orderInfo.cloth = curCloth;
            if (!orderInfo.name) {
                //提示
                return layer.open({
                    content: "请填写收货人姓名",
                    skin: "msg",
                    time: 2 //2秒后自动关闭
                });
            }
            orderInfo.address = $(".layui-m-layercont .address").val();
            if (!orderInfo.address) {
                //提示
                return layer.open({
                    content: "请填写收货地址",
                    skin: "msg",
                    time: 2 //2秒后自动关闭
                });
            }
            orderInfo.phone = $(".layui-m-layercont .phone").val();
            if (!orderInfo.phone) {
                //提示
                return layer.open({
                    content: "请填写收货人手机号",
                    skin: "msg",
                    time: 2 //2秒后自动关闭
                });
            }
            //loading层
            var layId = layer.open({ type: 2 });
            console.log("orderInfo: ", orderInfo);
            $.ajax({
                url: "",
                data: orderInfo
            }).then(function(data) {
                layer.close(layId);
            });
        }
        return false;
    });
});
