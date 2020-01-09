
var DEGREE = 0.01745329251994;
// Рундист
var r = 0.02;       // высота рундиста

// Корона
var hCrown = 0.21;	// Высота короны
var t = 0.3;		// размер площадки
var angle_B = 39*DEGREE;	// верхний угол короны (для передней и боковой грани)
var angle_A = 62*DEGREE;    // нижний угол короны (одинаковый для всех граней)
var H2H = 0.5;	// Отношение высоты нижней части короны ко всей ее высоте
var table_dx = 0.00001;
var table_dy = 0.00001;
var h2h_dx = 0.00001;
var h2h_dy = 0.00001;

// Павильон
var hp = 0.67;		// Высота павильона
var angle_D = 65*DEGREE;	// Угол наклона грани A
var angle_E = 43*DEGREE;	// Угол наклона грани B
var culet_dx = 0.00001;
var culet_dy = 0.00001;

var girdle = [16];
var vertices = [];

// Расчет координат вершин огранки (модели).
function VerticesCalculation()
{
	var i;
	var Z1 = new Vector3D(0, 0, 1);
	var crown = [];
	var pavil = [];	
	
	InitGirdle(); // Расчет координат вершин рундиста
	
	// Crown
	// Рассчитываем горизонтальную плоскость plane_H2H лежащую на высоте hCrown*H2H + r/2
	var plane_H2H = new Plane3D();
	plane_H2H.CreatePlaneNormalDistOXYZ(Z1, hCrown*H2H + r/2);	
	
	// точка T 
	var upPoint1 = 0.5 * Math.tan(angle_A) + r/2;
	var T = new Point3D(h2h_dx, h2h_dy, upPoint1);
	
	// рассчитываем координаты вершин короны 8 - 15
	for (i = 0; i < 8; i++)
	{
		var line = new Line3D(T, girdle[i]);
		crown[i+8] = line.IntersectionLinePlane(plane_H2H);
	}

	// Рассчитываем горизонтальную плоскость plane_Table лежащую на высоте площадки
	var plane_Table = new Plane3D();
	plane_Table.CreatePlaneNormalDistOXYZ(Z1, hCrown + r/2);	
	
	// точка S
	var upPoint2 = crown[8][1] * Math.tan(angle_B) + hCrown*H2H + r/2;
	var S = new Point3D(table_dx, table_dy, upPoint2);
	
	// Восемь вспомогательных точек для нахождения вершин короны лежащих на уровне площадки
	var temp_points = [8];
	temp_points[0] = new Point3D((crown[8][0] + crown[15][0]) / 2, (crown[8][1] + crown[15][1]) / 2, hCrown*H2H + r/2);
	temp_points[1] = new Point3D((crown[9][0] + crown[8][0]) / 2, (crown[9][1] + crown[8][1]) / 2, hCrown*H2H + r/2);
	temp_points[2] = new Point3D((crown[10][0] + crown[9][0]) / 2, (crown[10][1] + crown[9][1]) / 2, hCrown*H2H + r/2);
	temp_points[3] = new Point3D((crown[11][0] + crown[10][0]) / 2, (crown[11][1] + crown[10][1]) / 2, hCrown*H2H + r/2);
	temp_points[4] = new Point3D((crown[12][0] + crown[11][0]) / 2, (crown[12][1] + crown[11][1]) / 2, hCrown*H2H + r/2);
	temp_points[5] = new Point3D((crown[13][0] + crown[12][0]) / 2, (crown[13][1] + crown[12][1]) / 2, hCrown*H2H + r/2);
	temp_points[6] = new Point3D((crown[14][0] + crown[13][0]) / 2, (crown[14][1] + crown[13][1]) / 2, hCrown*H2H + r/2);
	temp_points[7] = new Point3D((crown[15][0] + crown[14][0]) / 2, (crown[15][1] + crown[14][1]) / 2, hCrown*H2H + r/2);
	
	// рассчитываем координаты вершин короны 0 - 7
	for (i = 0; i < 8; i++)
	{
		var line = new Line3D(S, temp_points[i]);
		crown[i] = line.IntersectionLinePlane(plane_Table);
	}	

    //////////////////////////////////////////////////////////////////////////////////////////////
	//                  Pavilion
	//////////////////////////////////////////////////////////////////////////////////////////////
	
	pavil[16] = new Point3D(culet_dx, culet_dy, -r/2 - hp);
	
	// верхние четырехугольные грани павильона D0 - D7
	var planes_up = [8];
	var D0 = new Plane3D();
	D0.CreateInclinePlane(angle_D, girdle[9], girdle[15], girdle[8]);
	planes_up[0] = D0;
	var D7 = new Plane3D();
	D7.CreateInclinePlane(angle_D, girdle[8], girdle[14], girdle[15]); 
	planes_up[7] = D7;
	
	// создаем плоскости (planes_up) в которых лежат грани D1 - D6
	for (i = 1; i < 7; i++)
	{	
		var plane = new Plane3D();
		plane.CreateInclinePlane(angle_D, girdle[8 + i + 1], girdle[8 + i - 1], girdle[8 + i]);
		planes_up[i] = plane;
	}
	
	// грани павильона E0 - E7
	var planes_down = [8];
	var E0 = new Plane3D();
	E0.CreateInclinePlane(angle_E, girdle[8], girdle[15], pavil[16]);
	planes_down[0] = E0;

	// создаем плоскости (planes_down) в которых лежат грани E1 - E7
	for (i = 1; i < 8; i++)
	{	
		var plane = new Plane3D();
		plane.CreateInclinePlane(angle_E, girdle[i+8], girdle[8 + i - 1], pavil[16]);
		planes_down[i] = plane;
	}

	pavil[0] = planes_up[0].IntersectionThreePlanes(planes_down[0], planes_up[7]);
	pavil[1] = planes_up[1].IntersectionThreePlanes(planes_down[1], planes_up[0]);
	pavil[2] = planes_up[2].IntersectionThreePlanes(planes_down[2], planes_up[1]);
	pavil[3] = planes_up[3].IntersectionThreePlanes(planes_down[3], planes_up[2]);
	pavil[4] = planes_up[4].IntersectionThreePlanes(planes_down[4], planes_up[3]);
	pavil[5] = planes_up[5].IntersectionThreePlanes(planes_down[5], planes_up[4]);
	pavil[6] = planes_up[6].IntersectionThreePlanes(planes_down[6], planes_up[5]);
	pavil[7] = planes_up[7].IntersectionThreePlanes(planes_down[7], planes_up[6]);	
	
	////////////////////////////////////////////////////////////////////////////////////
	
    // Вершины 8, 9, 10, 11, 12, 13, 14, 15

	pavil[8]  = planes_up[0].IntersectionThreePlanes(planes_down[0], planes_down[1]);
	pavil[9]  = planes_up[1].IntersectionThreePlanes(planes_down[1], planes_down[2]);
	pavil[10] = planes_up[2].IntersectionThreePlanes(planes_down[2], planes_down[3]);
	pavil[11] = planes_up[3].IntersectionThreePlanes(planes_down[3], planes_down[4]);
	pavil[12] = planes_up[4].IntersectionThreePlanes(planes_down[4], planes_down[5]);
	pavil[13] = planes_up[5].IntersectionThreePlanes(planes_down[5], planes_down[6]);
	pavil[14] = planes_up[6].IntersectionThreePlanes(planes_down[6], planes_down[7]);
	pavil[15] = planes_up[7].IntersectionThreePlanes(planes_down[7], planes_down[0]);	

		
	// В массиве vertices хранятся координаты (x, y, z) всех вершин огранки подряд.
	for(i = 0; i < 16; i++)
	{
		vertices.push(crown[i][0]);
		vertices.push(crown[i][1]);
		vertices.push(crown[i][2]);
	}
	for(i = 0; i < 16; i++)
	{
		vertices.push(girdle[i][0]);
		vertices.push(girdle[i][1]);
		vertices.push(girdle[i][2]);
	}
	for(i = 0; i < 17; i++)
	{
		vertices.push(pavil[i][0]);
		vertices.push(pavil[i][1]);
		vertices.push(pavil[i][2]);
	}
}

function InitGirdle()
{
	// Координаты вершин рундиста.
	var d = Math.sqrt(0.5*0.5 + 0.5*0.5); // distance OP
	var line_JK = new Line2D(new Point2D(0.0, d), new Point2D(d, 0.0));
	var line_NP = new Line2D(new Point2D(-0.5, 0.5), new Point2D(0.5, 0.5));
	var line_QP = new Line2D(new Point2D(0.5, -0.5), new Point2D(0.5, 0.5));
	var B = line_JK.IntersectionTwoLines(line_NP);
	var C = line_JK.IntersectionTwoLines(line_QP);
	
	girdle[0] =  new Point3D(B[0], B[1], r/2); 
	girdle[1] =  new Point3D(C[0], C[1], r/2);  
	girdle[2] =  new Point3D(  girdle[1][0], - girdle[1][1], r/2);
	girdle[3] =  new Point3D(  girdle[0][0], - girdle[0][1], r/2);
	girdle[4] =  new Point3D(- girdle[3][0],   girdle[3][1], r/2);
	girdle[5] =  new Point3D(- girdle[2][0],   girdle[2][1], r/2);
	girdle[6] =  new Point3D(- girdle[1][0],   girdle[1][1], r/2);
	girdle[7] =  new Point3D(- girdle[0][0],   girdle[0][1], r/2);

	girdle[8] =  new Point3D(  girdle[0][0], girdle[0][1], -r/2);
	girdle[9] =  new Point3D(  girdle[1][0], girdle[1][1], -r/2);
	girdle[10] = new Point3D(  girdle[2][0], girdle[2][1], -r/2);
	girdle[11] = new Point3D(  girdle[3][0], girdle[3][1], -r/2);
	girdle[12] = new Point3D(  girdle[4][0], girdle[4][1], -r/2);
	girdle[13] = new Point3D(  girdle[5][0], girdle[5][1], -r/2);
	girdle[14] = new Point3D(  girdle[6][0], girdle[6][1], -r/2);
	girdle[15] = new Point3D(  girdle[7][0], girdle[7][1], -r/2);
}

// Все грани (полигоны) 3D модели огранки обходим против часовой стрелки
// если смотреть на модель находясь от нее снаружи.
var index_cut = [
        // площадка (table)
		0,7,6,5,4,3,2,1,0, // 0

		// корона (crown)
		0,8,15,0, // 1
		2,10,9,2,
		4,12,11,4,
		6,14,13,6,

		1,9,8,1, // 5
		3,11,10,3,
		5,13,12,5,
		7,15,14,7,

		0,1,8,0, // 9
		2,9,1,2,
		2,3,10,2,
		4,11,3,4,
		4,5,12,4,
		6,13,5,6,
		6,7,14,6,
		0,15,7,0,

		8,16,23,15,8, // 17
		9,10,18,17,9,
		11,12,20,19,11,
		14,22,21,13,14,

		8,9,17,16,8,  // 21
		10,11,19,18,10,
		12,13,21,20,12,
		15,23,22,14,15,

		// рундист (girdle)
		16, 24, 31, 23, 16, // 25
		17, 25, 24, 16, 17,
		18, 26, 25, 17, 18,
		19, 27, 26, 18, 19,
		20, 28, 27, 19, 20,
		21, 29, 28, 20, 21,
		22, 30, 29, 21, 22,
		23, 31, 30, 22, 23,

		// павильон (pavilion)
		32, 31, 24, 32, // 33
		33, 24, 25, 33,
		34, 25, 26, 34,
		35, 26, 27, 35,
		36, 27, 28, 36,
		37, 28, 29, 37,
		38, 29, 30, 38,
		39, 30, 31, 39,

		48, 47, 32, 40, 48, // 41
		48, 40, 33, 41, 48,
		48, 41, 34, 42, 48,
		48, 42, 35, 43, 48,
		48, 43, 36, 44, 48,
		48, 44, 37, 45, 48,
		48, 45, 38, 46, 48,
		48, 46, 39, 47, 48,  // 48

		40, 32, 24, 33, 40, // 49
		41, 33, 25, 34, 41,
		42, 34, 26, 35, 42,
		43, 35, 27, 36, 43,
		44, 36, 28, 37, 44,
		45, 37, 29, 38, 45,
		46, 38, 30, 39, 46,
		47, 39, 31, 32, 47, // 56

		-100
];

// Раскраска граней модели
function facet_colors()
{
	var ind = 0;
	var i;

	// table
	colors[ind] = new THREE.Color("rgb(150, 150, 150)");
	ind++;
	
	// upper crown facets
	for (i = 0; i < 8; i++)
	{
		colors[ind] = new THREE.Color("rgb(150, 150, 250)");
		ind++;
	}
	
	// crown facets
	for (i = 0; i < 8; i++)
	{
		colors[ind] = new THREE.Color("rgb(100, 100, 250)");
		ind++;
	}	
	
	// bottom crown facets
	for (i = 0; i < 4; i++)
	{
		colors[ind] = new THREE.Color("rgb(170, 170, 250)"); ind++;
	}
	
	for (i = 0; i < 4; i++)
	{
		colors[ind] = new THREE.Color("rgb(200, 200, 250)"); ind++;
	}
		
	//  GIRDLE
	for (i = 0; i < 4; i++)
	{
		colors[ind] = new THREE.Color("rgb(200, 200, 250)"); ind++;
		colors[ind] = new THREE.Color("rgb(170, 170, 250)"); ind++;
	}
	
	// Pavilion
	for (i = 0; i < 8; i++)
	{
		colors[ind] = new THREE.Color("rgb(170, 150, 250)"); ind++;
	}
	for (i = 0; i < 4; i++)
	{
		colors[ind] = new THREE.Color("rgb(170, 150, 250)"); ind++;
		colors[ind] = new THREE.Color("rgb(170, 180, 250)"); ind++;
	}	
	
	for (i = 0; i < 4; i++)
	{
		colors[ind] = new THREE.Color("rgb(120, 150, 250)"); ind++;
		colors[ind] = new THREE.Color("rgb(120, 150, 250)"); ind++;
		colors[ind] = new THREE.Color("rgb(120, 150, 250)"); ind++;
		colors[ind] = new THREE.Color("rgb(120, 150, 250)"); ind++;
	}	
};