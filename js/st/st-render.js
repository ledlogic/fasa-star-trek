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
		that.renderServiceExperience();
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
			$elm = $("<span class=\"st-item st-demographics-item st-demographics-item-" + key + "\"><label>" + key + "</label><span class=\"st-value\">" + h + "</span></span>");
			$demographics.append($elm);
		});
		st.character.$pageft.append($demographics);
	},
	renderDemographicsItem: function(key, value) {
		$(".st-demographics-item-" + key).html(value);
	},
	renderEndurance: function() {
		st.log("rendering endurance");

		var spec = st.character.spec;
				
		var attr = spec.attributes;
		
		if (!attr.end) {
			return;
		}
		
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
		var skills = st.skills.withValue(spec.skills);
		var skillMap = {};
		_.each(skills, function(key) {
			var value = spec.skills[key];
			skillMap[key] = value; 
		});
			
		st.character.$pageft.append("<h2 class=\"st-skill-list-header\">Skill List</h2>");
		
		// there are three sets of skills, to match the display
		var columns = 3;
		var skillsI = st.render.chunkObj(skillMap, columns);
		st.logObj("skillsI", skillsI);
		
		for (var i=0;i<columns;i++) {
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
		st.log("chunkObj");
		st.log("chunks[" + chunks + "]");
		
		var ret = [];
		var objSize = _.size(obj);
		st.log("objSize[" + objSize + "]");
		var ave = [];
		ave[0] = Math.ceil(objSize / chunks);
		ave[1] = Math.ceil((objSize - ave[0]) / (chunks-1));
		ave[2] = Math.floor((objSize - ave[0] - ave[1]) / (chunks-2));
		st.log("ave[" + ave + "]");
		
		var row = 0;
		var col = 0;
		_.each(obj, function(value, key) {
			if (row >= ave[col]) {
				col++;
				row=0;
			}
			if (!ret[col]) {
				ret[col] = {};
			}
			st.log("col[" + col + "],row[" + row + "],key[" + key + "],value[" + value + "]");
			ret[col][key] = value;
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
	renderAge: function() {
		st.log("render age");
		var age = st.character.spec.demographics.age;
		$(".st-item.st-demographics-item.st-demographics-item-age .st-value").html(age);		
	},
	renderTh: function(arr, text, classname, col) {
		var h = [];
		h.push("<th class=\"" + classname + "\" " + (col ? " colspan=\"" + col + "\"" : "") + ">");
		h.push(st.render.renderText(text));
		h.push("</th>");
		arr.push(h.join(""));
	},
	renderTd: function(arr, text, classname, col) {
		var h = [];
		h.push("<td class=\"" + classname + "\" " + (col ? " colspan=\"" + col + "\"" : "") + ">");
		h.push(st.render.renderText(text));
		h.push("</td>");
		arr.push(h.join(""));
	},
	renderSpan: function(arr, text, classname, col) {
		var h = [];
		h.push("<span class=\"" + classname + "\" " + (col ? " colspan=\"" + col + "\"" : "") + ">");
		h.push(st.render.renderText(text));
		h.push("</span>");
		arr.push(h.join(""));
	},
	renderText: function(text) {
		return text ? text : "&nbsp;";
	},
	renderServiceExperience: function() {
		st.log("rendering serviceExperience");

		var spec = st.character.spec;
		
		var $h = $("<div class=\"st-section st-service-experience\"></div>");
		$h.append("<h2 class=\"st-service-experience-header\">Service Experience Charts</h2>");
		$h.append("<h3 class=\"st-assignment\">Assignment</h3>");
		var t= [];
		t.push("<table class=\"st-assignment-table\">");
		
		// titles
		t.push("<tr>");
			st.render.renderTh(t, "", "st-division-name st-tour-name", 2);
			t.push("<th class=\"st-tour-names\" colspan=\"8\">");	
			st.render.renderSpan(t, "Pre-Education", "st-tour-name");
			st.render.renderSpan(t, "The Education", "st-tour-name");
			for (var i=0; i<5; i++) {
				var y = i+1;
				st.render.renderSpan(t, "Service Year " + y, "st-tour-name");
			}
			st.render.renderSpan(t, "Adv. Off. Train.", "st-tour-name");
			t.push("</th>");	
		t.push("</tr>");
		
		// checkboxes
		var terms = st.skills.romulanGreatDutyTerms;
		var termCount = 0;
		_.each(terms, function(value, key) {
			st.log("key[" + key + "]");
			st.log("value[" + value + "]");
			
			var term = value.title;
			var check = [];
			for (var i=0; i<6; i++) {
				check[i] = "";	
			}
			check[termCount] = "✓";
			
			var lastDuty = st.gen.genLastTermDuty();
			st.log("lastDuty[" + lastDuty + "]");
			if (key == lastDuty) {
				check[4] = "✓";
			}
			
			var dispTerm = _.keyToLabel(term);
			t.push("<tr>");
				st.render.renderTd(t, dispTerm, "st-division-name");
				st.render.renderTd(t, "", "st-value");
				st.render.renderTd(t, "", "st-value");
				st.render.renderTd(t, check[0], "st-value");
				st.render.renderTd(t, check[1], "st-value");
				st.render.renderTd(t, check[2], "st-value");
				st.render.renderTd(t, check[3], "st-value");
				st.render.renderTd(t, check[4], "st-value");
				st.render.renderTd(t, "", "st-value");
				t.push("</th>");	
			t.push("</tr>");
			termCount++;
		});
		
		// tour length
		var dispTerm = "Tour Length (years)"
		var advancedYears = spec.advancedOfficers ? 1 : 0;
		t.push("<tr>");
			st.render.renderTd(t, dispTerm, "st-division-name");
				st.render.renderTd(t, 5, "st-value");
				st.render.renderTd(t, 15, "st-value");
				st.render.renderTd(t, 1, "st-value");
				st.render.renderTd(t, 1, "st-value");
				st.render.renderTd(t, 1, "st-value");
				st.render.renderTd(t, 1, "st-value");
				st.render.renderTd(t, 1, "st-value");
				st.render.renderTd(t, advancedYears, "st-value");
		t.push("</tr>");

		// efficiency reports
		var dispTerm = "Efficiency Report (%)"
		t.push("<tr>");
			st.render.renderTd(t, dispTerm, "st-division-name");
			st.render.renderTd(t, "", "st-value");
			st.render.renderTd(t, "", "st-value");
			
			var terms = st.character.spec.terms;
			_.each(terms, function(term) {
				var oer = term.oer;
				st.render.renderTd(t, oer, "st-value");	
			});

			st.render.renderTd(t, "", "st-value");
		t.push("</tr>");
		
		t.push("</table>");
		$h.append(t.join(""));

		st.character.$pageft.append($h);		
	}
};