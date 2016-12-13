var nyc = nyc || {};

/**
 * @desc Abstract class that menu toggling control
 * @public
 * @abstract
 * @class
 * @constructor
 */
nyc.Menu = function(){};

nyc.Menu.prototype = {
	/**
	 * @desc The HTML DOM element that is the menu container
	 * @public
	 * @member {Element} type 
	 */
	menu: null,
	/**
	 * @desc Close all other menus and toggle this menu
	 * @public
	 * @method
	 */
	toggleMenu: function(){
		var me = this;
		$('.ctl-mnu-tgl').each(function(_, mnu){
			if (mnu === me.menu){
				$(mnu).slideToggle();
			}else{
				$(mnu).slideUp();
			}			
		});
	},
};