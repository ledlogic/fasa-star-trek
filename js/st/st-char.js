/* st-char.js */

/* 
 * The display models are optimized for the output display, rather than being truncated.
 * Since the order is known in the output, rendering of css is simplified.
 * In another layout, it could be adjusted to use css-specific overrides for position
 * of individual attributes.
 */
st.character = {
	spec: {
		overview: {},
		demographics: {
			age: "0 years"
		},
		endurance: {},
		skills: {},
		termOerBonusUsed: false,
		duty: 0,
		terms: [],
		tours: []
	},
	
	mod: {},
	
	allAttributes: ["str", "end", "int", "dex", "cha", "luc", "psi"],

	baseAttributes: {
		"str":40,
		"end":40,
		"int":40,
		"dex":40,
		"cha":40,
		"luc":40,
		"psi":0			
	},
	
	inactsave: {
		"human": 20,
		"romulan": 15
	},
	
	$pageft: null,
	
	init: function() {
		st.log("init character");
		st.character.$pageft = $(".st-page .st-page-ft");

		// romulans tend to be somewhat stronger, more hardy, and more agile than humans, but they are not very lucky.
		// they tend to have a somewhat lower Psionic Potential than do the Vulcans.
		var r = {};
		r["str"] = 10;
		r["end"] = 10;
		r["int"] = 0;
		r["dex"] = 5;
		r["cha"] = 0;
		r["luc"] = -10;
		r["psi"] = -20;
		st.character.mod["romulan"] = r;
	},
	
	setAge: function(age) {
		st.character.spec.demographics.age = age;
		st.render.renderAge();
	}
};