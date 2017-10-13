/**
 * Created by fly on 2017/8/9.
 */



var worksid = '1275459017',
	doc = document;
worksid = '8986148900';
var data = {
	wxappid: 'wx5ec3d35069383211',
	wxappsecret: 'd94ea41d9cd2ba03c7cab5fc0e212cec'

}
data = {
	wxappid: 'wxfacf4a639d9e3bcc',
	wxappsecret: "149cdef95c99ff7cab523d8beca86080"
}
var zmitiUtil = {

	init: function() {
		var arr = [
			'./assets/images/1.jpg',
			'./assets/images/haowai.png',
			'./assets/images/logo.png',
			'./assets/images/pos.png',
			'./assets/images/text.png'
		]
		var s = this;
		s.getOauthurl();
		s.bindEvent();
		this.loading(arr, null, function() {
			s.setDate();
			s.getNum();
			s.setTitile();
			s.like();

			//s.socket();
		})
	},

	bindEvent: function() {
		var s = this;
		$('.wx-slide').on('click', function() {
			$(this).hide();
			document.addEventListener("touchmove", function(e) {
				e.preventDefault();
			}, {
				passive: false
			});
			$('#zmiti-header').css({
				display: 'block'
			});
			s.createImg();
		});
		var i = 0;
		$('#like3').on('click', function() { //开始点赞
			if (i === 0) {
				var like = $('#likeNum3').html() * 1 + 1;
				$('#likeNum3').html(like);
				localStorage.setItem('like', like);
			}
			i++;
		});
	},

	savePV: function(opt) {
		$.ajax({
			url: 'http://api.zmiti.com/v2/weixin/save_userview/',
			type: 'post',
			data: {
				worksid: worksid,
				wxopenid: opt.openid,
				wxname: opt.nickname,
				usercity: opt.address,
				longitude: opt.longitude,
				latitude: opt.latitude
			},
			error: function() {},
			success: function(data) {}
		})
	},
	randomString: function(len) {　
		var len = len || 8;　　
		var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/ 　　
		var maxPos = $chars.length;　　
		var pwd = '';　　
		for (var i = 0; i < len; i++) {　　　　
			pwd += $chars.charAt(Math.floor(Math.random() * maxPos));　　
		}　　
		return pwd;
	},

	createImg: function() {
		var s = this;
		var dom = $('#js_article')[0];
		html2canvas(dom, {
			useCORS: true,
			onrendered: function(canvas) {

				//console.log(canvas.toDataURL())
				var img = doc.createElement('img');
				img.src = canvas.toDataURL('image/jpg');
				img.className = 'zmiti-photo';
				doc.body.appendChild(img);

				setTimeout(function() {
					$('.zmiti-photo').addClass('active')
				}, 100)


				dom.style.display = 'none';


			},
			width: doc.documentElement.clientWidth,
			height: $('#js_article').height()
		});
	},
	setTitile: function() { //设置标题和时间
		var title = $('.tit-h2').html();
		var date = $('#post-date').html();
		if (title) {
			$('.zmiti-title').html(decodeURI(title));
		}
		if (date) {
			$('.zmiti-date').html(date);
		}


	},
	shake: function() {
		var s = this;
		$('#zmiti-stage-C').css({
			opacity: .1
		});
		setTimeout(function() {

			$('#zmiti-stage-C').css({
				opacity: 1
			});


		}, 40)
	},

	getNum: function() { //获取编号

		$.post('http://api.zmiti.com/v2/weixin/get_wxuserviewcount/', {
			worksid: worksid
		}, function(data) {
			if (data.getret === 0) {
				$('#zmiti-codenum').html('CERTIFICATE NO.' + (data.worksinfo.totalviewcount + 1))
				$('#readNum3').html(data.worksinfo.totalviewcount + 1)
			}
		})

	},
	createQrCode: function(url) { //生成二维码
		$.ajax({
			type: 'post',
			url: 'http://api.zmiti.com/v2/share/create_qrcode',
			data: {
				url: url
			}
		}).done(function(data) {
			if (data.getret === 0) {
				$('.zmiti-qrcode').attr('src', data.qrcodeurl);
			}
		})
	},

	like: function() { //点赞

		var random = localStorage.getItem('like') || (Math.random() * 1000 | 0) + 1000;
		localStorage.setItem('like', random);
		$('#likeNum3').html(random);

	},

	createNickName: function(nickname) { //生成昵称图片
		$.ajax({
			type: 'post',
			url: 'http://api.zmiti.com/v2/share/useTxtCreateImg',
			data: {
				text: nickname,
				color: '811200',
				imagewidth: nickname.length * 30,
				imageheight: 24,
				fontsize: 18,
				isfontweight: true
			}
		}).done(function(data) {
			if (data.getret === 0) {
				$('.wx-name1 img').attr('src', data.imageurl);
			}
		})
	},
	createHeadimgurl: function(src) {
		$('#wx-face1').attr('src', src)
	},
	setDate: function() {
		var D = new Date();
		var date = D.getDate();
		$('#zmiti-day').html(date)
	},
	loading: function(arr, fn, fnEnd) {
		var len = arr.length;
		var count = 0;
		var i = 0;

		function loadimg() {
			if (i === len) {
				return;
			}
			var img = new Image();
			img.onload = img.onerror = function() {
				count++;
				if (i < len - 1) {
					i++;
					loadimg();
					fn && fn(i / (len - 1), img.src);
				} else {
					fnEnd && fnEnd(img.src);
				}
			};
			img.src = arr[i];
		}
		loadimg();
	},

	posData: function() {
		return [{
				"name": "北京市",
				"log": "116.46",
				"lat": "39.92"
			},

			{
				"name": "上海市",
				"log": "121.48",
				"lat": "31.22"
			},

			{
				"name": "天津市",
				"log": "117.2",
				"lat": "39.13"
			},

			{
				"name": "重庆市",
				"log": "106.54",
				"lat": "29.59"
			}, {
				"name": "石家庄",
				"log": "114.48",
				"lat": "38.03"
			}, {
				"name": "太原市",
				"log": "112.53",
				"lat": "37.87"
			}, {
				"name": "沈阳市",
				"log": "123.38",
				"lat": "41.8"
			},

			{
				"name": "长春市",
				"log": "125.35",
				"lat": "43.88"
			},

			{
				"name": "哈尔滨市",
				"log": "126.63",
				"lat": "45.75"
			},

			{
				"name": "杭州市",
				"log": "120.19",
				"lat": "30.26"
			},

			{
				"name": "福州市",
				"log": "119.3",
				"lat": "26.08"
			},

			{
				"name": "济南市",
				"log": "106.54",
				"lat": "29.59"
			},

			{
				"name": "郑州市",
				"log": "113.65",
				"lat": "34.76"
			},

			{
				"name": "武汉市",
				"log": "114.31",
				"lat": "30.52"
			},

			{
				"name": "长沙市",
				"log": "113",
				"lat": "28.21"
			},

			{
				"name": "广州市",
				"log": "113.23",
				"lat": "23.16"
			},

			{
				"name": "海口市",
				"log": "110.35",
				"lat": "20.02"
			},

			{
				"name": "成都市",
				"log": "104.06",
				"lat": "30.67"
			},

			{
				"name": "贵阳市",
				"log": "106.71",
				"lat": "26.57"
			},

			{
				"name": "昆明市",
				"log": "102.73",
				"lat": "25.04"
			},

			{
				"name": "南昌市",
				"log": "115.89",
				"lat": "28.68"
			},

			{
				"name": "西安市",
				"log": "108.95",
				"lat": "34.27"
			},

			{
				"name": "西宁市",
				"log": "101.74",
				"lat": "36.56"
			},

			{
				"name": "兰州市",
				"log": "103.73",
				"lat": "36.03"
			},

			{
				"name": "南宁市",
				"log": "106.54",
				"lat": "29.59"
			},

			{
				"name": "乌鲁木齐市",
				"log": "87.68",
				"lat": "43.77"
			},

			{
				"name": "呼和浩特市",
				"log": "111.65",
				"lat": "40.82"
			},

			{
				"name": "拉萨市",
				"log": "91.11",
				"lat": "29.97"
			},

			{
				"name": "银川市",
				"log": "106.27",
				"lat": "38.47"
			},

			{
				"name": "台北市",
				"log": "121.5",
				"lat": "25.14"
			},

			{
				"name": "香港",
				"log": "114.17",
				"lat": "22.27"
			},

			{
				"name": "澳门",
				"log": "113.33",
				"lat": "22.13"
			},

			{
				"name": "合肥市",
				"log": "117.27",
				"lat": "31.86"
			}, {
				"name": "南京市",
				"log": "118.78",
				"lat": "32.04"
			}
		]
	},


	changeURLPar: function(url, arg, val) {
		var pattern = arg + '=([^&]*)';
		var replaceText = arg + '=' + val;
		return url.match(pattern) ? url.replace(eval('/(' + arg + '=)([^&]*)/gi'), replaceText) : (url.match('[\?]') ? url + '&' + replaceText : url + '?' + replaceText);
	},


	isWeiXin: function() {
		var ua = window.navigator.userAgent.toLowerCase();
		if (ua.match(/MicroMessenger/i) == 'micromessenger') {
			return true;
		} else {
			return false;
		}
	},

	wxConfig: function(title, desc, img, url) {
		var s = this;
		var appId = 'wxfacf4a639d9e3bcc'; //'wxfacf4a639d9e3bcc'; // data.wxappid; // 'wxfacf4a639d9e3bcc'; //data.wxappid;

		var durl = url || location.href.split('#')[0];



		var code_durl = encodeURIComponent(durl);



		$.ajax({
			type: 'get',
			url: "http://api.zmiti.com/weixin/jssdk.php?type=signature&durl=" + code_durl,
			dataType: 'jsonp',
			jsonp: "callback",
			jsonpCallback: "jsonFlickrFeed",
			error: function() {

			},
			success: function(data) {
				wx.config({
					debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
					appId: appId, // 必填，公众号的唯一标识
					timestamp: '1488558145', // 必填，生成签名的时间戳
					nonceStr: 'Wm3WZYTPz0wzccnW', // 必填，生成签名的随机串
					signature: data.signature, // 必填，签名，见附录1
					jsApiList: ['checkJsApi',
							'onMenuShareTimeline',
							'onMenuShareAppMessage',
							'onMenuShareQQ',
							'onMenuShareWeibo',
							'hideMenuItems',
							'showMenuItems',
							'hideAllNonBaseMenuItem',
							'showAllNonBaseMenuItem'
						] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
				});

				wx.ready(() => {

					//朋友圈

					wx.onMenuShareTimeline({
						title: title, // 分享标题
						link: durl, // 分享链接
						imgUrl: img, // 分享图标
						desc: desc,
						success: function() {},
						cancel: function() {}
					});
					//朋友
					wx.onMenuShareAppMessage({
						title: title, // 分享标题
						link: durl,
						imgUrl: img, // 分享图标
						type: "link",
						dataUrl: "",
						desc: desc,
						success: function() {},
						cancel: function() {}
					});
					//qq
					wx.onMenuShareQQ({
						title: title, // 分享标题
						link: durl, // 分享链接
						imgUrl: img, // 分享图标
						desc: desc,
						success: function() {},
						cancel: function() {}
					});
				});
			}
		});

	},
	getQueryString: function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return (r[2]);
		return null;
	},

	getOauthurl: function() {
		var s = this;
		$.ajax({
			type: 'post',
			url: 'http://api.zmiti.com/v2/weixin/getwxuserinfo/',
			data: {
				code: s.getQueryString('code'),
				wxappid: data.wxappid,
				wxappsecret: data.wxappsecret
			},
			error: function() {},
			success: function(dt) {

				if (dt.getret === 0) {


					s.openid = dt.userinfo.openid;
					s.nickname = dt.userinfo.nickname;
					s.headimgurl = dt.userinfo.headimgurl;

					var opt = {
						nickname: s.nickname,
						headimgurl: s.headimgurl
					}

					$('.wx-face1 img').attr('src', s.headimgurl)

					s.createNickName(s.nickname)

					s.createHeadimgurl(s.headimgurl);


					var posData = s.posData();
					var index = Math.random() * posData.length | 0;
					s.savePV({
							nickname: s.nickname,
							openid: s.openid,
							address: posData[index].name,
							longitude: posData[index].log,
							latitude: posData[index].lat
						})
						/*$.ajax({
							url:'http://api.zmiti.com/v2/msg/send_msg/',
							type:'post',
							data:{
								type:'zmiti123'||s.getQueryString('socket'),
								content:JSON.stringify(opt),
								to:opt.to||''
							},
							success(data){
								//console.log(data);
							}
						})*/


				} else {
					if (s.isWeiXin()) {

						var redirect_uri = window.location.href.split('?')[0];
						$.ajax({
							url: 'http://api.zmiti.com/v2/weixin/getoauthurl/',
							type: 'post',
							data: {
								redirect_uri: redirect_uri,
								scope: 'snsapi_userinfo',
								worksid: worksid,
								state: new Date().getTime() + ''
							},
							error: function() {},
							success: function(dt) {
								if (dt.getret === 0) {

									//console.log('************************-----------*'+window.location.href)
									window.location.href = dt.url;

								}
							}
						})
					} else {}

				}


			}
		});
	}

};

zmitiUtil.init();


$(function() {

})