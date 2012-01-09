define(['jquery'], function (jQuery) {

	return {
		
		$ :  jQuery,
		
		query : function (selector, context) {
			var $els = jQuery(selector, context || document) || [];
	
			return !!$els.length ? $els : false;
		},
	
		byId : function (id) {
			var el = document.getElementById(id) || null;
			
			return el ? el : false;
		}
	};
});