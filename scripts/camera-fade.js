/*
I should probably learn how to do postfx (https://threejsfundamentals.org/threejs/lessons/threejs-post-processing.html)
but it sounds a bit heavy with rendertextures. For now a plane right in front of the cam will do.
*/
AFRAME.registerComponent('camera-fade', {
	init : function() {
		var fader = document.createElement('a-entity');
		fader.setAttribute('geometry', 'primitive: plane');
		fader.setAttribute('position', {
			x: 0,
			y: 0,
			z: -this.el.getAttribute('camera').near + -.000001 //fix to near clipping plane
		});
		fader.setAttribute('material', 
			{
				'color' : 'black',
				'shader' : 'flat',
				'opacity' : 0,
			});
		fader.object3D.visible = false;
		this.fader = this.el.appendChild(fader);
	},

	setFaderActive : function(active) {
		this.fader.object3D.visible = active;
		//there is a raycaster.enabled, but i cant get it to work. Block all raycasts with the fader!
		if(active)
			this.fader.setAttribute('collider');
		else
			this.fader.removeAttribute('collider');
	},

	fadeIn : function(callback) {
		var fader = this.fader;
		var self = this;

		this.setFaderActive(true);
		
		fader.setAttribute('animation', 'property: components.material.material.opacity; from:0; to:1; dur:500');
		
		var doneCallback = function() {
			if(callback)
				callback();
			fader.removeEventListener('animationcomplete', doneCallback);
		}	
		fader.addEventListener('animationcomplete', doneCallback);
	},
	fadeOut : function(callback) {
		var fader = this.fader;
		var self = this;
		fader.setAttribute('animation', 'property: components.material.material.opacity; from:1; to:0; dur:500');

		var doneCallback = function() {
			self.setFaderActive(false);

			if(callback)
				callback();
			fader.removeEventListener('animationcomplete', doneCallback);
		}	
		fader.addEventListener('animationcomplete', doneCallback);
	}
});