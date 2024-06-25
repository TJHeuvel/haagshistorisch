AFRAME.registerComponent('timeofday', {
	schema: {
		lerpAmount : { default: 0}
	},
	
	init : function() {

		this.setupShader();
		//this.el.sceneEl.addEventListener('startGame', this.doStartGameEffect.bind(this));
		//this.el.sceneEl.addEventListener('load', this.setRealTimeOfDay.bind(this));
		//this.testTod();
	},
	doStartGameEffect : function () {		
		var startTimeStamp = performance.now();
		var duration = 5;

		var targetValue = this.getTodFromDate(new Date());

		function updateTodValue(time){
			var timeSinceStart = (time - startTimeStamp) / 1000;

			var f = (Math.sin(timeSinceStart) + 1) / 2;
			
			if(timeSinceStart > duration && Math.abs(f - targetValue) < .01)
				this.setTodValue(targetValue);
			else {
				this.setTodValue(f);
				window.requestAnimationFrame(bTick);
			}
		}
		var bTick = updateTodValue.bind(this);

		window.requestAnimationFrame(bTick);

	},
	update : function(oldData) {
		if(oldData.lerpAmount != this.data.lerpAmount)
			this.setTodValue(this.data.lerpAmount);
	},
	setRealTimeOfDay : function() {
		this.setTodValue(this.getTodFromDate(new Date()));
	},

	getTodFromDate : function(dt) {

		//At 00:00 the lerpAmount should be 1
		//At 06:00 the lerpAmount should be .5
		//At 12:00 the lerpAmount should be 0
		//at 18:00 the lerpAmount should be .5
		//at 24:00 the lerpAmount should be 1

		//at 00:00 it should be 1
		//at 06:00 it should be 1
		//at 10:00 it should be 0
		//at 19:00 it should be 0
		//at 22:00 it should be 1

		var secondsInAnHour = 60*60;

		var nightStartLerp = 6 * secondsInAnHour,
			nightEndLerp = 9 * secondsInAnHour; 
		var dayStartLerp = 18 * secondsInAnHour,
			dayEndLerp = 21 * secondsInAnHour;

		var currentSeconds = dt.getSeconds() + (60 * dt.getMinutes()) + (60 * 60 * dt.getHours());

		if(currentSeconds < nightStartLerp)
			return 1;
		else if(currentSeconds <= nightEndLerp)
			return (nightEndLerp - currentSeconds) / (nightEndLerp - nightStartLerp);
		else if(currentSeconds < dayStartLerp)
			return 0;
		else if(currentSeconds <= dayEndLerp)
			return 1 - ((dayEndLerp - currentSeconds) / ( dayEndLerp - dayStartLerp));
		else
			return 1;
	},
	testTod : function() {		

		for(var i = 0; i <= 24; i++) {
			var dt = new Date(2020, 1, 1, i);
			console.log('op zoveel uur: ', i, 'lerp je zoveel:', this.getTodFromDate(dt));
		}
	},
	setTodValue : function(v) {
		if(this.lerpAmountUniform)
			this.lerpAmountUniform.value = v;
	},

	setupShader : function() {
	
		if(navigator.deviceMemory < 2) return;	

	  var mat = this.el.components.material.material;

	  var nightTexUrl = document.querySelector('a-assets ' + this.el.components.material.data.dst);
	  if(nightTexUrl)
		nightTexUrl = nightTexUrl.getAttribute('src');
	  else
	  {
		console.warn('ik kan ' + this.el.components.material.data.dst + ' niet vinden!', this.el);
		return;
	  }

	  mat.dst = new THREE.TextureLoader().load( nightTexUrl );
	  mat.lerpAmount = parseInt(this.el.components.material.data.lerpAmount) || 0;      
	  
	  mat.onBeforeCompile = function(shader) {

		  shader.uniforms.dst = { value : mat.dst };
		  shader.uniforms.lerpAmount = { value : mat.lerpAmount };
		  this.lerpAmountUniform = shader.uniforms.lerpAmount;
		  shader.fragmentShader = shader.fragmentShader.replace('#include <map_pars_fragment>', `
			#ifdef USE_MAP

			  uniform sampler2D map, dst;
			  uniform float lerpAmount;
			#endif
			`);
		  shader.fragmentShader = shader.fragmentShader.replace('#include <map_fragment>', `
			#ifdef USE_MAP

			vec4 startCol = texture2D( map, vUv );
			vec4 endCol = texture2D( dst, vUv );
			diffuseColor.rgb = mix(startCol.rgb, endCol.rgb, lerpAmount);
			diffuseColor.a = startCol.a;// mix(startCol.a, endCol.a, lerpAmount);

			#endif
		  `);
		  this.setRealTimeOfDay();
	  }.bind(this);
	}
});