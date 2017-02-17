/* st-char.js */

/* 
 * The display models are optimized for the output display, rather than being truncated.
 * Since the order is known in the output, rendering of css is simplified.
 * In another layout, it could be adjusted to use css-specific overrides for position
 * of individual attributes.
 */
st.character = {
	spec: {},
	$pageft: null,
	init: function() {
		st.log("init character");
		st.character.$pageft = $(".st-page .st-page-ft");
	},
	loadChar: function(uri) {
		st.log("loading char");
		
		if (uri.indexOf(".json") > -1) {
			st.character.loadCharJson(uri);
		}
		if (uri.indexOf(".csv") > -1) {
			st.character.loadCharCsv(uri);
		}
	},
	loadCharJson: function(uri) {
		st.log("loading char from json");
		
		$.ajax("js/char/" + uri)
		.done(function(data, status, jqxhr) {
			st.character.spec = data.spec;
			setTimeout(st.character.render,10);
		})
		.fail(function() {
			alert("Error: unable to load character.");
		})
		.always(function() {
		});
	},
	loadCharCsv: function(uri) {
		st.log("loading char from csv");
		
		var uriArr = uri.split(":");
		var csv = uriArr[0];
		var n = uriArr[1];
		
		Papa.parse("csv/char/" + csv, {
			delimiter: ",",
			download: true,
			header: true,
			complete: function(d) {
				st.character.charResponse(d,n);
			},
			encoding: "UTF-8"
		});
	},
	charMapStrStatBetweenBases: function(strStat, baseIn, baseOut) {
		if (!baseIn) baseIn = 1;
		if (!baseOut) baseOut = 1;
		var ret = Math.round(parseInt(strStat, 10) * baseOut / baseIn);
		return ret;
	},
	charAverageStat: function() {
		var total = 0;
		for (var i=0;i<arguments.length;i++) {
			total += arguments[i];
		}
		var ret = Math.round(total / arguments.length);
		return ret;
	},
	charResponse: function(d, name) {
		st.log("char response");
		
		//st.log(d);
		//st.log(d.data);
		var fields = d.meta.fields;
		var data = d.data;
		
		var nameCol = -1;
		for (var i=0; i<fields.length; i++) {
			var searchName = fields[i];
			if (searchName === name) {
				nameCol = i;
				break;
			}			
		}
		//st.log("nameCol[" + nameCol + "]");
		if (nameCol) {
			var csvSpec = {};
			for (var i=0;i<data.length;i++) {
				var stat = {};
				stat.name = data[i]["Stat"];
				stat.value = data[i][searchName];
				stat.key = stat.name.toLowerCase();
				csvSpec[stat.key] = stat;
			}
			//st.log(csvSpec);
			
			var spec = {};
			st.character.spec = spec;
			
			spec.allegiance = csvSpec["allegiance"].value;
			spec.overview = {};
			spec.overview["name"] = csvSpec["name"].value;
			spec.overview["rank"] = "";
			spec.overview["assignment"] = "";
			spec.overview["ship"] = csvSpec["ship"].value;
			spec.overview["position"] = csvSpec["position"].value;
			
			spec.demographics = {};
			spec.demographics["sex"] = csvSpec["sex"].value;
			spec.demographics["race"] = csvSpec["race"].value;
			
			var baseMap = st.character.charMapStrStatBetweenBases;
			spec.attributes = {};
			spec.attributes["str"] = baseMap(csvSpec["str"].value, 20, 100);
			spec.attributes["end"] = baseMap(csvSpec["end"].value, 20, 100);
			spec.attributes["int"] = baseMap(csvSpec["rea"].value, 20, 100);
			spec.attributes["dex"] = baseMap(csvSpec["dex"].value, 20, 100);
			spec.attributes["cha"] = baseMap(csvSpec["cha"].value, 20, 100);
			spec.attributes["luc"] = baseMap(csvSpec["per"].value, 20, 100);
			spec.attributes["psi"] = st.character.charAverageStat(baseMap(csvSpec["emp"].value, 20, 100), baseMap(csvSpec["wil"].value, 20, 100));
			
			spec.endurance = {};
			
			spec.skills = {};
			var skills0 = {};
			skills0["administration"] = baseMap(csvSpec["administration"].value);
			skills0["artistic-expression"] = "";
			skills0["carousing"] = baseMap(csvSpec["bargain"].value);
			skills0["communication-systems-operation"] = baseMap(csvSpec["comms systems"].value);
			skills0["communication-systems-technology"] = baseMap(csvSpec["comms systems"].value);
			skills0["computer-operation"] = baseMap(csvSpec["research"].value);
			skills0["computer-technology"] = baseMap(csvSpec["computer science"].value);
			skills0["damage-control-procedures"] = baseMap(csvSpec["demolitions"].value);
			skills0["deflector-shield-operation"] = baseMap(csvSpec["forcewall systems"].value);
			skills0["deflector-shield-technology"] = baseMap(csvSpec["forcewall systems"].value);
			skills0["electronics-technology"] = baseMap(csvSpec["electronics"].value);
			skills0["environmental-suit-operation"] = "";
			skills0["gaming"] = baseMap(csvSpec["gambling"].value);
			skills0["instruction"] = "";
			skills0["language-1-fast-talk"] = baseMap(csvSpec["fast talk"].value);
			skills0["language-2-forgery"] = baseMap(csvSpec["forgery"].value);
			skills0["language-3-linguistics"] = baseMap(csvSpec["linguistics"].value);
			skills0["language-4-pick-pocket"] = baseMap(csvSpec["pick pocket"].value);
			skills0["language-5-recon"] = baseMap(csvSpec["recon"].value);
			skills0["language-6-stealth"] = baseMap(csvSpec["stealth"].value);
			skills0["leadership"] = baseMap(csvSpec["leader"].value);
			skills0["life-sciences-1-"] = "";
			skills0["life-sciences-2-agriculture"] = baseMap(csvSpec["farming"].value);
			skills0["life-sciences-3-biology"] = baseMap(csvSpec["biology"].value);
			skills0["life-sciences-4"] = "";
			skills0["life-sciences-5"] = "";
			skills0["life-sciences-6"] = "";
			skills0["life-support-syst-technology"] = "";
			skills0["marksmanship-archaic-firearms"] = baseMap(csvSpec["firearms"].value);
			spec.skills["0"] = skills0;
			
			var skills1 = {};
			skills1["marksmanship-modern-weapon"] = baseMap(csvSpec["fast draw"].value);
			skills1["mechanical-engineering"] = baseMap(csvSpec["mechanical"].value);
			skills1["medical-sciences-1-"] = baseMap(csvSpec["medical"].value);
			skills1["medical-sciences-2-human"] = baseMap(csvSpec["first aid"].value);
			skills1["medical-sciences-3-psychology-human"] = baseMap(csvSpec["psychology"].value);
			skills1["medical-sciences-4-surgery"] = baseMap(csvSpec["surgery"].value);
			skills1["medical-sciences-5-telepathy"] = baseMap(csvSpec["telepathy"].value);
			skills1["medical-sciences-6-"] = "";
			skills1["negotiation-diplomacy"] = "";
			skills1["personal-combat-armed"] = baseMap(csvSpec["melee weapons"].value);
			//skills1["personal-combat-thrown"] = baseMap(csvSpec["thrown weapons"].value);;
			skills1["personal-combat-unarmed"] = baseMap(csvSpec["unarmed combat"].value);;
			skills1["personal-weapons-technology"] = baseMap(csvSpec["missle weapons"].value);
			skills1["physical-sciences-1-chemistry"] = baseMap(csvSpec["chemistry"].value);
			skills1["physical-sciences-2-mathematics"] = baseMap(csvSpec["mathematics"].value);
			skills1["physical-sciences-3-physics"] = baseMap(csvSpec["physics"].value);
			skills1["physical-sciences-4-"] = "";
			skills1["planetary-sciences-1-geology"] = baseMap(csvSpec["geology"].value);
			skills1["planetary-sciences-2-mining"] = baseMap(csvSpec["mining"].value);
			skills1["planetary-sciences-3"] = "";
			skills1["planetary-sciences-4"] = "";
			skills1["planetary-survival-1-General"] = baseMap(csvSpec["survival"].value);
			skills1["planetary-survival-2-"] = "";
			skills1["planetary-survival-3-"] = "";
			skills1["planetary-survival-4-"] = "";
			skills1["security-procedures"] = baseMap(csvSpec["interrogation"].value);
			skills1["shuttlecraft-pilot"] = baseMap(csvSpec["pilot"].value);
			skills1["shuttlecraft-systems-technology"] = "";
			skills1["small-equipment-systems-operation"] = baseMap(csvSpec["security systems"].value);
			skills1["small-equipment-systems-technology"] = baseMap(csvSpec["security systems"].value);
			spec.skills["1"] = skills1;
			
			var skills2 = {};			
			skills2["small-unit-tactics"] = baseMap(csvSpec["tactics"].value);
			skills2["social-sciences-1-"] = "";
			skills2["social-sciences-2-anthropology"] = baseMap(csvSpec["anthropology"].value);
			skills2["social-sciences-3-economics"] = baseMap(csvSpec["economics"].value);
			skills2["social-sciences-4-political-science"] = baseMap(csvSpec["political science"].value);
			skills2["social-sciences-5-"] = "";
			skills2["social-sciences-6-"] = "";
			skills2["social-sciences-7-federation-history"] = baseMap(csvSpec["history"].value);
			skills2["social-sciences-8-federation-law"] = baseMap(csvSpec["law"].value);
			skills2["space-sciences-1-astrogation"] = baseMap(csvSpec["navigation"].value);
			skills2["space-sciences-2-astronomy"] = baseMap(csvSpec["astronomy"].value);
			skills2["space-sciences-3-astronautics"] = "";
			skills2["space-sciences-4-astrophysics"] = "";
			skills2["space-sciences-5"] = "";
			skills2["sports-1-swim"] = baseMap(csvSpec["swim"].value);
			skills2["starship-combat-strategy-tactics"] = baseMap(csvSpec["ships' tactics"].value);
			skills2["starship-helm-operation"] = "";
			skills2["starship-sensors"] = baseMap(csvSpec["detector ops"].value);
			skills2["starship-weaponry-operation"] = baseMap(csvSpec["gunnery"].value);
			skills2["starship-weaponry-technology"] = baseMap(csvSpec["weapons systems"].value);
			skills2["streetwise"] = baseMap(csvSpec["streetwise"].value);
			skills2["transporter-operation-procedures"] = baseMap(csvSpec["teleport systems"].value);
			skills2["transporter-systems-technology"] = baseMap(csvSpec["teleport systems"].value);
			skills2["trivia-1-disguise"] = baseMap(csvSpec["disguise"].value);
			skills2["trivia-2-heavy-weapons"] = baseMap(csvSpec["heavy weapons"].value);
			skills2["trivia-3-hide"] = baseMap(csvSpec["hide"].value);
			skills2["vehicle-operation-1-ground"] = baseMap(csvSpec["vehicle (ground)"].value);
			skills2["warp-drive-technology"] = baseMap(csvSpec["stardrive ops"].value);
			skills2["zero-g-operations"] = baseMap(csvSpec["eva"].value);
			spec.skills["2"] = skills2;
			
			var str = spec.attributes["str"];
			var dex = spec.attributes["dex"];
			var unarmed = skills1["personal-combat-unarmed"];
			
			spec.tohits = {
				"modern": st.character.charAverageStat(dex, skills1["marksmanship-modern-weapon"]),
				"hth": st.character.charAverageStat(dex, unarmed),
				"bareDamage": st.character.bareHandDamage(str, unarmed)
			},
			
			setTimeout(st.character.render, 10);
		}
	},
	bareHandDamage: function(str, unarmed) {
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
	render: function() {
		st.log("rendering char");

		var that = st.character;
		
		that.renderReset();		
		that.renderAllegiance();
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
	renderAllegiance: function() {
		st.log("rendering allegiance");

		var spec = st.character.spec;
		var all = spec.allegiance.toLowerCase().replace(/\s/g, "-");
		
		var size = 8/17 * 328;
		var left = 8/17 * 107;
		var top = 8/17 * 112;
		
		// attr
		var img = "img/st-" + all + ".png";
		var $attr = $("<div class=\"st-section st-allegiance\" style=\"left: " + left + "px; top: " + top + "px;\">"
				      + "<img src=\"" + img + "\" width=\"" + size + "\" height=\"" + size + "\" />"
				      + "</div>");
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
			$elm = $("<span class=\"st-item st-attribute st-attribute-" + key + "\">" + h + "</span>");
			$attr.append($elm);
		});
		st.character.$pageft.append($attr);
	},
	renderEndurance: function() {
		st.log("rendering endurance");

		var spec = st.character.spec;
				
		var attr = spec.attributes;
		
		var endurance = spec.endurance;
		endurance.inactsave = 20;
		endurance.uncthresh = 5;
		endurance.maxopoend = attr.end;
		endurance.curropoend = " ";
		endurance.woundhealrate = Math.floor(attr.end / 20);
		endurance.fathealrate = Math.floor(attr.end / 10);	
		
		// endurance
		var $endurance = $("<div class=\"st-section st-endurance\"></div>");
		_.each(endurance, function(value, key) {
			var h = value;
			$elm = $("<span class=\"st-item st-endurance-item st-endurance-item-" + key + "\">" + h + "</span>");
			$endurance.append($elm);
		});
		st.character.$pageft.append($endurance);
	},
	renderDemographics: function() {
		st.log("rendering demographics");

		var spec = st.character.spec;
		var demographics = spec.demographics;
		
		// page
		var $demographics = $("<div class=\"st-section st-demographics\"></div>");
		_.each(demographics, function(value, key) {
			var h = value + "";
			$elm = $("<span class=\"st-item st-demographics-item st-demographics-item-" + key + "\">" + h + "</span>");
			$demographics.append($elm);
		});
		st.character.$pageft.append($demographics);
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
		
		// there are three sets of skills, to match the display
		for (var i=0;i<3;i++) {
			var skillsI = skills[i];

			var y = 0;
			
			var $skillsI = $("<div class=\"st-section st-skills st-skills-" + i + "\"></div>");
			_.each(skillsI, function(value, key) {
				var h = value + "";
				if (!h) {
					h = "&nbsp;"
				}
				var elm = "";
				var i1 = key.indexOf("-1-");
				var i2 = key.indexOf("-2-");
				var i3 = key.indexOf("-3-");
				var i4 = key.indexOf("-4-");
				var i5 = key.indexOf("-5-");
				var i6 = key.indexOf("-6-");
				if (i1 > -1) {
					var classKey = key.substring(0, i1+2);
					var dispKey = _.capitalize2(key.replace(/-/g, ' ').substring(i1+3));
					if (dispKey) {
						elm += ("<span class=\"st-item st-skill-item-key st-skill-item-key-" + classKey + "\""
								+" style=\"top: " + y + "px\""
								+">" + dispKey + "</span>");
					}
				}
				if (i2 > -1) {
					var classKey = key.substring(0, i2+2);
					var dispKey = _.capitalize2(key.replace(/-/g, ' ').substring(i2+3));
					if (dispKey) {
						elm += ("<span class=\"st-item st-skill-item-key st-skill-item-key-" + classKey + "\""
								+" style=\"top: " + y + "px\""
								+">" + dispKey + "</span>");
					}
				}
				if (i3 > -1) {
					var classKey = key.substring(0, i3+2);
					var dispKey = _.capitalize2(key.replace(/-/g, ' ').substring(i3+3));
					if (dispKey) {
						elm += ("<span class=\"st-item st-skill-item-key st-skill-item-key-" + classKey + "\""
								+" style=\"top: " + y + "px\""
								+">" + dispKey + "</span>");
					}
				}
				if (i4 > -1) {
					var classKey = key.substring(0, i4+2);
					var dispKey = _.capitalize2(key.replace(/-/g, ' ').substring(i4+3));
					if (dispKey) {
						elm += ("<span class=\"st-item st-skill-item-key st-skill-item-key-" + classKey + "\""
								+" style=\"top: " + y + "px\""
								+">" + dispKey + "</span>");
					}
				}
				if (i5 > -1) {
					var classKey = key.substring(0, i5+2);
					var dispKey = _.capitalize2(key.replace(/-/g, ' ').substring(i5+3));
					if (dispKey) {
						elm += ("<span class=\"st-item st-skill-item-key st-skill-item-key-" + classKey + "\""
								+" style=\"top: " + y + "px\""
								+">" + dispKey + "</span>");
					}
				}
				if (i6 > -1) {
					var classKey = key.substring(0, i6+2);
					var dispKey = _.capitalize2(key.replace(/-/g, ' ').substring(i6+3));
					if (dispKey) {
						elm += ("<span class=\"st-item st-skill-item-key st-skill-item-key-" + classKey + "\""
								+" style=\"top: " + y + "px\""
								+">" + dispKey + "</span>");
					}
				}
				elm += ("<span class=\"st-item st-skill-item st-skill-item-" + key + "\""
						+" style=\"top: " + y + "px\""
						+">" + h + "</span>");
				$skillsI.append(elm);
				y += 17.6;
			});
			st.character.$pageft.append($skillsI);
		}		
	},
	renderStats: function() {
		st.log("rendering stats");

		var spec = st.character.spec;

		var stats = spec.stats;
		var $stats = $("<div class=\"st-section st-stats\"></div>");
		_.each(stats, function(value, key) {
			var h = value;
			var $elm = $("<span class=\"st-item st-stat st-stat-" + key + "\" title=\"" + key.toUpperCase() + "\">" + h + "</span>");
			$stats.append($elm);
		});
		st.character.$pageft.append($stats);
	},
	renderToHits: function() {
		st.log("rendering to hits");
		
		var spec = st.character.spec;

		var tohits = spec.tohits;
		var $tohits = $("<div class=\"st-section st-tohits\"></div>");
		_.each(tohits, function(value, key) {
			var h = value;
			var $elm = $("<span class=\"st-item st-tohit st-tohit-" + key + "\" title=\"" + key.toUpperCase() + "\">" + h + "</span>");
			$tohits.append($elm);
		});
		st.character.$pageft.append($tohits);
	}
};