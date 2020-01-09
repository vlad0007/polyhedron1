function two_circles()
{
	var elem4 = document.getElementById('canvas_04');
	ctx4 = elem4.getContext("2d");
	elem4.style.position = "relative";
	elem4.style.border = "1px solid";
	
	SCALE = 100;
	xC = elem4.width / 2;
	yC = elem4.height / 2;
	
	// canvas ctx4
	var O1 = new Point2D (-0.5, 0);
	var R1 = 0.7;
	var O2 = new Point2D ( 0.5, 0);
	var R2 = 0.7;
	ctx4.font = "12px Arial";
	
	
	draw_two_circles(ctx4, O1, O2, R1, R2);

    var controller4 = new function() 
	{
		this.X1 = O1[0];
		this.Y1 = O1[1];
		this.R1 = R1;
		
		this.X2 = O2[0];
		this.Y2 = O2[1];
		this.R2 = R2;
    }();	
	// Создаем новый объект dat.GUI.
	var gui = new dat.GUI({ autoPlace: false });
	gui.domElement.id = 'gui';
	gui_container4.appendChild(gui.domElement);
	
	var f1 = gui.addFolder('Circle 1: Center & Radius');	
	f1.add(controller4, 'X1', -2.0, 2.0).onChange( function() 
	{
		ctx4.clearRect(0, 0, elem4.width, elem4.height);
		O1[0] = (controller4.X1);
		draw_two_circles(ctx4, O1, O2, R1, R2);
		
	});
	f1.add(controller4, 'Y1', -2.0, 2.0).onChange( function() 
	{
		ctx4.clearRect(0, 0, elem4.width, elem4.height);
		O1[1] = (controller4.Y1);
		draw_two_circles(ctx4, O1, O2, R1, R2);		
	});
	f1.add(controller4, 'R1', 0.01, 2.0).onChange( function() 
	{
		ctx4.clearRect(0, 0, elem4.width, elem4.height);
		R1 = (controller4.R1);
		draw_two_circles(ctx4, O1, O2, R1, R2);		
	});	
	
	
	
	var f2 = gui.addFolder('Circle 2: Center & Radius');	
	f2.add(controller4, 'X2', -2.0, 2.0).onChange( function() 
	{
		ctx4.clearRect(0, 0, elem4.width, elem4.height);
		O2[0] = (controller4.X2);
		draw_two_circles(ctx4, O1, O2, R1, R2);
		
	});
	f2.add(controller4, 'Y2', -2.0, 2.0).onChange( function() 
	{
		ctx4.clearRect(0, 0, elem4.width, elem4.height);
		O2[1] = (controller4.Y2);
		draw_two_circles(ctx4, O1, O2, R1, R2);		
	});
	f2.add(controller4, 'R2', 0.01, 2.0).onChange( function() 
	{
		ctx4.clearRect(0, 0, elem4.width, elem4.height);
		R2 = (controller4.R2);
		draw_two_circles(ctx4, O1, O2, R1, R2);		
	});	
}

function draw_two_circles(ctx, O1, O2, R1, R2)	
{
	axes(ctx, 1.8, 1.8, 0.5, "Brown");
	
	csp(ctx, O1, 5, "B");
	var t1 = (roundNumber(O1[0], 2)).toString();
	var t2 = (roundNumber(O1[1], 2)).toString();
	var t = t1 + ", " + t2;
	text1(ctx, t, O1, "rt", "up", "B");
	circle(ctx, O1, R1, 1, "B");
	
	csp(ctx, O2, 5, "B");
	t1 = (roundNumber(O2[0], 2)).toString();
	t2 = (roundNumber(O2[1], 2)).toString();
	t = t1 + ", " + t2;
	text1(ctx, t, O2, "rt", "up", "B");
	circle(ctx, O2, R2, 1, "B");
	
	var cir1 = new Circle2D(O1, R1); 
	var cir2 = new Circle2D(O2, R2); 
	
	var points = cir1.Intersection_TwoCircles(cir2);
	if (points == null)
	{
	   return null;
	}
		
	csp(ctx, points[0], 6, "R");
	csp(ctx, points[1], 6, "R");	
	
	var t1 = (roundNumber(points[0][0], 2)).toString();
	var t2 = (roundNumber(points[0][1], 2)).toString();
	var t = t1 + ", " + t2;
	text1(ctx, t, points[0], "rt", "up", "R");
	
	t1 = (roundNumber(points[1][0], 2)).toString();
	t2 = (roundNumber(points[1][1], 2)).toString();
	t = t1 + ", " + t2;
	text1(ctx, t, points[1], "rt", "up", "R");	
}

