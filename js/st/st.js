/* st.js */

var st = {
	log: function(s) {
		if (typeof(window.console) != "undefined") {
			console.log(s);
		}
	},
	logObj: function(label, obj) {
		if (typeof(window.console) != "undefined") {
			console.log({"label": label,"obj": obj});
		}
	},

	init: function() {
		st.character.init();
		st.math.init();
		st.nav.init();
	}
};

$(document).ready(st.init);
