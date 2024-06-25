window.addEventListener('load', function() {

	function fixCams(){
		return;
		var cam = document.getElementById('camera');
		if(!cam) return;
		cam = cam.components.camera.camera;
		
		if(!cam) return;
		var raycasters = document.querySelectorAll('[raycaster]');
		raycasters.forEach(r => {
			r.components.raycaster.raycaster.camera = cam;
		});
	}

	//Hacky aframe fix
	new MutationObserver(function(l, o) {
		fixCams();
	}).observe(document.body, { attributes: true, childList: true, subTree: true});
	fixCams();

	document.querySelector('include').addEventListener('load', function() {

		//Mute unmute sound
		document.querySelector('.btnAudio').addEventListener('click', function() {

			if(this.classList.contains('mute')) { //we are muted
				this.classList.remove('mute');

				document.querySelectorAll('[sound]').forEach(s => {
					s.components.sound.playSound();
				});

			} else {
				this.classList.add('mute');
				document.querySelectorAll('[sound]').forEach(s => {
					s.components.sound.stopSound();
				});
			}
		});

		var btnScroll = document.querySelector('.btnScroll');
		btnScroll.addEventListener('click', function() {

			if(document.body.scrollTop > 55)
				document.body.scrollTop = 0;
			else
				document.querySelector("article.active").scrollIntoView();
		});
		document.addEventListener('scroll', function() {
			var shouldHaveTop = document.body.scrollTop > 55;

			if(shouldHaveTop && !btnScroll.classList.contains('top'))
				btnScroll.classList.add('top');
			else if(!shouldHaveTop && btnScroll.classList.contains('top'))
				btnScroll.classList.remove('top');
		});

		var scene = document.querySelector('a-scene');

		function startGame() {		
			if(!scene.hasLoaded) return;

			scene.classList.add('loaded');
			document.querySelector('.startScreen').remove();	
			document.querySelector('a-scene').emit('startGame');

			document.querySelector('.btnAudio').classList.remove('mute');
			document.querySelectorAll('[sound]').forEach(s => {
				s.components.sound.playSound();
			});
			scene.parentElement.classList.remove('hide-canvas');

			allStartBtns.forEach(btn => {
				btn.removeEventListener('click', startGame);
			});

			/*
			scene.addEventListener('click', function() {
				scene.querySelector('[raycaster]').components.raycaster.checkIntersections();
			});
			*/
			document.getElementById('realcolofon').classList.remove('a-hidden');
			document.getElementById('articleparent').classList.remove('a-hidden');
		}
		var allStartBtns = document.querySelectorAll('[btnStartGame]');

		allStartBtns.forEach(btn => {
			btn.addEventListener('click', startGame);
		});

		document.querySelectorAll('nav>a').forEach(link =>  {
			link.addEventListener('click', function(evt) {
				window.location = this.href;
				evt.preventDefault();
			});
		});


		scene.addEventListener('loaded', function() {
			allStartBtns.forEach(btn => {
				var attr = btn.getAttribute('btnStartGame');
				if(attr)
					btn.textContent = attr;
			});
			document.querySelectorAll('[tabButton]').forEach(btn => {
				btn.textContent = btn.getAttribute('tabButton');
				btn.classList.add('loaded');
			});
		});

		document.querySelectorAll('.btnLanguage').forEach(b => b.addEventListener('click', function() {
			document.body.className = document.body.className == 'nl' ? 'en' : 'nl';
		}));

		document.querySelectorAll('[tabButton]').forEach(btn => {
			btn.addEventListener('click', function() {
				var container = this.parentElement.parentElement;
				container.classList.add('a-hidden');
				container.nextElementSibling.classList.remove('a-hidden');
			});
		})
	});
});

function dumpGeoData() {

	var geometryData = [];
	var total = 0;


	document.querySelectorAll('[obj-model').forEach(obj => {
		var verts = obj.object3DMap.mesh.children[0].geometry.attributes.position.count;
		geometryData.push({ id: obj.id,  vertCount: verts }); 
		total += verts;
	});
	geometryData.push({ id: 'obj-mesh-total', vertCount: total });
	geometryData.push({ id: 'visible-triangles', vertCount: document.querySelector('a-scene').renderer.info.render.triangles });
	
	console.table(geometryData);
}