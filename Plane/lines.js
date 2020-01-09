function lines()
{
	var elem1 = document.getElementById('canvas_01');
	var ctx1 = elem1.getContext("2d");
	elem1.style.position = "relative";
	elem1.style.border = "1px solid";
	
	var elem2 = document.getElementById('canvas_02');
	var ctx2 = elem2.getContext("2d");
	elem2.style.position = "relative";
	elem2.style.border = "1px solid";
	
	SCALE = 100;
	xC = elem2.width / 2;
	yC = elem2.height / 2;
	
	// начало координат
	var pt00 = new Point2D(0, 0);
	// рисуем точку в начале координат коричневым цветом
	csp(ctx1, pt00, 2, "Brown");
	// обозначаем начало координат символом "O" коричневым цветом
	text1(ctx1, "O", pt00, "rt", "up", "Brown");
	// рисуем оси коричневым цветом с размахом линий по OX и OY равным 1.8
	axes(ctx1, 1.8, 1.8, 0.5, "Brown");
	
	// canvas ctx1
	// точка с координатами ( 1.2, -1.2)
	var pt0 = new Point2D( 1.2, -1.2);
	csp(ctx1, pt0, 10, "B"); // рисуем точку pt0 синим цветом
	// формируем строку с координатами точки pt0
	var t1 = (roundNumber(pt0[0], 2)).toString(); // преобразование значения в строку
	var t2 = (roundNumber(pt0[1], 2)).toString(); // преобразование значения в строку
	var t = t1 + ", " + t2;
	// отображаем сформированную строку синим цветом 
	// рядом с pt0 - чуть правее и чуть выше самой точки
	text1(ctx1, t, pt0, "rt", "up", "B");

	// переменная controller1 используется dat.GUI
    var controller1 = new function() 
	{
		this.X = pt0[0];
		this.Y = pt0[1];
    }();	
	// Создаем новый объект dat.GUI.
	var gui = new dat.GUI({ autoPlace: false });
	gui.domElement.id = 'gui';
	gui_container1.appendChild(gui.domElement);
	
	var f1_1 = gui.addFolder('Point position');	
	// используется для изменения координаты X точки pt0
	f1_1.add(controller1, 'X', -2.0, 2.0).onChange( function() 
	{
		pt0[0] = (controller1.X); // новое значение координаты X
		// так как новое значение координаты X то требуется
		// очистить экран
		ctx1.clearRect(0, 0, elem1.width, elem1.height);
		// обновляем экран с новым положением точки pt0
		axes(ctx1, 1.8, 1.8, 0.5, "Brown");
		csp(ctx1, pt0, 10, "B");
		var t1 = (roundNumber(pt0[0], 2)).toString(); 
		var t2 = (roundNumber(pt0[1], 2)).toString();
		var t = t1 + ", " + t2;
		text1(ctx1, t, pt0, "rt", "up", "B");
		csp(ctx1, pt00, 2, "Brown");
		text1(ctx1, "O", pt00, "rt", "up", "Brown");
	});
	// используется для изменения координаты Y точки pt0
	f1_1.add(controller1, 'Y', -2.0, 2.0).onChange( function() 
	{
		pt0[1] = (controller1.Y); // новое значение координаты Y
		// так как новое значение координаты X то требуется
		// очистить экран
		ctx1.clearRect(0, 0, elem1.width, elem1.height)
		// обновляем экран с новым положением точки pt0
		axes(ctx1, 1.8, 1.8, 0.5, "Brown");
		csp(ctx1, pt0, 10, "B");
		var t1 = (roundNumber(pt0[0], 2)).toString();
		var t2 = (roundNumber(pt0[1], 2)).toString();
		var t = t1 + ", " + t2;
		text1(ctx1, t, pt0, "rt", "up", "B");	
		csp(ctx1, pt00, 2, "Brown");
		text1(ctx1, "O", pt00, "rt", "up", "Brown");		
	});
	
    // canvas ctx2
	
	// line1
	var pt1 = new Point2D ( -1.1, -0.8);
	var pt2 = new Point2D ( 1.1, 0.8);	
	// line2
	var pt3 = new Point2D ( -1.0, 0.7);
	var vec = new Vector2D(0.95, -0.2);
	// пересечение line1 и line2
	cross(pt1, pt2, pt3, vec);
	
    var controller2 = new function() 
	{
		this.X1 = pt1[0];
		this.Y1 = pt1[1];
		
		this.X2 = pt2[0];
		this.Y2 = pt2[1];
		
		this.pointX = pt3[0];
		this.pointY = pt3[1];
		
		this.vectorX = vec[0];
		this.vectorY = vec[1];		
    }();	
	
	// Создаем новый объект dat.GUI.
	var gui2 = new dat.GUI({ autoPlace: false });
	gui2.domElement.id = 'gui2';
	gui_container2.appendChild(gui2.domElement);
	////////////////////////////////////////////////////////////
	var f2_1 = gui2.addFolder('Line:   Point1 &  Point2');	
	f2_1.add(controller2, 'X1', -2.0, 2.0).onChange( function() 
	{
		pt1[0] = (controller2.X1);
		cross(pt1, pt2, pt3, vec);
	});
	f2_1.add(controller2, 'Y1', -2.0, 2.0).onChange( function() 
	{
		pt1[1] = (controller2.Y1);
		cross(pt1, pt2, pt3, vec);
	});
	f2_1.add(controller2, 'X2', -2.0, 2.0).onChange( function() 
	{
		pt2[0] = (controller2.X2);
		cross(pt1, pt2, pt3, vec);
	});
	f2_1.add(controller2, 'Y2', -2.0, 2.0).onChange( function() 
	{
		pt2[1] = (controller2.Y2);
		cross(pt1, pt2, pt3, vec);
	});
	//////////////////////////////////////////////////////////////
	var f2_2 = gui2.addFolder('Line:   Vector & Point');
	f2_2.add(controller2, 'vectorX', -5, 5).onChange( function() 
	{
		vec[0] = (controller2.vectorX);
		cross(pt1, pt2, pt3, vec);
	});
	f2_2.add(controller2, 'vectorY', -5, 5).onChange( function() 
	{
		vec[1] = (controller2.vectorY);
		cross(pt1, pt2, pt3, vec);
	});	
	
	f2_2.add(controller2, 'pointX', -2.0, 2.0).onChange( function() 
	{
		pt3[0] = (controller2.pointX);
		cross(pt1, pt2, pt3, vec);
	});
	f2_2.add(controller2, 'pointY', -2.0, 2.0).onChange( function() 
	{
		pt3[1] = (controller2.pointY);
		cross(pt1, pt2, pt3, vec);
	});
	//////////////////////////////////////////////////////////////
	function cross(pt1, pt2, pt3, vec)
	{
		ctx2.clearRect(0, 0, elem2.width, elem2.height);
		ctx2.lineWidth = 1.0;
		ctx2.font = "12px Arial";
		axes(ctx2, 1.8, 1.8, 0.5, "Brown");
		
		// Создаем прямые лежащие на осях OX и OY
		var pt00 = new Point2D(0, 0); // начало координат
		var OX = new Line2D(pt00, new Point2D(1, 0));
		var OY = new Line2D(pt00, new Point2D(0, 1));		
		
		csp(ctx2, pt1, 6);
		csp(ctx2, pt2, 6);
		var line1 = new Line2D(pt1, pt2);
		line(ctx2, pt1, pt2, -3, 3, 1, "Brown");
		
		// Для отрисовки вектора на экране
		// создаем сначала прямую лежащую на векторе
		vec.Normer();
		var line_vec = new Line2D(pt00, vec);
		//vector(ctx2, pt00, vec, "B");
		segment_arrow(ctx2, pt00, vec, 4, 0.6, "B");
		text1(ctx2, "vector", vec, "rt", "up", "B");
		// Затем рисуем стрелку на конце вектора
		var ang = (line_vec.Angle(OX) +  90*DEGREE);
		arrow(ctx2, vec, ang, 0.4, "B");
		csp(ctx2, pt3, 6, "B");
		text1(ctx2, "point", pt3, "lt", "up", "B");
		
		// Создаем прямую line2
		var line2 = new Line2D(); // объявление прямой line2
		// назначение прямой line2 требуемых параметров
		line2.CreateLineVectorPoint(vec, pt3);
		
		//  находим вспомогательную точку pt_temp 
		// для изображения на экране line2
		var pt_temp = line2.IntersectionTwoLines(OX);
		line(ctx2, pt3, pt_temp, -3, 3, 1, "B");
		
		text1(ctx2, "1", pt1, "lt", "up");
		text1(ctx2, "2", pt2, "lt", "up");
		
		var point = line1.IntersectionTwoLines(line2); 
		csp(ctx2, point, 8, "R");
		var t1 = (roundNumber(point[0], 2)).toString();
		var t2 = (roundNumber(point[1], 2)).toString();
		var t = t1 + ", " + t2;
		text1(ctx2, t, point, "rt", "up", "R");
		
		csp(ctx2, pt00, 8, "B");
	}
}	