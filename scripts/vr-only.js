AFRAME.registerComponent('vr-only', {
	schema: {
		isVr: { default: true }
	},
	init: function() {		
		var enter = this.data.isVr ? 'enter-vr' : 'exit-vr',
			exit = this.data.isVr ? 'exit-vr' : 'enter-vr';
		this.el.sceneEl.addEventListener(enter, this.makeVisible.bind(this));
		this.el.sceneEl.addEventListener(exit, this.makeInvisible.bind(this));

		if(this.data.isVr != this.el.sceneEl.is('vr-mode'))
			this.makeInvisible();
	},

	makeInvisible: function() {

		this.el.setAttribute('raycaster','enabled', false);
		this.el.setAttribute('material', 'visible', false);
		
	},
	makeVisible: function() {

		this.el.setAttribute('raycaster','enabled', true);
		this.el.setAttribute('material', 'visible', true);
	}
});