// heptagon.js
function heptagon()
{
	var elem8 = document.getElementById('canvas_08');
	ctx8 = elem8.getContext("2d");
	elem8.style.position = "relative";
	elem8.style.border = "1px solid";
	
	SCALE = 100;
	xC = elem8.width / 2;
	yC = elem8.height / 2;
	
	// canvas ctx8
	var O = new Point2D (0, 0);
	var R = 1.3
	
	ctx8.font = "12px Arial";
	
	draw_heptagon(ctx8, O, R);
	
    var controller8 = new function() 
	{
		this.X = O[0];
		this.Y = O[1];
		this.R = R;	
	}
	
	// Создаем новый объект dat.GUI.
	var gui = new dat.GUI({ autoPlace: false });
	gui.domElement.id = 'gui';
	gui_container8.appendChild(gui.domElement);
	
	var f1 = gui.addFolder('Heptagon: Center & Radius');	
	f1.add(controller8, 'X', -2.0, 2.0).onChange( function() 
	{
		ctx8.clearRect(0, 0, elem8.width, elem8.height);
		O[0] = (controller8.X);
		draw_heptagon(ctx8, O, R);		
	});
	f1.add(controller8, 'Y', -2.0, 2.0).onChange( function() 
	{
		ctx8.clearRect(0, 0, elem8.width, elem8.height);
		O[1] = (controller8.Y);
		draw_heptagon(ctx8, O, R);		
	});
	f1.add(controller8, 'R', 0.01, 2.0).onChange( function() 
	{
		ctx8.clearRect(0, 0, elem8.width, elem8.height);
		R = (controller8.R);
		draw_heptagon(ctx8, O, R);	
	});	
}

function draw_heptagon(ctx, O, R)	
{
	axes(ctx, 1.8, 1.8, 0.5, "Brown");
	
	var C = new Point2D(O[0], O[1] + R);
	csp(ctx, C, 5, "R");
	text1(ctx, "C", C, "rt", "up", "R");
	
	csp(ctx, O, 5, "B");
	text1(ctx, "O", O, "rt", "up", "B");
	circle(ctx, O, R, 1, "B");
	
	var cir_O = new Circle2D(O, R);

	var E = new Point2D(O[0] - R, O[1] + R);
	var F = new Point2D(O[0] + R, O[1] + R);
	var H = new Point2D(O[0] - R, O[1] - R);
	var G = new Point2D(O[0] + R, O[1] - R);
	
	csp(ctx, E, 5, "Black");
	text1(ctx, "E", E, "rt", "up", "Black");
	csp(ctx, F, 5, "Black");
	text1(ctx, "F", F, "rt", "up", "Black");
	csp(ctx, H, 5, "Black");
	text1(ctx, "H", H, "rt", "up", "Black");
	csp(ctx, G, 5, "Black");
	text1(ctx, "G", G, "rt", "up", "Black");
	
	line_segment(ctx, E, F, 0.5, "Black");
	line_segment(ctx, F, G, 0.5, "Black");
	line_segment(ctx, G, H, 0.5, "Black");
	line_segment(ctx, H, E, 0.5, "Black");
	
	var distEF = E.Distance(F);
	var cir_E = new Circle2D(E, distEF);
	var cir_F = new Circle2D(F, distEF);
	
	arc(ctx, E, distEF, 0.4, "Black", 295, 310);
	arc(ctx, F, distEF, 0.4, "Black", 230, 250);
	
	var points = cir_E.Intersection_TwoCircles(cir_F);
	if (points == null)
	{
		return null;
	}	
	var J = new Point2D();
	if (points[0][1] > points[1][1])
	{
		J[0] = points[1][0];
		J[1] = points[1][1];
	}
	else
	{
		J[0] = points[0][0];
		J[1] = points[0][1];		
	}

	csp(ctx, J, 6, "Black");
	text2(ctx, "J", J, "middle", "up", "Black");
	
	line_segment(ctx, E, J, 0.5, "Black");
	line_segment(ctx, F, J, 0.5, "Black");
	
	var EJ = new Line2D(E, J);
	
	points = cir_O.Intersection_LineCircle(EJ);
	if (points == null)
	{
		return null;
	}	
	var K = new Point2D();
	if (points[0][1] > points[1][1])
	{
		K[0] = points[0][0];
		K[1] = points[0][1];
	}
	else
	{
		K[0] = points[1][0];
		K[1] = points[1][1];		
	}			
	csp(ctx, K, 6, "R");
	text2(ctx, "K", K, "lt", "middle", "R");

	var FJ = new Line2D(F, J);

	points = cir_O.Intersection_LineCircle(FJ);
	if (points == null)
	{
		return null;
	}
	var L = new Point2D();
	if (points[0][1] > points[1][1])
	{
		L[0] = points[0][0];
		L[1] = points[0][1];
	}
	else
	{
		L[0] = points[1][0];
		L[1] = points[1][1];		
	}			
	csp(ctx, L, 6, "R");
	text2(ctx, "L", L, "rt", "middle", "R");	

	var distKC = K.Distance(C);
	var cir_K = new Circle2D(K, distKC);
	arc(ctx, K, distKC, 0.4, "Black", 240, 270);

	points = cir_O.Intersection_TwoCircles(cir_K);
	if (points == null)
	{
		return null;
	}
	var M = new Point2D();
	if (points[0][1] > points[1][1])
	{
		M[0] = points[1][0];
		M[1] = points[1][1];
	}
	else
	{
		M[0] = points[0][0];
		M[1] = points[0][1];		
	}

	csp(ctx, M, 6, "R");
	text2(ctx, "M", M, "lt", "middle", "R");	

	var cir_M = new Circle2D(M, distKC);
	arc(ctx, M, distKC, 0.4, "Black", 290, 320);

	points = cir_O.Intersection_TwoCircles(cir_M);
	if (points == null)
	{
		return null;
	}
	var N = new Point2D();
	if (points[0][1] > points[1][1])
	{
		N[0] = points[1][0];
		N[1] = points[1][1];
	}
	else
	{
		N[0] = points[0][0];
		N[1] = points[0][1];		
	}

	csp(ctx, N, 6, "R");
	text2(ctx, "N", N, "lt", "dn", "R");	

	var cir_L = new Circle2D(L, distKC);
	arc(ctx, L, distKC, 0.4, "Black", 270, 300);

	points = cir_O.Intersection_TwoCircles(cir_L);
	if (points == null)
	{
		return null;
	}
	var Q = new Point2D();
	if (points[0][1] > points[1][1])
	{
		Q[0] = points[1][0];
		Q[1] = points[1][1];
	}
	else
	{
		Q[0] = points[0][0];
		Q[1] = points[0][1];		
	}

	csp(ctx, Q, 6, "R");
	text2(ctx, "Q", Q, "rt", "middle", "R");	

	var cir_Q = new Circle2D(Q, distKC);
	arc(ctx, Q, distKC, 0.4, "Black", 210, 240);

	points = cir_O.Intersection_TwoCircles(cir_Q);
	if (points == null)
	{
		return null;
	}
	var P = new Point2D();
	if (points[0][1] > points[1][1])
	{
		P[0] = points[1][0];
		P[1] = points[1][1];
	}
	else
	{
		P[0] = points[0][0];
		P[1] = points[0][1];		
	}

	csp(ctx, P, 6, "R");
	text2(ctx, "P", P, "rt", "dn", "R");	

	distKC = K.Distance(C);
	var distNP = N.Distance(P);
	
	line_segment(ctx, C, K, 2, "R");
	line_segment(ctx, K, M, 2, "R");
	line_segment(ctx, M, N, 2, "R");
	line_segment(ctx, N, P, 2, "R");
	line_segment(ctx, P, Q, 2, "R");
	line_segment(ctx, Q, L, 2, "R");
	line_segment(ctx, L, C, 2, "R");
	
	var t1 = new Point2D(O[0] - 1.1 * R, O[1]);
	var t2 = new Point2D(O[0] + 1.1 * R, O[1]);
	line_segment(ctx, t1, t2, 0.4, "Brawn");
	
	t1 = new Point2D(O[0], O[1] - 1.1 * R);
	t2 = new Point2D(O[0], O[1] + 1.1 * R);
	line_segment(ctx, t1, t2, 0.4, "Brawn");
}