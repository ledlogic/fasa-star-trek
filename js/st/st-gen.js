/* st-gen.js */

/*
 * Utility methods for character generation 
 */
st.gen = {
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
		if (str >= 01 && str <= 25) {
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
		
		var spec = {};
		st.character.spec = spec;
		
		spec.overview = {};
		spec.overview["name"] = "";
		spec.overview["rank"] = "";
		spec.overview["assignment"] = "";
		spec.overview["ship"] = "";
		spec.overview["position"] = "";
		spec.overview["searchName"] = "";

		spec.demographics = {};
		spec.demographics["sex"] = "";
		spec.demographics["race"] = race;
	
		st.gen.genAttributes();
		
		spec.endurance = {};
		
		spec.skills = {};
			var skills0 = {};
			skills0["administration"] = "";
			skills0["artistic-expression"] = "";
			skills0["carousing"] = "";
			skills0["communication-systems-operation"] = "";
			skills0["communication-systems-technology"] = "";
			skills0["computer-operation"] = "";
			skills0["computer-technology"] = "";
			skills0["damage-control-procedures"] = "";
			skills0["deflector-shield-operation"] = "";
			skills0["deflector-shield-technology"] = "";
			skills0["electronics-technology"] = "";
			skills0["environmental-suit-operation"] = "";
			skills0["gaming"] = "";
			skills0["instruction"] = "";
			skills0["language-1-fast-talk"] = "";
			skills0["language-2-forgery"] = "";
			skills0["language-3-linguistics"] = "";
			skills0["language-4-pick-pocket"] = "";
			skills0["language-5-recon"] = "";
			skills0["language-6-stealth"] = "";
			skills0["leadership"] = "";
			skills0["life-sciences-1-"] = "";
			skills0["life-sciences-2-agriculture"] = "";
			skills0["life-sciences-3-biology"] = "";
			skills0["life-sciences-4"] = "";
			skills0["life-sciences-5"] = "";
			skills0["life-sciences-6"] = "";
			skills0["life-support-syst-technology"] = "";
			skills0["marksmanship-archaic-firearms"] = "";
			spec.skills["0"] = skills0;
			
			var skills1 = {};
			skills1["marksmanship-modern-weapon"] = "";
			skills1["mechanical-engineering"] = "";
			skills1["medical-sciences-1-"] = "";
			skills1["medical-sciences-2-human"] = "";
			skills1["medical-sciences-3-psychology-human"] = "";
			skills1["medical-sciences-4-surgery"] = "";
			skills1["medical-sciences-5-telepathy"] = "";
			skills1["medical-sciences-6-"] = "";
			skills1["negotiation-diplomacy"] = "";
			skills1["personal-combat-armed"] = "";
			//skills1["personal-combat-thrown"] = "";
			skills1["personal-combat-unarmed"] = "";
			skills1["personal-weapons-technology"] = "";
			skills1["physical-sciences-1-chemistry"] = "";
			skills1["physical-sciences-2-mathematics"] = "";
			skills1["physical-sciences-3-physics"] = "";
			skills1["physical-sciences-4-"] = "";
			skills1["planetary-sciences-1-geology"] = "";
			skills1["planetary-sciences-2-mining"] = "";
			skills1["planetary-sciences-3"] = "";
			skills1["planetary-sciences-4"] = "";
			skills1["planetary-survival-1-General"] = "";
			skills1["planetary-survival-2-"] = "";
			skills1["planetary-survival-3-"] = "";
			skills1["planetary-survival-4-"] = "";
			skills1["security-procedures"] = "";
			skills1["shuttlecraft-pilot"] = "";
			skills1["shuttlecraft-systems-technology"] = "";
			skills1["small-equipment-systems-operation"] = "";
			skills1["small-equipment-systems-technology"] = "";
			spec.skills["1"] = skills1;
			
			var skills2 = {};			
			skills2["small-unit-tactics"] = "";
			skills2["social-sciences-1-"] = "";
			skills2["social-sciences-2-anthropology"] = "";
			skills2["social-sciences-3-economics"] = "";
			skills2["social-sciences-4-political-science"] = "";
			skills2["social-sciences-5-"] = "";
			skills2["social-sciences-6-"] = "";
			skills2["social-sciences-7-federation-history"] = "";
			skills2["social-sciences-8-federation-law"] = "";
			skills2["space-sciences-1-astrogation"] = "";
			skills2["space-sciences-2-astronomy"] = "";
			skills2["space-sciences-3-astronautics"] = "";
			skills2["space-sciences-4-astrophysics"] = "";
			skills2["space-sciences-5"] = "";
			skills2["sports-1-swim"] = "";
			skills2["starship-combat-strategy-tactics"] = "";
			skills2["starship-helm-operation"] = "";
			skills2["starship-sensors"] = "";
			skills2["starship-weaponry-operation"] = "";
			skills2["starship-weaponry-technology"] = "";
			skills2["streetwise"] = "";
			skills2["transporter-operation-procedures"] = "";
			skills2["transporter-systems-technology"] = "";
			skills2["trivia-1-disguise"] = "";
			skills2["trivia-2-heavy-weapons"] = "";
			skills2["trivia-3-hide"] = "";
			skills2["vehicle-operation-1-ground"] = "";
			skills2["warp-drive-technology"] = "";
			skills2["zero-g-operations"] = "";
			spec.skills["2"] = skills2;
		
		st.gen.genWeapons();
		
		console.log(st.character.spec);
				
		setTimeout(st.render.renderChar, 10);
	},
	
	genAttributes: function() {
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
	}
};