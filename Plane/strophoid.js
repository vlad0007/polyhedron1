// strophoide.js
var points_strophoid = [32];

function strophoide()
{
	var elem3 = document.getElementById('canvas_03');
	ctx3 = elem3.getContext("2d");
	elem3.style.position = "relative";
	elem3.style.border = "1px solid";
	
	SCALE = 100;
	xC = 7 * elem3.width / 8;
	yC = elem3.height / 2;
	
	var a = 3.0;
	var O = new Point2D (0, 0);
	
	axes(ctx3, 3.8, 3.8, 0.5, "Brown");
	ctx3.font = "12px Arial";
	
	draw_strophoide(elem3, ctx3, O, a);

    var controller3 = new function() 
	{
		this.x = O[0];
		this.y = O[1];
		this.a = a;
    }();	
	// Создаем новый объект dat.GUI.
	var gui = new dat.GUI({ autoPlace: false });
	gui.domElement.id = 'gui';
	gui_container3.appendChild(gui.domElement);
	
	var f1 = gui.addFolder('Strophoid: point O(x,y) & point A(-a,0)');	
	f1.add(controller3, 'x', -2.0, 2.0).onChange( function() 
	{
		ctx3.clearRect(0, 0, elem3.width, elem3.height);
		O[0] = (controller3.x);
		draw_strophoide(elem3, ctx3, O, a);
		
	});
	f1.add(controller3, 'y', -2.0, 2.0).onChange( function() 
	{
		ctx3.clearRect(0, 0, elem3.width, elem3.height);
		O[1] = (controller3.y);
		draw_strophoide(elem3, ctx3, O, a);		
	});
	f1.add(controller3, 'a', 0.2, 5.0).onChange( function() 
	{
		ctx3.clearRect(0, 0, elem3.width, elem3.height);
		a = (controller3.a);
		draw_strophoide(elem3, ctx3, O, a);		
	});	
}

function draw_strophoide(elem, ctx, O, a)	
{
	xC = 7 * elem.width / 8;
	yC = elem.height / 2;
	
	axes(ctx, 3.8, 3.8, 0.5, "Brown");
	var i;
	var n = 16;
	var fi = 0;
	var d_fi = 90*DEGREE / n;
	
	var OY = new Line2D(O, new Point2D(O[0], O[1] + 1));
	var A = new Point2D(O[0] - a, O[1]);
	var pt = new Point2D(A[0] + 1, A[1]);
	var B;
	for (i = 1; i < n; i++)
	{
		fi = fi + d_fi;
		pt[1] = A[1] + Math.tan(fi);
		var line = new Line2D(A, pt);
		B = line.IntersectionTwoLines(OY);
		line_segment(ctx, A, B, 0.4, "Black");
		csp(ctx, B, 3, "Black");
		
		var dist_OB = B.Distance(O);
		var dist_AB = B.Distance(A);
		var dist_AM = dist_AB - dist_OB;
		var dist_MB = dist_OB;
		var relation = dist_AM / dist_MB;
		var M = new Point2D();
		M[0] = (A[0] + relation * B[0]) / (1 + relation);
		M[1] = (A[1] + relation * B[1]) / (1 + relation);
		points_strophoid[i] = M;
		if(i == 4)
		{
			ctx3.font = "10px Arial";
			text1(ctx, "B", B, "rt", "middle", "Black");
			text1(ctx, "M", M, "center", "up", "Black");
			ctx3.font = "12px Arial";
		}
	}
	points_strophoid[0] = O;
	points_strophoid[16] = A;
	
	for (i = 1; i < 16; i++)
	{
		points_strophoid[16+i] = new Point2D(points_strophoid[16-i][0],  - points_strophoid[16-i][1] + 2 * O[1] );
	}
	
	for (i = 0; i < 31; i++)
	{
		line_segment(ctx, points_strophoid[i], points_strophoid[i+1], 1, "R");
	}
	
	line_segment(ctx, points_strophoid[31], points_strophoid[0], 1, "R");	
	
	ctx.font = "italic 10pt Arial";
	
	for (i = 0; i < 32; i = i + 1)
	{
		if ( (i == 0) ||  (i == 4)  ||  (i == 8) || (i == 12) || (i == 16) || (i == 20) ||
			 (i == 24) || (i == 28)  )
		{
			csp(ctx, points_strophoid[i], 5, "R");
		}
		else
		{
			csp(ctx, points_strophoid[i], 3, "R");
		}
	}	
	
	var pt1 = new Point2D(B[0], -5);
	var pt2 = new Point2D(B[0],  5);
	line_segment(ctx, pt1, pt2, 0.5, "Black");
	line_segment(ctx, A, O, 0.5, "Black");
	text1(ctx, "O", O, "rt", "up", "Black");
	text1(ctx, "A", A, "lt", "up", "Black");
	var ttt = 777;
}

