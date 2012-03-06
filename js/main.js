/**
 * Sample instance with TeacupJS modules 
 */
/*Teacup.fill(['tmpl', 'event'], function (T) {
	
	var messageBox = T.byId('messageBox');
	
	var tmpl = new T.Tmpl('message.tmpl');
	
	T.bind('render', function (msg) {
		tmpl.renderTo(messageBox, { message : msg});
	});
	
	T.$('form').bind('submit', function () {
		
		T.trigger('render', T.$('#message').val() || '');
		
		return false;
	});
	
});*/

Teacup.create = function (constructor) {
	var F;
	
	F = function () {
		this.initialize.apply(this, arguments);
	};
	
	F.extend = function (obj) {
		for (var i in obj) {
			F.prototype[i] = obj[i]; 
		}
	};
	
	F.prototype = constructor;
	
	return F; 
	
};


var MyClass = Teacup.create({
	
	initialize : function (options) {
		console.log('created');
	}
	
});

MyClass.extend({
	render : function () {
		console.log('rendered');
	}
});

Teacup.addModule = function (name, constructor) {
	Teacup.modules[name] = constructor;	
};

Teacup.module = function (name, opts) {
	var mod = Teacup.modules[name],
		inst;
	
	inst = mod.call(null, opts);
	if (inst.initialize) {
		inst.initialize.call(inst, opts);
	}
	return inst;
};

Teacup.addModule('load', function (opts) {
	
	var _conf = _.defaults(opts || {}, {
			baseUrl : '/js',
			paths : {
				'mod' : 'modules',
				'libs' : 'libs',
				'tmpl' : '/tmpl',
				'order' : 'libs/require/order', //RequireJS order! plugin
				'text' : 'libs/require/text', //RequireJS text! plugin
				//some default libraries
				'underscore' : 'libs/underscore',
				'jquery' : 'libs/jquery-1.7.1'
			}
			//priority : ['underscore', 'jquery'] //default libraries
		}),
		ctx;
		
		_conf.context = 'laoder' + (+new Date);
		
		ctx = require.config(_conf);
		
	
	return {
		
		initialize : function () {
		},
		
		require : function (deps, cb) {
			ctx.require(deps, cb);
		}
		
	};
});

var loader = Teacup.module('load');

loader.require() 

/**
 * Sample instance with TeacupJS modules and Underscore Library
 *//*
Teacup.fill(['dom', 'underscore'], function (T, require) {
    
	var _ = require('underscore'),
        $ = T.$, //jQuery reference
        list = ['one', 'two', 'three'],
        $ul = $('<ul />');
	
    _.each(list, function (el) {
        $ul.append('<li>' + el + '</li>');
    });
    
    $ul.appendTo('footer');
    
});*/