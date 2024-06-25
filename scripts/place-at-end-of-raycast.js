AFRAME.registerComponent('place-at-end-of-raycast', {
	
	init: function() {
		this.raycaster = this.el.sceneEl.querySelector('[raycaster]').components.raycaster;
	},
	tick: function () {
		var raycaster = this.raycaster;	
		if(!raycaster || !raycaster.intersections || raycaster.intersections.length <= 0) return;

	  	var pnt = raycaster.intersections[0].point;
		this.el.object3D.position.set(pnt.x, pnt.y, pnt.z);
	}
});
