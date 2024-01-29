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
		var valuedSkills = st.skills.withValue(skills);
			
		st.character.$pageft.append("<h2 class=\"st-skill-list-header\">Skill List</h2>");
		
		// there are three sets of skills, to match the display
		var columnSize = Math.ceil(_.size(valuedSkills) / 3.0);
		var skillsI = st.render.chunkObj(valuedSkills, columnSize);
		
		for (var i=0;i<3;i++) {
			var y = 0;
			var $skillsI = $("<div class=\"st-section st-skills st-skills-" + i + "\"></div>");
			_.each(skillsI[i], function(value, key) {
				if (value) {
					var h = value + "";
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
				}
			});
			st.character.$pageft.append($skillsI);
		}		
	},
	chunkObj: function(obj, chunks) {
		var ret = [];
		var objSize = _.size(obj);
		var ave = [];
		ave[0] = Math.ceil(objSize / chunks);
		ave[1] = Math.round((objSize - ave[0]) / (chunks-1));
		ave[2] = Math.ceil((objSize - ave[0] - ave[1]) / (chunks-2));
		
		console.log(ave);
		
		var row = 0;
		var current = 0;
		_.each(obj, function(value, key) {
			if (row > ave[current]) {
				current++;
				row=0;
			}
			if (!ret[current]) {
				ret[current] = {};
			}
			ret[current][key] = value;
			row++;
		});
		return ret;
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
	renderStatus: function(status) {
		var $status = $(".st-status");
		$status.removeClass("st-hidden");
		$("#st-status-current").html(status);
	},
		hideNav: function() {
		$(".st-nav.row").hide();		
	},

	/* THE BEGINNING */
	renderTheBeginning: function() {
		var title = "The Beginning";
		st.render.renderStatus(title);
			
		var skills = st.skills.romulanBeginningSkills;
		var $beginning = $("<div class=\"st-beginning\"></div>")
		$beginning.append("<h2 class=\"st-beginning-header\">" + title + "</h2>")
		$beginning.append("<span class=\"st-beginning-instructions\">Please select from the choices below:</span>")
		_.each(skills, function(value, key) {
			var h = value;
			var dispKey = _.keyToLabel(key);
			var $elm = $("<div></div>");
			var $choice = $("<span class=\"st-key\" data-key=\"" + key + "\">" + dispKey + "</span>");
			var astIndex = key.indexOf("*");
			if (astIndex > -1) {
				var prefix = key.substring(0, astIndex);
				var choices = st.gen.getChoices(key);				
				var $choice = $("<select class=\"st-key\" data-key-prefix=\"" + prefix + "\"></select>");
				$choice.on("change", st.render.selectBeginningSkill);
				$choice.append("<option value=\"\">Choose a skill</option>");
				_.each(choices, function(choice) {
					var choiceLabel = _.keyToLabel(choice);
					$choice.append("<option value=\"" + choice + "\">" + choiceLabel + "</option>");
				});		
			}
			$elm.append($choice);
			$elm.append("<span class=\"st-value\" data-key=\"" + key + "\">" + value + "</span>");
			$beginning.append($elm);
		});
		$beginning.append("<div class=\"st-actions\"><button id=\"st-beginning-ok\" disabled>OK</button></div>");

		st.character.$pageft.append($beginning);
		
		$("#st-beginning-ok").on("click", st.render.actionBeginningOk);
	},
	selectBeginningSkill: function(skill) {
		console.log("selectBeginningSkill");
		var $sel = $(this);
		var skill = $sel.val();
		st.log("- skill[" + skill + "]");
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
			st.log("- ok");
			$("#st-beginning-ok").removeAttr("disabled");
		} else {
			st.log("- ng");
			$("#st-beginning-ok").attr("disabled", "disabled");
		}
	},
	actionBeginningOk: function() {
		console.log("actionBeginningOk");
		
		var spec = st.character.spec;
		var specSkills = spec.skills;
		
		var skills = st.skills.romulanBeginningSkills;
		_.each(skills, function(value, key) {
			var $valueElem = $(".st-beginning .st-value[data-key='" + key + "']");
			var value = parseInt($valueElem.html(),10);
			var astIndex = key.indexOf("*");
			if (astIndex > -1) {
				var prefix = key.substring(0, astIndex);
				var $sel = $(".st-beginning .st-key[data-key-prefix='" + prefix + "']");
				key = $sel.val();
			}
			st.log(key + ":" + value);
			specSkills[key] += value;
		});
		
		st.render.hideBeginning();
		
		st.render.renderChar();
		st.render.renderTheBeginningElectives();
	},
	hideBeginning: function() {
		var $beginning = $(".st-beginning");
		$beginning.remove();
	},
	
	/* THE BEGINNING - electives */
	renderTheBeginningElectives: function() {
		var title = "The Beginning Electives";
		st.render.renderStatus(title);
			
		var spec = st.character.spec;
		var specSkills = spec.skills;
			
		var skills = st.skills.romulanBeginningElectivesSkills;
		var $beginning = $("<div class=\"st-beginning-electives\"></div>");
		$beginning.append("<h2 class=\"st-beginning-header\">" + title + "</h2>");
		var qty = st.skills.romulanBeginningElectivesSkillsQty;
		$beginning.append("<span class=\"st-beginning-instructions\">Please select " + qty + " from the choices below:</span>")
		_.each(skills, function(value, key) {
			var h = value;
			var dispKey = _.keyToLabel(key);
			var $elm = $("<div class=\"st-key-div\" data-key=\"" + key + "\"></div>");
			var $checkbox = $("<input type=\"checkbox\" class=\"st-checkbox\" data-key=\"" + key + "\" />")
			$checkbox.on("click", st.render.actionBeginningElectivesCheckbox);
			$elm.append($checkbox);
			var $choice = $("<span class=\"st-key st-key-span st-disabled\" data-key=\"" + key + "\">" + dispKey + "</span>");
			var astIndex = key.indexOf("*");
			if (astIndex > -1) {
				var prefix = key.substring(0, astIndex);
				var choices = st.gen.getChoices(key);				
				var $choice = $("<select class=\"st-key st-key-select st-disabled\" disabled=\"disabled\" data-key=\"" + key + "\" data-key-prefix=\"" + prefix + "\"></select>");
				$choice.on("change", st.render.selectBeginningElectivesSkill);
				$choice.append("<option value=\"\">Choose a skill</option>");
				_.each(choices, function(choice) {
					// only can add beginning electives with rank zero (TRW:GOM40)
					if (specSkills[choice] === 0) {
						var choiceLabel = _.keyToLabel(choice);
						$choice.append("<option value=\"" + choice + "\">" + choiceLabel + "</option>");
					}
				});		
			}
			$elm.append($choice);
			$elm.append("<span class=\"st-value\" data-key=\"" + key + "\">" + value + "</span>");
			$beginning.append($elm);
		});
		$beginning.append("<div class=\"st-actions\"><button id=\"st-beginning-ok\" disabled>OK</button></div>");

		st.character.$pageft.append($beginning);
		
		$("#st-beginning-ok").on("click", st.render.actionBeginningElectivesOk);
	},
	selectBeginningElectivesSkill: function(skill) {
		console.log("selectBeginningElectivesSkill");
		var $sel = $(this);
		var skill = $sel.val();
		st.log("- skill[" + skill + "]");
		st.render.checkBeginningElectivesActionStatus();
	},
	checkBeginningElectivesActionStatus: function() {
		console.log("checkBeginningElectivesActionStatus");
		
		$(".st-key-span, .st-key-select, .st-value").addClass("st-disabled");
		$(".st-key-select").attr("disabled", "disabled");
		
		var $cbs = $(".st-beginning-electives .st-checkbox:checked");
		var cbsCount = $cbs.length;
		st.log("cbsCount[" + cbsCount + "]");

		var selCount = 0;
		_.each($cbs, function(cb) {
			var key = $(cb).data("key");
			$(".st-key-span[data-key='" + key + "'], .st-key-select[data-key='" + key + "'], .st-value[data-key='" + key + "']").removeClass("st-disabled");
			$(".st-key-select[data-key='" + key + "']").removeAttr("disabled");
			var $sel = $cbs.parent().find(".st-select");
			if ($sel.length == 0) {
				selCount++;
			} else {
				var skill = $sel.val();
				if (skill) {
					selCount++;
				}
			}
		});
		st.log("selCount[" + selCount + "]");
	
		var qty = st.skills.romulanBeginningElectivesSkillsQty;
		if (cbsCount === qty && cbsCount === selCount) {
			st.log("- ok");
			$("#st-beginning-ok").removeAttr("disabled");
		} else {
			st.log("- ng");
			$("#st-beginning-ok").attr("disabled", "disabled");
		}
	},
	actionBeginningElectivesOk: function() {
		console.log("actionBeginningElectivesOk");
		
		var spec = st.character.spec;
		var specSkills = spec.skills;
		
		var skills = st.skills.romulanBeginningElectivesSkills;
		_.each(skills, function(value, key) {
		});
		
		var $cbs = $(".st-beginning-electives .st-checkbox:checked");
		var cbsCount = $cbs.length;
		st.log("cbsCount[" + cbsCount + "]");

		_.each($cbs, function(cb) {
			var key = $(cb).data("key");
			var $valueElem = $(".st-beginning-electives .st-value[data-key='" + key + "']");
			var value = parseInt($valueElem.html(),10);
			var astIndex = key.indexOf("*");
			if (astIndex > -1) {
				var prefix = key.substring(0, astIndex);
				var $sel = $(".st-beginning-electives .st-key[data-key-prefix='" + prefix + "']");
				key = $sel.val();
			}
			st.log(key + ":" + value);
			specSkills[key] += value;
		});

		st.render.hideBeginningElectives();		
		st.render.renderChar();
		// TODO: next step
	},
	hideBeginningElectives: function() {
		var $beginning = $(".st-beginning-electives");
		$beginning.remove();
	},
	actionBeginningElectivesCheckbox: function() {
		st.render.checkBeginningElectivesActionStatus();
	}
};