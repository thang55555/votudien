var zalo_acc = {
	"0382677745" : "4zcx326094o7",  // miền nam desktop
	"0378558887" : "7pqj8pyumhba",  // miền bắc desktop
	"0383167778" : "c3juwrwnwtl5",  // miền bắc desktop
	"0374687899" : "1uu79rhumv9or", // miền trung desktop
	"0396555778" : "1snk2adv91ryk",  //miền bắc mobile
	"0969654361" : "1kzeff32pmlfl",  // miền nam mobile
	"0988561117" : "sitz8gy6x543",  // miền nam mobile
	"0353899788" : "1dqpn6o8iamit",  //kỹ thuật
	"0394385556" : "11tnve5rgcgza",  //cadivi
	"0348957778" : "d6rvllu6staa",  //solar
	"0388895669" : "dtq4iextipvi",  //solar
};
function devvnCheckLinkAvailability(link, successCallback, errorCallback) {
	var hiddenIframe = document.querySelector("#hiddenIframe");
	if (!hiddenIframe) {
		hiddenIframe = document.createElement("iframe");
		hiddenIframe.id = "hiddenIframe";
		hiddenIframe.style.display = "none";
		document.body.appendChild(hiddenIframe);
	}
	var timeout = setTimeout(function () {
		errorCallback("Link is not supported.");
		window.removeEventListener("blur", handleBlur);
	}, 2500); // Đặt timeout (2.5 giây) để kiểm tra liên kết. Thay đổi số này lên 5000 nếu bạn chưa chạy được
	var result = {};
	function handleMouseMove(event) {
		if (!result.x) {
			result = {
				x: event.clientX,
				y: event.clientY,
			};
		}
	}
	function handleBlur() {
		clearTimeout(timeout);
		window.addEventListener("mousemove", handleMouseMove);
	}
	window.addEventListener("blur", handleBlur);
	window.addEventListener(
		"focus",
		function onFocus() {
			setTimeout(function () {
				if (document.hasFocus()) {
					successCallback(function (pos) {
						if (!pos.x) {
							return true;
						}
						var screenWidth =
							window.innerWidth ||
							document.documentElement.clientWidth ||
							document.body.clientWidth;
						var alertWidth = 300;
						var alertHeight = 100;
						var isXInRange =
							pos.x - 100 < 0.5 * (screenWidth + alertWidth) &&
							pos.x + 100 > 0.5 * (screenWidth + alertWidth);
						var isYInRange =
							pos.y - 40 < alertHeight && pos.y + 40 > alertHeight;
						return isXInRange && isYInRange
							? "Link can be opened."
							: "Link is not supported.";
					}(result));
				} else {
					successCallback("Link can be opened.");
				}
				window.removeEventListener("focus", onFocus);
				window.removeEventListener("blur", handleBlur);
				window.removeEventListener("mousemove", handleMouseMove);
			}, 500);
		},
		{ once: true }
	);
	hiddenIframe.contentWindow.location.href = link;
}

Object.keys(zalo_acc).map(function(sdt, index) {
	let qrcode = zalo_acc[sdt];
	const zaloLinks = document.querySelectorAll('a[href*="zalo.me/'+sdt+'"]');
	zaloLinks.forEach((zalo) => {
		zalo.addEventListener("click", (event) => {
			event.preventDefault();
			const userAgent = navigator.userAgent.toLowerCase();
			const isIOS = /iphone|ipad|ipod/.test(userAgent);
			const isAndroid = /android/.test(userAgent);
			let redirectURL = null;
			if (isIOS) {
				redirectURL = 'zalo://qr/p/'+qrcode;
				window.location.href = redirectURL;
			} else if (isAndroid) {
				redirectURL = 'zalo://zaloapp.com/qr/p/'+qrcode;
				window.location.href = redirectURL;
			} else {
				redirectURL = 'zalo://conversation?phone='+sdt;
				zalo.classList.add("zalo_loading");
				devvnCheckLinkAvailability(
					redirectURL,
					function (result) {
						zalo.classList.remove("zalo_loading");
					},
					function (error) {
						zalo.classList.remove("zalo_loading");
						redirectURL = 'https://chat.zalo.me/?phone='+sdt;
						window.location.href = redirectURL;
					}
				);
			}
		});
	});
});
//Thêm css vào site để lúc ấn trên pc trong lúc chờ check chuyển hướng sẽ không ấn vào thẻ a đó được nữa
var styleElement = document.createElement("style");
var cssCode = ".zalo_loading { pointer-events: none; }";
styleElement.innerHTML = cssCode;
document.head.appendChild(styleElement);