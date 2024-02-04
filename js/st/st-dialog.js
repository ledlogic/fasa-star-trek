st.dialog = {

	/* THE BEGINNING */

	dialogTheBeginning: function() {
		console.log("dialogTheBeginning");

		var title = "The Beginning";
		st.render.renderStatus(title);
		st.character.demographics.age = "0-5";
		st.render.renderAge();
			
		var skills = st.skills.romulanBeginningSkills;
		var $beginning = $("<div class=\"st-beginning\"></div>")
		$beginning.append("<h2 class=\"st-beginning-header\">" + title + "</h2>")
		$beginning.append("<span class=\"st-beginning-instructions\">Please select from the choices below:</span>")
		_.each(skills, function(value, key) {
			var dispKey = _.keyToLabel(key);
			var $elm = $("<div></div>");
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
		$beginning.append("<div class=\"st-actions\"><button id=\"st-beginning-ok\" disabled>OK</button></div>");

		st.character.$pageft.append($beginning);
		st.character.demographics.age = 5;
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
		
		st.dialog.dialogChar();
		st.dialog.dialogTheBeginningElectives();
	},
	hideBeginning: function() {
		console.log("hideBeginning");
		
		var $beginning = $(".st-beginning");
		$beginning.remove();
	},
	
	/* THE BEGINNING - electives */

	dialogTheBeginningElectives: function() {
		console.log("dialogTheBeginningElectives");

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
			var dispKey = _.keyToLabel(key);
			var $elm = $("<div class=\"st-key-div\" data-key=\"" + key + "\"></div>");
			var $checkbox = $("<input type=\"checkbox\" class=\"st-checkbox\" data-key=\"" + key + "\" />")
			$checkbox.on("click", st.dialog.actionBeginningElectivesCheckbox);
			$elm.append($checkbox);
			var $choice = $("<span class=\"st-key st-key-span st-disabled\" data-key=\"" + key + "\">" + dispKey + "</span>");
			var astIndex = key.indexOf("*");
			if (astIndex > -1) {
				var prefix = key.substring(0, astIndex);
				var choices = st.gen.getChoices(key);				
				var $choice = $("<select class=\"st-key st-key-select st-disabled\" disabled=\"disabled\" data-key=\"" + key + "\" data-key-prefix=\"" + prefix + "\"></select>");
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
		$beginning.append("<div class=\"st-actions\"><button id=\"st-beginning-ok\" disabled>OK</button></div>");

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
		st.dialog.dialogChar();

		st.dialog.dialogTheBroadening();
	},
	hideBroadening: function() {
		console.log("hideBroadening");

		var $broadening = $(".st-broadening");
		$broadening.remove();
	},
	actionBeginningElectivesCheckbox: function() {
		console.log("actionBeginningElectivesCheckbox");

		st.dialog.checkBroadeningActionStatus();
	},
	
	/* THE BROADENING */

	dialogTheBroadening: function() {
		console.log("dialogTheBroadening");

		var title = "The Broadening";
		st.render.renderStatus(title);
			
		var categories = st.skills.romulanBroadeningSkills;
			
		var $broadening = $("<div class=\"st-broadening\"></div>");
		$broadening.append("<h2 class=\"st-broadening-header\">" + title + "</h2>");
		$broadening.append("<span class=\"st-broadening-instructions\">Please choose a focus from the broadening selections below:</span>")
		
		_.each(categories, function(value, key) {
			var category = value;
			var dispCategory = _.keyToLabel(key);
			var $elm = $("<div class=\"st-key-div\" data-key=\"" + key + "\"></div>");
			
			_.each(category, function(specialtySkills, specialty) {
				console.log([category, specialty, specialtySkills]);
				
				var dispSpecialty = _.keyToLabel(specialty);
				var $specialtyElm = $("<div class=\"st-specialty-div\" data-key=\"" + specialty + "\"></div>");
				var $checkbox = $("<input type=\"checkbox\" class=\"st-checkbox\" data-key=\"" + specialty + "\" />")
				$checkbox.on("click", st.dialog.actionBroadeningCheckbox);
				$specialtyElm.append($checkbox);
				var $choice = $("<span class=\"st-key st-key-span st-disabled\" data-key=\"" + specialty + "\">" + dispCategory + ":" + dispSpecialty + "</span>");
				$specialtyElm.append($choice);
				
				$elm.append($specialtyElm);
			});
			
			$broadening.append($elm);
		});
		$broadening.append("<div class=\"st-actions\"><button id=\"st-broadening-ok\" disabled>OK</button></div>");

		st.character.$pageft.append($broadening);
		
		$("#st-broadening-ok").on("click", st.dialog.actionBroadeningOk);
	},
	actionBroadeningOk: function() {
		console.log("actionBroadeningOk");
	},
	checkBroadeningActionStatus: function() {
		console.log("checkBroadeningActionStatus");
		
		$(".st-key-span, .st-key-select, .st-value").not(".st-disabled").addClass("st-disabled");
		$(".st-key-select").attr("disabled", "disabled");
		
		var $cbs = $(".st-broadening .st-checkbox:checked");
		var cbsCount = $cbs.length;
		st.log("cbsCount[" + cbsCount + "]");
		
		var selCount = 0;
		_.each($cbs, function(cb) {
			var key = $(cb).data("key");
			var $keys = $(".st-key-span[data-key='" + key + "'], .st-key-select[data-key='" + key + "'], .st-value[data-key='" + key + "']");
			window.setTimeout(function() {
				$keys.removeClass("st-disabled");
			}, 10);		
			
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

		st.dialog.checkBroadeningActionStatus();
		
		$(".st-key-span").not(".st-disabled").addClass("st-disabled");
	}
};