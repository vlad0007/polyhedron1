// cardioid.js
var points_cardioid = [32];

function cardioid()
{
	var elem4 = document.getElementById('canvas_04');
	ctx4 = elem4.getContext("2d");
	elem4.style.position = "relative";
	elem4.style.border = "1px solid";
	
	SCALE = 100;
	xC = 3 * elem4.width / 5;
	yC = elem4.height / 2;
	
	var R1 = 0.8;
	var R2 = 0.4;
	
	axes(ctx4, 1.8, 1.8, 0.5, "Brown");
	ctx4.font = "12px Arial";
	
	draw_cardioid(elem4, ctx4, R1, R2);

    var controller4 = new function() 
	{
		this.R1 = R1;
		this.R2 = R2;
		
    }();	
	// Создаем новый объект dat.GUI.
	var gui = new dat.GUI({ autoPlace: false });
	gui.domElement.id = 'gui';
	gui_container4.appendChild(gui.domElement);
	
	var f1 = gui.addFolder('Limaçon: R1 & R2');	
	f1.add(controller4, 'R1', 0.2, 5.0).onChange( function() 
	{
		ctx4.clearRect(0, 0, elem4.width, elem4.height);
		R1 = (controller4.R1);
		draw_cardioid(elem4, ctx4, R1, R2);		
	});	
	f1.add(controller4, 'R2', 0.2, 5.0).onChange( function() 
	{
		ctx4.clearRect(0, 0, elem4.width, elem4.height);
		R2 = (controller4.R2);
		draw_cardioid(elem4, ctx4, R1, R2);		
	});	

}

function draw_cardioid(elem, ctx, R1, R2)	
{
	xC = 3 * elem.width / 5;
	yC = elem.height / 2;
	
	axes(ctx, 1.8, 1.8, 0.5, "Brown");
	var i;
	var n = 32;
	var fi = 0;
	var d_fi = 180*DEGREE / n;
	
	var O = new Point2D (0, 0.0);
	
	for (i = 0; i < n; i++)
	{
		fi = fi + d_fi;
		var x1 = R1 * Math.cos(fi);
		var y1 = R1 * Math.sin(fi);
		var pt1 = new Point2D(x1, y1);
		
		var x2 = - R2 * Math.cos(2*fi);
		var y2 = - R2 * Math.sin(2*fi);
		var pt2 = new Point2D(x2, y2);		
		
		var pt =  pt1.Add(pt2);
		csp(ctx, pt, 3, "R");		
		points_cardioid[i] = pt;
		fi = fi + d_fi;
		if (i == 10)
		{
			circle(ctx, pt1, R2, 0.4, "Black");
			csp(ctx, pt1, 3, "Black");
			csp(ctx, pt, 3, "R");
			csp(ctx, O, 3, "Black");
			line_segment(ctx, O, pt1, 0.5, "Black");
			line_segment(ctx, pt1, pt, 0.5, "Black");
			text1(ctx, "O", O, "rt", "up", "Black");
			text1(ctx, "B", pt1, "lt", "up", "Black");
			text1(ctx, "C", pt, "rt", "up", "Black");
			text1(ctx, "A", points_cardioid[0], "lt", "up", "Black");
			circle(ctx, O, R2, 0.3, "Black");
		}
	}
	
	for (i = 0; i < 31; i++)
	{
		line_segment(ctx, points_cardioid[i], points_cardioid[i+1], 1, "R");
	}
	
	line_segment(ctx, points_cardioid[31], points_cardioid[0], 1, "R");		
	
	ctx.font = "italic 10pt Arial";
	
	for (i = 0; i < 32; i = i + 1)
	{
		if ( (i == 0) ||  (i == 4)  ||  (i == 8) || (i == 12) || (i == 16) || (i == 20) ||
			 (i == 24) || (i == 28)  )
		{
			csp(ctx, points_cardioid[i], 5, "R");
		}
		else
		{
			csp(ctx, points_cardioid[i], 3, "R");
		}
	}	
	
	circle(ctx, O, R1, 0.4, "Black");
}

