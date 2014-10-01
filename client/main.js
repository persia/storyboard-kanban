Meteor.subscribe('cards')
Meteor.subscribe('projects')
Meteor.subscribe('stories')
Meteor.subscribe('users')

// Get the URL of the host storyboard from the server
Meteor.call('getHostURL', function (error, result) {  
	Session.set('host',result);
});

function setIDandTitle(id) {
	if(id > 0) {
		filterType = "story";
		Session.set('currentID' , id);
	}
	else if(id < 0) {
		filterType = "project";
		Session.set('currentID' , id);
	}
	else {
		filterType = "";
		Session.set('currentID' , 0);
	}
}
// templates
Template.board.helpers({
	lists: Lists.find({}, {sort: {order: 1}}),
});

Template.board.events = {
    "click .card": function() {
        console.log("click card");
        if ( $('button').length > 0 ) {
            return false ;
        }
        window.location.href = Session.get('host') + '/#!/story/' + this.story_id;
        return false;
    }
}

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
		setIDandTitle(parseInt($(evt.target).val()));
	}
});
Template.list.helpers({
    cards: function(status) {
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
	},
	listname: function(status) {
		list_name = Lists.findOne({_id: status, }).name;
		switch (list_name)
		{
		case "todo":
			return "To Do";
		case "inprogress":
			return "In Progress";
		case "review":
			return "Review";
		case "merged":
			return "Merged";
		}
	}
});

Template.page_title.helpers({
	title: function () {
		var id = Session.get('currentID');
		if(id > 0)
			return Stories.findOne({"id": Session.get('currentID')}).title;
		if(id < 0)
			return Projects.findOne({"id": Session.get('currentID') * -1}).name;
		return "All Tasks";
	}
});
Template.link.helpers({
	link: function () {
		var id = Session.get('currentID');
		if(id > 0)
			return StoryURL + id;
		else if(id < 0)
			return ProjectURL + -1 * id
		else
			return StoryURL + "list";
	}
});
// on startup
StoryURL = Session.get('host') + "/#!/story/";
ProjectURL = Session.get('host') + "/#!/project/";
filterType = "";
Session.set('currentID' , 0);
setIDandTitle(0);
