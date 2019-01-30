(function() {
    var proxiedSend = window.window.XMLHttpRequest.prototype.send;

    window.XMLHttpRequest.prototype.send = function() {
    	this.onload = (event) => {
    		document.dispatchEvent(new CustomEvent('injectXHR', {
				detail: {
					response: this.response,
					responseURL: this.responseURL
				}
			}));
    	}

        return proxiedSend.apply(this, [].slice.call(arguments));
    };
})();