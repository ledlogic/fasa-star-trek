/* st-nav.js */

st.nav = {
	characters: [],
	init: function() {
		st.log("init nav");
		$("#st-gen-allegiance").bind("change", st.nav.selectAllegiance);
	},
	selectAllegiance: function() {
		st.log("selected allegiance");
		var $sel = $(this);
		var allegiance = $sel.val();
		if ("romulan" == allegiance) {
			st.gen.genRomulan(allegiance);			
		} else {
			alert("Allegiance not available yet: " + allegiance);
		}		
	},
	showLinks: function() {
		$(".st-nav-links").show();
	},
	hideLinks: function() {
		$(".st-nav-links").hide();
	}
};