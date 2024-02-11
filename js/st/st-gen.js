/* st-gen.js */

/*
 * Utility methods for character generation 
 */
st.gen = {
	step: -1,
	steps: [],
	
	init: function() {
		st.log("init gen");
	},
	genWeapons: function() {
		try {
			var spec = st.character.spec;
			
			var str = spec.attributes["str"];
			var dex = spec.attributes["dex"];
			var unarmed = skills1["personal-combat-unarmed"];
				
			spec.tohits = {
				"modern": st.gen.charAverageStat(dex, skills1["marksmanship-modern-weapon"]),
				"hth": st.gen.charAverageStat(dex, unarmed),
				"bareDamage": st.gen.genBareHandDamage(str, unarmed)
			};
		} catch (e) {
		}
	},
	genBareHandDamage: function(str, unarmed) {
		var die = 0;
		var mod = 0;
		if (str >= 1 && str <= 25) {
			die = 1;
			mod = -3;  
		} else if (str >= 26 && str <= 50) {
			die = 1;
		} else if (str >= 51 && str <= 75) {
			die = 1;
			mod = 3;  
		} else if (str >= 76 && str <= 100) {
			die = 2;
			mod = -3;  
		} else if (str >= 101 && str <= 125) {
			die = 2;
		} else if (str >= 126 && str <= 150) {
			die = 2;
			mod = 3;  
		}
		mod += Math.floor(unarmed / 10);
		return die + "D10" + (mod < 0 ? mod : "") + (mod > 0 ? "+" + mod : "");
	},
	genRomulan: function(race) {
		st.log("gen romulan");
		
		var spec = st.character.spec;
		
		spec.overview = {
			"name": "",
			"rank": "",
			"assignment": "",
			"ship": "",
			"position": ""
		};
	
		st.gen.genDemographics(race);
		st.gen.genAttributes();
		st.gen.genSkills();
		st.gen.genWeapons();
		
		//console.log(st.character.spec);
		
		setTimeout(st.render.hideNav, 10);
		setTimeout(st.render.renderChar, 10);
		
		st.gen.step = -1;
		st.gen.steps = [
			//"dialogBeginning",
			//"dialogBeginningElectives",
			//"dialogTheBroadening",
			//"dialogBroadeningElectives",
			//"dialogBroadeningAdvancedTraining",
			//"dialogComingTogether",
			//"dialogComingTogetherAdvancedTraining",
			//"dialogComingTogetherOutside",
			//"dialogGreatDuty1",
			//"dialogGreatDuty2",
			//"dialogGreatDuty3",
			//"dialogGreatDuty4",
			//"dialogGreatDuty5",
			//"dialogAdvancedOfficersTraining",
			//"dialogTourNumber",
		];
		st.gen.nextStep();
	},
	
	nextStep: function() {
		st.log("nextStep");
		
		st.gen.step++;
		var step = st.gen.step; 
		st.log("step[" + step + "]");
		var max = st.gen.steps.length;
		if (step >= max) {
			//renderComplete();
		} else { 
			var method = "st.dialog." + st.gen.steps[step] + "()";
			st.log("method[" + method + "]");
			setTimeout(method, 1500);
		}
	},
	
	genDemographics: function(race) {
		st.log("genDemographics");
		var spec = st.character.spec;
		var demographics = spec.demographics;

		demographics["age"] = "0 years";
		
		var sex = st.math.die(1,2,-1) == 0 ? "male" : "female";
		demographics.sex = sex;
		
		demographics["race"] = race;
	},
	
	genAttributes: function() {
		st.log("genAttributes");
		var spec = st.character.spec;
		spec.attributes = {};
				
		// roll 3D10
		var allAttributes = st.character.allAttributes;
		var baseAttributes = st.character.baseAttributes;
		for (var i=0;i<allAttributes.length;i++) {
			var attribute = allAttributes[i];
			spec.attributes[attribute] = st.math.die(3, 10, baseAttributes[attribute]);
		}
		console.log("base, attributes[" + JSON.stringify(baseAttributes) + "]");
		console.log("initial, attributes[" + JSON.stringify(spec.attributes) + "]");
		
		var race = spec.demographics["race"];
		var racialAdjustments = st.character.mod[race];
		for (var i=0;i<allAttributes.length;i++) {
			var attribute = allAttributes[i];
			spec.attributes[attribute] = Math.max(1, spec.attributes[attribute] + racialAdjustments[attribute]);
		}		
		console.log("race, adjustments[" + race + "]");
		console.log("racial, adjustments[" + JSON.stringify(racialAdjustments) + "]");
		console.log("post racial, attributes[" + JSON.stringify(spec.attributes) + "]");
		
		// bonus points may be added to any attribute except psi.
		var bonusPoints = Math.round(0.5 * st.math.die(1, 100, 0));
		var remainingPoints = bonusPoints;
		var bonusAttributes = ["str", "end", "int", "dex", "cha", "luc"];
		var shuffledAttributes = _.shuffle(bonusAttributes);
		
		// no more than 30 points may be added to one attribute.
		var appliedBonuses = {};
		for (var i=0;i<bonusAttributes.length;i++) {
			var bonusAttribute = bonusAttributes[i];
			appliedBonuses[bonusAttribute] = 0;
		}	
		
		while (remainingPoints > 0) {
			for (var i=0; (i<bonusAttributes.length) && (remainingPoints>0); i++) {
				var shuffledAttribute = shuffledAttributes[i];
				
				// no more than 30 points may be added to one attribute.
				var currentAppliedBonus = appliedBonuses[shuffledAttribute];
				var bonus = Math.min(st.math.die(1, remainingPoints, 0), 30 - currentAppliedBonus);
				
				// no attribute may be adjusted to more than 99 by using bonus points.
				bonus = Math.min(bonus, 99-spec.attributes[shuffledAttribute]);
				bonus = Math.max(bonus, 0);				
				spec.attributes[shuffledAttribute] += bonus;
				appliedBonuses[shuffledAttribute] += bonus;
				remainingPoints -= bonus;
			};
		}
		
		console.log("bonus[" + bonusPoints + "]");
		console.log("applied[" + JSON.stringify(appliedBonuses) + "]");
		console.log("after, attributes[" + JSON.stringify(spec.attributes) + "]");
	},
	
	genSkills: function() {
		var spec = st.character.spec;
		spec.skills = JSON.parse(JSON.stringify(st.skills.baseSkills));
	},
	
	getChoices: function(key) {
		var ret = [];
		var trimmedKey = key.split("*")[0];
		st.log("key[" + key + "]");
		st.log("trimmedKey[" + trimmedKey + "]");
		
		if (!trimmedKey) {
			var two = key.split("*")[1];
			st.log("two[" + two + "]");
			
			var skillKeys = _.keys(st.skills.baseSkills);
			_.each(skillKeys, function(skill) {
				if (skill.indexOf(two) > -1 && skill.indexOf("medical") === -1) {
					ret.push(skill);
				}				
			});
		} else {
			var skillKeys = _.keys(st.skills.baseSkills);
			_.each(skillKeys, function(skill) {
				if (skill.indexOf(trimmedKey) === 0) {
					ret.push(skill);
				}
			});
		}
		return ret;
	}
};