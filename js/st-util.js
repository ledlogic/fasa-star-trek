_.mixin({
  capitalize2: function(string) {
	var words = string.split(" ");
	var capWords = [];
	for (var i=0;i<words.length;i++) {
		capWords[i] = _.capitalizeWord(words[i]);
	}
	ret = capWords.join(" ");
	console.log(ret);
	return ret;
  },
  capitalizeWord: function(string) {
    return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
  }
});