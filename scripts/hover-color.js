AFRAME.registerComponent('hover-color', {
	dependencies: ['color'],

	init: function() {

		var self = this;
		var origColor = this.el.getAttribute('material', 'color').color;
		
		this.el.addEventListener('mouseenter', function() {
			this.setAttribute('material', 'color', self.data);
		});
		this.el.addEventListener('mouseleave', function() {

			this.setAttribute('material', 'color', origColor);

		});

	}
});