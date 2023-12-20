/* https://stackoverflow.com/questions/31751119/chunking-objects-in-functional-style-underscore-lodash */

/*
_.mixin({"chunkObj": function(input, size) {
    return _.chain(input).pairs().chunk(size).map(_.object).value();
}});
*/

_.mixin({"chunkObj": function(input, size) {
	var chunked = _.chunk(_.keys(input), size);
	var ret = {};	
	_.each(chunked, function(key, i) {
		var chunkedObj = {};
		_.each(chunked[i], function(key) {
			chunkedObj[key] = input[key];
		});
		ret[i] = chunkedObj;
	});	
	return ret;
}});
