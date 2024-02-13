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
		var spec = st.character.spec;
		
		var str = spec.attributes["str"];
		var dex = spec.attributes["dex"];
		var dsSkill = spec.skills["personal-combat-armed:-dueling-stick"];
		var unarmedSkill = spec.skills["personal-combat-unarmed"];
		var modernSkill = spec.skills["marksmanship-modern"];
		var modern = st.math.averageUp(dex, modernSkill);
		var hth = st.math.averageUp(dex, unarmedSkill);
		var ds = st.math.averageUp(dex, dsSkill);
		var bare = st.gen.genBareHandDamage(str, unarmedSkill);
		
		console.log("str[" + str + "]");
		console.log("dex[" + dex + "]");
		console.log("unarmedSkill[" + unarmedSkill + "]");
		console.log("modernSkill[" + modernSkill + "]");
		console.log("modern[" + modern + "]");
		console.log("hth[" + hth + "]");
		console.log("ds[" + ds + "]");
		console.log("bare[" + bare + "]");
					
		spec.tohits = {
			"modern": modern,
			"hth": hth,
			"ds": ds,
			"bare": bare
		};
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
		mod += Math.floor(unarmed / 10.0);
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
		
		st.gen.step = -1;
		st.gen.steps = [
			"dialogAttributes",
			"dialogBeginning",
			"dialogBeginningElectives",
			"dialogTheBroadening",
			"dialogBroadeningElectives",
			"dialogBroadeningAdvancedTraining",
			"dialogComingTogether",
			"dialogComingTogetherAdvancedTraining",
			"dialogComingTogetherOutside",
			"dialogGreatDuty1",
			"dialogGreatDuty2",
			"dialogGreatDuty3",
			"dialogGreatDuty4",
			"dialogGreatDuty5",
			"dialogAdvancedOfficersTraining",
			"dialogTourNumber",
			"dialogTours",
			"dialogCleanup"
		];
		
		setTimeout(st.render.hideNav, 10);
		setTimeout(st.render.renderChar, 10);
		setTimeout(st.gen.nextStep(), 100);
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
		spec.attributes["luc"] = st.math.dieN(100);
		spec.attributes["psi"] = st.math.dieN(100);
		
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
		st.log("genSkills");
		
		var spec = st.character.spec;
		spec.skills = JSON.parse(JSON.stringify(st.skills.baseSkills));
	},
	
	getChoices: function(key) {
		st.log("genChoices");
		
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
	},
	
	genTourOer: function() {
		st.log("genTourOer");

		var oer = st.math.dieN(100) + 10;
		st.log("oer0[" + oer + "]");

		// adjustments
		oer += st.gen.genTourOerIntMod();
		oer += st.gen.genTourOerLucMod();
		
		st.log("oer1[" + oer + "]");

		oer = st.math.ensureRange(oer, 0, 99);
		
		st.log("oer2[" + oer + "]");
	
		return oer;
	},
	
	genTourOerIntMod: function() {
		var attributes = st.character.spec.attributes;
		var int = attributes.int;
		var ret = 0;
		if (int >= 70) {
			ret = 10;
		} else if (int >= 60) {
			ret = 5;
		} else if (int <= 40) {
			ret = -5;
		}
		return ret;
	},
	
	genTourOerLucMod: function() {
		var attributes = st.character.spec.attributes;
		var luc = attributes.luc;
		var ret = 0;
		if (luc >= 60) {
			ret = 10;
		} else if (luc >= 50) {
			ret = 5;
		} else if (luc <= 30) {
			ret = -5;
		}
		return ret;
	},
	
	genPostTrainingAge: function() {
		st.log("genPostTrainingAge");
		
		var spec = st.character.spec;

		// otherside, training age
		var age = 25;
		
		// add advanced officers
		var advancedOfficers = spec.advancedOfficers;
		st.log("advancedOfficers[" + advancedOfficers + "]");
		age += advancedOfficers ? 1 : 0;
		st.log("age0[" + age + "]");

		// if tours, max age is from tours.		
		var tours = spec.tours;
		_.each(tours, function(tour) {
			var len = tour.tourLength;
			if (len) {
				st.log("len[" + len + "]");
				age += len;
			}			
		});
		
		st.log("age1[" + age + "]");
		return age;
	},
	
	genLastTermDuty: function() {
		st.log("genLastTermDuty");
		
		var spec = st.character.spec;
		var terms = spec.terms;
		st.logObj("terms", terms);
		
		// fault-tolerance for jump-testing
		if (!terms || !terms.length) {
			return -1;
		}
		
		var term = terms[terms.length - 1];
		st.logObj("term", term);
		var termDuty = term.termDuty;
		st.log("termDuty[" + termDuty + "]");
		return termDuty;
	},
	
	genTourSkillRollsIntMod: function() {
		var spec = st.character.spec;
		var attributes = spec.attributes;
		var int = attributes.int;
		var ret = 0;
		if (int >= 70) {
			ret = 2;
		} else if (int >= 60) {
			ret = 1;
		}
		return ret;
	},
	
	genTourSkillRollsLucMod: function() {
		var spec = st.character.spec;
		var attributes = spec.attributes;
		var luc = attributes.luc;
		var ret = 0;
		if (luc >= 60) {
			ret = 1;
		} 
		return ret;
	},
	
	genTourDuty: function(tour) {
		st.log("genTourDuty");
		st.log("tour[" + tour + "]");
		
		var spec = st.character.spec;
		var tours = spec.tours;
		st.logObj("tours", tours);
		if (!tours) {
			return -1;
		}
		st.logObj("tours.length[" + tours.length + "]");
		if (tours.length<tour) {
			return -1;
		}
		var tourObj = tours[tour];
		st.logObj("tourObj", tourObj);
		if (!tourObj) {
			return -1;
		}
		
		var ret = tourObj.duty;
		st.log("ret[" + ret + "]");
		return ret;
	},
	
	genTourDutyLength: function(tour) {
		st.log("genTourDutyLength");
		st.log("tour[" + tour + "]");

		var spec = st.character.spec;
		var tours = spec.tours;
		st.logObj("tours", tours);
		if (!tours) {
			return -1;
		}
		st.logObj("tours.length[" + tours.length + "]");
		if (tours.length<tour) {
			return -1;
		}
		var tourObj = tours[tour];
		st.logObj("tourObj", tourObj);
		if (!tourObj) {
			return -1;
		}
		
		var ret = -1;
		ret = tourObj.tourLength;
		st.log("ret[" + ret + "]");
		return ret;
	},
	
	genTourDutyOer: function(tour) {
		st.log("genTourDutyLength");
		st.log("tour[" + tour + "]");

		var spec = st.character.spec;
		var tours = spec.tours;
		st.logObj("tours", tours);
		if (!tours) {
			return 0;
		}
		st.logObj("tours.length[" + tours.length + "]");
		if (tours.length<tour) {
			return 0;
		}
		var tourObj = tours[tour];
		st.logObj("tourObj", tourObj);
		if (!tourObj) {
			return 0;
		}
		
		var ret = 0;
		ret = tourObj.oer;
		st.log("ret[" + ret + "]");
		return ret;
	},
	
	genNextTourDuty: function() {
		st.log("genNextTourDuty");
		
		var spec = st.character.spec;
		var tours = spec.tours;
		st.logObj("tours", tours);
		
		// fault-tolerance for jump-testing
		if (!tours || !tours.length) {
			return 0;
		}
		
		var tour = tours[tours.length - 2];
		st.logObj("tour", tour);

		var lastTourDuty = tour.duty;
		st.log("lastTourDuty[" + lastTourDuty + "]");
		
		var tourDuty = lastTourDuty; 
		st.log("tourDuty0[" + tourDuty + "]");

		var oer = tour.oer;
		st.log("oer[" + oer + "]");

		if (tour.oer < 50) {
			tourDuty = st.gen.genTermDutyAssignment();
		}
		st.log("tourDuty1[" + tourDuty + "]");

		return tourDuty;
	},
	
	genTermDutyAssignment: function() {
		st.log("genTermDutyAssignment");
		
		var roll = st.math.dieN(100);
		st.log("roll0[ "+ roll + "]");

		var mod = st.gen.genAssignmentLucMod();
		roll += mod;
		st.log("roll1[ "+ roll + "]");
		
		var duty = 0;
		if (roll >= 61) {
			duty = 0;
		} else if (roll >= 36) {
			duty = 1;
		} else if (roll >= 16) {
			duty = 2;
		} else {
			duty = 3;
		}
		
		st.log("duty[ "+ duty + "]");
		
		return duty;
	},
	
	genAssignmentLucMod: function() {
		st.log("genAssignmentLucMod");
		
		var spec = st.character.spec;
		var attributes = spec.attributes;
		var luc = attributes.luc;
		var ret = 0;
		if (luc >= 60) {
			ret = -10;
		} else if (luc >= 50) {
			ret = -5;
		} else if (luc <= 30) {
			ret = 5;
		}
		st.log("ret[" + ret + "]");
		return ret;
	},

};