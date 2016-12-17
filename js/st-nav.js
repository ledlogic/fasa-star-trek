/* st-nav.js */

st.nav = {
	characters: [],
	init: function() {
		st.log("init nav");

		$(".st-nav-link").click(st.nav.click);
		$("#st-select-char").bind("change", st.nav.selectChar);
		st.nav.loadChars();
	},
	click: function() {
		st.log("clicked nav");

		var $that = $(this);
		var href = $that.attr("href").substring(1);
		$(".st-nav-link").removeClass("st-nav-link-active")
		$that.addClass("st-nav-link-active");
		$(".st-page").hide();
		$("." + href).show();
	},
	loadChars: function() {
		st.log("loading chars");

		$.ajax("js/st-char-list.json")
		.done(function(data, status, jqxhr) {
			st.nav.characters = data.characters;
			setTimeout(st.nav.renderChars, 10);
		})
		.fail(function() {
			alert("Error: unable to load character list.");
		})
		.always(function() {
		});
	},
	renderChars: function() {
		st.log("rendering chars");

		var $sel = $("#st-select-char");
		for (var i=0;i<st.nav.characters.length;i++) {
			var character = st.nav.characters[i];
			var option = new Option();
			option.value = character.uri;
			option.text = character.name;
			$sel.append(option);
		}
	},
	selectChar: function() {
		st.log("selected char");

		var $sel = $(this);
		var uri = $sel.find("option:selected").attr("value");
		if (uri) {
			st.character.loadChar(uri);
		} else {
			st.character.hideChar();
		}
	},
	showLinks: function() {
		$(".st-nav-links").show();
	},
	hideLinks: function() {
		$(".st-nav-links").hide();
	}
};