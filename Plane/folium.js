var points_folium = [32];

function folium()
{
	var elem2 = document.getElementById('canvas_02');
	ctx2 = elem2.getContext("2d");
	elem2.style.position = "relative";
	elem2.style.border = "1px solid";
	
	SCALE = 100;
	xC = elem2.width / 8;
	yC = elem2.height / 2;
	
	var O = new Point2D (0, 0.0);
	axes(ctx2, 1.8, 1.8, 0.5, "Brown");
	ctx2.font = "12px Arial";
	var t1 = (roundNumber(O[0], 2)).toString();
	var t2 = (roundNumber(O[1], 2)).toString();
	var t = t1 + ", " + t2;
	
	var a = 1.5;
	
	draw_folium(elem2, ctx2, O, a);

    var controller2 = new function() 
	{
		this.x = O[0];
		this.y = O[1];
		this.a = a;
		
    }();	
	// Создаем новый объект dat.GUI.
	var gui = new dat.GUI({ autoPlace: false });
	gui.domElement.id = 'gui';
	gui_container2.appendChild(gui.domElement);
	
	var f1 = gui.addFolder('Folium: point O(x,y) & point A(a,0)');	
	f1.add(controller2, 'x', -2.0, 2.0).onChange( function() 
	{
		ctx2.clearRect(0, 0, elem2.width, elem2.height);
		O[0] = (controller2.x);
		draw_folium(elem2, ctx2, O, a);
		
	});
	f1.add(controller2, 'y', -2.0, 2.0).onChange( function() 
	{
		ctx2.clearRect(0, 0, elem2.width, elem2.height);
		O[1] = (controller2.y);
		draw_folium(elem2, ctx2, O, a);		
	});
	f1.add(controller2, 'a', 0.2, 5.0).onChange( function() 
	{
		ctx2.clearRect(0, 0, elem2.width, elem2.height);
		a = (controller2.a);
		draw_folium(elem2, ctx2, O, a);		
	});	
}

function draw_folium(elem, ctx, O, a)	
{
	xC = elem.width / 8;
	yC = elem.height / 2;
	
	axes(ctx, 1.8, 1.8, 0.5, "Brown");
	var i;

	var n = 16;
	var fi = 0;
	var d_fi = 90*DEGREE / n;
	var cir_center = new Point2D(O[0] + a, O[1]);
	var cir = new Circle2D(cir_center, a);
	circle(ctx, cir_center, a, 0.4, "Black");
	
	var pt = new Point2D(O[0] + 1, O[1]);
	for (i = 1; i < n; i++)
	{
		fi = fi + d_fi;
		pt[1] = O[1] + Math.tan(fi);
		var line = new Line2D(O, pt);
		
		var point1 = new Point2D(); 
		var point2 = new Point2D(); 
		var points = cir.Intersection_LineCircle(line);
		if (points == null)
		{
			return null;
		}
		var P = new Point2D(); 
		if (points[0][1] > points[1][1])
		{
			P[0] = points[0][0];
			P[1] = points[0][1];
		}
		else
		{
			P[0] = points[1][0];
			P[1] = points[1][1];			
		}			
		
		var Q = new Point2D(P[0], O[1]);
		var QM = line.CreateNormalLinePoint(Q);
		var M = line.IntersectionTwoLines(QM);
		line_segment(ctx, P, Q, 0.4, "Black");
		line_segment(ctx, M, Q, 0.4, "Black");
		line_segment(ctx, O, P, 0.4, "Black");
		
		points_folium[i] = M;
		if (i == 5)
		{
			csp(ctx2, P, 4, "Black");
			text1(ctx2, "P", P, "lt", "up", "Black");
			csp(ctx2, Q, 4, "Black");
			text1(ctx2, "Q", Q, "lt", "up", "Black");
			csp(ctx2, M, 4, "R");
			text1(ctx2, "M", M, "lt", "up", "R");
		}
	}
	
	points_folium[0] = new Point2D(O[0] + 2*a, O[1]);
	points_folium[16] = new Point2D(O[0], O[1]);
	
	for (i = 1; i < 16; i++)
	{
		points_folium[16+i] = new Point2D(points_folium[16-i][0],  - points_folium[16-i][1] + 2 * O[1] );
	}
	
	for (i = 0; i < 31; i++)
	{
		line_segment(ctx, points_folium[i], points_folium[i+1], 1, "R");
	}
	
	line_segment(ctx, points_folium[31], points_folium[0], 1, "R");
	
	ctx.font = "italic 10pt Arial";
	
	for (i = 0; i < 32; i = i + 1)
	{
		if ( (i == 0) ||  (i == 4)  ||  (i == 8) || (i == 12) || (i == 16) || (i == 20) ||
			 (i == 24) || (i == 28)  )
		{
			csp(ctx, points_folium[i], 4, "R");
		}
		else
		{
			csp(ctx, points_folium[i], 3, "R");
		}
	}	
	
	csp(ctx, O, 6, "R");
	text1(ctx, "O", O, "lt", "up", "R");
	var A = new Point2D(O[0] + 2*a, O[1]);
	csp(ctx, A, 6, "R");
	text1(ctx, "A", A, "rt", "up", "R");
	line_segment(ctx, O, A, 0.4, "Black");
}

