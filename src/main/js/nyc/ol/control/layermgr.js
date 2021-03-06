var nyc = nyc || {};
nyc.ol = nyc.ol || {};
nyc.ol.control = nyc.ol.control || {};

/**
 * @desc Class that provides layer swiping effect
 * @public
 * @class
 * @extends {nyc.ol.control.LayerPicker}
 * @constructor
 * @param {nyc.ol.control.LayerPicker.Options} options Constructor options
 */
nyc.ol.control.LayerMgr = function(options){
	var me = this;
	nyc.ol.control.LayerPicker.call(me, options);
	me.container.append(nyc.ol.control.LayerMgr.MENU_BUTTONS_HTML).trigger('create');
	me.getElem('.btn-ok').click($.proxy(me.toggleMenu, me));
	$.each(me.controls, function(i, control){
		me.hookup(control, me.layerGroups[i].layers);		
	});
};

nyc.ol.control.LayerMgr.prototype = {
	/**
	 * @public
	 * @override
	 * @method
	 * @return {string}
	 */
	getMenuClass: function(){
		return 'mnu-lyr-mgr';
	},
	/**
	 * @public
	 * @override
	 * @method
	 * @return {string}
	 */
	getButtonHtml: function(){
		return nyc.ol.control.LayerMgr.BUTTON_HTML;
	},
	/**
	 * @public
	 * @override
	 * @method
	 * @param {ol.Map} map
	 * @return {Array<nyc.ol.control.LayerPicker.LayerGroup>}
	 */
	getLayerGoupsFromMap: function(map){
		var layers = [], layerGroups = [], photos = {};
		if (map.getBaseLayers){
			var photos = map.getBaseLayers().photos;
			layerGroups.push({name: 'Aerial photos', layers: map.sortedPhotos(), singleSelect: true});
		}
		map.getLayers().forEach(function(layer){
			var name = layer.get('name'); 
			if (name && !photos[name]){
				layers.push(layer);
			}
		});
		if (layers.length){
			layerGroups.push({name: 'Data layers', layers: layers});
		}
		layerGroups[0].expanded = true;
		return layerGroups;
	},
	/**
	 * @desc Turn off all layers
	 * @public
	 * @method
	 */
	clear: function(){
		this.getElem('input')
			.prop('checked', false)
			.checkboxradio('refresh')
			.trigger('change');
	},
	loadedGroup: function(control, group, layers){
		this.hookup(control, layers);
	},
	hookup: function(control, layers){
		if (!layers.groupLayerClass){
			control.on('change', function(choices){
				$.each(control.choices, function(_, choice){
					$.each(layers, function(_, layer){
						if (choice.label == layer.get('name')){
							layer.setVisible(choice.checked);
						}
					});
				});
			});		
		}
	}
};

nyc.inherits(nyc.ol.control.LayerMgr, nyc.ol.control.LayerPicker);

/**
 * @private
 * @const
 * @type {string}
 */
nyc.ol.control.LayerMgr.BUTTON_HTML = '<a class="btn-lyr-mgr ctl ctl-btn" data-role="button" data-icon="none" data-iconpos="notext" title="Layer manager">Layer manager</a>';

/**
 * @private
 * @const
 * @type {string}
 */
nyc.ol.control.LayerMgr.MENU_BUTTONS_HTML = '<a class="btn-ok" data-role="button">OK</a></div>';
