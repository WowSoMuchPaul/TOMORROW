			import * as THREE from '../build/three.module.js';

			import Stats from '../threejsImports/stats.module.js';

			import { GUI } from '../threejsImports/lil-gui.module.min.js';

			import { OrbitControls } from '../threejsImports/OrbitControls.js';
			import { RoomEnvironment } from '../threejsImports/RoomEnvironment.js';

			import { GLTFLoader } from '../threejsImports/GLTFLoader.js';
			import { DRACOLoader } from '../threejsImports/DRACOLoader.js';
			import { TWEEN } from '../threejsImports/tween.module.min.js';

			let mixer;

			const clock = new THREE.Clock();
			const container = document.getElementById( 'container' );

			var raycaster = new THREE.Raycaster();
			var model;
			var intersected;
			var intersectedPoint;
			var landingPage = true;
			var seitenEbene = 0;
			var rcpSzenario = 0;
			var jahreszeitSommer = true;
			var ursprung = new THREE.Vector3(0,0,0);

			const stats = new Stats();
			container.appendChild( stats.dom );

			//const gui = new GUI();
			
			const renderer = new THREE.WebGLRenderer( { antialias: true } );
			renderer.setPixelRatio( window.devicePixelRatio );
			renderer.setSize( window.innerWidth, window.innerHeight );
			renderer.outputEncoding = THREE.sRGBEncoding;

			renderer.physicallyCorrectLight = true;

			container.appendChild( renderer.domElement );

			const pmremGenerator = new THREE.PMREMGenerator( renderer );

			const scene = new THREE.Scene();
			scene.background = new THREE.Color( 0x4D4B4B );
			scene.environment = pmremGenerator.fromScene( new RoomEnvironment(), 0.04 ).texture;


			/*
			const pointLight = new THREE.PointLight(0xffffff, 0.1);
			//pointLight.position.x = 2;
			//pointLight.position.y = 2;
			//pointLight.position.z = 1;
			pointLight.position.set(1,1,1);
			scene.add(pointLight);

			//gui.add(pointLight.position, 'y').min(-3).max(3);
			
			const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
			hemiLight.color.setHSL( 0.6, 1, 0.6 );
			hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
			hemiLight.position.set( 0, 50, 0 );
			scene.add( hemiLight );
			const hemiLightHelper = new THREE.HemisphereLightHelper( hemiLight, 10 );
			scene.add( hemiLightHelper );
			*/


			const camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 100 );
			camera.position.set( 5, 2, 8 );
			camera.far = 10000;
			camera.near = 0.01;
			camera.updateProjectionMatrix();


			const controls = new OrbitControls( camera, renderer.domElement );
			controls.target.set(ursprung);
			controls.update();
			controls.enablePan = false;
			controls.enableDamping = true;
			controls.enableZoom = false;


			const dracoLoader = new DRACOLoader();
			dracoLoader.setDecoderPath( '../threejsImports/draco/gltf/' );
			const loader = new GLTFLoader();
			loader.setDRACOLoader( dracoLoader );
			loader.load( '../models/TMW_Model_25_1732.glb', function ( gltf ) {

				model = gltf.scene;
				model.position.set(0,0,0);
				model.scale.set( 0.01, 0.01, 0.01);
				scene.add( model );

				mixer = new THREE.AnimationMixer( model );
				//mixer.clipAction( gltf.animations[ 0 ] ).play();
				gltf.animations.forEach( ( clip ) => {
					//console.log(clip.name);
					mixer.clipAction( clip ).play();	
				} );



				model.traverse((o) => {
					if (o.isMesh) o.material.side = THREE.DoubleSide;
				});
				model.getObjectByName("CenterPoint").getWorldPosition(ursprung);
				szenarioWechsel(model);
				landingpage();



				animate();

			}, undefined, function ( e ) {

				console.error( e );

			} );
			

			window.onresize = function () {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight );
				renderer.render(scene, camera);

			};


			container.addEventListener('click', mouseClick, false);
			container.addEventListener( 'mousemove', mouseHover, false );
			document.addEventListener('keydown', keyPressed);


			function mouseHover(event) {
				event.preventDefault();

				findIntersections();

			}

			function mouseClick(event) {

				event.preventDefault();

				if (landingPage) {
					controls.enabled = true;
					controls.autoRotate = false;
					landingPage = false;
					startseite();
				}

				findIntersections();
				if (intersected != null) {
					if ( intersected.name.startsWith('sphereDreh') && seitenEbene == 2) {
						drehbruecke();
						hideSpheres();
					}
					if ( intersected.name.startsWith('sphereBeck') && seitenEbene == 2) {
						beckergrube();
						hideSpheres();
					}
					if ( intersected.name.startsWith('sphereKr') && seitenEbene == 2) {
						kraehenteich();
						hideSpheres();
					}
					if ( intersected.name.startsWith('Lübeck_Objekt_Ausschnitte') && seitenEbene == 1) {
						modelSeite();
					}
					if ( intersected.name.startsWith('Video') && seitenEbene == 1) {
						videoWand();
						hideSpheres();
					}
				}

			}

			function keyPressed(event) {

				if (landingPage) {
					controls.enabled = true;
					controls.autoRotate = false;
					landingPage = false;
					startseite();
				}

				/*
				if (event.keyCode == 49) landingpage(); //1
				if (event.keyCode == 50) startseite(); //2
				if (event.keyCode == 51) modelSeite(); //3
				if (event.keyCode == 52) drehbruecke(); //4
				if (event.keyCode == 53) beckergrube(); //5
				if (event.keyCode == 54) kraehenteich(); //6
				if (event.keyCode == 48) rcp85(); //0
				if (event.keyCode == 57) rcp45(); //9
				if (event.keyCode == 56) rcp26(); //8
				if (event.keyCode == 87) winter(); //w
				if (event.keyCode == 83) sommer(); //s
				if (event.keyCode == 90) zurueck(); //z
				if (event.keyCode == 72) help(model); //h
				if (event.keyCode == 69) enableControls(); //e
				if (event.keyCode == 89) modelWechsel('models/gltf/Lübeck_Model_Tomorrow_16.01_ausprobierDatein.glb'); //y
				*/

			}

			/*
			function help(o) {
				if (o.children) {
					if (o.name.startsWith("26") || o.name.startsWith("Drehbrücke") || o.name.startsWith("Sommer") || o.name.startsWith("Winter")) {
						console.log(o.name);	
					}
					for (let i = 0; i < o.children.length; i++) {
						if (o.name.startsWith("26") || o.name.startsWith("Drehbrücke") || o.name.startsWith("Sommer") || o.name.startsWith("Winter")) {
							console.log(o.children[i].name);
						}
						help(o.children[i]);
					}
				}
			}
			*/

			function enableControls() {
				controls.enabled = true;
				controls.enableZoom = true;
				controls.maxPolarAngle = Math.PI;
				controls.minPolarAngle = 0.0;
			}

			function hideSpheres() {
				model.getObjectByName("sphereDreh").visible = false;
				model.getObjectByName("sphereBeck").visible = false;
				model.getObjectByName("sphereKr").visible = false;
			}

			function landingpage() {

				landingPage = true;
				seitenEbene = 0;

				hideSpheres();
				
				controls.autoRotate = true;
				controls.autoRotateSpeed = 5.0;
				controls.enabled = false;
				moveFocuspointToPoint(ursprung);
				moveCameraToPoint(new THREE.Vector3(0,40,0));
				controls.maxPolarAngle = Math.PI;
				controls.minPolarAngle = 0.0;

			}

			function startseite() {

				seitenEbene = 1;
				controls.enabled = true;

				hideSpheres();

				moveFocuspointToPoint(ursprung);
				moveCameraToPoint(new THREE.Vector3(30.0,30.0,30.0));
				controls.maxPolarAngle = 0.4 * Math.PI;
				controls.minPolarAngle = 0.4 * Math.PI;

				modelSeite();

			}

			function modelSeite() {
			
				seitenEbene = 2;
				controls.enabled = true;

				model.getObjectByName("sphereDreh").visible = true;
				model.getObjectByName("sphereBeck").visible = true;
				model.getObjectByName("sphereKr").visible = true;
				moveFocuspointToPoint(ursprung);
				moveCameraToPoint(new THREE.Vector3(10,10,20));

				controls.maxPolarAngle = 0.3 * Math.PI;
				controls.minPolarAngle = 0.3 * Math.PI;
			 
			}

			function videoWand() {

				seitenEbene = 2;
				controls.enabled = false;

				hideSpheres();

				controls.maxPolarAngle = Math.PI;
				controls.minPolarAngle = 0.0;

			}

			function drehbruecke() {

				seitenEbene = 3;
				controls.enabled = false;

				controls.maxPolarAngle = Math.PI;
				controls.minPolarAngle = 0.0;

				let pc = new THREE.Vector3();
				let pf = new THREE.Vector3();
				model.getObjectByName("drehKamera").getWorldPosition(pc);
				model.getObjectByName("drehFocus").getWorldPosition(pf);
				moveFocuspointToPoint(pf);
				moveCameraToPoint(pc);

			}
			
			function kraehenteich() {

				seitenEbene = 3;
				controls.enabled = false;

				controls.maxPolarAngle = Math.PI;
				controls.minPolarAngle = 0.0;

				let pc = new THREE.Vector3();
				let pf = new THREE.Vector3();
				model.getObjectByName("krKamera").getWorldPosition(pc);
				model.getObjectByName("krFocus").getWorldPosition(pf);
				moveFocuspointToPoint(pf);
				moveCameraToPoint(pc);

			}
			
			function beckergrube() {

				seitenEbene = 3;
				controls.enabled = false;

				controls.maxPolarAngle = Math.PI;
				controls.minPolarAngle = 0.0;

				let pc = new THREE.Vector3();
				let pf = new THREE.Vector3();
				model.getObjectByName("beckKamera").getWorldPosition(pc);
				model.getObjectByName("beckFocus").getWorldPosition(pf);
				moveFocuspointToPoint(pf);
				moveCameraToPoint(pc);

			}


			function zurueck() {

				if (seitenEbene == 1) {
					landingpage();
				}
				if (seitenEbene == 2) {
					startseite();
				}
				if (seitenEbene == 3) {
					modelSeite();
				}

			}

			function sommer() {
				jahreszeitSommer = true;
				szenarioWechsel(model);
			}

			function winter() {
				jahreszeitSommer = false;
				szenarioWechsel(model);
			}

			function rcp26() {
				rcpSzenario = 1;
				szenarioWechsel(model);
			} 
			
			function rcp45() {
				rcpSzenario = 2;
				szenarioWechsel(model);
			} 
			
			function rcp85() {
				rcpSzenario = 3;
				szenarioWechsel(model);
			}

            function rcpNone(){
                rcpSzenario = 0;
                szenarioWechsel(model);
            }

			function szenarioWechsel(o) {

				let zielErreicht = false;
				if (o.children) {
					for (let i = 0; i < o.children.length; i++) {
						if (o.children[i].name.startsWith("26")) {
							zielErreicht = true;
							if (rcpSzenario == 1) {
								if (jahreszeitSommer) {
									//console.log("RCP 2.6 Sommer");
									makeChildrenVisible(o.children[i].children[1]);
									makeChildrenInvisible(o.children[i].children[0]);
								}else{
									//console.log("RCP 2.6 Winter");
									makeChildrenVisible(o.children[i].children[0]);
									makeChildrenInvisible(o.children[i].children[1]);
								}
							}else{
								makeChildrenInvisible(o.children[i].children[0]);
								makeChildrenInvisible(o.children[i].children[1]);
							}
						}
						if (o.children[i].name.startsWith("45")) {
							zielErreicht = true;
							if (rcpSzenario == 2) {
								if (jahreszeitSommer) {
									//console.log("RCP 4.5 Sommer");
									makeChildrenVisible(o.children[i].children[1]);
									makeChildrenInvisible(o.children[i].children[0]);
								}else{
									//console.log("RCP 4.5 Winter");
									makeChildrenVisible(o.children[i].children[0]);
									makeChildrenInvisible(o.children[i].children[1]);
								}
							}else{
								makeChildrenInvisible(o.children[i].children[0]);
								makeChildrenInvisible(o.children[i].children[1]);
							}
						}
						if (o.children[i].name.startsWith("85")) {
							zielErreicht = true;
							if (rcpSzenario == 3) {
								if (jahreszeitSommer) {
									//console.log("RCP 8.5 Sommer");
									makeChildrenVisible(o.children[i].children[1]);
									makeChildrenInvisible(o.children[i].children[0]);
								}else{
									//console.log("RCP 8.5 Winter");
									makeChildrenVisible(o.children[i].children[0]);
									makeChildrenInvisible(o.children[i].children[1]);
								}
							}else{
								makeChildrenInvisible(o.children[i].children[0]);
								makeChildrenInvisible(o.children[i].children[1]);
							}
						}
						
						if ((!zielErreicht)) szenarioWechsel(o.children[i]);
					}
				}
			}

			function makeChildrenVisible(o) {
				for (let i = 0; i < o.children.length; i++) {
					o.children[i].visible = true;
					//console.log(o.children[i].name + " ist jetzt sichtbar.");
					if (o.children[i].children) {
						makeChildrenVisible(o.children[i]);
					}
				}
			}

			function makeChildrenInvisible(o) {
				for (let i = 0; i < o.children.length; i++) {
					o.children[i].visible = false;
					//console.log(o.children[i].name + " ist jetzt unsichtbar.");
					if (o.children[i].children) {
						makeChildrenInvisible(o.children[i]);
					}
				}
			}


			function moveCameraToPoint(p) {

				const coordsCam = { x: camera.position.x, y: camera.position.y, z: camera.position.z};
				new TWEEN.Tween(coordsCam)
				.to({ x: p.x, y: p.y, z:p.z})
				.onUpdate(() =>
					camera.position.set(coordsCam.x, coordsCam.y, coordsCam.z)
				)
				.start();

			}

			function moveFocuspointToPoint(p) {

				const coords = { x: controls.target.x, y: controls.target.y, z: controls.target.z};
				new TWEEN.Tween(coords)
				.to({ x: p.x, y: p.y, z:p.z})
				.onUpdate(() =>
					controls.target.set(coords.x, coords.y, coords.z)
				)
				.start();

			}




			function findIntersections() {
			
				var mouse = {
					x: (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
					y: -(event.clientY / renderer.domElement.clientHeight) * 2 + 1,
				}
				raycaster.setFromCamera(mouse, camera)

				var intersects = raycaster.intersectObjects(scene.children, true);


				if (intersects.length > 0) {
					if ( intersected != intersects[0].object ) {	
						if ( intersected ) {
							intersected.material.emissive.setHex( intersected.currentHex );
							container.style.cursor = 'auto';
						}
					
						intersected = intersects[0].object;
						intersectedPoint = intersects[0].point;
						
						if (intersected.name.startsWith("sphere")) {
							intersected.currentHex = intersected.material.emissive.getHex();
							intersected.material.emissive.setHex( 0x004f3f ); //0x004f3f
							container.style.cursor = 'pointer';
						}
					}
				} else {
					if ( intersected ) {
						intersected.material.emissive.setHex( intersected.currentHex );
						container.style.cursor = 'auto';
					}
					
					intersected = null;
					intersectedPoint = null;
				}

			}


			function intersectedIstAnwaehlbar(o) {
				
				/*
				if ( o.name.startsWith('DrehbrückeStadtteil') && seitenEbene == 2) return true;
				if ( o.name.startsWith('BeckergrubeStadtteil') && seitenEbene == 2) return true;
				if ( o.name.startsWith('KrähenteichStadtteil') && seitenEbene == 2) return true;
				if ( o.name.startsWith('Lübeck_Objekt_Ausschnitte') && seitenEbene == 1) return true;
				if ( o.name.startsWith('Video') && seitenEbene == 1) return true;
				return false;
				*/

				if ( o.name.startsWith('sphere')) return true;
				return false;
				
			}



			function modelWechsel(modelPfad) {

				if (model) {
					scene.remove(model);
				}
				console.log("Step 1");

				loader.load( modelPfad, function ( gltf ) {

					console.log("Step 2");

					model = gltf.scene;
					model.position.set( 0, 0, 0 );
					model.scale.set( 0.01, 0.01, 0.01);
					scene.add( model );

					//mixer = new THREE.AnimationMixer( model );
					//mixer.clipAction( gltf.animations[ 0 ] ).play();

					animate();

					console.log("Step 3");

				}, undefined, function ( e ) {

					console.error( e );

				} );

			}


			function animate() {

				requestAnimationFrame( animate );

				const delta = clock.getDelta();
				mixer.update( delta );

				controls.update();

				stats.update();

				renderer.render( scene, camera );

				TWEEN.update();

			}

export{sommer, winter, rcp26, rcp45, rcp85, rcpNone, zurueck}
            