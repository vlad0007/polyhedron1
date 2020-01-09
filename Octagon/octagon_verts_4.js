
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
var hLowerFacet = 0.65;	// Отношение высоты MiddleFacet к hp
var angle_E = 48*DEGREE;	// Угол наклона грани A
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
	
	// на рисунке это точка T 
	var upPoint1 = 0.5 * Math.tan(angle_A) + r/2;
	var point1 = new Point3D(h2h_dx, h2h_dy, upPoint1);
	
	// рассчитываем координаты вершин короны 8 - 15
	for (i = 0; i < 8; i++)
	{
		var line = new Line3D(point1, girdle[i]);
		crown[i+8] = line.IntersectionLinePlane(plane_H2H);
	}

	// Рассчитываем горизонтальную плоскость plane_Table лежащую на высоте площадки
	var plane_Table = new Plane3D();
	plane_Table.CreatePlaneNormalDistOXYZ(Z1, hCrown + r/2);	
	
	// на рисунке это точка S
	var upPoint2 = crown[8][1] * Math.tan(angle_B) + hCrown*H2H + r/2;
	var point2 = new Point3D(table_dx, table_dy, upPoint2);
	
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
		var line = new Line3D(point2, temp_points[i]);
		crown[i] = line.IntersectionLinePlane(plane_Table);
	}	

    //////////////////////////////////////////////////////////////////////////////////////////////
	//                  Pavilion
	//////////////////////////////////////////////////////////////////////////////////////////////
	
	pavil[16] = new Point3D(culet_dx, culet_dy, -r/2 - hp);
	var dh = -r/2 + 0.02;
	
	// нижние, примыкающие к калетте, четырехугольные грани павильона E0 - E7
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
	
	// горизонтальная плоскость на уровне вершин 8, 9, 10, 11, 12, 13, 14, 15 павильона
	var plane_LowerFacet = new Plane3D();
	plane_LowerFacet.CreatePlaneNormalDistOXYZ(Z1, - r/2 - hp * hLowerFacet);	

    // Вершины 8, 9, 10, 11, 12, 13, 14, 15
	pavil[8]  = plane_LowerFacet.IntersectionThreePlanes(planes_down[0], planes_down[1]);
	pavil[9]  = plane_LowerFacet.IntersectionThreePlanes(planes_down[1], planes_down[2]);
	pavil[10] = plane_LowerFacet.IntersectionThreePlanes(planes_down[2], planes_down[3]);
	pavil[11] = plane_LowerFacet.IntersectionThreePlanes(planes_down[3], planes_down[4]);
	pavil[12] = plane_LowerFacet.IntersectionThreePlanes(planes_down[4], planes_down[5]);
	pavil[13] = plane_LowerFacet.IntersectionThreePlanes(planes_down[5], planes_down[6]);
	pavil[14] = plane_LowerFacet.IntersectionThreePlanes(planes_down[6], planes_down[7]);
	pavil[15] = plane_LowerFacet.IntersectionThreePlanes(planes_down[7], planes_down[0]);		
	
	// четырехугольные грани павильона D0 - D7
	
	// Создаем два вектора a0 и b0. Их векторное произведение определит нормальный вектор плоскости D0.
	var a0 = new Vector3D(pavil[8][0] - girdle[8][0], pavil[8][1] - girdle[8][1], pavil[8][2] - girdle[8][2]);
	var b0 = new Vector3D(girdle[9][0] - girdle[15][0], girdle[9][1] - girdle[15][1], 0);
	var vec_D0 = a0.Cross(b0); // вектор перпендикулярный к плоскости D0
	vec_D0.Normer();
	var D0 = new Plane3D(); 
	D0.CreatePlaneNormalVectorPoint(vec_D0, pavil[8]);
	
	// Создаем два вектора a1 и b1. Их векторное произведение определит нормальный вектор плоскости D1.
	var a1 = new Vector3D(pavil[9][0] - girdle[9][0], pavil[9][1] - girdle[9][1], pavil[9][2] - girdle[9][2]);
	var b1 = new Vector3D(girdle[10][0] - girdle[8][0], girdle[10][1] - girdle[8][1], 0);
	var vec_D1 = a1.Cross(b1); // вектор перпендикулярный к плоскости D0
	vec_D1.Normer();
	var D1 = new Plane3D(); 
	D1.CreatePlaneNormalVectorPoint(vec_D1, pavil[9]);	
	
	// Создаем два вектора a2 и b2. Их векторное произведение определит нормальный вектор плоскости D2.
	var a2 = new Vector3D(pavil[10][0] - girdle[10][0], pavil[10][1] - girdle[10][1], pavil[10][2] - girdle[10][2]);
	var b2 = new Vector3D(girdle[11][0] - girdle[9][0], girdle[11][1] - girdle[9][1], 0);
	var vec_D2 = a2.Cross(b2); // вектор перпендикулярный к плоскости D0
	vec_D2.Normer();
	var D2 = new Plane3D(); 
	D2.CreatePlaneNormalVectorPoint(vec_D2, pavil[10]);	
	
	// Создаем два вектора a3 и b3. Их векторное произведение определит нормальный вектор плоскости D3.
	var a3 = new Vector3D(pavil[11][0] - girdle[11][0], pavil[11][1] - girdle[11][1], pavil[11][2] - girdle[11][2]);
	var b3 = new Vector3D(girdle[12][0] - girdle[10][0], girdle[12][1] - girdle[10][1], 0);
	var vec_D3 = a3.Cross(b3); // вектор перпендикулярный к плоскости D0
	vec_D3.Normer();
	var D3 = new Plane3D(); 
	D3.CreatePlaneNormalVectorPoint(vec_D3, pavil[11]);		
	
	// Создаем два вектора a4 и b4. Их векторное произведение определит нормальный вектор плоскости D4.
	var a4 = new Vector3D(pavil[12][0] - girdle[12][0], pavil[12][1] - girdle[12][1], pavil[12][2] - girdle[12][2]);
	var b4 = new Vector3D(girdle[13][0] - girdle[11][0], girdle[13][1] - girdle[11][1], 0);
	var vec_D4 = a4.Cross(b4); // вектор перпендикулярный к плоскости D0
	vec_D4.Normer();
	var D4 = new Plane3D(); 
	D4.CreatePlaneNormalVectorPoint(vec_D4, pavil[12]);	
	
	// Создаем два вектора a0 и b0. Их векторное произведение определит нормальный вектор плоскости D5.
	var a5 = new Vector3D(pavil[13][0] - girdle[13][0], pavil[13][1] - girdle[13][1], pavil[13][2] - girdle[13][2]);
	var b5 = new Vector3D(girdle[14][0] - girdle[12][0], girdle[14][1] - girdle[12][1], 0);
	var vec_D5 = a5.Cross(b5); // вектор перпендикулярный к плоскости D0
	vec_D5.Normer();
	var D5 = new Plane3D(); 
	D5.CreatePlaneNormalVectorPoint(vec_D5, pavil[13]);		
	
	// Создаем два вектора a6 и b6. Их векторное произведение определит нормальный вектор плоскости D6.
	var a6 = new Vector3D(pavil[14][0] - girdle[14][0], pavil[14][1] - girdle[14][1], pavil[14][2] - girdle[14][2]);
	var b6 = new Vector3D(girdle[15][0] - girdle[13][0], girdle[15][1] - girdle[13][1], 0);
	var vec_D6 = a6.Cross(b6); // вектор перпендикулярный к плоскости D0
	vec_D6.Normer();
	var D6 = new Plane3D(); 
	D6.CreatePlaneNormalVectorPoint(vec_D6, pavil[14]);	
	
	// Создаем два вектора a7 и b7. Их векторное произведение определит нормальный вектор плоскости D7.
	var a7 = new Vector3D(pavil[15][0] - girdle[15][0], pavil[15][1] - girdle[15][1], pavil[15][2] - girdle[15][2]);
	var b7 = new Vector3D(girdle[8][0] - girdle[14][0], girdle[8][1] - girdle[14][1], 0);
	var vec_D7 = a7.Cross(b7); // вектор перпендикулярный к плоскости D0
	vec_D7.Normer();
	var D7 = new Plane3D(); 
	D7.CreatePlaneNormalVectorPoint(vec_D7, pavil[15]);		
	
	pavil[0] = planes_down[0].IntersectionThreePlanes(D0, D7);
	pavil[1] = planes_down[1].IntersectionThreePlanes(D1, D0);
	pavil[2] = planes_down[2].IntersectionThreePlanes(D2, D1);
	pavil[3] = planes_down[3].IntersectionThreePlanes(D3, D2);
	pavil[4] = planes_down[4].IntersectionThreePlanes(D4, D3);
	pavil[5] = planes_down[5].IntersectionThreePlanes(D5, D4);
	pavil[6] = planes_down[6].IntersectionThreePlanes(D6, D5);
	pavil[7] = planes_down[7].IntersectionThreePlanes(D7, D6);
	
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