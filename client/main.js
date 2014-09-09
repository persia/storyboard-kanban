function setIDandTitle(id) {
	if(id > 0) {
		filterType = "story";
		Session.set('currentID' , id);
		Session.set('currentTitle', Stories.findOne({"id": id}).title);
	}
	else if(id < 0) {
		filterType = "project";
		Session.set('currentID' , id);
		Session.set('currentTitle', Projects.findOne({"id": id * -1}).name);
	}
	else {
		filterType = "";
		Session.set('currentID' , 0);
		Session.set('currentTitle', "All Tasks");
	}
}
// templates
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
		setIDandTitle(parseInt($(evt.target).val()));
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
		id = Session.get('currentID');
		if(id > 0)
			return StoryURL + id;
		else if(id < 0)
			return ProjectURL + -1 * id
		else
			return StoryURL + "list";
	}
});
// on startup
StoryURL = "http://10.24.2.125:9000/#!/story/";
ProjectURL = "http://10.24.2.125:9000/#!/project/";
filterType = "";
Session.set('currentID' , 0);
setIDandTitle(0);
