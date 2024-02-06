st.dialog = {

	/* THE BEGINNING */

	dialogTheBeginning: function() {
		console.log("dialogTheBeginning");

		var title = "The Beginning";
		st.render.renderStatus(title);
		st.character.setAge("5-10 years");
			
		var skills = st.skills.romulanBeginningSkills;
		var $beginning = $("<div class=\"st-beginning\"></div>");
		$beginning.append("<h2 class=\"st-beginning-header\">" + title + "</h2>");
		$beginning.append("<span class=\"st-beginning-instructions\">Please select from the choices below:</span>");
		_.each(skills, function(value, key) {
			var dispKey = _.keyToLabel(key);
			var $elm = $("<div class=\"st-skill-div\"></div>");
			var $choice = $("<span class=\"st-key\" data-key=\"" + key + "\">" + dispKey + "</span>");
			var astIndex = key.indexOf("*");
			if (astIndex > -1) {
				var prefix = key.substring(0, astIndex);
				var choices = st.gen.getChoices(key);				
				var $choice = $("<select class=\"st-key\" data-key-prefix=\"" + prefix + "\"></select>");
				$choice.on("change", st.dialog.selectBeginningSkill);
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
		$beginning.append("<div class=\"st-actions\"><button id=\"st-beginning-ok\" disabled=\"disabled\">OK</button></div>");

		st.character.$pageft.append($beginning);
		st.render.renderAge();
		
		$("#st-beginning-ok").on("click", st.dialog.actionBeginningOk);
	},
	selectBeginningSkill: function(skill) {
		console.log("selectBeginningSkill");
		
		var $sel = $(this);
		var skill = $sel.val();
		st.log("- skill[" + skill + "]");
		st.dialog.checkBeginningActionStatus();
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
		
		st.dialog.hideBeginning();
		
		st.render.renderChar();
		st.dialog.dialogTheBeginningElectives();
	},
	hideBeginning: function() {
		console.log("hideBeginning");
		
		var $dialog = $(".st-beginning");
		$dialog.remove();
	},
	
	/* THE BEGINNING - electives */

	dialogTheBeginningElectives: function() {
		console.log("dialogTheBeginningElectives");

		var title = "The Beginning Electives";
		st.render.renderStatus(title);
		st.character.setAge("5-10 years");
			
		var spec = st.character.spec;
		var specSkills = spec.skills;
			
		var skills = st.skills.romulanBeginningElectivesSkills;
		var $beginning = $("<div class=\"st-beginning-electives\"></div>");
		$beginning.append("<h2 class=\"st-beginning-header\">" + title + "</h2>");
		var qty = st.skills.romulanBeginningElectivesSkillsQty;
		$beginning.append("<span class=\"st-beginning-instructions\">Please select " + qty + " from the choices below:</span>");
		_.each(skills, function(value, key) {
			var dispKey = _.keyToLabel(key);
			var $elm = $("<div class=\"st-key-div\" data-key=\"" + key + "\"></div>");
			var $checkbox = $("<input type=\"checkbox\" class=\"st-checkbox\" data-key=\"" + key + "\" />")
			$checkbox.on("click", st.dialog.actionBeginningElectivesCheckbox);
			$elm.append($checkbox);
			var $choice = $("<span class=\"st-key-span st-disabled\" data-key=\"" + key + "\">" + dispKey + "</span>");
			var astIndex = key.indexOf("*");
			if (astIndex > -1) {
				var prefix = key.substring(0, astIndex);
				var choices = st.gen.getChoices(key);				
				var $choice = $("<select class=\"st-key-select st-disabled\" disabled=\"disabled\" data-key=\"" + key + "\" data-key-prefix=\"" + prefix + "\"></select>");
				$choice.on("change", st.dialog.selectBeginningElectivesSkill);
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
		$beginning.append("<div class=\"st-actions\"><button id=\"st-beginning-ok\" disabled=\"disabled\">OK</button></div>");

		st.character.$pageft.append($beginning);
		
		$("#st-beginning-ok").on("click", st.dialog.actionBeginningElectivesOk);
	},
	selectBeginningElectivesSkill: function(skill) {
		console.log("selectBeginningElectivesSkill");

		var $sel = $(this);
		var skill = $sel.val();
		st.log("- skill[" + skill + "]");
		st.dialog.checkBeginningElectivesActionStatus();
	},
	checkBeginningElectivesActionStatus: function() {
		console.log("checkBeginningElectivesActionStatus");
		
		$(".st-key-span, .st-key-select, .st-value").not(".st-disabled").addClass("st-disabled");
		$(".st-key-select").attr("disabled", "disabled");
		
		var $cbs = $(".st-beginning-electives .st-key-div .st-checkbox:checked");
		var cbsCount = $cbs.length;
		st.logObj("cbsCount", cbsCount);
		st.logObj("$cbs", $cbs);

		var selCount = 0;
		_.each($cbs, function(cb) {
			var key = $(cb).data("key");
			var $div = $(".st-key-div[data-key='" + key + "']");
			var $spans = $div.find(".st-key-span");
			var $selects = $div.find(".st-key-select");
			var $values = $div.find(".st-value");
			window.setTimeout(function() {
				$spans.removeClass("st-disabled");
				$selects.removeClass("st-disabled");
				$values.removeClass("st-disabled");
			}, 10);
						
			$selects.removeAttr("disabled");
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

		st.dialog.hideBeginningElectives();
		st.render.renderChar();

		st.dialog.dialogTheBroadening();
	},
	hideBeginningElectives: function() {
		console.log("hideBeginningElectives");

		var $dialog = $(".st-beginning-electives");
		$dialog.remove();
	},
	actionBeginningElectivesCheckbox: function() {
		console.log("actionBeginningElectivesCheckbox");

		setTimeout(st.dialog.checkBeginningElectivesActionStatus, 10);
	},
	
	/* THE BROADENING */

	dialogTheBroadening: function() {
		console.log("dialogTheBroadening");

		var title = "The Broadening";
		st.render.renderStatus(title);

		st.character.setAge("10-15 years");
			
		var categories = st.skills.romulanBroadeningSkills;
			
		var $broadening = $("<div class=\"st-broadening\"></div>");
		$broadening.append("<h2 class=\"st-broadening-header\">" + title + "</h2>");
		$broadening.append("<span class=\"st-broadening-instructions\">Please choose a focus from the broadening selections below:</span>")
		
		$scrollDiv = $("<div class=\"st-scrolldiv\"></div>");
		_.each(categories, function(value, key) {
			var category = value;
			var dispCategory = _.keyToLabel(key);
			var $elm = $("<div class=\"st-key-div\" data-key=\"" + key + "\"></div>");
			
			_.each(category, function(skills, specialty) {
				//console.log([category, specialty, skills]);
				
				var dispSpecialty = _.keyToLabel(specialty);
				var $specialtyElm = $("<div class=\"st-specialty-div\" data-key=\"" + specialty + "\"></div>");
				var $checkbox = $("<input type=\"checkbox\" class=\"st-checkbox\" data-key=\"" + specialty + "\" />")
				$checkbox.on("click", st.dialog.actionBroadeningCheckbox);
				$specialtyElm.append($checkbox);
				var $choice = $("<span class=\"st-specialty-span st-disabled\" data-key=\"" + specialty + "\">" + dispCategory + ":" + dispSpecialty + "</span>");
				$specialtyElm.append($choice);
				
				_.each(skills, function(value, skillKey) {
					var dispKey = _.keyToLabel(skillKey);
					var $skillElm = $("<div class=\"st-skill-div\" data-key=\"" + skillKey + "\"></div>");
					var $choice = $("<span class=\"st-skill-span st-disabled\" data-key=\"" + skillKey + "\">" + dispKey + "</span>");
					var astIndex = skillKey.indexOf("*");
					if (astIndex > -1) {
						var prefix = skillKey.substring(0, astIndex);
						var choices = st.gen.getChoices(skillKey);				
						var $choice = $("<select class=\"st-skill st-key-select st-disabled\" disabled=\"disabled\" data-key=\"" + skillKey + "\" data-key-prefix=\"" + prefix + "\"></select>");
						$choice.on("change", st.dialog.selectBroadeningSkill);
						$choice.append("<option value=\"\">Choose a skill</option>");
						_.each(choices, function(choice) {
							var choiceLabel = _.keyToLabel(choice);
							$choice.append("<option value=\"" + choice + "\">" + choiceLabel + "</option>");
						});
					}
					$skillElm.append($choice);
					$skillElm.append("<span class=\"st-value st-disabled\" data-key=\"" + key + "\">" + value + "</span>");
					$specialtyElm.append($skillElm);
				});
				$elm.append($specialtyElm);
			});
			$scrollDiv.append($elm);
		});
		$broadening.append($scrollDiv);
		$broadening.append("<div class=\"st-actions\"><button id=\"st-broadening-ok\" disabled>OK</button></div>");
		st.character.$pageft.append($broadening);
		$("#st-broadening-ok").on("click", st.dialog.actionBroadeningOk);
	},
	actionBroadeningOk: function() {
		console.log("actionBroadeningOk");
		
		var spec = st.character.spec;
		var specSkills = spec.skills;
		
		var $cbs = $(".st-broadening .st-checkbox:checked");
		var cbsCount = $cbs.length;
		st.log("cbsCount[" + cbsCount + "]");

		_.each($cbs, function(cb) {
			var key = $(cb).data("key");
			var $specialtyDiv = $("div.st-specialty-div[data-key='" + key + "']");
			var $skillDivs = $specialtyDiv.find(".st-skill-div"); 
		
			_.each($skillDivs, function(skillDiv) {
				var $skillDiv = $(skillDiv);
				var skillKey = $skillDiv.data("key");
				var skillValue = parseInt($skillDiv.find(".st-value").html(),10);
				var astIndex = skillKey.indexOf("*");
				if (astIndex > -1) {
					var prefix = skillKey.substring(0, astIndex);
					var $selects = $skillDiv.find(".st-key-select[data-key-prefix='" + prefix + "']");

					_.each($selects, function(select) {
						skillKey = $(select).val();
						st.log(skillKey + ":" + skillValue);
						specSkills[skillKey] += skillValue;
					});	
				} else {
					st.log(skillKey + ":" + skillValue);
					specSkills[skillKey] += skillValue;
				}
			});	
		});

		st.dialog.hideBroadening();
		st.render.renderChar();

		st.dialog.dialogBroadeningElectives();
	},
	hideBroadening: function() {
		console.log("hideBroadening");

		var $dialog = $(".st-broadening");
		$dialog.remove();
	},
	checkBroadeningActionStatus: function() {
		console.log("checkBroadeningActionStatus");
		
		$(".st-specialty-span, .st-specialty-skill, .st-value, .st-key-select").not(".st-disabled").addClass("st-disabled");
		$(".st-key-select").attr("disabled", "disabled");
		
		var $cbs = $(".st-specialty-div .st-checkbox:checked");
		var cbsCount = $cbs.length;
		st.log("cbsCount[" + cbsCount + "]");
		
		var selCount = 0;
		_.each($cbs, function(cb) {
			var specialty = $(cb).data("key");
			var $specialty = $(".st-specialty-span[data-key='" + specialty + "']");
			var $subspecialty = $(".st-specialty-div[data-key='" + specialty + "']");
			var $skills = $subspecialty.find(".st-skill-span");
			var $values = $subspecialty.find(".st-value");
			var $selects = $subspecialty.find(".st-key-select");
			window.setTimeout(function() {
				$specialty.removeClass("st-disabled");
				$subspecialty.removeClass("st-disabled");
				$skills.removeClass("st-disabled");
				$values.removeClass("st-disabled");
				$selects.removeClass("st-disabled");

				$selects.removeAttr("disabled");
			}, 10);

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
		
		var qty = 1;
		//if (cbsCount === qty && cbsCount === selCount) {
		if (cbsCount === qty) {
			st.log("- ok");
			$("#st-broadening-ok").removeAttr("disabled");
		} else {
			st.log("- ng");
			$("#st-broadening-ok").attr("disabled", "disabled");
		}
	},
	actionBroadeningCheckbox: function() {
		console.log("actionBroadeningCheckbox");

		setTimeout(st.dialog.checkBroadeningActionStatus(), 10);
	},
	selectBroadeningSkill: function(skill) {
		console.log("selectBroadeningSkill");

		var $sel = $(this);
		var skill = $sel.val();
		st.log("- skill[" + skill + "]");
		st.dialog.checkBroadeningActionStatus();
	},
	
	/* BROADENING ELECTIVES */

	dialogBroadeningElectives: function() {
		console.log("dialogBroadeningElectives");

		var title = "Broadening Electives";
		st.render.renderStatus(title);
		//st.character.setAge("5-10 years");
		
		var electiveValue = 10;
			
		var skills = st.skills.withoutValue(st.character.spec.skills);
		var $electives = $("<div class=\"st-broadening-electives\"></div>");
		$electives.append("<h2 class=\"st-broadening-electives-header\">" + title + "</h2>");
		$electives.append("<span class=\"st-broadening-electives-instructions\">Please select two skills that you do not yet have:</span>");
		
		for (var i=0; i<2; i++) {
			var $elm = $("<div class=\"st-skill-div\"></div>");
			var $select = $("<select class=\"st-key\" data-key=\"elective-" + i + "\"></select>");
			$select.on("change", st.dialog.selectBroadeningElectivesSkill);
			$select.append("<option value=\"\">Choose a skill</option>");
			_.each(skills, function(key) {
				var dispKey = _.keyToLabel(key);
				$select.append("<option value=\"" + key + "\">" + dispKey + "</option>");
			});
			$elm.append($select);
			$elm.append("<span class=\"st-value\" data-key=\"elective-value-" + i + "\">" + electiveValue + "</span>");
			$electives.append($elm);
		}
		
		$electives.append("<div class=\"st-actions\"><button id=\"st-broadening-electives-ok\" disabled=\"disabled\">OK</button></div>");

		st.character.$pageft.append($electives);
		st.render.renderAge();
		
		$("#st-broadening-electives-ok").on("click", st.dialog.actionBroadeningElectivesOk);
	},
	
	selectBroadeningElectivesSkill: function() {
		console.log("selectBroadeningElectivesSkill");

		var $sel = $(this);
		var skill = $sel.val();
		st.log("- skill[" + skill + "]");
		st.dialog.checkBroadeningElectivesActionStatus();
	},
	
	checkBroadeningElectivesActionStatus:function() {
		console.log("checkBroadeningActionStatus");

		var selCount = 0;		
		for (var i=0; i<2; i++) {
			var key = "elective-" + i;
			var $select = $("div select[data-key='" + key + "']");
			var skillKey = $select.val();
			if (skillKey) {
				selCount++;
			}
		}
		st.log("selCount[" + selCount + "]");
		
		var qty = 2;
		if (selCount === qty) {
			st.log("- ok");
			$("#st-broadening-electives-ok").removeAttr("disabled");
		} else {
			st.log("- ng");
			$("#st-broadening-electives-ok").attr("disabled", "disabled");
		}
	},
	
	actionBroadeningElectivesOk: function() {
		console.log("actionBroadeningElectivesOk");
		
		var spec = st.character.spec;
		var specSkills = spec.skills;

		for (var i=0; i<2; i++) {
			var key = "elective-" + i;
			var $select = $("div select[data-key='" + key + "']");
			var skillKey = $select.val();
			var valueKey = "elective-value-" + i;
			var skillValue = parseInt($(".st-value[data-key='" + valueKey + "']").html(), 10);
			st.log(skillKey + ":" + skillValue);
			specSkills[skillKey] += skillValue;
		}

		st.dialog.hideBroadeningElectives();
		st.render.renderChar();

		//st.dialog.dialogBroadeningElectives();
	},
	
	hideBroadeningElectives: function() {
		console.log("hideBroadeningElectives");

		var $dialog = $(".st-broadening-electives");
		$dialog.remove();
	}

};