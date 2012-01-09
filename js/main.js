Teacup.fill({
	paths : {
		'mod' : 'fake'
	}
},
['dom'], 
function (T) {
	
	var messageBox = T.byId('messageBox');
	
});


Teacup.fill(['dom', 'tmpl', 'event'], function (T) {
	
	var messageBox = T.byId('messageBox');
	
	var tmpl = new T.Tmpl('message.tmpl');
	T.bind('render', function (msg) {
		tmpl.renderTo(messageBox, { message : msg});
	});
	
	T.$('form').bind('submit', function () {
		
		T.trigger('render', T.$('#message').val() || '');
		
		return false;
	});
	
});