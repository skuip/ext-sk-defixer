/* global document, window */

(function () {
	var style = document.createElement(`style`);
	style.textContent = `
			[data-sk-defixer="true"]{
				display: none !important;
				opacity: 0! important;
				visibility: hidden !important;
			}
		`;
	document.head.appendChild(style);

	[``, `-x`, `-y`].forEach(function (style) {
		document.body.style[`overflow` + style] = `auto`;
		document.documentElement.style[`overflow` + style] = `auto`;
	});

	chrome.runtime.onMessage.addListener(handleMessage);

	function handleMessage () {
		// Loop over every HTMLElement and determine if it`s position fixed.
		var elements = document.querySelectorAll(`*`);
		for (var i = elements.length - 1; i >= 0; i--) {
			style = window.getComputedStyle(elements[i]);
			if (style.position === `fixed`) {
				elements[i].setAttribute(`data-sk-defixer`, `true`);
			}
		}

	}
	handleMessage();
})();
