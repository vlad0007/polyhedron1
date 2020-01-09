function three_circles()
{
	var elem5 = document.getElementById('canvas_05');
	ctx5 = elem5.getContext("2d");
	elem5.style.position = "relative";
	elem5.style.border = "1px solid";
	
	SCALE = 100;
	xC = elem5.width / 2;
	yC = elem5.height / 2;
	
	// canvas ctx5
	var O2 = new Point2D (-0.31, 0);
	var R2 = 1.37;
	var O1 = new Point2D ( 0.0, -0.7);
	var R1 = 1.59;
	
	var O3 = new Point2D ( 0.2, 0.2);
	var R3 = 0.62;	
	
	ctx5.font = "12px Arial";
	
	
	draw_three_circles(ctx5, O1, O2, O3, R1, R2, R3);

    var controller5 = new function() 
	{
		this.X1 = O1[0];
		this.Y1 = O1[1];
		this.R1 = R1;
		
		this.X2 = O2[0];
		this.Y2 = O2[1];
		this.R2 = R2;
		
		this.X3 = O3[0];
		this.Y3 = O3[1];
		this.R3 = R3;
    }();	
	// Создаем новый объект dat.GUI.
	var gui = new dat.GUI({ autoPlace: false });
	gui.domElement.id = 'gui';
	gui_container5.appendChild(gui.domElement);
	
	var f1 = gui.addFolder('Circle 1: Center & Radius');	
	f1.add(controller5, 'X1', -2.0, 2.0).onChange( function() 
	{
		ctx5.clearRect(0, 0, elem5.width, elem5.height);
		O1[0] = (controller5.X1);
		draw_three_circles(ctx5, O1, O2, O3, R1, R2, R3);
		
	});
	f1.add(controller5, 'Y1', -2.0, 2.0).onChange( function() 
	{
		ctx5.clearRect(0, 0, elem5.width, elem5.height);
		O1[1] = (controller5.Y1);
		draw_three_circles(ctx5, O1, O2, O3, R1, R2, R3);		
	});
	f1.add(controller5, 'R1', 0.01, 2.0).onChange( function() 
	{
		ctx5.clearRect(0, 0, elem5.width, elem5.height);
		R1 = (controller5.R1);
		draw_three_circles(ctx5, O1, O2, O3, R1, R2, R3);		
	});	
	
	
	var f2 = gui.addFolder('Circle 2: Center & Radius');	
	f2.add(controller5, 'X2', -2.0, 2.0).onChange( function() 
	{
		ctx5.clearRect(0, 0, elem5.width, elem5.height);
		O2[0] = (controller5.X2);
		draw_three_circles(ctx5, O1, O2, O3, R1, R2, R3);
		
	});
	f2.add(controller5, 'Y2', -2.0, 2.0).onChange( function() 
	{
		ctx5.clearRect(0, 0, elem5.width, elem5.height);
		O2[1] = (controller5.Y2);
		draw_three_circles(ctx5, O1, O2, O3, R1, R2, R3);		
	});
	f2.add(controller5, 'R2', 0.01, 2.0).onChange( function() 
	{
		ctx5.clearRect(0, 0, elem5.width, elem5.height);
		R2 = (controller5.R2);
		draw_three_circles(ctx5, O1, O2, O3, R1, R2, R3);		
	});	
	
	
	var f3 = gui.addFolder('Circle 3: Radius');	
	f3.add(controller5, 'R3', 0.01, 2.0).onChange( function() 
	{
		ctx5.clearRect(0, 0, elem5.width, elem5.height);
		R3 = (controller5.R3);
		draw_three_circles(ctx5, O1, O2, O3, R1, R2, R3);		
	});	
}

function draw_three_circles(ctx, O1, O2, O3, R1, R2, R3)	
{
	axes(ctx, 1.8, 1.8, 0.5, "Black");  // рисуем оси черным цветом
	
	// Необходимо провести сопряжение следующих двух окружностей.
	var cir1 = new Circle2D(O1, R1); 
	var cir2 = new Circle2D(O2, R2); 
	
	// Рисуем и обозначаем центр O1 коричневым цветом
	csp(ctx, O1, 5, "Brown");
	text1(ctx, "O1", O1, "rt", "up", "Brown");
	// Рисуем дугу с центром O1 и радиусом R1 коричневым цветом
	arc(ctx, O1, R1, 1, "Brown", 5, 120);
	
	// Рисуем и обозначаем центр O2 синим цветом
	csp(ctx, O2, 5, "B");
	text1(ctx, "O2", O2, "rt", "up", "B");
	// Рисуем дугу с центром O2 и радиусом R2 синим цветом
	arc(ctx, O2, R2, 1, "B", -60, 60);
	
	// Радиусы вспомогательных окружностей должны быть > 0 
	if (R2 - R3 <= 0.0)
	{
		return null;
	}
	if (R1 - R3 <= 0.0)
	{
		return null;
	}
	
	// Создаем две вспомогательные окружности.
	var R2_R3 = new Circle2D(O2, R2 - R3); 
	var R1_R3 = new Circle2D(O1, R1 - R3); 
	
	// Две дуги вспомогательных окружностей рисуем черным цветом и толщиной равной 0.3
	arc(ctx, O1, R1 - R3, 0.3, "Black", 5, 120);  // рисуем дугу с центром O1 и радиусом R1 - R3
	arc(ctx, O2, R2 - R3, 0.3, "Black", -60, 60); // рисуем дугу с центром O2 и радиусом R2 - R3

	// Находим точки пересечения двух окружностей между собой
	// Переменная points представляет собой массив из двух точек типа Point2D.
	var points = R2_R3.Intersection_TwoCircles(R1_R3);
	if (points == null)
	{
		return null;
	}		
	// Центр сопрягающей окружности O3
	if (points[0][0] > points[1][0])
	{
		O3[0] = points[0][0]; O3[1] = points[0][1]
	}
	else
	{
		O3[0] = points[1][0]; O3[1] = points[1][1]			
	}

	// Создаем сопрягающую окружность чуть большего 
	// радиуса чем R3 (для проверки)
	var cir3 = new Circle2D(O3, R3 + 0.00001); // R3 + EPSILON);
	csp(ctx, O3, 5, "R"); // рисуем точку красным цветом
	text1(ctx, "O3", O3, "rt", "up", "R"); // обозначаем точку как "O3" красным цветом
	circle(ctx, O3, R3, 1, "R"); // рисуем окружность красным цветом 
	                             // с центром в точке O3 и радиусом равным R3

	// Проверяем пересекаются или нет окружность 
	// cir2 с сопрягающей окружностью cir3
	// Координаты двух точек пересечения полученные в результате
	// работы функции Intersection_TwoCircles должны 
	// отличаться совершенно незначительно по своим значениям
	// и в пределе переходить в одну точку касания окружностей "G".
	points = cir2.Intersection_TwoCircles(cir3);
	if (points == null)
	{
		return null;
	}			
	// Первая точка "G" сопряжения/касания 
	var G = new Point2D(); // объявление точки
	G[0] = points[0][0];
	G[1] = points[0][1];
	csp(ctx, G, 3, "R"); // рисуем точку красным цветом
	text1(ctx, "G", G, "lt", "dn", "R"); // обозначаем точку как "G"
	
	// Проверяем пересекаются или нет окружность 
	// cir1 с сопрягающей окружностью cir3
	// Координаты двух точек пересечения полученные в результате
	// работы функции Intersection_TwoCircles должны 
	// отличаться совершенно незначительно по своим значениям
	// и в пределе переходить в одну точку касания окружностей "F".
	points = cir1.Intersection_TwoCircles(cir3);
	if (points == null)
	{
		return null;
	}	
	// Вторая точка "F" сопряжения/касания 
	var F = new Point2D(); // объявление точки
	F[0] = points[0][0];
	F[1] = points[0][1];
	csp(ctx, F, 3, "R"); // рисуем точку красным цветом
	text1(ctx, "F", F, "lt", "dn", "R"); // обозначаем точку как "F"
	
	// Предварительные расчеты требующиеся для рисования дуги сопряжения.
	// Вычисляем углы начала и конца дуги сопряжения.
	var line_O3_F = new Line2D(O3, F);
	var line_O3_G = new Line2D(O3, G);
	var line_hor = new Line2D(O3, new Point2D(O3[0] + 1, O3[1]));
	var ang_F_degree = (180 / Math.PI) * line_O3_F.Angle(line_hor);
	var ang_G_degree = (180 / Math.PI) * line_O3_G.Angle(line_hor);
	
	// Рисуем "жирную" дугу сопряжения окружностей красным цветом
	arc(ctx, O3, R3, 4, "R",  -ang_G_degree, -ang_F_degree);
}
