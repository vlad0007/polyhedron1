var DEGREE = 0.01745329251994; // значение одного углового градуса
var PERCENT = 0.01;
var SQRT2 = 1.41421356237309504880


// СДМ - структура данных модели
var lw = 1.0; // отношение длины огранки к ее ширине
// Рундист
var r = 0.04; // толщина рундиста
var square_deviation = 0.00001; // квадратичность рундиста
// Корона
var hCrown = 0.2;
var beta = 40*DEGREE; // угол наклона граней короны D0 - D15 
var t = 0.54; // ширина площадки
var hCrownDn = 0.055; // высота вершин 48, 49, 50, ... 63 короны
var hCrownMid = 0.06; // высота вершин 32, 33, 34, ... 47 короны
var hCrownUp = 0.115; // высота вершин 16, 17, 18, ... 31 короны
// Павильон
var hp = 0.58; // глубина павильона
var hPavFacet = 0.52; // задает глубину вершин 32, 33, ... 47 павильона
var ang_pav_main = 45*DEGREE; // угол наклона граней D0, D1, ... D15 павильона
var hPavUp = 0.12; // задает глубину вершин 0, 1, ... 15 павильона
var ang_pav_up = 56*DEGREE; // угол наклона граней F0, F1, ... F15 павильона

var girdle = [256];
var table = [16];
var crown = [];
var pavil = [];	
var vertices = [];

// Расчет координат вершин огранки (модели).
function VerticesCalculation()
{
	var i;
	var Z1 = new Vector3D(0, 0, 1);
	
	InitGirdle();	
	
	Fill_Table_Sunburst();
	
	for (i = 0; i < 16; i++)
	{
		crown[i] = table[i];
	}

	// A0
	var upPoint_A = new Point3D(0, 0, r/2 + hCrown + (t/2) * Math.tan(beta));
	var a0 = new Vector3D(upPoint_A[0] - table[0][0], upPoint_A[1] - table[0][1], upPoint_A[2] - table[0][2]);
	var b0 = new Vector3D(girdle[124][0] - girdle[4][0], girdle[124][1] - girdle[4][1], 0);
	var vec_A0 = a0.Cross(b0); 
	vec_A0.Normer();
	var A0 = new Plane3D(); 
	A0.CreatePlaneNormalVectorPoint(vec_A0, table[0]);

	// A1
	var a1 = new Vector3D(upPoint_A[0] - table[1][0], upPoint_A[1] - table[1][1], upPoint_A[2] - table[1][2]);
	var b1 = new Vector3D(girdle[4][0] - girdle[12][0], girdle[4][1] - girdle[12][1], 0);
	var vec_A1 = a1.Cross(b1); 
	vec_A1.Normer();
	var A1 = new Plane3D(); 
	A1.CreatePlaneNormalVectorPoint(vec_A1, table[1]);	
	
	// A2	
	var a2 = new Vector3D(upPoint_A[0] - table[2][0], upPoint_A[1] - table[2][1], upPoint_A[2] - table[2][2]);
	var b2 = new Vector3D(girdle[12][0] - girdle[20][0], girdle[12][1] - girdle[20][1], 0);
	var vec_A2 = a2.Cross(b2); 
	vec_A2.Normer();
	var A2 = new Plane3D(); 
	A2.CreatePlaneNormalVectorPoint(vec_A2, table[2]);		
	
	// A3
	var a3 = new Vector3D(upPoint_A[0] - table[3][0], upPoint_A[1] - table[3][1], upPoint_A[2] - table[3][2]);
	var b3 = new Vector3D(girdle[20][0] - girdle[28][0], girdle[20][1] - girdle[28][1], 0);
	var vec_A3 = a3.Cross(b3); 
	vec_A3.Normer();
	var A3 = new Plane3D(); 
	A3.CreatePlaneNormalVectorPoint(vec_A3, table[3]);	
	
	// A4
	var a4 = new Vector3D(upPoint_A[0] - table[4][0], upPoint_A[1] - table[4][1], upPoint_A[2] - table[4][2]);
	var b4 = new Vector3D(girdle[28][0] - girdle[28][0], girdle[36][1] - girdle[28][1], 0);
	var vec_A4 = a4.Cross(b4); 
	vec_A4.Normer();
	var A4 = new Plane3D(); 
	A4.CreatePlaneNormalVectorPoint(vec_A4, table[4]);	
	
	var pl_hor_up = new Plane3D();
	pl_hor_up.CreatePlaneNormalDistOXYZ(Z1, hCrownUp + r/2);
	
	crown[16] = pl_hor_up.IntersectionThreePlanes(A0, A1);
	crown[17] = pl_hor_up.IntersectionThreePlanes(A1, A2);
	crown[18] = pl_hor_up.IntersectionThreePlanes(A2, A3);
	crown[19] = pl_hor_up.IntersectionThreePlanes(A3, A4);	
	
	crown[20] = new Point3D(crown[19][0], -crown[19][1], crown[19][2]);
	crown[21] = new Point3D(crown[18][0], -crown[18][1], crown[18][2]);
	crown[22] = new Point3D(crown[17][0], -crown[17][1], crown[17][2]);
	crown[23] = new Point3D(crown[16][0], -crown[16][1], crown[16][2]);
	crown[24] = new Point3D(-crown[23][0], crown[23][1], crown[23][2]);
	crown[25] = new Point3D(-crown[22][0], crown[22][1], crown[22][2]);
	
	crown[26] = new Point3D(-crown[21][0], crown[21][1], crown[21][2]);
	crown[27] = new Point3D(-crown[20][0], crown[20][1], crown[20][2]);
	crown[28] = new Point3D(-crown[19][0], crown[19][1], crown[19][2]);
	
	crown[29] = new Point3D(-crown[18][0], crown[18][1], crown[18][2]);
	crown[30] = new Point3D(-crown[17][0], crown[17][1], crown[17][2]);
	crown[31] = new Point3D(-crown[16][0], crown[16][1], crown[16][2]);

	var pt000 = new Point3D(0,0,0);
	var pt001 = new Point3D(0,0,1);
	
	var pl_g0 = new Plane3D(); 
	pl_g0.CreatePlaneThreePoints(pt000, pt001, girdle[0]);	
	var pl_g8 = new Plane3D(); 
	pl_g8.CreatePlaneThreePoints(pt000, pt001, girdle[8]);
	var pl_g16 = new Plane3D(); 
	pl_g16.CreatePlaneThreePoints(pt000, pt001, girdle[16]);
	var pl_g24 = new Plane3D(); 
	pl_g24.CreatePlaneThreePoints(pt000, pt001, girdle[24]);	
	var pl_g32 = new Plane3D(); 
	pl_g32.CreatePlaneThreePoints(pt000, pt001, girdle[32]);

	var pl_hor_mid = new Plane3D();
	pl_hor_mid.CreatePlaneNormalDistOXYZ(Z1, hCrownMid + r/2);

	crown[32] = pl_hor_mid.IntersectionThreePlanes(pl_g0, A0);
	crown[33] = pl_hor_mid.IntersectionThreePlanes(pl_g8, A1);
	crown[34] = pl_hor_mid.IntersectionThreePlanes(pl_g16, A2);
	crown[35] = pl_hor_mid.IntersectionThreePlanes(pl_g24, A3);
	crown[36] = pl_hor_mid.IntersectionThreePlanes(pl_g32, A4);
	
	
	crown[37] = new Point3D(crown[35][0], -crown[35][1], crown[35][2]);
	crown[38] = new Point3D(crown[34][0], -crown[34][1], crown[34][2]);
	crown[39] = new Point3D(crown[33][0], -crown[33][1], crown[33][2]);
	crown[40] = new Point3D(crown[32][0], -crown[32][1], crown[32][2]);
	crown[41] = new Point3D(-crown[39][0], crown[39][1], crown[39][2]);
	crown[42] = new Point3D(-crown[38][0], crown[38][1], crown[38][2]);
	crown[43] = new Point3D(-crown[37][0], crown[37][1], crown[37][2]);
	crown[44] = new Point3D(-crown[36][0], crown[36][1], crown[36][2]);
	crown[45] = new Point3D(-crown[35][0], crown[35][1], crown[35][2]);
	crown[46] = new Point3D(-crown[34][0], crown[34][1], crown[34][2]);
	crown[47] = new Point3D(-crown[33][0], crown[33][1], crown[33][2]);

	var C0_2 = new Plane3D(); 
	C0_2.CreatePlaneThreePoints(crown[16], crown[32], girdle[0]);
	var C1_1 = new Plane3D(); 
	C1_1.CreatePlaneThreePoints(crown[16], crown[33], girdle[8]);
	var C1_2 = new Plane3D(); 
	C1_2.CreatePlaneThreePoints(crown[17], crown[33], girdle[8]);
	var C2_1 = new Plane3D(); 
	C2_1.CreatePlaneThreePoints(crown[17], crown[34], girdle[16]);
	var C2_2 = new Plane3D(); 
	C2_2.CreatePlaneThreePoints(crown[18], crown[34], girdle[16]);
	var C3_1 = new Plane3D(); 
	C3_1.CreatePlaneThreePoints(crown[18], crown[35], girdle[24]);
	var C3_2 = new Plane3D(); 
	C3_2.CreatePlaneThreePoints(crown[19], crown[35], girdle[24]);
	var C4_1 = new Plane3D(); 
	C4_1.CreatePlaneThreePoints(crown[19], crown[36], girdle[32]);
	
	// Плоскость определяющая высоту треугольных граней примыкающих к рундисту
	var pl_hor_dn = new Plane3D();
	pl_hor_dn.CreatePlaneNormalDistOXYZ(Z1, hCrownDn + r/2);
	
	crown[48] = pl_hor_dn.IntersectionThreePlanes(C0_2, C1_1);
	crown[49] = pl_hor_dn.IntersectionThreePlanes(C1_2, C2_1);
	crown[50] = pl_hor_dn.IntersectionThreePlanes(C2_2, C3_1);
	crown[51] = pl_hor_dn.IntersectionThreePlanes(C3_2, C4_1);
	
	crown[52] = new Point3D(crown[51][0], -crown[51][1], crown[51][2]);
	crown[53] = new Point3D(crown[50][0], -crown[50][1], crown[50][2]);
	crown[54] = new Point3D(crown[49][0], -crown[49][1], crown[49][2]);
	crown[55] = new Point3D(crown[48][0], -crown[48][1], crown[48][2]);
	crown[56] = new Point3D(-crown[55][0], crown[55][1], crown[55][2]);
	crown[57] = new Point3D(-crown[54][0], crown[54][1], crown[54][2]);
	crown[58] = new Point3D(-crown[53][0], crown[53][1], crown[53][2]);
	crown[59] = new Point3D(-crown[52][0], crown[52][1], crown[52][2]);
	crown[60] = new Point3D(-crown[51][0], crown[51][1], crown[51][2]);
	crown[61] = new Point3D(-crown[50][0], crown[50][1], crown[50][2]);
	crown[62] = new Point3D(-crown[49][0], crown[49][1], crown[49][2]);
	crown[63] = new Point3D(-crown[48][0], crown[48][1], crown[48][2]);

	corr_gd_crown(0, 8, 48);
	corr_gd_crown(8, 16, 49);
	corr_gd_crown(16, 24, 50);
	corr_gd_crown(24, 32, 51);
	
	corr_gd_crown(32, 40, 52);
	corr_gd_crown(40, 48, 53);
	corr_gd_crown(48, 56, 54);
	corr_gd_crown(56, 64, 55);	
	
	corr_gd_crown(64, 72, 56);
	corr_gd_crown(72, 80, 57);
	corr_gd_crown(80, 88, 58);
	corr_gd_crown(88, 96, 59);

	corr_gd_crown(96, 104, 60);
	corr_gd_crown(104, 112, 61);
	corr_gd_crown(112, 120, 62);
	corr_gd_crown(120, 0, 63);

	/////////////////////////////////////////////////
	//            Конструируем павильон            //
	/////////////////////////////////////////////////

	var kollet = new Point3D(0, 0, - hp - r/2);

	var D0 = new Plane3D();
	D0.CreateInclinePlane(-ang_pav_main, girdle[252], girdle[132], kollet);
	var D1 = new Plane3D();
	D1.CreateInclinePlane(-ang_pav_main, girdle[132], girdle[140], kollet);
	var D2 = new Plane3D();
	D2.CreateInclinePlane(-ang_pav_main, girdle[140], girdle[148], kollet);
	var D3 = new Plane3D();
	D3.CreateInclinePlane(-ang_pav_main, girdle[148], girdle[156], kollet);
	var D4 = new Plane3D();
	D4.CreateInclinePlane(-ang_pav_main, girdle[156], girdle[164], kollet);

	var pl_pav_facet = new Plane3D();
	pl_pav_facet.CreatePlaneNormalDistOXYZ(Z1, - hPavFacet * hp - r/2);

	// Находим вершины павильона рядом с калетой
	pavil[32] = pl_pav_facet.IntersectionThreePlanes(D0, D1);
	pavil[33] = pl_pav_facet.IntersectionThreePlanes(D1, D2);
	pavil[34] = pl_pav_facet.IntersectionThreePlanes(D2, D3);
	pavil[35] = pl_pav_facet.IntersectionThreePlanes(D3, D4);

	pavil[36] = new Point3D(pavil[35][0], -pavil[35][1], pavil[35][2]);
	pavil[37] = new Point3D(pavil[34][0], -pavil[34][1], pavil[34][2]);
	pavil[38] = new Point3D(pavil[33][0], -pavil[33][1], pavil[33][2]);
	pavil[39] = new Point3D(pavil[32][0], -pavil[32][1], pavil[32][2]);
	pavil[40] = new Point3D(-pavil[39][0], pavil[39][1], pavil[39][2]);
	pavil[41] = new Point3D(-pavil[38][0], pavil[38][1], pavil[38][2]);
	pavil[42] = new Point3D(-pavil[37][0], pavil[37][1], pavil[37][2]);
	pavil[43] = new Point3D(-pavil[36][0], pavil[36][1], pavil[36][2]);
	pavil[44] = new Point3D(-pavil[35][0], pavil[35][1], pavil[35][2]);
	pavil[45] = new Point3D(-pavil[34][0], pavil[34][1], pavil[34][2]);
	pavil[46] = new Point3D(-pavil[33][0], pavil[33][1], pavil[33][2]);
	pavil[47] = new Point3D(-pavil[32][0], pavil[32][1], pavil[32][2]);

	// Находим вершины на глубине hPavUp
	var F0 = new Plane3D();
	F0.CreateInclinePlane(-ang_pav_up, girdle[128], girdle[136], girdle[136]);
	var F1 = new Plane3D();
	F1.CreateInclinePlane(-ang_pav_up, girdle[136], girdle[144], girdle[144]);
	var F2 = new Plane3D();
	F2.CreateInclinePlane(-ang_pav_up, girdle[144], girdle[152], girdle[152]);
	var F3 = new Plane3D();
	F3.CreateInclinePlane(-ang_pav_up, girdle[152], girdle[160], girdle[160]);

	var pl_pav_up = new Plane3D();
	pl_pav_up.CreatePlaneNormalDistOXYZ(Z1, - hPavUp - r/2);

	var pl_g132 = new Plane3D();
	pl_g132.CreatePlaneThreePoints(new Point3D(0,0,0), kollet, girdle[132]);
	var pl_g140 = new Plane3D();
	pl_g140.CreatePlaneThreePoints(new Point3D(0,0,0), kollet, girdle[140]);
	var pl_g148 = new Plane3D();
	pl_g148.CreatePlaneThreePoints(new Point3D(0,0,0), kollet, girdle[148]);
	var pl_g156 = new Plane3D();
	pl_g156.CreatePlaneThreePoints(new Point3D(0,0,0), kollet, girdle[156]);

	pavil[0] = pl_pav_up.IntersectionThreePlanes(F0, pl_g132);
	pavil[1] = pl_pav_up.IntersectionThreePlanes(F1, pl_g140);
	pavil[2] = pl_pav_up.IntersectionThreePlanes(F2, pl_g148);
	pavil[3] = pl_pav_up.IntersectionThreePlanes(F3, pl_g156);

	pavil[4]  = new Point3D(pavil[3][0], -pavil[3][1], pavil[3][2]);
	pavil[15] = new Point3D(-pavil[0][0], pavil[0][1], pavil[0][2]);

	var E0_1 = new Plane3D();
	E0_1.CreatePlaneThreePoints(girdle[128], pavil[47], pavil[15]);
	var E0_2 = new Plane3D();
	E0_2.CreatePlaneThreePoints(girdle[128], pavil[32], pavil[0]);
	
	var E1_1 = new Plane3D();	
	E1_1.CreatePlaneThreePoints(girdle[136], pavil[32], pavil[0]);
	var E1_2 = new Plane3D();
	E1_2.CreatePlaneThreePoints(girdle[136], pavil[33], pavil[1]);
	
	var E2_1 = new Plane3D();	
	E2_1.CreatePlaneThreePoints(girdle[144], pavil[33], pavil[1]);
	var E2_2 = new Plane3D();
	E2_2.CreatePlaneThreePoints(girdle[144], pavil[34], pavil[2]);
	
	var E3_1 = new Plane3D();	
	E3_1.CreatePlaneThreePoints(girdle[152], pavil[34], pavil[2]);
	var E3_2 = new Plane3D();
	E3_2.CreatePlaneThreePoints(girdle[152], pavil[35], pavil[3]);
	
	var E4_1 = new Plane3D();	
	E4_1.CreatePlaneThreePoints(girdle[160], pavil[35], pavil[3]);
	var E4_2 = new Plane3D();
	E4_2.CreatePlaneThreePoints(girdle[160], pavil[36], pavil[4]);

	pavil[16] = D0.IntersectionThreePlanes(E0_1, E0_2);
	pavil[17] = D1.IntersectionThreePlanes(E1_1, E1_2);
	pavil[18] = D2.IntersectionThreePlanes(E2_1, E2_2);
	pavil[19] = D3.IntersectionThreePlanes(E3_1, E3_2);
	pavil[20] = D4.IntersectionThreePlanes(E4_1, E4_2);

	pavil[21] = new Point3D(pavil[19][0], -pavil[19][1], pavil[19][2]);
	pavil[22] = new Point3D(pavil[18][0], -pavil[18][1], pavil[18][2]);
	pavil[23] = new Point3D(pavil[17][0], -pavil[17][1], pavil[17][2]);
	pavil[24] = new Point3D(pavil[16][0], -pavil[16][1], pavil[16][2]);
	pavil[25] = new Point3D(-pavil[23][0], pavil[23][1], pavil[23][2]);
	pavil[26] = new Point3D(-pavil[22][0], pavil[22][1], pavil[22][2]);
	pavil[27] = new Point3D(-pavil[21][0], pavil[21][1], pavil[21][2]);
	pavil[28] = new Point3D(-pavil[20][0], pavil[20][1], pavil[20][2]);
	pavil[29] = new Point3D(-pavil[19][0], pavil[19][1], pavil[19][2]);
	pavil[30] = new Point3D(-pavil[18][0], pavil[18][1], pavil[18][2]);
	pavil[31] = new Point3D(-pavil[17][0], pavil[17][1], pavil[17][2]);

	////////////////////////////
	
	pavil[4] = new Point3D(pavil[3][0], -pavil[3][1], pavil[3][2]);
	pavil[5] = new Point3D(pavil[2][0], -pavil[2][1], pavil[2][2]);
	pavil[6] = new Point3D(pavil[1][0], -pavil[1][1], pavil[1][2]);
	pavil[7] = new Point3D(pavil[0][0], -pavil[0][1], pavil[0][2]);
	pavil[8] = new Point3D(-pavil[7][0], pavil[7][1], pavil[7][2]);
	pavil[9] = new Point3D(-pavil[6][0], pavil[6][1], pavil[6][2]);
	pavil[10] = new Point3D(-pavil[5][0], pavil[5][1], pavil[5][2]);
	pavil[11] = new Point3D(-pavil[4][0], pavil[4][1], pavil[4][2]);
	pavil[12] = new Point3D(-pavil[3][0], pavil[3][1], pavil[3][2]);
	pavil[13] = new Point3D(-pavil[2][0], pavil[2][1], pavil[2][2]);
	pavil[14] = new Point3D(-pavil[1][0], pavil[1][1], pavil[1][2]);
	pavil[15] = new Point3D(-pavil[0][0], pavil[0][1], pavil[0][2]);
	
	pavil[48] = new Point3D(kollet[0], kollet[1], kollet[2]);

	corr_gd_pav(128, 136, 0);
	corr_gd_pav(136, 144, 1);
	corr_gd_pav(144, 152, 2);
	corr_gd_pav(152, 160, 3);
	
	corr_gd_pav(160, 168, 4);
	corr_gd_pav(168, 176, 5);
	corr_gd_pav(176, 184, 6);
	corr_gd_pav(184, 192, 7);
	
	corr_gd_pav(192, 200, 8);
	corr_gd_pav(200, 208, 9);
	corr_gd_pav(208, 216, 10);
	corr_gd_pav(216, 224, 11);
	
	corr_gd_pav(224, 232, 12);
	corr_gd_pav(232, 240, 13);
	corr_gd_pav(240, 248, 14);
	corr_gd_pav(248, 128, 15);
	

	// В массиве vertices хранятся координаты (x, y, z) всех вершин огранки подряд.
	for(i = 0; i < 64; i++)
	{
		vertices.push(crown[i][0]);
		vertices.push(crown[i][1]);
		vertices.push(crown[i][2]);
	}
	for(i = 0; i < 256; i++)
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

	var zzz = 10;
}



// Расчет вершин рундиста (girdle - рундист).
// Рундист является суперэллипсом разбитым на 64 части.
function InitGirdle()
{
	var N = 128;
	var fi_0 = -90*DEGREE;
	var r1 = 0.5 * lw; // Полуось эллипса по оси X
	var r2 = -0.5;          // Полуось эллипса по оси Y

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
		var point = new Point3D ( r1 * w * x,   r2 * w * y, r/2);
		girdle[i] = point;
	}
	for (i = 0; i < N; i++)
	{
		girdle[i + N] = new Point3D ( girdle[i][0], girdle[i][1], -r/2);
	}
}

function Fill_Table_Sunburst()
{
	var N = 16;
	var fi_0 = -90*DEGREE;
	var r1 = (t/2) * lw; // Полуось эллипса по оси X
	var r2 = -t/2;          // Полуось эллипса по оси Y

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
		var point = new Point3D ( r1 * w * x,   r2 * w * y, hCrown + r/2);
		table[i] = point;
	}
}

function corr_gd_crown(gd1, gd2, cr)
{
	var planeT = new Plane3D();
	planeT.CreatePlaneThreePoints(girdle[gd1], girdle[gd2], crown[cr]);
	var n = 8; //gd2 - gd1;
	var i = 0;
	for (i = 1; i < n; i++)
	{
		var vert_line = new Line3D(girdle[gd1 + i], girdle[gd1 + i + 128]);
		var pt = vert_line.IntersectionLinePlane(planeT);
		girdle[gd1 + i][2] = pt[2];
	}
}

function corr_gd_pav(gd1, gd2, pav)
{
	var planeT = new Plane3D();
	planeT.CreatePlaneThreePoints(girdle[gd1], girdle[gd2], pavil[pav]);
	var n = 8; //gd2 - gd1;
	var i;
	for (i = 1; i < n; i++)
	{
		var vert_line = new Line3D(girdle[gd1 + i], girdle[gd1 + i - 128]);
		var pt = vert_line.IntersectionLinePlane(planeT);
		girdle[gd1 + i][2] = pt[2];
	}	
}

// Все грани (полигоны) 3D модели огранки обходим против часовой стрелки
// если смотреть на модель находясь от нее снаружи.
	var index_cut = [
	// Площадка
	0, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0,

	// треугольники
	0, 1, 16, 0,
	1, 2, 17, 1,
	2, 3, 18, 2,
	3, 4, 19, 3,
	4, 5, 20, 4,
	5, 6, 21, 5,
	6, 7, 22, 6,
	7, 8, 23, 7,
	8, 9, 24, 8,
	9, 10, 25, 9,
	10, 11, 26, 10,
	11, 12, 27, 11,
	12, 13, 28, 12,
	13, 14, 29, 13,
	14, 15, 30, 14,
	15, 0, 31, 15,

	// Главные четырехугольники
	0, 16, 32, 31, 0,
	1, 17, 33, 16, 1,
	2, 18, 34, 17, 2,
	3, 19, 35, 18, 3,
	4, 20, 36, 19, 4,
	5, 21, 37, 20, 5,
	6, 22, 38, 21, 6,
	7, 23, 39, 22, 7,
	8, 24, 40, 23, 8,
	9, 25, 41, 24, 9,
	10, 26, 42, 25, 10,
	11, 27, 43, 26, 11,
	12, 28, 44, 27, 12,
	13, 29, 45, 28, 13,
	14, 30, 46, 29, 14,
	15, 31, 47, 30, 15,

	// Нижние четырехугольники
	32, 16, 48, 64, 32,
	16, 33, 72, 48, 16,
	33, 17, 49, 72, 33,
	17, 34, 80, 49, 17,
	34, 18, 50, 80, 34,
	18, 35, 88, 50, 18,
	35, 19, 51, 88, 35,
	19, 36, 96, 51, 19,
	36, 20, 52, 96, 36,
	20, 37, 104, 52, 20,
	37, 21, 53, 104, 37,
	21, 38, 112, 53, 21,
	38, 22, 54, 112, 38,
	22, 39, 120, 54, 22,
	39, 23, 55, 120, 39,
	23, 40, 128, 55, 23,
	40, 24, 56, 128, 40,
	24, 41, 136, 56, 24,
	41, 25, 57, 136, 41,
	25, 42, 144, 57, 25,
	42, 26, 58, 144, 42,
	26, 43, 152, 58, 26,
	43, 27, 59, 152, 43,
	27, 44, 160, 59, 27,
	44, 28, 60, 160, 44,
	28, 45, 168, 60, 28,
	45, 29, 61, 168, 45,
	29, 46, 176, 61, 29,
	46, 30, 62, 176, 46,
	30, 47, 184, 62, 30,
	47, 31, 63, 184, 47,
	31, 32, 64, 63, 31,

	// Треугольники примыкающие к рундисту со стороны короны

	48, 72, 71, 70, 69, 68, 67, 66, 65, 64, 48,
	49, 80, 79, 78, 77, 76, 75, 74, 73, 72, 49,
	50, 88, 87, 86, 85, 84, 83, 82, 81, 80, 50,
	51, 96, 95, 94, 93, 92, 91, 90, 89, 88, 51,

	52, 104, 103, 102, 101, 100, 99, 98, 97, 96, 52,
	53, 112, 111, 110, 109, 108, 107, 106, 105, 104, 53,
	54, 120, 119, 118, 117, 116, 115, 114, 113, 112, 54,
	55, 128, 127, 126, 125, 124, 123, 122, 121, 120, 55,

	56, 136, 135, 134, 133, 132, 131, 130, 129, 128, 56,
	57, 144, 143, 142, 141, 140, 139, 138, 137, 136, 57,
	58, 152, 151, 150, 149, 148, 147, 146, 145, 144, 58,
	59, 160, 159, 158, 157, 156, 155, 154, 153, 152, 59,

	60, 168, 167, 166, 165, 164, 163, 162, 161, 160, 60,
	61, 176, 175, 174, 173, 172, 171, 170, 169, 168, 61,
	62, 184, 183, 182, 181, 180, 179, 178, 177, 176, 62,
	63, 64, 191, 190, 189, 188, 187, 186, 185, 184, 63,

	// Рундист

	64, 65, 193, 192, 64,
	65, 66, 194, 193, 65,
	66, 67, 195, 194, 66,
	67, 68, 196, 195, 67,

	68, 69, 197, 196, 68,
	69, 70, 198, 197, 69,
	70, 71, 199, 198, 70,
	71, 72, 200, 199, 71,

	72, 73, 201, 200, 72,
	73, 74, 202, 201, 73,
	74, 75, 203, 202, 74,
	75, 76, 204, 203, 75,

	76, 77, 205, 204, 76,
	77, 78, 206, 205, 77,
	78, 79, 207, 206, 78,
	79, 80, 208, 207, 79,

	80, 81, 209, 208, 80,
	81, 82, 210, 209, 81,
	82, 83, 211, 210, 82,
	83, 84, 212, 211, 83,

	84, 85, 213, 212, 84,
	85, 86, 214, 213, 85,
	86, 87, 215, 214, 86,
	87, 88, 216, 215, 87,

	88, 89, 217, 216, 88,
	89, 90, 218, 217, 89,
	90, 91, 219, 218, 90,
	91, 92, 220, 219, 91,

	92, 93, 221, 220, 92,
	93, 94, 222, 221, 93,
	94, 95, 223, 222, 94,
	95, 96, 224, 223, 95,

	96, 97, 225, 224, 96,
	97, 98, 226, 225, 97,
	98, 99, 227, 226, 98,
	99, 100, 228, 227, 99,

	100, 101, 229, 228, 100,
	101, 102, 230, 229, 101,
	102, 103, 231, 230, 102,
	103, 104, 232, 231, 103,

	104, 105, 233, 232, 104,
	105, 106, 234, 233, 105,
	106, 107, 235, 234, 106,
	107, 108, 236, 235, 107,

	108, 109, 237, 236, 108,
	109, 110, 238, 237, 109,
	110, 111, 239, 238, 110,
	111, 112, 240, 239, 111,

	112, 113, 241, 240, 112,
	113, 114, 242, 241, 113,
	114, 115, 243, 242, 114,
	115, 116, 244, 243, 115,

	116, 117, 245, 244, 116,
	117, 118, 246, 245, 117,
	118, 119, 247, 246, 118,
	119, 120, 248, 247, 119,

	120, 121, 249, 248, 120,
	121, 122, 250, 249, 121,
	122, 123, 251, 250, 122,
	123, 124, 252, 251, 123,

	124, 125, 253, 252, 124,
	125, 126, 254, 253, 125,
	126, 127, 255, 254, 126,
	127, 128, 256, 255, 127,

	128, 129, 257, 256, 128,
	129, 130, 258, 257, 129,
	130, 131, 259, 258, 130,
	131, 132, 260, 259, 131,

	132, 133, 261, 260, 132,
	133, 134, 262, 261, 133,
	134, 135, 263, 262, 134,
	135, 136, 264, 263, 135,

	136, 137, 265, 264, 136,
	137, 138, 266, 265, 137,
	138, 139, 267, 266, 138,
	139, 140, 268, 267, 139,

	140, 141, 269, 268, 140,
	141, 142, 270, 269, 141,
	142, 143, 271, 270, 142,
	143, 144, 272, 271, 143,

	144, 145, 273, 272, 144,
	145, 146, 274, 273, 145,
	146, 147, 275, 274, 146,
	147, 148, 276, 275, 147,

	148, 149, 277, 276, 148,
	149, 150, 278, 277, 149,
	150, 151, 279, 278, 150,
	151, 152, 280, 279, 151,

	152, 153, 281, 280, 152,
	153, 154, 282, 281, 153,
	154, 155, 283, 282, 154,
	155, 156, 284, 283, 155,

	156, 157, 285, 284, 156,
	157, 158, 286, 285, 157,
	158, 159, 287, 286, 158,
	159, 160, 288, 287, 159,

	160, 161, 289, 288, 160,
	161, 162, 290, 289, 161,
	162, 163, 291, 290, 162,
	163, 164, 292, 291, 163,

	164, 165, 293, 292, 164,
	165, 166, 294, 293, 165,
	166, 167, 295, 294, 166,
	167, 168, 296, 295, 167,

	168, 169, 297, 296, 168,
	169, 170, 298, 297, 169,
	170, 171, 299, 298, 170,
	171, 172, 300, 299, 171,

	172, 173, 301, 300, 172,
	173, 174, 302, 301, 173,
	174, 175, 303, 302, 174,
	175, 176, 304, 303, 175,

	176, 177, 305, 304, 176,
	177, 178, 306, 305, 177,
	178, 179, 307, 306, 178,
	179, 180, 308, 307, 179,

	180, 181, 309, 308, 180,
	181, 182, 310, 309, 181,
	182, 183, 311, 310, 182,
	183, 184, 312, 311, 183,

	184, 185, 313, 312, 184,
	185, 186, 314, 313, 185,
	186, 187, 315, 314, 186,
	187, 188, 316, 315, 187,

	188, 189, 317, 316, 188,
	189, 190, 318, 317, 189,
	190, 191, 319, 318, 190,
	191, 64, 192, 319, 191,

	// Павильон

	// Треугольники

	320, 192, 193, 194, 195, 196, 197, 198, 199, 200, 320,
	321, 200, 201, 202, 203, 204, 205, 206, 207, 208, 321,
	322, 208, 209, 210, 211, 212, 213, 214, 215, 216, 322,
	323, 216, 217, 218, 219, 220, 221, 222, 223, 224, 323,

	324, 224, 225, 226, 227, 228, 229, 230, 231, 232, 324,
	325, 232, 233, 234, 235, 236, 237, 238, 239, 240, 325,
	326, 240, 241, 242, 243, 244, 245, 246, 247, 248, 326,
	327, 248, 249, 250, 251, 252, 253, 254, 255, 256, 327,

	328, 256, 257, 258, 259, 260, 261, 262, 263, 264, 328,
	329, 264, 265, 266, 267, 268, 269, 270, 271, 272, 329,
	330, 272, 273, 274, 275, 276, 277, 278, 279, 280, 330,
	331, 280, 281, 282, 283, 284, 285, 286, 287, 288, 331,

	332, 288, 289, 290, 291, 292, 293, 294, 295, 296, 332,
	333, 296, 297, 298, 299, 300, 301, 302, 303, 304, 333,
	334, 304, 305, 306, 307, 308, 309, 310, 311, 312, 334,
	335, 312, 313, 314, 315, 316, 317, 318, 319, 192, 335,

	//
	352, 336, 192, 320, 352,
	352, 320, 200, 337, 352,

	353, 337, 200, 321, 353,
	353, 321, 208, 338, 353,

	354, 338, 208, 322, 354,
	354, 322, 216, 339, 354,

	355, 339, 216, 323, 355,
	355, 323, 224, 340, 355,

	356, 340, 224, 324, 356,
	356, 324, 232, 341, 356,

	357, 341, 232, 325, 357,
	357, 325, 240, 342, 357,

	358, 342, 240, 326, 358,
	358, 326, 248, 343, 358,

	359, 343, 248, 327, 359,
	359, 327, 256, 344, 359,

	360, 344, 256, 328, 360,
	360, 328, 264, 345, 360,

	361, 345, 264, 329, 361,
	361, 329, 272, 346, 361,

	362, 346, 272, 330, 362,
	362, 330, 280, 347, 362,

	363, 347, 280, 331, 363,
	363, 331, 288, 348, 363,

	364, 348, 288, 332, 364,
	364, 332, 296, 349, 364,

	365, 349, 296, 333, 365,
	365, 333, 304, 350, 365,

	366, 350, 304, 334, 366,
	366, 334, 312, 351, 366,

	367, 351, 312, 335, 367,
	367, 335, 192, 336, 367,

	//
	368, 367, 336, 352, 368,
	368, 352, 337, 353, 368,
	368, 353, 338, 354, 368,
	368, 354, 339, 355, 368,
	368, 355, 340, 356, 368,
	368, 356, 341, 357, 368,
	368, 357, 342, 358, 368,
	368, 358, 343, 359, 368,
	368, 359, 344, 360, 368,
	368, 360, 345, 361, 368,
	368, 361, 346, 362, 368,
	368, 362, 347, 363, 368,
	368, 363, 348, 364, 368,
	368, 364, 349, 365, 368,
	368, 365, 350, 366, 368,
	368, 366, 351, 367, 368,
		
		// Признак того, что граней больше нет
		-100      
	];

function facet_colors()
{
	var i = 0;
	
	// table
	//colors[i] = new THREE.Color("rgb(120, 120, 120)");
	colors[i] = new THREE.Color("rgb(150, 150, 100)");
	
	// crown
	for (i = 1; i < 17 ; i++)
	{
		//colors[i] = new THREE.Color("rgb(150, 150, 250)");
		colors[i] = new THREE.Color("rgb(180, 180, 180)");
	}	
	
	for (i = 17; i < 33; i++)
	{
		//colors[i] = new THREE.Color("rgb(100, 100, 250)");
		colors[i] = new THREE.Color("rgb(140, 140, 140)");
	}

	for (i = 33; i < 65; i++)
	{
		//colors[i] = new THREE.Color("rgb(100, 170, 250)");
		//i++;
		//colors[i] = new THREE.Color("rgb(150, 170, 250)");
		colors[i] = new THREE.Color("rgb(170, 170, 170)");
		i++;
		colors[i] = new THREE.Color("rgb(150, 150, 150)");
	}	
	
	for (i = 65; i < 81; i++)
	{
		colors[i] = new THREE.Color("rgb(200, 200, 180)");
	}
	
	// girdle
	for (i = 81; i < 209; i++)
	{
		colors[i] = new THREE.Color("rgb(170, 170, 250)");
		i++;
		colors[i] = new THREE.Color("rgb(200, 200, 250)");		
	}

	// pavilion
	for (i = 209; i < 225; i++)
	{
		colors[i] = new THREE.Color("rgb(200, 200, 180)");
	}	
	
	for (i = 225; i < 257; i++)
	{
		//colors[i] = new THREE.Color("rgb(100, 170, 250)");
		//i++;
		//colors[i] = new THREE.Color("rgb(150, 170, 250)");
		colors[i] = new THREE.Color("rgb(100, 100, 100)");
		i++;
		colors[i] = new THREE.Color("rgb(130, 130, 130)");
	}	

	for (i = 257; i < 273; i++)
	{
		//colors[i] = new THREE.Color("rgb(100, 170, 200)");
		//i++;
		//colors[i] = new THREE.Color("rgb(150, 170, 200)");
		colors[i] = new THREE.Color("rgb(160, 160, 160)");
		i++;
		colors[i] = new THREE.Color("rgb(180, 180, 180)");
	}
};

