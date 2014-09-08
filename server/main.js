Meteor.methods({

	fetchTask: function(pParam, pValue) {
		var url = "http://10.24.2.125:9000/api/v1/tasks" + "?" + pParam + "=" + pValue;
		//synchronous GET
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
			return respJson;
		} else {
			console.log("Response issue: ", result.statusCode);
			var errorJson = JSON.parse(result.content);
			throw new Meteor.Error(result.statusCode, errorJson.error);
		}
	},

	fetchAllTasks: function() {
		var url = "http://10.24.2.125:9000/api/v1/tasks";
		//synchronous GET
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
			return respJson;
		} else {
			console.log("Response issue: ", result.statusCode);
			var errorJson = JSON.parse(result.content);
			throw new Meteor.Error(result.statusCode, errorJson.error);
		}
	},

	fetchAPI: function(message) {
		var url = "http://10.24.2.125:9000/api/v1/" + message;
		//synchronous GET
		var result = Meteor.http.get(url, {timeout:30000});
		if(result.statusCode==200) {
			collectionName = message.charAt(0).toUpperCase() + message.slice(1);
			eval(collectionName).remove({});
			var respJson = JSON.parse(result.content);
			console.log("response received.");
			for(var i=0;i<respJson.length;i++){
				respJson[i]["neg_id"] = -1 * respJson[i].id;
				eval(collectionName).insert(respJson[i]);
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

	// fetch stories, projects and users
	Meteor.call("fetchAPI", "stories" , function (error, result) { 
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
