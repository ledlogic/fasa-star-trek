/* st-char.js */

/* 
 * The display models are optimized for the output display, rather than being truncated.
 * Since the order is known in the output, rendering of css is simplified.
 * In another layout, it could be adjusted to use css-specific overrides for position
 * of individual attributes.
 */
st.render = {
	init: function() {
		st.log("init render");
		st.character.$pageft = $(".st-page .st-page-ft");
	},

	renderChar: function() {
		st.log("rendering char");

		var that = st.render;
		
		that.renderReset();		
		that.renderOverview();
		that.renderDemographics();
		that.renderAttributes();
		that.renderEndurance();
		that.renderSkills();
		that.renderActionPoints();
		that.renderToHits();
		
		$(".st-page").removeClass("st-initial-state");
	},
	renderReset: function() {
		st.character.$pageft.html("");
	},
	renderActionPoints: function() {
		st.log("rendering action points");

		var spec = st.character.spec;
		var attr = spec.attributes;
		var dex = attr.dex;
		var ap = Math.floor(dex / 10.0) + 4;
		
		// attr
		var $attr = $("<div class=\"st-section st-action-points\"></div>");
		var y = (18 - ap) * 42.5;
		$elm = $("<span class=\"st-item st-action-point\""
				 + " style=\"top: " + y + "px\""
				 + "></span>");
		$attr.append($elm);
		st.character.$pageft.append($attr);
	},
	renderAttributes: function() {
		st.log("rendering attributes");

		var spec = st.character.spec;
		var attr = spec.attributes;

		// attr
		var $attr = $("<div class=\"st-section st-attributes\"></div>");
		_.each(attr, function(value, key) {
			var h = value;
			$elm = $("<span class=\"st-item st-attribute st-attribute-" + key + "\"><label>" + key + "</label>" + h + "</span>");
			$attr.append($elm);
		});
		st.character.$pageft.append($attr);
	},
	renderDemographics: function() {
		st.log("rendering demographics");

		var spec = st.character.spec;
		var demographics = spec.demographics;
		
		// page
		var $demographics = $("<div class=\"st-section st-demographics\"></div>");
		_.each(demographics, function(value, key) {
			var h = value + "";
			if (!h) {
				h = "&nbsp;"
			}
			$elm = $("<span class=\"st-item st-demographics-item st-demographics-item-" + key + "\"><label>" + key + "</label>" + h + "</span>");
			$demographics.append($elm);
		});
		st.character.$pageft.append($demographics);
	},
	renderEndurance: function() {
		st.log("rendering endurance");

		var spec = st.character.spec;
				
		var attr = spec.attributes;
		
		var endurance = spec.endurance;
		var race = spec.demographics["race"];
		var inactsave = st.character.inactsave[race];
		endurance.inactsave = inactsave;
		endurance.uncthresh = 5;
		endurance.maxopoend = attr.end;
		endurance.curropoend = "&nbsp;";
		endurance.woundhealrate = Math.floor(attr.end / 20);
		endurance.fathealrate = Math.floor(attr.end / 10);	
		
		// endurance
		var $endurance = $("<div class=\"st-section st-endurance\"></div>");
		_.each(endurance, function(value, key) {
			var h = value;
			$elm = $("<span class=\"st-item st-endurance-item st-endurance-item-" + key + "\"><label>" + key + "</label>" + h + "</span>");
			$endurance.append($elm);
		});
		st.character.$pageft.append($endurance);
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
			
		st.character.$pageft.append("<h2 class=\"st-skill-list-header\">Skill List</h2>");
		
		// there are three sets of skills, to match the display
		var columnSize = Math.ceil(_.size(skills) / 3.0);
		var skillsI = _.chunkObj(skills, columnSize);
		
		for (var i=0;i<3;i++) {
			var y = 0;
			var $skillsI = $("<div class=\"st-section st-skills st-skills-" + i + "\"></div>");
			_.each(skillsI[i], function(value, key) {
				var h = value + "";
				if (!h) {
					h = "&nbsp;"
				}
				var elm = "";
				var classKey = "";
				var dispKey = _.keyToLabel(key);
				elm += ("<span class=\"st-item st-skill-item-key st-skill-item-key-" + classKey + "\""
						+" style=\"top: " + y + "px\""
						+">" + dispKey + "</span>");
				elm += ("<span class=\"st-item st-skill-item st-skill-item-" + key + "\""
						+" style=\"top: " + y + "px\""
						+">" + h + "</span>");
				$skillsI.append(elm);
				y += 17.6;
			});
			st.character.$pageft.append($skillsI);
		}		
	},
	renderToHits: function() {
		st.log("rendering to hits");
		
		var spec = st.character.spec;

		var tohits = spec.tohits;
		var $tohits = $("<div class=\"st-section st-tohits\"></div>");
		_.each(tohits, function(value, key) {
			var h = value;
			var $elm = $("<span class=\"st-item st-tohit st-tohit-" + key + "\" title=\"" + key.toUpperCase() + "\"><label>" + key + "</label>" + h + "</span>");
			$tohits.append($elm);
		});
		st.character.$pageft.append($tohits);
	},
	renderTheBeginning: function() {
		var $status = $(".st-status");
		$status.removeClass("st-hidden");
		$("#st-status-current").html("The Beginning");
		
		var skills = {};
		skills["computer-operation"] = 5;
		skills["language-*"] = 5;
		skills["marksmanship-modern"] = 5;
		skills["personal-combat-armed-dueling-stick"] = 5;
		skills["personal-combat-unarmed"] = 5;
		skills["social-sciences-romulan-history"] = 5;
		skills["small-equipment-systems-operation"] = 5;
		skills["sports-*"] = 5;
		
		var $beginning = $("<div class=\"st-beginning\"></div>")
		$beginning.append("<h2 class=\"st-beginning-header\">The Beginning</h2>")
		$beginning.append("<span class=\"st-beginning-instructions\">Please select from the choices below:</span>")
		_.each(skills, function(value, key) {
			var h = value;
			var dispKey = _.keyToLabel(key);
			var $elm = $("<div></div>");
			var $choice = $("<span class=\"st-key\">" + dispKey + "</span>");
			if (key.indexOf("*") > -1) {
				var choices = st.gen.getChoices(key);				
				var $choice = $("<select class=\"st-key\"></select>");
				$choice.on("change", st.render.selectBeginningSkill);
				$choice.append("<option value=\"\">Choose a skill</option>");
				_.each(choices, function(choice) {
					var choiceLabel = _.keyToLabel(choice);
					$choice.append("<option value=\"" + choice + "\">" + choiceLabel + "</option>");
				});		
			}
			$elm.append($choice);
			
			$elm.append("<span class=\"st-value\">" + value + "</span>");
			$beginning.append($elm);
		});
		$beginning.append("<div class=\"st-actions\"><button id=\"st-beginning-ok\" disabled>OK</button></div>");

		st.character.$pageft.append($beginning);
		
		$("#st-beginning-ok").on("click", st.render.actionBeginningOk);
	},
	hideNav: function() {
		$(".st-nav.row").hide();		
	},
	selectBeginningSkill: function(skill) {
		console.log("selectBeginningSkill");
		var $sel = $(this);
		var skill = $sel.val();
		console.log("- skill[" + skill + "]");
		st.render.checkBeginningActionStatus();
	},
	checkBeginningActionStatus: function() {
		console.log("checkBeginningActionStatus");
		var sels = $(".st-beginning select");
		var selCount = 0;
		_.each(sels, function(sel) {
			var $sel = $(sel);
			var skill = $sel.val();
			if (skill) {
				selCount++;
			}
		});
		if (sels.length === selCount) {
			console.log("- ok");
			$("#st-beginning-ok").removeAttr("disabled");
		} else {
			console.log("- ng");
			$("#st-beginning-ok").attr("disabled", "disabled");
		}
	},
	actionBeginningOk: function() {
		console.log("actionBeginningOk");
	}
};