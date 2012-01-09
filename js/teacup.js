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
var Teacup = (function (root, doc, undefined) {
	
	var _TeacupConfig,
		_Teacup,
		_extend,
		_cupUid = 1;
	
	/**
	 * Default config
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
	
	_extend = function() {
		var mix = {}, deep = (typeof arguments[0] == 'boolean');
		if (deep) {
			arguments[0] = {};
		}
		for (var i = 0; i < arguments.length; i++) {
			for (var property in arguments[i]) {
				var ap = arguments[i][property];
				var mp = mix[property];
				if (deep && mp && typeof ap == 'object' && typeof mp == 'object') 
					mix[property] = _extend(deep, mp, ap);
				else 
					mix[property] = ap;
			}
		}
		return mix;
	}
	
	_Teacup = {
		
		_sandboxes : [],
		
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
			config = _extend(true, 
							_TeacupConfig, 
							config, 
							{ context :  ctx } 
					);
					
			this.require = require.config(config);
			
			depsLen = deps.length;
			//parse module deps
			while (depsLen--) {
				dep = deps[depsLen];
				if (dep.indexOf('/') === -1) {
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
					inst = _extend(inst, (typeof mod === 'function' ? mod.call(inst) : mod) || {});
				}
				callback(inst, require);
				
				_Teacup._sandboxes.push(inst);
			};
			
			this.require(deps, cb);
			
		}
		
	};
	
	
	return _Teacup
	
})(this, this.document);
