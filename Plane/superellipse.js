var points = [64];

function superellipse()
{

	var elem1 = document.getElementById('canvas_01');
	ctx1 = elem1.getContext("2d");
	elem1.style.position = "relative";
	elem1.style.border = "1px solid";
	
	SCALE = 100;
	xC = elem1.width / 2;
	yC = elem1.height / 2;
	
	var O = new Point2D (0, 0);
	axes(ctx1, 1.8, 1.8, 0.5, "Brown");
	ctx1.font = "12px Arial";
//	text1_c(ctx1, "O", O, "rt", "up", "B");
	
	var R = 1;
	var lw = 1.2;
	var sqdev = 0.5; // квадратичность рундиста
	
	draw_superellipse(elem1, ctx1, O, R, lw, sqdev);

    var controller1 = new function() 
	{
		this.x = O[0];
		this.y = O[1];
		this.R = R;
		this.lw = lw;
		this.sqdev = sqdev;
    }();	
	// Создаем новый объект dat.GUI.
	var gui = new dat.GUI({ autoPlace: false });
	gui.domElement.id = 'gui';
	gui_container1.appendChild(gui.domElement);
	
	var f1 = gui.addFolder('Superellipse: O(x,y,R) & lw & square dev.');	
	f1.add(controller1, 'x', -2.0, 2.0).onChange( function() 
	{
		ctx1.clearRect(0, 0, elem1.width, elem1.height);
		O[0] = (controller1.x);
		draw_superellipse(elem1, ctx1, O, R, lw, sqdev);
		
	});
	f1.add(controller1, 'y', -2.0, 2.0).onChange( function() 
	{
		ctx1.clearRect(0, 0, elem1.width, elem1.height);
		O[1] = (controller1.y);
		draw_superellipse(elem1, ctx1, O, R, lw, sqdev);		
	});
	f1.add(controller1, 'R', -2.0, 2.0).onChange( function() 
	{
		ctx1.clearRect(0, 0, elem1.width, elem1.height);
		R = (controller1.R);
		draw_superellipse(elem1, ctx1, O, R, lw, sqdev);		
	});	
	f1.add(controller1, 'lw', 0.1, 4.0).onChange( function() 
	{
		ctx1.clearRect(0, 0, elem1.width, elem1.height);
		lw = (controller1.lw);
		draw_superellipse(elem1, ctx1, O, R, lw, sqdev);
		
	});
	f1.add(controller1, 'sqdev', -1.0, 1.0).onChange( function() 
	{
		ctx1.clearRect(0, 0, elem1.width, elem1.height);
		sqdev = (controller1.sqdev);
		draw_superellipse(elem1, ctx1, O, R, lw, sqdev);
		
	});
}

function draw_superellipse(elem, ctx, O, R, lw, square_deviation)	
{
	init_superellipse(O, R, lw, square_deviation);
	
	xC = elem.width / 2;
	yC = elem.height / 2;
	
	axes(ctx, 1.8, 1.8, 0.5, "Brown");
	var i;
		
	// Draw points
	for (i = 0; i < 63; i++)
	{
		line_segment(ctx, points[i], points[i+1], 1, "R");
	}
	line_segment(ctx, points[63], points[0], 1, "R");
	
	
	// Text and vertexes
	ctx.font = "italic 10pt Arial";
	
	for (i = 0; i < 64; i = i + 1)
	{
		if ( (i == 0) ||  (i == 4)  ||  (i == 8) || (i == 12) || (i == 16) || (i == 20) ||
			 (i == 24) || (i == 28) || (i == 32) || (i == 36) || (i == 40) ||
			 (i == 44) || (i == 48) || (i == 52) || (i == 56) || (i == 60) )
		{
			rsp(ctx, points[i], 3, "R");
		}
		else
		{
			rsp(ctx, points[i], 2, "B");
		}
	}		
	
	text1(ctx, "0", points[0], "rt", "up");
	text1(ctx, "4", points[4], "md", "up");
	text1(ctx, "8", points[8], "md", "up");
	text1(ctx, "12", points[12], "rt", "up");
	text1(ctx, "16", points[16], "rt", "up");
	text1(ctx, "20", points[20], "rt", "md");
	text2(ctx, "24", points[24], "lt", "md");
	text1(ctx, "28", points[28], "md", "dn");
	text1(ctx, "32", points[32], "md", "dn");
	
	text1(ctx, "36", points[36], "md", "dn");
	text1(ctx, "40", points[40], "lt", "dn");
	text1(ctx, "44", points[44], "lt", "md");
	text1(ctx, "48", points[48], "rt", "up");
	text1(ctx, "52", points[52], "lt", "md");
	text1(ctx, "56", points[56], "rt", "dn");
	text1(ctx, "60", points[60], "md", "up");	
	
	text1(ctx, "O", O, "rt", "up", "B");
	csp(ctx, O, 4, "R");
}

function init_superellipse(O, R, lw, square_deviation)
{
	var fi_0 = -90*DEGREE;
	var r1 = R * lw; // Полуось эллипса по оси X
	var r2 = -R;     // Полуось эллипса по оси Y

	if ( square_deviation < -1 || square_deviation >= 0.995 )
		return null;
	var p = 2 / ( 1 - square_deviation );  // Степень суперэллипса

	var del_fi = 2 * M_PI / 64; // Шаг углового параметра
	var x, y, w, fi;

	var i;
	for (i = 0; i < 64; i++)
	{
		fi = fi_0 + i*del_fi; // Значение углового параметра
		x = Math.cos(fi);
		y = Math.sin(fi);
		w = Math.pow (Math.abs (x), p) + Math.pow (Math.abs (y), p);
		w = 1 / Math.pow ( w, 1/p );
		var point = new Point2D ( O[0] + r1 * w * x,   O[1] + r2 * w * y);
		points[i] = point;
	}		
}
