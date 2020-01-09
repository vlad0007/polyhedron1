var DEGREE = 0.01745329251994; // значение одного углового градуса
var PERCENT = 0.01;
var SQRT2 = 1.41421356237309504880;
var M_PI = 3.14159265358979323846;
var M_PI_2 = 1.57079632679489661923;

// СДМ - структура данных модели
var lw = 1.0;      			// отношение длины огранки к ее ширине
// Рундист
var r = 0.06;       		// толщина рундиста
var waviness = -0.016;
// Корона
var hCrown = 0.193;
var t = 0.54;				// размер площадки
var crown_mid_diam = 0.77;
var hCrownMid = 0.14;
var hCrownUp = 0.17;

// Павильон
var hp = 0.6;
var pav_mid_diam = 0.7;
var hPavMiddle = 0.28;
var pav_down_diam = 0.33;
var hPavDown = 0.467;
var hPavFacet = 0.9;

var girdle = [192];
var table = [16];
var crown = [];
var pavil = [];	
var vertices = [];
var temp = [24];

// Расчет координат вершин огранки (модели).
function VerticesCalculation()
{
	var nCrown  = 48;
	var nGirdle = 96;
	var nPav    = 61;
	
    // Вспомогательные переменные и объекты
	var Z1 = new Vector3D(0,0,1);
	var Y1 = new Vector3D(0,1,0);
	var X1 = new Vector3D(1,0,0);

	var norm2d = new Vector2D;
	var normPlaneVector = new Vector3D();
	var i, j;

	// Создаем волнистый рундист
	FillGirdle_WavyMultifacet();

	// Конструируем корону
	var hTable = hCrown + r/2;	
	
	var plane_Table = new Plane3D();
	plane_Table.CreatePlaneNormalDistOXYZ(Z1, hTable);
	
	var vert_t2 = new Plane3D();
	vert_t2.CreatePlaneNormalDistOXYZ(Y1, t/2);
	
	// Создаем вертикальную плоскость проходящую через girdle[4] и начало координат
	var pl_g4 = new Plane3D();
	pl_g4.CreatePlaneThreePoints(new Point3D(0,0,0), new Point3D(0,0,1), girdle[4]);
	crown[0] = plane_Table.IntersectionThreePlanes(pl_g4, vert_t2);
	
	// Находим радиус окружности (ось эллипса) для расчета вершин площадки
	var y = Math.sin( 90*DEGREE - 4 * (2 * M_PI / 96) );
	var r_table = crown[0][1] / y;
	
	// Расчет вершин короны расположенных на площадке
	FillEllipse(r_table);
	for (i = 0; i < 12; i++)
	{
		crown[i] = new Point3D(temp[i][0], temp[i][1], hTable);
	}
	
	// Расчет вершин короны расположенных на линии эллипса заданной параметром crown_mid_diam.
	// Эллипс лежит на плоскости расположенной на высоте заданной параметром hCrownMid
	FillEllipse(0.5 * crown_mid_diam);
	for (i = 0; i < 12; i++)
	{
		crown[24+i] = new Point3D(temp[i][0], temp[i][1], r/2 + hCrownMid);
	}	

	// Грани A0, A1, A2, A3, A4, A5, A6, A7, A8, A9, A10, A11;
	var v0 = new Vector3D(girdle[0][0] - girdle[8][0],    girdle[0][1] - girdle[8][1], 0.0);
	var v1 = new Vector3D(girdle[8][0] - girdle[16][0],   girdle[8][1] - girdle[16][1], 0.0);
	var v2 = new Vector3D(girdle[16][0] - girdle[24][0],  girdle[16][1] - girdle[24][1], 0.0);
	var v3 = new Vector3D(girdle[24][0] - girdle[32][0],  girdle[24][1] - girdle[32][1], 0.0);
	var v4 = new Vector3D(girdle[32][0] - girdle[40][0],  girdle[32][1] - girdle[40][1], 0.0);
	var v5 = new Vector3D(girdle[40][0] - girdle[48][0],  girdle[40][1] - girdle[48][1], 0.0);
	var v6 = new Vector3D(girdle[48][0] - girdle[56][0],  girdle[48][1] - girdle[56][1], 0.0);
	var v7 = new Vector3D(girdle[56][0] - girdle[64][0],  girdle[56][1] - girdle[64][1], 0.0);
	var v8 = new Vector3D(girdle[64][0] - girdle[72][0],  girdle[64][1] - girdle[72][1], 0.0);
	var v9 = new Vector3D(girdle[72][0] - girdle[80][0],  girdle[72][1] - girdle[80][1], 0.0);
	var v10 = new Vector3D(girdle[80][0] - girdle[88][0], girdle[80][1] - girdle[88][1], 0.0);
	var v11 = new Vector3D(girdle[88][0] - girdle[0][0],  girdle[88][1] - girdle[0][1], 0.0);
	
	var A0 = new Plane3D();
	A0.CreatePlaneVectorTwoPoints(v0, crown[24], girdle[4]);
	var A1 = new Plane3D();
	A1.CreatePlaneVectorTwoPoints(v1, crown[25], girdle[12]);
	var A2 = new Plane3D();
	A2.CreatePlaneVectorTwoPoints(v2, crown[26], girdle[20]);
	var A3 = new Plane3D();
	A3.CreatePlaneVectorTwoPoints(v3, crown[27], girdle[28]);
	var A4 = new Plane3D();
	A4.CreatePlaneVectorTwoPoints(v4, crown[28], girdle[36]);
	var A5 = new Plane3D();
	A5.CreatePlaneVectorTwoPoints(v5, crown[29], girdle[44]);
	var A6 = new Plane3D();
	A6.CreatePlaneVectorTwoPoints(v6, crown[30], girdle[52]);
	var A7 = new Plane3D();
	A7.CreatePlaneVectorTwoPoints(v7, crown[31], girdle[60]);
	var A8 = new Plane3D();
	A8.CreatePlaneVectorTwoPoints(v8, crown[32], girdle[68]);
	var A9 = new Plane3D();
	A9.CreatePlaneVectorTwoPoints(v9, crown[33], girdle[76]);
	var A10 = new Plane3D();
	A10.CreatePlaneVectorTwoPoints(v10, crown[34], girdle[84]);
	var A11 = new Plane3D();
	A11.CreatePlaneVectorTwoPoints(v11, crown[35], girdle[92]);

	//  Грани B0, B1, B2, B3, B4, B5, B6, B7, B8, B9, B10, B11;
	var B0 = new Plane3D();
	B0.CreatePlaneVectorTwoPoints(v0, crown[0], crown[24]);
	var B1 = new Plane3D();
	B1.CreatePlaneVectorTwoPoints(v1, crown[1], crown[25]);
	var B2 = new Plane3D();
	B2.CreatePlaneVectorTwoPoints(v2, crown[2], crown[26]);
	var B3 = new Plane3D();
	B3.CreatePlaneVectorTwoPoints(v3, crown[3], crown[27]);
	var B4 = new Plane3D();
	B4.CreatePlaneVectorTwoPoints(v4, crown[4], crown[28]);
	var B5 = new Plane3D();
	B5.CreatePlaneVectorTwoPoints(v5, crown[5], crown[29]);
	var B6 = new Plane3D();
	B6.CreatePlaneVectorTwoPoints(v6, crown[6], crown[30]);
	var B7 = new Plane3D();
	B7.CreatePlaneVectorTwoPoints(v7, crown[7], crown[31]);
	var B8 = new Plane3D();
	B8.CreatePlaneVectorTwoPoints(v8, crown[8], crown[32]);
	var B9 = new Plane3D();
	B9.CreatePlaneVectorTwoPoints(v9, crown[9], crown[33]);
	var B10 = new Plane3D();
	B10.CreatePlaneVectorTwoPoints(v10, crown[10], crown[34]);
	var B11 = new Plane3D();
	B11.CreatePlaneVectorTwoPoints(v11, crown[11], crown[35]);

	// Плоскость определяющая высоту треугольных граней примыкающих к площадке
	var pl_crown_up = new Plane3D();
	pl_crown_up.CreatePlaneNormalDistOXYZ(Z1, hCrownUp + r/2);

	crown[13] = pl_crown_up.IntersectionThreePlanes(B0, B1);
	crown[14] = pl_crown_up.IntersectionThreePlanes(B1, B2);
	crown[15] = pl_crown_up.IntersectionThreePlanes(B2, B3);
	crown[16] = pl_crown_up.IntersectionThreePlanes(B3, B4);
	crown[17] = pl_crown_up.IntersectionThreePlanes(B4, B5);
	crown[18] = pl_crown_up.IntersectionThreePlanes(B5, B6);
	crown[19] = pl_crown_up.IntersectionThreePlanes(B6, B7);
	crown[20] = pl_crown_up.IntersectionThreePlanes(B7, B8);
	crown[21] = pl_crown_up.IntersectionThreePlanes(B8, B9);
	crown[22] = pl_crown_up.IntersectionThreePlanes(B9, B10);
	crown[23] = pl_crown_up.IntersectionThreePlanes(B10, B11);
	crown[12] = pl_crown_up.IntersectionThreePlanes(B11, B0);

	// Четырехугольники среднего ряда короны C0, C1, C2, C3
	var C0 = new Plane3D();
	C0.CreatePlaneThreePoints(crown[12], crown[35], crown[24]);
	var C1 = new Plane3D();
	C1.CreatePlaneThreePoints(crown[13], crown[24], crown[25]);
	var C2 = new Plane3D();
	C2.CreatePlaneThreePoints(crown[14], crown[25], crown[26]);
	var C3 = new Plane3D();
	C3.CreatePlaneThreePoints(crown[15], crown[26], crown[27]);

	// Вершины нижнего яруса короны (около рундиста)
	crown[36] = C0.IntersectionThreePlanes(A11, A0);
	crown[37] = C1.IntersectionThreePlanes(A0, A1);
	crown[38] = C2.IntersectionThreePlanes(A1, A2);
	crown[39] = C3.IntersectionThreePlanes(A2, A3);

	// Остальные вершины нижнего яруса короны (около рундиста)
	crown[40] = new Point3D( crown[38][0], -crown[38][1],  crown[38][2]);
	crown[41] = new Point3D( crown[37][0], -crown[37][1],  crown[37][2]);
	crown[42] = new Point3D( crown[36][0], -crown[36][1],  crown[36][2]);
	crown[43] = new Point3D( -crown[41][0],  crown[41][1],  crown[41][2]);
	crown[44] = new Point3D( -crown[40][0],  crown[40][1],  crown[40][2]);
	crown[45] = new Point3D( -crown[39][0],  crown[39][1],  crown[39][2]);
	crown[46] = new Point3D( -crown[38][0],  crown[38][1],  crown[38][2]);
	crown[47] = new Point3D( -crown[37][0],  crown[37][1],  crown[37][2]);

	corr_gd_crown(0, 4, 36);
	corr_gd_crown(4, 8, 37);
	corr_gd_crown(8, 12, 37);
	corr_gd_crown(12, 16, 38);

	corr_gd_crown(16, 20, 38);
	corr_gd_crown(20, 24, 39);
	corr_gd_crown(24, 28, 39);
	corr_gd_crown(28, 32, 40);
	
	corr_gd_crown(32, 36, 40);
	corr_gd_crown(36, 40, 41);
	corr_gd_crown(40, 44, 41);
	corr_gd_crown(44, 48, 42);
	
	corr_gd_crown(48, 52, 42);
	corr_gd_crown(52, 56, 43);
	corr_gd_crown(56, 60, 43);
	corr_gd_crown(60, 64, 44);
	
	corr_gd_crown(64, 68, 44);
	corr_gd_crown(68, 72, 45);
	corr_gd_crown(72, 76, 45);
	corr_gd_crown(76, 80, 46);
	
	corr_gd_crown(80, 84, 46);
	corr_gd_crown(84, 88, 47);
	corr_gd_crown(88, 92, 47);
	corr_gd_crown(92, 0, 36);

	/////////////////////////////////////////////////
	//            Конструируем павильон            //
	/////////////////////////////////////////////////

	var kollet = new Point3D(0, 0, - hp - r/2);	

	// Расчет вершин павильона расположенных на линии эллипса заданной параметром pav_mid_diam.
	// Эллипс лежит на плоскости расположенной на высоте заданной параметром hPavMiddle
	FillEllipse(0.5 * pav_mid_diam);
	for (i = 0; i < 12; i++)
	{
		pavil[12+i] = new Point3D(temp[i][0], temp[i][1], - r/2 - hPavMiddle);
	}	

	// Расчет вершин павильона расположенных на линии эллипса заданной параметром pav_down_diam.
	// Эллипс лежит на плоскости расположенной на высоте заданной параметром hPavDown
	FillEllipse(0.5 * pav_down_diam);
	for (i = 0; i < 12; i++)
	{
		pavil[36+i] = new Point3D(temp[i][0], temp[i][1], - r/2 - hPavDown);
	}	

//	 Грани D0, D1, D2, D3, D4, D5, D6, D7, D8, D9, D10, D11;
	var D0 = new Plane3D();
	D0.CreatePlaneVectorTwoPoints(v0, pavil[12], girdle[100]);
	var D1 = new Plane3D();
	D1.CreatePlaneVectorTwoPoints(v1, pavil[13], girdle[108]);
	var D2 = new Plane3D();
	D2.CreatePlaneVectorTwoPoints(v2, pavil[14], girdle[116]);
	var D3 = new Plane3D();
	D3.CreatePlaneVectorTwoPoints(v3, pavil[15], girdle[124]);
	var D4 = new Plane3D();
	D4.CreatePlaneVectorTwoPoints(v4, pavil[16], girdle[132]);
	var D5 = new Plane3D();
	D5.CreatePlaneVectorTwoPoints(v5, pavil[17], girdle[140]);
	var D6 = new Plane3D();
	D6.CreatePlaneVectorTwoPoints(v6, pavil[18], girdle[148]);
	var D7 = new Plane3D();
	D7.CreatePlaneVectorTwoPoints(v7, pavil[19], girdle[156]);
	var D8 = new Plane3D();
	D8.CreatePlaneVectorTwoPoints(v8, pavil[20], girdle[164]);
	var D9 = new Plane3D();
	D9.CreatePlaneVectorTwoPoints(v9, pavil[21], girdle[172]);
	var D10 = new Plane3D();
	D10.CreatePlaneVectorTwoPoints(v10, pavil[22], girdle[180]);
	var D11 = new Plane3D();
	D11.CreatePlaneVectorTwoPoints(v11, pavil[23], girdle[188]);
	
	
//	Грани E0, E1, E2, E3, E4, E5, E6, E7, E8, E9, E10, E11;
	var E0 = new Plane3D();
	E0.CreatePlaneVectorTwoPoints(v0, pavil[36], pavil[12]);
	var E1 = new Plane3D();
	E1.CreatePlaneVectorTwoPoints(v1, pavil[37], pavil[13]);
	var E2 = new Plane3D();
	E2.CreatePlaneVectorTwoPoints(v2, pavil[38], pavil[14]);
	var E3 = new Plane3D();
	E3.CreatePlaneVectorTwoPoints(v3, pavil[39], pavil[15]);
	var E4 = new Plane3D();
	E4.CreatePlaneVectorTwoPoints(v4, pavil[40], pavil[16]);
	var E5 = new Plane3D();
	E5.CreatePlaneVectorTwoPoints(v5, pavil[41], pavil[17]);
	var E6 = new Plane3D();
	E6.CreatePlaneVectorTwoPoints(v6, pavil[42], pavil[18]);
	var E7 = new Plane3D();
	E7.CreatePlaneVectorTwoPoints(v7, pavil[43], pavil[19]);
	var E8 = new Plane3D();
	E8.CreatePlaneVectorTwoPoints(v8, pavil[44], pavil[20]);
	var E9 = new Plane3D();
	E9.CreatePlaneVectorTwoPoints(v9, pavil[45], pavil[21]);
	var E10 = new Plane3D();
	E10.CreatePlaneVectorTwoPoints(v10, pavil[46], pavil[22]);
	var E11 = new Plane3D();
	E11.CreatePlaneVectorTwoPoints(v11, pavil[47], pavil[23]);

//	Грани F0, F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11;
	var F0 = new Plane3D();
	F0.CreatePlaneVectorTwoPoints(v0, kollet, pavil[36]);
	var F1 = new Plane3D();
	F1.CreatePlaneVectorTwoPoints(v1, kollet, pavil[37]);
	var F2 = new Plane3D();
	F2.CreatePlaneVectorTwoPoints(v2, kollet, pavil[38]);
	var F3 = new Plane3D();
	F3.CreatePlaneVectorTwoPoints(v3, kollet, pavil[39]);
	var F4 = new Plane3D();
	F4.CreatePlaneVectorTwoPoints(v4, kollet, pavil[40]);
	var F5 = new Plane3D();
	F5.CreatePlaneVectorTwoPoints(v5, kollet, pavil[41]);
	var F6 = new Plane3D();
	F6.CreatePlaneVectorTwoPoints(v6, kollet, pavil[42]);
	var F7 = new Plane3D();
	F7.CreatePlaneVectorTwoPoints(v7, kollet, pavil[43]);
	var F8 = new Plane3D();
	F8.CreatePlaneVectorTwoPoints(v8, kollet, pavil[44]);
	var F9 = new Plane3D();
	F9.CreatePlaneVectorTwoPoints(v9, kollet, pavil[45]);
	var F10 = new Plane3D();
	F10.CreatePlaneVectorTwoPoints(v10, kollet, pavil[46]);
	var F11 = new Plane3D();
	F11.CreatePlaneVectorTwoPoints(v11, kollet, pavil[47]);

	// Горизонтальная плоскость на уровне заданном параметром hPavFacet
	var pl_pav_facet = new Plane3D();
	pl_pav_facet.CreatePlaneNormalDistOXYZ(Z1, - hPavFacet * hp - r/2);	

	pavil[48] = pl_pav_facet.IntersectionThreePlanes(F11, F0);
	pavil[49] = pl_pav_facet.IntersectionThreePlanes(F0, F1);
	pavil[50] = pl_pav_facet.IntersectionThreePlanes(F1, F2);
	pavil[51] = pl_pav_facet.IntersectionThreePlanes(F2, F3);
	pavil[52] = pl_pav_facet.IntersectionThreePlanes(F3, F4);
	pavil[53] = pl_pav_facet.IntersectionThreePlanes(F4, F5);
	pavil[54] = pl_pav_facet.IntersectionThreePlanes(F5, F6);
	pavil[55] = pl_pav_facet.IntersectionThreePlanes(F6, F7);
	pavil[56] = pl_pav_facet.IntersectionThreePlanes(F7, F8);
	pavil[57] = pl_pav_facet.IntersectionThreePlanes(F8, F9);
	pavil[58] = pl_pav_facet.IntersectionThreePlanes(F9, F10);
	pavil[59] = pl_pav_facet.IntersectionThreePlanes(F10, F11);
	
	// Грани H0, H1, H2, H3, H4, H5, H6, H7, H8, H9, H10, H11;
	var H0 = new Plane3D();
	H0.CreatePlaneThreePoints(pavil[47], pavil[36], pavil[48]);
	var H1 = new Plane3D();
	H1.CreatePlaneThreePoints(pavil[36], pavil[37], pavil[49]);
	var H2 = new Plane3D();
	H2.CreatePlaneThreePoints(pavil[37], pavil[38], pavil[50]);
	var H3 = new Plane3D();
	H3.CreatePlaneThreePoints(pavil[38], pavil[39], pavil[51]);
	var H4 = new Plane3D();
	H4.CreatePlaneThreePoints(pavil[39], pavil[40], pavil[52]);
	var H5 = new Plane3D();
	H5.CreatePlaneThreePoints(pavil[40], pavil[41], pavil[53]);
	var H6 = new Plane3D();
	H6.CreatePlaneThreePoints(pavil[41], pavil[42], pavil[54]);
	var H7 = new Plane3D();
	H7.CreatePlaneThreePoints(pavil[42], pavil[43], pavil[55]);
	var H8 = new Plane3D();
	H8.CreatePlaneThreePoints(pavil[43], pavil[44], pavil[56]);
	var H9 = new Plane3D();
	H9.CreatePlaneThreePoints(pavil[44], pavil[45], pavil[57]);
	var H10 = new Plane3D();
	H10.CreatePlaneThreePoints(pavil[45], pavil[46], pavil[58]);
	var H11 = new Plane3D();
	H11.CreatePlaneThreePoints(pavil[46], pavil[47], pavil[59]);

	pavil[24] = H0.IntersectionThreePlanes(E11, E0);
	pavil[25] = H1.IntersectionThreePlanes(E0, E1);
	pavil[26] = H2.IntersectionThreePlanes(E1, E2);
	pavil[27] = H3.IntersectionThreePlanes(E2, E3);
	pavil[28] = H4.IntersectionThreePlanes(E3, E4);
	pavil[29] = H5.IntersectionThreePlanes(E4, E5);
	pavil[30] = H6.IntersectionThreePlanes(E5, E6);
	pavil[31] = H7.IntersectionThreePlanes(E6, E7);
	pavil[32] = H8.IntersectionThreePlanes(E7, E8);
	pavil[33] = H9.IntersectionThreePlanes(E8, E9);
	pavil[34] = H10.IntersectionThreePlanes(E9, E10);
	pavil[35] = H11.IntersectionThreePlanes(E10, E11);
	
	// Грани G0, G1, G2, G3, G4, G5, G6, G7, G8, G9, G10, G11;
	var G0 = new Plane3D();
	G0.CreatePlaneThreePoints(pavil[24], pavil[23], pavil[12]);
	var G1 = new Plane3D();
	G1.CreatePlaneThreePoints(pavil[25], pavil[12], pavil[13]);
	var G2 = new Plane3D();
	G2.CreatePlaneThreePoints(pavil[26], pavil[13], pavil[14]);
	var G3 = new Plane3D();
	G3.CreatePlaneThreePoints(pavil[27], pavil[14], pavil[15]);
	var G4 = new Plane3D();
	G4.CreatePlaneThreePoints(pavil[28], pavil[15], pavil[16]);
	var G5 = new Plane3D();
	G5.CreatePlaneThreePoints(pavil[29], pavil[16], pavil[17]);
	var G6 = new Plane3D();
	G6.CreatePlaneThreePoints(pavil[30], pavil[17], pavil[18]);
	var G7 = new Plane3D();
	G7.CreatePlaneThreePoints(pavil[31], pavil[18], pavil[19]);
	var G8 = new Plane3D();
	G8.CreatePlaneThreePoints(pavil[32], pavil[19], pavil[20]);
	var G9 = new Plane3D();
	G9.CreatePlaneThreePoints(pavil[33], pavil[20], pavil[21]);
	var G10 = new Plane3D();
	G10.CreatePlaneThreePoints(pavil[34], pavil[21], pavil[22]);
	var G11 = new Plane3D();
	G11.CreatePlaneThreePoints(pavil[35], pavil[22], pavil[23]);

	pavil[0] = G0.IntersectionThreePlanes(D11, D0);
	pavil[1] = G1.IntersectionThreePlanes(D0, D1);
	pavil[2] = G2.IntersectionThreePlanes(D1, D2);
	pavil[3] = G3.IntersectionThreePlanes(D2, D3);
	pavil[4] = G4.IntersectionThreePlanes(D3, D4);
	pavil[5] = G5.IntersectionThreePlanes(D4, D5);
	pavil[6] = G6.IntersectionThreePlanes(D5, D6);
	pavil[7] = G7.IntersectionThreePlanes(D6, D7);
	pavil[8] = G8.IntersectionThreePlanes(D7, D8);
	pavil[9] = G9.IntersectionThreePlanes(D8, D9);
	pavil[10] = G10.IntersectionThreePlanes(D9, D10);
	pavil[11] = G11.IntersectionThreePlanes(D10, D11);
	
	// калетта
	pavil[60] = new Point3D(kollet[0], kollet[1], kollet[2]);	

	corr_gd_pav(96, 100, 0);
	corr_gd_pav(100, 104, 1);
	corr_gd_pav(104, 108, 1);
	corr_gd_pav(108, 112, 2);

	corr_gd_pav(112, 116, 2);
	corr_gd_pav(116, 120, 3);
	corr_gd_pav(120, 124, 3);
	corr_gd_pav(124, 128, 4);
	
	corr_gd_pav(128, 132, 4);
	corr_gd_pav(132, 136, 5);
	corr_gd_pav(136, 140, 5);
	corr_gd_pav(140, 144, 6);
	
	corr_gd_pav(144, 148, 6);
	corr_gd_pav(148, 152, 7);
	corr_gd_pav(152, 156, 7);
	corr_gd_pav(156, 160, 8);
	
	corr_gd_pav(160, 164, 8);
	corr_gd_pav(164, 168, 9);
	corr_gd_pav(168, 172, 9);
	corr_gd_pav(172, 176, 10);

	corr_gd_pav(176, 180, 10);
	corr_gd_pav(180, 184, 11);
	corr_gd_pav(184, 188, 11);
	corr_gd_pav(188, 96, 0);

	// В массиве vertices хранятся координаты (x, y, z) всех вершин огранки подряд.
	for(i = 0; i < 48; i++)
	{
		vertices.push(crown[i][0]);
		vertices.push(crown[i][1]);
		vertices.push(crown[i][2]);
	}
	
	for(i = 0; i < 192; i++)
	{
		vertices.push(girdle[i][0]);
		vertices.push(girdle[i][1]);
		vertices.push(girdle[i][2]);
	}
	
	for(i = 0; i < 61; i++)
	{
		vertices.push(pavil[i][0]);
		vertices.push(pavil[i][1]);
		vertices.push(pavil[i][2]);
	}
}	
	
function corr_gd_crown(gd1, gd2, cr)
{
	var planeT = new Plane3D();
	planeT.CreatePlaneThreePoints(girdle[gd1], girdle[gd2], crown[cr]);
	var n = 4; //gd2 - gd1;
	var i = 0;
	for (i = 1; i < n; i++)
	{
		var vert_line = new Line3D(girdle[gd1 + i], girdle[gd1 + i + 96]);
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
		var vert_line = new Line3D(girdle[gd1 + i], girdle[gd1 + i - 96]);
		var pt = vert_line.IntersectionLinePlane(planeT);
		girdle[gd1 + i][2] = pt[2];
	}	
}

function FillGirdle_WavyMultifacet()
{
	var N = 96;
	var p = 0.5;
	var e = waviness;
	var m = 12;

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

function GetTableRadius(pt)
{
    
    var y;

    y = sin ( 90*DEGREE - 4 * (2 * M_PI / 96) );
	ry = pt[1] / y;

	return ry;
}

function FillEllipse (val)
{
	var i;
	var N = 12;

	var del_fi_0 = 2 * M_PI / (N*2);
	var fi_0 = 90*DEGREE - del_fi_0;
	var rx = val * lw;

    var del_fi = 2 * M_PI / N;
    var x, y;

    for (i = 0; i < N; i++ )
    {
        x = Math.cos(fi_0 - i * del_fi);
        y = Math.sin(fi_0 - i * del_fi);
		var pt = new Point2D(rx * x, val * y);
        temp[i] = pt;
    }
}

// Все грани (полигоны) 3D модели огранки обходим против часовой стрелки
// если смотреть на модель находясь от нее снаружи.

var q = 48;
var s = 240;

var index_cut = 
[
    // Площадка

	0, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0,

	// Корона

	// Треугольники около площадки
	0, 1, 13, 0,
	1, 2, 14, 1,
	2, 3, 15, 2,
	3, 4, 16, 3,
	4, 5, 17, 4,
	5, 6, 18, 5,
	6, 7, 19, 6,
	7, 8, 20, 7,
	8, 9, 21, 8,
	9, 10, 22, 9,
	10, 11, 23, 10,
	11, 0, 12, 11,

	// Четырехугольники около площадки
	0, 13, 24, 12, 0,
	1, 14, 25, 13, 1,
	2, 15, 26, 14, 2,
	3, 16, 27, 15, 3,
	4, 17, 28, 16, 4,
	5, 18, 29, 17, 5,
	6, 19, 30, 18, 6,
	7, 20, 31, 19, 7,
	8, 21, 32, 20, 8,
	9, 22, 33, 21, 9,
	10, 23, 34, 22, 10,
	11, 12, 35, 23, 11,

	// Четырехугольники среднего ряда
	12, 24, 36, 35, 12,
	13, 25, 37, 24, 13,
	14, 26, 38, 25, 14,
	15, 27, 39, 26, 15,
	16, 28, 40, 27, 16,
	17, 29, 41, 28, 17,
	18, 30, 42, 29, 18,
	19, 31, 43, 30, 19,
	20, 32, 44, 31, 20,
	21, 33, 45, 32, 21,
	22, 34, 46, 33, 22,
	23, 35, 47, 34, 23,

	// Четырехугольники около рундиста
	24, 37, q+4, 36, 24,
	25, 38, q+12, 37, 25,
	26, 39, q+20, 38, 26,
	27, 40, q+28, 39, 27,
	28, 41, q+36, 40, 28,
	29, 42, q+44, 41, 29,
	30, 43, q+52, 42, 30,
	31, 44, q+60, 43, 31,
	32, 45, q+68, 44, 32,
	33, 46, q+76, 45, 33,
	34, 47, q+84, 46, 34,
	35, 36, q+92, 47, 35,

	// Треугольники около рундиста
	36, q+4, q+3, q+2, q+1, q+0, 36,

	37, q+8, q+7, q+6, q+5, q+4, 37,
	37, q+12, q+11, q+10, q+9, q+8, 37,

	38, q+16, q+15, q+14, q+13, q+12, 38,
	38, q+20, q+19, q+18, q+17, q+16, 38,

	39, q+24, q+23, q+22, q+21, q+20, 39,
	39, q+28, q+27, q+26, q+25, q+24, 39,

	40, q+32, q+31, q+30, q+29, q+28, 40,
	40, q+36, q+35, q+34, q+33, q+32, 40,

	41, q+40, q+39, q+38, q+37, q+36, 41,
	41, q+44, q+43, q+42, q+41, q+40, 41,

	42, q+48, q+47, q+46, q+45, q+44, 42,
	42, q+52, q+51, q+50, q+49, q+48, 42,

	43, q+56, q+55, q+54, q+53, q+52, 43,
	43, q+60, q+59, q+58, q+57, q+56, 43,

	44, q+64, q+63, q+62, q+61, q+60, 44,
	44, q+68, q+67, q+66, q+65, q+64, 44,

	45, q+72, q+71, q+70, q+69, q+68, 45,
	45, q+76, q+75, q+74, q+73, q+72, 45,

	46, q+80, q+79, q+78, q+77, q+76, 46,
	46, q+84, q+83, q+82, q+81, q+80, 46,

	47, q+88, q+87, q+86, q+85, q+84, 47,
	47, q+92, q+91, q+90, q+89, q+88, 47,

	36, q+0, q+95, q+94, q+93, q+92, 36, 

	// Рундист

	q+0, q+1, q+97, q+96, q+0,
	q+1, q+2, q+98, q+97, q+1,
	q+2, q+3, q+99, q+98, q+2,
	q+3, q+4, q+100, q+99, q+3,

	q+4, q+5, q+101, q+100, q+4,
	q+5, q+6, q+102, q+101, q+5,
	q+6, q+7, q+103, q+102, q+6,
	q+7, q+8, q+104, q+103, q+7,

	q+8, q+9, q+105, q+104, q+8,
	q+9, q+10, q+106, q+105, q+9,
	q+10, q+11, q+107, q+106, q+10,
	q+11, q+12, q+108, q+107, q+11,

	q+12, q+13, q+109, q+108, q+12,
	q+13, q+14, q+110, q+109, q+13,
	q+14, q+15, q+111, q+110, q+14,
	q+15, q+16, q+112, q+111, q+15,

	q+16, q+17, q+113, q+112, q+16,
	q+17, q+18, q+114, q+113, q+17,
	q+18, q+19, q+115, q+114, q+18,
	q+19, q+20, q+116, q+115, q+19,

	q+20, q+21, q+117, q+116, q+20,
	q+21, q+22, q+118, q+117, q+21,
	q+22, q+23, q+119, q+118, q+22,
	q+23, q+24, q+120, q+119, q+23,

	q+24, q+25, q+121, q+120, q+24,
	q+25, q+26, q+122, q+121, q+25,
	q+26, q+27, q+123, q+122, q+26,
	q+27, q+28, q+124, q+123, q+27,

	q+28, q+29, q+125, q+124, q+28,
	q+29, q+30, q+126, q+125, q+29,
	q+30, q+31, q+127, q+126, q+30,
	q+31, q+32, q+128, q+127, q+31,

	q+32, q+33, q+129, q+128, q+32,
	q+33, q+34, q+130, q+129, q+33,
	q+34, q+35, q+131, q+130, q+34,
	q+35, q+36, q+132, q+131, q+35,

	q+36, q+37, q+133, q+132, q+36,
	q+37, q+38, q+134, q+133, q+37,
	q+38, q+39, q+135, q+134, q+38,
	q+39, q+40, q+136, q+135, q+39,

	q+40, q+41, q+137, q+136, q+40,
	q+41, q+42, q+138, q+137, q+41,
	q+42, q+43, q+139, q+138, q+42,
	q+43, q+44, q+140, q+139, q+43,

	q+44, q+45, q+141, q+140, q+44,
	q+45, q+46, q+142, q+141, q+45,
	q+46, q+47, q+143, q+142, q+46,
	q+47, q+48, q+144, q+143, q+47,

	q+48, q+49, q+145, q+144, q+48,
	q+49, q+50, q+146, q+145, q+49,
	q+50, q+51, q+147, q+146, q+50,
	q+51, q+52, q+148, q+147, q+51,

	q+52, q+53, q+149, q+148, q+52,
	q+53, q+54, q+150, q+149, q+53,
	q+54, q+55, q+151, q+150, q+54,
	q+55, q+56, q+152, q+151, q+55,

	q+56, q+57, q+153, q+152, q+56,
	q+57, q+58, q+154, q+153, q+57,
	q+58, q+59, q+155, q+154, q+58,
	q+59, q+60, q+156, q+155, q+59,

	q+60, q+61, q+157, q+156, q+60,
	q+61, q+62, q+158, q+157, q+61,
	q+62, q+63, q+159, q+158, q+62,
	q+63, q+64, q+160, q+159, q+63,

	q+64, q+65, q+161, q+160, q+64,
	q+65, q+66, q+162, q+161, q+65,
	q+66, q+67, q+163, q+162, q+66,
	q+67, q+68, q+164, q+163, q+67,

	q+68, q+69, q+165, q+164, q+68,
	q+69, q+70, q+166, q+165, q+69,
	q+70, q+71, q+167, q+166, q+70,
	q+71, q+72, q+168, q+167, q+71,

	q+72, q+73, q+169, q+168, q+72,
	q+73, q+74, q+170, q+169, q+73,
	q+74, q+75, q+171, q+170, q+74,
	q+75, q+76, q+172, q+171, q+75,

	q+76, q+77, q+173, q+172, q+76,
	q+77, q+78, q+174, q+173, q+77,
	q+78, q+79, q+175, q+174, q+78,
	q+79, q+80, q+176, q+175, q+79,

	q+80, q+81, q+177, q+176, q+80,
	q+81, q+82, q+178, q+177, q+81,
	q+82, q+83, q+179, q+178, q+82,
	q+83, q+84, q+180, q+179, q+83,

	q+84, q+85, q+181, q+180, q+84,
	q+85, q+86, q+182, q+181, q+85,
	q+86, q+87, q+183, q+182, q+86,
	q+87, q+88, q+184, q+183, q+87,

	q+88, q+89, q+185, q+184, q+88,
	q+89, q+90, q+186, q+185, q+89,
	q+90, q+91, q+187, q+186, q+90,
	q+91, q+92, q+188, q+187, q+91,

	q+92, q+93, q+189, q+188, q+92,
	q+93, q+94, q+190, q+189, q+93,
	q+94, q+95, q+191, q+190, q+94,
	q+95, q+0,  q+96,  q+191, q+95,

	// Павильон

	// Треугольники около рундиста

	s+0, q+96, q+97, q+98, q+99, q+100, s+0,
	
	s+1, q+100, q+101, q+102, q+103, q+104, s+1,
	s+1, q+104, q+105, q+106, q+107, q+108, s+1,

	s+2, q+108, q+109, q+110, q+111, q+112, s+2,
	s+2, q+112, q+113, q+114, q+115, q+116, s+2,

	s+3, q+116, q+117, q+118, q+119, q+120, s+3,
	s+3, q+120, q+121, q+122, q+123, q+124, s+3,

	s+4, q+124, q+125, q+126, q+127, q+128, s+4,
	s+4, q+128, q+129, q+130, q+131, q+132, s+4,

	s+5, q+132, q+133, q+134, q+135, q+136, s+5,
	s+5, q+136, q+137, q+138, q+139, q+140, s+5,

	s+6, q+140, q+141, q+142, q+143, q+144, s+6,
	s+6, q+144, q+145, q+146, q+147, q+148, s+6,

	s+7, q+148, q+149, q+150, q+151, q+152, s+7,
	s+7, q+152, q+153, q+154, q+155, q+156, s+7,

	s+8, q+156, q+157, q+158, q+159, q+160, s+8,
	s+8, q+160, q+161, q+162, q+163, q+164, s+8,

	s+9, q+164, q+165, q+166, q+167, q+168, s+9,
	s+9, q+168, q+169, q+170, q+171, q+172, s+9,

	s+10, q+172, q+173, q+174, q+175, q+176, s+10,
	s+10, q+176, q+177, q+178, q+179, q+180, s+10,

	s+11, q+180, q+181, q+182, q+183, q+184, s+11,
	s+11, q+184, q+185, q+186, q+187, q+188, s+11,

	s+0, q+188, q+189, q+190, q+191, q+96, s+0,
	
	// Четырехугольники около рундиста
	s+12, s+0, q+100, s+1, s+12,
	s+13, s+1, q+108, s+2, s+13,
	s+14, s+2, q+116, s+3, s+14,
	s+15, s+3, q+124, s+4, s+15,
	s+16, s+4, q+132, s+5, s+16,
	s+17, s+5, q+140, s+6, s+17,
	s+18, s+6, q+148, s+7, s+18,
	s+19, s+7, q+156, s+8, s+19,
	s+20, s+8, q+164, s+9, s+20,
	s+21, s+9, q+172, s+10, s+21,
	s+22, s+10, q+180, s+11, s+22,
	s+23, s+11, q+188, s+0, s+23,

	// Четырехугольники второго ряда
	s+24, s+23, s+0, s+12, s+24,
	s+25, s+12, s+1, s+13, s+25,
	s+26, s+13, s+2, s+14, s+26,
	s+27, s+14, s+3, s+15, s+27,
	s+28, s+15, s+4, s+16, s+28,
	s+29, s+16, s+5, s+17, s+29,
	s+30, s+17, s+6, s+18, s+30,
	s+31, s+18, s+7, s+19, s+31,
	s+32, s+19, s+8, s+20, s+32,
	s+33, s+20, s+9, s+21, s+33,
	s+34, s+21, s+10, s+22, s+34,
	s+35, s+22, s+11, s+23, s+35,

	// Четырехугольники третьего ряда
	s+36, s+24, s+12, s+25, s+36,
	s+37, s+25, s+13, s+26, s+37,
	s+38, s+26, s+14, s+27, s+38,
	s+39, s+27, s+15, s+28, s+39,
	s+40, s+28, s+16, s+29, s+40,
	s+41, s+29, s+17, s+30, s+41,
	s+42, s+30, s+18, s+31, s+42,
	s+43, s+31, s+19, s+32, s+43,
	s+44, s+32, s+20, s+33, s+44,
	s+45, s+33, s+21, s+34, s+45,
	s+46, s+34, s+22, s+35, s+46,
	s+47, s+35, s+23, s+24, s+47,

	// Четырехугольники четвертого ряда
	s+48, s+47, s+24, s+36, s+48,
	s+49, s+36, s+25, s+37, s+49,
	s+50, s+37, s+26, s+38, s+50,
	s+51, s+38, s+27, s+39, s+51,
	s+52, s+39, s+28, s+40, s+52,
	s+53, s+40, s+29, s+41, s+53,
	s+54, s+41, s+30, s+42, s+54,
	s+55, s+42, s+31, s+43, s+55,
	s+56, s+43, s+32, s+44, s+56,
	s+57, s+44, s+33, s+45, s+57,
	s+58, s+45, s+34, s+46, s+58,
	s+59, s+46, s+35, s+47, s+59,

	// Четырехугольники около колеты
	s+60, s+48, s+36, s+49, s+60,
	s+60, s+49, s+37, s+50, s+60,
	s+60, s+50, s+38, s+51, s+60,
	s+60, s+51, s+39, s+52, s+60,
	s+60, s+52, s+40, s+53, s+60,
	s+60, s+53, s+41, s+54, s+60,
	s+60, s+54, s+42, s+55, s+60,
	s+60, s+55, s+43, s+56, s+60,
	s+60, s+56, s+44, s+57, s+60,
	s+60, s+57, s+45, s+58, s+60,
	s+60, s+58, s+46, s+59, s+60,
	s+60, s+59, s+47, s+48, s+60,
	
	// Признак того, что граней больше нет
	-100    	
];
	
function facet_colors()
{
	var i = 0;
	// table
	colors[i] = new THREE.Color("rgb(100, 100, 130)");
	
	for (i = 1; i < 13; i++)
	{
		colors[i] = new THREE.Color("rgb(150, 160, 220)"); // 1
	}	
	
	for (i = 13; i < 25; i++)
	{
		
		colors[i] = new THREE.Color("rgb(70, 70, 90)"); // 2
	}

	for (i = 25; i < 37; i++)
	{
		colors[i] = new THREE.Color("rgb(150, 150, 180)"); // 3
	}	
	
	for (i = 37; i < 49; i++)
	{
		colors[i] = new THREE.Color("rgb(170, 160, 220)");  // 4
	}
	
	for (i = 49; i < 73; i++)
	{
		colors[i] = new THREE.Color("rgb(70, 110, 100)"); i++;
		colors[i] = new THREE.Color("rgb(50, 90, 120)"); 
	}
	
	//  GIRDLE
	for (i = 73; i < 169; i++)
	{
		colors[i] = new THREE.Color("rgb(100, 100, 140)"); i++;
		colors[i] = new THREE.Color("rgb(120, 120, 150)");
	}
	
	for (i = 169; i < 193; i++)
	{
		colors[i] = new THREE.Color("rgb(50, 50, 70)"); i++
		colors[i] = new THREE.Color("rgb(80, 80, 100)");		
	}
	

	for (i = 193; i < 205; i++)
	{
		colors[i] = new THREE.Color("rgb(90, 90, 120)");
	}	
	
	for (i = 205; i < 217; i++)
	{
		colors[i] = new THREE.Color("rgb(110, 110, 150)");
	}	
	
	for (i = 217; i < 229; i++)
	{
		colors[i] = new THREE.Color("rgb(30, 30, 120)");
	}	
	
	for (i = 229; i < 241; i++)
	{
		colors[i] = new THREE.Color("rgb(110, 40, 180)");
	}
	
	for (i = 241; i < 253; i++)
	{
		colors[i] = new THREE.Color("rgb(150, 150, 180)"); i++
		colors[i] = new THREE.Color("rgb(190, 190, 220)");
	}		
};


