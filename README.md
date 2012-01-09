#TeacupJS

**TeacupJS** is a prototype JavaScript library to be used with [Bancha CMS](http://getbancha.com/home)

**TeacupJS** has a modular, sandbox-like structure. It provides full AMD async loading with [RequireJS](http://requirejs.org/) to keep the _seed file_ as lightweight as possible.

Here is an example code:

    /**
     * Sample instance with TeacupJS modules dom (requires jQuery 1.7+), template (requires Mustache.js), and pubsub events
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