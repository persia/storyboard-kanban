Meteor.methods({
	fetchFromService: function() {
		var url = "http://10.24.2.125:9000/api/v1/tasks";
		//synchronous GET
		var result = Meteor.http.get(url, {timeout:30000});
		return result.content;
		if(result.statusCode==200) {
			//var respJson = JSON.parse(result.content);
			console.log("response received.");
			return result.content;
		} else {
			console.log("Response issue: ", result.statusCode);
			var errorJson = JSON.parse(result.content);
			throw new Meteor.Error(result.statusCode, errorJson.error);
		}
	}
});

Meteor.startup(function () {

	if ( Lists.find().count() === 0 ) {
		Lists.insert({
			name: 'Todo',
			order: 1
		});
		Lists.insert({
			name: 'Inprogress',
			order: 2
		});
		Lists.insert({
			name: 'Review',
			order: 3
		});
		Lists.insert({
			name: 'Merged',
			order: 4
		});
	}
	if (Cards.find().count() === 0 ) {
		Cards.insert({num: 0});
	}
});
