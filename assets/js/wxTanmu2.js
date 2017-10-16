var wxWidth = $(".mess-img img").width();
var wxHeight = $(".mess-img img").height();
$("#danmuarea canvas").width(wxWidth);
$("#danmuarea canvas").height(wxHeight);
// 弹幕方法
var canvasBarrage = function(canvas, data) {
    if (!canvas || !data || !data.length) {
        return;
    }
    if (typeof canvas == 'string') {
        canvas = document.querySelector(canvas);
        canvasBarrage(canvas, data);
        return;
    }
    var context = canvas.getContext('2d');
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    // 存储实例
    var store = {};

    // 字号大小
    var fontSize = 16;

    // 实例方法
    var Barrage = function(obj, index) {
        // 随机x坐标也就是横坐标，对于y纵坐标，以及变化量moveX
        this.x = (1 + index * 0.1 / Math.random()) * canvas.width;
        this.y = obj.range[0] * canvas.height + (obj.range[1] - obj.range[0]) * canvas.height * Math.random() + 36;
        if (this.y < fontSize) {
            this.y = fontSize;
        } else if (this.y > canvas.height - fontSize) {
            this.y = canvas.height - fontSize;
        }
        this.moveX = 1 + Math.random() * 3;

        this.opacity = 0.8 + 0.2 * Math.random();
        this.params = obj;

        this.draw = function() {
            var params = this.params;
            // 根据此时x位置绘制文本
            context.strokeStyle = params.color;
            context.font = fontSize + 'px -apple-system-font, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif';
            //context.fillStyle = 'rgba(255,255,255,'+ this.opacity +')';
            context.fillText(params.value, this.x, this.y);
            context.strokeText(params.value, this.x, this.y);
        };
    };

    data.forEach(function(obj, index) {
        store[index] = new Barrage(obj, index);
    });

    // 绘制弹幕文本
    var draw = function() {
        for (var index in store) {
            var barrage = store[index];
            // 位置变化
            barrage.x -= barrage.moveX;
            if (barrage.x < -1 * canvas.width * 1.5) {
                // 移动到画布外部时候从左侧开始继续位移
                barrage.x = (1 + index * 0.1 / Math.random()) * canvas.width;
                barrage.y = (barrage.params.range[0] + (barrage.params.range[1] - barrage.params.range[0]) * Math.random()) * canvas.height;
                if (barrage.y < fontSize) {
                    barrage.y = fontSize;
                } else if (barrage.y > canvas.height - fontSize) {
                    barrage.y = canvas.height - fontSize;
                }
                barrage.moveX = 1 + Math.random() * 2;
            }
            // 根据新位置绘制圆圈圈
            store[index].draw();
        }
    };

    // 画布渲染
    var render = function() {
        // 清除画布
        context.clearRect(0, 0, canvas.width, canvas.height);

        // 绘制画布上所有的圆圈圈
        draw();

        // 继续渲染
        webkitRequestAnimationFrame(render);
    };

    render();
};
//弹幕数据
var dataBarrage = new Array();
$(function() {
        var posource = $(".wx-source").offset();
        $(".wx-slide").css({
                "top": posource.top
            })
            //分享按纽
        var top = document.documentElement.clientHeight - 100;
        $(window).scroll(function() {
                var scrtop = $(window).scrollTop();
                if (scrtop <= 50) {
                    $(".wx-slide").css({
                        "top": 77
                    })
                } else {
                    $(".wx-slide").css({
                        "top": top
                    })
                }


            })
            //
        $.ajax({
            url: './assets/js/tanmu3.json',
            type: "get",
            cache: false,
            dataType: "json",
            async: false,
            success: function(data) {
                dataBarrage = data.list;
                //console.log(dataBarrage,'dataBarrage');
                //弹幕

                //canvasBarrage('#canvasBarrage', dataBarrage);


                return false;
            },
            error(msg) {
                //console.log(msg,'error');
            }
        });

    })
    //留言列表
function getmessagelist() {
    $.ajax({
        url: 'http://api.zmiti.com/v2/h5/select_question/',
        type: "POST",
        async: false,
        cache: false,
        data: {
            worksclassid: 1,
            status: 1,
        },
        success: function(data) {
            if (data.getret === 0) {
                var questionlist = data.questionlist;
                var html = "";
                $.each(questionlist, function(index, item) {
                    var headimage = item.headimage || 'assets/images/logo_footer2.png';
                    html += "<li>";
                    html += "<div class=\"user-face\">";
                    html += "<img src= " + headimage + " />";
                    html += "</div>";
                    html += "<div class=\"user-con\">";
                    html += "<div class=\"unames\">";
                    html += item.username;
                    html += "<div class=\"u-dz\" attrid=" + item.qid + ">";
                    html += "<i class=\"icon_praise_gray\"></i>";
                    html += "<span>" + item.hymn + "</span>";
                    html += "</div>";
                    html += "</div>";
                    html += "<div class=\"utext\">";
                    html += item.content;
                    html += "</div>";
                    html += "<div class=\"udates\">";
                    html += item.createtime;
                    html += "</div>";
                    html += "</div>";
                    html += "</li>";
                })
                $("#wx-getmessagelist").html(html);
            }
        }
    });
}
//显示留言
getmessagelist();
//点赞
$("#wx-getmessagelist .u-dz").on('click', function() {
        var qid = $(this).attr("attrid");
        var myhymn = $(this).find("span").text();

        $.ajax({
            url: 'http://api.zmiti.com/v2/h5/click_hymn/',
            type: 'post',
            async: false,
            data: {
                qid: qid,
            },
            success: function(data) {
                //console.log(data,'提交成功');
                if (data.getret === 0) {
                    //列表
                    getmessagelist();
                }
            }
        });
    })
    //弹出留言框
$(".wx-btn-span").on('click', function() {
        $("#wx-message-dialog").show();
    })
    //提交留言
$(".wx-weui-btn2 .wx-weui-submit").on('click', function() {
    var usercontent = $("[name=usercontent]").val();
    $.ajax({
        url: 'http://api.zmiti.com/v2/h5/add_question/',
        type: 'post',
        async: false,
        data: {
            sex: 0,
            content: usercontent,
            hymn: Math.floor(Math.random() * 20 + 1),
            classid: 15,
            sort: 1001,
            contenttype: 1, //评论
            username: window.nickname || '新华社网友',
            headimage: window.headimgurl,
            worksclassid: 1 //十九大
        },
        success: function(data) {
            if (data.getret === 0) {
                //console.log(data,'提交成功');
                //关闭弹框
                $('.zmiti-toast').css({
                    display: 'block'
                });
                setTimeout(function() {
                        $("#wx-message-dialog").hide();
                        $(window).scrollTop(0);
                        $('.zmiti-toast').css({
                            display: 'none'
                        })
                    }, 1000)
                    //列表
                    //getmessagelist();
            }


        }
    });
})



//弹幕-隐藏&显示
function changehide() {
    if (document.getElementById("ishide").checked) {
        $("#danmuarea").css("opacity", 1);
        $(".wx-open").removeClass("wx-sta2");
        $(".wx-open").addClass("wx-sta1");
        $('.zmiti-barrage').css({
                opacity: 1
            })
            //开始弹幕
        $(".mess-img-a").attr("src", "assets/images/img-053.png");

    } else {

        $("#danmuarea").css("opacity", 0);
        $('.zmiti-barrage').css({
            opacity: 0
        })
        $(".wx-open").removeClass("wx-sta1");
        $(".wx-open").addClass("wx-sta2");
        //清除弹幕
        $(".mess-img-a").attr("src", "assets/images/img-057.png");

    }
}