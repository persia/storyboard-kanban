Meteor.subscribe('cards');
Meteor.subscribe('lists');
Meteor.subscribe('stories');

story_id = parseInt(getUrlVars()["id"]);
story_url = "http://10.24.2.125:9000/#!/story/";
filterType = "";

function getUrlVars() {
	var vars = [], hash;
	var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	for(var i = 0; i < hashes.length; i++) {
		hash = hashes[i].split('=');
		if($.inArray(hash[0], vars)>-1) {
			vars[hash[0]]+=","+hash[1];
		}
		else {
			vars.push(hash[0]);
			vars[hash[0]] = hash[1];
		}
	}
	return vars;
}

Template.board.helpers({
	lists: Lists.find({}, {sort: {order: 1}})
});

Template.card.helpers({
	otherType: function() {
		if(filterType == "story")
			return "Project: " + this.project_name;
		else
			return "Story: " + this.story_name;
	}
});

Template.story_menu.helpers({
	stories: Stories.find({}),
	projects: Projects.find({})
});

Template.story_menu.events({
	'change select': function(evt){
		if($(evt.target).val() > 0) {
			filterType = "story";
			Meteor.call("fetchTask", "story_id", $(evt.target).val(), function (error, result) {
			if (error) console.log(error);
			});
		}
		else if($(evt.target).val() < 0) {
			filterType = "project";
			Meteor.call("fetchTaskByProject", -1 * $(evt.target).val(), function (error, result) {
			if (error) console.log(error);
			});
		}
		else {
			filterType = "";
			Meteor.call("fetchAllTasks", function (error, result) {
				if (error) console.log(error);
			});
		}
	}
});

Template.list.cards = function(status) {
	list_name = Lists.findOne({_id: status}).name;
	return Cards.find({status: list_name},
		{sort: {position: 1, task: 1}}
            );
};

Template.page_title.helpers({
	title: function () {
		if(story_id) {
			story_doc = Stories.findOne({"id": story_id});
			if(story_doc)
				return story_doc.title;
			else
				return "Cannot Find Story";
		}
		else
			return "All Tasks";
	}
});

Template.link.helpers({
	link: function () {
		story_doc = Stories.findOne({"id": story_id});
		if(story_doc)
			return story_url + story_id;
		else
			return story_url + "list";
	}
});

if(story_id) {
	Meteor.call("fetchTask", "story_id", story_id, function (error, result) {
		if (error) console.log(error);
		//else alert(result);
	});
}
else {
	Meteor.call("fetchAllTasks", function (error, result) {
		if (error) console.log(error);
		//else alert(result);
	});
}
