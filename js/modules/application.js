define(function () {

	Teacup.Application = Teacup.Class.create(Teacup.mixins.Events, {

		name : 'application',

		ready: Teacup.utils.noop,

		initialize : function (props) {

			this.widgets= [];
			this.listeners = {};

			Teacup.utils.extend(this, props || {});

			for (event in this.listeners) {
				this.bind(event, this.listeners[event]);
			}
			this.ready.call(this);
			
		}
	});

	return Teacup.Application;
});