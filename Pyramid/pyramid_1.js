// pyramid.js
// Инициализация параметров модели
var lw = 1.2;              // отношение длина/ширина
var r = 0.06;              // высота рундиста
var t = 0.6;       		   // размер площадки
var hCrown = 0.3;	       // высота короны
var hp = 0.6;			   // глубина павильона
var model_width = 1.0;	   // ширина модели
////////////////////////////////////////////////////
var anglePav;  // угол павильона
var angleA;    // угол короны A
var angleB;    // угол короны B
var totalHt = hCrown + r + hp; // общая высота модели
var totalHtFix = hCrown + r + hp; // общая высота модели

var vertices = []; // в этот массив записывется результат 
			       //работы функции VerticesCalculation()
var meshes = [];  // массив объектов mesh (полигонов для three.js)
var points = [];    // массив для хранения вершин всех полигонов в виде THREE.Vector3
var colors = [];    // массив в котором хранятся цвета граней
var edges = []; // массив для хранения ребер полигонов

var DEGREE = 0.01745329251994; // величина углового градуса в радианах

var canvas; // canvas для отображения 3D-модели
var scene, camera, renderer, orbitControl, raycaster;

// используется для отображения/изменения значений параметров модели
var controller;

var hud;    // "индикатор на лобовом стекле" - canvas для отображения параметров
var ctx;	// двумерный контекст для рисования на холсте (на canvas)
			// значений параметров, привязан к hud

var numbers = [];
var enumeration = false; // для переключателя номеров вершин модели (да/нет)

// Следующие 5 строк для raycaster.
var mouse = new THREE.Vector2();
mouse.x = 800;
mouse.y = 600;
var select_index = -1;
var old_color;

// Масштабный множитель для полигонов при их отображении
var kf = 10.0; //7.0;
// Масштабный множитель для ребер при их отображении
var kf_edges = 10.05; //7.03;

var TWO_MODELS = false;  // используется в polyhedron.js если создается 
                         // второй экземпляр 3D-модели с той же топологией

var pointX = 0;
var pointY = 0;
var pointZ = 0;

function init()
{	
	canvas = document.getElementById("canvas");
	
	// Создаем трехмерную сцену, перспективную камеру и рендерер
	scene = new THREE.Scene();
	
	// Создаем перспективную камеру.
	camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 0.1, 1000);
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
	
	
	// Для задания значений параметров будем использовать библиотеку dat.GUI
	// В объекте controller определяем свойства для параметров модели и их
	// начальные значения.
    controller = new function() 
	{
      this.lw = 1.2;
      this.r = 0.06;
      this.hCrown = 0.3;
	  this.t = 0.6;
	  this.hp = 0.6;
      this.anglePav = Math.atan(hp/0.5) / DEGREE;
	  this.model_width = 1.0;
	  this.totalHt = hCrown + r + hp;   
	  this.totalHtFix = hCrown + r + hp;
	  this.enumeration = false;
    }();	
	
	// Создаем новый объект dat.GUI.
	var gui = new dat.GUI({ autoPlace: false });
	gui.domElement.id = 'gui';
	gui_container.appendChild(gui.domElement);
	
    var f1 = gui.addFolder('Girdle');
    f1.add(controller, 'lw', 0.5, 4.0).onChange( function() 
	{
	   orbitControl.enabled = false;
       lw = controller.lw;
	   recalc();
    });
    f1.add(controller, 'r', 0.01, 2).onChange( function() 
	{
		orbitControl.enabled = false;
		r = controller.r;
		recalc();   
	});

    var f2 = gui.addFolder('Crown');
    f2.add(controller, 'hCrown', 0.05, 0.9).onChange( function() 
	{
		orbitControl.enabled = false;
		hCrown = controller.hCrown;
		recalc();		
    });
    f2.add(controller, 't', 0.01, 0.9).onChange( function() 
	{
		orbitControl.enabled = false;
		t = controller.t;
		recalc();	
    });	
	
    var f3 = gui.addFolder('Pavilion');
    f3.add(controller, 'hp', 0.1, 3.0).onChange( function() 
	{
		orbitControl.enabled = false;
		hp = controller.hp;
		anglePav = Math.atan(hp/0.5); 
		controller.anglePav = anglePav/DEGREE;
		gui.updateDisplay();
		recalc(); 		
    });	
	
    f3.add(controller, 'anglePav', 1.0, 80.0).onChange( function() 
	{
		orbitControl.enabled = false;
		anglePav = (controller.anglePav)*DEGREE;
		hp = 0.5 * Math.tan(anglePav);
		controller.hp = hp;
		gui.updateDisplay();
		recalc();    	
    });

    var f4 = gui.addFolder('Total Parameters');
    f4.add(controller, 'model_width', 0.1, 2.0).onChange( function() 
	{
		orbitControl.enabled = false;
		model_width = controller.model_width;
		gui.updateDisplay();
		recalc();		
    });
    f4.add(controller, 'totalHt', 0.01, 4.0).onChange( function() 
	{
		var ratio;
		orbitControl.enabled = false;
		var old_val = totalHt;
		totalHt = controller.totalHt;
		ratio = totalHt / old_val; // коэффициент растяжения модели вдоль оси Z
		r = r * ratio;
		hCrown = hCrown * ratio;
		hp = hp * ratio;
		anglePav = Math.atan(hp/0.5);
		controller.r = r;
		controller.hCrown = hCrown;
		controller.hp = hp;
		controller.anglePav = anglePav/DEGREE;
		gui.updateDisplay();
		recalc();		
    });
    f4.add(controller, 'totalHtFix', 0.01, 4.0).onChange( function() 
	{
		orbitControl.enabled = false;
		totalHtFix = controller.totalHtFix;
		
		var ratio = (r + hp + hCrown) / totalHtFix;
		model_width = model_width * ratio;
		ratio = 1.0 / ratio;
		r = r * ratio;
		hCrown = hCrown * ratio;
		hp = hp * ratio;		
		anglePav = Math.atan(hp/0.5 * model_width);
		controller.model_width = model_width;
		controller.anglePav = anglePav/DEGREE;
		gui.updateDisplay();
		recalc();		
    });
	gui.add( controller, 'enumeration', false ).onChange( function() 
	{
		enumeration = controller.enumeration; 
	
		if (enumeration == true) // переключатель да / нет
		{
			if (numbers.length == 0)
			{
				// если нумерации еще нет то создаем ее
				create_num_vertices();
			}
			for(i = 0; i < numbers.length; i++) 
			{
				// выводим на экран нумерацию вершин модели
				scene.add(numbers[i]);	
			}
		}
		else
		{
			for(i = 0; i < numbers.length; i++) 
			{
				// убираем с экрана нумерацию вершин модели
				scene.remove(numbers[i]);	
			}
		}
	});
	
	//           Создание мешей двух типов
	// 1. Для прорисовки цветных граней используется массив meshes.
	//    Каждая грань представлена одним мешем в массиве полигонов.
	// 2. Для прорисовки ребер граней используется массив edges.
	//    Каждый полигон представлен одним массивом, окаймляющих его ребер, 
	//    в общем массиве ребер всей модели.	
	create_meshes();
	
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
	// как части в единую модель объединяющую все меши.
	// Во-вторых, если мы при помощи "raycaster" будем выбирать отдельные грани
	// то опять же "raycaster" удобнее использовать для модели 
	// представляющей собой не единую модель, а модель составленную
	// из отдельных моделей граней  (на мой взгляд).
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
		var material = new THREE.MeshBasicMaterial( { vertexColors: THREE.FaceColors } );
		var mesh = new THREE.Mesh(geometry, material);	
		mesh.index = i;
		meshes.push(mesh);	
	}	
	
	// Lines (ребра)
	
	// После того, как нарисовали 3D модель и раскрасили цвета ее граней, 
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
	//canvas.addEventListener( 'mousemove', onDocumentMouseMove, false );
	//document.addEventListener( 'mousemove', onDocumentMouseMove, false );
}			

function pars_value()
{
	var text_color = "#00F";
	var value_color = "#F00";
	var h = 15;
	var dh = 16;
	var w1 = 2;
	var w2 = 141
	
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
	text = "Crown angle A1 (main)";
	ctx.fillStyle = text_color;
	ctx.fillText(text, w1, h);	
	angleA = Math.atan(hCrown/(0.5 - t/2));
	//text = roundNumber(Math.degrees(angleA), 3) + "°";
	text = roundNumber(angleA/DEGREE, 3) + "°";
	ctx.fillStyle = value_color;
	ctx.fillText(text, w2, h);

	h = h + dh;
	text = "Crown angle A2 ";
	ctx.fillStyle = text_color;
	ctx.fillText(text, w1, h);	
	angleB = Math.atan(hCrown/(lw * (1 - t)/2));
	text = roundNumber(angleB/DEGREE, 3) + "°";
	ctx.fillStyle = value_color;
	ctx.fillText(text, w2, h);	
	
	h = h + dh;
	text = "Crown height ";
	ctx.fillStyle = text_color;
	ctx.fillText(text, w1, h);
	text = roundNumber(hCrown*100, 3) + "%";
	ctx.fillStyle = value_color;
	ctx.fillText(text, w2, h);	
	
	h = h + dh;
	text = "Pavilion height ";
	ctx.fillStyle = text_color;
	ctx.fillText(text, w1, h);	
	text = roundNumber(hp*100, 3) + "%";
	ctx.fillStyle = value_color;
	ctx.fillText(text, w2, h);
	
	h = h + dh;
	text = "Pav. angle B1 (main)";
	ctx.fillStyle = text_color;
	ctx.fillText(text, w1, h);	
	text = roundNumber((Math.atan(hp/0.5))/DEGREE, 3) + "°";
	ctx.fillStyle = value_color;
	ctx.fillText(text, w2, h);
	
	h = h + dh;
	text = "Pav. angle B2 ";
	ctx.fillStyle = text_color;
	ctx.fillText(text, w1, h);	
	var ang = 90 - (Math.atan(hp/0.5*lw))/DEGREE;
	text = roundNumber(ang, 3) + "°";
	ctx.fillStyle = value_color;
	ctx.fillText(text, w2, h);
	
	h = h + dh;
	text = "Model width ";
	ctx.fillStyle = text_color;
	ctx.fillText(text, w1, h);	
	text = roundNumber(model_width, 3);
	ctx.fillStyle = value_color;
	ctx.fillText(text, w2, h);
	
	h = h + dh;
	text = "Total height ";
	ctx.fillStyle = text_color;
	ctx.fillText(text, w1, h);
	//hp = 0.5 * Math.tan(anglePav);
	var total_height = r + hCrown + hp;
	text = roundNumber(total_height*100, 3) + "%";
	ctx.fillStyle = value_color;
	ctx.fillText(text, w2, h);		
	
	var h = 180;
	var left_1 = 2;
	var left_2 = 60;
	var left_3 = 160;
	
	ctx.font = '10pt "Times New Roman"';
	ctx.fillStyle = 'rgba(0, 0, 255, 1)'; 
	var i;
	var el = 0;
	var v1, v2, v3;
	for (i = 0; i < vertices.length/3; i++)
	{
		for (j = 0; j < 3; j++)
		{
			v1 = vertices[el];
			v2 = vertices[el + 1];
			v3 = vertices[el + 2];
		} 
		text1 = roundNumber(v1, 2);
		text2 = roundNumber(v2, 2);
		text3 = roundNumber(v3, 2);
		text0 = "index = " + i;
		ctx.font = 'italic 10pt "Times New Roman"';
		ctx.fillStyle = 'rgba(100, 0, 255, 1)';
		ctx.fillText(text0 ,5, h);
		ctx.font = '10pt "Times New Roman"';
		ctx.fillStyle = 'rgba(255, 0, 255, 1)';
		ctx.fillText(text1, 80, h);
		ctx.fillText(text2, 120, h);
		ctx.fillText(text3, 160, h);
		el = el + 3;
		h = h + 15;
	}
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
	
	create_num_vertices();
}

// Вспомогательная функция форматирования числовых значений.
function roundNumber(num, places) 
{
	return ( Math.round(num * Math.pow(10, places)) / Math.pow(10, places) );
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
			meshes[index].material.color = new THREE.Color("rgb(250, 0, 0)");
			select_index = index;
				
			pointX = intersects[ 0 ].point.x;
			pointY = intersects[ 0 ].point.y;
			pointZ = intersects[ 0 ].point.z;	
			
			var left_2 = 120;
			var h2 = 395;
			ctx.font = '12px "Times New Roman"';
			ctx.fillStyle = 'rgba(0, 0, 100, 1)';
			var text = "(x, y, z) = ";
			ctx.fillText(text, left_2 - 80, h2);
			
			text = "  " + roundNumber(pointX/kf, 3) + "   " + roundNumber(pointY/kf, 3) + "   "  + roundNumber(pointZ/kf, 3);
			ctx.fillText(text, left_2 - 30, h2);
		}		
		
		requestAnimationFrame(render);
		renderer.render(scene, camera);
}

function onDocumentMouseMove( event ) 
{
	event.preventDefault();
	var el = document.getElementById('canvas');
	var coords = el.getBoundingClientRect();
	mouse.x = -1 + ((event.clientX - coords.left)*2)/500;
	mouse.y = -1 + ((coords.top + 422 - event.clientY)*2)/422;
}

function print_text_index(index) // 100, 130, 160
{
	ctx.clearRect(0, 360, 300, 40);
	var h = 380;
	var left_1 = 2;
	var left_2 = 60;
	var left_3 = 160;
	
	ctx.font = 'bold 10pt "Times New Roman"';
	ctx.fillStyle = 'rgba(100, 50, 50, 1)'; 
	ctx.fillText("Facet : " + index, left_1, h);	
	
	if (index == 0)
	{
		ctx.fillText("Table", left_2 + 15, h);
		ctx.font = 'bold 8pt "Times New Roman"';
		ctx.fillStyle = 'rgba(0, 0, 0, 1)'; 
		ctx.fillText("  0, 3, 2, 1, 0", left_3, h);
	}
	if (index == 1)
	{
		ctx.fillText("Crown facet A1", left_2, h);
		ctx.font = 'bold 8pt "Times New Roman"';
		ctx.fillStyle = 'rgba(0, 0, 0, 1)';
		ctx.fillText("  0, 4, 7, 3, 0", left_3, h);
	}
	if (index == 2)
	{
		ctx.fillText("Crown facet A2", left_2, h);
		ctx.font = 'bold 8pt "Times New Roman"';
		ctx.fillStyle = 'rgba(0, 0, 0, 1)';
		ctx.fillText("  1, 5, 4, 0, 1", left_3, h);
	}
	if (index == 3)
	{
		ctx.fillText("Crown facet A3", left_2, h);
		ctx.font = 'bold 8pt "Times New Roman"';
		ctx.fillStyle = 'rgba(0, 0, 0, 1)';
		ctx.fillText("  2, 6, 5, 1, 2", left_3, h);
	}
	if (index == 4)
	{
		ctx.fillText("Crown facet A4", left_2, h);
		ctx.font = 'bold 8pt "Times New Roman"';
		ctx.fillStyle = 'rgba(0, 0, 0, 1)';
		ctx.fillText("  3, 7, 6, 2, 3", left_3, h);
	}
	if (index == 5)
	{
		ctx.fillText("Girdle facet", left_2, h);
		ctx.fillText(" 4, 8, 11, 7, 4", left_3 - 3, h);
	}	
	if (index == 6)
	{
		ctx.fillText("Girdle facet", left_2, h);
		ctx.fillText(" 5, 9, 8, 4, 5,", left_3 - 3, h);
	}
	if (index == 7)
	{
		ctx.fillText("Girdle facet", left_2, h);
		ctx.fillText(" 6, 10, 9, 5, 6", left_3 - 3, h);
	}
	if (index == 8)
	{
		ctx.fillText("Girdle facet", left_2, h);
		ctx.fillText(" 7, 11, 10, 6, 7", left_3 - 3, h);
	}
	if (index == 9)
	{
		ctx.fillText("Pavilion facet B1", left_2, h);
		ctx.font = 'bold 8pt "Times New Roman"';
		ctx.fillStyle = 'rgba(0, 0, 0, 1)';
		ctx.fillText("  12, 11, 8, 12", left_3 - 3, h);
	}
	if (index == 10)
	{
		ctx.fillText("Pavilion facet B2", left_2, h);
		ctx.font = 'bold 8pt "Times New Roman"';
		ctx.fillStyle = 'rgba(0, 0, 0, 1)';
		ctx.fillText("  12, 8, 9, 12", left_3 - 3, h);
	}
	if (index == 11)
	{
		ctx.fillText("Pavilion facet B3", left_2, h);
		ctx.font = 'bold 8pt "Times New Roman"';
		ctx.fillStyle = 'rgba(0, 0, 0, 1)';
		ctx.fillText("  12, 9, 10, 12", left_3 - 3, h);
	}
	if (index == 12)
	{
		ctx.fillText("Pavilion facet B4", left_2, h);
		ctx.font = 'bold 8pt "Times New Roman"';
		ctx.fillStyle = 'rgba(0, 0, 0, 1)';
		ctx.fillText("  12, 10, 11, 12", left_3 - 3, h);
	}	
}	

var loaderText = new THREE.FontLoader(); // загрузчик шрифтов

// характеристики создаваемого текста
function create_text(txt)
{
	var t =
	{
		text : txt,          // текст номера, который небходимо отобразить
		size : 9,            // размер текста (высота символа)
		height : 1,          // толщина текста
		curveSegments : 12,  // количество точек (сегментов) 
              // кривой при рисовании буквы, отвечающие за качество изображения
		//     font : "gentilis",   // название шрифта
		bevelEnabled : false // включение фаски (при true)
	};	
	return t;
}
	
// Создание текста для оцифровки вершин.			
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
function create_num_vertices()
{
	for(i = 0; i < numbers.length; i++) 
	{
		scene.remove(numbers[i]);	
	}
	numbers.length = 0;
	
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

		// Создание текста соответствующего номеру текущей вершины
		// Текст - это объект типа меш (mesh), у которого предком
		// является THREE.Object3D.
		var meshText = new THREE.Object3D();
		
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
		
		// Так как у meshText предком является Object3D, 
		// от которого наследуются все объекты попадающие на сцену, и 
		// он отвечает за геометрическое положение объектов в пространстве
		// то мы можем помещать текст в нужное место и масштабировать его.
		// (трансформации примененные к верхнему уровню иерархии объектов
		//   применяются ко всем элементам лежащим ниже)
		meshText.scale.set(0.07, 0.07, 0.07);	
		if ( (ind / 3) < 8 ) 
		{ // для вершин с положительной координатой z
			z = z + 0.02; // смещение относительно координаты вершины
			meshText.position.set(kf*x, kf*y, kf*z);
		}
		else
		{ // для вершин с отрицательной координатой z
			z = z - 0.02; // смещение относительно координаты вершины
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

////////////////////////////////////////////////////////////////////////////////////
//              Расчет координат вершин модели
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
	
	// Координаты вершин короны в % к ширине модели
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
