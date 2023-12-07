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
	genRomulan: function(allegiance) {
		st.log("gen romulan");
		
		var spec = {};
		st.character.spec = spec;
		
		spec.allegiance = allegiance;
		spec.overview = {};
		spec.overview["name"] = "";
		spec.overview["rank"] = "";
		spec.overview["assignment"] = "";
		spec.overview["ship"] = "";
		spec.overview["position"] = "";
		spec.overview["searchName"] = "";

		spec.demographics = {};
		spec.demographics["sex"] = "";
		spec.demographics["race"] = allegiance;
		
		var baseMap = st.character.charMapStrStatBetweenBases;
		spec.attributes = {};
		spec.attributes["str"] = 40;
		spec.attributes["end"] = 40;
		spec.attributes["int"] = 40;
		spec.attributes["dex"] = 40;
		spec.attributes["cha"] = 40;
		spec.attributes["luc"] = 40;
		spec.attributes["psi"] = 0;
		
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
				
		setTimeout(st.render.renderChar, 10);
	}
};