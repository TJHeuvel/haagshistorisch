AFRAME.registerComponent('nav-point', {
	schema: {
		'id'			: { type: 'string', default: 'start' },
		'scale' 		: { type: 'vec3',	default:'1 1 1' },
		'heightOffset'  : { type: 'number', default: 0 },

	},

	init: function() {
		var navPointId = this.data.id;

		this.el.addEventListener('click', function() {
			window.location = '#' + navPointId;

		});
	}
});

//nav point system actually listens to hash change
AFRAME.registerSystem('nav-point', {
	init: function(){

		var self = this;
		this.sceneEl.addEventListener('loaded', function() {
			self.navPoints = document.querySelectorAll('[nav-point]');
			self.cameraBaseHeight = document.getElementById('rig').object3D.position.y;
			window.addEventListener('hashchange', self.onHashChanged.bind(self));
			self.onHashChanged();			
		});

	},
	onHashChanged : function() {
		//hash or the first link if none
		var hash = (location.hash || document.querySelector('nav > a').hash).slice(1);

		var fader = document.querySelector('[camera-fade]').components['camera-fade'];
		
		fader.fadeIn(function() {
			//Set link as active
			document.querySelectorAll('nav>a').forEach(function(elem) {
				elem.className = elem.hash.slice(1) == hash ? 'active' : '';
			});

			//Set article as active
			document.querySelectorAll('.articleContainer > article').forEach(function(elem) {
				elem.className = elem.id == hash ? 'active' : '';
			});

			//Fix visibility and cam position

			var cam = document.getElementById('rig');
			var lookControl = cam.children[0].components['look-control'];

			var y = this.cameraBaseHeight;
			
			this.navPoints.forEach(function(p) {
				
				var navPoint = p.components['nav-point'];
				
				//not visible if its the current one!
				p.object3D.visible = navPoint.data.id != hash;
				p.setAttribute('collider');

				if(!p.object3D.visible) {

					p.removeAttribute('collider');

					if(navPoint.data.worldPosition) {
						var targetPos = AFRAME.utils.coordinates.parse(navPoint.data.worldPosition);
						cam.object3D.position.set(targetPos.x, targetPos.y, targetPos.z);
					} else {
						var targetPos = p.object3D.position;
						cam.object3D.position.set(targetPos.x,  y + navPoint.data.heightOffset, targetPos.z);
					} 

					cam.object3D.scale.set(navPoint.data.scale.x, navPoint.data.scale.y, navPoint.data.scale.z);
					
					if(!lookControl)
						lookControl = cam.children[0].components['look-controls'];

					if(lookControl) {
						var rot = p.object3D.rotation.y;					
						lookControl.yawObject.rotation.y = rot;
						lookControl.pitchObject.rotation.y = rot;
					}
				}
			});	

			window.setTimeout(function() { fader.fadeOut() }, 1000);
		}.bind(this));
	}
});
