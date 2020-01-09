var DEGREE = 0.01745329251994; // значение одного углового градуса
var PERCENT = 0.01;
var SQRT2 = 1.41421356237309504880;
var M_PI = 3.14159265358979323846;
var M_PI_2 = 1.57079632679489661923;

// СДМ - структура данных модели
var lw = 1.0;      			// отношение длины огранки к ее ширине
// Рундист
var r = 0.14;       		// толщина рундиста
var waviness = 0.02;

// Корона
var hCrown = 0.193;
var H2H = 0.7;
var ang_1 = 35*DEGREE;
var ang_2 = 25*DEGREE;

// Павильон
var hp = 0.47;
var hPavFacet = 0.88;
var ang_a_h = 50*DEGREE;
var h1 = 0.12;
var h2 = 0.20;

var girdle = [];
var crown = [];
var pavil = [];	
var vertices = [];

// Расчет координат вершин огранки (модели).
function VerticesCalculation()
{
	var nCrown  = 16;
	var nGirdle = 64;
	var nPav    = 21;
	
    // Вспомогательные переменные и объекты
	var Z1 = new Vector3D(0,0,1);
	var Y1 = new Vector3D(0,1,0);
	var X1 = new Vector3D(1,0,0);

	var i;

	InitGirdle();
									
	var A1 = new Plane3D();
	A1.CreateInclinePlane(ang_1, girdle[60], girdle[4], girdle[4]);
	for (i = 0; i < 4; i++)
	{
		var line = new Line3D();
		line.CreateLineVectorPoint(Z1, girdle[i]);
		girdle[i] = line.IntersectionLinePlane(A1);
	}

	var B1 = new Plane3D();
	B1.CreateInclinePlane(ang_1, girdle[4], girdle[12], girdle[12]);
	for (i = 5; i < 12; i++)
	{
		var line = new Line3D();
		line.CreateLineVectorPoint(Z1, girdle[i]);
		girdle[i] = line.IntersectionLinePlane(B1);
	}	
	
	var C1 = new Plane3D();
	C1.CreateInclinePlane(ang_1, girdle[12], girdle[20], girdle[20]);
	for (i = 13; i < 20; i++)
	{
		var line = new Line3D();
		line.CreateLineVectorPoint(Z1, girdle[i]);
		girdle[i] = line.IntersectionLinePlane(C1);
	}

	for(i = 0; i < 16; i++)
	{
		girdle[32-i][2] = girdle[i][2];
	}

	for(i = 0; i < 32; i++)
	{
		girdle[63-i][2] = girdle[i+1][2];
	}

	// Создаем горизонтальную плоскость прооходящую через H2H
	var planeH2H = new Plane3D();
	var Table = new Plane3D();
	planeH2H.CreatePlaneNormalDistOXYZ(Z1, hCrown*H2H + r/2);	
	
	crown[8] = planeH2H.IntersectionThreePlanes(A1, B1);
	crown[9] = planeH2H.IntersectionThreePlanes(B1, C1);

	crown[10] = new Point3D();
	crown[10][0] = crown[9][0];
	crown[10][1] = - crown[9][1];
	crown[10][2] = crown[9][2];

	crown[11] = new Point3D();
	crown[11][0] = crown[8][0];
	crown[11][1] = - crown[8][1];
	crown[11][2] = crown[8][2];
	
	crown[12] = new Point3D();
	crown[12][0] = - crown[11][0];
	crown[12][1] = crown[11][1];
	crown[12][2] = crown[11][2];

	crown[13] = new Point3D();
	crown[13][0] = - crown[10][0];
	crown[13][1] = crown[10][1];
	crown[13][2] = crown[10][2];

	crown[14] = new Point3D();
	crown[14][0] = - crown[9][0];
	crown[14][1] = crown[9][1];
	crown[14][2] = crown[9][2];

	crown[15] = new Point3D();
	crown[15][0] = - crown[8][0];
	crown[15][1] = crown[8][1];
	crown[15][2] = crown[8][2];	
	
	// Верхние плоскости короны
	var A2 = new Plane3D();
	A2.CreateInclinePlane(ang_2, crown[15], crown[8], crown[8]);
	var B2 = new Plane3D();
	B2.CreateInclinePlane(ang_2, crown[8], crown[9], crown[9]);
	var C2 = new Plane3D();
	C2.CreateInclinePlane(ang_2, crown[9], crown[10], crown[10]);	
	
	var OYZ = new Plane3D();
	OYZ.CreatePlaneNormalVectorPoint(X1, new Point3D(0, 0, 0));
	
	var OXZ = new Plane3D();
	OXZ.CreatePlaneNormalVectorPoint(Y1, new Point3D(0, 0, 0));
	
	var pt = new Point3D(crown[8][0] + (crown[9][0] - crown[8][0])/2, 
						 crown[9][1] + (crown[8][1] - crown[9][1])/2, 0);
	var XY = new Plane3D();
	XY.CreatePlaneThreePoints(pt, girdle[8], girdle[8+64]);
	//  или так
	// XY.CreatePlaneThreePoints(new Point3D(0,0,0), new Point3D(0,0,1), girdle[8+64]);
	
	var Table = new Plane3D();
	Table.CreatePlaneNormalDistOXYZ(Z1, hCrown + r/2);
	
	crown[0] = Table.IntersectionThreePlanes(A2, OYZ);
	crown[1] = Table.IntersectionThreePlanes(B2, XY);
	crown[2] = Table.IntersectionThreePlanes(C2, OXZ);	


	
	crown[3] = new Point3D();
	crown[3][0] = crown[1][0];
	crown[3][1] = - crown[1][1];
	crown[3][2] = crown[1][2];

	crown[4] = new Point3D();
	crown[4][0] = crown[0][0];
	crown[4][1] = - crown[0][1];
	crown[4][2] = crown[0][2];

	crown[5] = new Point3D();
	crown[5][0] = - crown[3][0];
	crown[5][1] = crown[3][1];
	crown[5][2] = crown[3][2];

	crown[6] = new Point3D();
	crown[6][0] = - crown[2][0];
	crown[6][1] = crown[2][1];
	crown[6][2] = crown[2][2];

	crown[7] = new Point3D();
	crown[7][0] = - crown[1][0];
	crown[7][1] = crown[1][1];
	crown[7][2] = crown[1][2];
	
	// Конструируем павильон
	
	pavil[20] = new Point3D();
	pavil[20][0] = 0;
	pavil[20][1] = 0;
	pavil[20][2] = -r/2 - hp;
	
	var plane_a = new Plane3D();
	plane_a.CreateInclinePlane(-ang_a_h, girdle[64+60], girdle[64+4], girdle[64+4]);
	for (i = 0; i < 4; i++)
	{
		var line = new Line3D();
		line.CreateLineVectorPoint(Z1, girdle[i]);
		girdle[i+64] = line.IntersectionLinePlane(plane_a);
	}

	var plane_b = new Plane3D();
	plane_b.CreateInclinePlane(-ang_a_h, girdle[64+4], girdle[64+12], girdle[64+12]);
	for (i = 5; i < 12; i++)
	{
		var line = new Line3D();
		line.CreateLineVectorPoint(Z1, girdle[i]);
		girdle[i+64] = line.IntersectionLinePlane(plane_b);
	}	

	var plane_c = new Plane3D();
	plane_c.CreateInclinePlane(-ang_a_h, girdle[64+12], girdle[64+20], girdle[64+20]);
	for (i = 13; i < 20; i++)
	{
		var line = new Line3D();
		line.CreateLineVectorPoint(Z1, girdle[i]);
		girdle[i+64] = line.IntersectionLinePlane(plane_c);
	}	
	
	// Производим вычисление рундиста для остальных квадрантов
	for(i = 0; i < 16; i++)
	{
		girdle[96-i][0] = girdle[i+64][0];
		girdle[96-i][1] = -girdle[i+64][1];
		girdle[96-i][2] = girdle[i+64][2];
	}

	for(i = 1; i < 32; i++)
	{
		girdle[128-i][0] = -girdle[i+64][0];
		girdle[128-i][1] = girdle[i+64][1];
		girdle[128-i][2] = girdle[i+64][2];
	}
		
	var plane_h1 = new Plane3D();
	plane_h1.CreatePlaneNormalDistOXYZ(Z1, -h1 - r/2);	
	
	pavil[1] = plane_h1.IntersectionThreePlanes(plane_a, plane_b);
	pavil[3] = plane_h1.IntersectionThreePlanes(plane_b, plane_c);
	
	var plane_h2 = new Plane3D();
	plane_h2.CreatePlaneNormalDistOXYZ(Z1, -h2 - r/2);	
	pavil[2] = plane_h2.IntersectionThreePlanes(plane_b, XY);
	
	pavil[0] = plane_h2.IntersectionThreePlanes(plane_a, OYZ);
	pavil[4] = plane_h2.IntersectionThreePlanes(plane_c, OXZ);
	
	// Вычисляем векторное произведение vec_pav = a * b
	// Оно будет являться вектором нормали vec_pav к грани pav
	var a = new Vector3D(pavil[20][0] - pavil[2][0],
						 pavil[20][1] - pavil[2][1],
						 pavil[20][2] - pavil[2][2]);
	a.Normer();					 
	
	//var b = new Vector3D(lw, -1, 0);
	
	var b = new Vector3D(girdle[76][0] - girdle[68][0], girdle[76][1] - girdle[68][1], 0)
	b.Normer();
	
	var vec_pav = a.Cross(b);
	vec_pav.Normer();

	var pav = new Plane3D();
	pav.CreatePlaneNormalVectorPoint(vec_pav, pavil[20]);
	//   или так 
	// pav.CreatePlaneVectorTwoPoints(b, pavil[2], pavil[20]); 	
	//  Но обе точки должны принадлежать создаваемой плоскости
	// поэтому girdle[68] и girdle[76] аргументами взять нельзя  и следующий вариант неверен:
	//           pav.CreatePlaneVectorTwoPoints(a, girdle[68], girdle[76]);
	

	var plane_hPavFacet = new Plane3D();
	plane_hPavFacet.CreatePlaneNormalDistOXYZ(Z1, -hPavFacet * hp - r/2);	
	
	pavil[16] = plane_hPavFacet.IntersectionThreePlanes(pav, OYZ);
	pavil[17] = plane_hPavFacet.IntersectionThreePlanes(pav, OXZ);

	// Вершины павильона в других квадрантах
	pavil[5] = new Point3D();
	pavil[5][0] = pavil[3][0];
	pavil[5][1] = - pavil[3][1];
	pavil[5][2] = pavil[3][2];

	pavil[6] = new Point3D();
	pavil[6][0] = pavil[2][0];
	pavil[6][1] = - pavil[2][1];
	pavil[6][2] = pavil[2][2];

	pavil[7] = new Point3D();
	pavil[7][0] = pavil[1][0];
	pavil[7][1] = - pavil[1][1];
	pavil[7][2] = pavil[1][2];

	pavil[8] = new Point3D();
	pavil[8][0] = pavil[0][0];
	pavil[8][1] = - pavil[0][1];
	pavil[8][2] = pavil[0][2];

	pavil[9] = new Point3D();
	pavil[9][0] = - pavil[7][0];
	pavil[9][1] = pavil[7][1];
	pavil[9][2] = pavil[7][2];

	pavil[10] = new Point3D();
	pavil[10][0] = - pavil[6][0];
	pavil[10][1] = pavil[6][1];
	pavil[10][2] = pavil[6][2];

	pavil[11] = new Point3D();
	pavil[11][0] = - pavil[5][0];
	pavil[11][1] = pavil[5][1];
	pavil[11][2] = pavil[5][2];

	pavil[12] = new Point3D();
	pavil[12][0] = - pavil[4][0];
	pavil[12][1] = pavil[4][1];
	pavil[12][2] = pavil[4][2];

	pavil[13] = new Point3D();
	pavil[13][0] = - pavil[3][0];
	pavil[13][1] = pavil[3][1];
	pavil[13][2] = pavil[3][2];

	pavil[14] = new Point3D();
	pavil[14][0] = - pavil[2][0];
	pavil[14][1] = pavil[2][1];
	pavil[14][2] = pavil[2][2];

	pavil[15] = new Point3D();
	pavil[15][0] = - pavil[1][0];
	pavil[15][1] = pavil[1][1];
	pavil[15][2] = pavil[1][2];

	pavil[18] = new Point3D();
	pavil[18][0] = pavil[16][0];
	pavil[18][1] = - pavil[16][1];
	pavil[18][2] = pavil[16][2];

	pavil[19] = new Point3D();
	pavil[19][0] = - pavil[17][0];
	pavil[19][1] = pavil[17][1];
	pavil[19][2] = pavil[17][2];

	//  В массиве vertices хранятся координаты (x, y, z) 
	// всех вершин огранки подряд.
	for(i = 0; i < 16; i++)
	{
		vertices.push(crown[i][0]);
		vertices.push(crown[i][1]);
		vertices.push(crown[i][2]);
	}
	for(i = 0; i < 128; i++)
	{
		vertices.push(girdle[i][0]);
		vertices.push(girdle[i][1]);
		vertices.push(girdle[i][2]);
	}
	for(i = 0; i < 21; i++)
	{
		vertices.push(pavil[i][0]);
		vertices.push(pavil[i][1]);
		vertices.push(pavil[i][2]);
	}
}

function InitGirdle()
{
	var gd = [64];
	var i;
	var t = 0.0;
	var del = Math.PI / 4;
	var m = 0.125;
	var R = 0.5;
	var d = 3*(Math.PI/2)/4;
	// waviness задает волнистость

	for(i = 0; i < 64; i++)
	{
		t = i * del;
		gd[i] = new Point2D();
		gd[i][0] = (R + m*R)*Math.cos(m*t+d) - waviness*Math.cos(t + m*t+d);
		gd[i][1] = (R + m*R)*Math.sin(m*t+d) - waviness*Math.sin(t + m*t+d);
	}
	
	for(i = 0; i < 128; i++)
	{
		girdle[i] = new Point3D();
	}
	
	for(i = 0; i < 5; i++)
	{
		girdle[i][0] = gd[4-i][0];
		girdle[i][1] = gd[4-i][1];
	}

	for(i = 0; i < 64; i++)
	{
		girdle[i+5][0] = gd[63-i][0];
		girdle[i+5][1] = gd[63-i][1];
	}

	var k = girdle[0][1] / 0.5;
	
	for (i = 0; i < 64; i++)
	{
		girdle[i][2] = r/2;
		girdle[i][0] = lw * girdle[i][0] / k;
		girdle[i][1] = girdle[i][1] / k;

		girdle[i+64][0] = girdle[i][0];
		girdle[i+64][1] = girdle[i][1];
		girdle[i+64][2] = -r/2;
	}
}

function FillGirdle_WavyMultifacet()
{
	var N = 64;
	var p = 0.5;
	var e = waviness;
	var m = 8;

	var i;
	var del = 2 * M_PI / N;
	var fi = 0;

	for(i = 0; i < N; i++)
	{
		fi = 90*DEGREE - i*del;

		var x = ( p / ( 1 + e * Math.cos(m * fi) ) ) * Math.cos(fi);
		var y = ( p / ( 1 + e * Math.cos(m * fi) ) ) * Math.sin(fi);
		var point = new Point3D ( lw * x, y, r/2);
		girdle[i] = point;
	}

	for (i = 0; i < N; i++)
    {
		girdle[i + N] = new Point3D ( girdle[i][0], girdle[i][1], -r/2);
    }
}

// Все грани (полигоны) 3D модели огранки обходим против часовой стрелки
// если смотреть на модель находясь от нее снаружи.
var index_cut = 
[
        // площадка
		0,7,6,5,4,3,2,1,0,

		// star facet
		0,1,8,0,
		1,2,9,1,
		2,3,10,2,
		3,4,11,3,
		4,5,12,4,
		5,6,13,5,
		6,7,14,6,
		7,0,15,7,

		0, 8, 15, 0,
		1, 9, 8, 1,
		2, 10, 9, 2,
		3, 11, 10, 3,
		4, 12, 11, 4,
		5, 13, 12, 5,
		6, 14, 13, 6,
		7, 15, 14, 7,

		//

		8, 20, 19, 18, 17, 16, 79, 78, 77, 76, 15, 8,
		9, 28, 27, 26, 25, 24, 23, 22, 21, 20, 8, 9,
		10, 36, 35, 34, 33, 32, 31, 30, 29, 28, 9, 10,
		11, 44, 43, 42, 41, 40, 39, 38, 37, 36, 10, 11,
		12, 52, 51, 50, 49, 48, 47, 46, 45, 44, 11, 12,
		13, 60, 59, 58, 57, 56, 55, 54, 53, 52, 12, 13,
		14, 68, 67, 66, 65, 64, 63, 62, 61, 60, 13, 14,
		15, 76, 75, 74, 73, 72, 71, 70, 69, 68, 14, 15,

		// рундист
		16,17,81,80,16,
		17,18,82,81,17,
		18,19,83,82,18,
		19,20,84,83,19,
		20,21,85,84,20,
		21,22,86,85,21,
		22,23,87,86,22,
		23,24,88,87,23,
		24,25,89,88,24,
		25,26,90,89,25,
		26,27,91,90,26,
		27,28,92,91,27,
		28,29,93,92,28,
		29,30,94,93,29,
		30,31,95,94,30,
		31,32,96,95,31,
		32,33,97,96,32,
		33,34,98,97,33,
		34,35,99,98,34,
		35,36,100,99,35,
		36,37,101,100,36,
		37,38,102,101,37,
		38,39,103,102,38,
		39,40,104,103,39,
		40,41,105,104,40,
		41,42,106,105,41,
		42,43,107,106,42,
		43,44,108,107,43,
		44,45,109,108,44,
		45,46,110,109,45,
		46,47,111,110,46,
		47,48,112,111,47,
		48,49,113,112,48,
		49,50,114,113,49,
		50,51,115,114,50,
		51,52,116,115,51,
		52,53,117,116,52,
		53,54,118,117,53,
		54,55,119,118,54,
		55,56,120,119,55,
		56,57,121,120,56,
		57,58,122,121,57,
		58,59,123,122,58,
		59,60,124,123,59,
		60,61,125,124,60,
		61,62,126,125,61,
		62,63,127,126,62,
		63,64,128,127,63,
		64,65,129,128,64,
		65,66,130,129,65,
		66,67,131,130,66,
		67,68,132,131,67,
		68,69,133,132,68,
		69,70,134,133,69,
		70,71,135,134,70,
		71,72,136,135,71,
		72,73,137,136,72,
		73,74,138,137,73,
		74,75,139,138,74,
		75,76,140,139,75,
		76,77,141,140,76,
		77,78,142,141,77,
		78,79,143,142,78,
		79,16,80,143,79,

		// павильон
		144,159,140,141,142,143,80,81,82,83,84,145,144,
		146, 145, 84, 85, 86, 87, 88, 89, 90, 91, 92, 147, 146,
		148, 147, 92, 93, 94, 95, 96, 97, 98, 99, 100, 149, 148,
		150, 149, 100, 101, 102, 103, 104, 105, 106, 107, 108, 151, 150,
		152, 151, 108, 109, 110, 111, 112, 113, 114, 115, 116, 153, 152,
		154, 153, 116, 117, 118, 119, 120, 121, 122, 123, 124, 155, 154,
		156, 155, 124, 125, 126, 127, 128, 129, 130, 131, 132, 157, 156,
		158, 157, 132, 133, 134, 135, 136, 137, 138, 139, 140, 159, 158,

		160, 144, 145, 160,
		160, 145, 146, 160,

		161, 146, 147, 161,
		161, 147, 148, 161,
		161, 148, 149, 161,
		161, 149, 150, 161,

		162, 150, 151, 162,
		162, 151, 152, 162,
		162, 152, 153, 162,
		162, 153, 154, 162,

		163, 154, 155, 163,
		163, 155, 156, 163,
		163, 156, 157, 163,
		163, 157, 158, 163,

		160, 158, 159, 160,
		160, 159, 144, 160,

		164, 160, 146, 161, 164,
		164, 161, 150, 162, 164,
		164, 162, 154, 163, 164,
		164, 163, 158, 160, 164,
	
	// Признак того, что граней больше нет
	-100    	
];
	
function facet_colors()
{
	var i = 0;
	var ind = 0;
	// Table
	colors[ind] = new THREE.Color("rgb(100, 100, 130)"); ind++;
	
	// Crown
	for (i = 0; i < 8; i++)
	{
		colors[ind] = new THREE.Color("rgb(150, 160, 220)"); ind++;
	}	
	
	for (i = 0; i < 8; i++)
	{
		
		colors[ind] = new THREE.Color("rgb(180, 170, 250)"); ind++;
	}	
	
	for (i = 0; i < 4; i++)
	{
		colors[ind] = new THREE.Color("rgb(160, 200, 250)"); ind++;
		colors[ind] = new THREE.Color("rgb(140, 170, 240)"); ind++;
	}
	
	//  Girdle
	for (i = 0; i < 32; i++)
	{
		colors[ind] = new THREE.Color("rgb(110, 110, 110)"); ind++;
		colors[ind] = new THREE.Color("rgb(150, 150, 150)"); ind++;
	}
	
	// Pavilion
	for (i = 0; i < 4; i++)
	{
		colors[ind] = new THREE.Color("rgb(160, 200, 250)"); ind++;
		colors[ind] = new THREE.Color("rgb(140, 170, 240)"); ind++;
	}
	
	for (i = 0; i < 8; i++)
	{
		colors[ind] = new THREE.Color("rgb(180, 150, 200)"); ind++;
		colors[ind] = new THREE.Color("rgb(170, 130, 200)"); ind++;	
	}
	
	colors[ind] = new THREE.Color("rgb(100, 130, 250)"); ind++;
	colors[ind] = new THREE.Color("rgb(100, 140, 250)"); ind++;
	colors[ind] = new THREE.Color("rgb(100, 120, 250)"); ind++;
	colors[ind] = new THREE.Color("rgb(100, 150, 250)");

};


