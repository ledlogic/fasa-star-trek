st.dialog = {

	/* BEGINNING */

	dialogBeginning: function() {
		console.log("dialogBeginning");

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
		st.skills.maxCheck();
		st.dialog.hideBeginning();
		st.render.renderChar();
		st.dialog.dialogBeginningElectives();
	},
	hideBeginning: function() {
		console.log("hideBeginning");
		
		var $dialog = $(".st-beginning");
		$dialog.remove();
	},
	
	/* BEGINNING ELECTIVES */

	dialogBeginningElectives: function() {
		console.log("dialogBeginningElectives");

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
		console.log("actionBeginningElectivesOk");
		
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
			var mainSpecialty = key;
			var dispCategory = _.keyToLabel(key);
			var $elm = $("<div class=\"st-key-div\" data-key=\"" + key + "\"></div>");
			
			_.each(category, function(skills, specialty) {
				//console.log([category, specialty, skills]);
				
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
		$("#st-broadening-ok").on("click", st.dialog.actionBroadeningOk);
	},
	actionBroadeningOk: function() {
		console.log("actionBroadeningOk");
		
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
		st.dialog.dialogBroadeningElectives();
	},
	hideBroadening: function() {
		console.log("hideBroadening");

		var $dialog = $(".st-broadening");
		$dialog.remove();
	},
	checkBroadeningActionStatus: function() {
		console.log("checkBroadeningActionStatus");
		
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
		st.skills.maxCheck();
		st.dialog.hideBroadeningElectives();
		st.render.renderChar();
		st.dialog.dialogBroadeningAdvancedTraining();
	},
	
	hideBroadeningElectives: function() {
		console.log("hideBroadeningElectives");

		var $dialog = $(".st-broadening-electives");
		$dialog.remove();
	},
	
	/* BROADENING ADVANCED TRAINING */

	dialogBroadeningAdvancedTraining: function() {
		console.log("dialogBroadeningAdvancedTraining");

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
		st.render.renderAge();
		
		$("#st-advanced-training-ok").on("click", st.dialog.actionBroadeningAdvancedTrainingOk);
	},
	
	selectBroadeningAdvancedTrainingSkill: function() {
		console.log("selectBroadeningAdvancedTrainingSkill");

		var $sel = $(this);
		var skill = $sel.val();
		st.log("- skill[" + skill + "]");
		st.dialog.checkBroadeningAdvancedTrainingActionStatus();
	},
	
	actionBroadeningAdvancedTrainingOk: function() {
		console.log("actionBroadeningAdvancedTrainingOk");
		
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
		st.dialog.dialogComingTogether();
	},
	
	hideBroadeningAdvancedTraining: function() {
		console.log("hideBroadeningAdvancedTraining");

		var $dialog = $(".st-advanced-training");
		$dialog.remove();
	},
	
	checkBroadeningAdvancedTrainingActionStatus: function() {
		console.log("checkBroadeningAdvancedTrainingActionStatus");
		
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
		console.log("dialogComingTogether");

		var title = "The Coming Together of Knowledge";
		st.render.renderStatus(title);
		st.character.setAge("15-20 years");
			
		var skills = st.skills.romulanComingTogetherSkills;
		var $beginning = $("<div class=\"st-coming-together\"></div>");
		$beginning.append("<h2 class=\"st-coming-together-header\">" + title + "</h2>");
		$beginning.append("<span class=\"st-coming-together-instructions\">Please select from the choices below:</span>");
		_.each(skills, function(value, key) {
			var dispKey = _.keyToLabel(key);
			var $elm = $("<span class=\"st-focus-div\">" + dispKey + "</span>");
			$beginning.append($elm);
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
				$beginning.append($elm);
			});
		});
		$beginning.append("<div class=\"st-actions\"><button id=\"st-coming-together-ok\" disabled=\"disabled\">OK</button></div>");

		st.character.$pageft.append($beginning);
		st.render.renderAge();
		
		$("#st-coming-together-ok").on("click", st.dialog.actionComingTogetherOk);
	},
	selectComingTogetherSkill: function(skill) {
		console.log("selectComingTogetherSkill");
		
		var $sel = $(this);
		var skill = $sel.val();
		st.log("- skill[" + skill + "]");
		st.dialog.checkComingTogetherActionStatus();
	},
	checkComingTogetherActionStatus: function() {
		console.log("checkComingTogetherActionStatus");

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
		console.log("actionComingTogetherOk");
		
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
		st.dialog.dialogComingTogetherAdvancedTraining();
	},
	hideComingTogether: function() {
		console.log("hideComingTogether");
		
		var $dialog = $(".st-coming-together");
		$dialog.remove();
	},
	
	/* ADVANCED TRAINING IN SPECIALTY */
	
	dialogComingTogetherAdvancedTraining: function() {
		console.log("dialogComingTogetherAdvancedTraining");

		var title = "Coming Together: Advanced Training";
		st.render.renderStatus(title);
		st.character.setAge("15-20 years");
		
		var electiveValue = "1d10";
			
		var specialties = st.character.spec.specialties;
		var main = specialties.main;
		var sub = specialties.sub;
		var skills = st.skills.romulanBroadeningSkills[main][sub];
		skills = st.skills.removeDuplicates(skills);
		st.log("skills[" + skills + "]");
		
		var $electives = $("<div class=\"st-coming-together-advanced-training\"></div>");
		$electives.append("<h2 class=\"st-coming-together-advanced-training-header\">" + title + "</h2>");
		$electives.append("<span class=\"st-coming-together-advanced-training-instructions\">Please select three skills that you have:</span>");
		
		var int = st.character.spec.attributes.int;
		st.log("int[" + int + "]");
		var chances = 10 + Math.floor(Math.max(0, int - 50) / 10);
		st.log("chances[" + chances + "]");
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
		st.render.renderAge();
		
		$("#st-coming-together-advanced-training-ok").on("click", st.dialog.actionComingTogetherAdvancedTrainingOk);
	},
	
	selectComingTogetherAdvancedTrainingSkill: function() {
		console.log("selectComingTogetherAdvancedTrainingSkill");

		var $sel = $(this);
		var skill = $sel.val();
		st.log("- skill[" + skill + "]");
		st.dialog.checkComingTogetherAdvancedTrainingActionStatus();
	},
	
	actionComingTogetherAdvancedTrainingOk: function() {
		console.log("actionComingTogetherAdvancedTrainingOk");
		
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
		//st.dialog.dialogComingTogether();
	},
	
	hideComingTogetherAdvancedTraining: function() {
		console.log("hideComingTogetherAdvancedTraining");

		var $dialog = $(".st-coming-together-advanced-training");
		$dialog.remove();
	},
	
	checkComingTogetherAdvancedTrainingActionStatus: function() {
		console.log("checkComingTogetherAdvancedTrainingActionStatus");
		
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
	}

};