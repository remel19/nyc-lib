var nyc = nyc || {};

/**
 * @desc Collapsible radio button collection
 * @public
 * @class
 * @extends {nyc.Choice}
 * @constructor
 * @param {nyc.Choice.Options} options Constructor options
 */
nyc.Radio = function(options){
	nyc.Choice.apply(this, [options]);
	this.changed();
};

nyc.Radio.prototype = {
	/**
	 * @private
	 * @member {string}
	 */
	type: 'radio',
	/** 
	 * @public
	 * @method
	 * @param {JQuery.Event} event The change event object 
	 */
	changed: function(event){
		var me = this;
		me.value = [];
		$.each(me.inputs, function(i, input){
			var choice = me.choices[i];
			choice.checked = false;
			if (input.prop('checked')){
				choice.checked = true;
				me.value = [choice];
				me.currentVal.html(choice.label);
			}
		});
		me.trigger('change', me.value);
	}		
};

nyc.inherits(nyc.Radio, nyc.Choice);
