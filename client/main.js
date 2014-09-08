Meteor.subscribe('cards');
Meteor.subscribe('lists');
Meteor.subscribe('stories');

story_id = parseInt(getUrlVars()["id"]);
if(story_id) {
	story_doc = Stories.findOne({"id": story_id});
	if(story_doc)
		Session.set('currentTitle', story_doc.title);
	else
		Session.set('currentTitle', "Cannot Find Story");
}
else
	Session.set('currentTitle', "All Tasks");

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
			return "Story: " + this.story_title;
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
			Session.set('currentID' , parseInt($(evt.target).val()));
			Session.set('currentTitle', Stories.findOne({"id": parseInt($(evt.target).val())}).title);
		}
		else if($(evt.target).val() < 0) {
			filterType = "project";
			Session.set('currentID' , parseInt($(evt.target).val()));
			Session.set('currentTitle', Projects.findOne({"id": parseInt($(evt.target).val()) * -1}).name);
		}
		else {
			filterType = "";
			Session.set('currentID' , 0);
			Session.set('currentTitle', "All Tasks");
		}
	}
});

Template.list.cards = function(status) {
	id = Session.get('currentID')
	list_name = Lists.findOne({_id: status, }).name;
	if (id > 0) {
		return Cards.find({status: list_name, story_id: id},
			{sort: {position: 1, task: 1}}
		);
	}
	else if ( id <0 ) {
		return Cards.find({status: list_name, project_id: id * -1},
			{sort: {position: 1, task: 1}}
		);
	}
	return Cards.find({status: list_name});
};

Template.page_title.helpers({
	title: function () {
		return Session.get('currentTitle');
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
