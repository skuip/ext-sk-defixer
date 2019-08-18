(function () {
	let style = document.createElement(`style`);
	style.textContent = `
			body, html {
				min-height: 101vh;
			}
			[data-sk-defixer]{
				transition: all 1s;
			}
			[data-sk-defixer="true"]{
				opacity: 0! important;
				pointer-events: none !important;
			}
		`;
	document.head.appendChild(style);

	[``, `-x`, `-y`].forEach(function (style) {
		document.body.style[`overflow` + style] = `visible`;
		document.documentElement.style[`overflow` + style] = `visible`;
	});

	chrome.runtime.onMessage.addListener(handleMessage);

	function handleMessage(request, sender, sendResponse) {
		// Loop over every HTMLElement and determine if it`s position fixed.
		let elements = document.getElementsByTagName(`*`);

		const state = parseInt(document.documentElement.dataset.skFixerState || 0, 10);

		document.documentElement.dataset.skFixerState = state + 1;

		if (state === 1) {
			// The second time over we move the screen a bit to see what stuck
			for (let i = elements.length - 1; i >= 0; i--) {
				let element = elements[i];
				const { height, left, top, width } = element.getBoundingClientRect();
				if (height > 0 && width > 0) {
					element.dataset.skDefixerRect = width.toFixed(0) + `x` + height.toFixed(0) + `+` + left.toFixed(0) + `+` + top.toFixed(0);
				}
			}

			// Scroll the window a bit so we can detect *all* the fixed elements.
			window.scrollBy(0,2);
		}

		if (state === 0 || state === 1) {
			for (let i = elements.length - 1; i >= 0; i--) {
				let element = elements[i];
				let style = window.getComputedStyle(element);


				if (style.position === `fixed`) {
					element.setAttribute(`data-sk-defixer`, `true`);
				}
				else if (style.position === `sticky`) {
					element.style.position = `relative`;
				}
				else if (state === 1) {
					// Check if the element stayed in the same location in the viewport.
					const { height, left, top, width } = element.getBoundingClientRect();
					if (height > 0 && width > 0) {
						if (element.dataset.skDefixerRect === width.toFixed(0) + `x` + height.toFixed(0) + `+` + left.toFixed(0) + `+` + top.toFixed(0)) {
							element.dataset.skDefixer = `true`;
						}
					}
				}

				if (style.textAlign === `justify`) {
					element.style.textAlign = `left`;
				}
			}
		}

		if (state === 2) {
			// Resetting everything back to pristine state
			for (let i = elements.length - 1; i >= 0; i--) {
				let element = elements[i];
				if (element.dataset.skDefixerRect) {
					delete element.dataset.skDefixerRect;
				}
				if (element.dataset.skDefixer) {
					element.dataset.skDefixer = `false`;
				}
			}
			delete document.documentElement.dataset.skFixerState;
		}

		// Remove anchor ping's
		elements = document.querySelectorAll(`a[ping]`);
		for (let i = elements.length - 1; i >= 0; i--) {
			elements.removeAttribute(`ping`);
		}

		// Send reply message back.
		sendResponse(`OK`);
	}
})();

`OK`;
