var points_w = [96];

function waviness()
{

	var elem5 = document.getElementById('canvas_05');
	ctx5 = elem5.getContext("2d");
	elem5.style.position = "relative";
	elem5.style.border = "1px solid";
	
	SCALE = 100;
	xC = elem5.width / 2;
	yC = elem5.height / 2;
	
	var O = new Point2D (0, 0);
	axes(ctx5, 1.8, 1.8, 0.5, "Brown");
	ctx5.font = "12px Arial";
	
	var R = 1;
	var lw = 1.2;
	var e = 0.115;
	var m = 12;
	
	draw_waviness(elem5, ctx5, O, R, lw, e, m);

    var controller5 = new function() 
	{
		this.x = O[0];
		this.y = O[1];
		this.R = R;
		this.lw = lw;
		this.e = e;
		this.m = m;
    }();	
	// Создаем новый объект dat.GUI.
	var gui = new dat.GUI({ autoPlace: false });
	gui.domElement.id = 'gui';
	gui_container5.appendChild(gui.domElement);
	
	var f1 = gui.addFolder('waviness: O(x,y,R) & lw & e & m');	
	f1.add(controller5, 'x', -2.0, 2.0).onChange( function() 
	{
		ctx5.clearRect(0, 0, elem5.width, elem5.height);
		O[0] = (controller5.x);
		draw_waviness(elem5, ctx5, O, R, lw, e, m);
		
	});
	f1.add(controller5, 'y', -2.0, 2.0).onChange( function() 
	{
		ctx5.clearRect(0, 0, elem5.width, elem5.height);
		O[1] = (controller5.y);
		draw_waviness(elem5, ctx5, O, R, lw, e, m);		
	});
	f1.add(controller5, 'R', -5.0, 5.0).onChange( function() 
	{
		ctx5.clearRect(0, 0, elem5.width, elem5.height);
		R = (controller5.R);
		draw_waviness(elem5, ctx5, O, R, lw, e, m);		
	});	
	f1.add(controller5, 'lw', 0.1, 4.0).onChange( function() 
	{
		ctx5.clearRect(0, 0, elem5.width, elem5.height);
		lw = (controller5.lw);
		draw_waviness(elem5, ctx5, O, R, lw, e, m);	
	});
	f1.add(controller5, 'e', -0.8, 0.8).onChange( function() 
	{
		ctx5.clearRect(0, 0, elem5.width, elem5.height);
		e = (controller5.e);
		draw_waviness(elem5, ctx5, O, R, lw, e, m);	
	});
	
	f1.add(controller5, 'm', -24, 24).onChange( function() 
	{
		ctx5.clearRect(0, 0, elem5.width, elem5.height);
		m = (controller5.m);
		draw_waviness(elem5, ctx5, O, R, lw, e, m);
	});
}

function draw_waviness(elem, ctx, O, R, lw, e, m)	
{
	init_waviness(O, R, lw, e, m);
	
	xC = elem.width / 2;
	yC = elem.height / 2;
	
	axes(ctx, 1.8, 1.8, 0.5, "Brown");
	var i;
		
	// Draw points
	for (i = 0; i < 95; i++)
	{
		line_segment(ctx, points_w[i], points_w[i+1], 1, "R");
	}
	line_segment(ctx, points_w[95], points_w[0], 1, "R");
	
	
	// Text and vertexes
	ctx.font = "italic 10pt Arial";
	
	for (i = 0; i < 96; i = i + 1)
	{
		if ( (i == 0) ||  (i == 4)  ||  (i == 8) || (i == 12) || (i == 16) || (i == 20) ||
			 (i == 24) || (i == 28) || (i == 32) || (i == 36) || (i == 40) ||
			 (i == 44) || (i == 48) || (i == 52) || (i == 56) || (i == 60) ||
			 (i == 64) || (i == 68) || (i == 72) || (i == 76) || (i == 80) ||
			 (i == 84) || (i == 88) || (i == 92) )
		{
			rsp(ctx, points_w[i], 3, "R");
		}
		else
		{
			rsp(ctx, points_w[i], 2, "B");
		}
	}		
	
	text1(ctx, "0", points_w[0], "rt", "up");
	text1(ctx, "4", points_w[4], "md", "up");
	text1(ctx, "8", points_w[8], "md", "up");
	text1(ctx, "12", points_w[12], "rt", "up");
	text1(ctx, "16", points_w[16], "rt", "up");
	text1(ctx, "20", points_w[20], "rt", "md");
	text2(ctx, "24", points_w[24], "lt", "md");
	text1(ctx, "28", points_w[28], "md", "dn");
	text1(ctx, "32", points_w[32], "md", "dn");
	
	text1(ctx, "36", points_w[36], "md", "dn");
	text1(ctx, "40", points_w[40], "lt", "dn");
	text1(ctx, "44", points_w[44], "lt", "dn");
	text1(ctx, "48", points_w[48], "lt", "dn");
	text1(ctx, "52", points_w[52], "md", "dn");
	text1(ctx, "56", points_w[56], "lt", "dn");
	text1(ctx, "60", points_w[60], "md", "dn");	
	text1(ctx, "64", points_w[64], "md", "up");	
	text1(ctx, "68", points_w[68], "md", "up");	
	text1(ctx, "72", points_w[72], "md", "up");	
	text1(ctx, "76", points_w[76], "md", "up");	
	text1(ctx, "80", points_w[80], "md", "up");	
	text1(ctx, "84", points_w[84], "md", "up");	
	text1(ctx, "88", points_w[88], "md", "up");	
	text1(ctx, "92", points_w[92], "md", "up");	
	
	text1(ctx, "O", O, "rt", "up", "B");
	csp(ctx, O, 4, "R");
}

function init_waviness(O, R, lw, e, m)
{
	
	var N = 96;
	var i;
	var del = 2 * M_PI / N;
	var fi = 0;

	for(i = 0; i < N; i++)
	{
		fi = 90*DEGREE - i*del;

		var x = R * (1 / ( 1 + e * Math.cos(m * fi))) * Math.cos(fi) + O[0];
		var y = R * (1 / ( 1 + e * Math.cos(m * fi))) * Math.sin(fi) + O[1];
		var point = new Point2D ( lw * x, y);
		points_w[i] = point;
	}	
}
