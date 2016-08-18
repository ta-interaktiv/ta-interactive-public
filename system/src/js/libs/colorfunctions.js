
module.exports = {

	hexToRgb: function (hex) {
	    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
	        return r + r + g + g + b + b;
	    });

	    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	    return result ? {
	        r: parseInt(result[1], 16),
	        g: parseInt(result[2], 16),
	        b: parseInt(result[3], 16)
	    } : null;
	},

	componentToHex: function (c) {
	    var hex = c.toString(16);
	    return hex.length == 1 ? "0" + hex : hex;
	},

	rgbToHex: function(r, g, b) {
	    return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
	},


	interpolateColor: function(from, to, value){

	    var rgbFrom = this.hexToRgb(from);
	    var rgbTo = this.hexToRgb(to);

	    var rgbCalced = {
	        r: Math.round(rgbFrom.r + (rgbTo.r - rgbFrom.r)*value),
	        g: Math.round(rgbFrom.g + (rgbTo.g - rgbFrom.g)*value),
	        b: Math.round(rgbFrom.b + (rgbTo.b - rgbFrom.b)*value)
	    };

	    return this.rgbToHex(rgbCalced.r, rgbCalced.g, rgbCalced.b);
	}

};