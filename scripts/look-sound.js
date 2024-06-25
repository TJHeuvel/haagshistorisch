//https://stackoverflow.com/questions/61388988/web-audio-spatialization-based-on-view-direction/61392077#61392077

AFRAME.registerComponent('look-sound', {
	dependencies: [ 'sound'],
	schema: {

		dotOffset: { type: 'number', default: .5 },

		minVolume: { type: 'number', default: 0 },
		maxVolume: { type: 'number', default: 1 },
	},

	init: function() {		
		this.camera = document.querySelector('a-camera');
		
		this.sound = this.el.components.sound;
		this.soundObj = this.sound.pool.children[0];		
				
		this.dir = new THREE.Vector3(0,0,0);
		this.camFwd = new THREE.Vector3(0,0,0);

		this.setVolume(this.data.minVolume);
	},
	tick: function() {
		if(!this.sound.isPlaying) return;

		var camFwd = this.camFwd;
		camFwd.setFromMatrixPosition( this.camera.object3D.matrixWorld ); //get camera position
		
		var dir = this.dir;		
		dir.setFromMatrixPosition( this.el.object3D.matrixWorld );//Get object position

		dir.subVectors(camFwd,  //camera position
			dir);				//obj position
		var len = dir.length();

		if(len > this.soundObj.getMaxDistance()) return;
		dir.divideScalar(len); //normalize
		
		var e = this.camera.object3D.matrixWorld.elements;
		camFwd.set( e[ 8 ], e[ 9 ], e[ 10 ] ).normalize();		

		var dot = THREE.Math.clamp(camFwd.dot(dir) + this.data.dotOffset, 0, 1);
		
//float dot = Mathf.dot(transform.forward, (camTrans.position-transform.position).normalized);

		this.setVolume(THREE.Math.lerp(
			this.data.minVolume, 
			this.data.maxVolume, 
			dot));

	}, 
	setVolume : function(vol) {
		if(isNaN(vol)) return;		
		this.soundObj.setVolume(vol);
	}
});