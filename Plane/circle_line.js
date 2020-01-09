function circle_line()
{
	var elem3 = document.getElementById('canvas_03');
	ctx3 = elem3.getContext("2d");
	elem3.style.position = "relative";
	elem3.style.border = "1px solid";
	
	var elem4 = document.getElementById('canvas_02');
	ctx4 = elem4.getContext("2d");
	elem4.style.position = "relative";
	elem4.style.border = "1px solid";
	
	SCALE = 100;
	xC = elem3.width / 2;
	yC = elem3.height / 2;
	
	// canvas ctx3
	var O = new Point2D (0, 0);
	axes(ctx3, 1.8, 1.8, 0.5, "Brown");
	ctx3.font = "12px Arial";
	var t1 = (roundNumber(O[0], 2)).toString();
	var t2 = (roundNumber(O[1], 2)).toString();
	var t = t1 + ", " + t2;
	text1(ctx3, t, O, "rt", "up", "B");
	
		// line
	var pt1 = new Point2D ( -0.3, 1.2);
	var pt2 = new Point2D ( 1.1, -0.8);	
	
	var R = 1;
	draw_line_circle(ctx3, O, pt1, pt2, R);

    var controller3 = new function() 
	{
		this.X = O[0];
		this.Y = O[1];
		this.R = R;
		
		this.X1 = pt1[0];
		this.Y1 = pt1[1];
		
		this.X2 = pt2[0];
		this.Y2 = pt2[1];
    }();	
	// Создаем новый объект dat.GUI.
	var gui = new dat.GUI({ autoPlace: false });
	gui.domElement.id = 'gui';
	gui_container3.appendChild(gui.domElement);
	
	var f1 = gui.addFolder('Circle: Center & Radius');	
	f1.add(controller3, 'X', -2.0, 2.0).onChange( function() 
	{
		ctx3.clearRect(0, 0, elem3.width, elem3.height);
		O[0] = (controller3.X);
		draw_line_circle(ctx3, O, pt1, pt2, R);
		
	});
	f1.add(controller3, 'Y', -2.0, 2.0).onChange( function() 
	{
		ctx3.clearRect(0, 0, elem3.width, elem3.height);
		O[1] = (controller3.Y);
		draw_line_circle(ctx3, O, pt1, pt2, R);		
	});
	f1.add(controller3, 'R', 0.01, 2.0).onChange( function() 
	{
		ctx3.clearRect(0, 0, elem3.width, elem3.height);
		R = (controller3.R);
		draw_line_circle(ctx3, O, pt1, pt2, R);		
	});	
	
	var f2 = gui.addFolder('Line:   Point 1 &  Point 2');	
	f2.add(controller3, 'X1', -2.0, 2.0).onChange( function() 
	{
		ctx3.clearRect(0, 0, elem3.width, elem3.height);
		pt1[0] = (controller3.X1);
		draw_line_circle(ctx3, O, pt1, pt2, R);
	});
	f2.add(controller3, 'Y1', -2.0, 2.0).onChange( function() 
	{
		ctx3.clearRect(0, 0, elem3.width, elem3.height);
		pt1[1] = (controller3.Y1);
		draw_line_circle(ctx3, O, pt1, pt2, R);
	});
	f2.add(controller3, 'X2', -2.0, 2.0).onChange( function() 
	{
		ctx3.clearRect(0, 0, elem3.width, elem3.height);
		pt2[0] = (controller3.X2);
		draw_line_circle(ctx3, O, pt1, pt2, R);
	});
	f2.add(controller3, 'Y2', -2.0, 2.0).onChange( function() 
	{
		ctx3.clearRect(0, 0, elem3.width, elem3.height);
		pt2[1] = (controller3.Y2);
		draw_line_circle(ctx3, O, pt1, pt2, R);
	});
}

function draw_line_circle(ctx, O, pt1, pt2, R)	
{
	axes(ctx, 1.8, 1.8, 0.5, "Brown"); // оси координат
	
	csp(ctx, O, 5, "B"); // центр окружности
	var t1 = (roundNumber(O[0], 2)).toString();
	var t2 = (roundNumber(O[1], 2)).toString();
	var t = t1 + ", " + t2;
	text1(ctx, t, O, "rt", "up", "B");

	circle(ctx, O, R, 1, "B");
	
	// радиус - прямая со стрелкой на одном конце
	var line_radius = new Line2D(O, new Point2D(O[0] + 6, O[1] + 3));
	var cir = new Circle2D(O, R); // Окружность с центром O и радиусом R
	
	// определяем место где нарисуем стрелку радиуса
	var points = cir.Intersection_LineCircle(line_radius);
	if (points == null)
	{
		return null;
	}	
	var x, y;
	// в качестве места для стрелки выбираем где координата Y 
	// точки пересесечения имеет меньшее значение
	if (points[0][1] > points[1][1])
	{
		x = points[1][0];
		y = points[1][1];
	}
	else
	{
		x = points[0][0];
		y = points[0][1];
	}				
	// точка для стрелки 
	var point_radius = new Point2D(x, y);

	// радиус
	segment_arrow(ctx, O, point_radius, 1, 0.2, "Black")
	text1(ctx, "R", point_radius, "lt", "dn", "B");
	
	// прямая OX задается для определения угла используемого 
	// для проведения отрезка со стрелкой на конце примыкающем к окружности
	var O = new Point2D(0, 0); // начало координат
	var OX = new Line2D(O, new Point2D(1, 0));
	var ang = (line_radius.Angle(OX) - 90*DEGREE);
	// рисуем стрелку на конце отрезка
	arrow(ctx, point_radius, ang, 0.2, "B");	
	
	// задаем прямую line_var пересекающуюся с окружностью
	csp(ctx, pt1, 6);
	csp(ctx, pt2, 6);
	text1(ctx, "1", pt1, "rt", "up");
	text1(ctx, "2", pt2, "rt", "up");	
	var line_var = new Line2D(pt1, pt2); // прямая задается двумя точками
	line(ctx, pt2, pt1, -3, 3, 1, "Black"); // отображаем line_var
	
	// находим две точки пересечения
	points = cir.Intersection_LineCircle(line_var);
	if (points == null)
	{
		return null;
	}
	csp(ctx, points[0], 6, "R"); // первая точка пересечения
	csp(ctx, points[1], 6, "R"); // вторая точка пересечения
	
	// координаты первой точки
	var t1 = (roundNumber(points[0][0], 2)).toString();
	var t2 = (roundNumber(points[0][1], 2)).toString();
	var t = t1 + ", " + t2;
	text1(ctx, t, points[0], "rt", "up", "R");
	
	// координаты второй точки
	t1 = (roundNumber(points[1][0], 2)).toString();
	t2 = (roundNumber(points[1][1], 2)).toString();
	t = t1 + ", " + t2;
	text1(ctx, t, points[1], "rt", "up", "R");	
}

