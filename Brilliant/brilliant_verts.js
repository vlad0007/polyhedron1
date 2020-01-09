var DEGREE = 0.01745329251994; // значение одного углового градуса
var PERCENT = 0.01;
var SQRT2 = 1.41421356237309504880

// СДМ - структура данных модели
var lw = 1.0;      			// отношение длины огранки к ее ширине
// Рундист
var r = 0.04;       		// толщина рундиста
var square_deviation = 0.0001; // квадратичность рундиста
// Корона
var beta = 30*DEGREE;//0.67831821947314540;//   34.5*DEGREE;    	// угол короны
var t = 0.57;				// размер площадки
var dSquare = 0.0001; 
// Павильон
var alpha = 50*DEGREE;   // угол павильона
var hPavFacet = 0.60; 		// глубина нижних вершин фасет павильона
// Калетта
var culet = 8*PERCENT;// Размер калетты
var culet_R = 0.00001; // Смещение калетты в процентах от диаметра
var culet_A = 0*DEGREE; // Направление (азимут) смещения калетты
// Азимуты
var low_az = 11.25*DEGREE;	// Азимут граней павильона
var up_az = 11.25*DEGREE;	// Азимут граней короны		

var girdle = [64];
var vertices = [];

var star_facets = 0.5;

// Расчет координат вершин огранки (модели).
function VerticesCalculation()
{

	InitGirdle(64);
	
	var crown = [];
	var pavil = [];	
	
    // Вспомогательные переменные и объекты
	var Z0 = new Vector3D(0,0,1);	// Единичный вертикально расположенный ветор.
	var norm2d = new Vector2D;
	var normPlaneVector = new Vector3D();
	var i;

	// Конструируем корону
	var r_tan_beta = 0.5 * Math.tan (beta); // beta - угол наклона граней короны
    var H1 = r/2;	// уровень верхней части рундиста
    var H2 = -r/2;	// уровень нижней части рундиста
	// точки короны пропорциональны точкам рундиста относительно upPoint (это следует
	// из предположения, что все грани пересекаются в одной точке)
	var upPoint = new Point3D(0.0, 0.0, H1 + r_tan_beta);

    for ( i = 0; i < 8; i++ )
    {
        var dir = new Vector3D(	girdle[i*8][0] - upPoint[0], 
								girdle[i*8][1] - upPoint[1], 
								girdle[i*8][2] - upPoint[2]);
		// Вектор dir нельзя нормировать !
		var pt = new Point3D(upPoint[0] + t * dir[0], upPoint[1] + t * dir[1], upPoint[2] + t * dir[2]);
		crown[i] = pt;
    }
	var angle = 0.01745329251994 * 34.5;
	var angle_1 = 34.5 * DEGREE;
	var hhh = 100;

	//  Находим точки пересечения основных граней  
	// короны между собой на уровне рундиста.
	
	// Сначала создание прямых касательных к рундисту
	var line = [];
	var dir = new Vector2D(girdle[1][0] - girdle[63][0], girdle[1][1] - girdle[63][1] );
	dir.Normer();
	var pt = new Point2D(girdle[0][0], girdle[0][1]);
	var ln = new Line2D();
	ln.CreateLineVectorPoint(dir, pt);
	line[0] = ln;
	
	for ( i = 1; i < 8; i++ ) 
	{
		var dir = new Vector2D(girdle[i*8+1][0] - girdle[i*8-1][0], girdle[i*8+1][1] - girdle[i*8-1][1]);
		dir.Normer();
		var pt = new Point2D(girdle[i*8][0], girdle[i*8][1]);
		var ln = new Line2D();
		line[i] = ln;
		ln.CreateLineVectorPoint(dir, pt);	// касательные к линии рундиста
	}
	
	// Точки пересечения предыдущих касательных между собой
	var g2 = [];
    for ( i = 0; i < 8; i++ )
	{
		var pt = line[i].IntersectionTwoLines(line[(i+1)%8]);
		g2[i] = pt;
	}
	
    // Точки звезды (вершины короны) пропорциональны  точкам g2 относительно upPoint
	// Коэффициент пропорциональности m находим по следующей формуле
    var m = (1 + SQRT2) / 2 * t;
    if ( dSquare <= 0 ) 
		m = m + dSquare * (m - 1 + t);
    else 
		m = m + dSquare * (1-m);
    // Координаты вершин звезды
    for ( i = 0; i < 8; i++ )
    {
		var dir = new Vector3D( g2[i][0] - upPoint[0], g2[i][1] - upPoint[1], H1 - upPoint[2] );
		var pt = new Point3D( upPoint[0] + m * dir[0], upPoint[1] + m * dir[1], upPoint[2] + m * dir[2] );
		crown[i+8] = pt;
    }
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Вставка для расчета параметра Star facets
	
	var line_cr0_cr1 = new Line2D(new Point2D(crown[0][0], crown[0][1]), new Point2D(crown[1][0], crown[1][1]));
	var pt_cr8 = new Point2D(crown[8][0], crown[8][1]);
	var pt_g4 = new Point2D(girdle[4][0], girdle[4][1]);
	var d1 = line_cr0_cr1.Distance(pt_cr8);
	var d2 = line_cr0_cr1.Distance(pt_g4);	
	star_facets = d1 / d2;
	
	///////////////////////////////////////////////////////////////////////////////////////////////////////////

	//////////////////////////////////////////////////////////////////////
	// Установка азимутов нижних клиньев короны.
	
	// Строим вектор по направлению равному заданному азимуту up_az
	var vec_crown_1 = new Vector3D(-Math.tan(up_az), -1.0, 0.0);
	vec_crown_1.Normer();
	
	// Строим еще один вспомогательный вектор, имеющей такое же
	// направление, что и направление ребра проходящего 
	// через вершину 10 короны и вершину рундиста 16.
	var vec_crown_2 = new Vector3D(
									crown[10][0] - girdle[16][0], 
									crown[10][1] - girdle[16][1], 
									crown[10][2] - girdle[16][2]);	
	vec_crown_2.Normer();
	
	// Находим вектор перпендикулярный векторам vec_crown_1 и vec_crown_2
	var vec_norm = vec_crown_1.Cross(vec_crown_2);
	vec_norm.Normer();
	
	// Создаем плоскость в которой лежит грань C2 короны с заданным азимутом
	var plane = new Plane3D();
	plane.CreatePlaneNormalVectorPoint(vec_norm, girdle[16]);
	
	// Создаем вертикальную прямую проходящую через вершину 20 рундиста
	var line_crown = new Line3D();
	line_crown.CreateLineVectorPoint(Z0, girdle[20]);
	
	// Точка пересечения 
	var point = line_crown.IntersectionLinePlane(plane);
	
	// Разница между старой и новой высотой вершины 20 рундиста
	var del = -(girdle[20][2] - point[2]);
	
	// Корректируем высоты вершин рундиста 4, 12, 20, 28, 36, 44, 52 и 60
	for (i = 4; i < 64; i = i + 8)
	{
		girdle[i][2] = girdle[i][2] + del;
	}

	///////////////////////////////////////////////////////////////////////////////////

	girdle[1] = corr_gd_crown(girdle[0], girdle[4], girdle[1], girdle[1+64], crown[8]);
	girdle[2] = corr_gd_crown(girdle[0], girdle[4], girdle[2], girdle[2+64], crown[8]);
	girdle[3] = corr_gd_crown(girdle[0], girdle[4], girdle[3], girdle[3+64], crown[8]);
	
	girdle[5] = corr_gd_crown(girdle[4], girdle[8], girdle[5], girdle[5+64], crown[8]);
	girdle[6] = corr_gd_crown(girdle[4], girdle[8], girdle[6], girdle[6+64], crown[8]);
	girdle[7] = corr_gd_crown(girdle[4], girdle[8], girdle[7], girdle[7+64], crown[8]);
	
	girdle[9] = corr_gd_crown(girdle[8], girdle[12], girdle[9], girdle[9+64], crown[9]);
	girdle[10] = corr_gd_crown(girdle[8], girdle[12], girdle[10], girdle[10+64], crown[9]);
	girdle[11] = corr_gd_crown(girdle[8], girdle[12], girdle[11], girdle[11+64], crown[9]);	
	
	girdle[13] = corr_gd_crown(girdle[12], girdle[16], girdle[13], girdle[13+64], crown[9]);
	girdle[14] = corr_gd_crown(girdle[12], girdle[16], girdle[14], girdle[14+64], crown[9]);
	girdle[15] = corr_gd_crown(girdle[12], girdle[16], girdle[15], girdle[15+64], crown[9]);	
	
	for (i = 1; i < 16; i++)
	{
		girdle[16+i][2] = girdle[16-i][2];
		girdle[48-i][2] = girdle[16-i][2];
		girdle[48+i][2] = girdle[16-i][2];
	}
	
	/////////////////////////////////////////////////
	//            Конструируем павильон            //
	/////////////////////////////////////////////////
	var hp = Math.tan(alpha) * (1-culet) / 2;
	var kollet = new Point3D(); // Это точка в которй сходятся все
     // все 8 плоскостей в которых лежат главные грани павильона
	kollet[0] = culet_R * Math.cos(culet_A);
	kollet[1] = culet_R * Math.sin(-culet_A);
	kollet[2] = - (Math.tan(alpha)/2) - r/2;

	//  Находим точки пересечения основных граней  
	// павильона между собой на уровне рундиста.
	// На самом деле это те же самые точки из массива g2,
	// которые мы определили при построении короны.
	// Поэтому при построении короны воспользуемся значениями 
	// из этого массива.
    for (i = 0; i < 8; i++)
    {
        var dir = new Vector3D(kollet[0] - g2[i][0], kollet[1] - g2[i][1], kollet[2] + r/2);
		
		var pav1 = new Point3D(kollet[0] - (1 - hPavFacet) * dir[0], 
								kollet[1] - (1 - hPavFacet) * dir[1],
								kollet[2] - (1 - hPavFacet) * dir[2]);
		pavil[i] = pav1;
		
		var pav2 = new Point3D(kollet[0] - culet * dir[0], 
								kollet[1] - culet * dir[1], 
								kollet[2] - culet * dir[2])
		pavil[8+i] = pav2;
	}
	
	
	// Установка азимутов клиньев павильона.
	// Действия при установке подобны действиям выполняемым
	// при установке азимутов клиньев короны.	
	
	// Строим вектор по направлению равному заданному азимуту low_az
	var vec_pav_1 = new Vector3D(-Math.tan(low_az), -1.0, 0.0);
	vec_pav_1.Normer();
	
	// Строим еще один вспомогательный вектор, имеющей такое же
	// направление, что и направление ребра проходящего 
	// через вершину 2 павильона и вершину рундиста 80 (16+64).
	var vec_pav_2 = new Vector3D(
									pavil[2][0] - girdle[16+64][0], 
									pavil[2][1] - girdle[16+64][1], 
									pavil[2][2] - girdle[16+64][2]);	
	vec_pav_2.Normer();
	
	// Находим вектор перпендикулярный векторам vec_pav_1 и vec_pav_2
	var vec_normal = vec_pav_1.Cross(vec_pav_2);
	vec_normal.Normer();	

	var plane_pav = new Plane3D();
	plane_pav.CreatePlaneNormalVectorPoint(vec_normal, girdle[16+64]);
	
	// Создаем вертикальную прямую проходящую через вершину 20 рундиста
	var line_pav = new Line3D();
	line_pav.CreateLineVectorPoint(Z0, girdle[20]);
	
	// Точка пересечения 
	point = line_pav.IntersectionLinePlane(plane_pav);	
	
	del = -(girdle[20+64][2] - point[2]);
	for (i = 4; i < 64; i = i + 8)
	{
		girdle[i+64][2] = girdle[i+64][2] + del;
	}	
	
	// Первый квадрант -  1
	girdle[1+64] = corr_gd_pav(girdle[0+64], girdle[4+64], girdle[1], girdle[1+64], pavil[0]);
	girdle[2+64] = corr_gd_pav(girdle[0+64], girdle[4+64], girdle[2], girdle[2+64], pavil[0]);
	girdle[3+64] = corr_gd_pav(girdle[0+64], girdle[4+64], girdle[3], girdle[3+64], pavil[0]);	
	// Первый квадрант -  2
	girdle[5+64] = corr_gd_pav(girdle[68], girdle[72], girdle[5], girdle[5+64], pavil[0]);
	girdle[6+64] = corr_gd_pav(girdle[68], girdle[72], girdle[6], girdle[6+64], pavil[0]);
	girdle[7+64] = corr_gd_pav(girdle[68], girdle[72], girdle[7], girdle[7+64], pavil[0]);	
	// Первый квадрант -  3
	girdle[9+64] = corr_gd_pav(girdle[72], girdle[76], girdle[9], girdle[9+64], pavil[1]);
	girdle[10+64] = corr_gd_pav(girdle[72], girdle[76], girdle[10], girdle[10+64], pavil[1]);
	girdle[11+64] = corr_gd_pav(girdle[72], girdle[76], girdle[11], girdle[11+64], pavil[1]);
	// Первый квадрант -  4
	girdle[13+64] = corr_gd_pav(girdle[76], girdle[80], girdle[13], girdle[13+64], pavil[1]);
	girdle[14+64] = corr_gd_pav(girdle[76], girdle[80], girdle[14], girdle[14+64], pavil[1]);
	girdle[15+64] = corr_gd_pav(girdle[76], girdle[80], girdle[15], girdle[15+64], pavil[1]);	
	
	// Второй квадрант -  1
	girdle[17+64] = corr_gd_pav(girdle[80], girdle[84], girdle[17], girdle[17+64], pavil[2]);
	girdle[18+64] = corr_gd_pav(girdle[80], girdle[84], girdle[18], girdle[18+64], pavil[2]);
	girdle[19+64] = corr_gd_pav(girdle[80], girdle[84], girdle[19], girdle[19+64], pavil[2]);
	// Второй квадрант -  2
	girdle[21+64] = corr_gd_pav(girdle[84], girdle[88], girdle[21], girdle[21+64], pavil[2]);
	girdle[22+64] = corr_gd_pav(girdle[84], girdle[88], girdle[22], girdle[22+64], pavil[2]);
	girdle[23+64] = corr_gd_pav(girdle[84], girdle[88], girdle[23], girdle[23+64], pavil[2]);	
	// Второй квадрант -  3
	girdle[25+64] = corr_gd_pav(girdle[88], girdle[92], girdle[25], girdle[25+64], pavil[3]);
	girdle[26+64] = corr_gd_pav(girdle[88], girdle[92], girdle[26], girdle[26+64], pavil[3]);
	girdle[27+64] = corr_gd_pav(girdle[88], girdle[92], girdle[27], girdle[27+64], pavil[3]);	
	// Второй квадрант -  4
	girdle[29+64] = corr_gd_pav(girdle[92], girdle[96], girdle[29], girdle[29+64], pavil[3]);
	girdle[30+64] = corr_gd_pav(girdle[92], girdle[96], girdle[30], girdle[30+64], pavil[3]);
	girdle[31+64] = corr_gd_pav(girdle[92], girdle[96], girdle[31], girdle[31+64], pavil[3]);		
	
	// Третий квадрант -  1
	girdle[33+64] = corr_gd_pav(girdle[96], girdle[100], girdle[33], girdle[33+64], pavil[4]);
	girdle[34+64] = corr_gd_pav(girdle[96], girdle[100], girdle[34], girdle[34+64], pavil[4]);
	girdle[35+64] = corr_gd_pav(girdle[96], girdle[100], girdle[35], girdle[35+64], pavil[4]);
	// Третий квадрант -  2
	girdle[37+64] = corr_gd_pav(girdle[100], girdle[104], girdle[37], girdle[37+64], pavil[4]);
	girdle[38+64] = corr_gd_pav(girdle[100], girdle[104], girdle[38], girdle[38+64], pavil[4]);
	girdle[39+64] = corr_gd_pav(girdle[100], girdle[104], girdle[39], girdle[39+64], pavil[4]);
	// Третий квадрант -  3
	girdle[41+64] = corr_gd_pav(girdle[104], girdle[108], girdle[41], girdle[41+64], pavil[5]);
	girdle[42+64] = corr_gd_pav(girdle[104], girdle[108], girdle[42], girdle[42+64], pavil[5]);
	girdle[43+64] = corr_gd_pav(girdle[104], girdle[108], girdle[43], girdle[43+64], pavil[5]);
	// Третий квадрант -  4
	girdle[45+64] = corr_gd_pav(girdle[108], girdle[112], girdle[45], girdle[45+64], pavil[5]);
	girdle[46+64] = corr_gd_pav(girdle[108], girdle[112], girdle[46], girdle[46+64], pavil[5]);
	girdle[47+64] = corr_gd_pav(girdle[108], girdle[112], girdle[47], girdle[47+64], pavil[5]);
	
	// Четвертый квадрант -  1
	girdle[49+64] = corr_gd_pav(girdle[112], girdle[116], girdle[49], girdle[49+64], pavil[6]);
	girdle[50+64] = corr_gd_pav(girdle[112], girdle[116], girdle[50], girdle[50+64], pavil[6]);
	girdle[51+64] = corr_gd_pav(girdle[112], girdle[116], girdle[51], girdle[51+64], pavil[6]);
	// Четвертый квадрант -  2
	girdle[53+64] = corr_gd_pav(girdle[116], girdle[120], girdle[53], girdle[53+64], pavil[6]);
	girdle[54+64] = corr_gd_pav(girdle[116], girdle[120], girdle[54], girdle[54+64], pavil[6]);
	girdle[55+64] = corr_gd_pav(girdle[116], girdle[120], girdle[55], girdle[55+64], pavil[6]);
	// Четвертый квадрант -  3
	girdle[57+64] = corr_gd_pav(girdle[120], girdle[124], girdle[57], girdle[57+64], pavil[7]);
	girdle[58+64] = corr_gd_pav(girdle[120], girdle[124], girdle[58], girdle[58+64], pavil[7]);
	girdle[59+64] = corr_gd_pav(girdle[120], girdle[124], girdle[59], girdle[59+64], pavil[7]);
	// Четвертый квадрант -  3
	girdle[61+64] = corr_gd_pav(girdle[124], girdle[64], girdle[61], girdle[61+64], pavil[7]);
	girdle[62+64] = corr_gd_pav(girdle[124], girdle[64], girdle[62], girdle[62+64], pavil[7]);
	girdle[63+64] = corr_gd_pav(girdle[124], girdle[64], girdle[63], girdle[63+64], pavil[7]);
	
	// В массиве vertices хранятся координаты (x, y, z) всех вершин огранки подряд.
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
	
	for(i = 0; i < 16; i++)
	{
		vertices.push(pavil[i][0]);
		vertices.push(pavil[i][1]);
		vertices.push(pavil[i][2]);
	}	
}

// Функция находит точку пересечения вертикальной прямой (ребро рундиста)
// с наклонной плоскостью planeT, в которой лежит соответствующая грань короны.
function corr_gd_crown(gd1, gd2, gd3, gd4, cr)
{
	var planeT = new Plane3D();
	planeT.CreatePlaneThreePoints(gd1, gd2, cr);
	var vert_line = new Line3D(gd3, gd4);
	var pt = vert_line.IntersectionLinePlane(planeT);
	return pt;
}

// Функция находит точку пересечения вертикальной прямой (ребро рундиста)
// с наклонной плоскостью planeT, в которой лежит соответствующая грань павильона.
function corr_gd_pav(gd1, gd2, gd3, gd4, pav)
{
	var planeT = new Plane3D();
	planeT.CreatePlaneThreePoints(gd1, gd2, pav);
	var vert_line = new Line3D(gd3, gd4);
	var pt = vert_line.IntersectionLinePlane(planeT);
	return pt;
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

// Все грани (полигоны) 3D модели огранки обходим против часовой стрелки
// если смотреть на модель находясь от нее снаружи.
	var index_cut = [
	// Площадка 
	0,7,6,5,4,3,2,1,0,
	// грани звезды
	0,1,8,0,
	1,2,9,1,
	2,3,10,2,
	3,4,11,3,
	4,5,12,4,
	5,6,13,5,
	6,7,14,6,
	7,0,15,7,
	// грани короны
	0,8,16,15,0,
	1,9,24,8,1,
	2,10,32,9,2,
	3,11,40,10,3,
	4,12,48,11,4,
	5,13,56,12,5,
	6,14,64,13,6,
	7,15,72,14,7,
	// нижние грани короны
	8,20,19,18,17,16,8,
	8,24,23,22,21,20,8,
	9,28,27,26,25,24,9,
	9,32,31,30,29,28,9,
	10,36,35,34,33,32,10,
	10,40,39,38,37,36,10,
	11,44,43,42,41,40,11,
	11,48,47,46,45,44,11,
	12,52,51,50,49,48,12,
	12,56,55,54,53,52,12,
	13,60,59,58,57,56,13,
	13,64,63,62,61,60,13,
	14,68,67,66,65,64,14,
	14,72,71,70,69,68,14,
	15,76,75,74,73,72,15,
	15,16,79,78,77,76,15,
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
	// Павильон
	144, 80, 81, 82, 83, 84, 144,
	144, 84, 85, 86, 87, 88, 144,
	145, 88, 89, 90, 91, 92, 145,
	145, 92, 93, 94, 95, 96, 145,
	146, 96, 97, 98, 99, 100, 146,
	146, 100, 101, 102, 103, 104, 146,
	147, 104, 105, 106, 107, 108, 147,
	147, 108, 109, 110, 111, 112, 147,
	148, 112, 113, 114, 115, 116, 148,
	148, 116, 117, 118, 119, 120, 148,
	149, 120, 121, 122, 123, 124, 149,
	149, 124, 125, 126, 127, 128, 149,
	150, 128, 129, 130, 131, 132, 150,
	150, 132, 133, 134, 135, 136, 150,
	151, 136, 137, 138, 139, 140, 151,
	151, 140, 141, 142, 143, 80, 151,
	159, 151, 80, 144, 152, 159,
	152, 144, 88, 145, 153, 152,
	153, 145, 96, 146, 154, 153,
	154, 146, 104, 147, 155, 154,
	155, 147, 112, 148, 156, 155,
	156, 148, 120, 149, 157, 156,
	157, 149, 128, 150, 158, 157,
	158, 150, 136, 151, 159, 158,
	152, 153, 154, 155, 156, 157, 158, 159, 152,
		
		// Признак того, что граней больше нет
		-100      
	];

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
	for (i = 0; i < 8; i++)
	{
		colors[ind] = new THREE.Color("rgb(170, 170, 250)"); ind++;
		colors[ind] = new THREE.Color("rgb(200, 200, 250)"); ind++;
	}	
	
	//  GIRDLE
	for (i = 0; i < 32; i++)
	{
		colors[ind] = new THREE.Color("rgb(100, 100, 100)");
		ind++;
		colors[ind] = new THREE.Color("rgb(150, 150, 150)");
		ind++;
	}
	
	// pavilion upper facets
	for (i = 0; i < 8; i++)
	{
		colors[ind] = new THREE.Color("rgb(170, 170, 250)");
		ind++;
		colors[ind] = new THREE.Color("rgb(200, 200, 250)");		
		ind++;
	}

	// pavilion facets
	for (i = 0; i < 4; i++)
	{
		colors[ind] = new THREE.Color("rgb(100, 100, 250)");
		ind++;
		colors[ind] = new THREE.Color("rgb(120, 120, 250)");
		ind++;
	}	
	
	// culet
	colors[ind] = new THREE.Color("rgb(180, 180, 180)");
};

