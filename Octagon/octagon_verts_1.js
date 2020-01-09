
var DEGREE = 0.01745329251994; // значение одного углового градуса

// СДМ - структура данных модели

// Рундист
var lw = 1.0;      // отношение длина/ширина
var r = 0.02;       // высота рундиста
var corner_break_ratio = 0.55;
var corner_break_angle = 45*DEGREE;

// Корона
var hCrown = 0.16;	// Высота верхней части короны
var t = 0.3;		// размер площадки
var angle_B0 = 45*DEGREE;	// верхний угол короны (для передней и боковой грани) B0 - angle_B0
var angle_B1 = 35*DEGREE;	// верхний угол короны (для угловой грани) // B7 - angle_B1
var angle_A0 = 53*DEGREE;    // нижний угол короны (одинаковый для всех граней)
var H2H = 0.5;	// Отношение высоты нижней части короны ко всей ее высоте

// Павильон
var hp = 0.62;		// Высота павильона
var angle_C0 = 65*DEGREE;	// Угол наклона грани A
var angle_C1 = 65*DEGREE;	// Угол наклона грани B
var angle_C2 = 65*DEGREE;	// Угол наклона грани C
var hLowerFacet = 0.5;	// Отношение высоты LowerFacet к hp
var hMiddleFacet = 0.2;	// Отношение высоты MiddleFacet к hp

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
	
	// Рассчитываем горизонтальную плоскость plane_CrownHor лежащую на высоте hCrown*H2H + r/2
	var plane_CrownHor = new Plane3D();
	plane_CrownHor.CreatePlaneNormalDistOXYZ(Z1, hCrown*H2H + r/2);
	
	// angle_A0 - нижний угол короны
	
	
	var A0 = new Plane3D(); 
	A0.CreateInclinePlane(angle_A0, girdle[7], girdle[0], girdle[7]);
	// Закоментированные варианты также позволяют получить правильное построение короны.
//	A0.CreateInclinePlane(-angle_A0, girdle[0], girdle[7], girdle[7]);
//	var A0 = Facet(angle_A0, girdle[7], girdle[0], girdle[7]);
//	var A0 = Facet(-angle_A0, girdle[0], girdle[7], girdle[7]);
	
	var A1 = new Plane3D(); 
	A1.CreateInclinePlane(angle_A0, girdle[0], girdle[1], girdle[0]);
	
	var A2 = new Plane3D(); 
	A2.CreateInclinePlane(angle_A0, girdle[1], girdle[2], girdle[1]);	
	
	var A3 = new Plane3D();  
	A3.CreateInclinePlane(angle_A0, girdle[2], girdle[3], girdle[2]);	

	var A4 = new Plane3D();  
	A4.CreateInclinePlane(angle_A0, girdle[3], girdle[4], girdle[3]);	

	var A5 = new Plane3D();  
	A5.CreateInclinePlane(angle_A0, girdle[4], girdle[5], girdle[4]);

	var A6 = new Plane3D();  
	A6.CreateInclinePlane(angle_A0, girdle[5], girdle[6], girdle[5]);

	var A7 = new Plane3D();  
	A7.CreateInclinePlane(angle_A0, girdle[6], girdle[7], girdle[6]);	
	
	crown[8]  = plane_CrownHor.IntersectionThreePlanes(A0, A1);
	crown[9]  = plane_CrownHor.IntersectionThreePlanes(A1, A2);	
	crown[10] = plane_CrownHor.IntersectionThreePlanes(A2, A3);	
	crown[11] = plane_CrownHor.IntersectionThreePlanes(A3, A4);	
	crown[12] = plane_CrownHor.IntersectionThreePlanes(A4, A5);	
	crown[13] = plane_CrownHor.IntersectionThreePlanes(A5, A6);	
	crown[14] = plane_CrownHor.IntersectionThreePlanes(A6, A7);	
	crown[15] = plane_CrownHor.IntersectionThreePlanes(A7, A0);	
	
	// Рассчитываем горизонтальную плоскость plane_Table лежащую на уровне площадки (table)
	var ht = hCrown + r/2;
	var plane_Table = new Plane3D();
	plane_Table.CreatePlaneNormalDistOXYZ(Z1, ht);

	// Рассчитываем три наклонные к горизонтали плоскости B0, B1, B2
	// angle_B0 - верхний угол короны
	// angle_B1 - верхний угловой угол короны
	var B0 = new Plane3D();  // 1  A1
	B0.CreateInclinePlane(angle_B0, crown[15], crown[8], crown[15]);	
	
	var B7 = new Plane3D(); // Наклон грани B7 равен наклону грани B1 
	                        //  (а также наклонам граней B3 и B5)
	B7.CreateInclinePlane(angle_B1, crown[8], crown[9], crown[8]);
	
	var B6 = new Plane3D();
	B6.CreateInclinePlane(angle_B0, crown[9], crown[10], crown[9]);
	
	var B0 = new Plane3D();
	B0.CreateInclinePlane(angle_B0, crown[15], crown[8], crown[15]);	
	
	var B1 = new Plane3D();
	B1.CreateInclinePlane(angle_B1, crown[8], crown[9], crown[8]);
	
	var B2 = new Plane3D();
	B2.CreateInclinePlane(angle_B0, crown[9], crown[10], crown[9]);
	
	
	// Рассчитываем вертикальную плоскость OYZ  ( плоскость OYZ )
	var OYZ = new Plane3D();
	OYZ.CreatePlaneThreePoints(new Point3D(0,0,0), new Point3D(0,0,1), new Point3D(0,1,0));

	// Рассчитываем вертикальную плоскость OXZ ( плоскость OXZ)
	var OXZ = new Plane3D();
	OXZ.CreatePlaneThreePoints(new Point3D(0,0,0), new Point3D(0,0,1), new Point3D(1,0,0));	
	
	// Создаем две 2D прямые являющиеся проекциями прямых gd0 - cr8 и gd1 - cr9 на плоскость OXY.
	var ln1 = new Line2D(new Point2D(girdle[0][0], girdle[0][1]), new Point2D(crown[8][0], crown[8][1]));
	var ln2 = new Line2D(new Point2D(girdle[1][0], girdle[1][1]), new Point2D(crown[9][0], crown[9][1]));
	
	// Определяем точку пересечения двумерных прямых.
	var pt_cross = ln1.IntersectionTwoLines(ln2);
	
	//   Создаем вертикальную плоскость проходящую через pt_cross и точку переечения прямых gd0 - gd7 и gd1 - gd2.
	var XY = new Plane3D();
	XY.CreatePlaneThreePoints(new Point3D(pt_cross[0], pt_cross[1], 0),  
									   new Point3D(pt_cross[0], pt_cross[1], 1), 
									   new Point3D(0.5 * lw, 0.5, 0));
	// crown[0], crown[1] и crown[2] определяются как точки пересечения трех соответствующих плоскостей							   
	crown[0] = plane_Table.IntersectionThreePlanes(OYZ, B0);
	crown[1] = plane_Table.IntersectionThreePlanes(XY, B1); // угловая вершина площадки короны
	crown[2] = plane_Table.IntersectionThreePlanes(OXZ, B2);
	// исходя из учета симметрии огранки находим координаты остальных вершин короны
	crown[3] = new Point3D(crown[1][0], -crown[1][1], crown[1][2]);
	crown[4] = new Point3D(crown[0][0], -crown[0][1], crown[0][2]);
	crown[5] = new Point3D(-crown[3][0], crown[3][1], crown[3][2]);
	crown[6] = new Point3D(-crown[2][0], crown[2][1], crown[2][2]);
	crown[7] = new Point3D(-crown[1][0], crown[1][1], crown[1][2]);
	
	// Pavilion
	// Глубина павильона равна -r/2 - hp
	pavil[16] = new Point3D(0, 0, -r/2 - hp);
	
	// Рассчитываем три наклонные к горизонтали плоскости C0, C2 и C1
	// angle_C0, angle_C1 и angle_C2 - углы накдона граней павильона примыкающих к рундисту
	var C0 = new Plane3D();  
	C0.CreateInclinePlane(-angle_C0, girdle[15], girdle[8], girdle[8]);
	var C1 = new Plane3D();  
	C1.CreateInclinePlane(-angle_C1, girdle[8], girdle[9], girdle[9]);
	var C2 = new Plane3D();
	C2.CreateInclinePlane(-angle_C2, girdle[9], girdle[10], girdle[10]);
	
	// на глубине -r/2 - hp * hMiddleFacet лежат вершины 0, 1, 2, 3, 4, 5, 6 павильона
	// горизонтальная плоскость на уровне вершин 0, 1, 2, 3, 4, 5, 6 павильона
	var plane_MiddleFacet = new Plane3D();
	plane_MiddleFacet.CreatePlaneNormalDistOXYZ(Z1, -r/2 - hp * hMiddleFacet); 
	
	pavil[0] = plane_MiddleFacet.IntersectionThreePlanes(C0, OYZ);
	pavil[1] = plane_MiddleFacet.IntersectionThreePlanes(C1, XY);
	pavil[2] = plane_MiddleFacet.IntersectionThreePlanes(C2, OXZ);
	
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

	// горизонтальная плоскость на уровне вершин 8, 9, 10, 11, 12, 13, 14, 15 павильона
	var plane_LowFacet = new Plane3D();
	plane_LowFacet.CreatePlaneNormalDistOXYZ(Z1, - r/2 - hp * hLowerFacet);
	
	// Находим pav.8 как точку пересечения трех плоскостей.
	pavil[8] = plane_LowFacet.IntersectionThreePlanes(E0, E1);

	// Находим pav.9 как точку пересечения трех плоскостей.
	pavil[9] = plane_LowFacet.IntersectionThreePlanes(E2, E1);

	// исходя из учета симметрии огранки
	pavil[4] =  new Point3D(  pavil[0][0],  - pavil[0][1],  pavil[0][2]);
	pavil[6] =  new Point3D(- pavil[2][0],    pavil[2][1],  pavil[2][2]);
	pavil[3] =  new Point3D(  pavil[1][0],  - pavil[1][1],  pavil[1][2]);
	pavil[5] =  new Point3D(- pavil[3][0],    pavil[3][1],  pavil[3][2]);
	pavil[7] =  new Point3D(- pavil[1][0],    pavil[1][1],  pavil[1][2]);
	pavil[15] = new Point3D(- pavil[8][0],    pavil[8][1],  pavil[8][2]);
	pavil[10] = new Point3D(  pavil[9][0],  - pavil[9][1],  pavil[9][2]);
	pavil[11] = new Point3D(  pavil[8][0],  - pavil[8][1],  pavil[8][2]);
	pavil[12] = new Point3D(  pavil[15][0], - pavil[15][1], pavil[15][2]);
	pavil[13] = new Point3D(- pavil[10][0],   pavil[10][1], pavil[10][2]);
	pavil[14] = new Point3D(- pavil[9][0],    pavil[9][1],  pavil[9][2]);

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
	var d1 = 0.5 * lw;
	var d2 = 0.5;
	var dy = corner_break_ratio/2;
	var dx = dy * Math.tan(corner_break_angle);

	girdle[0] =  new Point3D(   d1 - dx,   d2,      r/2);
	girdle[1] =  new Point3D(   d1,        d2 - dy, r/2);
	girdle[2] =  new Point3D(   d1,      - d2 + dy, r/2);
	girdle[3] =  new Point3D(   d1 - dx, - d2,      r/2);
	girdle[4] =  new Point3D( - d1 + dx, - d2,      r/2);
	girdle[5] =  new Point3D( - d1,      - d2 + dy, r/2);
	girdle[6] =  new Point3D( - d1,        d2 - dy, r/2);
	girdle[7] =  new Point3D( - d1 + dx,   d2,      r/2);

	girdle[8] =  new Point3D(   d1 - dx,   d2,      - r/2);
	girdle[9] =  new Point3D(   d1,        d2 - dy, - r/2);
	girdle[10] = new Point3D(   d1,      - d2 + dy, - r/2);
	girdle[11] = new Point3D(   d1 - dx, - d2,      - r/2);
	girdle[12] = new Point3D( - d1 + dx, - d2,      - r/2);
	girdle[13] = new Point3D( - d1,      - d2 + dy, - r/2);
	girdle[14] = new Point3D( - d1,        d2 - dy, - r/2);
	girdle[15] = new Point3D( - d1 + dx,   d2,      - r/2);
}

// Все грани (полигоны) 3D модели огранки обходим против часовой стрелки
// если смотреть на модель находясь от нее снаружи.
var index_cut = [
        // площадка (table)
		0,7,6,5,4,3,2,1,0,

		// корона (crown)
		0,8,15,0,
		2,10,9,2,
		4,12,11,4,
		6,14,13,6,

		1,9,8,1,
		3,11,10,3,
		5,13,12,5,
		7,15,14,7,

		0,1,8,0,
		2,9,1,2,
		2,3,10,2,
		4,11,3,4,
		4,5,12,4,
		6,13,5,6,
		6,7,14,6,
		0,15,7,0,

		8,16,23,15,8,
		9,10,18,17,9,
		11,12,20,19,11,
		14,22,21,13,14,

		8,9,17,16,8,
		10,11,19,18,10,
		12,13,21,20,12,
		15,23,22,14,15,

		// рундист (girdle)
		16, 24, 31, 23, 16,
		17, 25, 24, 16, 17,
		18, 26, 25, 17, 18,
		19, 27, 26, 18, 19,
		20, 28, 27, 19, 20,
		21, 29, 28, 20, 21,
		22, 30, 29, 21, 22,
		23, 31, 30, 22, 23,

		// павильон (pavilion)
		32, 31, 24, 32,
		33, 24, 25, 33,
		34, 25, 26, 34,
		35, 26, 27, 35,
		36, 27, 28, 36,
		37, 28, 29, 37,
		38, 29, 30, 38,
		39, 30, 31, 39,

		48, 47, 32, 40, 48,
		48, 40, 33, 41, 48,
		48, 41, 34, 42, 48,
		48, 42, 35, 43, 48,
		48, 43, 36, 44, 48,
		48, 44, 37, 45, 48,
		48, 45, 38, 46, 48,
		48, 46, 39, 47, 48,

		40, 32, 24, 40,
		40, 24, 33, 40,
		41, 33, 25, 41,
		41, 25, 34, 41,

		42, 34, 26, 42,
		42, 26, 35, 42,
		43, 35, 27, 43,
		43, 27, 36, 43,

		44, 36, 28, 44,
		44, 28, 37, 44,
		45, 37, 29, 45,
		45, 29, 38, 45,

		46, 38, 30, 46,
		46, 30, 39, 46,
		47, 39, 31, 47,
		47, 31, 32, 47,

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
		colors[ind] = new THREE.Color("rgb(120, 180, 250)"); ind++;
		colors[ind] = new THREE.Color("rgb(120, 180, 250)"); ind++;
		colors[ind] = new THREE.Color("rgb(120, 150, 250)"); ind++;
	}	
};