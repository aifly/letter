/**
 * Created by fly on 2017/8/9.
 */



var worksid = '1275459017', //新华社的作品
	doc = document;
worksid = '8986148900'; //linten

var data = { //新华社的公众号信息
	wxappid: 'wx5ec3d35069383211',
	wxappsecret: 'd94ea41d9cd2ba03c7cab5fc0e212cec'
}

data = {
	wxappid: 'wxfacf4a639d9e3bcc',
	wxappsecret: "149cdef95c99ff7cab523d8beca86080"
}
var shareUrl = 'http://h5.zhongguowangshi.com/letter/assets/images/300.jpg';
shareUrl = 'http://h5.zmiti.com/public/letter/assets/images/300.jpg';
var zmitiUtil = {

	init: function() {
		var arr = [
			'./assets/images/logo.png'
		]
		var s = this;

		var nickname = s.getQueryString('nickname');

		$("#js_article").css({
			display: nickname ? 'none' : 'block'
		});
		$(".wx-comments").css({
			display: nickname ? 'none' : 'block'
		});
		if (nickname) {
			$('#zmiti-result').css({
				display: 'block'
			}).find('.zmiti-photo').addClass('active border').find('img').attr('src', nickname);
			$('#zmiti-share-btns aside:eq(1)').css({
				display: 'none'
			});
			$('#zmiti-share-btns aside:eq(0)').html("<a href='./'><img src='./assets/images/me.png'/></a>")
		} else {

		}

		s.getOauthurl();
		s.bindEvent();

		this.loading(arr, null, function() {
			s.setDate();

			s.setTitile();
			s.like();
			//s.animate();
			s.getNum();

			//s.createHeadimgurl('http://wx.qlogo.cn/mmopen/ajNVdqHZLLBdRPD56QKxotqUunpRX0SWvFW9kPLkbDsbU0ibdAXr0MsroicQTZ7MloGWlChPJcya2Via3pq0g704VVkicN1puTstnoJ8QXMk3yU/0')

			//s.socket();
		})
	},

	bindEvent: function() {
		var s = this;
		s.createQrCode();
		$('.wx-slide').on('click', function() {

			s.shake();
			$(this).css({
				display: 'none'
			})

			$(document).on('touchmove', function(e) {
				e.preventDefault();
				return false;
			})
			$('.wx-comments').css({
				display: 'none'
			});

			$('#zmiti-header').css({
				display: 'block'
			});
			$('.zmiti-barrage').css({
				opacity: 0
			})
			$('.wx-sta1').css({
				opacity: 0
			})
			s.createImg()
		});
		var i = 0;
		$('#like3').on('click', function() { //开始点赞
			if (i === 0) {

				var like = $(this).find('span').html() * 1 + 1;
				$(this).find('span').html(like);
				//localStorage.setItem('like', like);
			}
			i++;
		});

		$('#zmiti-see').on('click', function() {
			$('.wx-slide').css({
				display: 'block'
			});
			$(document).off('touchmove');
			$('.wx-comments').css({
				display: 'block'
			});

			$('#zmiti-header').css({
				display: 'none'
			});
			$('#zmiti-result').css({
				display: 'none'
			})
			$('#js_article').css({
				display: 'block'
			})

			$('.zmiti-barrage').css({
				opacity: 1
			})
			$('.wx-sta1').css({
					opacity: 1
				})
				//$('.wx-page-qcode img').attr('src', './assets/images/img-043.jpg')

		});
		var mask = $('#zmiti-mask');
		$('#zmiti-mask-btn').on('click', function() {
			mask.css({
				display: 'block'
			});
		});
		mask.on('touchstart', function() {
			$(this).css({
				display: 'none'
			})
		})
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
	animate: function() {
		var words = [{
			"value": "党的十八大以来，以习近平同志为核心的党中央",
			"color": "#fcffb4",
			"range": [0, 0.5]
		}, {
			"value": "传递正能量，弘扬主旋律",
			"color": "#ff8916",
			"range": [0.2, 1]
		}, {
			"value": "随着十九大召开的脚步越来越近",
			"color": "#ffd74e",
			"range": [0.6, 0.7]
		}, {
			"value": "党的十八大以来，以习近平同志为核心的党中央",
			"color": "#ffffff",
			"range": [0.2, 1]
		}, {
			"value": "传递正能量，弘扬主旋律",
			"color": "#ffd74e",
			"range": [0, 0.9]
		}, {
			"value": "随着十九大召开的脚步越来越近，全党、全国人民欢欣",
			"color": "#ffffff",
			"range": [0.7, 1]
		}, {
			"value": "迎接十九大宣传是责任。",
			"color": "#fcffb4",
			"range": [0.7, 0.95]
		}];
		var html = ''
		words.forEach(function(w, i) {
			html += '<div style="color:' + w.color + ';top:' + (30 * (i + 1)) + 'px;-webkit-animation-duration:' + (i + 10) + 's;-webkit-animation-delay:' + ((i * 2 + 1)) + 's" class="zmiti-barrage barrage-animate">' + w.value + '</div>';
		});
		$('.mess-img').html($('.mess-img').html() + html);
	},
	createImg: function() {
		var s = this;
		var dom = $('#js_article')[0];
		$(window).scrollTop(0);
		html2canvas(dom, {
			useCORS: true,
			onrendered: function(canvas) {

				//console.log(canvas.toDataURL())

				var url = canvas.toDataURL('image/jpg');
				$('.zmiti-photo img').attr('src', url);

				$('#audio')[0].play();

				$.ajax({
					url: 'http://api.zmiti.com/v2/share/base64_image/',
					type: 'post',
					data: {
						setcontents: url,
						setimage_w: document.documentElement.clientWidth,
						setimage_h: $('#js_article').height()
					},
					success: function(data) {
						if (data.getret === 0) {
							var src = data.getimageurl;

							var URI = window.location.href.split('#')[0];
							URI = s.changeURLPar(URI, 'nickname', src);
							s.wxConfig(window.nickname + '在 ' + window.city + '收藏了新华社十八大第' + (s.totalviewcount + 1) + '份号外 ', window.nickname + '收藏了新华社十八大第' + (s.totalviewcount + 1) + '份号外 ', shareUrl, URI);
							///s.wxConfig(window.nickname + '在新华社应聘主编，敬请阅读！', '新华社新媒体中心招聘“刚刚” 主编，已有 ' + (s.totalviewcount + 1) + '位参与应聘，我们期待您的加入！', shareUrl, URI);
						}

					}
				})

				$('#zmiti-result').css({
					display: 'block'
				})
				setTimeout(function() {

					$('.zmiti-photo').addClass('active');

					setTimeout(() => {
						$('.zmiti-photo').addClass('border').find('div').css({
							display: 'block'
						})



					}, 1000)


				}, 1000)



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

		$('#zmiti-result').height(document.documentElement.clientHeight)


	},
	shake: function() {
		var s = this;
		$('body').css({
			opacity: .1
		});
		setTimeout(function() {

			$('body').css({
				opacity: 1
			});


		}, 100)
	},

	getNum: function() { //获取编号
		var s = this;
		$.post('http://api.zmiti.com/v2/weixin/get_wxuserviewcount/', {
			worksid: worksid
		}, function(data) {

			if (data.getret === 0) {

				//$('#zmiti-codenum').html('CERTIFICATE NO.' + (data.worksinfo.totalviewcount + 1))
				$('.wx-count-yd span').html(data.worksinfo.totalviewcount + 1)

				s.totalviewcount = data.worksinfo.totalviewcount + 1;
				$('.wx-user-pos em:eq(0)').html((window.nickname || '微信网友') + "：")
				$('.wx-user-pos em:eq(2)').html(s.totalviewcount)
					///s.wxConfig('重大新闻！' + window.nickname + '为你报道刚刚收到的消息。 ', window.nickname + '为你报道刚刚收到的消息。已有 ' + (data.worksinfo.totalviewcount + 1) + '位阅读。', shareUrl);
				s.wxConfig(window.nickname + '在 ' + window.city + '收藏了新华社十八大第' + (data.worksinfo.totalviewcount + 1) + '份号外 ', window.nickname + '收藏了新华社十八大第' + (data.worksinfo.totalviewcount + 1) + '份号外 ', shareUrl);
			}
		})

	},
	createQrCode: function(url = window.location.href.split('?')[0]) { //生成二维码
		var s = this;
		$.ajax({
			type: 'post',
			url: 'http://api.zmiti.com/v2/share/create_qrcode',
			data: {
				url: url
			}
		}).done(function(data) {
			if (data.getret === 0) {
				s.createColorQrCode(data.qrcodeurl, function(canvas) {
						$.ajax({
							url: 'http://api.zmiti.com/v2/share/base64_image/',
							type: 'post',
							data: {
								setcontents: canvas.toDataURL(),
								setimage_w: 320,
								setimage_h: 320
							},
							success: function(data) {
								if (data.getret === 0) {
									var src = data.getimageurl;
									$('.wx-page-qcode img').attr('src', src);
								}

							}
						})


					})
					//s.createImg();
			}
		})
	},

	createColorQrCode: function(url, fn) {
		var canvas1 = document.createElement('canvas');
		var canvas2 = document.createElement('canvas');


		var context1 = canvas1.getContext('2d');
		var context2 = canvas2.getContext('2d');

		var img = new Image();
		img.crossOrigin = 'anonymous'; //解决跨域问题，需在服务器端运行，也可为 anonymous   
		img.onload = function() {
			img.crossOrigin = '*';
			canvas1.width = this.width;
			canvas1.height = this.height;

			canvas2.width = canvas1.width;
			canvas2.height = canvas1.height;
			context1.drawImage(this, 0, 0);

			var imgData = context1.getImageData(0, 0, canvas1.width, canvas1.height);
			var imgW = imgData.width,
				imgH = imgData.height,
				data = imgData.data;

			for (var x = 0; x < data.length; x += 4) {
				if (data[x] === 255 && data[x + 1] === 255 && data[x + 2] === 255 && data[x + 3] === 255) {
					//data[x + 3] = 0;
					//data[x+1] = 251;
					//data[x+2] = 238;
				}
				if (data[x] === 0 && data[x + 1] === 0 && data[x + 2] === 0 && data[x + 3] === 255) {
					data[x] = 171;
					data[x + 1] = 138;
					data[x + 2] = 108;
					data[x + 3] = 255;
				}
			}

			context2.putImageData(imgData, 0, 0)

			fn && fn(canvas2);
		}
		img.src = url;
	},

	like: function() { //点赞

		var random = (Math.random() * 1000 | 0) + 3000;
		$('#like3 span').html(random);
	},

	createNickName: function(nickname) { //生成昵称图片
		$.ajax({
			type: 'post',
			url: 'http://api.zmiti.com/v2/share/useTxtCreateImg',
			data: {
				text: nickname,
				color: 'ab8a6c',
				imagewidth: 151 * 10,
				imageheight: 35 * 10,
				fontsize: 24 * 10,
				isfontweight: true
			}
		}).done(function(data) {
			if (data.getret === 0) {
				$('.wx-name1 img').attr('src', data.imageurl);
			}
		})
	},
	createHeadimgurl: function(src) {

		$('.wx-face1 img').attr('src', src).removeClass('zmiti-rotate')
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

	getPos: function(nickname, headimgurl) {
		var s = this;
		//alert(wx.posData.longitude+'' +wx.posData.latitude)
		$.ajax({
			url: 'http://restapi.amap.com/v3/geocode/regeo?key=10df4af5d9266f83b404c007534f0001&location=' + wx.posData.longitude + ',' + wx.posData.latitude + '&poitype=&radius=100&extensions=base&batch=false&roadlevel=1+ ',
			type: 'get',
			error() {

			},
			success(data) {



				if (data.status === '1' && data.infocode === '10000') {

					var addressComponent = data.regeocode.addressComponent;

					var opt = {
						type: 'map',
						address: (addressComponent.province || addressComponent.city[0]) + ' ' + (addressComponent.city || ''),
						pos: [wx.posData.longitude, wx.posData.latitude],
						nickname: nickname,
						headimgurl: headimgurl
					}
					window.city = (addressComponent.province || addressComponent.city[0]) + ' ' + (addressComponent.city || '');
					$('.wx-user-pos em:eq(1)').html(window.city)
					$('.wx-xy span').html(window.city);
					s.getNum();
					var posData = s.posData();
					var index = Math.random() * posData.length | 0;


					$.ajax({
						url: 'http://api.zmiti.com/v2/weixin/save_userview/',
						type: 'post',
						data: {
							worksid: worksid,
							wxopenid: s.openid,
							wxname: nickname,
							usercity: opt.address,
							longitude: wx.posData.longitude,
							latitude: wx.posData.latitude
						},
						error: function() {},
						success: function(data) {}
					})


					$.ajax({
						url: 'http://api.zmiti.com/v2/weixin/add_wxuser/',
						type: 'post',
						data: {
							wxopenid: s.openid,
							worksid: worksid,
							nickname: nickname,
							headimgurl: headimgurl,
							longitude: wx.posData.longitude,
							latitude: wx.posData.latitude,
							accuracy: wx.posData.accuracy,
							wxappid: data.wxappid,
							integral: localStorage.getItem('nickname') ? 0 : 10
						},
						error() {
							//alert('add_wxuser: 服务器返回错误');
						},
						success(data) {
							if (data.getret === 0) {

							} else {
								//alert('getret  : ' + data.getret + ' msg : ' + data.getmsg + ' .....');
							}
						}
					});

					//获取用户积分
					//
					$.ajax({
						url: 'http://api.zmiti.com/v2/msg/send_msg/',
						data: {
							type: worksid,
							content: JSON.stringify(opt),
							to: opt.to || ''
						},
						success(data) {
							s.state.showUI = true;
							s.forceUpdate();
							//console.log(data);
						}
					})
				} else {
					///alert('地址信息获取失败')
					///
					///
					var opt = {
						type: 'map',
						address: '北京市',
						pos: [wx.posData.longitude, wx.posData.latitude],
						nickname: nickname,
						headimgurl: headimgurl
					}
					window.city = '北京市';
					$('.wx-user-pos em:eq(1)').html(window.city)
					$('.wx-xy span').html(window.city);
					s.getNum();
					var posData = s.posData();
					var index = Math.random() * posData.length | 0;


					$.ajax({
						url: 'http://api.zmiti.com/v2/weixin/save_userview/',
						type: 'post',
						data: {
							worksid: worksid,
							wxopenid: s.openid,
							wxname: nickname,
							usercity: opt.address,
							longitude: wx.posData.longitude,
							latitude: wx.posData.latitude
						},
						error: function() {},
						success: function(data) {

						}
					})
				}
			}
		})
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

				wx.ready(function() {


					this.locationFail = true;
					var _this = this;
					if (!wx.isLoad) {
						wx.isLoad = true;
						wx.getLocation({
							type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
							fail: function() {
								//window.debug && alert('定位失败,重新进入');
								//window.location.href = window.location.href;
								var idx = Math.random() * s.pData().length | 0;

								var latitude = s.posData()[idx].lat; // 纬度，浮点数，范围为90 ~ -90

								var longitude = s.posData()[idx].log; // 经度，浮点数，范围为180 ~ -180。

								var accuracy = 100; // 位置精度
								wx.posData = {
									longitude,
									latitude,
									accuracy
								};

								if ((s.nickname || s.headimgurl) && s.openid && _this.locationFail) {
									_this.locationFail = false;

									s.getPos(s.nickname, s.headimgurl);

								}
							},
							cancel: function() {

								var idx = Math.random() * s.posData().length | 0;

								var latitude = s.posData()[idx].lat; // 纬度，浮点数，范围为90 ~ -90

								var longitude = s.posData()[idx].log; // 经度，浮点数，范围为180 ~ -180。

								var accuracy = 100; // 位置精度
								wx.posData = {
									longitude,
									latitude,
									accuracy
								};

								if ((s.nickname || s.headimgurl) && s.openid && _this.locationFail) {
									_this.locationFail = false;

									s.getPos(s.nickname, s.headimgurl);

								}
							},
							success: function(res) {
								var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
								var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
								var speed = res.speed; // 速度，以米/每秒计
								var accuracy = res.accuracy; // 位置精度

								wx.posData = {
									longitude,
									latitude,
									accuracy
								};

								if ((s.nickname || s.headimgurl) && s.openid && _this.locationFail) {
									_this.locationFail = false;
									s.getPos(s.nickname, s.headimgurl);

								}

							}
						});
					}


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

					window.nickname = s.nickname;
					window.headimgurl = s.headimgurl;

					var opt = {
						nickname: s.nickname,
						headimgurl: s.headimgurl
					}

					$('.wx-face1 img').attr('src', s.headimgurl)

					s.createNickName(s.nickname)

					s.createHeadimgurl(s.headimgurl);



					if (wx.posData && wx.posData.longitude) {
						s.getPos(dt.userinfo.nickname, dt.userinfo.headimgurl);
					}



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
						var nickname = s.getQueryString('nickname');


						var redirect_uri = window.location.href.split('?')[0];

						if (nickname) {
							redirect_uri = s.changeURLPar(redirect_uri, 'nickname', (nickname));
						}

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


$(function() {
	zmitiUtil.init();
})