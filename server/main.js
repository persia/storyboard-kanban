Meteor.methods({

	fetchTask: function() {
		var url = "http://10.24.2.125:9000/api/v1/tasks";
		//synchronous GET
		var result = Meteor.http.get(url, {timeout:30000});
		if(result.statusCode==200) {
			Cards.remove({});
			var respJson = JSON.parse(result.content);
			console.log("response received.");
			for(var i=0;i<respJson.length;i++){
				respJson[i]["position"] = i+1;
				Cards.insert(respJson[i])
			}
			return respJson;
		} else {
			console.log("Response issue: ", result.statusCode);
			var errorJson = JSON.parse(result.content);
			throw new Meteor.Error(result.statusCode, errorJson.error);
		}
	},
	fetchStory: function() {
		var url = "http://10.24.2.125:9000/api/v1/stories";
		//synchronous GET
		var result = Meteor.http.get(url, {timeout:30000});
		if(result.statusCode==200) {
			Stories.remove({});
			var respJson = JSON.parse(result.content);
			console.log("response received.");
			for(var i=0;i<respJson.length;i++){
				Stories.insert(respJson[i])
			}
			return respJson;
		} else {
			console.log("Response issue: ", result.statusCode);
			var errorJson = JSON.parse(result.content);
			throw new Meteor.Error(result.statusCode, errorJson.error);
		}
	}
});

Meteor.startup(function () {

	// fetch story names and usernames on startup 
	Meteor.call("fetchStory", function (error, result) { 
		if (error) console.log(error);
		else console.log("stories fetched");
	});

	if ( Lists.find().count() === 0 ) {
		Lists.insert({
			name: 'todo',
			order: 1
		});
		Lists.insert({
			name: 'inprogress',
			order: 2
		});
		Lists.insert({
			name: 'review',
			order: 3
		});
		Lists.insert({
			name: 'merged',
			order: 4
		});
	}
});
