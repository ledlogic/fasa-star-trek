/* st-char.js */

/* 
 * The display models are optimized for the output display, rather than being truncated.
 * Since the order is known in the output, rendering of css is simplified.
 * In another layout, it could be adjusted to use css-specific overrides for position
 * of individual attributes.
 */
st.character = {
	spec: {},
	$pageft: null,
	init: function() {
		st.log("init character");
		st.character.$pageft = $(".st-page .st-page-ft");
	},
	loadChar: function(uri) {
		st.log("loading char");

		$.ajax("js/" + uri)
		.done(function(data, status, jqxhr) {
			st.character.spec = data.spec;
			setTimeout(st.character.render,10);
		})
		.fail(function() {
			alert("Error: unable to load character.");
		})
		.always(function() {
		});
	},
	render: function() {
		st.log("rendering char");

		st.character.renderOverview();
		st.character.renderDemographics();
		st.character.renderAttributes();
		st.character.renderEndurance();
		//st.character.renderStats();
		//st.character.renderSkills();
		//st.character.renderArmor();
		//st.character.renderWeapons();
		
		$(".st-page").removeClass("st-initial-state");
	},
	renderAttributes: function() {
		st.log("rendering attributes");

		var spec = st.character.spec;
		var attr = spec.attributes;

		// attr
		var $attr = $("<div class=\"st-section st-attributes\"></div>");
		_.each(attr, function(value, key) {
			var h = value;
			$elm = $("<span class=\"st-item st-attribute st-attribute-" + key + "\">" + h + "</span>");
			$attr.append($elm);
		});
		st.character.$pageft.append($attr);
	},
	renderEndurance: function() {
		st.log("rendering endurance");

		var spec = st.character.spec;
				
		var attr = spec.attributes;
		
		var endurance = spec.endurance;
		endurance.inactsave = 20;
		endurance.uncthresh = 5;
		endurance.maxopoend = attr.end;
		endurance.curropoend = " ";
		endurance.woundhealrate = Math.floor(attr.end / 20);
		endurance.fathealrate = Math.floor(attr.end / 10);	
		
		console.log(endurance);
		
		// endurance
		var $endurance = $("<div class=\"st-section st-endurance\"></div>");
		_.each(endurance, function(value, key) {
			var h = value;
			$elm = $("<span class=\"st-item st-endurance-item st-endurance-item-" + key + "\">" + h + "</span>");
			$endurance.append($elm);
		});
		console.log($endurance);
		st.character.$pageft.append($endurance);
	},
	renderDemographics: function() {
		st.log("rendering demographics");

		var spec = st.character.spec;
		var demographics = spec.demographics;
		
		// page
		var $demographics = $("<div class=\"st-section st-demographics\"></div>");
		_.each(demographics, function(value, key) {
			var h = value + "";
			$elm = $("<span class=\"st-item st-demographics-item st-demographics-item-" + key + "\">" + h + "</span>");
			$demographics.append($elm);
		});
		st.character.$pageft.append($demographics);
	},
	renderOverview: function() {
		st.log("rendering overview");

		var spec = st.character.spec;
		var overview = spec.overview;

		// page
		var $overview = $("<div class=\"st-section st-overview\"></div>");
		_.each(overview, function(value, key) {
			var h = value + "";
			if (h.indexOf(",") > -1) {
				h = h.split(",");
				h = h.join("<br/>");
			}
			if (!h) {
				h = "&nbsp;";
			}
			$elm = $("<span class=\"st-item st-overview-item st-overview-item-" + key + "\">" + h + "</span>");
			$overview.append($elm);
		});
		st.character.$pageft.append($overview);
	},
	renderSkills: function() {
		st.log("rendering skills");

		var spec = st.character.spec;

		var skills = spec.skills;
		
		// there are three sets of skills, to match the display
		for (var i=0;i<3;i++) {
			var skillsI = skills[i];

			var $skillsI = $("<div class=\"st-section st-skills st-skills-" + i + "\"></div>");
			_.each(skillsI, function(skill) {
				var h1 = skill.split(",");
				var skillName = h1[0];
				var key = skillName.toLowerCase().replace(/ /g,"-").split(":").join("-");
				var html = [];

				html.push("<span class=\"st-skill st-skill-" + key + "\" title=\"" + key.toUpperCase() + "\">");
				var h2 = h1.slice(1);
				if (h2.length < 2) {
					value = "";
				} else {
					items = h2[1].split(" ");
					if (items.length) {
						_.each(items, function(item, i) {
							html.push("<span class=\"st-skill-item st-skill-item-" + key + "\">" + item + "</span>");
						});

						var cIndex = skillName.indexOf(":");
						if (cIndex > -1) {
							var subset = skillName.substring(cIndex+1);
							if (subset) {
								var subsetKey = subset.toLowerCase();
								html.push("<span class=\"st-skill-item st-skill-item-subset st-skill-item-" + subsetKey + "\">" + subset + "</span>");
							}
						}
					}					
				}
				html.push("</span>");
				$elm = $(html.join(""));
				$skillsI.append($elm);
			});
			st.character.$pageft.append($skillsI);
		}		
	},
	renderStats: function() {
		st.log("rendering stats");

		var spec = st.character.spec;

		var stats = spec.stats;
		var $stats = $("<div class=\"st-section st-stats\"></div>");
		_.each(stats, function(value, key) {
			var h = value;
			var $elm = $("<span class=\"st-stat st-stat-" + key + "\" title=\"" + key.toUpperCase() + "\">" + h + "</span>");
			$stats.append($elm);
		});
		st.character.$pageft.append($stats);
	},
	renderArmor: function() {
		st.log("rendering armor");

		var spec = st.character.spec;
		var armor = spec.armor;
		var $armor = $("<div class=\"st-section st-armor\"></div>");
		_.each(armor, function(value, key) {
			var $elm = $("<span class=\"st-armor-item st-armor-item-" + key + "\" title=\"" + key + "\">" + value + "</span>");
			$armor.append($elm);
		});
		st.character.$pageft.append($armor);
	},
	renderWeapons: function() {
		st.log("rendering weapons");

		var spec = st.character.spec;
		var weapons = spec.weapons;
		var i = 0;
		var $weapons = $("<div class=\"st-section st-weapons\"></div>");
		_.each(weapons, function(weapon) {
			var $weapon = $("<div class=\"st-weapon\"></div>");
			_.each(weapon, function(value, key) {
				var $elm = $("<span class=\"st-weapon-item st-weapon-item-" + key + "\">" + value + "</span>");
				$weapon.append($elm);
			});
			$weapons.append($weapon);
		});
		st.character.$pageft.append($weapons);
	}
};