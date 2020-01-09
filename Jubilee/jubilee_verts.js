var DEGREE = 0.01745329251994; // значение одного углового градуса
var PERCENT = 0.01;
var SQRT2 = 1.41421356237309504880

// СДМ - структура данных модели
var lw = 1.0;      			// отношение длины огранки к ее ширине
// Рундист
var r = 0.06;       		// толщина рундиста
var square_deviation = 0.0001; // квадратичность рундиста
// Корона
var hCrown = 0.28;
var t = 0.05;				// размер площадки
var crown_middle_diameter = 0.77;
var hCrownMid = 0.16;
var hCrownDown = 0.085;
// Павильон
var hp = 0.46;
var ang_pav = 52*DEGREE;
var DownCleanLevel = 0.1;
var hPavFacet1 = 0.75;
var hPavFacet2 = 0.60;

var girdle = [128];
var table = [16];
var crown = [];
var pavil = [];	
var vertices = [];
var temp = [8];

// Расчет координат вершин огранки (модели).
function VerticesCalculation()
{
	// Также как в бриллианте
	InitGirdle(64);
	
	var nCrown  = 32;
	var nGirdle = 64;
	var nPav    = 49;
	
    // Вспомогательные переменные и объекты
	var Z1 = new Vector3D(0,0,1);	// Единичный вертикально расположенный ветор.
	
	var norm2d = new Vector2D;
	var normPlaneVector = new Vector3D();
	var i, j;
	
	// Конструируем корону
	
	// Плоскость на которой расположена площадка
	var planeTable = new Plane3D();
	planeTable.CreatePlaneNormalDistOXYZ(Z1, hCrown + r/2);	
	
	// этот угол можно услоно назвать углом наклона короны
	// (напоминаем, что 0.5 это ширина огранки в условных единицах)
	var tan_beta = hCrown / (0.5 - t/2); 

	// Виртуальная точка upPoint необходима для определения 
	// вершин короны лежащих на площадке
	var upPoint = new Point3D(0.0, 0.0, r/2 + 0.5 * tan_beta);
	
	// Сначала проводим прямые через upPoint и соответствующие вершины рундиста.
	// Затем находим пересечение этих прямых с плоскостью площадки.
	for (i = 0; i < 8; i++)
	{
		var line = new Line3D(girdle[i*8], upPoint);
		crown[i] = line.IntersectionLinePlane(planeTable);
	}
	//  Координаты на плоскости OXY средних (middle) по высоте 
	// вершин короны 16, 17, 18, .... 23 расположены на эллипсе.
	// Поэтому создаем (супер)эллипс на котором будут находиться 8 вершин короны.
	// Эллипс располагается на высоте задаваемой параметром hCrownMid.
	// Размер эллипса задается параметром crown_middle_diameter.
	// Функция FillEllipse подобна функции расчитывающей линию рундиста.
	FillEllipse(0.5 * crown_middle_diameter);	
	
	// Средние по высоте вершины короны расположились на (супер)эллипсе. 
	for (i = 0; i < 8; i++)
	{
		crown[16+i] = new Point3D(temp[i][0], temp[i][1], r/2 + hCrownMid);
	}
	// Нижние грани короны - рядом с рундистом - A0, A1, .... A7
	// Определяем векторы vec0 - vec7 задающие азимуты граней A0 - A7
	var vec0 = new Vector3D(girdle[0][0] - girdle[8][0],   girdle[0][1] - girdle[8][1], 0.0);
	var vec1 = new Vector3D(girdle[8][0] - girdle[16][0],  girdle[8][1] - girdle[16][1], 0.0);
	var vec2 = new Vector3D(girdle[16][0] - girdle[24][0], girdle[16][1] - girdle[24][1], 0.0);
	var vec3 = new Vector3D(girdle[24][0] - girdle[32][0], girdle[24][1] - girdle[32][1], 0.0);
	var vec4 = new Vector3D(girdle[32][0] - girdle[40][0], girdle[32][1] - girdle[40][1], 0.0);
	var vec5 = new Vector3D(girdle[40][0] - girdle[48][0], girdle[40][1] - girdle[48][1], 0.0);
	var vec6 = new Vector3D(girdle[48][0] - girdle[56][0], girdle[48][1] - girdle[56][1], 0.0);
	var vec7 = new Vector3D(girdle[56][0] - girdle[64][0], girdle[56][1] - girdle[64][1], 0.0);
	
	// грани A0 - A7 расчитываем по векторам vec0 - vec7 и соответствущим парам точек
	var A0 = new Plane3D();   
	A0.CreatePlaneVectorTwoPoints(vec0, crown[16], girdle[4]);
	var A1 = new Plane3D();   
	A1.CreatePlaneVectorTwoPoints(vec1, crown[17], girdle[12]);
	var A2 = new Plane3D();   
	A2.CreatePlaneVectorTwoPoints(vec2, crown[18], girdle[20]);
	var A3 = new Plane3D();   
	A3.CreatePlaneVectorTwoPoints(vec3, crown[19], girdle[28]);
	var A4 = new Plane3D();   
	A4.CreatePlaneVectorTwoPoints(vec4, crown[20], girdle[36]);	
	var A5 = new Plane3D();   
	A5.CreatePlaneVectorTwoPoints(vec5, crown[21], girdle[44]);
	var A6 = new Plane3D();   
	A6.CreatePlaneVectorTwoPoints(vec6, crown[22], girdle[52]);
	var A7 = new Plane3D();   
	A7.CreatePlaneVectorTwoPoints(vec7, crown[23], girdle[60]);
	
	// Пятиугольные C0, C1, C2, C3, C4, C5, C6, C7;
	var C0 = new Plane3D();
	C0.CreatePlaneThreePoints(crown[0], crown[1], crown[16]);
	var C1 = new Plane3D();
	C1.CreatePlaneThreePoints(crown[1], crown[2], crown[17]);
	var C2 = new Plane3D();
	C2.CreatePlaneThreePoints(crown[2], crown[3], crown[18]);
	var C3 = new Plane3D();
	C3.CreatePlaneThreePoints(crown[3], crown[4], crown[19]);
	var C4 = new Plane3D();
	C4.CreatePlaneThreePoints(crown[4], crown[5], crown[20]);
	var C5 = new Plane3D();
	C5.CreatePlaneThreePoints(crown[5], crown[6], crown[21]);
	var C6 = new Plane3D();
	C6.CreatePlaneThreePoints(crown[6], crown[7], crown[22]);
	var C7 = new Plane3D();
	C7.CreatePlaneThreePoints(crown[7], crown[0], crown[23]);

	// Плоскость определяющая высоту треугольных граней примыкающих к рундисту
	var pl_crown_down = new Plane3D;
	pl_crown_down.CreatePlaneNormalDistOXYZ(Z1, hCrownDown + r/2);
	
	// вершины короны 24, 25, ... 31 находим как точки пересечения трех плоскостей
	crown[24] = pl_crown_down.IntersectionThreePlanes(A7, A0);
	crown[25] = pl_crown_down.IntersectionThreePlanes(A0, A1);
	crown[26] = pl_crown_down.IntersectionThreePlanes(A1, A2);
	crown[27] = pl_crown_down.IntersectionThreePlanes(A2, A3);
	crown[28] = pl_crown_down.IntersectionThreePlanes(A3, A4);
	crown[29] = pl_crown_down.IntersectionThreePlanes(A4, A5);
	crown[30] = pl_crown_down.IntersectionThreePlanes(A5, A6);
	crown[31] = pl_crown_down.IntersectionThreePlanes(A6, A7);
	
	// Четырехугольные средние грани короны B0, B1, B2;
	var B0 = new Plane3D();
	B0.CreatePlaneThreePoints(crown[23], crown[16], crown[24]);
	var B1 = new Plane3D();
	B1.CreatePlaneThreePoints(crown[16], crown[17], crown[25]);
	var B2 = new Plane3D();
	B2.CreatePlaneThreePoints(crown[17], crown[18], crown[26]);
	
	// Вершины верхнего яруса короны (чуть ниже площадки)
	crown[8] = B0.IntersectionThreePlanes(C7, C0);
	crown[9] = B1.IntersectionThreePlanes(C0, C1);
	crown[10] = B2.IntersectionThreePlanes(C1, C2);
	
	// Исходя из симметрии огранки
	crown[11] = new Point3D( crown[9][0],  -crown[9][1],  crown[9][2]);
	crown[12] = new Point3D( crown[8][0],  -crown[8][1],  crown[8][2]);
	crown[13] = new Point3D(-crown[11][0],  crown[11][1], crown[11][2]);
	crown[14] = new Point3D(-crown[10][0],  crown[10][1], crown[10][2]);
	crown[15] = new Point3D(-crown[9][0],   crown[9][1],  crown[9][2]);
	
	// Корректировка положения вершин рундиста по оси Z
	corr_gd_crown(0, 4, 24);
	corr_gd_crown(4, 8, 25);
	corr_gd_crown(8, 12, 25);
	corr_gd_crown(12, 16, 26);
	
	corr_gd_crown(16, 20, 26);
	corr_gd_crown(20, 24, 27);
	corr_gd_crown(24, 28, 27);
	corr_gd_crown(28, 32, 28);	
	
	corr_gd_crown(32, 36, 28);
	corr_gd_crown(36, 40, 29);
	corr_gd_crown(40, 44, 29);
	corr_gd_crown(44, 48, 30);

	corr_gd_crown(48, 52, 30);
	corr_gd_crown(52, 56, 31);
	corr_gd_crown(56, 60, 31);
	corr_gd_crown(60, 0, 24);

	//            Конструируем павильон
	
	var kollet = new Point3D(0, 0, - hp - r/2);	
	
	// Находим вершину где сходятся все грани D0, D1, .... D7
	var dnPoint = new Point3D(0.0, 0.0, - 0.5 * Math.tan(ang_pav) - r/2);
	
	// Точки пересечения основных граней павильона между собой на уровне рундиста
	// (как у стандартного бриллианта)
	var line = [8]; // касательные к 8 точкам на рундисте то есть касательные
					//  в вершинах рундиста 68, 76, 84, 92, 100, 108, 116, 124
	var j = 3;
	var k = 5;
	for ( i = 0; i < 8; i++ )
    {
		var dir = new Vector2D(girdle[j][0] - girdle[k][0], girdle[j][1] - girdle[k][1]);
		dir.Normer();

		var pt = new Point2D(girdle[4+i*8][0], girdle[4+i*8][1]);
		var ln = new Line2D(); 
		ln.CreateLineVectorPoint(dir, pt);
		line[i] = ln;
		j = j + 8;
		k = k + 8;
    }	

	var u = [8]; // точки пересечения предыдущих касательных между собой
	u[1] = line[0].IntersectionTwoLines(line[1]);
	u[2] = line[1].IntersectionTwoLines(line[2]);
	u[3] = line[2].IntersectionTwoLines(line[3]);
	u[4] = line[3].IntersectionTwoLines(line[4]);
	u[5] = line[4].IntersectionTwoLines(line[5]);
	u[6] = line[5].IntersectionTwoLines(line[6]);
	u[7] = line[6].IntersectionTwoLines(line[7]);
	u[0] = line[7].IntersectionTwoLines(line[0]);

	//  Расчет виртуальных вершин, которых в натуре нет.
	// Эти виртуальные вершины используются для создания плоскостей,
	//   в которых лежит большинство граней павильона.
	//  Построение (до некоторой степени) подобно построению, 
	//    фасет павильона бриллианта
	//   Внимание ! При изменени параметров, если hPavFacet2 = hPavFacet1 
	// происходит неправильное построение павильона так как координаты части 
	// вершин павильона совпадает со значением координат некоторых других его вершин.
	// Иными словами часть вершин сливается в единые вершины !
	var v = [16]; // шестнадцать виртуальных вершин

    for (i = 0; i < 8; i++)
    {
		//   Сравнить с вектором dir при построении павильона бриллианта !!!
		// Предполагаем, что все трехмерные точки двумерные координаты которых лежат в массиве u,
		// имеют глубину равную  -r/2. Поэтому векторы имеют следующий вид:
		var dir = new Vector3D(dnPoint[0] - u[i][0], dnPoint[1] - u[i][1], dnPoint[2] - (-r/2));
		// dir.Normer(); // нормировка вектора dir все испортит !!!
										 
		v[i] = new Point3D(dnPoint[0] - hPavFacet1 * dir[0], // вершины расположенные
						dnPoint[1] - hPavFacet1 * dir[1], //      ближе к рундисту
						dnPoint[2] - hPavFacet1 * dir[2]);
						
		v[8+i] = new Point3D(dnPoint[0] - hPavFacet2 * dir[0], // вершины расположенные 
							dnPoint[1] - hPavFacet2 * dir[1],  //   ближе к калетте
							dnPoint[2] - hPavFacet2 * dir[2]);
	}
	// Плоскости в которых лежат грани расположенные рядом с калетой
	// F0, F1, F2, F3, F4, F5, F6, F7;
	var F0 = new Plane3D();
	F0.CreatePlaneThreePoints(kollet, v[8], v[9]);
	var F1 = new Plane3D();
	F1.CreatePlaneThreePoints(kollet, v[9], v[10]);
	var F2 = new Plane3D();
	F2.CreatePlaneThreePoints(kollet, v[10], v[11]);
	var F3 = new Plane3D();
	F3.CreatePlaneThreePoints(kollet, v[11], v[12]);
	var F4 = new Plane3D();
	F4.CreatePlaneThreePoints(kollet, v[12], v[13]);
	var F5 = new Plane3D();
	F5.CreatePlaneThreePoints(kollet, v[13], v[14]);
	var F6 = new Plane3D();
	F6.CreatePlaneThreePoints(kollet, v[14], v[15]);
	var F7 = new Plane3D();
	F7.CreatePlaneThreePoints(kollet, v[15], v[8]);

	// Плоскости в которых лежат грани D0 ... D7
	var D0 = new Plane3D();
	D0.CreatePlaneThreePoints(girdle[68], v[0], v[1]);
	var D1 = new Plane3D();
	D1.CreatePlaneThreePoints(girdle[76], v[1], v[2]);
	var D2 = new Plane3D();
	D2.CreatePlaneThreePoints(girdle[84], v[2], v[3]);
	var D3 = new Plane3D();
	D3.CreatePlaneThreePoints(girdle[92], v[3], v[4]);
	var D4 = new Plane3D();
	D4.CreatePlaneThreePoints(girdle[100], v[4], v[5]);
	var D5 = new Plane3D();
	D5.CreatePlaneThreePoints(girdle[108], v[5], v[6]);
	var D6 = new Plane3D();
	D6.CreatePlaneThreePoints(girdle[116], v[6], v[7]);
	var D7 = new Plane3D();
	D7.CreatePlaneThreePoints(girdle[124], v[7], v[0]);
	
	// Плоскости, опирающиеся на рундист
	// G0, G1, G2, G3, G4, G5, G6, G7, G8, G9, G10, G11, G12, G13, G14, G15;
	var G15 = new Plane3D();
	G15.CreatePlaneThreePoints(girdle[124], girdle[64], v[0]);
	var G0 = new Plane3D();
	G0.CreatePlaneThreePoints(girdle[64], girdle[68], v[0]);

	var G1 = new Plane3D();
	G1.CreatePlaneThreePoints(girdle[68], girdle[72], v[1]);
	var G2 = new Plane3D();
	G2.CreatePlaneThreePoints(girdle[72], girdle[76], v[1]);

	var G3 = new Plane3D();
	G3.CreatePlaneThreePoints(girdle[76], girdle[80], v[2]);
	var G4 = new Plane3D();
	G4.CreatePlaneThreePoints(girdle[80], girdle[84], v[2]);
	
	var G5 = new Plane3D();
	G5.CreatePlaneThreePoints(girdle[84], girdle[88], v[3]);
	var G6 = new Plane3D();
	G6.CreatePlaneThreePoints(girdle[88], girdle[92], v[3]);

	var G7 = new Plane3D();
	G7.CreatePlaneThreePoints(girdle[92], girdle[96], v[4]);
	var G8 = new Plane3D();
	G8.CreatePlaneThreePoints(girdle[96], girdle[100], v[4]);

	var G9 = new Plane3D();
	G9.CreatePlaneThreePoints(girdle[100], girdle[104], v[5]);
	var G10 = new Plane3D();
	G10.CreatePlaneThreePoints(girdle[104], girdle[108], v[5]);

	var G11 = new Plane3D();
	G11.CreatePlaneThreePoints(girdle[108], girdle[112], v[6]);
	var G12 = new Plane3D();
	G12.CreatePlaneThreePoints(girdle[112], girdle[116], v[6]);

	var G13 = new Plane3D();
	G13.CreatePlaneThreePoints(girdle[116], girdle[120], v[7]);
	var G14 = new Plane3D();
	G14.CreatePlaneThreePoints(girdle[120], girdle[124], v[7]);

	// Горизонтальная плоскость на уровне DownCleanLevel
	// Параметр DownCleanLevel влияет не только на положение
	// вершин 0 - 7 павильона, но также на положение вершин 40 - 47 павидьона.
	var pl_hPavFacet0 = new Plane3D();
	pl_hPavFacet0.CreatePlaneNormalDistOXYZ(Z1, DownCleanLevel * (dnPoint[2] + r/2) - r/2 );

	pavil[0] = pl_hPavFacet0.IntersectionThreePlanes(G15, G0);
	pavil[1] = pl_hPavFacet0.IntersectionThreePlanes(G1, G2);
	pavil[2] = pl_hPavFacet0.IntersectionThreePlanes(G3, G4);
	pavil[3] = pl_hPavFacet0.IntersectionThreePlanes(G5, G6);
	pavil[4] = pl_hPavFacet0.IntersectionThreePlanes(G7, G8);
	pavil[5] = pl_hPavFacet0.IntersectionThreePlanes(G9, G10);
	pavil[6] = pl_hPavFacet0.IntersectionThreePlanes(G11, G12);
	pavil[7] = pl_hPavFacet0.IntersectionThreePlanes(G13, G14);

	// Два вектора для расчета плоскости E0
	var vec_E0_1 = new Vector3D(girdle[68][0] - girdle[124][0], girdle[68][1] - girdle[124][1], 0.0);
	vec_E0_1.Normer();
	var vec_E0_2 = new Vector3D(v[0][0] - v[8][0], v[0][1] - v[8][1], v[0][2] - v[8][2]);
	vec_E0_2.Normer();
	var vec_0 = vec_E0_1.Cross(vec_E0_2); 
	vec_0.Normer();

	// Два вектора для расчета плоскости E1
	var vec_E1_1 = new Vector3D(girdle[76][0] - girdle[68][0], girdle[76][1] - girdle[68][1], 0.0);
	vec_E1_1.Normer();
	var vec_E1_2 = new Vector3D(v[1][0] - v[9][0], v[1][1] - v[9][1], v[1][2] - v[9][2]);
	vec_E1_2.Normer();
	var vec_1 = vec_E1_1.Cross(vec_E1_2); 
	vec_1.Normer();
	
	// Два вектора для расчета плоскости E2
	var vec_E2_1 = new Vector3D(girdle[84][0] - girdle[76][0], girdle[84][1] - girdle[76][1], 0.0);
	vec_E2_1.Normer();
	var vec_E2_2 = new Vector3D(v[2][0] - v[10][0], v[2][1] - v[10][1], v[2][2] - v[10][2]);
	vec_E2_2.Normer();
	var vec_2 = vec_E2_1.Cross(vec_E2_2); 
	vec_2.Normer();
	
	// Создаем плоскости в которых расположены грани E0, E1 и E2
	var E0 = new Plane3D();
	E0.CreatePlaneNormalVectorPoint(vec_0, pavil[0]);
	var E1 = new Plane3D();
	E1.CreatePlaneNormalVectorPoint(vec_1, pavil[1]);
	var E2 = new Plane3D();
	E2.CreatePlaneNormalVectorPoint(vec_2, pavil[2]);

	// Расчет положения шести вершин ограничивающих грань E0
	pavil[23] = E0.IntersectionThreePlanes(D7, G15);
	pavil[8] = E0.IntersectionThreePlanes(D0, G0);
	pavil[39] = E0.IntersectionThreePlanes(D7, F7);
	pavil[40] = E0.IntersectionThreePlanes(F7, F0);
	pavil[24] = E0.IntersectionThreePlanes(D0, F0);
	
	// Расчет положения шести вершин ограничивающих грань E1
	pavil[9] = E1.IntersectionThreePlanes(D0, G1);
	pavil[10] = E1.IntersectionThreePlanes(D1, G2);
	pavil[25] = E1.IntersectionThreePlanes(D0, F0);
	pavil[41] = E1.IntersectionThreePlanes(F0, F1);
	pavil[26] = E1.IntersectionThreePlanes(D1, F1);
	
	// Расчет положения шести вершин ограничивающих грань E2
	pavil[11] = E2.IntersectionThreePlanes(D1, G3);
	pavil[12] = E2.IntersectionThreePlanes(D2, G4);
	pavil[27] = E2.IntersectionThreePlanes(D1, F1);
	pavil[42] = E2.IntersectionThreePlanes(F1, F2);
	pavil[28] = E2.IntersectionThreePlanes(D2, F2);
	
	// Исходя из симметрии модели огранки
	pavil[13] = new Point3D(pavil[10][0], -pavil[10][1], pavil[10][2]);
	pavil[14] = new Point3D(pavil[9][0],  -pavil[9][1],  pavil[9][2]);
	pavil[15] = new Point3D(pavil[8][0],  -pavil[8][1],  pavil[8][2]);
	pavil[16] = new Point3D(pavil[23][0],  -pavil[23][1],  pavil[23][2]);
	pavil[17] = new Point3D(-pavil[14][0],  pavil[14][1],  pavil[14][2]);
	pavil[18] = new Point3D(-pavil[13][0],  pavil[13][1],  pavil[13][2]);
	pavil[19] = new Point3D(-pavil[12][0],  pavil[12][1],  pavil[12][2]);
	pavil[20] = new Point3D(-pavil[11][0],  pavil[11][1],  pavil[11][2]);
	pavil[21] = new Point3D(-pavil[10][0],  pavil[10][1],  pavil[10][2]);
	pavil[22] = new Point3D(-pavil[9][0],  pavil[9][1],  pavil[9][2]);
	pavil[29] = new Point3D(pavil[26][0], -pavil[26][1],  pavil[26][2]);
	pavil[30] = new Point3D(pavil[25][0], -pavil[25][1],  pavil[25][2]);
	pavil[31] = new Point3D(pavil[24][0], -pavil[24][1],  pavil[24][2]);
	pavil[32] = new Point3D(pavil[39][0], -pavil[39][1],  pavil[39][2]);
	pavil[33] = new Point3D(-pavil[30][0],  pavil[30][1],  pavil[30][2]);
	pavil[34] = new Point3D(-pavil[29][0],  pavil[29][1],  pavil[29][2]);
	pavil[35] = new Point3D(-pavil[28][0],  pavil[28][1],  pavil[28][2]);
	pavil[36] = new Point3D(-pavil[27][0],  pavil[27][1],  pavil[27][2]);
	pavil[37] = new Point3D(-pavil[26][0],  pavil[26][1],  pavil[26][2]);
	pavil[38] = new Point3D(-pavil[25][0],  pavil[25][1],  pavil[25][2]);
	pavil[43] = new Point3D(pavil[41][0], -pavil[41][1],  pavil[41][2]);
	pavil[44] = new Point3D(pavil[40][0], -pavil[40][1],  pavil[40][2]);
	pavil[45] = new Point3D(-pavil[43][0], pavil[43][1],  pavil[43][2]);
	pavil[46] = new Point3D(-pavil[42][0], pavil[42][1],  pavil[42][2]);
	pavil[47] = new Point3D(-pavil[41][0], pavil[41][1],  pavil[41][2]);
	// калетта
	pavil[48] = new Point3D(kollet[0], kollet[1], kollet[2]);
	
	// Корректировка положения вершин рундиста по оси Z
	corr_gd_pav(64, 68, 0);
	corr_gd_pav(68, 72, 1);
	corr_gd_pav(72, 76, 1);
	corr_gd_pav(76, 80, 2);
	
	corr_gd_pav(80, 84, 2);
	corr_gd_pav(84, 88, 3);
	corr_gd_pav(88, 92, 3);
	corr_gd_pav(92, 96, 4);

	corr_gd_pav(96, 100, 4);
	corr_gd_pav(100, 104, 5);
	corr_gd_pav(104, 108, 5);
	corr_gd_pav(108, 112, 6);

	corr_gd_pav(112, 116, 6);
	corr_gd_pav(116, 120, 7);
	corr_gd_pav(120, 124, 7);
	corr_gd_pav(124, 64, 0);	
	
	// В массиве vertices хранятся координаты (x, y, z) всех вершин огранки подряд.
	for(i = 0; i < 32; i++)
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
	
	for(i = 0; i < 49; i++)
	{
		vertices.push(pavil[i][0]);
		vertices.push(pavil[i][1]);
		vertices.push(pavil[i][2]);
	}	
	
	var nnn = 10;
}

function corr_gd_crown(gd1, gd2, cr)
{
	var planeT = new Plane3D();
	planeT.CreatePlaneThreePoints(girdle[gd1], girdle[gd2], crown[cr]);
	var n = 4; //gd2 - gd1;
	var i = 0;
	for (i = 1; i < n; i++)
	{
		var vert_line = new Line3D(girdle[gd1 + i], girdle[gd1 + i + 64]);
		var pt = vert_line.IntersectionLinePlane(planeT);
		girdle[gd1 + i][2] = pt[2];
	}
}

function corr_gd_pav(gd1, gd2, pav)
{
	var planeT = new Plane3D();
	planeT.CreatePlaneThreePoints(girdle[gd1], girdle[gd2], pavil[pav]);
	var n = 4; //gd2 - gd1;
	var i;
	for (i = 1; i < n; i++)
	{
		var vert_line = new Line3D(girdle[gd1 + i], girdle[gd1 + i - 64]);
		var pt = vert_line.IntersectionLinePlane(planeT);
		girdle[gd1 + i][2] = pt[2];
	}	
}


// Расчет вершин рундиста (girdle - рундист).
// Рундист является суперэллипсом разбитым на 64 части.
function InitGirdle(nGirdle)
{
	var fi_0 = -90*DEGREE;
	var r1 = 0.5 * lw; // Полуось эллипса по оси X
	var r2 = -0.5;          // Полуось эллипса по оси Y

	var dx = square_deviation;
	if ( dx < -1 || dx >= 0.995 )
		return null;
	var p = 2 / ( 1 - dx );  // Степень суперэллипса

	var del_fi = 2 * Math.PI / nGirdle; // Шаг углового параметра
	var x, y, w, fi;

	var i;
	for (i = 0; i < nGirdle; i++)
	{
		fi = fi_0 + i*del_fi; // Значение углового параметра
		x = Math.cos(fi);
		y = Math.sin(fi);
		w = Math.pow (Math.abs (x), p) + Math.pow (Math.abs (y), p);
		w = 1 / Math.pow ( w, 1/p );
		var point = new Point3D ( r1 * w * x,   r2 * w * y, r/2);
		girdle[i] = point;
	}
	for (i = 0; i < nGirdle; i++)
	{
		girdle[i+nGirdle] = new Point3D ( girdle[i][0], girdle[i][1], -r/2);
	}
}

function FillEllipse(ry)
{
	var N = 8;
	var del_fi_0 = 2 * Math.PI / (N*2);
	var fi_0 = -90*DEGREE + del_fi_0;
	var rx = ry * lw;
	ry = -ry;
	
	var dx = square_deviation;
	if ( dx < -1 || dx >= 0.995 )
		return null;
	var p = 2 / ( 1 - dx );  // Степень суперэллипса

	var del_fi = 2 * Math.PI / N; // Шаг углового параметра
	var x, y, w, fi;

	var i;
	for (i = 0; i < N; i++)
	{
		fi = fi_0 + i*del_fi; // Значение углового параметра
		x = Math.cos(fi);
		y = Math.sin(fi);
		w = Math.pow (Math.abs (x), p) + Math.pow (Math.abs (y), p);
		w = 1 / Math.pow ( w, 1/p );
		var point = new Point3D ( rx * w * x,   ry * w * y, 0.0);
		temp[i] = point;
	}
}

// Все грани (полигоны) 3D модели огранки обходим против часовой стрелки
// если смотреть на модель находясь от нее снаружи.
	var index_cut = [
	// Площадка 
	0, 7, 6, 5, 4, 3, 2, 1, 0,

	// Корона - верхний ряд пятиугольных граней
	0, 1, 9, 16, 8, 0,
	1, 2, 10, 17, 9, 1,
	2, 3, 11, 18, 10, 2,
	3, 4, 12, 19, 11, 3,
	4, 5, 13, 20, 12, 4,
	5, 6, 14, 21, 13, 5,
	6, 7, 15, 22, 14, 6,
	7, 0, 8, 23, 15, 7,

	// Корона - средний ряд четырехугольных граней
	8, 16, 24, 23, 8,
	9, 17, 25, 16, 9,
	10, 18, 26, 17, 10,
	11, 19, 27, 18, 11,
	12, 20, 28, 19, 12,
	13, 21, 29, 20, 13,
	14, 22, 30, 21, 14,
	15, 23, 31, 22, 15,

	// Корона - нижний ряд четырехугольных граней
	16, 25, 36, 24, 16,
	17, 26, 44, 25, 17,
	18, 27, 52, 26, 18,
	19, 28, 60, 27, 19,
	20, 29, 68, 28, 20,
	21, 30, 76, 29, 21,
	22, 31, 84, 30, 22,
	23, 24, 92, 31, 23,

	// Корона - нижний ряд шестиугольных граней рядом с рундистом
	24, 32, 95, 94, 93, 92, 24,
	24, 36, 35, 34, 33, 32, 24,

	25, 40, 39, 38, 37, 36, 25,
	25, 44, 43, 42, 41, 40, 25,

	26, 48, 47, 46, 45, 44, 26,
	26, 52, 51, 50, 49, 48, 26,

	27, 56, 55, 54, 53, 52, 27,
	27, 60, 59, 58, 57, 56, 27,

	28, 64, 63, 62, 61, 60, 28,
	28, 68, 67, 66, 65, 64, 28,

	29, 72, 71, 70, 69, 68, 29,
	29, 76, 75, 74, 73, 72, 29,

	30, 80, 79, 78, 77, 76, 30,
	30, 84, 83, 82, 81, 80, 30,

	31, 88, 87, 86, 85, 84, 31,
	31, 92, 91, 90, 89, 88, 31,

	// Рундист

	32, 33, 97, 96, 32,
	33, 34, 98, 97, 33,
	34, 35, 99, 98, 34,
	35, 36, 100, 99, 35,
	36, 37, 101, 100, 36,
	37, 38, 102, 101, 37,
	38, 39, 103, 102, 38,
	39, 40, 104, 103, 39,
	40, 41, 105, 104, 40,
	41, 42, 106, 105, 41,
	42, 43, 107, 106, 42,
	43, 44, 108, 107, 43,
	44, 45, 109, 108, 44,
	45, 46, 110, 109, 45,
	46, 47, 111, 110, 46,
	47, 48, 112, 111, 47,
	48, 49, 113, 112, 48,
	49, 50, 114, 113, 49,
	50, 51, 115, 114, 50,
	51, 52, 116, 115, 51,
	52, 53, 117, 116, 52,
	53, 54, 118, 117, 53,
	54, 55, 119, 118, 54,
	55, 56, 120, 119, 55,
	56, 57, 121, 120, 56,
	57, 58, 122, 121, 57,
	58, 59, 123, 122, 58,
	59, 60, 124, 123, 59,
	60, 61, 125, 124, 60,
	61, 62, 126, 125, 61,
	62, 63, 127, 126, 62,
	63, 64, 128, 127, 63,
	64, 65, 129, 128, 64,
	65, 66, 130, 129, 65,
	66, 67, 131, 130, 66,
	67, 68, 132, 131, 67,
	68, 69, 133, 132, 68,
	69, 70, 134, 133, 69,
	70, 71, 135, 134, 70,
	71, 72, 136, 135, 71,
	72, 73, 137, 136, 72,
	73, 74, 138, 137, 73,
	74, 75, 139, 138, 74,
	75, 76, 140, 139, 75,
	76, 77, 141, 140, 76,
	77, 78, 142, 141, 77,
	78, 79, 143, 142, 78,
	79, 80, 144, 143, 79,
	80, 81, 145, 144, 80,
	81, 82, 146, 145, 81,
	82, 83, 147, 146, 82,
	83, 84, 148, 147, 83,
	84, 85, 149, 148, 84,
	85, 86, 150, 149, 85,
	86, 87, 151, 150, 86,
	87, 88, 152, 151, 87,
	88, 89, 153, 152, 88,
	89, 90, 154, 153, 89,
	90, 91, 155, 154, 90,
	91, 92, 156, 155, 91,
	92, 93, 157, 156, 92,
	93, 94, 158, 157, 93,
	94, 95, 159, 158, 94,
	95, 32, 96, 159, 95,

	// Павильон

	// Павильон - верхний ряд семиугольных граней рядом с рундистом
	160, 183, 156, 157, 158, 159, 96, 160,
	160, 96, 97, 98, 99, 100, 168, 160,

	161, 169, 100, 101, 102, 103, 104, 161,
	161, 104, 105, 106, 107, 108, 170, 161,

	162, 171, 108, 109, 110, 111, 112, 162,
	162, 112, 113, 114, 115, 116, 172, 162,

	163, 173, 116, 117, 118, 119, 120, 163,
	163, 120, 121, 122, 123, 124, 174, 163,

	164, 175, 124, 125, 126, 127, 128, 164,
	164, 128, 129, 130, 131, 132, 176, 164,

	165, 177, 132, 133, 134, 135, 136, 165,
	165, 136, 137, 138, 139, 140, 178, 165,

	166, 179, 140, 141, 142, 143, 144, 166,
	166, 144, 145, 146, 147, 148, 180, 166,

	167, 181, 148, 149, 150, 151, 152, 167,
	167, 152, 153, 154, 155, 156, 182, 167,

	// Павильон - восемь пятиугольных граней примыкающих одной вершиной к рундисту
	184, 168, 100, 169, 185, 184,
	186, 170, 108, 171, 187, 186,
	188, 172, 116, 173, 189, 188,
	190, 174, 124, 175, 191, 190,
	192, 176, 132, 177, 193, 192,
	194, 178, 140, 179, 195, 194,
	196, 180, 148, 181, 197, 196,
	198, 182, 156, 183, 199, 198,

	// Павильон - восемь шестиугольных граней в средней части павильона
	200, 199, 183, 160, 168, 184, 200,
	201, 185, 169, 161, 170, 186, 201,
	202, 187, 171, 162, 172, 188, 202,
	203, 189, 173, 163, 174, 190, 203,
	204, 191, 175, 164, 176, 192, 204,
	205, 193, 177, 165, 178, 194, 205,
	206, 195, 179, 166, 180, 196, 206,
	207, 197, 181, 167, 182, 198, 207,

	// Грани примыкающие к калетте
	208, 200, 184, 185, 201, 208,
	208, 201, 186, 187, 202, 208,
	208, 202, 188, 189, 203, 208,
	208, 203, 190, 191, 204, 208,
	208, 204, 192, 193, 205, 208,
	208, 205, 194, 195, 206, 208,
	208, 206, 196, 197, 207, 208,
	208, 207, 198, 199, 200, 208,
		
		// Признак того, что граней больше нет
		-100      
	];

function facet_colors()
{
	var i = 0;
	// table
	colors[i] = new THREE.Color("rgb(100, 100, 130)"); i++;
	
	for (i = 1; i < 9; i++)
	{
		colors[i] = new THREE.Color("rgb(150, 150, 170)"); i++;
		colors[i] = new THREE.Color("rgb(200, 200, 220)");
	}	
	
	for (i = 9; i < 17; i++)
	{
		colors[i] = new THREE.Color("rgb(100, 100, 120)"); i++;
		colors[i] = new THREE.Color("rgb(70, 70, 90)");
	}

	for (i = 17; i < 25; i++)
	{
		colors[i] = new THREE.Color("rgb(150, 150, 170)"); i++;
		colors[i] = new THREE.Color("rgb(120, 120, 140)"); 
	}	
	
	for (i = 25; i < 41; i++)
	{
		colors[i] = new THREE.Color("rgb(50, 50, 70)"); i++;
		colors[i] = new THREE.Color("rgb(80, 80, 100)"); 
	}
	
	//  GIRDLE
	for (i = 41; i < 105; i++)
	{
		colors[i] = new THREE.Color("rgb(100, 100, 140)"); i++;
		colors[i] = new THREE.Color("rgb(120, 120, 150)");
	}
	
	// pavilion upper facets
	for (i = 105; i < 121; i++)
	{
		colors[i] = new THREE.Color("rgb(50, 50, 70)"); i++
		colors[i] = new THREE.Color("rgb(80, 80, 100)");		
	}

	// pavilion facets
	for (i = 121; i < 129; i++)
	{
		colors[i] = new THREE.Color("rgb(90, 90, 120)");
	}	
	
	for (i = 129; i < 137; i++)
	{
		colors[i] = new THREE.Color("rgb(110, 110, 150)");
	}	
	
	for (i = 137; i < 145; i++)
	{
		colors[i] = new THREE.Color("rgb(150, 150, 180)"); i++
		colors[i] = new THREE.Color("rgb(190, 190, 220)");
	}		
};

