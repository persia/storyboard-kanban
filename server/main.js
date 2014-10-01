Meteor.methods({
	fetchAllTasks: function() {
		var url = STORYBOARD_HOST + "/api/v1/tasks";
		var result = Meteor.http.get(url,{timeout:30000});
		if(result.statusCode==200) {
			Cards.remove({});
			var respJson = JSON.parse(result.content);
			console.log("response received.");
			for(var i=0;i<respJson.length;i++){
				task=respJson[i];
				task["position"] = i+1;
				if(task.project_id)
					task["project_name"] = Projects.findOne({id: task.project_id}).name;
				else
					task["project_name"] = "None";
				if(task.assignee_id)
					task["user_name"] = Users.findOne({id: task.assignee_id}).username;
				else
					task["user_name"] = "None";
				if(task.story_id)
					task["story_title"] = Stories.findOne({id: task.story_id}).title;
				else
					task["story_title"] = "None";
				Cards.insert(task)
			}
		} else {
			console.log("Response issue: ", result.statusCode);
			var errorJson = JSON.parse(result.content);
			throw new Meteor.Error(result.statusCode, errorJson.error);
		}
	},
	// fetch form a storyboard API and put into collection
	fetchAPI: function(methodName) {
		var url = STORYBOARD_HOST + "/api/v1/" + methodName;
		//synchronous GET
		var result = Meteor.http.get(url, {timeout:30000});
		if(result.statusCode==200) {
			// collection names are capitalised
			collectionName = methodName.charAt(0).toUpperCase() + methodName.slice(1);
			eval(collectionName).remove({});
			var respJson = JSON.parse(result.content);
			console.log("response received.");
			for(var i=0;i<respJson.length;i++){
				respJson[i]["neg_id"] = -1 * respJson[i].id;
				eval(collectionName).insert(respJson[i]);
			}
		} else {
			console.log("Response issue: ", result.statusCode);
			var errorJson = JSON.parse(result.content);
			throw new Meteor.Error(result.statusCode, errorJson.error);
		}
	},
	//send the URL of the storyboard host server to the client
	getHostURL: function() {
		return STORYBOARD_HOST;
	},
	// fetch form a storyboard API and put into collection
	fetchAPIWithArg: function(methodName, arg, val) {
		var url = STORYBOARD_HOST + "/api/v1/" + methodName + "?" + arg + "=" + val;
		console.log(url);
		//synchronous GET
		var result = Meteor.http.get(url, {timeout:30000});
		if(result.statusCode==200) {
			// collection names are capitalised
			collectionName = methodName.charAt(0).toUpperCase() + methodName.slice(1);
			eval(collectionName).remove({});
			var respJson = JSON.parse(result.content);
			console.log("response received.");
			for(var i=0;i<respJson.length;i++){
				respJson[i]["neg_id"] = -1 * respJson[i].id;
				eval(collectionName).insert(respJson[i]);
			}
		} else {
			console.log("Response issue: ", result.statusCode);
			var errorJson = JSON.parse(result.content);
			throw new Meteor.Error(result.statusCode, errorJson.error);
		}
	}
});

HTTP.methods({
	'updatecard': function() {
		return '<b>updatecard not implemented</b>';
	},
	'updatestory': function() {
		return '<b>updatestory not implemented</b>';
	},
	'updateproject': function() {
		return '<b>updateproject not implemented</b>';
	},
	'updateallcards': function() {
		Meteor.call("fetchAllTasks", function (error, result) {
			if (error) console.log(error);
		});
	},
	'updateallstories': function() {
		Meteor.call("fetchAPIWithArg", "stories", "status", "active", function (error, result) {
			if (error) console.log(error);
			else console.log("stories fetched");
		});
	},
	'updateallprojects': function() {
		Meteor.call("fetchAPI", "projects" , function (error, result) {
			if (error) console.log(error);
			else console.log("projects fetched");
		});
	},
	'updateallusers': function() {
		Meteor.call("fetchAPI", "users" , function (error, result) {
			if (error) console.log(error);
			else console.log("users fetched");
		});
	}
});

Meteor.startup(function () {
	// read StoryBoard URL
	// fetch tasks, stories, projects and users
	Meteor.call("fetchAPIWithArg", "stories", "status", "active", function (error, result) {
		if (error) console.log(error);
		else console.log("stories fetched");
	});
	Meteor.call("fetchAPI", "users" , function (error, result) { 
		if (error) console.log(error);
		else console.log("users fetched");
	});
	Meteor.call("fetchAPI", "projects" , function (error, result) { 
		if (error) console.log(error);
		else console.log("projects fetched");
	});
	Meteor.call("fetchAllTasks", function (error, result) {
		if (error) console.log(error);
	});
	// create lanes
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
