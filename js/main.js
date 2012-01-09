/**
 * Sample instance with TeacupJS modules 
 */
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

/**
 * Sample instance with TeacupJS modules and Underscore Library
 */
Teacup.fill(['dom', 'underscore'], function (T, require) {
    
	var _ = require('underscore'),
        $ = T.$, //jQuery reference
        list = ['one', 'two', 'three'],
        $ul = $('<ul />');
	
    _.each(list, function (el) {
        $ul.append('<li>' + el + '</li>');
    });
    
    $ul.appendTo('footer');
    
});