/* st-math.js */

st.math = {
	init: function() {
		st.log("math.init");
	},
	die : function(qty, die, mod) {
		var ret = mod;
		for (var i = 0; i < qty; i++) {
			ret += st.math.dieN(die);
		}
		return ret;
	},
	dieN : function(die) {
		return Math.floor(Math.random() * die) + 1;
	},
	dieArray : function(array) {
		return Math.floor(Math.random() * array.length);
	},
	ensureRange: function(value, min, max) {
		var ret = value;
		ret = Math.max(min, ret);
		ret = Math.min(max, ret);
		return ret;
	},
	averageUp: function() {
		var tot = 0;
		var len = arguments.length;
		for (var i=0; i<len; i++) {
			tot += arguments[i] ? arguments[i] : 0;
		}
		var ret = Math.ceil(tot / len);
		return ret;
	}
};