
var DEGREE = 0.01745329251994;
// Рундист
var r = 0.02;       // высота рундиста

// Корона
var hCrown = 0.21;	// Высота короны
var t = 0.3;		// размер площадки
var angle_B = 39*DEGREE;	// верхний угол короны (одинаковый для всех граней)
var angle_A = 62*DEGREE;    // нижний угол короны (одинаковый для всех граней)
var H2H = 0.5;	// Отношение высоты нижней части короны ко всей ее высоте
var table_dx = 0.00001;
var table_dy = 0.00001;
var h2h_dx = 0.00001;
var h2h_dy = 0.00001;

// Павильон
var hp = 0.67;		// Высота павильона
var hMiddleFacet = 0.4;	// Отношение высоты MiddleFacet к hp
var angle_D = 65*DEGREE;	// Угол наклона грани A
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
	
	// на глубине -r/2 - hp * hMiddleFacet лежат вершины 0, 1, 2, 3, 4, 5, 6 павильона
	// горизонтальная плоскость на уровне вершин 0, 1, 2, 3, 4, 5, 6 павильона
	var plane_MiddleFacet = new Plane3D();
	plane_MiddleFacet.CreatePlaneNormalDistOXYZ(Z1, -r/2 - hp * hMiddleFacet);
	
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
	
	pavil[0] = plane_MiddleFacet.IntersectionThreePlanes(planes_up[0], planes_up[7]);
	pavil[1] = plane_MiddleFacet.IntersectionThreePlanes(planes_up[1], planes_up[0]);
	pavil[2] = plane_MiddleFacet.IntersectionThreePlanes(planes_up[2], planes_up[1]);
	pavil[3] = plane_MiddleFacet.IntersectionThreePlanes(planes_up[3], planes_up[2]);
	pavil[4] = plane_MiddleFacet.IntersectionThreePlanes(planes_up[4], planes_up[3]);
	pavil[5] = plane_MiddleFacet.IntersectionThreePlanes(planes_up[5], planes_up[4]);
	pavil[6] = plane_MiddleFacet.IntersectionThreePlanes(planes_up[6], planes_up[5]);
	pavil[7] = plane_MiddleFacet.IntersectionThreePlanes(planes_up[7], planes_up[6]);	
	
	// нижние, примыкающие к калетте, четырехугольные грани павильона E0 - E7
	
	// Создаем два вектора a0 и b0. Их векторное произведение определит нормальный вектор плоскости E0.
	var a0 = new Vector3D(pavil[16][0] - pavil[0][0], pavil[16][1] - pavil[0][1], pavil[16][2] - pavil[0][2]);
	var b0 = new Vector3D(girdle[8][0] - girdle[15][0], girdle[8][1] - girdle[15][1], 0);
	var vec_E0 = a0.Cross(b0); // вектор перпендикулярный к плоскости E0
	vec_E0.Normer();
	var E0 = new Plane3D(); 
	E0.CreatePlaneNormalVectorPoint(vec_E0, pavil[16]);
	
	// Создаем два вектора a1 и b1. Их векторное произведение определит нормальный вектор плоскости E1.
	var a1 = new Vector3D(pavil[16][0] - pavil[1][0], pavil[16][1] - pavil[1][1], pavil[16][2] - pavil[1][2]);
	var b1 = new Vector3D(girdle[9][0] - girdle[8][0], girdle[9][1] - girdle[8][1], 0);
	var vec_E1 = a1.Cross(b1); // вектор перпендикулярный к плоскости E1    
	vec_E1.Normer();
	var E1 = new Plane3D(); 
	E1.CreatePlaneNormalVectorPoint(vec_E1, pavil[16]);
	
	// Создаем два вектора a2 и b2. Их векторное произведение определит нормальный вектор плоскости E2.
	var a2 = new Vector3D(pavil[16][0] - pavil[2][0], pavil[16][1] - pavil[2][1], pavil[16][2] - pavil[2][2]);
	var b2 = new Vector3D(girdle[10][0] - girdle[9][0], girdle[10][1] - girdle[9][1], 0);;
	var vec_E2 = a2.Cross(b2); // вектор перпендикулярный к плоскости E2
	vec_E2.Normer();
	var E2 = new Plane3D(); 
	E2.CreatePlaneNormalVectorPoint(vec_E2, pavil[16]); 	
	
	// Создаем два вектора a3 и b3. Их векторное произведение определит нормальный вектор плоскости E3.
	var a3 = new Vector3D(pavil[16][0] - pavil[3][0], pavil[16][1] - pavil[3][1], pavil[16][2] - pavil[3][2]);
	var b3 = new Vector3D(girdle[11][0] - girdle[10][0], girdle[11][1] - girdle[10][1], 0);;
	var vec_E3 = a3.Cross(b3); // вектор перпендикулярный к плоскости E2
	vec_E3.Normer();
	var E3 = new Plane3D(); 
	E3.CreatePlaneNormalVectorPoint(vec_E3, pavil[16]);
	
	// Создаем два вектора a4 и b4. Их векторное произведение определит нормальный вектор плоскости E4.
	var a4 = new Vector3D(pavil[16][0] - pavil[4][0], pavil[16][1] - pavil[4][1], pavil[16][2] - pavil[4][2]);
	var b4 = new Vector3D(girdle[12][0] - girdle[11][0], girdle[12][1] - girdle[11][1], 0);;
	var vec_E4 = a4.Cross(b4); // вектор перпендикулярный к плоскости E2
	vec_E4.Normer();
	var E4 = new Plane3D(); 
	E4.CreatePlaneNormalVectorPoint(vec_E4, pavil[16]);	
	
	// Создаем два вектора a5 и b5. Их векторное произведение определит нормальный вектор плоскости E5.
	var a5 = new Vector3D(pavil[16][0] - pavil[5][0], pavil[16][1] - pavil[5][1], pavil[16][2] - pavil[5][2]);
	var b5 = new Vector3D(girdle[13][0] - girdle[12][0], girdle[13][1] - girdle[12][1], 0);;
	var vec_E5 = a5.Cross(b5); // вектор перпендикулярный к плоскости E2
	vec_E5.Normer();
	var E5 = new Plane3D(); 
	E5.CreatePlaneNormalVectorPoint(vec_E5, pavil[16]);	

	// Создаем два вектора a6 и b6. Их векторное произведение определит нормальный вектор плоскости E6.
	var a6 = new Vector3D(pavil[16][0] - pavil[6][0], pavil[16][1] - pavil[6][1], pavil[16][2] - pavil[6][2]);
	var b6 = new Vector3D(girdle[14][0] - girdle[13][0], girdle[14][1] - girdle[13][1], 0);;
	var vec_E6 = a6.Cross(b6); // вектор перпендикулярный к плоскости E2
	vec_E6.Normer();
	var E6 = new Plane3D(); 
	E6.CreatePlaneNormalVectorPoint(vec_E6, pavil[16]);		
	
	// Создаем два вектора a7 и b7. Их векторное произведение определит нормальный вектор плоскости E7.
	var a7 = new Vector3D(pavil[16][0] - pavil[7][0], pavil[16][1] - pavil[7][1], pavil[16][2] - pavil[7][2]);
	var b7 = new Vector3D(girdle[15][0] - girdle[14][0], girdle[15][1] - girdle[14][1], 0);;
	var vec_E7 = a7.Cross(b7); // вектор перпендикулярный к плоскости E2
	vec_E7.Normer();
	var E7 = new Plane3D(); 
	E7.CreatePlaneNormalVectorPoint(vec_E7, pavil[16]);		
	
    // Вершины 8, 9, 10, 11, 12, 13, 14, 15
	pavil[8]  = planes_up[0].IntersectionThreePlanes(E0, E1);
	pavil[9]  = planes_up[1].IntersectionThreePlanes(E1, E2);
	pavil[10] = planes_up[2].IntersectionThreePlanes(E2, E3);
	pavil[11] = planes_up[3].IntersectionThreePlanes(E3, E4);
	pavil[12] = planes_up[4].IntersectionThreePlanes(E4, E5);
	pavil[13] = planes_up[5].IntersectionThreePlanes(E5, E6);
	pavil[14] = planes_up[6].IntersectionThreePlanes(E6, E7);
	pavil[15] = planes_up[7].IntersectionThreePlanes(E7, E0);	
	
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