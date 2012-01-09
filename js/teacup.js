/*!
 * TeacupJS Seed - Seed file providing methods to init a new TeacupJS sandbox. 
 * 
 * @projectDescription  TeacupJS is the prototype of a JavaScript library for [Bancha CMS](http://getbancha.com/home)
 * @author              Marco Solazzi
 * @copyright           (c) 2011-2012 - Marco Solazzi
 * @license             GNU/GPL (General Public License)
 * @version             0.1a - December 2011 - Initial setup, no docs and just a couple of random tests...
 * @requires 	        RequireJS 1.0+
 */



//example usage
/*Teacup.fill(['dom', 'events', 'utils'], function (C) {
	var els = C.query('#menu li');
});

Teacup.fill({
	//instance config	
}, 
['dom', 'events', 'utils'], //modules 
function (C) { //sandbox
	C.bind();
});
*/
/**
 * @namespace Teacup
 */
var Teacup = (function (root, doc, undefined) {
	
	var _TeacupConfig,
		_Teacup,
		_merge,
		_cupUid = 1;
	
	/**
	 * Default config
     * 
     * @see http://requirejs.org/docs/api.html#config
	 */
	_TeacupConfig = {
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
		}//,
		//priority : ['underscore', 'jquery'] //default libraries
	};
	
    /**
	 * Merges the contents of two or more objects together into a new object.
	 * 
	 * @function
     * @private
	 * @param {Object|Bool}* obj	Multiple objects to merge, if first argument is boolean `true`, merging will be recursive (deep copy)
	 * @return {Object} The merged object
	 * 
	 * @example
	 * var firstObj = {
	 * 	foo : 'bar',
	 * 	obj : {
	 * 		barbar : true
	 * 	}
	 * };
	 * 
	 * var secondObj = {
	 * 	baz : true,
	 *  foo : 'no bar',
	 * 	obj : {
	 * 		foobar : null
	 * 	}
	 * };
	 * 
	 * var newObj = _merge(firstObj, secondObj);
	 * 
	 * newObj.baz === true
	 * newObj.foo === 'no bar'
	 * newObj.obj.foobar === null
	 * newObj.obj.barbar === undefined
	 * 
	 * //deep copy nested objects
	 * var newObj = _merge(true, firstObj, secondObj);
	 * 
	 * newObj.obj.foobar === null
	 * newObj.obj.barbar === true
	 */
	_merge = function() {
		var mix = {}, deep = (typeof arguments[0] == 'boolean');
		if (deep) {
			arguments[0] = {};
		}
		for (var i = 0; i < arguments.length; i++) {
			for (var property in arguments[i]) {
				var ap = arguments[i][property];
				var mp = mix[property];
				if (deep && mp && typeof ap == 'object' && typeof mp == 'object') 
					mix[property] = _merge(deep, mp, ap);
				else 
					mix[property] = ap;
			}
		}
		return mix;
	}
	
    /**
     * @exports _Teacup as Teacup
     * @scope Teacup
     */
	_Teacup = {
		
        /**
         * A centralized list of every sandbox instance
         */
		_sandboxes : [],
		
        /**
         * Initializes a new sandbox instance. For every new instance a new RequireJS context is created with id `'cup_XX'` where `XX` is a number.
         * 
         * @param {Object} [config] Instance config. See [RequireJS config API](http://requirejs.org/docs/api.html#config) for reference. This parameter may be omitted.
         * @param {Array} [deps] Modules to load. It accepts Teacup modules ('dom', 'util' or 'mod/dom', 'mod/util') as well as libraries ('jquery', 'underscore')
         * @param {Function} [callback] Callback function. The first argument is the sandox instance. A second optianl parameter is a RequireJS reference
         */
		fill : function (config, deps, callback) {
			
			var inst = this,
				cb,
				modList = [],
				depsLen,
				dep,
				ctx;
			
			if (arguments.length === 2) {
				callback = deps;
				deps = config;
				config = {};
			}
			
			if (!(this instanceof _Teacup.fill)) {
				return new _Teacup.fill(config, deps, callback);
			}
			
			this.context = ctx = 'cup_' + (_cupUid++);
			
			//build the teacup require context
			config = _merge(true, 
							_TeacupConfig, 
							config, 
							{ context :  ctx } 
					);
					
			this.require = require.config(config);
			
			depsLen = deps.length;
			//parse module deps
			while (depsLen--) {
				dep = deps[depsLen];
				if (dep.indexOf('/') === -1 && !(dep in config.paths)) {
					deps[depsLen] = dep = ('mod/' + dep);
					modList.push(dep);					
				}
			}
			
			deps.unshift('require');
			
			cb = function (require) {
				
				var modListLen = modList.length,
					mod;
				
				while (modListLen--) {
					mod = require(modList[modListLen]);
					inst = _merge(inst, (typeof mod === 'function' ? mod.call(inst) : mod) || {});
				}
				callback(inst, require);
				
				_Teacup._sandboxes.push(inst);
			};
			
			this.require(deps, cb);
			
		}
		
	};
	
	
	return _Teacup; //return the public API
	
})(this, this.document);