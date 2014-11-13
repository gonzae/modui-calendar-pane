var Super = require( 'modui-base' );
var ModuiPopup = require( 'modui-popup' );

var template = require( './template.tpl' );

module.exports = Super.extend( {
	template : template,
	initialize: function() {
		this.render();
	},
	ui : {
		"trigger"		:  ".trigger",
		"target"		: '.table!'
	},
	events: {
		'click trigger' : 'exampleThreeTrigger'
	},
	example3Contents: 'I\'m here!',
	exampleThreeTrigger: function() {
		ModuiPopup.open( {
			target : this.ui.target,
			position : this.$el.find( 'input:checked' ).val(),
			contents : this.$el.find( 'input:checked' ).val(),
			signature : 'example3'
		} );
	}
} );
