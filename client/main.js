Meteor.subscribe('cards');
Meteor.subscribe('lists');

/*function getUrlVars() {
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
}*/

Template.board.helpers({
	lists: Lists.find({}, {sort: {order: 1}})
});

Template.list.cards = function(status) {
	list_name = Lists.findOne({_id: status}).name;
	return Cards.find({status: list_name},
		{sort: {position: 1, task: 1}}
            );
};

// populate cards on page load
//var story_id = getUrlVars()["id"];
//TODO get story_id name

Meteor.call("fetchTask", function (error, result) { 
	if (error) console.log(error);
	//else alert(result);
});
