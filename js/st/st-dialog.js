st.dialog = {

	/* ATTRIBUTES */
	
	dialogAttributes: function() {
		st.log("dialogAttributes");

		var title = "Attributes";
		st.render.renderStatus(title);
		st.character.setAge("0 years");

		var $dialog = $("<div class=\"st-attributes-dialog\"></div>");
		$dialog.append("<h2 class=\"st-attributes-dialog-header\">" + title + "</h2>");
		$dialog.append("<span class=\"st-attributes-dialog-instructions\">Here are your attributes provided by the gods.  You can accept these or pray for better ones.</span>");
				
		var attrs = st.character.spec.attributes;
		var total = 0;
		_.each(attrs, function(value, key) {
			var dispKey = _.keyToLabel(key);
			var $elm = $("<div class=\"st-skill-div\"></div>");
			var label = st.attributes[key].name;
			var $choice = $("<span class=\"st-key\" data-key=\"" + key + "\">" + dispKey + " (" + label + ")</span>");
			$elm.append($choice);
			$elm.append("<span class=\"st-value\" data-key=\"" + key + "\">" + value + "</span>");
			$dialog.append($elm);

			total += value;
		});

		var ave = Math.round(total / 7.0 * 10.0) / 10.0;
		$dialog.append("<div class=\"st-comparison\">Your average attribute score is " + ave + "</div>");

		$dialog.append("<div class=\"st-actions\">"
			+ "<button id=\"st-attributes-dialog-pray\">Pray to the Gods</button>"
			+ "<button id=\"st-attributes-dialog-ok\">OK</button>"
			+ "</div>");

		st.character.$pageft.append($dialog);
		$dialog.hide().fadeIn();

		st.render.renderAge();
		$("#st-attributes-dialog-ok").on("click", st.dialog.attributesOk);
		$("#st-attributes-dialog-pray").on("click", st.dialog.attributesPray);
	},
	attributesOk: function() {		
		st.dialog.hideAttributes();
		st.render.renderChar();
		st.gen.nextStep();
	},
	attributesPray: function() {		
		st.gen.genAttributes();
		st.dialog.hideAttributes();
		st.dialog.dialogAttributes();
	},
	hideAttributes: function() {
		st.log("hideAttributes");
		
		var $dialog = $(".st-attributes-dialog");
		$dialog.remove();
	},

	/* BEGINNING */

	dialogBeginning: function() {
		st.log("dialogBeginning");

		var title = "The Beginning";
		st.render.renderStatus(title);
		st.character.setAge("5-10 years");
			
		var skills = st.skills.romulanBeginningSkills;
		var $dialog = $("<div class=\"st-beginning\"></div>");
		$dialog.append("<h2 class=\"st-beginning-header\">" + title + "</h2>");
		$dialog.append("<span class=\"st-beginning-instructions\">Please select from the choices below:</span>");
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
			$dialog.append($elm)
		});
		$dialog.append("<div class=\"st-actions\"><button id=\"st-beginning-ok\" disabled=\"disabled\">OK</button></div>");

		st.character.$pageft.append($dialog);
		$dialog.hide().fadeIn();
		st.render.renderAge();
		$("#st-beginning-ok").on("click", st.dialog.actionBeginningOk);
	},
	selectBeginningSkill: function() {
		st.log("selectBeginningSkill");
		
		var $sel = $(this);
		var skill = $sel.val();
		st.log("- skill[" + skill + "]");
		st.dialog.checkBeginningActionStatus();
	},
	checkBeginningActionStatus: function() {
		st.log("checkBeginningActionStatus");

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
		st.log("actionBeginningOk");
		
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
		st.skills.maxCheck();
		st.dialog.hideBeginning();
		st.render.renderChar();
		st.gen.nextStep();
	},
	hideBeginning: function() {
		st.log("hideBeginning");
		
		var $dialog = $(".st-beginning");
		$dialog.remove();
	},
	
	/* BEGINNING ELECTIVES */

	dialogBeginningElectives: function() {
		st.log("dialogBeginningElectives");

		var title = "The Beginning Electives";
		st.render.renderStatus(title);
		st.character.setAge("5-10 years");
			
		var spec = st.character.spec;
		var specSkills = spec.skills;
			
		var skills = st.skills.romulanBeginningElectivesSkills;
		var $dialog = $("<div class=\"st-beginning-electives\"></div>");
		$dialog.append("<h2 class=\"st-beginning-header\">" + title + "</h2>");
		var qty = st.skills.romulanBeginningElectivesSkillsQty;
		$dialog.append("<span class=\"st-beginning-instructions\">Please select " + qty + " from the choices below:</span>");
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
			$dialog.append($elm);
		});
		$dialog.append("<div class=\"st-actions\"><button id=\"st-beginning-ok\" disabled=\"disabled\">OK</button></div>");
		st.character.$pageft.append($dialog);
		$dialog.hide().fadeIn();
		$("#st-beginning-ok").on("click", st.dialog.actionBeginningElectivesOk);
	},
	selectBeginningElectivesSkill: function() {
		st.log("selectBeginningElectivesSkill");

		var $sel = $(this);
		var skill = $sel.val();
		st.log("- skill[" + skill + "]");
		st.dialog.checkBeginningElectivesActionStatus();
	},
	checkBeginningElectivesActionStatus: function() {
		st.log("checkBeginningElectivesActionStatus");
		
		$(".st-key-span, .st-key-select, .st-value").not(".st-disabled").addClass("st-disabled");
		$(".st-key-select").attr("disabled", "disabled");
		
		// checked checkboxes
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
			var $sel = $cbs.parent().find(".st-key-select");
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
		st.log("actionBeginningElectivesOk");
		
		var spec = st.character.spec;
		var specSkills = spec.skills;
		
		// checked checkboxes
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
				var $sel = $(".st-beginning-electives .st-key-select[data-key-prefix='" + prefix + "']");
				key = $sel.val();
			}
			st.log(key + ":" + value);
			specSkills[key] += value;
		});
		st.skills.maxCheck();
		st.dialog.hideBeginningElectives();
		st.character.setAge("10 years");
		st.render.renderChar();
		st.gen.nextStep();
	},
	hideBeginningElectives: function() {
		st.log("hideBeginningElectives");

		var $dialog = $(".st-beginning-electives");
		$dialog.remove();
	},
	actionBeginningElectivesCheckbox: function() {
		st.log("actionBeginningElectivesCheckbox");

		setTimeout(st.dialog.checkBeginningElectivesActionStatus, 10);
	},
	
	/* THE BROADENING */

	dialogTheBroadening: function() {
		st.log("dialogTheBroadening");

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
			var mainSpecialty = key;
			var dispCategory = _.keyToLabel(key);
			var $elm = $("<div class=\"st-key-div\" data-key=\"" + key + "\"></div>");
			
			_.each(category, function(skills, specialty) {
				//st.log([category, specialty, skills]);
				
				var dispSpecialty = _.keyToLabel(specialty);
				var $specialtyElm = $("<div class=\"st-specialty-div\" data-key=\"" + specialty + "\"></div>");
				var $checkbox = $("<input type=\"checkbox\" class=\"st-checkbox\" data-main-specialty=\"" + mainSpecialty + "\" data-sub-specialty=\"" + specialty + "\" data-key=\"" + specialty + "\" />")
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
		$broadening.append("<div class=\"st-actions\"><button id=\"st-broadening-ok\" disabled=\"disabled\">OK</button></div>");
		st.character.$pageft.append($broadening);
		$broadening.hide().fadeIn();
		$("#st-broadening-ok").on("click", st.dialog.actionBroadeningOk);
	},
	actionBroadeningOk: function() {
		st.log("actionBroadeningOk");
		
		var spec = st.character.spec;
		var specSkills = spec.skills;
		
		// checked checkboxes
		var $cbs = $(".st-broadening .st-checkbox:checked");
		var cbsCount = $cbs.length;
		st.log("cbsCount[" + cbsCount + "]");

		_.each($cbs, function(cb) {
			var main = $(cb).data("main-specialty");
			var sub = $(cb).data("sub-specialty");
			var key = $(cb).data("key");
			var specialties = {
				main: main,
				sub: sub 
			};
			st.character.spec.specialties = specialties; 
			st.logObj("specialties", specialties);
			
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
		st.skills.maxCheck();
		st.dialog.hideBroadening();
		st.render.renderChar();
		st.gen.nextStep();
	},
	hideBroadening: function() {
		st.log("hideBroadening");

		var $dialog = $(".st-broadening");
		$dialog.remove();
	},
	checkBroadeningActionStatus: function() {
		st.log("checkBroadeningActionStatus");
		
		$(".st-specialty-span, .st-specialty-div, .st-skill-span, .st-value, .st-key-select").not(".st-disabled").addClass("st-disabled");
		$(".st-key-select").attr("disabled", "disabled");
		
		// checked checkboxes
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

			_.each($selects, function(sel) {
				var $sel = $(sel);
				var skill = $sel.val();
				st.log("skill[" + skill + "]");
				if (!skill) {
					selCount--;
				}
			});
		});
		st.log("selCount[" + selCount + "]");
		
		var qty = 1;
		if (cbsCount === qty && selCount >= 0) {
			st.log("- ok");
			$("#st-broadening-ok").removeAttr("disabled");
		} else {
			st.log("- ng");
			$("#st-broadening-ok").attr("disabled", "disabled");
		}
	},
	actionBroadeningCheckbox: function() {
		st.log("actionBroadeningCheckbox");

		setTimeout(st.dialog.checkBroadeningActionStatus(), 10);
	},
	selectBroadeningSkill: function() {
		st.log("selectBroadeningSkill");

		var $sel = $(this);
		var skill = $sel.val();
		st.log("- skill[" + skill + "]");
		st.dialog.checkBroadeningActionStatus();
	},
	
	/* BROADENING ELECTIVES */

	dialogBroadeningElectives: function() {
		st.log("dialogBroadeningElectives");

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
		$electives.hide().fadeIn();
		st.render.renderAge();
		$("#st-broadening-electives-ok").on("click", st.dialog.actionBroadeningElectivesOk);
	},
	
	selectBroadeningElectivesSkill: function() {
		st.log("selectBroadeningElectivesSkill");

		var $sel = $(this);
		var skill = $sel.val();
		st.log("- skill[" + skill + "]");
		st.dialog.checkBroadeningElectivesActionStatus();
	},
	
	checkBroadeningElectivesActionStatus:function() {
		st.log("checkBroadeningActionStatus");

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
		st.log("actionBroadeningElectivesOk");
		
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
		st.skills.maxCheck();
		st.dialog.hideBroadeningElectives();
		st.render.renderChar();
		st.gen.nextStep();
	},
	
	hideBroadeningElectives: function() {
		st.log("hideBroadeningElectives");

		var $dialog = $(".st-broadening-electives");
		$dialog.remove();
	},
	
	/* BROADENING ADVANCED TRAINING */

	dialogBroadeningAdvancedTraining: function() {
		st.log("dialogBroadeningAdvancedTraining");

		var title = "Broadening: Advanced Training";
		st.render.renderStatus(title);
		//st.character.setAge("5-10 years");
		
		var electiveValue = "1d10";
			
		var skills = st.skills.withValue(st.character.spec.skills);
		var $electives = $("<div class=\"st-advanced-training\"></div>");
		$electives.append("<h2 class=\"st-advanced-training-header\">" + title + "</h2>");
		$electives.append("<span class=\"st-advanced-training-instructions\">Please select three skills that you have:</span>");
		
		for (var i=0; i<3; i++) {
			var $elm = $("<div class=\"st-skill-div\"></div>");
			var $select = $("<select class=\"st-key st-key-select\" data-key=\"elective-" + i + "\"></select>");
			$select.on("change", st.dialog.selectBroadeningAdvancedTrainingSkill);
			$select.append("<option value=\"\">Choose a skill</option>");
			_.each(skills, function(key) {
				var dispKey = _.keyToLabel(key);
				$select.append("<option value=\"" + key + "\">" + dispKey + "</option>");
			});
			$elm.append($select);
			$elm.append("<span class=\"st-value\" data-key=\"elective-value-" + i + "\">" + electiveValue + "</span>");
			$electives.append($elm);
		}
		
		$electives.append("<div class=\"st-actions\"><button id=\"st-advanced-training-ok\" disabled=\"disabled\">OK</button></div>");

		st.character.$pageft.append($electives);
		$electives.hide().fadeIn();
		st.render.renderAge();
		$("#st-advanced-training-ok").on("click", st.dialog.actionBroadeningAdvancedTrainingOk);
	},
	
	selectBroadeningAdvancedTrainingSkill: function() {
		st.log("selectBroadeningAdvancedTrainingSkill");

		var $sel = $(this);
		var skill = $sel.val();
		st.log("- skill[" + skill + "]");
		st.dialog.checkBroadeningAdvancedTrainingActionStatus();
	},
	
	actionBroadeningAdvancedTrainingOk: function() {
		st.log("actionBroadeningAdvancedTrainingOk");
		
		var spec = st.character.spec;
		var specSkills = spec.skills;

		for (var i=0; i<3; i++) {
			var key = "elective-" + i;
			var $select = $("div select[data-key='" + key + "']");
			var skillKey = $select.val();
			var skillValue = st.math.dieN(10);
			st.log(skillKey + ":" + skillValue);
			specSkills[skillKey] += skillValue;
		}
		st.skills.maxCheck();
		st.dialog.hideBroadeningAdvancedTraining();
		st.character.setAge("15 years");
		st.render.renderChar();
		st.gen.nextStep();
	},
	
	hideBroadeningAdvancedTraining: function() {
		st.log("hideBroadeningAdvancedTraining");

		var $dialog = $(".st-advanced-training");
		$dialog.remove();
	},
	
	checkBroadeningAdvancedTrainingActionStatus: function() {
		st.log("checkBroadeningAdvancedTrainingActionStatus");
		
		var selCount = 0;
		var $selects = $(".st-key-select");
		_.each($selects, function(sel) {
			var skill = $(sel).val();
			if (skill) {
				selCount++;
			}
		});
		st.log("selCount[" + selCount + "]");
		
		var qty = 3;
		//if (cbsCount === qty && cbsCount === selCount) {
		if (selCount === qty) {
			st.log("- ok");
			$("#st-advanced-training-ok").removeAttr("disabled");
		} else {
			st.log("- ng");
			$("#st-advanced-training-ok").attr("disabled", "disabled");
		}
	},
	
	/* COMING TOGETHER */

	dialogComingTogether: function() {
		st.log("dialogComingTogether");

		var title = "The Coming Together of Knowledge";
		st.render.renderStatus(title);
		st.character.setAge("15-20 years");
			
		var skills = st.skills.romulanComingTogetherSkills;
		var $dialog = $("<div class=\"st-coming-together\"></div>");
		$dialog.append("<h2 class=\"st-coming-together-header\">" + title + "</h2>");
		$dialog.append("<span class=\"st-coming-together-instructions\">Please select from the choices below:</span>");
		_.each(skills, function(value, key) {
			var dispKey = _.keyToLabel(key);
			var $elm = $("<span class=\"st-focus-div\">" + dispKey + "</span>");
			$dialog.append($elm);
			_.each(value, function(value2, key2) {
				var dispKey = _.keyToLabel(key2);
				var $elm = $("<div class=\"st-skill-div\"></div>");
				var $choice = $("<span class=\"st-key\" data-key=\"" + key2 + "\">" + dispKey + "</span>");
				var astIndex = key2.indexOf("*");
				if (astIndex > -1) {
					var prefix = key2.substring(0, astIndex);
					var choices = st.gen.getChoices(key2);				
					var $choice = $("<select class=\"st-key\" data-key-prefix=\"" + prefix + "\"></select>");
					$choice.on("change", st.dialog.selectComingTogetherSkill);
					$choice.append("<option value=\"\">Choose a skill</option>");
					_.each(choices, function(choice) {
						var choiceLabel = _.keyToLabel(choice);
						$choice.append("<option value=\"" + choice + "\">" + choiceLabel + "</option>");
					});		
				}
				$elm.append($choice);
				$elm.append("<span class=\"st-value\" data-key=\"" + key2 + "\">" + value2 + "</span>");
				$dialog.append($elm);
			});
		});
		$dialog.append("<div class=\"st-actions\"><button id=\"st-coming-together-ok\" disabled=\"disabled\">OK</button></div>");

		st.character.$pageft.append($dialog);
		$dialog.hide().fadeIn();
		st.render.renderAge();
		$("#st-coming-together-ok").on("click", st.dialog.actionComingTogetherOk);
	},
	selectComingTogetherSkill: function() {
		st.log("selectComingTogetherSkill");
		
		var $sel = $(this);
		var skill = $sel.val();
		st.log("- skill[" + skill + "]");
		st.dialog.checkComingTogetherActionStatus();
	},
	checkComingTogetherActionStatus: function() {
		st.log("checkComingTogetherActionStatus");

		var sels = $(".st-coming-together select");
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
			$("#st-coming-together-ok").removeAttr("disabled");
		} else {
			st.log("- ng");
			$("#st-coming-together-ok").attr("disabled", "disabled");
		}
	},
	actionComingTogetherOk: function() {
		st.log("actionComingTogetherOk");
		
		var spec = st.character.spec;
		var specSkills = spec.skills;

		var skills = st.skills.romulanComingTogetherSkills;
		_.each(skills, function(value, key) {
			_.each(value, function(value2, key2) {
				var $valueElem = $(".st-coming-together .st-value[data-key='" + key2 + "']");
				var value = parseInt($valueElem.html(),10);
				var astIndex = key2.indexOf("*");
				if (astIndex > -1) {
					var prefix = key2.substring(0, astIndex);
					var $sel = $(".st-coming-together .st-key[data-key-prefix='" + prefix + "']");
					key2 = $sel.val();
				}
				st.log(key2 + ":" + value);
				specSkills[key2] += value;
			});
		});
		st.skills.maxCheck();
		st.dialog.hideComingTogether();
		st.render.renderChar();
		st.gen.nextStep();
	},
	hideComingTogether: function() {
		st.log("hideComingTogether");
		
		var $dialog = $(".st-coming-together");
		$dialog.remove();
	},
	
	/* ADVANCED TRAINING IN SPECIALTY */
	
	dialogComingTogetherAdvancedTraining: function() {
		st.log("dialogComingTogetherAdvancedTraining");

		var title = "Coming Together: Advanced Training";
		st.render.renderStatus(title);
		st.character.setAge("15-20 years");
		
		var electiveValue = "1d10";
			
		var specialties = st.character.spec.specialties;
		var main = specialties.main;
		var sub = specialties.sub;
		var skills = st.skills.romulanBroadeningSkills[main][sub];
		skills = st.skills.removeDuplicates(skills);
		//st.log("skills[" + skills + "]");
		
		var $electives = $("<div class=\"st-coming-together-advanced-training\"></div>");
		$electives.append("<h2 class=\"st-coming-together-advanced-training-header\">" + title + "</h2>");
		$electives.append("<span class=\"st-coming-together-advanced-training-instructions\">Please select skills in your specialty for advanced training:</span>");
		
		var int = st.character.spec.attributes.int;
		//st.log("int[" + int + "]");
		var chances = 10 + Math.floor(Math.max(0, int - 50) / 10);
		//st.log("chances[" + chances + "]");
		st.character.spec.chances = chances;
		
		for (var i=0; i<chances; i++) {
			var $elm = $("<div class=\"st-skill-div\"></div>");
			var $select = $("<select class=\"st-key st-key-select\" data-key=\"elective-" + i + "\"></select>");
			$select.on("change", st.dialog.selectComingTogetherAdvancedTrainingSkill);
			$select.append("<option value=\"\">Choose a skill</option>");
			_.each(skills, function(key) {
				var dispKey = _.keyToLabel(key);
				var astIndex = key.indexOf("*");
				if (astIndex > -1) {
					var choices = st.gen.getChoices(key);				
					_.each(choices, function(choice) {
						var choiceLabel = _.keyToLabel(choice);
						$select.append("<option value=\"" + choice + "\">" + choiceLabel + "</option>");
					});
				} else {
					$select.append("<option value=\"" + key + "\">" + dispKey + "</option>");
				}
			});
			$elm.append($select);
			$elm.append("<span class=\"st-value\" data-key=\"elective-value-" + i + "\">" + electiveValue + "</span>");
			$electives.append($elm);
		}
		
		$electives.append("<div class=\"st-actions\"><button id=\"st-coming-together-advanced-training-ok\" disabled=\"disabled\">OK</button></div>");

		st.character.$pageft.append($electives);
		$electives.hide().fadeIn();
		st.render.renderAge();
		$("#st-coming-together-advanced-training-ok").on("click", st.dialog.actionComingTogetherAdvancedTrainingOk);
	},
	
	selectComingTogetherAdvancedTrainingSkill: function() {
		st.log("selectComingTogetherAdvancedTrainingSkill");

		var $sel = $(this);
		var skill = $sel.val();
		st.log("- skill[" + skill + "]");
		st.dialog.checkComingTogetherAdvancedTrainingActionStatus();
	},
	
	actionComingTogetherAdvancedTrainingOk: function() {
		st.log("actionComingTogetherAdvancedTrainingOk");
		
		var spec = st.character.spec;
		var specSkills = spec.skills;

		var chances = st.character.spec.chances;
		for (var i=0; i<chances; i++) {
			var key = "elective-" + i;
			var $select = $("div select[data-key='" + key + "']");
			var skillKey = $select.val();
			var skillValue = st.math.dieN(10);
			st.log(skillKey + ":" + skillValue);
			specSkills[skillKey] += skillValue;
		}
		st.skills.maxCheck();
		st.dialog.hideComingTogetherAdvancedTraining();
		st.render.renderChar();
		st.gen.nextStep();
	},
	
	hideComingTogetherAdvancedTraining: function() {
		st.log("hideComingTogetherAdvancedTraining");

		var $dialog = $(".st-coming-together-advanced-training");
		$dialog.remove();
	},
	
	checkComingTogetherAdvancedTrainingActionStatus: function() {
		st.log("checkComingTogetherAdvancedTrainingActionStatus");
		
		var selCount = 0;
		var $selects = $(".st-key-select");
		_.each($selects, function(sel) {
			var skill = $(sel).val();
			if (skill) {
				selCount++;
			}
		});
		st.log("selCount[" + selCount + "]");
		
		var chances = st.character.spec.chances;
		if (selCount === chances) {
			st.log("- ok");
			$("#st-coming-together-advanced-training-ok").removeAttr("disabled");
		} else {
			st.log("- ng");
			$("#st-coming-together-advanced-training-ok").attr("disabled", "disabled");
		}
	},
	
	/* ADVANCED TRAINING OUTSIDE SPECIALTY */
	
	dialogComingTogetherOutside: function() {
		st.log("dialogComingTogetherOutside");

		var title = "Coming Together: Outside Specialty";
		st.render.renderStatus(title);
		st.character.setAge("15-20 years");
		
		var electiveValue = "1d10";
			
		var specialties = st.character.spec.specialties;
		var main = specialties.main;
		var sub = specialties.sub;
		var specialtySkills = st.skills.romulanBroadeningSkills[main][sub];
		st.log("specialtySkills[" + specialtySkills + "]");
		var skills = st.character.spec.skills;
		st.log("skills0[" + skills + "]");
		skills = st.skills.remove(skills, specialtySkills);
		//st.log("skills1[" + skills + "]");
		
		var $electives = $("<div class=\"st-coming-together-outside\"></div>");
		$electives.append("<h2 class=\"st-coming-together-outside-header\">" + title + "</h2>");
		$electives.append("<span class=\"st-coming-together-outside-instructions\">Please select skills outside your specialty for advanced training:</span>");
		
		var chances = 10;
		for (var i=0; i<chances; i++) {
			var $elm = $("<div class=\"st-skill-div\"></div>");
			var $select = $("<select class=\"st-key st-key-select\" data-key=\"elective-" + i + "\"></select>");
			$select.on("change", st.dialog.selectComingTogetherOutsideSkill);
			$select.append("<option value=\"\">Choose a skill</option>");
			_.each(skills, function(key) {
				var dispKey = _.keyToLabel(key);
				var astIndex = key.indexOf("*");
				if (astIndex > -1) {
					var choices = st.gen.getChoices(key);				
					_.each(choices, function(choice) {
						var choiceLabel = _.keyToLabel(choice);
						$select.append("<option value=\"" + choice + "\">" + choiceLabel + "</option>");
					});
				} else {
					$select.append("<option value=\"" + key + "\">" + dispKey + "</option>");
				}
			});
			$elm.append($select);
			$elm.append("<span class=\"st-value\" data-key=\"elective-value-" + i + "\">" + electiveValue + "</span>");
			$electives.append($elm);
		}
		
		$electives.append("<div class=\"st-actions\"><button id=\"st-coming-together-outside-ok\" disabled=\"disabled\">OK</button></div>");

		st.character.$pageft.append($electives);
		$electives.hide().fadeIn();
		st.render.renderAge();
		$("#st-coming-together-outside-ok").on("click", st.dialog.actionComingTogetherOutsideOk);
	},
	
	selectComingTogetherOutsideSkill: function() {
		st.log("selectComingTogetherOutsideSkill");

		var $sel = $(this);
		var skill = $sel.val();
		st.log("- skill[" + skill + "]");
		st.dialog.checkComingTogetherOutsideActionStatus();
	},
	
	actionComingTogetherOutsideOk: function() {
		st.log("actionComingTogetherOutsideOk");
		
		var spec = st.character.spec;
		var specSkills = spec.skills;

		var chances = 10;
		for (var i=0; i<chances; i++) {
			var key = "elective-" + i;
			var $select = $("div select[data-key='" + key + "']");
			var skillKey = $select.val();
			var skillValue = st.math.dieN(10);
			st.log(skillKey + ":" + skillValue);
			specSkills[skillKey] += skillValue;
		}
		st.skills.maxCheck();
		st.dialog.hideComingTogetherOutside();
		st.render.renderChar();
		st.gen.nextStep();
	},
	
	hideComingTogetherOutside: function() {
		st.log("hideComingTogetherOutside");

		var $dialog = $(".st-coming-together-outside");
		$dialog.remove();
	},
	
	checkComingTogetherOutsideActionStatus: function() {
		st.log("checkComingTogetherOutsideActionStatus");
		
		var selCount = 0;
		var $selects = $(".st-key-select");
		_.each($selects, function(sel) {
			var skill = $(sel).val();
			if (skill) {
				selCount++;
			}
		});
		st.log("selCount[" + selCount + "]");
		
		var chances = 10;
		if (selCount === chances) {
			st.log("- ok");
			$("#st-coming-together-outside-ok").removeAttr("disabled");
		} else {
			st.log("- ng");
			$("#st-coming-together-outside-ok").attr("disabled", "disabled");
		}
	},
	
	/* GREAT DUTY */
	
	dialogGreatDuty1: function() {
		st.log("dialogGreatDuty1");
		st.character.spec.overview.rank = "Equatoriam";
		st.character.spec.duty = 0;
		
		st.dialog.dialogGreatDuty();
	},
	dialogGreatDuty2: function() {
		st.log("dialogGreatDuty2");
		st.character.spec.duty = 1;
		
		st.dialog.dialogGreatDuty();
	},
	dialogGreatDuty3: function() {
		st.log("dialogGreatDuty2");
		st.character.spec.duty = 2;
		
		st.dialog.dialogGreatDuty();
	},
	dialogGreatDuty4: function() {
		st.log("dialogGreatDuty4");
		st.character.spec.duty = 3;
		
		st.dialog.dialogGreatDuty();
	},
	dialogGreatDuty5: function() {
		st.log("dialogGreatDuty5");
		st.character.spec.duty = 4;
		
		st.dialog.dialogGreatDuty();
	},
	dialogGreatDuty: function() {
		st.log("dialogGreatDuty");

		var title = "The Great Duty - Year " + (st.character.spec.duty+1);
		st.render.renderStatus(title);
		st.character.setAge((19 + st.character.spec.duty) + "-" + (20 + st.character.spec.duty) + " years");
		
		var duty = st.character.spec.duty;
		var terms = st.skills.romulanGreatDutyTerms;
		var oer = st.math.dieN(99);
		var termDuty = duty;
		st.log("oer[" + oer + "]");
		st.log("duty[" + duty + "]");
		st.log("termDuty[" + termDuty + "]");
		
		if (duty === 4) {
			st.log("term 5 override");
				
			var highOer = 0;
			for (var i=0; i<4; i++) {
				var oer = st.character.spec.terms[i].oer;
				if (oer > highOer) {
					highOer = oer;
					highDuty = i;
					st.log("highOer[" + highOer + "]");
					st.log("highDuty[" + highDuty + "]");
				}
			}
			termDuty = highDuty;

			// use bonus on term 5 if haven't
			if (!st.character.spec.termOerBonusUsed) {
				st.log("using bonus");
				oer += 20;
				oer = Math.min(99, oer);
				st.character.spec.termOerBonusUsed = true;	
			}
		}
		st.log("oer[" + oer + "]");
		st.log("duty[" + duty + "]");
		st.log("termDuty[" + termDuty + "]");
		
		var term = terms[termDuty];
		var title = _.keyToLabel(term.title);
		var skills = term.skills;
		st.character.spec.terms[duty] = {
			title: title,
			oer: oer,
			termDuty: termDuty
		};
		
		var $dialog = $("<div class=\"st-great-duty\"></div>");
		$dialog.append("<h2 class=\"st-great-duty-header\">" + title + "</h2>");
		$dialog.append("<span class=\"st-great-duty-instructions\">Please select from the choices below:</span>");

		var title = "Duty Skills";
		$dialog.append("<h3>" + title + "</h3>");

		_.each(skills, function(value, key) {
			var dispKey = _.keyToLabel(key);
			var $elm = $("<div class=\"st-skill-div\"></div>");
			var $choice = $("<span class=\"st-key\" data-key=\"" + key + "\">" + dispKey + "</span>");
			var astIndex = key.indexOf("*");
			if (astIndex > -1) {
				var prefix = key.substring(0, astIndex);
				var choices = st.gen.getChoices(key);				
				var $choice = $("<select class=\"st-key\" data-key-prefix=\"" + prefix + "\"></select>");
				$choice.on("change", st.dialog.selectGreatDutySkill);
				$choice.append("<option value=\"\">Choose a skill</option>");
				_.each(choices, function(choice) {
					var choiceLabel = _.keyToLabel(choice);
					$choice.append("<option value=\"" + choice + "\">" + choiceLabel + "</option>");
				});		
			}
			$elm.append($choice);
			$elm.append("<span class=\"st-value\" data-key=\"" + key + "\">" + value + "</span>");
			$dialog.append($elm)
		});
		
		// in-specialty
		var specialties = st.character.spec.specialties;
		var main = specialties.main;
		var sub = specialties.sub;
		var skills = st.skills.romulanBroadeningSkills[main][sub];
		skills = st.skills.removeDuplicates(skills);
		//st.log("skills[" + skills + "]");
		
		var chances = 3;
		//st.log("chances[" + chances + "]");
		var inspecialtyValue = "1d10";
		var title = "In Specialty";
		$dialog.append("<h3>" + title + "</h3>");
		for (var i=0; i<chances; i++) {
			var $elm = $("<div class=\"st-skill-div\"></div>");
			var $select = $("<select class=\"st-key st-key-select\" data-key=\"inspecialty-" + i + "\"></select>");
			$select.on("change", st.dialog.checkGreatDutyActionStatus);
			$select.append("<option value=\"\">Choose a skill</option>");
			_.each(skills, function(key) {
				var dispKey = _.keyToLabel(key);
				var astIndex = key.indexOf("*");
				if (astIndex > -1) {
					var choices = st.gen.getChoices(key);				
					_.each(choices, function(choice) {
						var choiceLabel = _.keyToLabel(choice);
						$select.append("<option value=\"" + choice + "\">" + choiceLabel + "</option>");
					});
				} else {
					$select.append("<option value=\"" + key + "\">" + dispKey + "</option>");
				}
			});
			$elm.append($select);
			$elm.append("<span class=\"st-value\" data-key=\"inspecialty-value-" + i + "\">" + inspecialtyValue + "</span>");
			$dialog.append($elm);
		}
		
		// other skills
		var outsideValue = "1d10";
		var specialties = st.character.spec.specialties;
		var main = specialties.main;
		var sub = specialties.sub;
		var specialtySkills = st.skills.romulanBroadeningSkills[main][sub];
		st.log("specialtySkills[" + specialtySkills + "]");
		var skills = st.character.spec.skills;
		st.log("skills0[" + skills + "]");
		skills = st.skills.remove(skills, specialtySkills);
		//st.log("skills1[" + skills + "]");
		
		var title = "Other Skills";
		$dialog.append("<h3>" + title + "</h3>");
		
		for (var i=0; i<chances; i++) {
			var $elm = $("<div class=\"st-skill-div\"></div>");
			var $select = $("<select class=\"st-key st-key-select\" data-key=\"otherskills-" + i + "\"></select>");
			$select.on("change", st.dialog.checkGreatDutyActionStatus);
			$select.append("<option value=\"\">Choose a skill</option>");
			_.each(skills, function(key) {
				var dispKey = _.keyToLabel(key);
				var astIndex = key.indexOf("*");
				if (astIndex > -1) {
					var choices = st.gen.getChoices(key);				
					_.each(choices, function(choice) {
						var choiceLabel = _.keyToLabel(choice);
						$select.append("<option value=\"" + choice + "\">" + choiceLabel + "</option>");
					});
				} else {
					$select.append("<option value=\"" + key + "\">" + dispKey + "</option>");
				}
			});
			$elm.append($select);
			$elm.append("<span class=\"st-value\" data-key=\"elective-value-" + i + "\">" + outsideValue + "</span>");
			$dialog.append($elm);
		}		

		$dialog.append("<div class=\"st-oer\">OER:<span class=\"st-oer-value\">" + oer + "</span></div>");

		$dialog.append("<div class=\"st-actions\">"
		 + "<button id=\"st-great-duty-add-oer\">OER +20</button>"
		 + "<button id=\"st-great-duty-ok\" disabled=\"disabled\">OK</button>"
		 + "</div>");

		st.character.$pageft.append($dialog);
		$dialog.hide().fadeIn();
		st.render.renderAge();
		st.dialog.checkAddOsrStatus();
		$("#st-great-duty-add-oer").on("click", st.dialog.actionGreatDutyAddOer);
		$("#st-great-duty-ok").on("click", st.dialog.actionGreatDutyOk);
		setTimeout(st.dialog.checkGreatDutyActionStatus, 10)
	},
	actionGreatDutyAddOer: function() {
		st.log("actionGreatDutyAddOer");
		st.character.spec.termOerBonusUsed = true;
		var oer = st.character.spec.terms[st.character.spec.duty].oer + 20;
		oer = Math.min(99, oer);
		st.character.spec.terms[st.character.spec.duty].oer = oer;
		$(".st-oer-value").html(oer);
		st.dialog.checkAddOsrStatus();
	},
	checkAddOsrStatus: function() {
		if (st.character.spec.termOerBonusUsed) {
			$("#st-great-duty-add-oer").hide()
		}
	},
	selectGreatDutySkill: function() {
		st.log("selectGreatDutySkill");
		
		var $sel = $(this);
		var skill = $sel.val();
		st.log("- skill[" + skill + "]");
		st.dialog.checkGreatDutyActionStatus();
	},
	checkGreatDutyActionStatus: function() {
		st.log("checkGreatDutyActionStatus");

		var sels = $(".st-great-duty select");
		var selCount = 0;
		_.each(sels, function(sel) {
			var $sel = $(sel);
			var skill = $sel.val();
			if (skill) {
				selCount++;
			}
		});
		st.log("sels.length[" + sels.length + "]");
		st.log("selCount[" + selCount + "]");		
		if (sels.length === selCount) {
			st.log("- ok");
			$("#st-great-duty-ok").removeAttr("disabled");
		} else {
			st.log("- ng");
			$("#st-great-duty-ok").attr("disabled", "disabled");
		}
	},
	actionGreatDutyOk: function() {
		st.log("actionGreatDutyOk");
		
		var spec = st.character.spec;
		var specSkills = spec.skills;
		var skills = st.skills.romulanGreatDutyTerms;
		var duty = st.character.spec.duty;
		st.log("duty[" + duty + "]");
		var term = st.character.spec.terms[duty];
		st.logObj("term", term);
		var termDuty = term.termDuty;
		st.log("termDuty[" + termDuty + "]");
		var termSkills = skills[termDuty].skills;
		
		_.each(termSkills, function(value, key) {
			var $valueElem = $(".st-great-duty .st-value[data-key='" + key + "']");
			var value = parseInt($valueElem.html(),10);
			var astIndex = key.indexOf("*");
			if (astIndex > -1) {
				var prefix = key.substring(0, astIndex);
				var $sel = $(".st-great-duty .st-key[data-key-prefix='" + prefix + "']");
				key = $sel.val();
			}

			st.log("key[" + key + "]");
			st.log("value[" + value + "]");
			specSkills[key] = (specSkills[key] ? specSkills[key] : 0) + value;
			st.log("specSkills[" + key + "] = [" + specSkills[key] + "]");
		});
		
		var chances = 3;
		for (var i=0; i<chances; i++) {
			var key = "inspecialty-" + i;
			var $select = $("div select[data-key='" + key + "']");
			var skillKey = $select.val();
			var skillValue = st.math.dieN(10);
			st.log(skillKey + ":" + skillValue);
			specSkills[skillKey] += skillValue;
		}

		for (var i=0; i<chances; i++) {
			var key = "otherskills-" + i;
			var $select = $("div select[data-key='" + key + "']");
			var skillKey = $select.val();
			var skillValue = st.math.dieN(10);
			st.log(skillKey + ":" + skillValue);
			specSkills[skillKey] += skillValue;
		}
		
		
		st.skills.maxCheck();
		
		st.character.setAge((20 + st.character.spec.duty) + " years");
		
		st.dialog.hideGreatDuty();
		st.render.renderChar();
		st.gen.nextStep();
	},
	hideGreatDuty: function() {
		st.log("hideGreatDuty");
		
		var $dialog = $(".st-great-duty");
		$dialog.remove();
	},	
	
	/* ADVANCED OFFICERS TRAINING */
	
	dialogAdvancedOfficersTraining: function() {
		st.log("dialogAdvancedOfficersTraining");

		var title = "Advanced Officers Training";
		st.render.renderStatus(title);
		st.character.setAge("25-26 years");
			
		var skills = st.skills.romulanAdvancedOfficersSkills;
		var $dialog = $("<div class=\"st-advanced-officers\"></div>");
		$dialog.append("<h2 class=\"st-advanced-officers-header\">" + title + "</h2>");
		$dialog.append("<span class=\"st-advanced-officers-instructions\">Please select from the choices below:</span>");
		
		var title = "Core Curriculum";
		$dialog.append("<h3>" + title + "</h3>");

		_.each(skills, function(value, key) {
			var dispKey = _.keyToLabel(key);
			var $elm = $("<div class=\"st-skill-div\"></div>");
			var $choice = $("<span class=\"st-key\" data-key=\"" + key + "\">" + dispKey + "</span>");
			var astIndex = key.indexOf("*");
			if (astIndex > -1) {
				var prefix = key.substring(0, astIndex);
				var choices = st.gen.getChoices(key);				
				var $choice = $("<select class=\"st-key\" data-key-prefix=\"" + prefix + "\"></select>");
				$choice.on("change", st.dialog.selectAdvancedOfficersSkill);
				$choice.append("<option value=\"\">Choose a skill</option>");
				_.each(choices, function(choice) {
					var choiceLabel = _.keyToLabel(choice);
					$choice.append("<option value=\"" + choice + "\">" + choiceLabel + "</option>");
				});		
			}
			$elm.append($choice);
			$elm.append("<span class=\"st-value\" data-key=\"" + key + "\">" + value + "</span>");
			$dialog.append($elm);
		});

		// specialty skills
	
		var title = "Specialty Skills";
		$dialog.append("<h3>" + title + "</h3>");

		var specialties = st.character.spec.specialties;
		var main = specialties.main;
		var sub = specialties.sub;
		var skills = st.skills.romulanAdvancedOfficerBroadeningSkills[main][sub];
		
		_.each(skills, function(value, skillKey) {
			var dispKey = _.keyToLabel(skillKey);
			var $skillElm = $("<div class=\"st-skill-div\" data-key=\"" + skillKey + "\"></div>");
			var $choice = $("<span class=\"st-skill-span\" data-key=\"" + skillKey + "\">" + dispKey + "</span>");
			var astIndex = skillKey.indexOf("*");
			if (astIndex > -1) {
				var prefix = skillKey.substring(0, astIndex);
				var choices = st.gen.getChoices(skillKey);				
				var $choice = $("<select class=\"st-skill st-key-select\" data-key=\"" + skillKey + "\" data-key-prefix=\"" + prefix + "\"></select>");
				$choice.on("change", st.dialog.selectAdvancedOfficersSkill);
				$choice.append("<option value=\"\">Choose a skill</option>");
				_.each(choices, function(choice) {
					var choiceLabel = _.keyToLabel(choice);
					$choice.append("<option value=\"" + choice + "\">" + choiceLabel + "</option>");
				});
			}
			$skillElm.append($choice);
			$skillElm.append("<span class=\"st-value\" data-key=\"" + skillKey + "\">" + value + "</span>");
			$dialog.append($skillElm);
		});

		$dialog.append("<div class=\"st-actions\">"
			+ "<button id=\"st-advanced-officers-skip\">Skip Officer's Training</button>"
			+ "<button id=\"st-advanced-officers-ok\" disabled=\"disabled\">OK</button>"
			+ "</div>");

		st.character.$pageft.append($dialog);
		$dialog.hide().fadeIn();
		st.render.renderAge();
		st.dialog.checkAdvancedOfficersActionStatus();
		$("#st-advanced-officers-skip").on("click", st.dialog.actionAdvancedOfficersSkip);
		$("#st-advanced-officers-ok").on("click", st.dialog.actionAdvancedOfficersOk);
	},
	selectAdvancedOfficersSkill: function() {
		st.log("selectAdvancedOfficersSkill");
		
		var $sel = $(this);
		var skill = $sel.val();
		st.log("- skill[" + skill + "]");
		st.dialog.checkAdvancedOfficersActionStatus();
	},
	checkAdvancedOfficersActionStatus: function() {
		st.log("checkAdvancedOfficersActionStatus");

		var sels = $(".st-advanced-officers select");
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
			$("#st-advanced-officers-ok").removeAttr("disabled");
		} else {
			st.log("- ng");
			$("#st-advanced-officers-ok").attr("disabled", "disabled");
		}
	},
	actionAdvancedOfficersSkip: function() {
		st.log("actionAdvancedOfficersSkip");
		
		st.character.spec.advancedOfficers = false;
	
		st.dialog.hideAdvancedOfficers();
		st.render.renderChar();
		st.gen.nextStep();
	},
	actionAdvancedOfficersOk: function() {
		st.log("actionAdvancedOfficersOk");
		
		var spec = st.character.spec;
		var specSkills = spec.skills;
		
		st.character.spec.advancedOfficers = true;

		var skills = $(".st-skill-span, select.st-key-select");
		for (var i=0; i<skills.length; i++) {
			var $skill = $(skills[i]);
			var key = $skill.data("key");
			var $valueElem = $(".st-advanced-officers .st-value[data-key='" + key + "']");
			var value = parseInt($valueElem.html(),10);
			var astIndex = key.indexOf("*");
			if (astIndex > -1) {
				var prefix = key.substring(0, astIndex);
				key = $skill.val();
			}
			st.log(key + ":" + value);
			specSkills[key] += value;
		}

		st.skills.maxCheck();
		st.dialog.hideAdvancedOfficers();
		st.render.renderChar();
		st.gen.nextStep();
	},
	hideAdvancedOfficers: function() {
		st.log("hideAdvancedOfficers");
		
		var $dialog = $(".st-advanced-officers");
		$dialog.remove();
	},
	
	/* TOUR NUMBER */
	
	dialogTourNumber: function() {
		st.log("dialogTourNumber");

		var title = "Tour Number";
		st.render.renderStatus(title);
		var age = 25;
		age += st.character.spec.advancedOfficers ? 1 : 0;

		st.character.setAge(age + " years");
			
		var $dialog = $("<div class=\"st-tour-number\"></div>");
		$dialog.append("<h2 class=\"st-tour-number-header\">" + title + "</h2>");
		$dialog.append("<span class=\"st-tour-number-instructions\">Please select a destined rank rom the choices below:</span>");
		
		var ranks = st.ranks;
		var $choice = $("<select class=\"st-key\" data-key=\"tour-number\"></select>");
		$choice.on("change", st.dialog.selectTourNumber);
		$choice.append("<option value=\"\">Choose a destined rank</option>");
		_.each(ranks, function(value, key) {
			var choiceLabel = _.keyToLabel(key) + ": +" + value.tourMod + " tours";
			$choice.append("<option value=\"" + key + "\">" + choiceLabel + "</option>");
		});
		$dialog.append($choice)
		
		$dialog.append("<div class=\"st-actions\"><button id=\"st-tour-number-ok\" disabled=\"disabled\">OK</button></div>");

		st.character.$pageft.append($dialog);
		$dialog.hide().fadeIn();
		
		st.render.renderAge();
		$("#st-tour-number-ok").on("click", st.dialog.actionTourNumberOk);
	},
	selectTourNumber: function() {
		st.log("selectTourNumber");
		
		var $sel = $(this);
		var skill = $sel.val();
		st.log("- skill[" + skill + "]");
		st.dialog.checkTourNumberActionStatus();
	},
	checkTourNumberActionStatus: function() {
		st.log("checkTourNumberActionStatus");

		var sels = $(".st-tour-number select[data-key='tour-number']");
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
			$("#st-tour-number-ok").removeAttr("disabled");
		} else {
			st.log("- ng");
			$("#st-tour-number-ok").attr("disabled", "disabled");
		}
	},
	actionTourNumberOk: function() {
		st.log("actionTourNumberOk");
		
		var spec = st.character.spec;
		var $skills = $("select[data-key='tour-number']");
		var rankKey = $skills.val();
		var attrMod = 0;
		var int = st.character.spec.attributes.int;
		var luc = st.character.spec.attributes.luc;
		if (spec.int >= 60) {
			attrMod -= 1;
		}
		if (spec.luc <= 30) {
			attrMod += 1;
		}
		st.log("attrMod[" + attrMod + "]");
		var tourMod = st.ranks[rankKey].tourMod;
		st.log("tourMod[" + tourMod + "]");
		var tourRoll = Math.ceil(st.math.dieN(10) / 3.0);
		st.log("tourRoll[" + tourRoll + "]");
		var tourNumber = tourRoll + tourMod + attrMod;
		st.log("tourNumber[" + tourNumber + "]");
		
		spec.destinedRankKey = rankKey;
		spec.tourNumber = tourNumber;

		st.dialog.hideTourNumber();
		st.render.renderChar();
		st.gen.nextStep();
	},
	hideTourNumber: function() {
		st.log("hideTourNumber");
		
		var $dialog = $(".st-tour-number");
		$dialog.remove();
	}
};