//
function pentagon()
{
	var elem6 = document.getElementById('canvas_06');
	ctx6 = elem6.getContext("2d");
	elem6.style.position = "relative";
	elem6.style.border = "1px solid";
	
	SCALE = 100;
	xC = elem6.width / 2;
	yC = elem6.height / 2;
	
	var O = new Point2D (0, 0);
	var R = 1.3
	
	ctx6.font = "12px Arial";
	
	draw_pentagon(ctx6, O, R);
	
    var controller6 = new function() 
	{
		this.X = O[0];
		this.Y = O[1];
		this.R = R;	
	}

	// Создаем новый объект dat.GUI.
	var gui = new dat.GUI({ autoPlace: false });
	gui.domElement.id = 'gui';
	gui_container6.appendChild(gui.domElement);
	
	var f1 = gui.addFolder('Pentagon: Center & Radius');	
	f1.add(controller6, 'X', -2.0, 2.0).onChange( function() 
	{
		ctx6.clearRect(0, 0, elem6.width, elem6.height);
		O[0] = (controller6.X);
		draw_pentagon(ctx6, O, R);		
	});
	f1.add(controller6, 'Y', -2.0, 2.0).onChange( function() 
	{
		ctx6.clearRect(0, 0, elem6.width, elem6.height);
		O[1] = (controller6.Y);
		draw_pentagon(ctx6, O, R);		
	});
	f1.add(controller6, 'R', 0.01, 2.0).onChange( function() 
	{
		ctx6.clearRect(0, 0, elem6.width, elem6.height);
		R = (controller6.R);
		draw_pentagon(ctx6, O, R);	
	});	
		
}

function draw_pentagon(ctx, O, R)	
{
	axes(ctx, 1.8, 1.8, 0.5, "Brown");
	
	csp(ctx, O, 5, "B");
	text1(ctx, "O", O, "rt", "up", "B");
	circle(ctx, O, R, 1, "B");
	
	var cir_O = new Circle2D(O, R);  
	var A = new Point2D(O[0] - R, O[1]);
	var B = new Point2D(O[0] + R, O[1]);
	var F = new Point2D(O[0], O[1] + R);
	
	csp(ctx, A, 6, "B");
	csp(ctx, B, 6, "B");
	csp(ctx, F, 6, "R");

	text2(ctx, "F", F, "rt", "up", "R");
	text2(ctx, "A", A, "lt", "up", "Black");
	text2(ctx, "B", B, "rt", "up", "Black");	
	
	var cir_B = new Circle2D(B, R);
	arc(ctx, B, R, 0.4, "Black", 110, 250);

	var points = cir_O.Intersection_TwoCircles(cir_B);
	if (points == null)
	{
		return null;
	}
	var C = new Point2D();
	var D = new Point2D();
	if (points[0][1] > points[1][1])
	{
		D[0] = points[0][0];
		D[1] = points[0][1];
		C[0] = points[1][0];
		C[1] = points[1][1];		
	}
	else
	{
		D[0] = points[1][0];
		D[1] = points[1][1];
		C[0] = points[0][0];
		C[1] = points[0][1];		
	}
	
	csp(ctx, D, 6, "B");
	csp(ctx, C, 6, "B");

	text2(ctx, "D", D, "center", "up", "Black");
	text2(ctx, "C", C, "center", "dn", "Black");	
	
	var AB = new Line2D(A, B);
	var DC = new Line2D(D, C);
	line_segment(ctx, D, C, 0.5, "Black");
	
	var E = AB.IntersectionTwoLines(DC); 
	csp(ctx, E, 6, "B");
	text2(ctx, "E", E, "lt", "up", "Black");
	
	var distEF = E.Distance(F); 
	var cir_E = new Circle2D(E, distEF);
	arc(ctx, E, distEF, 0.4, "Black", 100, 190);
	
	points = cir_E.Intersection_LineCircle(AB);
	if (points == null)
	{
		return null;
	}	
	
	var G = new Point2D();
	if (points[0][0] > points[1][0])
	{
		G[0] = points[1][0];
		G[1] = points[1][1];
	}
	else
	{
		G[0] = points[0][0];
		G[1] = points[0][1];		
	}			
	csp(ctx, G, 6, "Black");
	text2(ctx, "G", G, "rt", "up", "Black");	
	
	var distFG = F.Distance(G); 
	
	var cir_F = new Circle2D(F, distFG);
	arc(ctx, F, distFG, 0.4, "Black", 210, 330);
	
	points = cir_F.Intersection_TwoCircles(cir_O);
	if (points == null)
	{
		return null;
	}
	var H = new Point2D();
	var J = new Point2D();
	
	if (points[0][0] > points[1][0])
	{
		J[0] = points[0][0];
		J[1] = points[0][1];
		H[0] = points[1][0];
		H[1] = points[1][1];		
	}
	else
	{
		J[0] = points[1][0];
		J[1] = points[1][1];
		H[0] = points[0][0];
		H[1] = points[0][1];		
	}
	csp(ctx, J, 6, "R");
	csp(ctx, H, 6, "R");

	text2(ctx, "J", J, "rt", "middle", "R");
	text2(ctx, "H", H, "lt", "middle", "R");
	
	var cir_H = new Circle2D(H, distFG);
	arc(ctx, H, distFG, 0.4, "Black", 270, 310);

	points = cir_H.Intersection_TwoCircles(cir_O);
	if (points == null)
	{
		return null;
	}
	var L = new Point2D();
	if (points[0][1] > points[1][1])
	{
		L[0] = points[1][0];
		L[1] = points[1][1];
	}
	else
	{
		L[0] = points[0][0];
		L[1] = points[0][1];
	}
	csp(ctx, L, 6, "R");
	text2(ctx, "L", L, "rt", "up", "R");

	var cir_J = new Circle2D(J, distFG);
	arc(ctx, J, distFG, 0.4, "Black", 240, 270);

	points = cir_J.Intersection_TwoCircles(cir_O);
	if (points == null)
	{
		return null;
	}
	var K = new Point2D();
	if (points[0][1] > points[1][1])
	{
		K[0] = points[1][0];
		K[1] = points[1][1];
	}
	else
	{
		K[0] = points[0][0];
		K[1] = points[0][1];
	}
	csp(ctx, K, 6, "R");
	text1(ctx, "K", K, "lt", "up", "R");

	line_segment(ctx, F, J, 2, "R");
	line_segment(ctx, J, K, 2, "R");
	line_segment(ctx, K, L, 2, "R");
	line_segment(ctx, L, H, 2, "R");
	line_segment(ctx, H, F, 2, "R");
}	
