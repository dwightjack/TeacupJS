/*!
 * TeacupJS Seed - Seed file providing common methods of the Teacup Sandbox. 
 * 
 * @projectDescription  TeacupJS is the prototype of a JavaScript library for [Bancha CMS](http://getbancha.com/home)
 * @author              Marco Solazzi
 * @copyright           (c) 2011-2012 - Marco Solazzi
 * @license             GNU/GPL (General Public License)
 * @version             0.1a - December 2011 - Initial setup, no docs and just a couple of random tests...
 * @version             0.1a2 - March 2012 - Updated and rewritten
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
var Teacup = (function (root, doc, Config, undefined) {
	
	var _TeacupConfig,
		_Teacup,
		_merge,
		_indexOf;
	
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
		var mix, deep = (typeof arguments[0] == 'boolean');
		if (deep) {
			arguments[0] = {};
		}
		mix = arguments[0];
		for (var i = 1; i < arguments.length; i++) {
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
	 * Returns the position of a given value in an array starting from `0`, else `-1`
	 * Uses native `Array.prototype.indexOf` where available
	 * 
	 * @function
	 * @private
	 * @param {Mixed} value Value to seach for
	 * @param {Array} array Array to search in 
	 * @return {Number}
	 * 
	 * var myArray = ['cat', 'dog', 'bird', 'fish'];
	 * 
	 * _indexOf('cat', myArray);
	 * // returns 1
	 * _indexOf('tiger', myArray);
	 * // returns -1
	 */
	function _indexOf ( elem, array ) {
		if ( array.indexOf ) {
			return array.indexOf( elem );
		}

		for ( var i = 0, length = array.length; i < length; i++ ) {
			if ( array[ i ] === elem ) {
				return i;
			}
		}
		return -1;
	}
	
	/**
	 * Default config
     * 
     * @see http://requirejs.org/docs/api.html#config
	 */
	_TeacupConfig = _.defaults(Config.loader || {}, {
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
	});
	
	
	
    /**
     * @exports _Teacup as Teacup
     * @scope Teacup
     */
	_Teacup = {
		
        /**
         * A centralized list of every sandbox instance
         */
		_sandboxes : [],
		
		_modules : 'dom|event|tmpl|base'.split('|').concat(Config.modules || []), //known modules
		
        addModule : function (name, constructor) {
			_Teacup._modules[name] = constructor;	
		},

		module : function (name, opts) {
			var mod = Teacup.modules[name],
				inst;
			
			inst = mod.call(null, opts);
			if (inst.initialize) {
				inst.initialize.call(inst, opts);
			}
			return inst;
		}
	};
	
	
	
	_Teacup.addModule('load', function (opts) {
		
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
	
	
	
	
	return _Teacup; //return the public API
	
})(this, this.document, Teacup || {});