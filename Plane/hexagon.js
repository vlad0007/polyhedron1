// hexagon.js
function hexagon()
{
	var elem7 = document.getElementById('canvas_07');
	ctx7 = elem7.getContext("2d");
	elem7.style.position = "relative";
	elem7.style.border = "1px solid";
	
	SCALE = 100;
	xC = elem7.width / 2;
	yC = elem7.height / 2;
	
	// canvas ctx7
	var O = new Point2D (0, 0);
	var R = 1.3
	
	ctx7.font = "12px Arial";
	
	draw_hexagon(ctx7, O, R);
	
    var controller7 = new function() 
	{
		this.X = O[0];
		this.Y = O[1];
		this.R = R;	
	}

	// Создаем новый объект dat.GUI.
	var gui = new dat.GUI({ autoPlace: false });
	gui.domElement.id = 'gui';
	gui_container7.appendChild(gui.domElement);
	
	var f1 = gui.addFolder('Hexagon: Center & Radius');	
	f1.add(controller7, 'X', -2.0, 2.0).onChange( function() 
	{
		ctx7.clearRect(0, 0, elem7.width, elem7.height);
		O[0] = (controller7.X);
		draw_hexagon(ctx7, O, R);		
	});
	f1.add(controller7, 'Y', -2.0, 2.0).onChange( function() 
	{
		ctx7.clearRect(0, 0, elem7.width, elem7.height);
		O[1] = (controller7.Y);
		draw_hexagon(ctx7, O, R);		
	});
	f1.add(controller7, 'R', 0.01, 2.0).onChange( function() 
	{
		ctx7.clearRect(0, 0, elem7.width, elem7.height);
		R = (controller7.R);
		draw_hexagon(ctx7, O, R);	
	});	
}

function draw_hexagon(ctx, O, R)	
{
	axes(ctx, 1.8, 1.8, 0.5, "Brown");
	
	csp(ctx, O, 5, "B");
	text1(ctx, "O", O, "rt", "up", "B");
	circle(ctx, O, R, 1, "B");
	
	var cir_O = new Circle2D(O, R);  
	
	var A = new Point2D(O[0], O[1] + R);
	csp(ctx, A, 6, "R");
	text2(ctx, "A", A, "lt", "up", "Black");
	
	var cir_A = new Circle2D(A, R); 
	arc(ctx, A, R, 0.4, "Black", 200, 340);

	var points = cir_O.Intersection_TwoCircles(cir_A);
	if (points == null)
	{
		return null;
	}
	var B = new Point2D();
	var C = new Point2D();
	if (points[0][0] > points[1][0])
	{
		C[0] = points[0][0];
		C[1] = points[0][1];
		B[0] = points[1][0];
		B[1] = points[1][1];		
	}
	else
	{
		C[0] = points[1][0];
		C[1] = points[1][1];
		B[0] = points[0][0];
		B[1] = points[0][1];		
	}
	
	csp(ctx, B, 6, "R");
	csp(ctx, C, 6, "R");

	text2(ctx, "B", B, "center", "up", "R");
	text2(ctx, "C", C, "rt", "up", "R");	

	var cir_B = new Circle2D(B, R); 
	arc(ctx, B, R, 0.4, "Black", -110, 50);

	points = cir_O.Intersection_TwoCircles(cir_B);
	if (points == null)
	{
		return null;
	}
	var D = new Point2D();
	if (points[0][0] > points[1][0])
	{
		D[0] = points[1][0];
		D[1] = points[1][1];
	}
	else
	{
		D[0] = points[0][0];
		D[1] = points[0][1];
	}
	csp(ctx, D, 6, "R");
	text2(ctx, "D", D, "lt", "up", "R");
	
	var cir_D = new Circle2D(D, R); 
	arc(ctx, D, R, 0.4, "Black", -50, 110);

	points = cir_O.Intersection_TwoCircles(cir_D);
	if (points == null)
	{
		return null;
	}
	var E = new Point2D();
	if (points[0][0] > points[1][0])
	{
		E[0] = points[0][0];
		E[1] = points[0][1];
	}
	else
	{
		E[0] = points[1][0];
		E[1] = points[1][1];
	}
	csp(ctx, E, 6, "R");
	text2(ctx, "E", E, "center", "up", "R");

	var cir_E = new Circle2D(E, R); 
	arc(ctx, E, R, 0.4, "Black", 10, 180);

	points = cir_O.Intersection_TwoCircles(cir_E);
	if (points == null)
	{
		return null;
	}
	var F = new Point2D();
	if (points[0][0] > points[1][0])
	{
		F[0] = points[0][0];
		F[1] = points[0][1];
	}
	else
	{
		F[0] = points[1][0];
		F[1] = points[1][1];
	}
	csp(ctx, F, 6, "R");
	text2(ctx, "F", F, "rt", "up", "R");

	var cir_F = new Circle2D(F, R); 
	arc(ctx, F, R, 0.4, "Black", 80, 270);

	var cir_C = new Circle2D(C, R); 
	arc(ctx, C, R, 0.4, "Black", 80, 270);

	line_segment(ctx, A, B, 2, "R");
	line_segment(ctx, B, D, 2, "R");
	line_segment(ctx, D, E, 2, "R");
	line_segment(ctx, E, F, 2, "R");
	line_segment(ctx, F, C, 2, "R");
	line_segment(ctx, C, A, 2, "R");
}




