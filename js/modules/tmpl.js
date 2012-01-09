define(['libs/when', 'mod/dom', 'libs/mustache'], function (when) {
	
	return function () {
		
		var _Tmpl,
			inst = this; //Teacup instance
			
		_Tmpl = function (view) {
			var _tmpl = this,
				viewDeferred = when.defer();
				
			this.tmpl = viewDeferred.promise;
			
			if (view.indexOf('.tmpl') !== -1) {
				//async template load
				
				inst.require(['text!tmpl/' + view], function (tmpl) {
					viewDeferred.resolve(tmpl);
				});
				
			} else {
				viewDeferred.resolve(view);
			}
			return this;
		};
		
		_Tmpl.prototype = {
			
			$ : inst.$,
			
			render : function (cb) {
				this.tmpl.then(cb);
			},
			
			renderTo : function (selector, data) {
				var that = this,
					cb = function (tmpl) {
						var html = Mustache.to_html(tmpl, data || {}); 
						that.$(selector).html(html);	
					};
				
				this.tmpl.then(cb);
			}
		};
				
		return { Tmpl : _Tmpl};
		
	};
	
});