// Инициализация параметров модели
var lw = 1.2;              // отношение длина/ширина
var r = 0.06;              // высота рундиста
var t = 0.6;       		   // размер площадки
var hCrown = 0.3;	       // высота короны
var hp = 0.6;			   // глубина павильона
var model_width = 8.0;	   // ширина модели

var vertices = []; // в этот массив записывется результат 
			       //работы функции VerticesCalculation()
var points = [];    // массив для хранения вершин всех полигонов в виде THREE.Vector3

var scene, renderer, orbitControl;

var mesh1, geometry1, mesh2, geometry2, material;

var flat = true;

var DEGREE = 0.01745329251994; // величина углового градуса в радианах

var canvas;

var TWO_MODELS = true;  // используется в polyhedron.js если создается 
                         // второй экземпляр 3D-модели с той же топологией

function init()
{	
	canvas = document.getElementById("canvas");
	var width = canvas.width;
	var height = canvas.height;

	// Создаем трехмерную сцену, перспективную камеру и рендерер
	scene = new THREE.Scene();

	// Создаем ортогональную камеру.
	var aspect = width / height;
	var frustumSize = 20;
	camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, 
											frustumSize * aspect / 2, frustumSize / 2, 
											frustumSize / - 2, 1, 2000 );
	camera.position.x = 5;
	camera.position.y = 10;
	camera.position.z = -20;
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	
	
	// Создаем renderer
	renderer = new THREE.WebGLRenderer({canvas: canvas});
	renderer.setClearColor(0xEEEEEE, 1.0);
	renderer.setSize(width, height);

	// Элемент управления дающий возможность осматривать модель пирамиды со всех сторон.
	orbitControl = new THREE.OrbitControls(camera, canvas);

	// Расчет координат вершин 3D модели.
    VerticesCalculation();
	// Создание топологии 3D модели с учетом координат вершин и их взаимосвязи.
	CreatePolyhedron();

	// Facets
	points.length = 0;	
	var i, j;
	var el = 0;
	
	for (i = 0; i < vertices.length/3; i++)
	{
		var point3 = new THREE.Vector3();
		for (j = 0; j < 3; j++)
		{
			point3.x = vertices[el];
			point3.y = vertices[el + 1];
			point3.z = vertices[el + 2];
		}
		points.push(point3);
		el = el + 3;
	}
			
//	material = new THREE.MeshLambertMaterial({ color: 0xffffff });
	material = new THREE.MeshPhongMaterial({ color: 0xffffff });
	
	geometry1 = new THREE.Geometry();
	geometry1.vertices = points;
	geometry1.faces = faces;
	geometry1.computeFaceNormals();
	mesh1 = new THREE.Mesh(geometry1, material);
	scene.add(mesh1);
	
	geometry2 = new THREE.Geometry();
	geometry2.vertices = points;
	geometry2.faces = faces2;
	geometry2.computeVertexNormals();
	mesh2 = new THREE.Mesh(geometry2, material);
	
	mesh1.rotation.set(0, 1, 0);
	mesh2.rotation.set(0, 1, 0);
	mesh1.scale.set(1.5, 1.5, 1.5);
	mesh2.scale.set(1.5, 1.5, 1.5);
	
   var ambienLight = new THREE.AmbientLight(0x555555);
   //scene.add(ambienLight);

    // add spotlight for the shadows
    var spotLight1 = new THREE.SpotLight(0xff7700);
    spotLight1.position.set(100, 0, 0);
	scene.add(spotLight1);
	
    var spotLight2 = new THREE.SpotLight(0xff7700);
    spotLight2.position.set(-100, 0, 0);
	scene.add(spotLight2);
	
    // add spotlight for the shadows
    var spotLight3 = new THREE.SpotLight(0xff7700);
    spotLight3.position.set(0, 100, 0);
	scene.add(spotLight3);
	
    var spotLight4 = new THREE.SpotLight(0xff7700);
    spotLight4.position.set(0, -100, 0);
	scene.add(spotLight4);
	
    // add spotlight for the shadows
    var spotLight5 = new THREE.SpotLight(0xff7700);
    spotLight5.position.set(0, 0, 100);
	scene.add(spotLight5);

    var controller = new function() 
	{
		this.rotationX = 0;
		this.rotationY = 0;
		this.rotationZ = 0;

		this.Light1_X = 100;
		this.Light1_Y = 0;
		this.Light1_Z = 0;

		this.Light2_X = -100;
		this.Light2_Y = 0;
		this.Light2_Z = 0;
		
		this.flat = true;
    }();	
	
	// Создаем новый объект dat.GUI.
	var gui = new dat.GUI({ autoPlace: false });
	gui.domElement.id = 'gui';
	gui_container_light.appendChild(gui.domElement);
	
	var f1 = gui.addFolder('Mesh rotation');	
	f1.add(controller, 'rotationX', -180, 180).onChange( function() 
	{
		orbitControl.enabled = false;
		mesh1.rotation.x = (controller.rotationX)*DEGREE;
		mesh2.rotation.x = (controller.rotationX)*DEGREE;
	});
	f1.add(controller, 'rotationY', -180, 180).onChange( function() 
	{
		orbitControl.enabled = false;
		mesh1.rotation.y = (controller.rotationY)*DEGREE;
		mesh2.rotation.y = (controller.rotationX)*DEGREE;
	});
	f1.add(controller, 'rotationZ', -180, 180).onChange( function() 
	{
		orbitControl.enabled = false;
		mesh1.rotation.z = (controller.rotationZ)*DEGREE;
		mesh2.rotation.z = (controller.rotationX)*DEGREE;
	});	
	
    var f2 = gui.addFolder('Light 1');
    f2.add(controller, 'Light1_X', -200, 200).onChange( function() 
	{
		orbitControl.enabled = false;
		spotLight1.position.set(controller.Light1_X, controller.Light1_Y, controller.Light1_Z);
    });
	f2.add(controller, 'Light1_Y', -200, 200).onChange( function() 
	{
		orbitControl.enabled = false;
		spotLight1.position.set(controller.Light1_X, controller.Light1_Y, controller.Light1_Z);
    });
    f2.add(controller, 'Light1_Z', -200, 200).onChange( function() 
	{
		orbitControl.enabled = false;
		spotLight1.position.set(controller.Light1_X, controller.Light1_Y, controller.Light1_Z);
    });

	gui.add( controller, 'flat', false ).onChange( function() 
	{
		flat = controller.flat;
	
		if (flat == true)
		{
			scene.remove(mesh2);
			scene.add(mesh1);
		}
		else
		{
			scene.remove(mesh1);
			scene.add(mesh2);
		}
	});

	// Отображение на экран.
	render();	
}	

function render() 
{
	orbitControl.enabled = true;
	requestAnimationFrame(render);
	renderer.render(scene, camera);
}

////////////////////////////////////////////////////////////////////////////////////
//              Расчет координат вершин огранки (модели)
////////////////////////////////////////////////////////////////////////////////////

var index_cut = [
	0, 3, 2, 1, 0,  // грань 0
	0, 4, 7, 3, 0,  // грань 1
	1, 5, 4, 0, 1,  // грань 2
	2, 6, 5, 1, 2,  // грань 3
	3, 7, 6, 2, 3,  // грань 4
	4,  8, 11, 7, 4, // грань 5
	5,  9,  8, 4, 5, // грань 6
	6, 10,  9, 5, 6, // грань 7
	7, 11, 10, 6, 7, // грань 8
	12, 11,  8, 12, // грань 9
	12,  8,  9, 12, // грань 10
	12,  9, 10, 12, // грань 11
	12, 10, 11, 12, // грань 12
	-100      
];

// Вспомогательный массив для хранения координат вершин рундиста
var girdle = [8];

function VerticesCalculation()
{
	// Вспомогательные массивы
	var crown = [4];
	var pavil = [1];

	InitGirdle ();
	
	// Координаты вершин короны в % к ширине огранки
	crown[0] = new Point3D(   0.5 * t * lw,   0.5 * t, hCrown + r/2);
	crown[1] = new Point3D(   0.5 * t * lw, - 0.5 * t, hCrown + r/2);
	crown[2] = new Point3D( - 0.5 * t * lw, - 0.5 * t, hCrown + r/2);
	crown[3] = new Point3D( - 0.5 * t * lw,   0.5 * t, hCrown + r/2);

	pavil[0] = new Point3D(0.0, 0.0, -hp);
	
	// Заполняем массив vertices.
	var i;
	for(i = 0; i < 4; i++)
	{
		vertices.push(model_width * crown[i][0]);
		vertices.push(model_width * crown[i][1]);
		vertices.push(model_width * crown[i][2]);
	}
	for(i = 0; i < 8; i++)
	{
		vertices.push(model_width * girdle[i][0]);
		vertices.push(model_width * girdle[i][1]);
		vertices.push(model_width * girdle[i][2]);
	}
	for(i = 0; i < 1; i++)
	{
		vertices.push(model_width * pavil[i][0]);
		vertices.push(model_width * pavil[i][1]);
		vertices.push(model_width * pavil[i][2]);
	}								 
}

function InitGirdle ()
{
	girdle[0] = new Point3D(  lw * 0.5,   0.5,   r/2);
	girdle[1] = new Point3D(  lw * 0.5, - 0.5,   r/2);
	girdle[2] = new Point3D(- lw * 0.5, - 0.5,   r/2);
	girdle[3] = new Point3D(- lw * 0.5,   0.5,   r/2);
	girdle[4] = new Point3D(  lw * 0.5,   0.5, - r/2);
	girdle[5] = new Point3D(  lw * 0.5, - 0.5, - r/2);
	girdle[6] = new Point3D(- lw * 0.5, - 0.5, - r/2);
	girdle[7] = new Point3D(- lw * 0.5,   0.5, - r/2);
}

//////////////////////////////////////////////////////////////
// Цвета для раскраски граней модели
//////////////////////////////////////////////////////////////

function facet_colors()
{
	var ind = 0;

	// table
	colors[ind] = new THREE.Color("rgb(200, 200, 200)"); // 0, 3, 2, 1, 0,    грань 0
	ind++;
	
	// crown
	colors[ind] = new THREE.Color("rgb(250, 190, 190)"); // 0, 4, 7, 3, 0,    грань 1
	ind++;
	colors[ind] = new THREE.Color("rgb(190, 250, 190)"); // 1, 5, 4, 0, 1,    грань 2
	ind++;
	colors[ind] = new THREE.Color("rgb(190, 190, 250)"); // 2, 6, 5, 1, 2,    грань 3
	ind++;
	colors[ind] = new THREE.Color("rgb(150, 250, 250)"); // 3, 7, 6, 2, 3,    грань 4
	ind++;
	
	// girdle
	colors[ind] = new THREE.Color("rgb(200, 200, 200)"); // 4, 8, 11, 7, 4,   грань 5
	ind++;
	colors[ind] = new THREE.Color("rgb(170, 170, 170)"); // 5, 9, 8, 4, 5,    грань 6
	ind++;
	colors[ind] = new THREE.Color("rgb(200, 200, 200)"); // 6, 10, 9, 5, 6,   грань 7
	ind++;
	colors[ind] = new THREE.Color("rgb(170, 170, 170)"); // 7, 11, 10, 6, 7,  грань 8
	ind++;
	
	// Pavilion
	colors[ind] = new THREE.Color("rgb(250, 190, 190)"); // 12, 11, 8, 12,    грань 9
	ind++;
	colors[ind] = new THREE.Color("rgb(190, 250, 190)"); // 12, 8, 9, 12,     грань 10
	ind++;
	colors[ind] = new THREE.Color("rgb(190, 190, 250)"); // 12, 9, 10, 12,    грань 11
	ind++;
	colors[ind] = new THREE.Color("rgb(150, 250, 250)"); // 12, 10, 11, 12,   грань 12
};

window.onload = init;
