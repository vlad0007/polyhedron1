// pyramid.js

var meshes = [];  // массив объектов mesh (полигонов для three.js)
var points = [];    // массив для хранения вершин всех полигонов в виде THREE.Vector3
var colors = [];    // массив в котором хранятся цвета граней
var edges = []; // массив для хранения ребер полигонов

var canvas; // canvas для отображения 3D-модели
var scene, camera, renderer, orbitControl, raycaster;

// используется для отображения/изменения значений параметров модели
var controller;

var hud;    // canvas для отображения параметров
var ctx;	// двумерный контекст для рисования на холсте (на canvas)
			// значений параметров, привязан к hud

var numbers = [];
var enumeration1 = false; // для переключателя номеров вершин модели (да/нет)
var enumeration2 = false;

// Следующие 5 строк для raycaster.
var mouse = new THREE.Vector2();
mouse.x = 800;
mouse.y = 600;
var select_index = -1;
var old_color;

// Масштабный множитель для полигонов при их отображении
var kf = 12.0; 
// Масштабный множитель для ребер при их отображении
var kf_edges = 12.1;

var TWO_MODELS = false;  // используется в polyhedron.js если создается 
                         // второй экземпляр 3D-модели с той же топологией
						 
var DEGREE = 0.01745329251994; // величина углового градуса в радианах

var error = false;
var error_vertex = -1;
var error_facet = -1;

var pointX = 0;
var pointY = 0;
var pointZ = 0;

function init()
{	
	document.getElementById("btn_no").checked = true;
	document.getElementById("btn_no").addEventListener("change", radio_no);
	document.getElementById("btn_all").addEventListener("change", radio_all);
	document.getElementById("btn_cr_gd_pav").addEventListener("change", radio_cr_gd_pav);
	
	canvas = document.getElementById("canvas");
	
	// Создаем трехмерную сцену, перспективную камеру и рендерер
	scene = new THREE.Scene();
/*	
	// Если перспективная камера.
	camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 0.1, 1000);
	camera.position.x = 5;
	camera.position.y = 10;
	camera.position.z = -20;
*/
	var width = canvas.width;
	var height = canvas.height;
	var aspect = width / height;
	var frustumSize = 20;
	camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, 
											frustumSize * aspect / 2, frustumSize / 2, 
											frustumSize / - 2, 1, 2000 );
	camera.position.x = 5;
	camera.position.y = 10;
	camera.position.z = -20;
	
	camera.lookAt(new THREE.Vector3(0, 0, 0));	
	scene.add(camera);
	
	// Создаем renderer
	renderer = new THREE.WebGLRenderer({canvas: canvas});
	renderer.setClearColor(0xEEEEEE, 1.0);
	renderer.setSize(canvas.width, canvas.height);

	// Элемент управления дающий возможность осматривать модель пирамиды со всех сторон.
	orbitControl = new THREE.OrbitControls(camera, canvas);
	raycaster = new THREE.Raycaster();
	
	// Создаем 2D холст на который будем выводить 
	// вспомогательную информацию (например значения параметров).
	hud = document.getElementById("canvas_pars");
	ctx = hud.getContext('2d');
	if (!ctx) 
	{
		console.log('Failed to get rendering context');
		return;
	}	
	
	//           Создание мешей двух типов
	// 1. Для прорисовки цветных граней используется массив meshes.
	//    Каждая грань представлена одним мешем в массиве полигонов.
	// 2. Для прорисовки ребер граней используется массив edges.
	//    Каждый полигон представлен одним массивом, окаймляющих его ребер, 
	//    в общем массиве ребер всей модели.	
	create_meshes();
	
	// Для задания значений параметров будем использовать библиотеку dat.GUI
	// В объекте controller определяем свойства для параметров модели и их
	// начальные значения.
    controller = new function() 
	{
      this.lw = lw;
      this.r = r;
	  this.square_deviation = square_deviation;
	  
      this.beta = beta / DEGREE;
	  this.t = t;
	  this.dSquare = dSquare;
	  this.star_facets = star_facets;
	  
	  this.alpha = alpha / DEGREE;
	  this.hPavFacet = hPavFacet;
	  this.culet = culet;
	  this.culet_R = culet_R;
	  this.culet_A = culet_A / DEGREE;
	  this.low_az = low_az / DEGREE;
	  this.up_az = up_az / DEGREE;
	  
	  this.hCrown = Math.tan(beta) * (1 - t) / 2;
	  this.beta_hCrownFix = beta / DEGREE;
	  this.hPavilion = Math.tan(alpha) * (1 - culet) / 2;
	  this.full_height = r + Math.tan(alpha) * (1 - culet) / 2 + Math.tan(beta) * (1 - t) / 2;
	  
	  this.culet_offsetX = culet_R * Math.cos(culet_A);
	  this.culet_offsetY = - culet_R * Math.sin(culet_A);
	  
	  this.enumeration1 = false;	
	  this.enumeration2 = false;	
    }();	
	
	// Создаем новый объект dat.GUI.
	var gui = new dat.GUI({ autoPlace: false });
	gui.domElement.id = 'gui';
	gui_container_big.appendChild(gui.domElement);
	
	// Рундист
    var f1 = gui.addFolder('Girdle');
    f1.add(controller, 'lw', 0.3, 4.0).onChange( function() 
	{
	   var temp = lw;
	   orbitControl.enabled = false;
       lw = controller.lw;
	   recalc();
	   if (isCorrect() == -1) 
	   {
		   lw = temp;
		   recalc();
		   controller.lw = temp;
	   }
	   gui.updateDisplay();
    });
    f1.add(controller, 'r', 0.0001, 0.5).onChange( function() 
	{
		var temp = r;
		orbitControl.enabled = false;
		r = controller.r;
		recalc();
	    if (isCorrect() == -1) 
	    {
		   r = temp;
		   recalc();
	    }
		gui.updateDisplay();
	});
    f1.add(controller, 'square_deviation', -1, 1).onChange( function() 
	{
		var temp = square_deviation;
		orbitControl.enabled = false;
		square_deviation = controller.square_deviation;
		recalc();
	    if (isCorrect() == -1) 
	    {
		   square_deviation = temp;
		   recalc();
		   controller.square_deviation = temp;
	    }		
		gui.updateDisplay();
	});

	// Корона
    var f2 = gui.addFolder('Crown');
    f2.add(controller, 'beta', 10, 80).onChange( function() 
	{
		var temp = beta;
		orbitControl.enabled = false;
		beta = (controller.beta) * DEGREE;
		recalc();
	    if (isCorrect() == -1) 
	    {
		   beta = temp;
		   recalc();
	    }		
		controller.hCrown = Math.tan(beta) * (1 - t) / 2;
		controller.beta = beta / DEGREE;
		controller.beta_hCrownFix = beta / DEGREE;
		gui.updateDisplay();
	});
	
    f2.add(controller, 'beta_hCrownFix', 10, 80).onChange( function() 
	{
		var temp1 = beta;
		var temp2 = t;
		orbitControl.enabled = false;
		beta = (controller.beta_hCrownFix) * DEGREE;
		t = 1 - Math.tan(temp1) / Math.tan(beta) * (1 - t);
		recalc();
	    if (isCorrect() == -1) 
	    {
		   beta = temp1;
		   t = temp2;
		   recalc();
	    }		
		controller.hCrown = Math.tan(beta) * (1 - t) / 2;
		controller.t = t;
		controller.beta = beta / DEGREE;
		controller.beta_hCrownFix = beta / DEGREE;
		gui.updateDisplay();
	});	
	
    f2.add(controller, 'hCrown', 0.001, 0.99).onChange( function() 
	{
		var temp = t;
		orbitControl.enabled = false;
		hCrown = controller.hCrown;
		var h = Math.tan(beta);
		t = 1 - 2 * hCrown / h;
		recalc();
	    if (isCorrect() == -1) 
	    {
		   t = temp;
		   recalc();
	    }		
		controller.t = t;
		controller.hCrown = Math.tan(beta) * (1 - t) / 2;		
		gui.updateDisplay();
	});	
 
    f2.add(controller, 't', 0.01, 0.9).onChange( function() 
	{
		var temp = t;
		orbitControl.enabled = false;
		t = controller.t;
		recalc();
	    if (isCorrect() == -1) 
	    {
		   t = temp;
		   recalc();
	    }	
		controller.t = t;
		controller.hCrown = Math.tan(beta) * (1 - t) / 2;
		gui.updateDisplay();
    });	
	
    f2.add(controller, 'dSquare', -0.5, 0.5).onChange( function() 
	{
		var temp = dSquare;
		orbitControl.enabled = false;
		dSquare = controller.dSquare;
		recalc();
	    if (isCorrect() == -1) 
	    {
		   dSquare = temp;
		   recalc();
	    }	
		controller.dSquare = dSquare;
		controller.star_facets = star_facets;
		gui.updateDisplay();
    });	
	
    f2.add(controller, 'star_facets'); 
	
	// Павильон
	var f3 = gui.addFolder('Pavilion');
    f3.add(controller, 'alpha', 10.0, 80.0).onChange( function() 
	{
		var temp = alpha;
		orbitControl.enabled = false;
		alpha = (controller.alpha) * DEGREE;
		recalc();   
	    if (isCorrect() == -1) 
	    {
		   alpha = temp;
		   recalc();
	    }			
		controller.alpha = temp / DEGREE;
		controller.hPavilion = Math.tan(alpha) * (1 - culet) / 2;
		gui.updateDisplay();
    });
	
    f3.add(controller, 'hPavilion', 0.01, 0.99).onChange( function()
	{
		var temp = alpha;
		orbitControl.enabled = false;
		hPavilion = controller.hPavilion;
		alpha = Math.atan2(hPavilion + hPavilion, 1 - culet);
		recalc(); 
	    if (isCorrect() == -1) 
	    {
		   alpha = temp;
		   recalc();
	    }	
		controller.alpha = alpha / DEGREE;
		controller.hPavilion = Math.tan(alpha) * (1 - culet) / 2;
		gui.updateDisplay();		
	});
	
    f3.add(controller, 'hPavFacet', 0.1, 0.95).onChange( function() 
	{
		var temp = hPavFacet;
		orbitControl.enabled = false;
		hPavFacet = controller.hPavFacet;
		recalc(); 
	    if (isCorrect() == -1) 
	    {
		   hPavFacet = temp;
		   recalc();
	    }	
		controller.hPavFacet = hPavFacet;
		gui.updateDisplay();
    });

    f3.add(controller, 'culet', 0.00001, 0.95).onChange( function() 
	{
		var temp = culet;
		orbitControl.enabled = false;
		culet = controller.culet;
		recalc(); 
	    if (isCorrect() == -1) 
	    {
		   culet = temp;
		   recalc();
	    }	
		controller.culet = culet;
		gui.updateDisplay();
    });
	
    f3.add(controller, 'culet_R', -0.3, 0.3).onChange( function() 
	{
		var temp = culet_R;
		orbitControl.enabled = false;
		culet_R = controller.culet_R;
		recalc(); 
	    if (isCorrect() == -1) 
	    {
		   culet_R = temp;
		   recalc();
	    }
		controller.culet_R = culet_R;
		controller.culet_offsetX = culet_R * Math.cos(culet_A);
		controller.culet_offsetY = - culet_R * Math.sin(culet_A);
		gui.updateDisplay();
    });
	
    f3.add(controller, 'culet_A', -360.0, 360.0).onChange( function() 
	{
		var temp = culet_A;
		orbitControl.enabled = false;
		culet_A = (controller.culet_A) * DEGREE;
		recalc();   
	    if (isCorrect() == -1) 
	    {
		   culet_A = temp;
		   recalc();
	    }
		controller.culet_A = culet_A / DEGREE;
		controller.culet_offsetX = culet_R * Math.cos(culet_A);
		controller.culet_offsetY = - culet_R * Math.sin(culet_A);
		gui.updateDisplay();
    });
	
    f3.add(controller, 'culet_offsetX', -0.3, 0.3).onChange( function() 
	{
		var temp1 = culet_R;
		var temp2 = culet_A;
		orbitControl.enabled = false;
		var x = controller.culet_offsetX;
		var y = - culet_R * Math.sin(culet_A);
		if ((Math.abs(x) < 0.000001) && (Math.abs(y) < 0.000001))
		{
			culet_A = 0.00001;
		}
		else
		{
			culet_A = - Math.atan2(y,x);
		}
		culet_R = Math.sqrt(x*x + y*y);
		recalc();   

		if (isCorrect() == -1) 
	    {
			culet_R = temp1;
			culet_A = temp2;
			recalc();
	    }			
		controller.culet_R = culet_R;
		controller.culet_A = culet_A / DEGREE;
		controller.culet_offsetX = culet_R * Math.cos(culet_A);
		controller.culet_offsetY = - culet_R * Math.sin(culet_A);
		gui.updateDisplay();
    });		
	
    f3.add(controller, 'culet_offsetY', -0.3, 0.3).onChange( function() 
	{
		var temp1 = culet_R;
		var temp2 = culet_A;
		orbitControl.enabled = false;
		var x = culet_R * Math.cos(culet_A);
		var y = controller.culet_offsetY;
		if ((Math.abs(x) < 0.000001) && (Math.abs(y) < 0.000001))
		{
			culet_A = 0;
		}
		else
		{
			culet_A = - Math.atan2(y,x);
		}
		culet_R = Math.sqrt(x*x + y*y);
		recalc();   

		if (isCorrect() == -1) 
	    {
			culet_R = temp1;
			culet_A = temp2;
			recalc();
	    }			
		controller.culet_R = culet_R;
		controller.culet_A = culet_A / DEGREE;
		controller.culet_offsetX = culet_R * Math.cos(culet_A);
		controller.culet_offsetY = - culet_R * Math.sin(culet_A);
		gui.updateDisplay();
    });	
	
	var f4 = gui.addFolder('Advanced setting');
    f4.add(controller, 'low_az', -30.0, 30.0).onChange( function() 
	{
		var temp = low_az;
		orbitControl.enabled = false;
		low_az = (controller.low_az) * DEGREE;
		recalc();   
	    if (isCorrect() == -1) 
	    {
		   low_az = temp;
		   recalc();
		   controller.low_az = temp / DEGREE;
	    }			
		gui.updateDisplay();
    });
	
    f4.add(controller, 'up_az', -30.0, 30.0).onChange( function() 
	{
		var temp = up_az;
		orbitControl.enabled = false;
		up_az = (controller.up_az) * DEGREE;
		recalc();   
	    if (isCorrect() == -1) 
	    {
		   up_az = temp;
		   recalc();
		   controller.low_up = temp / DEGREE;
	    }			
		gui.updateDisplay();
    });

	f4.add(controller, 'full_height', 0.005, 5.0).onChange( function() 
	{
		var temp1 = beta;
		var temp2 = alpha;
		var temp3 = r;
		orbitControl.enabled = false;
		
		var value = controller.full_height;
		
		var hp = Math.tan(alpha) * (1 - culet) / 2;
		var hCrown = Math.tan(beta) * (1 - t) / 2;
		var ratio = value / (r + hp + hCrown);
		hCrown = ratio * hCrown;
		beta = Math.atan2(hCrown, (0.5 - t/2));
		hp = ratio * hp;
		alpha = Math.atan2(2 * hp, 1 - culet);
		r = r * ratio;		
		recalc(); 
	    if (isCorrect() == -1) 
	    {
			beta = temp1;
			alpha = temp2;
			r = temp3;
			recalc();
	    }
		controller.beta  = beta / DEGREE;
		controller.alpha = alpha / DEGREE;
		controller.r = r;
		controller.full_height = r + Math.tan(alpha) * (1 - culet) / 2 + Math.tan(beta) * (1 - t) / 2;
		controller.hCrown = Math.tan(beta) * (1 - t) / 2;
		controller.beta_hCrownFix = beta / DEGREE;
		controller.hPavilion = Math.tan(alpha) * (1 - culet) / 2;
		gui.updateDisplay();
    });

	
	// Вывод на сцену массива полигонов.
	for(var i = 0; i < meshes.length; i++) 
	{
		scene.add(meshes[i]);	
	}
	
	// Вывод на сцену общего массива ребер.
	for(var i = 0; i < edges.length; i++) 
	{
		scene.add(edges[i]);	
	}

	// Установка обработчика события mousemove
	canvas.addEventListener( 'mousemove', onDocumentMouseMove, false );
	
	// Отображение на экран.
	render();	
}	

function create_meshes()
{
	// Предварительная очистка массивов.
	vertices.length = 0;
	plgs.length = 0;
	faces.length = 0;
	colors.length = 0;
	edges.length = 0;
	meshes.length = 0;
	points.length = 0;
		
	// Расчет координат вершин 3D модели.
    VerticesCalculation();
	// Создание топологии 3D модели с учетом координат вершин и их взаимосвязи.
	CreatePolyhedron();
	// Вывод на холст hud значений параметров.
	pars_value();
	
	// Facets
	var i, j;
	var el = 0;

	// Каждые три последовательные значения, 
	// соответствующие одной вершшине модели (массив vertices)  
	// переводим в координаты x, y, z вершины модели с типом THREE.Vector3.
	for (i = 0; i < vertices.length/3; i++)
	{
		var point3 = new THREE.Vector3();
		for (j = 0; j < 3; j++)
		{
			point3.x = kf * vertices[el];
			point3.y = kf * vertices[el + 1];
			point3.z = kf * vertices[el + 2];
		}
		points.push(point3);
		el = el + 3;
	}

	// Задаем цвет каждой грани.
	facet_colors();
	
	// Meshes (полигоны)
	
	// Для каждой грани создаем отдельный меш.
	//   Это сделано по двум причинам:
	// Во-первых отдельные меши граней легче раскрасить,
	// чем раскрашивать отдельные грани модели, если они входят
	// как части в единую модель огранки.
	// Во-вторых, если мы при помощи "raycaster" будем
	// выбирать отдельные грани (в данной программе это не реализовано,
	// но это присутствует в остальных моделях: Octagon, Brilliant ...)
	// то опять же "raycaster" удобнее использовать для модели 
	// представляющей собой не единую модель, а модель составленную
	// из отдельных моделей граней.
	// В том случае если для отображения исползуются шейдеры, то наоборот
	// удобнее использовать единую модель, а не модель состоящую
	// из отдельных граней. Это продемонстрировано в моделях Octagon, Brilliant,
	// MoonMarquise, ... в режимах работы этих программ, где применяются шейдеры.
	
	for (i = 0; i < plgs.length; i++) // цикл по всем граням
	{
		var geometry = new THREE.Geometry();
		geometry.vertices = points;
		var plg = plgs[i]; 
		var index_triangle = plg.IndexTriangle;
		for (var j = 0; j < index_triangle.length; j++)
		{
			index_triangle[j].color = colors[i]; // цвет всех треугольников
				// на которые разбита грань один и тот же и определяется
				// цветом всей грани из файла pyramid_colors.js
		}
		geometry.faces = index_triangle;
		geometry.computeFaceNormals();
		geometry.faces = index_triangle; 
		var material = new THREE.MeshBasicMaterial( { vertexColors: THREE.FaceColors } );
		var mesh = new THREE.Mesh(geometry, material);	
		mesh.index = i;
		meshes.push(mesh);	
	}	
	
	// Lines (ребра)
	
	// После того, как нарисовали 3D модель огранки и раскрасили цвета ее граней, 
	// для лучшего зрительного восприятия модели желательно прорисовать все ее видимые ребра.
	// С этой целью создается проволочный экземпляр 3D модели и накладывается на модель
	// с раскрашенными гранями. Проволочный экземпляр 3D модели должен быть на очень 
	// небольшую величину брльше по размеру, чем модель с гранями. В этом случае
	// задние части проволочной модели будут закрыты моделью с гранями, а передние
	// ее части окажутся видимыми. Тем самым наблюдатель будет воспринимать пирамиду
	// как единую 3D модель с прорисованными ребрами.
	// Создаем материал при помощи которого будут прорисовываться ребра 3D модели.
	var material_line = new THREE.LineBasicMaterial({ color: 0x000000 });
	// Для каждой грани создаем отдельный массив ребер которые окаймляют эту грань.	
	for (i = 0; i < plgs.length; i++) // цикл по всем граням модели
	{
		var geometry_line = new THREE.Geometry();
		var points_line = [];
		var facet = plgs[i].VertexFacet;
			
		for (j = 0; j < facet.vertexes.length; j++) // цикл по вершинам текущей грани
		{
			var vert = facet.vertexes[j];
			var point3 = new THREE.Vector3(kf_edges * vert[0], kf_edges * vert[1], kf_edges * vert[2]);
			points_line.push(point3);
		}
		geometry_line.vertices = points_line;
		var mesh_line = new THREE.Line(geometry_line, material_line);
		edges.push(mesh_line);
	}	
}			

function pars_value()
{
	var text_color = "#00F";
	var value_color = "#F00";
	var h = 15;
	var dh = 16;
	var w1 = 2;
	var w2 = 220
	
	ctx.font = "italic 10pt Arial";
	
	var text = "Girdle ratio ";
	ctx.fillStyle = text_color;
	ctx.fillText(text, w1, h);		
	text = roundNumber(lw, 2);
	ctx.fillStyle = value_color;
	ctx.fillText(text, w2, h);	
	
	h = h + dh;
	text = "Girdle thickness ";
	ctx.fillStyle = text_color;
	ctx.fillText(text, w1, h);
	text = roundNumber(r*100, 3) + "%";
	ctx.fillStyle = value_color;
	ctx.fillText(text, w2, h);		

	h = h + dh;
	var text = "Square deviation ";
	ctx.fillStyle = text_color;
	ctx.fillText(text, w1, h);		
	text = roundNumber(square_deviation, 2);
	ctx.fillStyle = value_color;
	ctx.fillText(text, w2, h);			
	
	h = h + dh;
	text = "Crown angle (beta) ";
	ctx.fillStyle = text_color;
	ctx.fillText(text, w1, h);	
	text = roundNumber(beta/DEGREE, 3) + "°";
	ctx.fillStyle = value_color;
	ctx.fillText(text, w2, h);	
	
	h = h + dh;
	var text = "Crown height ";
	ctx.fillStyle = text_color;
	ctx.fillText(text, w1, h);
	var hCrown = Math.tan(beta) * (1 - t) / 2;	
	text = roundNumber(hCrown, 2);
	ctx.fillStyle = value_color;
	ctx.fillText(text, w2, h);
	
	h = h + dh;
	var text = "Table size (t) ";
	ctx.fillStyle = text_color;
	ctx.fillText(text, w1, h);		
	text = roundNumber(t, 2);
	ctx.fillStyle = value_color;
	ctx.fillText(text, w2, h);
	
	h = h + dh;
	text = "dSquare ";
	ctx.fillStyle = text_color;
	ctx.fillText(text, w1, h);	
	text = roundNumber(dSquare*100, 3) + "%";
	ctx.fillStyle = value_color;
	ctx.fillText(text, w2, h);
	
	h = h + dh;
	text = "Star facets ";
	ctx.fillStyle = text_color;
	ctx.fillText(text, w1, h);	
	text = roundNumber(star_facets*100, 3) + "%";
	ctx.fillStyle = value_color;
	ctx.fillText(text, w2, h);
	
	h = h + dh;
	text = "Pavilion angle (alpha) ";
	ctx.fillStyle = text_color;
	ctx.fillText(text, w1, h);	
	text = roundNumber(alpha/DEGREE, 3) + "°";
	ctx.fillStyle = value_color;
	ctx.fillText(text, w2, h);
	
	h = h + dh;
	var text = "Pavilion depth ";
	ctx.fillStyle = text_color;
	ctx.fillText(text, w1, h);
	var hPav = Math.tan(alpha) * (1 - culet) / 2;	
	text = roundNumber(hPav, 2);
	ctx.fillStyle = value_color;
	ctx.fillText(text, w2, h);	
	
	h = h + dh;
	text = "Pavilion facets ";
	ctx.fillStyle = text_color;
	ctx.fillText(text, w1, h);	
	text = roundNumber(hPavFacet*100, 3) + "%";
	ctx.fillStyle = value_color;
	ctx.fillText(text, w2, h);
	
	h = h + dh;
	text = "Culet size (culet)";
	ctx.fillStyle = text_color;
	ctx.fillText(text, w1, h);	
	text = roundNumber(culet*100, 3) + "%";
	ctx.fillStyle = value_color;
	ctx.fillText(text, w2, h);

	h = h + dh;
	text = "Culet displacement (culet_R) ";
	ctx.fillStyle = text_color;
	ctx.fillText(text, w1, h);	
	text = roundNumber(culet_R*100, 3) + "%";
	ctx.fillStyle = value_color;
	ctx.fillText(text, w2, h);
	
	h = h + dh;
	text = "Culet angle displacement (culet_A) ";
	ctx.fillStyle = text_color;
	ctx.fillText(text, w1, h);	
	text = roundNumber(culet_A/DEGREE, 3) + "°";
	ctx.fillStyle = value_color;
	ctx.fillText(text, w2, h);
	
	h = h + dh;
	text = "Culet offset X ";
	ctx.fillStyle = text_color;
	ctx.fillText(text, w1, h);	
	var value_X = culet_R * Math.cos(culet_A);
	text = roundNumber(value_X*100, 3) + "%";
	ctx.fillStyle = value_color;
	ctx.fillText(text, w2, h);
	
	h = h + dh;
	text = "Culet offset Y ";
	ctx.fillStyle = text_color;
	ctx.fillText(text, w1, h);	
	var value_Y = value = - culet_R * Math.sin(culet_A);
	text = roundNumber(value_Y*100, 3) + "%";
	ctx.fillStyle = value_color;
	ctx.fillText(text, w2, h);
	
	h = h + dh;
	text = "up az ";
	ctx.fillStyle = text_color;
	ctx.fillText(text, w1, h);	
	text = roundNumber(up_az/DEGREE, 3) + "°";
	ctx.fillStyle = value_color;
	ctx.fillText(text, w2, h);
	
	h = h + dh;
	text = "low az ";
	ctx.fillStyle = text_color;
	ctx.fillText(text, w1, h);	
	text = roundNumber(low_az/DEGREE, 3) + "°";
	ctx.fillStyle = value_color;
	ctx.fillText(text, w2, h);

	h = h + dh;
	text = "Total height ";
	ctx.fillStyle = text_color;
	ctx.fillText(text, w1, h);
	var total_height = r + Math.tan(alpha) * (1 - culet) / 2 + Math.tan(beta) * (1 - t) / 2;
	text = roundNumber(total_height*100, 3) + "%";
	ctx.fillStyle = value_color;
	ctx.fillText(text, w2, h);
/*	
	// Используется при отладке
    if (error == true)
	{
		ctx.font = 'bold 14pt "Times New Roman"';
		ctx.fillStyle = 'rgba(255, 0, 255, 1)';
		ctx.fillText("Non-convex brilliant", 30, 400);
		ctx.font = 'bold 12pt "Times New Roman"';
		ctx.fillStyle = 'rgba(255, 0, 0, 1)';
		ctx.fillText("facet : " + error_facet + "    vertex : " + error_vertex, 38, 420);
	}
*/
}	
	
// Если значение какого-либо параметра изменилось то перестраиваем 3D модель.
function recalc()
{
	var i;
	
	// Убираем со сцены полигоны.
	for(i = 0; i < meshes.length; i++) 
	{
		var mesh = meshes[i];
		scene.remove(mesh);	
	}
	// Убираем со сцены ребра.
	for(i = 0; i < edges.length; i++) 
	{
		scene.remove(edges[i]);	
	}				
	
	// Создаем новые полигоны и ребра и выводим их на сцену.
	create_meshes();
	for(i = 0; i < edges.length; i++) 
	{
		scene.add(edges[i]);	
	}	
	for(i = 0; i < meshes.length; i++) 
	{
		scene.add(meshes[i]);	
	}

	// Очищаем холст и затем выводим на него новые значения параметров,
	// а также дополнительную информацию.
	ctx.clearRect(0, 0, hud.width, hud.height);
	pars_value();
	
	create_num_vertices(0);
}

function render() 
{
		orbitControl.enabled = true;
		raycaster.setFromCamera( mouse, camera );
		var intersects = raycaster.intersectObjects( meshes );
		if ( intersects.length > 0 ) 
		{
			index = intersects[ 0 ].object.index;
			old_color = intersects[ 0 ].object.material.color;

			if ( (index != select_index)  )
			{
				if (select_index != -1)
				{
					meshes[select_index].material.color = old_color;
				}
			}
			print_text_index(index);
			meshes[index].material.color = new THREE.Color("rgb(250, 250, 0)");
			select_index = index;
			
			pointX = intersects[ 0 ].point.x;
			pointY = intersects[ 0 ].point.y;
			pointZ = intersects[ 0 ].point.z;
			
			var left_2 = 130;
			var h2 = 400;
			ctx.font = '12px "Times New Roman"';
			ctx.fillStyle = 'rgba(0, 0, 100, 1)';
			var text = "(x, y, z) = ";
			ctx.fillText(text, left_2 - 80, h2 + 55);
			
			text = "  " + roundNumber(pointX/kf, 3) + "   " + roundNumber(pointY/kf, 3) + "   "  + roundNumber(pointZ/kf, 3);
			ctx.fillText(text, left_2 - 30, h2 + 55);
	
		}
//		if (error == true)
//		{
//			meshes[error_facet].material.color = new THREE.Color("rgb(250, 0, 0)");
//		}		
		requestAnimationFrame(render);
		renderer.render(scene, camera);
}

function onDocumentMouseMove( event ) 
{
	event.preventDefault();
	var el = document.getElementById('canvas');
	var coords = el.getBoundingClientRect();
	mouse.x = -1 + ((event.clientX - coords.left)*2)/522;
	mouse.y = -1 + ((coords.top + 522 - event.clientY)*2)/522;
}

function print_text_index(index) // 100, 130, 160
{
	ctx.clearRect(0, 360, 400, 100);
	var h1 = 380;
	var h2 = 400;
	var left_1 = 30;
	var left_2 = 130;
	
	ctx.font = 'bold 12pt "Times New Roman"';
	ctx.fillStyle = 'rgba(100, 0, 0, 1)';
	ctx.fillText("Facet : " + index, left_1 + 30, h1);			
	
	// Crown
	if (index == 0)
	{
		ctx.fillText("Table", left_2, h1);
	}
	if (index == 1)
	{
		ctx.fillText("Crown facet J", left_2, h1);
	}
	if (index == 2)
	{
		ctx.fillText("  Crown facet K", left_2, h1);
	}
	if (index == 3)
	{
		ctx.fillText("  Crown facet L", left_2, h1);
	}
	if (index == 4)
	{
		ctx.fillText("  Crown facet M", left_2, h1);
	}
	if (index == 5)
	{
		ctx.fillText("  Crown facet N", left_2, h1);
	}	
	if (index == 6)
	{
		ctx.fillText("  Crown facet P", left_2, h1);
	}
	if (index == 7)
	{
		ctx.fillText("  Crown facet Q", left_2, h1);
	}
	if (index == 8)
	{
		ctx.fillText("  Crown facet R", left_2, h1);
	}
	if (index == 9)
	{
		ctx.fillText("  Crown facet A", left_2, h1);
	}
	if (index == 10)
	{
		ctx.fillText("  Crown facet B", left_2, h1);
	}
	if (index == 11)
	{
		ctx.fillText("  Crown facet C", left_2, h1);
	}
	if (index == 12)
	{
		ctx.fillText("  Crown facet D", left_2, h1);
	}
	if (index == 13)
	{
		ctx.fillText("  Crown facet E", left_2, h1);
	}
	if (index == 14)
	{
		ctx.fillText("  Crown facet F", left_2, h1);
	}	
	if (index == 15)
	{
		ctx.fillText("  Crown facet G", left_2, h1);
	}
	if (index == 16)
	{
		ctx.fillText("  Crown facet H", left_2, h1);
	}	
	if (index == 17)
	{
		ctx.fillText("  Crown facet A2", left_2, h1);
	}
	if (index == 18)
	{
		ctx.fillText("  Crown facet B1", left_2, h1);
	}	
	if (index == 19)
	{
		ctx.fillText("  Crown facet B2", left_2, h1);
	}
	if (index == 20)
	{
		ctx.fillText("  Crown facet C1", left_2, h1);
	}	
	if (index == 21)
	{
		ctx.fillText("  Crown facet C2", left_2, h1);
	}
	if (index == 22)
	{
		ctx.fillText("  Crown facet D1", left_2, h1);
	}
	
	if (index == 23)
	{
		ctx.fillText("  Crown facet D2", left_2, h1);
	}	
	
	if (index == 24)
	{
		ctx.fillText("  Crown facet E1", left_2, h1);
	}	
	if (index == 25)
	{
		ctx.fillText("  Crown facet E2", left_2, h1);
	}	
	if (index == 26)
	{
		ctx.fillText("  Crown facet F1", left_2, h1);
	}	
	if (index == 27)
	{
		ctx.fillText("  Crown facet F2", left_2, h1);
	}	
	if (index == 28)
	{
		ctx.fillText("  Crown facet G1", left_2, h1);
	}	
	if (index == 29)
	{
		ctx.fillText("  Crown facet G2", left_2, h1);
	}	
	if (index == 30)
	{
		ctx.fillText("  Crown facet H1", left_2, h1);
	}	
	if (index == 31)
	{
		ctx.fillText("  Crown facet H2", left_2, h1);
	}	
	if (index == 32)
	{
		ctx.fillText("  Crown facet A1", left_2, h1);
	}	
	
	
	
	// Pavilion
	if (index == 113)
	{
		ctx.fillText("    Pavilion facet  a", left_2, h1);
	}	
	if (index == 114)
	{
		ctx.fillText("    Pavilion facet  b", left_2, h1);
	}
	if (index == 115)
	{
		ctx.fillText("    Pavilion facet  c", left_2, h1);
	}
	if (index == 116)
	{
		ctx.fillText("    Pavilion facet  d", left_2, h1);
	}
	if (index == 117)
	{
		ctx.fillText("    Pavilion facet  e", left_2, h1);
	}
	if (index == 118)
	{
		ctx.fillText("    Pavilion facet  f", left_2, h1);
	}	
	if (index == 119)
	{
		ctx.fillText("    Pavilion facet  g", left_2, h1);
	}
	if (index == 120)
	{
		ctx.fillText("    Pavilion facet  h", left_2, h1);
	}
	
	
	if (index == 97)
	{
		ctx.fillText("    Pavilion facet  a2", left_2, h1);
	}
	if (index == 98)
	{
		ctx.fillText("    Pavilion facet  b1", left_2, h1);
	}
	if (index == 99)
	{
		ctx.fillText("    Pavilion facet  b2", left_2, h1);
	}
	if (index == 100)
	{
		ctx.fillText("    Pavilion facet  c1", left_2, h1);
	}
	if (index == 101)
	{
		ctx.fillText("    Pavilion facet  c2", left_2, h1);
	}
	if (index == 102)
	{
		ctx.fillText("    Pavilion facet  d1", left_2, h1);
	}
	if (index == 103)
	{
		ctx.fillText("    Pavilion facet  d2", left_2, h1);
	}
	if (index == 104)
	{
		ctx.fillText("    Pavilion facet  e1", left_2, h1);
	}
	if (index == 105)
	{
		ctx.fillText("    Pavilion facet  e2", left_2, h1);
	}
	if (index == 106)
	{
		ctx.fillText("    Pavilion facet  f1", left_2, h1);
	}
	if (index == 107)
	{
		ctx.fillText("    Pavilion facet  f2", left_2, h1);
	}
	if (index == 108)
	{
		ctx.fillText("    Pavilion facet  g1", left_2, h1);
	}
	if (index == 109)
	{
		ctx.fillText("    Pavilion facet  g2", left_2, h1);
	}
	if (index == 110)
	{
		ctx.fillText("    Pavilion facet  h1", left_2, h1);
	}
	if (index == 111)
	{
		ctx.fillText("    Pavilion facet  h2", left_2, h1);
	}	
	if (index == 112)
	{
		ctx.fillText("    Pavilion facet  a1", left_2, h1);
	}	
	
	
	if (index == 121)
	{
		ctx.fillText("      Culet", left_2, h1);
	}	

	var plg = plgs[index]; 
	var face3 = plg.IndexTriangle[0];

	var normal = face3.normal;
	var x = normal.x;
	var y = normal.y;
	var z = normal.z;
	var slope = Math.abs(z/Math.sqrt(x*x + y*y));
	slope = Math.abs(slope);
	slope = Math.atan(slope);
	if (index != -1)
	{	
		var azim;
		if ( (Math.abs(x) <= 0.00001) && (Math.abs(y) <= 0.00001) )
		{
			azim = 10001.0;
		}
		else if ( (x > 0.00001) && (y > 0.00001) )
		{
			azim = Math.atan2(y, x) * 180.0 / Math.PI;
		}
		else if ( (x < - 0.00001) && (y > 0.00001) )
		{
			azim = ( Math.atan2(-x, y) * 180.0 / Math.PI) + 90.0 ;
		}
		else if ( (x < -0.00001) && (y < -0.00001) )
		{
			azim = (Math.atan2(-y, -x) * 180.0 / Math.PI) + 180.0;
		}
		else if ( (x > 0.00001) && (y < -0.00001) )
		{
			azim = (Math.atan2(x, -y) * 180.0 / Math.PI) + 270.0;
		}
		else if ( (Math.abs(y) <= 0.00001) && (x > 0) )
		{
			azim = 0.0;
		}
		else if ( (Math.abs(y) <= 0.00001) && (x < 0) )
		{
			azim = 180.0;
		}
		else if ( (Math.abs(x) <= 0.00001) && (y > 0) )
		{
			azim = 90.0;
		}
		else if ( (Math.abs(x) <= 0.00001) && (y < 0) )
		{
			azim = 270.0;
		}
		if (azim > 10000.0)
		{
			azim = 0.0;
		}
	}
	ctx.font = '16px "Times New Roman"';
	ctx.fillStyle = 'rgba(100, 0, 0, 1)';
	var text_slope = roundNumber(90 - Math.degrees(slope), 2) + "°";
	ctx.fillText("Slope : " + text_slope, left_1 + 60, h2 + 10);
	
	var text_azim = roundNumber(azim, 2) + "°";
	ctx.fillText("Azim. : " + text_azim, left_1 + 60, h2 + 30);
}	

var loaderText = new THREE.FontLoader(); // загрузчик шрифтов

// характеристики создаваемого 3D текста
function create_text(txt)
{
	var t =
	{
		text : txt,          // текст номера, который небходимо отобразить
		size : 6,            // размер текста (высота символа)
		height : 1,          // толщина текста
		curveSegments : 12,  // количество точек (сегментов) 
              // кривой при рисовании буквы, отвечающие за качество изображения
		//     font : "gentilis",   // название шрифта
		bevelEnabled : false // включение фаски (при true)
	};	
	return t;
}
	
// Создание текста для оцифровки вершин огранки.			
function generateGeometry(meshText, text)
{
	var data = create_text(text);
	loaderText.load
	( 
		'../libs/gentilis_bold.typeface.js', // шрифт
		function ( font ) 
		{
			var geometryText = new THREE.TextGeometry
			( 
				data.text, 
				{
					font: font,
					size: data.size,
					height: data.height,
					curveSegments: data.curveSegments,
					bevelEnabled: data.bevelEnabled
				} 
			);
			geometryText.center();
			meshText.children[ 0 ].geometry.dispose(); 
			meshText.children[ 0 ].geometry = geometryText;			
		}
	);
}

// нумерация вершин модели
function create_num_vertices(enumeration)
{
	for(i = 0; i < numbers.length; i++) 
	{
		scene.remove(numbers[i]);	
	}
	numbers.length = 0;
	if (enumeration == 0)
	{
		document.getElementById("btn_no").checked = true;
		return;
	}
	
	var x, y, z;
	var ind = 0;
	var number = 0;
	var n = vertices.length / 3; // количество вершин модели
	
	// вывод номеров вершин на экран
	for (i = 0; i < n; i++) 
	{
		// координаты текущей вершины
		for (j = 0; j < 3; j++)
		{
			x = vertices[ind];
			y = vertices[ind + 1];
			z = vertices[ind + 2];
		}

		if  ( (i > 16)&&(i < 20) || (i > 20)&&(i < 24)  || (i > 24)&&(i < 28)    || (i > 28)&&(i < 32)   || (i > 32)&&(i < 36) ||
			  (i > 36)&&(i < 40) || (i > 40)&&(i < 44) || ( i > 44)&&(i < 48) || (i > 48)&&(i < 52) || (i > 52)&&(i < 56) ||
			  (i > 56)&&(i < 60) || (i > 60)&&(i < 64) || (i > 64)&&(i < 68) || (i > 68)&&(i < 72) || (i > 72)&&(i < 76) ||
			  (i > 76)&&(i < 80) || (i > 80)&&(i < 84) || (i > 84)&&(i < 88) || (i > 88)&&(i < 92) || (i > 92)&&(i < 96) ||
			  (i > 96)&&(i < 100) || (i > 100)&&(i < 104) || (i > 104)&&(i < 108) || (i > 108)&&(i < 112) || (i > 112)&&(i < 116) ||
			  (i > 116)&&(i < 120) || (i > 120)&&(i < 124) || (i > 124)&&(i < 128) || (i > 128)&&(i < 132) || (i > 132)&&(i < 136) ||
			  (i > 136)&&(i < 140) || (i > 140)&&(i < 144) )
		{
			// Не отображаем некоторые (не узловые) индексы вершин рундиста.
			//all_numbers.push(meshText);
			ind = ind + 3;
			number = number + 1;
			continue;
		}			
		


		// Создание текста соответствующего номеру текущей вершины
		// Текст - это объект типа меш (mesh), у которого предком
		// является THREE.Object3D.
		var meshText = new THREE.Object3D();
		
		if (enumeration == 1)
		{
			meshText.add(
				// присоединяем к объекту meshText
				// модель "номера грани" с закрашенными гранями и делаем ее видимой
				new THREE.Mesh(
					new THREE.Geometry(),
					new THREE.MeshBasicMaterial({color: 0x000000, // черный цвет номера 
												 side: THREE.DoubleSide, 
												 shading: THREE.FlatShading})));
			meshText.children[0].visible = true; // делаем видимой
			
			generateGeometry( meshText, number.toString() );
		}
		if (enumeration == 2)
		{
			if ( number < 16 )
			{
				meshText.add(
					new THREE.Mesh(
						new THREE.Geometry(),
						new THREE.MeshPhongMaterial({color: 0x990000, emissive: 0x990000, side: THREE.DoubleSide, shading: THREE.FlatShading})));
				generateGeometry( meshText, number.toString() );
			}
			else if ( (number > 15) && (number < 144) )
			{
				meshText.add(
					new THREE.Mesh(
						new THREE.Geometry(),
						new THREE.MeshPhongMaterial({color: 0xffffff, emissive: 0x0000ff, side: THREE.DoubleSide, shading: THREE.FlatShading})));
				generateGeometry( meshText, (number - 16).toString() );	
			}
			else 
			{
				meshText.add(
					new THREE.Mesh(
						new THREE.Geometry(),
						new THREE.MeshPhongMaterial({color: 0xffffff, emissive: 0xff0000, side: THREE.DoubleSide, shading: THREE.FlatShading})));
				generateGeometry( meshText, (number - 144).toString() );	
			}			
		}
		
		// Так как у meshText предком является Object3D, 
		// от которого наследуются все объекты попадающие на сцену, и 
		// он отвечает за геометрическое положение объектов в пространстве
		// то мы можем помещать текст в нужное место и масштабировать его.
		// (трансформации примененные к верхнему уровню иерархии объектов
		//   применяются ко всем элементам лежащим ниже)
		meshText.scale.set(0.07, 0.07, 0.07);	
		if ( (ind / 3) < 80 ) 
		{ // для вершин с положительной координатой z
			z = z + 0.025; // смещение относительно координаты вершины
			meshText.position.set(kf*x, kf*y, kf*z);
		}
		else
		{ // для вершин с отрицательной координатой z
			z = z - 0.025; // смещение относительно координаты вершины
			meshText.position.set(kf*x, kf*y, kf*z);
			meshText.rotation.x = Math.PI; //    для удобства
			meshText.rotation.z = Math.PI; // зрительного воспрятия			
		}
		numbers.push(meshText);
		ind = ind + 3;
		number = number + 1;
	}	
	for(i = 0; i < numbers.length; i++) 
	{
		scene.add(numbers[i]);	
	}
}

function isCorrect()
{	
	error = false;
	error_vertex = -1;
	error_facet = -1;

	var i, j;
	// Проходим по всем граням модели 
	for (i = 0; i < plgs.length; i++)
	{
		var plg = plgs[i]; 
		var face3 = plg.IndexTriangle[0];

		var ind1 = face3.a;
		var ind2 = face3.b;
		var ind3 = face3.c;
		
		var pt1 = new Point3D(points[ind1].x, points[ind1].y, points[ind1].z);
		var pt2 = new Point3D(points[ind2].x, points[ind2].y, points[ind2].z);
		var pt3 = new Point3D(points[ind3].x, points[ind3].y, points[ind3].z);

		var plane = new Plane3D();
		plane.CreatePlaneThreePoints(pt1, pt2, pt3);
		
		// Проходим по всем вершинам модели 
		for (j = 0; j < points.length; j++)
		{
			var pt_test = new Point3D(points[j].x, points[j].y, points[j].z);
			var dist = plane.DistancePoint(pt_test);
			//alert (dist);
			if (dist > 0.000001)
			{
				// not convex
				error = true;
				error_vertex = j;
				error_facet = i;
				return -1;
			}
		}
	}
}

function radio_no() // не отображаем нумерацию вершин
{ 
	if (document.getElementById("btn_no").checked == true )
	{
		document.getElementById("btn_all").checked = false;
		document.getElementById("btn_cr_gd_pav").checked = false;
		create_num_vertices(0);
	}
}

function radio_all() // отображаем нумерацию вершин одним цветом
{ 
	if (document.getElementById("btn_all").checked == true )
	{
		document.getElementById("btn_cr_gd_pav").checked = false;
		document.getElementById("btn_no").checked = false;
		create_num_vertices(1);
	}
}

function radio_cr_gd_pav() // отображаем нумерацию вершин разными цветами
{ 
	if (document.getElementById("btn_cr_gd_pav").checked == true )
	{
		document.getElementById("btn_no").checked = false;
		document.getElementById("btn_all").checked = false;
		create_num_vertices(2);
	}
}

// Вспомогательная функция форматирования числовых значений.
function roundNumber(num, places) 
{
	return ( Math.round(num * Math.pow(10, places)) / Math.pow(10, places) );
}

window.onload = init;
