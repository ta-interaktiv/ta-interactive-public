
module.exports = {

	sum: function (a, b){
		return {
			x: a.x + b.x,
			y: a.y + b.y
		};
	},

	difference: function(a, b){
		return {
			x: a.x - b.x,
			y: a.y - b.y
		};
	},

	multiply: function(v, f){
		return {
			x: v.x * f,
			y: v.y * f
		};	
	},

	length: function(v){
		return Math.sqrt(v.x*v.x + v.y*v.y);
	},

	normalize: function(v){
		var length = this.length(v);
		return this.multiply(v, 1/length);
	},

	ortho: function(v){

		// gibt zwei Lösungen!

		var o = { x: 1, y: 1 };

		var flip = false; // damit der Vektor immer zur linken Seite vom original Vektor zu liegen kommt

		if( v.x > 0 && v.y > 0){
			var o = {
				x: 1,
				y: - (v.x/v.y)
			};

		}else if( v.x < 0 && v.y > 0){
			var o = {
				x: - (v.y/v.x),
				y: 1
			};

		}else if( v.x < 0 && v.y < 0){	
			var o = {
				x: - (v.y/v.x),
				y: 1
			};
			// flip = true;

		}else if( v.x > 0 && v.y < 0){
			var o = {
				x: 1,
				y: - (v.x/v.y)
			};
			flip = true;

		}else{ // spezialfälle wenn x oder y = 0 ist

			if (v.x == 0){
				var o = { x: v.y, y: 0 };

			}else if (v.y == 0){
				var o = { x: 0, y: v.x };

			}else{
				return { x: 0, y: 0 };;
			}
		}

		o = this.normalize(o);
		return this.multiply( o, flip ? -this.length(v) : this.length(v) );
	},

	angle: function(a, b){
		a = this.normalize(a);
		b = this.normalize(b);
		return Math.acos(a.x*b.x + a.y*b.y);
	}

};