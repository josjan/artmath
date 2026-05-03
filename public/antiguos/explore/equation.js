var click = false
var clip_p = new Array([0,0],[0,0],[0,0])
var sol_poly = new Array()
var sol_linear = new Array()

function init_newton(evt)
{
	x1 = 150
	x2 = 300
	x_deb = -8
	solu = -4
	delta = 2
	ap = svgdoc.getElementById("a")
	p1 = svgdoc.getElementById("p1")
	p3 = svgdoc.getElementById("p3")
	deb = svgdoc.getElementById("deb")
	debl = svgdoc.getElementById("debline")
	tangente = svgdoc.getElementById("sec")
	sol = svgdoc.getElementById("sol")
	ecart = svgdoc.getElementById("ecart")
	f_x = svgdoc.getElementById("f_x")
	quadra = svgdoc.getElementById("quadra")
	debut = true
	clip_quadra(0.004,0.004,-0.37,-0.412,4.533)
	newton_calcul()
}

function newton_move(evt)
{
	if (click)
		{
			xm = coordo_x(evt.clientX)
			if (xm < 25 ) xm = 25
			if (xm > 675 ) xm = 675
			x1 = xm
			debut = true
			newton_calcul()
		}
}

function derive_calcul(x)
{
	var y = 0.016 * x * x * x + 0.012 * x * x - 0.74 * x - 0.412 	
	return y
}

function newton_solve(final,increment)
{
	if ((final)||(debut))
	{
		p3.setAttributeNS(null,"cx",x1)
		p3.setAttributeNS(null,"cy",350 - 25 * func_calcul((x1 - 350) / 25))
		u = derive_calcul((x1 - 350) / 25)
		v = - 1
		w = func_calcul((x1 - 350) / 25) - x_deb * u
		clip_line(u,v,w)
		tangente.setAttributeNS(null,"x1",clip_p[0][0] * 25 + 350)
		tangente.setAttributeNS(null,"x2",clip_p[1][0] * 25 + 350)
		tangente.setAttributeNS(null,"y1",350 - clip_p[0][1] * 25)
		tangente.setAttributeNS(null,"y2",350 - clip_p[1][1] * 25)
		debl.setAttributeNS(null,"x1",x1)
		debl.setAttributeNS(null,"x2",x1)
		if (u != 0)
			solu = ( x_deb * u - func_calcul(x_deb) ) / u
		delta = Math.abs(func_calcul(solu))
		x_d = x_deb
		sol_temp = solu
		delta_temp = delta
		deb.firstChild.data = x_deb
		sol.firstChild.data = solu
		f_x.firstChild.data = delta
		stepByStep = false
		debut = false
	}
	if (!final)
		stepByStep = true
	timer = increment
	solve_newton_detail()
}

function solve_newton_detail()
{
	if (delta_temp < 0.001)
	{
		if (Math.abs(func_calcul(sol_temp)) > 0.01)
			sol.firstChild.data = "no solution from A"
		f_x.firstChild.data = parseFloat(func_calcul(sol_temp))
		debut = true
		return
	}

	u = derive_calcul(x_d)
	v = - 1
	w = func_calcul(x_d) - x_d * u
	clip_line(u,v,w)
	tangente.setAttributeNS(null,"x1",clip_p[0][0] * 25 + 350)
	tangente.setAttributeNS(null,"x2",clip_p[1][0] * 25 + 350)
	tangente.setAttributeNS(null,"y1",350 - clip_p[0][1] * 25)
	tangente.setAttributeNS(null,"y2",350 - clip_p[1][1] * 25)
	if (u != 0)
		sol_temp = ( x_d * u - func_calcul(x_d) ) / u
	x_d = sol_temp
	delta_temp = Math.abs(func_calcul(sol_temp))
	deb.firstChild.data = x_d
	sol.firstChild.data = sol_temp
	f_x.firstChild.data = delta_temp
	p3.setAttributeNS(null,"cx",350 + 25 * x_d)
	p3.setAttributeNS(null,"cy",350 - 25 * func_calcul(x_d))
	debl.setAttributeNS(null,"x1",350 + 25 * x_d)
	debl.setAttributeNS(null,"x2",350 + 25 * x_d)

	if (!stepByStep)
		setTimeout("solve_newton_detail()",timer)
}

function newton_calcul()
{
	p1.setAttributeNS(null,"cx",x1)
	p3.setAttributeNS(null,"cx",x1)
	p3.setAttributeNS(null,"cy",350 - 25 * func_calcul((x1 - 350) / 25))
	x_deb = parseInt(4 * (x1 - 350)) / 100
	u = derive_calcul(x_deb)
	v = - 1
	w = func_calcul(x_deb) - x_deb * u
	clip_line(u,v,w)
	tangente.setAttributeNS(null,"x1",clip_p[0][0] * 25 + 350)
	tangente.setAttributeNS(null,"x2",clip_p[1][0] * 25 + 350)
	tangente.setAttributeNS(null,"y1",350 - clip_p[0][1] * 25)
	tangente.setAttributeNS(null,"y2",350 - clip_p[1][1] * 25)
	debl.setAttributeNS(null,"x1",x1)
	debl.setAttributeNS(null,"x2",x1)
	ap.setAttributeNS(null,"x",x1)
	if (u != 0)
		solu = ( x_deb * u - func_calcul(x_deb) ) / u
	delta = Math.abs(func_calcul(solu))
	deb.firstChild.data = x_deb
	sol.firstChild.data = solu
	f_x.firstChild.data = delta
}


function init_secante(evt)
{
	x1 = 150
	x2 = 300
	x_deb = -8
	x_fin = -2
	solu = -4
	delta = 2
	ap = svgdoc.getElementById("a")
	bp = svgdoc.getElementById("b")
	p1 = svgdoc.getElementById("p1")
	p2 = svgdoc.getElementById("p2")
	p3 = svgdoc.getElementById("p3")
	p4 = svgdoc.getElementById("p4")
	deb = svgdoc.getElementById("deb")
	fin = svgdoc.getElementById("fin")
	debl = svgdoc.getElementById("debline")
	finl = svgdoc.getElementById("finline")
	secante = svgdoc.getElementById("sec")
	sol = svgdoc.getElementById("sol")
	ecart = svgdoc.getElementById("ecart")
	f_x = svgdoc.getElementById("f_x")
	quadra = svgdoc.getElementById("quadra")
	debut = true
	clip_quadra(0.004,0.004,-0.37,-0.412,4.533)
	secante_calcul()
}

function secante_move(evt)
{
	if (click)
		{
			xm = coordo_x(evt.clientX)
			cible = evt.target.getAttributeNS(null,"id")
			if (xm < 25 ) xm = 25
			if (xm > 675 ) xm = 675
			if (cible == "p1")
				x1 = xm
			if (cible == "p2")
				x2 = xm
			debut = true
			secante_calcul()
		}
}

function secante_solve(final,increment)
{
	if ((final)||(debut))
	{
		p3.setAttributeNS(null,"cx",x1)
		p3.setAttributeNS(null,"cy",350 - 25 * func_calcul((x1 - 350) / 25))
		p4.setAttributeNS(null,"cx",x2)
		p4.setAttributeNS(null,"cy",350 - 25 * func_calcul((x2 - 350) / 25))
		secante.setAttributeNS(null,"x1",x1)
		secante.setAttributeNS(null,"y1",350 - 25 * func_calcul((x1 - 350) / 25))
		secante.setAttributeNS(null,"x2",x2)
		secante.setAttributeNS(null,"y2",350 - 25 * func_calcul((x2 - 350) / 25))
		debl.setAttributeNS(null,"x1",x1)
		debl.setAttributeNS(null,"x2",x1)
		finl.setAttributeNS(null,"x1",x2)
		finl.setAttributeNS(null,"x2",x2)
		x_d = x_deb
		x_f = x_fin
		sol_temp = solu
		delta_temp = delta
		deb.firstChild.data = x_deb
		fin.firstChild.data = x_fin
		sol.firstChild.data = solu
		ecart.firstChild.data = delta
		f_x.firstChild.data = " "
		stepByStep = false
		debut = false
	}
	if (!final)
		stepByStep = true
	timer = increment
	solve_secante_detail()
}

function solve_secante_detail()
{
	if (delta_temp < 0.001)
	{
		if (Math.abs(func_calcul(sol_temp)) > 0.01)
			sol.firstChild.data = "no solution on [AB]"
		f_x.firstChild.data = parseFloat(func_calcul(sol_temp))
		debut = true
		return
	}
	sol_temp = x_d - func_calcul(x_d) * (x_f - x_d) / (func_calcul(x_f) - func_calcul(x_d))
	if (func_calcul(x_d) * func_calcul(sol_temp) < 0 )
		x_f = sol_temp
	else
		x_d = sol_temp
	delta_temp = Math.abs(x_d - x_f) / 2
	deb.firstChild.data = x_d
	fin.firstChild.data = x_f
	sol.firstChild.data = sol_temp
	ecart.firstChild.data = delta_temp
	p3.setAttributeNS(null,"cx",350 + 25 * x_d)
	p3.setAttributeNS(null,"cy",350 - 25 * func_calcul(x_d))
	p4.setAttributeNS(null,"cx",350 + 25 * x_f)
	p4.setAttributeNS(null,"cy",350 - 25 * func_calcul(x_f))
	secante.setAttributeNS(null,"x1",350 + 25 * x_d)
	secante.setAttributeNS(null,"y1",350 - 25 * func_calcul(x_d))
	secante.setAttributeNS(null,"x2",350 + 25 * x_f)
	secante.setAttributeNS(null,"y2",350 - 25 * func_calcul(x_f))
	debl.setAttributeNS(null,"x1",350 + 25 * x_d)
	debl.setAttributeNS(null,"x2",350 + 25 * x_d)
	finl.setAttributeNS(null,"x1",350 + 25 * x_f)
	finl.setAttributeNS(null,"x2",350 + 25 * x_f)
	
	if (!stepByStep)
		setTimeout("solve_secante_detail()",timer)
}

function secante_calcul()
{
	p1.setAttributeNS(null,"cx",x1)
	p2.setAttributeNS(null,"cx",x2)
	p3.setAttributeNS(null,"cx",x1)
	p3.setAttributeNS(null,"cy",350 - 25 * func_calcul((x1 - 350) / 25))
	p4.setAttributeNS(null,"cx",x2)
	p4.setAttributeNS(null,"cy",350 - 25 * func_calcul((x2 - 350) / 25))
	secante.setAttributeNS(null,"x1",x1)
	secante.setAttributeNS(null,"y1",350 - 25 * func_calcul((x1 - 350) / 25))
	secante.setAttributeNS(null,"x2",x2)
	secante.setAttributeNS(null,"y2",350 - 25 * func_calcul((x2 - 350) / 25))
	debl.setAttributeNS(null,"x1",x1)
	debl.setAttributeNS(null,"x2",x1)
	finl.setAttributeNS(null,"x1",x2)
	finl.setAttributeNS(null,"x2",x2)
	ap.setAttributeNS(null,"x",x1)
	bp.setAttributeNS(null,"x",x2)
	x_deb = parseInt(4 * (x1 - 350)) / 100
	x_fin = parseInt(4 * (x2 - 350)) / 100
	solu = x_deb - func_calcul(x_deb) * (x_fin - x_deb) / (func_calcul(x_fin) - func_calcul(x_deb))
	delta = Math.abs(x_deb - x_fin) / 2
	deb.firstChild.data = x_deb
	fin.firstChild.data = x_fin
	sol.firstChild.data = solu
	ecart.firstChild.data = delta
}

function init_dichotomy(evt)
{
	x1 = 200
	x2 = 300
	x_deb = -6
	x_fin = -2
	solu = -4
	delta = 2
	ap = svgdoc.getElementById("a")
	bp = svgdoc.getElementById("b")
	p1 = svgdoc.getElementById("p1")
	p2 = svgdoc.getElementById("p2")
	p3 = svgdoc.getElementById("p3")
	p4 = svgdoc.getElementById("p4")
	deb = svgdoc.getElementById("deb")
	fin = svgdoc.getElementById("fin")
	debl = svgdoc.getElementById("debline")
	finl = svgdoc.getElementById("finline")
	sol = svgdoc.getElementById("sol")
	ecart = svgdoc.getElementById("ecart")
	f_x = svgdoc.getElementById("f_x")
	quadra = svgdoc.getElementById("quadra")
	debut = true
	clip_quadra(0.004,0.004,-0.37,-0.412,4.533)
	dichotomy_calcul()
}

function dichotomy_move(evt)
{
	if (click)
		{
			xm = coordo_x(evt.clientX)
			cible = evt.target.getAttributeNS(null,"id")
			if (xm < 25 ) xm = 25
			if (xm > 675 ) xm = 675
			if (cible == "p1")
				x1 = xm
			if (cible == "p2")
				x2 = xm
			debut = true
			dichotomy_calcul()
		}
}

function func_calcul(x)
{
	var y = 0.004 * x * x * x * x + 0.004 * x * x * x - 0.37 * x * x -0.412 * x + 4.533	
	return y
}

function dichotomy_solve(final,increment)
{
	if ((final)||(debut))
	{
		p3.setAttributeNS(null,"cx",x1)
		p3.setAttributeNS(null,"cy",350 - 25 * func_calcul((x1 - 350) / 25))
		p4.setAttributeNS(null,"cx",x2)
		p4.setAttributeNS(null,"cy",350 - 25 * func_calcul((x2 - 350) / 25))
		debl.setAttributeNS(null,"x1",x1)
		debl.setAttributeNS(null,"x2",x1)
		finl.setAttributeNS(null,"x1",x2)
		finl.setAttributeNS(null,"x2",x2)
		x_d = x_deb
		x_f = x_fin
		sol_temp = solu
		delta_temp = delta
		deb.firstChild.data = x_deb
		fin.firstChild.data = x_fin
		sol.firstChild.data = solu
		ecart.firstChild.data = delta
		f_x.firstChild.data = " "
		stepByStep = false
		debut = false
	}
	if (!final)
		stepByStep = true
	timer = increment
	solve_dichotomy_detail()
}

function solve_dichotomy_detail()
{
	if (delta_temp < 0.001)
	{
		if (Math.abs(func_calcul(sol_temp)) > 0.01)
			sol.firstChild.data = "no solution on [AB]"
		f_x.firstChild.data = parseFloat(func_calcul(sol_temp))
		debut = true
		return
	}
	var middle = (x_d + x_f) / 2
	if (func_calcul(x_d) * func_calcul(middle) < 0 )
		x_f = middle
	else
		x_d = middle
	sol_temp = (x_d + x_f) / 2
	delta_temp = Math.abs(x_d - x_f) / 2
	deb.firstChild.data = x_d
	fin.firstChild.data = x_f
	sol.firstChild.data = sol_temp
	ecart.firstChild.data = delta_temp
	p3.setAttributeNS(null,"cx",350 + 25 * x_d)
	p3.setAttributeNS(null,"cy",350 - 25 * func_calcul(x_d))
	p4.setAttributeNS(null,"cx",350 + 25 * x_f)
	p4.setAttributeNS(null,"cy",350 - 25 * func_calcul(x_f))
	debl.setAttributeNS(null,"x1",350 + 25 * x_d)
	debl.setAttributeNS(null,"x2",350 + 25 * x_d)
	finl.setAttributeNS(null,"x1",350 + 25 * x_f)
	finl.setAttributeNS(null,"x2",350 + 25 * x_f)
	
	if (!stepByStep)
		setTimeout("solve_dichotomy_detail()",timer)
}

function dichotomy_calcul()
{
	p1.setAttributeNS(null,"cx",x1)
	p2.setAttributeNS(null,"cx",x2)
	p3.setAttributeNS(null,"cx",x1)
	p3.setAttributeNS(null,"cy",350 - 25 * func_calcul((x1 - 350) / 25))
	p4.setAttributeNS(null,"cx",x2)
	p4.setAttributeNS(null,"cy",350 - 25 * func_calcul((x2 - 350) / 25))
	debl.setAttributeNS(null,"x1",x1)
	debl.setAttributeNS(null,"x2",x1)
	finl.setAttributeNS(null,"x1",x2)
	finl.setAttributeNS(null,"x2",x2)
	ap.setAttributeNS(null,"x",x1)
	bp.setAttributeNS(null,"x",x2)
	x_deb = parseInt(4 * (x1 - 350)) / 100
	x_fin = parseInt(4 * (x2 - 350)) / 100
	solu = (x_deb + x_fin) / 2
	delta = Math.abs(x_deb - x_fin) / 2
	deb.firstChild.data = x_deb
	fin.firstChild.data = x_fin
	sol.firstChild.data = solu
	ecart.firstChild.data = delta
}


function init_eqsystem3(evt)
{
	coeffs = new Array([1, -2, 3, 2],[-2 , 1 , 3, 2],[3, 0 , 1 , 4],[0 , 0 , 0 , 0])
	coeffs_initial = new Array([1, -2, 3, 2],[-2 , 1 , 3, 2],[3, 0 , 1 , 4],[0 , 0 , 0 , 0])	
	line = 0
	column = 0
	dim = 3
	affiche_coeffs()
}

function eqsystem3_change_coeff(l,c,increment)
{
	coeffs[l][c] += increment
	coeffs_initial[l][c] += increment
	node = svgdoc.getElementById("c" + l.toString() + c.toString())
	node.firstChild.data = coeffs_initial[l][c]
	line = 0
	column = 0
}

function affiche_coeffs()
{
	for (var i = 0 ; i < 3 ; i ++)
		for (var j = 0 ; j < 4 ; j ++)
		{
			node = svgdoc.getElementById("d" + i.toString() + j.toString())
			node.firstChild.data = coeffs[i][j]
		}
}

function solve_linear_detail()
{
	if (line > 2)
	{
		show_results()
		return
	}
	if (column == 0)
	{
		pivot = coeffs[line][line]
		range = line
		while ((pivot == 0) && (range < 3))
		{
			range += 1
			pivot = coeffs[range][line]
		}
		if (range != line)
			for (var k = 0; k <= 3; k ++)
			{
				coeffs[3][k] = coeffs[range][k] 
				coeffs[range][k] = coeffs[line][k] 
				coeffs[line][k] = coeffs[3][k] 
			}
	}
	if ( column != line)
	{
		pivot2 = coeffs[column][line]
		for (var k = 0; k <= 3; k ++)
			coeffs[column][k] = coeffs[column][k] * pivot - coeffs[line][k] * pivot2
	}
				
	affiche_coeffs()
	column += 1
	if (column == 3)
	{
		column = 0
		line += 1
	}	
	if (!stepByStep)
		setTimeout("solve_linear_detail()",timer)
}

function eqsystem3_calcul(final,increment)
{
	if (final)
	{
		line = 0
		column = 0
		stepByStep = false
		for (var i = 0 ; i < 3 ; i ++)
			svgdoc.getElementById("sol" + i.toString()).firstChild.data = " "
		for (var i = 0 ; i < 3 ; i ++)
			for (var j = 0 ; j < 4 ; j ++)
				coeffs[i][j] = coeffs_initial[i][j]
	}
	else
	{
	if ((line == 0) && (column == 0 ))
		{
		for (var i = 0 ; i < 3 ; i ++)
			svgdoc.getElementById("sol" + i.toString()).firstChild.data = " "
		for (var i = 0 ; i < 3 ; i ++)
			for (var j = 0 ; j < 4 ; j ++)
				coeffs[i][j] = coeffs_initial[i][j]
		}
		stepByStep = true
	}
	timer = increment
	solve_linear_detail()
}

function show_results()
{
		affiche_coeffs()
		for (var i = 0 ; i < 3 ; i ++)
		{
			if (coeffs[i][i] != 0 )
			{
				sol_linear[i] = coeffs[i][3] / coeffs[i][i]
				svgdoc.getElementById("sol" + i.toString()).firstChild.data = sol_linear[i]
			}
			else
			if (coeffs[i][3] != 0)
				svgdoc.getElementById("sol" + i.toString()).firstChild.data = "no solution"
			else
				svgdoc.getElementById("sol" + i.toString()).firstChild.data = "any value"
		}	
		for (var i = 0 ; i < 3 ; i ++)
			for (var j = 0 ; j < 4 ; j ++)
				coeffs[i][j] = coeffs_initial[i][j]
		line = 0
		column = 0
}


function init_eqdegre4(evt)
{
	x1 = 200
	y1 = 400
	x2 = 400
	y2 = 400
	x3 = 100
	y3 = 200
	x4 = 500
	y4 = 500
	x5 = 600
	y5 = 400
	ap = svgdoc.getElementById("a")
	bp = svgdoc.getElementById("b")
	cp = svgdoc.getElementById("c")
	dp = svgdoc.getElementById("d")
	ep = svgdoc.getElementById("e")
	mp6 = svgdoc.getElementById("m")
	mp7 = svgdoc.getElementById("n")
	mp8 = svgdoc.getElementById("p")
	mp9 = svgdoc.getElementById("q")
	p1 = svgdoc.getElementById("p1")
	p2 = svgdoc.getElementById("p2")
	p3 = svgdoc.getElementById("p3")
	p4 = svgdoc.getElementById("p4")
	p5 = svgdoc.getElementById("p5")
	p6 = svgdoc.getElementById("p6")
	p7 = svgdoc.getElementById("p7")
	p8 = svgdoc.getElementById("p8")
	p9 = svgdoc.getElementById("p9")
	u1 = svgdoc.getElementById("u1")
	v1 = svgdoc.getElementById("v1")
	w1 = svgdoc.getElementById("w1")
	z1 = svgdoc.getElementById("z1")
	t1 = svgdoc.getElementById("t1")
	quadra = svgdoc.getElementById("quadra")
	sol1 = svgdoc.getElementById("sol1")
	sol2 = svgdoc.getElementById("sol2")
	sol3 = svgdoc.getElementById("sol3")
	sol4 = svgdoc.getElementById("sol4")
	solu = svgdoc.getElementById("solu")
	eqdegre4_calcul()
}

function eqdegre4_move(evt)
{
	if (click)
		{
			cible = evt.target.getAttributeNS(null,"id")
			xm = coordo_x(evt.clientX)
			ym = coordo_y(evt.clientY)
			if (xm < 25 ) xm = 25
			if (xm > 675 ) xm = 675
			if (ym < 125 ) ym = 125
			if (ym > 575 ) ym = 575
			if (xm == 350) xm = 350.5
			if (cible == "p1")
				{ 
				x1 = xm
				y1 = ym
				}
			if (cible == "p2")
				{ 
				x2 = xm
				y2 = ym
				}
			if (cible == "p3")
				{ 
				x3 = xm
				y3 = ym
				}
			if (cible == "p4")
				{ 
				x4 = xm
				y4 = ym
				}
			if (cible == "p5")
				{ 
				x5 = xm
				y5 = ym
				}
			eqdegre4_calcul()
		}
}

function clip_quadra(a,b,c,d,e)
{
	max_x = 13
	max_y = 9
	min_x = -13
	min_y = -9
	step = 0.1
	str = "M" + (350 + 25 * min_x) + "," + (350 - 25 * (a * min_x * min_x * min_x * min_x + b * min_x * min_x * min_x + c * min_x * min_x + d * min_x + e)) + " "
	for (x = min_x + step; x <= max_x; x += step)
		str +=  (350 + 25 * x) + "," + (350 - 25 * (a * x * x * x * x + b * x * x * x + c * x * x + d * x + e)) + " "
	quadra.setAttributeNS(null, "d", str)				
}

function solve_linear(coeffs,dim)
{
	var c = coeffs
	for (i = 0 ; i < dim ; i ++)
		for (j = 0; j < dim ; j++)
		{
			pivot = c[i][i]
			range = i
			while ((pivot == 0) && (range < dim))
				{
				  	range += 1
					pivot = c[range][i]
				}
			if (range != i)
				for (k = 0; k <= dim; k ++)
				{
					c[dim][k] = c[range][k] 
					c[range][k] = c[i][k] 
					c[i][k] = c[dim][k] 
				}
			if ( j != i)
			{
				pivot2 = c[j][i]
				for (k = 0; k <= dim; k ++)
				{
					c[j][k] = c[j][k] * pivot - c[i][k] * pivot2

				}
			}
				


		}
	for (i = 0 ; i < dim ; i ++)
		sol_linear[i] = c[i][dim] / c[i][i]
}

function eqdegre4_calcul()
{
	p1.setAttributeNS(null,"cx",x1)
	p1.setAttributeNS(null,"cy",y1)
	p2.setAttributeNS(null,"cx",x2)
	p2.setAttributeNS(null,"cy",y2)
	p3.setAttributeNS(null,"cx",x3)
	p3.setAttributeNS(null,"cy",y3)
	p4.setAttributeNS(null,"cx",x4)
	p4.setAttributeNS(null,"cy",y4)
	p5.setAttributeNS(null,"cx",x5)
	p5.setAttributeNS(null,"cy",y5)
	ap.setAttributeNS(null,"x",x1)
	ap.setAttributeNS(null,"y",y1)
	bp.setAttributeNS(null,"x",x2)
	bp.setAttributeNS(null,"y",y2)
	cp.setAttributeNS(null,"x",x3)
	cp.setAttributeNS(null,"y",y3)
	dp.setAttributeNS(null,"x",x4)
	dp.setAttributeNS(null,"y",y4)
	ep.setAttributeNS(null,"x",x5)
	ep.setAttributeNS(null,"y",y5)
	xA = parseInt(4 * (x1 - 350)) / 100
	yA = parseInt(4 * (350 - y1)) / 100
	xB = parseInt(4 * (x2 - 350)) / 100
	yB = parseInt(4 * (350 - y2)) / 100
	xC = parseInt(4 * (x3 - 350)) / 100
	yC = parseInt(4 * (350 - y3)) / 100
	xD = parseInt(4 * (x4 - 350)) / 100
	yD = parseInt(4 * (350 - y4)) / 100
	xE = parseInt(4 * (x5 - 350)) / 100
	yE = parseInt(4 * (350 - y5)) / 100
	coeff_linear = new Array([xA * xA * xA * xA,xA * xA * xA, xA * xA,xA,1,yA],
				[xB * xB * xB * xB,xB * xB * xB, xB * xB,xB,1,yB],
				[xC * xC * xC * xC,xC * xC * xC, xC * xC,xC,1,yC],
				[xD * xD * xD * xD,xD * xD * xD, xD * xD,xD,1,yD],
				[xE * xE * xE * xE,xE * xE * xE, xE * xE,xE,1,yE],
				[0,0,0,0,0,0])
	solve_linear(coeff_linear,5)
	det = 1
	if ( det != 0 )
	{
		a = sol_linear[0]
		b = sol_linear[1]
		c = sol_linear[2]
		d = sol_linear[3]
		e = sol_linear[4]
		u1.firstChild.data = Math.round(1000 * a) / 1000
		if (b < 0 )
			v1.firstChild.data = Math.round(1000 * b) / 1000
		else
			v1.firstChild.data = " + " + Math.round(1000 * b) / 1000
		if (c < 0 )
			w1.firstChild.data = Math.round(100 * c) / 100
		else
			w1.firstChild.data = " + " + Math.round(1000 * c) / 1000
		if (d < 0 )
			z1.firstChild.data = Math.round(1000 * d) / 1000
		else
			z1.firstChild.data = " + " + Math.round(1000 * d) / 1000
		if (e < 0 )
			t1.firstChild.data = Math.round(1000 * e) / 1000
		else
			t1.firstChild.data = " + " + Math.round(1000 * e) / 1000
		clip_quadra(a,b,c,d,e)
		deno = a
		a = b / deno
		b = c / deno
		c = d / deno
		d = e / deno
		solve_cubic(1,-b,a*c-4*d,-a*a*d+4*b*d-c*c)
		R2 = a * a / 4 - b + sol_poly[0]
		nb_sol = 0
		if (R2 > 0)
		{
			R = Math.sqrt(R2)
			D2 = 3 * a * a / 4 - R2 - 2* b + ( 4 * a * b - 8 * c - a * a * a) / ( 4 * R )
			if ( D2 >= 0 )
			{
				D = Math.sqrt(D2)
				sol_poly[nb_sol] = - a / 4 + R / 2 - D / 2 
				nb_sol += 1
				sol_poly[nb_sol] = - a / 4 + R / 2 + D / 2 
				nb_sol += 1
			}
			E2 = 3 * a * a / 4 - R2 - 2* b - ( 4 * a * b - 8 * c - a * a * a) / ( 4 * R )
			if ( E2 >= 0 )
			{
				E = Math.sqrt(E2)
				sol_poly[nb_sol] = - a / 4 - R / 2 - E / 2 
				nb_sol += 1
				sol_poly[nb_sol] = - a / 4 - R / 2 + E / 2 
				nb_sol += 1
			}
		}
		else
		if (( R2 = 0 )&&(sol_poly[0] * sol_poly[0] - 4 * d >= 0))
		{
			D2 = 3 * a * a / 4 - 2 * b + 2 * Math.sqrt(sol_poly[0] * sol_poly[0] - 4 * d )
			E2 = 3 * a * a / 4 - 2 * b - 2 * Math.sqrt(sol_poly[0] * sol_poly[0] - 4 * d )
			if ( D2 >= 0 )
			{
				D = Math.sqrt(D2)
				sol_poly[nb_sol] = - a / 4 + R / 2 - D / 2 
				nb_sol += 1
				sol_poly[nb_sol] = - a / 4 + R / 2 + D / 2 
				nb_sol += 1
			}
			if ( E2 >= 0 )
			{
				E = Math.sqrt(E2)
				sol_poly[nb_sol] = - a / 4 - R / 2 - E / 2 
				nb_sol += 1
				sol_poly[nb_sol] = - a / 4 - R / 2 + E / 2 
				nb_sol += 1
			}
		}
		if ( nb_sol > 0 )
		{
		for ( i = 0 ; i < nb_sol; i++)
			{
			eval("sol" + (i + 1).toString() +".firstChild.data = Math.round( 1000 * sol_poly[" + i.toString() +"]) / 1000")
			eval("p" + (6 + i).toString() +".setAttributeNS(null,'cx',350 + 25 * sol_poly[" + i.toString() + "])")
			eval("mp" + (6 + i).toString() +".setAttributeNS(null,'x',350 + 25 * sol_poly[" + i.toString() + "])")
			}
		if (nb_sol < 4)
		for ( i = nb_sol ; i < 4; i++)
			{
			eval("sol" + (i + 1).toString() +".firstChild.data = ' '")
			eval("p" + (6 + i).toString() +".setAttributeNS(null,'cx','-100')")
			eval("mp" + (6 + i).toString() +".setAttributeNS(null,'x','-100')")
			}
		solu.setAttributeNS(null,"visibility","visible")
		}
		else
		{
			for ( i = 0 ; i < 4; i++)
				eval("sol" + (i + 1).toString() +".firstChild.data = ' '")
			solu.setAttributeNS(null,"visibility","hidden")
		}
	}
}


function init_ineqdegre3(evt)
{
	x1 = 200
	y1 = 400
	x2 = 400
	y2 = 400
	x3 = 100
	y3 = 200
	x4 = 500
	y4 = 500
	ap = svgdoc.getElementById("a")
	bp = svgdoc.getElementById("b")
	cp = svgdoc.getElementById("c")
	dp = svgdoc.getElementById("d")
	mp = svgdoc.getElementById("m")
	np = svgdoc.getElementById("n")
	pp = svgdoc.getElementById("p")
	p1 = svgdoc.getElementById("p1")
	p2 = svgdoc.getElementById("p2")
	p3 = svgdoc.getElementById("p3")
	p4 = svgdoc.getElementById("p4")
	p5 = svgdoc.getElementById("p5")
	p6 = svgdoc.getElementById("p6")
	p7 = svgdoc.getElementById("p7")
	u1 = svgdoc.getElementById("u1")
	v1 = svgdoc.getElementById("v1")
	w1 = svgdoc.getElementById("w1")
	z1 = svgdoc.getElementById("z1")
	cubic = svgdoc.getElementById("cubic")
	sol1 = svgdoc.getElementById("sol1")
	sol2 = svgdoc.getElementById("sol2")
	sol3 = svgdoc.getElementById("sol3")
	solu = svgdoc.getElementById("solu")
	solshow = svgdoc.getElementById("sol_show")
	ineqdegre3_calcul()
}

function ineqdegre3_move(evt)
{
	if (click)
		{
			cible = evt.target.getAttributeNS(null,"id")
			xm = coordo_x(evt.clientX)
			ym = coordo_y(evt.clientY)
			if (xm < 25 ) xm = 25
			if (xm > 675 ) xm = 675
			if (ym < 125 ) ym = 125
			if (ym > 575 ) ym = 575
			if (cible == "p1")
				{ 
				x1 = xm
				y1 = ym
				}
			if (cible == "p2")
				{ 
				x2 = xm
				y2 = ym
				}
			if (cible == "p3")
				{ 
				x3 = xm
				y3 = ym
				}
			if (cible == "p4")
				{ 
				x4 = xm
				y4 = ym
				}
			ineqdegre3_calcul()
		}
}


function ineqdegre3_calcul()
{
	p1.setAttributeNS(null,"cx",x1)
	p1.setAttributeNS(null,"cy",y1)
	p2.setAttributeNS(null,"cx",x2)
	p2.setAttributeNS(null,"cy",y2)
	p3.setAttributeNS(null,"cx",x3)
	p3.setAttributeNS(null,"cy",y3)
	p4.setAttributeNS(null,"cx",x4)
	p4.setAttributeNS(null,"cy",y4)
	ap.setAttributeNS(null,"x",x1)
	ap.setAttributeNS(null,"y",y1)
	bp.setAttributeNS(null,"x",x2)
	bp.setAttributeNS(null,"y",y2)
	cp.setAttributeNS(null,"x",x3)
	cp.setAttributeNS(null,"y",y3)
	dp.setAttributeNS(null,"x",x4)
	dp.setAttributeNS(null,"y",y4)
	xA = parseInt(4 * (x1 - 350)) / 100
	yA = parseInt(4 * (350 - y1)) / 100
	xB = parseInt(4 * (x2 - 350)) / 100
	yB = parseInt(4 * (350 - y2)) / 100
	xC = parseInt(4 * (x3 - 350)) / 100
	yC = parseInt(4 * (350 - y3)) / 100
	xD = parseInt(4 * (x4 - 350)) / 100
	yD = parseInt(4 * (350 - y4)) / 100
	det = (xA * xA * xA - xB * xB * xB) * (xA * xA - xC * xC) * (xA - xD)
	det += (xA * xA * xA - xC * xC * xC) * (xA * xA - xD * xD) * (xA - xB)
	det += (xA * xA * xA - xD * xD * xD) * (xA * xA - xB * xB) * (xA - xC)
	det -= (xA * xA * xA - xB * xB * xB) * (xA * xA - xD * xD) * (xA - xC)
	det -= (xA * xA * xA - xC * xC * xC) * (xA * xA - xB * xB) * (xA - xD)
	det -= (xA * xA * xA - xD * xD * xD) * (xA * xA - xC * xC) * (xA - xB)
	detx = (yA - yB) * (xA * xA - xC * xC) * (xA - xD)
	detx += (yA - yC) * (xA * xA - xD * xD) * (xA - xB)
	detx += (yA - yD) * (xA * xA - xB * xB) * (xA - xC)
	detx -= (yA - yB) * (xA * xA - xD * xD) * (xA - xC)
	detx -= (yA - yC) * (xA * xA - xB * xB) * (xA - xD)
	detx -= (yA - yD) * (xA * xA - xC * xC) * (xA - xB)
	dety = (xA * xA * xA - xB * xB * xB) * (yA - yC) * (xA - xD)
	dety += (xA * xA * xA - xC * xC * xC) * (yA - yD) * (xA - xB)
	dety += (xA * xA * xA - xD * xD * xD) * (yA - yB) * (xA - xC)
	dety -= (xA * xA * xA - xB * xB * xB) * (yA - yD) * (xA - xC)
	dety -= (xA * xA * xA - xC * xC * xC) * (yA - yB) * (xA - xD)
	dety -= (xA * xA * xA - xD * xD * xD) * (yA - yC) * (xA - xB)
	detz = (xA * xA * xA - xB * xB * xB) * (xA * xA - xC * xC) * (yA - yD)
	detz += (xA * xA * xA - xC * xC * xC) * (xA * xA - xD * xD) * (yA - yB)
	detz += (xA * xA * xA - xD * xD * xD) * (xA * xA - xB * xB) * (yA - yC)
	detz -= (xA * xA * xA - xB * xB * xB) * (xA * xA - xD * xD) * (yA - yC)
	detz -= (xA * xA * xA - xC * xC * xC) * (xA * xA - xB * xB) * (yA - yD)
	detz -= (xA * xA * xA - xD * xD * xD) * (xA * xA - xC * xC) * (yA - yB)
	if ( det != 0 )
	{
		node = svgdoc.getElementById("inf1")
		if (node != null)
			sol1.removeChild(node)
		infini1 = parseXML("<tref xlink:href='#infini' id='inf1'/>",svgdoc)
		node = svgdoc.getElementById("inf2")
		if (node != null)
			sol2.removeChild(node)
		infini2 = parseXML("<tref xlink:href='#infini' id='inf2'/>",svgdoc)
		a = detx / det
		b = dety / det
		c = detz / det
		d = yA - a * xA * xA * xA - b * xA * xA - c * xA
		u1.firstChild.data = Math.round(100 * a) / 100
		if (b < 0 )
			v1.firstChild.data = Math.round(100 * b) / 100
		else
			v1.firstChild.data = " + " + Math.round(100 * b) / 100
		if (c < 0 )
			w1.firstChild.data = Math.round(100 * c) / 100
		else
			w1.firstChild.data = " + " + Math.round(100 * c) / 100
		if (d < 0 )
			z1.firstChild.data = Math.round(100 * d) / 100
		else
			z1.firstChild.data = " + " + Math.round(100 * d) / 100
		clip_cubic(a,b,c,d)
		solve_cubic(a,b,c,d)
		p5.setAttributeNS(null,"cx",350 + 25 * sol_poly[0])
		mp.setAttributeNS(null,"x",350 + 25 * sol_poly[0])
		if (a > 0)
		{
			sol1.firstChild.data = "] " + Math.round(100 * sol_poly[0]) / 100 + " , + "
			sol2.appendChild(infini2)
			sol3.firstChild.data = "["
			str = "M" + ( 350 + 25 * sol_poly[0]) + " 350 675 350"

		}
		else
		{
			sol1.firstChild.data = "] -" 
			sol2.appendChild(infini2)
			sol3.firstChild.data = " , " + Math.round(100 * sol_poly[0]) / 100 + " ["
			str = "M 25 350 L" + ( 350 + 25 * sol_poly[0]) + " 350"

		}
		if ( nb_sol > 1 )
		{
			p6.setAttributeNS(null,"cx",350 + 25 * sol_poly[1])
			np.setAttributeNS(null,"x",350 + 25 * sol_poly[1])
			p7.setAttributeNS(null,"cx",350 + 25 * sol_poly[2])
			pp.setAttributeNS(null,"x",350 + 25 * sol_poly[2])
			var solution1 = Math.min(sol_poly[0],sol_poly[1],sol_poly[2])
			var solution3 = Math.max(sol_poly[0],sol_poly[1],sol_poly[2])
			for ( i = 0 ; i < 3 ; i++)
				if ((sol_poly[i] > solution1)&&(sol_poly[i] < solution3))
					solution2 = sol_poly[i]
			if (a > 0)
			{
			sol1.firstChild.data = "] " + Math.round(100 * solution1) / 100 + " , " + Math.round(100 * solution2) / 100 + " [ U ] " + Math.round(100 * solution3) / 100 + " , +"
			sol2.appendChild(infini2)
			sol3.firstChild.data = "["
			str = "M" + ( 350 + 25 * solution1) + " 350 " + ( 350 + 25 * solution2) + " 350 M"
			str += ( 350 + 25 * solution3) + " 350 675 350"
			}
			else
			{
			sol1.firstChild.data = "] -" 
			sol2.appendChild(infini2)
			sol3.firstChild.data = " , " + Math.round(100 * solution1) / 100 + " [ U ] " + Math.round(100 * solution2) / 100 + " , " + Math.round(100 * solution3) / 100 + " ["
			str = "M 25 350 L" + ( 350 + 25 * solution1) + " 350" + "M" + ( 350 + 25 * solution2) + " 350 "
			str += ( 350 + 25 * solution3) + " 350"
			}
		}
		else
		{
			p6.setAttributeNS(null,"cx","-100")
			np.setAttributeNS(null,"x","-100")
			p7.setAttributeNS(null,"cx","-100")
			pp.setAttributeNS(null,"x","-100")
		}
		solu.setAttributeNS(null,"visibility","visible")	
		solshow.setAttributeNS(null, "d", str)
	}
}


function init_eqdegre3(evt)
{
	x1 = 200
	y1 = 400
	x2 = 400
	y2 = 400
	x3 = 100
	y3 = 200
	x4 = 500
	y4 = 500
	ap = svgdoc.getElementById("a")
	bp = svgdoc.getElementById("b")
	cp = svgdoc.getElementById("c")
	dp = svgdoc.getElementById("d")
	mp = svgdoc.getElementById("m")
	np = svgdoc.getElementById("n")
	pp = svgdoc.getElementById("p")
	p1 = svgdoc.getElementById("p1")
	p2 = svgdoc.getElementById("p2")
	p3 = svgdoc.getElementById("p3")
	p4 = svgdoc.getElementById("p4")
	p5 = svgdoc.getElementById("p5")
	p6 = svgdoc.getElementById("p6")
	p7 = svgdoc.getElementById("p7")
	u1 = svgdoc.getElementById("u1")
	v1 = svgdoc.getElementById("v1")
	w1 = svgdoc.getElementById("w1")
	z1 = svgdoc.getElementById("z1")
	cubic = svgdoc.getElementById("cubic")
	sol1 = svgdoc.getElementById("sol1")
	sol2 = svgdoc.getElementById("sol2")
	sol3 = svgdoc.getElementById("sol3")
	solu = svgdoc.getElementById("solu")
	eqdegre3_calcul()
}

function eqdegre3_move(evt)
{
	if (click)
		{
			cible = evt.target.getAttributeNS(null,"id")
			xm = coordo_x(evt.clientX)
			ym = coordo_y(evt.clientY)
			if (xm < 25 ) xm = 25
			if (xm > 675 ) xm = 675
			if (ym < 125 ) ym = 125
			if (ym > 575 ) ym = 575
			if (cible == "p1")
				{ 
				x1 = xm
				y1 = ym
				}
			if (cible == "p2")
				{ 
				x2 = xm
				y2 = ym
				}
			if (cible == "p3")
				{ 
				x3 = xm
				y3 = ym
				}
			if (cible == "p4")
				{ 
				x4 = xm
				y4 = ym
				}
			eqdegre3_calcul()
		}
}

function clip_cubic(a,b,c,d)
{
	max_x = 13
	max_y = 9
	min_x = -13
	min_y = -9
	step = 0.1
	str = "M" + (350 + 25 * min_x) + "," + (350 - 25 * (a * min_x * min_x * min_x + b * min_x * min_x + c * min_x + d)) + " "
	for (x = min_x + step; x <= max_x; x += step)
		str +=  (350 + 25 * x) + "," + (350 - 25 * (a * x * x * x + b * x * x + c * x + d)) + " "
	cubic.setAttributeNS(null, "d", str)				
}

function solve_cubic(a_c,b_c,c_c,d_c)
{
	nb_sol = 0
	if ( a_c!= 0 )
	{
	var a_s = 1, b_s = b_c / a_c, c_s = c_c / a_c, d_s = d_c / a_c
	var a = (3 * c_s - b_s * b_s) / 3
        var b = (2 * b_s * b_s * b_s - 9 * c_s * b_s + 27 * d_s) / 27
	var offset  = b_s / 3
 	var discrim = b * b / 4 + a * a * a /27
 	var halfB   = b / 2

        if ( Math.abs(discrim) <= 0.000001 ) 
		discrim = 0
        
        if ( discrim > 0 ) 
	{
            var e = Math.sqrt(discrim)
            var tmp = 0
            var root = 0

            tmp = -halfB + e
            if ( tmp >= 0 )
                root = Math.pow(tmp, 1/3)
            else
                root = -Math.pow(-tmp, 1/3)

            tmp = -halfB - e
            if ( tmp >= 0 )
                root += Math.pow(tmp, 1/3)
             else
                root -= Math.pow(-tmp, 1/3)
	     root -= offset
	nb_sol = 1
	sol_poly[0] = root
        } 
	else 
	if ( discrim < 0 ) 
		{
            		var distance = Math.sqrt(-a/3)
            		var angle    = Math.atan2( Math.sqrt(-discrim), -halfB) / 3
            		var cos      = Math.cos(angle)
            		var sin      = Math.sin(angle)
            		var sqrt3    = Math.sqrt(3)

	nb_sol = 3
        sol_poly[0] = 2 * distance * cos - offset 
        sol_poly[1] = - distance * (cos + sqrt3 * sin) - offset
        sol_poly[2] = - distance * (cos - sqrt3 * sin) - offset
       		}
		else
		{
	            var tmp = 0

	        if ( halfB >= 0 )
        	     tmp = -Math.pow(halfB, 1/3)
            	else
           	     tmp = Math.pow(-halfB, 1/3)

		nb_sol = 3
        	sol_poly[0] = 2*tmp - offset 
        	sol_poly[1] = -tmp - offset
        	sol_poly[2] = -tmp - offset
        	}
  	}  
}

function eqdegre3_calcul()
{
	p1.setAttributeNS(null,"cx",x1)
	p1.setAttributeNS(null,"cy",y1)
	p2.setAttributeNS(null,"cx",x2)
	p2.setAttributeNS(null,"cy",y2)
	p3.setAttributeNS(null,"cx",x3)
	p3.setAttributeNS(null,"cy",y3)
	p4.setAttributeNS(null,"cx",x4)
	p4.setAttributeNS(null,"cy",y4)
	ap.setAttributeNS(null,"x",x1)
	ap.setAttributeNS(null,"y",y1)
	bp.setAttributeNS(null,"x",x2)
	bp.setAttributeNS(null,"y",y2)
	cp.setAttributeNS(null,"x",x3)
	cp.setAttributeNS(null,"y",y3)
	dp.setAttributeNS(null,"x",x4)
	dp.setAttributeNS(null,"y",y4)
	xA = parseInt(4 * (x1 - 350)) / 100
	yA = parseInt(4 * (350 - y1)) / 100
	xB = parseInt(4 * (x2 - 350)) / 100
	yB = parseInt(4 * (350 - y2)) / 100
	xC = parseInt(4 * (x3 - 350)) / 100
	yC = parseInt(4 * (350 - y3)) / 100
	xD = parseInt(4 * (x4 - 350)) / 100
	yD = parseInt(4 * (350 - y4)) / 100
	det = (xA * xA * xA - xB * xB * xB) * (xA * xA - xC * xC) * (xA - xD)
	det += (xA * xA * xA - xC * xC * xC) * (xA * xA - xD * xD) * (xA - xB)
	det += (xA * xA * xA - xD * xD * xD) * (xA * xA - xB * xB) * (xA - xC)
	det -= (xA * xA * xA - xB * xB * xB) * (xA * xA - xD * xD) * (xA - xC)
	det -= (xA * xA * xA - xC * xC * xC) * (xA * xA - xB * xB) * (xA - xD)
	det -= (xA * xA * xA - xD * xD * xD) * (xA * xA - xC * xC) * (xA - xB)
	detx = (yA - yB) * (xA * xA - xC * xC) * (xA - xD)
	detx += (yA - yC) * (xA * xA - xD * xD) * (xA - xB)
	detx += (yA - yD) * (xA * xA - xB * xB) * (xA - xC)
	detx -= (yA - yB) * (xA * xA - xD * xD) * (xA - xC)
	detx -= (yA - yC) * (xA * xA - xB * xB) * (xA - xD)
	detx -= (yA - yD) * (xA * xA - xC * xC) * (xA - xB)
	dety = (xA * xA * xA - xB * xB * xB) * (yA - yC) * (xA - xD)
	dety += (xA * xA * xA - xC * xC * xC) * (yA - yD) * (xA - xB)
	dety += (xA * xA * xA - xD * xD * xD) * (yA - yB) * (xA - xC)
	dety -= (xA * xA * xA - xB * xB * xB) * (yA - yD) * (xA - xC)
	dety -= (xA * xA * xA - xC * xC * xC) * (yA - yB) * (xA - xD)
	dety -= (xA * xA * xA - xD * xD * xD) * (yA - yC) * (xA - xB)
	detz = (xA * xA * xA - xB * xB * xB) * (xA * xA - xC * xC) * (yA - yD)
	detz += (xA * xA * xA - xC * xC * xC) * (xA * xA - xD * xD) * (yA - yB)
	detz += (xA * xA * xA - xD * xD * xD) * (xA * xA - xB * xB) * (yA - yC)
	detz -= (xA * xA * xA - xB * xB * xB) * (xA * xA - xD * xD) * (yA - yC)
	detz -= (xA * xA * xA - xC * xC * xC) * (xA * xA - xB * xB) * (yA - yD)
	detz -= (xA * xA * xA - xD * xD * xD) * (xA * xA - xC * xC) * (yA - yB)
	if ( det != 0 )
	{
		a = detx / det
		b = dety / det
		c = detz / det
		d = yA - a * xA * xA * xA - b * xA * xA - c * xA
		u1.firstChild.data = Math.round(100 * a) / 100
		if (b < 0 )
			v1.firstChild.data = Math.round(100 * b) / 100
		else
			v1.firstChild.data = " + " + Math.round(100 * b) / 100
		if (c < 0 )
			w1.firstChild.data = Math.round(100 * c) / 100
		else
			w1.firstChild.data = " + " + Math.round(100 * c) / 100
		if (d < 0 )
			z1.firstChild.data = Math.round(100 * d) / 100
		else
			z1.firstChild.data = " + " + Math.round(100 * d) / 100
		clip_cubic(a,b,c,d)
		solve_cubic(a,b,c,d)
		sol1.firstChild.data = Math.round( 1000 * sol_poly[0]) / 1000
		p5.setAttributeNS(null,"cx",350 + 25 * sol_poly[0])
		mp.setAttributeNS(null,"x",350 + 25 * sol_poly[0])
		if ( nb_sol > 1 )
		{
			sol2.firstChild.data = Math.round( 1000 * sol_poly[1]) / 1000
			p6.setAttributeNS(null,"cx",350 + 25 * sol_poly[1])
			np.setAttributeNS(null,"x",350 + 25 * sol_poly[1])
			sol3.firstChild.data = Math.round( 1000 * sol_poly[2]) / 1000
			p7.setAttributeNS(null,"cx",350 + 25 * sol_poly[2])
			pp.setAttributeNS(null,"x",350 + 25 * sol_poly[2])
		}
		else
		{
			p6.setAttributeNS(null,"cx","-100")
			np.setAttributeNS(null,"x","-100")
			p7.setAttributeNS(null,"cx","-100")
			pp.setAttributeNS(null,"x","-100")
		}
		solu.setAttributeNS(null,"visibility","visible")	
	}
}



function init_eqdegre1(evt)
{
	x1 = 200
	y1 = 400
	x2 = 300
	y2 = 200	
	d1 = svgdoc.getElementById("d1")
	a = svgdoc.getElementById("a")
	b = svgdoc.getElementById("b")
	m = svgdoc.getElementById("m")
	p1 = svgdoc.getElementById("p1")
	p2 = svgdoc.getElementById("p2")
	p5 = svgdoc.getElementById("p5")
	u1 = svgdoc.getElementById("u1")
	v1 = svgdoc.getElementById("v1")
	solx = svgdoc.getElementById("solx")
	eqdegre1_calcul()
}

function eqdegre1_move(evt)
{
	if (click)
		{
			cible = evt.target.getAttributeNS(null,"id")
			xm = coordo_x(evt.clientX)
			ym = coordo_y(evt.clientY)
			if (xm < 25 ) xm = 25
			if (xm > 675 ) xm = 675
			if (ym < 125 ) ym = 125
			if (ym > 575 ) ym = 575
			if (cible == "p1")
				{ 
				x1 = xm
				y1 = ym
				}
			if (cible == "p2")
				{ 
				x2 = xm
				y2 = ym
				}
			if (cible == "p3")
				{ 
				x3 = xm
				y3 = ym
				}
			if (cible == "p4")
				{ 
				x4 = xm
				y4 = ym
				}
			eqdegre1_calcul()
		}
}

function eqdegre1_calcul()
{
	p1.setAttributeNS(null,"cx",x1)
	p1.setAttributeNS(null,"cy",y1)
	p2.setAttributeNS(null,"cx",x2)
	p2.setAttributeNS(null,"cy",y2)
	a.setAttributeNS(null,"x",x1)
	a.setAttributeNS(null,"y",y1)
	b.setAttributeNS(null,"x",x2)
	b.setAttributeNS(null,"y",y2)
	xA = parseInt(4 * (x1 - 350)) / 100
	yA = parseInt(4 * (350 - y1)) / 100
	xB = parseInt(4 * (x2 - 350)) / 100
	yB = parseInt(4 * (350 - y2)) / 100
	uX = parseInt(4 * (x2 - x1)) / 100
	uY = parseInt(4 * (y1 - y2)) / 100
	u0 = uY
	v0 = - uX
	w0 = - xA * uY + yA * uX
	clip_line(u0,v0,w0)
	d1.setAttributeNS(null,"x1",clip_p[0][0] * 25 + 350)
	d1.setAttributeNS(null,"x2",clip_p[1][0] * 25 + 350)
	d1.setAttributeNS(null,"y1",350 - clip_p[0][1] * 25)
	d1.setAttributeNS(null,"y2",350 - clip_p[1][1] * 25)

	if (x1 != x2)
	{
		u0 = (yB - yA) / ( xB - xA)
		u1.firstChild.data = Math.round(1000 * (yB - yA) / ( xB - xA)) / 1000
		v0 = yA - u0 * xA
	}
	else
	{
		u0 = 1
		u1.firstChild.data = " 1 "
		v0 = - xA
	}
	if (v0 < 0)
		v1.firstChild.data = " - " + Math.abs(Math.round(1000 * v0)/1000)
	else
		v1.firstChild.data = " + " + Math.round(1000 * v0)/1000

	if (y1 != y2)
	{
		xM = - v0 / u0
		x5 = 25 * xM + 350
		p5.setAttributeNS(null,"cx",x5)
		m.setAttributeNS(null,"x",x5)
		solx.firstChild.data = xM
	}
	else
	{
		p5.setAttributeNS(null,"cx","-10")
		m.setAttributeNS(null,"x",-20)
	if (v0 != 0)
		solx.firstChild.data = "No solution"
	else
		solx.firstChild.data = "Any value is solution"
	}
}


function init_ineqdegre2(evt)
{
	x1 = 200
	y1 = 400
	x2 = 400
	y2 = 400
	x3 = 100
	y3 = 200
	ap = svgdoc.getElementById("a")
	bp = svgdoc.getElementById("b")
	cp = svgdoc.getElementById("c")
	mp = svgdoc.getElementById("m")
	np = svgdoc.getElementById("n")
	p1 = svgdoc.getElementById("p1")
	p2 = svgdoc.getElementById("p2")
	p3 = svgdoc.getElementById("p3")
	p4 = svgdoc.getElementById("p4")
	p5 = svgdoc.getElementById("p5")
	u1 = svgdoc.getElementById("u1")
	v1 = svgdoc.getElementById("v1")
	w1 = svgdoc.getElementById("w1")
	parabole = svgdoc.getElementById("parabole")
	detp = svgdoc.getElementById("det")
	sol1 = svgdoc.getElementById("sol1")
	sol2 = svgdoc.getElementById("sol2")
	sol3 = svgdoc.getElementById("sol3")
	solu = svgdoc.getElementById("solu")
	solshow = svgdoc.getElementById("sol_show")
	ineqdegre2_calcul()
}

function ineqdegre2_move(evt)
{
	if (click)
		{
			cible = evt.target.getAttributeNS(null,"id")
			xm = coordo_x(evt.clientX)
			ym = coordo_y(evt.clientY)
			if (xm < 25 ) xm = 25
			if (xm > 675 ) xm = 675
			if (ym < 125 ) ym = 125
			if (ym > 575 ) ym = 575
			if (cible == "p1")
				{ 
				x1 = xm
				y1 = ym
				}
			if (cible == "p2")
				{ 
				x2 = xm
				y2 = ym
				}
			if (cible == "p3")
				{ 
				x3 = xm
				y3 = ym
				}
			ineqdegre2_calcul()
		}
}

function ineqdegre2_calcul()
{
	p1.setAttributeNS(null,"cx",x1)
	p1.setAttributeNS(null,"cy",y1)
	p2.setAttributeNS(null,"cx",x2)
	p2.setAttributeNS(null,"cy",y2)
	p3.setAttributeNS(null,"cx",x3)
	p3.setAttributeNS(null,"cy",y3)
	ap.setAttributeNS(null,"x",x1)
	ap.setAttributeNS(null,"y",y1)
	bp.setAttributeNS(null,"x",x2)
	bp.setAttributeNS(null,"y",y2)
	cp.setAttributeNS(null,"x",x3)
	cp.setAttributeNS(null,"y",y3)
	xA = parseInt(4 * (x1 - 350)) / 100
	yA = parseInt(4 * (350 - y1)) / 100
	xB = parseInt(4 * (x2 - 350)) / 100
	yB = parseInt(4 * (350 - y2)) / 100
	xC = parseInt(4 * (x3 - 350)) / 100
	yC = parseInt(4 * (350 - y3)) / 100
	a0 = (xB * xB - xA * xA) * (xC - xA) - (xC * xC - xA * xA) * (xB - xA)
	b0 = ( yB - yA) * (xC - xA) - ( yC - yA ) * (xB - xA)
	para = false
	if ( a0 != 0 )
	{
		a = b0 / a0
		if (xB != xA)
		{
			b = (yB - yA - a * (xB * xB - xA * xA))	/ (xB - xA)
			c = yA - a * xA * xA - b * xA
			u1.firstChild.data = Math.round(100 * a) / 100
			if (b < 0 )
				v1.firstChild.data = Math.round(100 * b) / 100
			else
				v1.firstChild.data = " + " + Math.round(100 * b) / 100
			if (c < 0 )
				w1.firstChild.data = Math.round(100 * c) / 100
			else
				w1.firstChild.data = " + " + Math.round(100 * c) / 100
			clip_para(a,b,c)
			para = true
		}
	}
	if ((para)&&(nb_clip == 2))
	{
		str = "M" + (350 + 25 * clip_p[0][0]) + "," + (350 - 25 * clip_p[0][1])	+ "Q"		
		str += (350 + 25 * clip_p[2][0]) + "," + (350 - 25 * clip_p[2][1]) + " "		
		str += (350 + 25 * clip_p[1][0]) + "," + (350 - 25 * clip_p[1][1])
		parabole.setAttributeNS(null, "d", str)				
		delta = b * b - 4 * a * c 
		detp.firstChild.data = Math.round(100 * delta) / 100
		node = svgdoc.getElementById("inf1")
		if (node != null)
			sol1.removeChild(node)
		infini1 = parseXML("<tref xlink:href='#infini' id='inf1'/>",svgdoc)
		node = svgdoc.getElementById("inf2")
		if (node != null)
			sol2.removeChild(node)
		infini2 = parseXML("<tref xlink:href='#infini' id='inf2'/>",svgdoc)

		if (delta >= 0)
		{
			xs1 = ( - b - Math.sqrt(delta)) / (2 * a )
			p4.setAttributeNS(null,"cx", 350 + 25 * xs1)
			mp.setAttributeNS(null,"x", 350 + 25 * xs1)
			xs2 = ( - b + Math.sqrt(delta)) / (2 * a )
			p5.setAttributeNS(null,"cx", 350 + 25 * xs2)		
			np.setAttributeNS(null,"x", 350 + 25 * xs2)
			solu.setAttributeNS(null,"visibility","visible")
			if ( a < 0 )
			{
				str = "M" + ( 350 + 25 * Math.min(xs1,xs2)) +" 350L" + (350 + 25 * Math.max(xs1,xs2)) + " 350"
				sol1.firstChild.data = "] " + Math.round(100 * Math.min(xs1,xs2)) / 100 + " , "
				sol2.firstChild.data = Math.round(100 * Math.max(xs1,xs2)) / 100 + " ["
				sol3.firstChild.data = " "
			}
			else
			{
				str = "M25 350L" + ( 350 + 25 * Math.min(xs1,xs2)) +" 350M" + ( 350 + 25 * Math.max(xs1,xs2)) + " 350L675 350"
				sol1.firstChild.data = "] - " 
				sol1.appendChild(infini1)
				sol2.firstChild.data = " , " + Math.round(100 * Math.min(xs1,xs2)) / 100 + " [ U ] " + Math.round(100 * Math.max(xs1,xs2)) / 100 + " , "
				sol2.appendChild(infini2)
				sol3.firstChild.data = " ["
			}
		}
		else
		{
			if ( a < 0 )
			{
				str = "M 0 0"
				sol1.firstChild.data = "No real value"
			}
			else
			{
				str = "M25 350 L675 350"
				sol1.firstChild.data = "Any value is solution"
			}
			sol2.firstChild.data = " "
			sol3.firstChild.data = " "
			solu.setAttributeNS(null,"visibility","hidden")
		}		
		solshow.setAttributeNS(null, "d", str)
	}
}


function init_ineqdegre1var2(evt)
{
	x1 = 200
	y1 = 400
	x2 = 300
	y2 = 200	
	d1 = svgdoc.getElementById("d1")
	a = svgdoc.getElementById("a")
	b = svgdoc.getElementById("b")
	m = svgdoc.getElementById("m")
	p1 = svgdoc.getElementById("p1")
	p2 = svgdoc.getElementById("p2")
	p5 = svgdoc.getElementById("p5")
	u1 = svgdoc.getElementById("u1")
	v1 = svgdoc.getElementById("v1")
	w1 = svgdoc.getElementById("w1")
	solu = svgdoc.getElementById("solu")
	eqdegre1var2_calcul()
}

function eqdegre1var2_move(evt)
{
	if (click)
		{
			cible = evt.target.getAttributeNS(null,"id")
			xm = coordo_x(evt.clientX)
			ym = coordo_y(evt.clientY)
			if (xm < 25 ) xm = 25
			if (xm > 675 ) xm = 675
			if (ym < 125 ) ym = 125
			if (ym > 575 ) ym = 575
			if (cible == "p1")
				{ 
				x1 = xm
				y1 = ym
				}
			if (cible == "p2")
				{ 
				x2 = xm
				y2 = ym
				}
			eqdegre1var2_calcul()
		}
}

function clip_linevar2(u,v,w)
{
	max_x = 13
	max_y = 9
	min_x = -13
	min_y = -9
	nb_clip = 0
	if (v == 0)
	{
		clip_p[0][0] = - w / u
		clip_p[0][1] = min_y
		clip_p[1][0] = - w / u
		clip_p[1][1] = max_y
		liste_vertices = "P1P2I1P3P4I2P1"
	}
	else
	{
		if ( u == 0 )
			{
				clip_p[0][0] = min_x
				clip_p[0][1] = - w / v
				clip_p[1][0] = max_x
				clip_p[1][1] = - w / v
				liste_vertices = "P1I1P2P3I2P4P1"
			}
			else
			{
				liste_vertices = "P1"
				y = ( - u * min_x - w ) / v
				if ((y >= min_y)&&(y <= max_y)&&(nb_clip < 2))
				{	
				clip_p[nb_clip][0] = min_x
				clip_p[nb_clip][1] = y
				nb_clip += 1
				liste_vertices += "I1P2"
				}
				else
					liste_vertices += "P2"

				x = ( - v * min_y - w ) / u
				if ((x > min_x)&&(x < max_x)&&(nb_clip < 2))
				{	
				clip_p[nb_clip][0] = x
				clip_p[nb_clip][1] = min_y
				nb_clip += 1
				liste_vertices += "I" + nb_clip.toString() + "P3"
				}
				else
					liste_vertices += "P3"
				y = ( - u * max_x - w ) / v
				if ((y >= min_y)&&(y <= max_y)&&(nb_clip < 2))
				{	
				clip_p[nb_clip][0] = max_x
				clip_p[nb_clip][1] = y
				nb_clip += 1
				liste_vertices += "I" + nb_clip.toString() + "P4"
				}
				else
					liste_vertices += "P4"
				x = ( - v * max_y - w ) / u
				if ((x > min_x)&&(x < max_x)&&(nb_clip < 2))
				{	
				clip_p[nb_clip][0] = x
				clip_p[nb_clip][1] = max_y
				nb_clip += 1
				liste_vertices += "I" + nb_clip.toString() + "P1"
				}
				else
					liste_vertices += "P1"
			}
	}
}

function eqdegre1var2_calcul()
{
	p1.setAttributeNS(null,"cx",x1)
	p1.setAttributeNS(null,"cy",y1)
	p2.setAttributeNS(null,"cx",x2)
	p2.setAttributeNS(null,"cy",y2)
	a.setAttributeNS(null,"x",x1)
	a.setAttributeNS(null,"y",y1)
	b.setAttributeNS(null,"x",x2)
	b.setAttributeNS(null,"y",y2)
	xA = parseInt(4 * (x1 - 350)) / 100
	yA = parseInt(4 * (350 - y1)) / 100
	xB = parseInt(4 * (x2 - 350)) / 100
	yB = parseInt(4 * (350 - y2)) / 100
	uX = parseInt(4 * (x2 - x1)) / 100
	uY = parseInt(4 * (y1 - y2)) / 100
	u0 = uY
	v0 = - uX
	w0 = - xA * uY + yA * uX
	clip_linevar2(u0,v0,w0)
	d1.setAttributeNS(null,"x1",clip_p[0][0] * 25 + 350)
	d1.setAttributeNS(null,"x2",clip_p[1][0] * 25 + 350)
	d1.setAttributeNS(null,"y1",350 - clip_p[0][1] * 25)
	d1.setAttributeNS(null,"y2",350 - clip_p[1][1] * 25)
	u1.firstChild.data = Math.round(1000 * u0) / 1000
	if (v0 < 0)
		v1.firstChild.data = " - " + Math.abs(Math.round(1000 * v0)/1000)
	else
		v1.firstChild.data = " + " + Math.round(1000 * v0)/1000
	if (w0 < 0)
		w1.firstChild.data = " - " + Math.abs(Math.round(1000 * w0)/1000)
	else
		w1.firstChild.data = " + " + Math.round(1000 * w0)/1000
	str = ""
	if (- 13 * u0 + 9 * v0 + w0 > 0 )
	{
	}
	else
	if (- 13 * u0 - 9 * v0 + w0 > 0 )
		{
		liste_vertices += liste_vertices.substring(2,liste_vertices.indexOf("P2") + 2)
		liste_vertices = liste_vertices.substring(liste_vertices.indexOf("P2"),liste_vertices.length)
		}
		else
		if (13 * u0 - 9 * v0 + w0 > 0 )
			{
			liste_vertices += liste_vertices.substring(2,liste_vertices.indexOf("P3") + 2)
			liste_vertices = liste_vertices.substring(liste_vertices.indexOf("P3"),liste_vertices.length)
			}
			else
			if (13 * u0 + 9 * v0 + w0 > 0 )
				{
				liste_vertices += liste_vertices.substring(2,liste_vertices.indexOf("P4") + 2)
				liste_vertices = liste_vertices.substring(liste_vertices.indexOf("P4"),liste_vertices.length)
				}
	str = liste_vertices.substring(0,liste_vertices.indexOf("I") + 2)
	str += liste_vertices.substring(liste_vertices.indexOf("I",liste_vertices.indexOf("I") + 2),liste_vertices.length)
	path = "M"
	while ( str != "")
	{ 
		point = str.substring(0,2)
		switch (point)
		{
			case "P1" : path += ( - 13 * 25 + 350 ) + "," + ( 350 - 9 * 25 ) + " ";break;
			case "P2" : path += ( - 13 * 25 + 350 ) + "," + ( 350 + 9 * 25 ) + " ";break;
			case "P3" : path += ( 13 * 25 + 350 ) + "," + ( 350 + 9 * 25 ) + " ";break;
			case "P4" : path += ( 13 * 25 + 350 ) + "," + ( 350 - 9 * 25 ) + " ";break;
			case "I1" : path += ( clip_p[0][0] * 25 + 350 ) + "," + ( 350 - clip_p[0][1] * 25 ) + " ";break;
			case "I2" : path += ( clip_p[1][0] * 25 + 350 ) + "," + ( 350 - clip_p[1][1] * 25 ) + " ";break;
		}
		str = str.substring(2,str.length)
	}
	solu.setAttributeNS(null, "d", path)
}



function init_ineqdegre1(evt)
{
	x1 = 200
	y1 = 400
	x2 = 300
	y2 = 200	
	d1 = svgdoc.getElementById("d1")
	d2 = svgdoc.getElementById("d2")
	a = svgdoc.getElementById("a")
	b = svgdoc.getElementById("b")
	m = svgdoc.getElementById("m")
	p1 = svgdoc.getElementById("p1")
	p2 = svgdoc.getElementById("p2")
	p5 = svgdoc.getElementById("p5")
	u1 = svgdoc.getElementById("u1")
	v1 = svgdoc.getElementById("v1")
	solx1 = svgdoc.getElementById("solx1")
	solx2 = svgdoc.getElementById("solx2")
	ineqdegre1_calcul()
}

function ineqdegre1_move(evt)
{
	if (click)
		{
			cible = evt.target.getAttributeNS(null,"id")
			xm = coordo_x(evt.clientX)
			ym = coordo_y(evt.clientY)
			if (xm < 25 ) xm = 25
			if (xm > 675 ) xm = 675
			if (ym < 125 ) ym = 125
			if (ym > 575 ) ym = 575
			if (cible == "p1")
				{ 
				x1 = xm
				y1 = ym
				}
			if (cible == "p2")
				{ 
				x2 = xm
				y2 = ym
				}
			if (cible == "p3")
				{ 
				x3 = xm
				y3 = ym
				}
			if (cible == "p4")
				{ 
				x4 = xm
				y4 = ym
				}
			ineqdegre1_calcul()
		}
}

function ineqdegre1_calcul()
{
	p1.setAttributeNS(null,"cx",x1)
	p1.setAttributeNS(null,"cy",y1)
	p2.setAttributeNS(null,"cx",x2)
	p2.setAttributeNS(null,"cy",y2)
	a.setAttributeNS(null,"x",x1)
	a.setAttributeNS(null,"y",y1)
	b.setAttributeNS(null,"x",x2)
	b.setAttributeNS(null,"y",y2)
	xA = parseInt(4 * (x1 - 350)) / 100
	yA = parseInt(4 * (350 - y1)) / 100
	xB = parseInt(4 * (x2 - 350)) / 100
	yB = parseInt(4 * (350 - y2)) / 100
	uX = parseInt(4 * (x2 - x1)) / 100
	uY = parseInt(4 * (y1 - y2)) / 100
	u0 = uY
	v0 = - uX
	w0 = - xA * uY + yA * uX
	clip_line(u0,v0,w0)
	d1.setAttributeNS(null,"x1",clip_p[0][0] * 25 + 350)
	d1.setAttributeNS(null,"x2",clip_p[1][0] * 25 + 350)
	d1.setAttributeNS(null,"y1",350 - clip_p[0][1] * 25)
	d1.setAttributeNS(null,"y2",350 - clip_p[1][1] * 25)

	if (x1 != x2)
	{
		u0 = (yB - yA) / ( xB - xA)
		u1.firstChild.data = Math.round(1000 * (yB - yA) / ( xB - xA)) / 1000
	}
	else
	{
		u0 = 1
		u1.firstChild.data = " 1 "
	}
	v0 = yA - u0 * xA
	if (v0 < 0)
		v1.firstChild.data = " - " + Math.abs(Math.round(1000 * v0)/1000)
	else
		v1.firstChild.data = " + " + Math.round(1000 * v0)/1000
	node = svgdoc.getElementById("inf")
	if (node != null)
		solx1.removeChild(node)
	infini = parseXML("<tref xlink:href='#infini' id='inf'/>",svgdoc)
	if (y1 != y2)
	{
		xM = - v0 / u0
		x5 = 25 * xM + 350
		p5.setAttributeNS(null,"cx",x5)
		m.setAttributeNS(null,"x",x5)
		xM = Math.round( 1000 * xM ) / 1000
		if (u0 > 0)
		{
			d2.setAttributeNS(null,"x1",Math.max(25,x5))
			d2.setAttributeNS(null,"x2",675)
			solineq = "[" + xM + " , + " 
			solx1.firstChild.data = solineq
			solx1.appendChild(infini)
			solx2.firstChild.data = "["
		}
		else
		{
			d2.setAttributeNS(null,"x1",25)
			d2.setAttributeNS(null,"x2",Math.min(675,x5))
			solineq = "] - "
			solx1.firstChild.data = solineq
			solx1.appendChild(infini)
			solx2.firstChild.data = " , " + xM + "]"
		}

	}
	else
	{
	solx2.firstChild.data = " " 
	if (v0 < 0)
	{
		d2.setAttributeNS(null,"x1",-5)
		d2.setAttributeNS(null,"x2",-5)
		solx1.firstChild.data = "No solution"
	}
	else
	{
		d2.setAttributeNS(null,"x1",25)
		d2.setAttributeNS(null,"x2",675)
		solx1.firstChild.data = "Any value is solution"
	}
	}

}


function init_eqsystem2(evt)
{
	x1 = 200
	y1 = 400
	x2 = 300
	y2 = 200	
	x3 = 400
	y3 = 400
	x4 = 100
	y4 = 200
	d1 = svgdoc.getElementById("d1")
	d2 = svgdoc.getElementById("d2")
	a = svgdoc.getElementById("a")
	b = svgdoc.getElementById("b")
	c = svgdoc.getElementById("c")
	d = svgdoc.getElementById("d")
	m = svgdoc.getElementById("m")
	p1 = svgdoc.getElementById("p1")
	p2 = svgdoc.getElementById("p2")
	p3 = svgdoc.getElementById("p3")
	p4 = svgdoc.getElementById("p4")
	p5 = svgdoc.getElementById("p5")
	u1 = svgdoc.getElementById("u1")
	v1 = svgdoc.getElementById("v1")
	w1 = svgdoc.getElementById("w1")
	u2 = svgdoc.getElementById("u2")
	v2 = svgdoc.getElementById("v2")
	w2 = svgdoc.getElementById("w2")
	detp = svgdoc.getElementById("det")
	detx = svgdoc.getElementById("detx")
	dety = svgdoc.getElementById("dety")
	solx = svgdoc.getElementById("solx")
	soly = svgdoc.getElementById("soly")
	eqsystem2_calcul()
}

function eqsystem2_move(evt)
{
	if (click)
		{
			cible = evt.target.getAttributeNS(null,"id")
			xm = coordo_x(evt.clientX)
			ym = coordo_y(evt.clientY)
			if (xm < 25 ) xm = 25
			if (xm > 675 ) xm = 675
			if (ym < 125 ) ym = 125
			if (ym > 575 ) ym = 575
			if (cible == "p1")
				{ 
				x1 = xm
				y1 = ym
				}
			if (cible == "p2")
				{ 
				x2 = xm
				y2 = ym
				}
			if (cible == "p3")
				{ 
				x3 = xm
				y3 = ym
				}
			if (cible == "p4")
				{ 
				x4 = xm
				y4 = ym
				}
			eqsystem2_calcul()
		}
}

function clip_line(u,v,w)
{
	max_x = 13
	max_y = 9
	min_x = -13
	min_y = -9
	nb_clip = 0
	if (v == 0)
	{
		clip_p[0][0] = - w / u
		clip_p[0][1] = min_y
		clip_p[1][0] = - w / u
		clip_p[1][1] = max_y
	}
	else
	{
		if ( u == 0 )
			{
				clip_p[0][0] = min_x
				clip_p[0][1] = - w / v
				clip_p[1][0] = max_x
				clip_p[1][1] = - w / v
			}
			else
			{
				x = ( - v * min_y - w ) / u
				if ((x > min_x)&&(x < max_x))
				{	
				clip_p[nb_clip][0] = x
				clip_p[nb_clip][1] = min_y
				nb_clip += 1
				}
				x = ( - v * max_y - w ) / u
				if ((x > min_x)&&(x < max_x))
				{	
				clip_p[nb_clip][0] = x
				clip_p[nb_clip][1] = max_y
				nb_clip += 1
				}
				y = ( - u * min_x - w ) / v
				if ((y >= min_y)&&(y <= max_y)&&(nb_clip < 2))
				{	
				clip_p[nb_clip][0] = min_x
				clip_p[nb_clip][1] = y
				nb_clip += 1
				}
				y = ( - u * max_x - w ) / v
				if ((y >= min_y)&&(y <= max_y)&&(nb_clip < 2))
				{	
				clip_p[nb_clip][0] = max_x
				clip_p[nb_clip][1] = y
				nb_clip += 1
				}
			}
	}
}

function eqsystem2_calcul()
{
	p1.setAttributeNS(null,"cx",x1)
	p1.setAttributeNS(null,"cy",y1)
	p2.setAttributeNS(null,"cx",x2)
	p2.setAttributeNS(null,"cy",y2)
	p3.setAttributeNS(null,"cx",x3)
	p3.setAttributeNS(null,"cy",y3)
	p4.setAttributeNS(null,"cx",x4)
	p4.setAttributeNS(null,"cy",y4)
	a.setAttributeNS(null,"x",x1)
	a.setAttributeNS(null,"y",y1)
	b.setAttributeNS(null,"x",x2)
	b.setAttributeNS(null,"y",y2)
	c.setAttributeNS(null,"x",x3)
	c.setAttributeNS(null,"y",y3)
	d.setAttributeNS(null,"x",x4)
	d.setAttributeNS(null,"y",y4)
	xA = 4 * (x1 - 350) / 100
	yA = 4 * (350 - y1) / 100
	xB = 4 * (x2 - 350) / 100
	yB = 4 * (350 - y2) / 100
	xC = 4 * (x3 - 350) / 100
	yC = 4 * (350 - y3) / 100
	xD = 4 * (x4 - 350) / 100
	yD = 4 * (350 - y4) / 100
	uX = 4 * (x2 - x1) / 100
	uY = 4 * (y1 - y2) / 100
	u0 = uY
	v0 = - uX
	w0 = - xA * uY + yA * uX
	clip_line(u0,v0,w0)
	d1.setAttributeNS(null,"x1",clip_p[0][0] * 25 + 350)
	d1.setAttributeNS(null,"x2",clip_p[1][0] * 25 + 350)
	d1.setAttributeNS(null,"y1",350 - clip_p[0][1] * 25)
	d1.setAttributeNS(null,"y2",350 - clip_p[1][1] * 25)
	if (u0 < 0)
		u1.firstChild.data = " - " + Math.abs(u0)
	else
		u1.firstChild.data = u0
	if (v0 < 0)
		v1.firstChild.data = " - " + Math.abs(v0)
	else
		v1.firstChild.data = " + " + v0
	if (w0 > 0)
		w1.firstChild.data = " - " + Math.round(100 * w0) / 100
	else
		w1.firstChild.data = Math.round(100 * - w0) / 100
	uX = 4 * (x4 - x3) / 100
	uY = 4 * (y3 - y4) / 100
	u = uY
	v = - uX
	w = - xC * uY + yC * uX
	clip_line(u,v,w)
	d2.setAttributeNS(null,"x1",clip_p[0][0] * 25 + 350)
	d2.setAttributeNS(null,"x2",clip_p[1][0] * 25 + 350)
	d2.setAttributeNS(null,"y1",350 - clip_p[0][1] * 25)
	d2.setAttributeNS(null,"y2",350 - clip_p[1][1] * 25)
	if (u < 0)
		u2.firstChild.data = " - " + Math.abs(u)
	else
		u2.firstChild.data = u
	if (v < 0)
		v2.firstChild.data = " - " + Math.abs(v)
	else
		v2.firstChild.data = " + " + v
	if (w > 0)
		w2.firstChild.data = " - " + Math.round(100 * w) / 100
	else
		w2.firstChild.data = Math.round(100 * - w) / 100
	det = u0 * v - u * v0
	detp.firstChild.data = det
	det_x = v0 * w - v * w0
	detx.firstChild.data = det_x
	det_y = w0 * u - w * u0
	dety.firstChild.data = det_y
	if (det != 0)
	{
		xM = det_x / det
		yM = det_y / det
		x5 = 25 * xM + 350
		y5 = 350 - 25 * yM
		p5.setAttributeNS(null,"cx",x5)
		p5.setAttributeNS(null,"cy",y5)
		m.setAttributeNS(null,"x",x5)
		m.setAttributeNS(null,"y",y5)
		solx.firstChild.data = xM
		soly.firstChild.data = yM
	}
	else
	{
		solx.firstChild.data = "No solution"
		soly.firstChild.data = "No solution"
	}
}


function init_eqdegre2(evt)
{
	x1 = 200
	y1 = 400
	x2 = 400
	y2 = 400
	x3 = 100
	y3 = 200
	ap = svgdoc.getElementById("a")
	bp = svgdoc.getElementById("b")
	cp = svgdoc.getElementById("c")
	mp = svgdoc.getElementById("m")
	np = svgdoc.getElementById("n")
	p1 = svgdoc.getElementById("p1")
	p2 = svgdoc.getElementById("p2")
	p3 = svgdoc.getElementById("p3")
	p4 = svgdoc.getElementById("p4")
	p5 = svgdoc.getElementById("p5")
	u1 = svgdoc.getElementById("u1")
	v1 = svgdoc.getElementById("v1")
	w1 = svgdoc.getElementById("w1")
	parabole = svgdoc.getElementById("parabole")
	detp = svgdoc.getElementById("det")
	sol1 = svgdoc.getElementById("sol1")
	sol2 = svgdoc.getElementById("sol2")
	solu = svgdoc.getElementById("solu")
	eqdegre2_calcul()
}

function eqdegre2_move(evt)
{
	if (click)
		{
			cible = evt.target.getAttributeNS(null,"id")
			xm = coordo_x(evt.clientX)
			ym = coordo_y(evt.clientY)
			if (xm < 25 ) xm = 25
			if (xm > 675 ) xm = 675
			if (ym < 125 ) ym = 125
			if (ym > 575 ) ym = 575
			if (cible == "p1")
				{ 
				x1 = xm
				y1 = ym
				}
			if (cible == "p2")
				{ 
				x2 = xm
				y2 = ym
				}
			if (cible == "p3")
				{ 
				x3 = xm
				y3 = ym
				}
			eqdegre2_calcul()
		}
}

function clip_para(a,b,c)
{
	max_x = 13
	max_y = 9
	min_x = -13
	min_y = -9
	nb_clip = 0
	var ad = new Array()
	var bd = new Array()
	x = min_x
	y = a * x * x + b * x + c
	if ((y >= min_y)&&(y <= max_y))
	{	
		clip_p[nb_clip][0] = x
		clip_p[nb_clip][1] = y
		nb_clip += 1
		ad[nb_clip] = 2 * a * x + b		
		bd[nb_clip] = y - ad[nb_clip] * x
	}
	x = max_x
	y = a * x * x + b * x + c
	if ((y >= min_y)&&(y <= max_y))
	{	
		clip_p[nb_clip][0] = x
		clip_p[nb_clip][1] = y
		nb_clip += 1
		ad[nb_clip] = 2 * a * x + b		
		bd[nb_clip] = y - ad[nb_clip] * x
	}
	if ((nb_clip < 2)&&(a > 0))
	{
		y = max_y
		delta = b * b - 4 * a * (c - y)
		if (delta > 0)
		{
			x = ( - b - Math.sqrt(delta)) / (2 * a )
			if ((x >= min_x)&&(x <= max_x))
			{	
				clip_p[nb_clip][0] = x
				clip_p[nb_clip][1] = y
				nb_clip += 1
				ad[nb_clip] = 2 * a * x + b		
				bd[nb_clip] = y - ad[nb_clip] * x
			}
			x = ( - b + Math.sqrt(delta)) / (2 * a )
			if ((x >= min_x)&&(x <= max_x)&&(nb_clip < 2))
			{	
				clip_p[nb_clip][0] = x
				clip_p[nb_clip][1] = y
				nb_clip += 1
				ad[nb_clip] = 2 * a * x + b		
				bd[nb_clip] = y - ad[nb_clip] * x
			}
		}
		else
		if (delta == 0)
		{
		x = - b  / (2 * a )
			if ((x >= min_x)&&(x <= max_x))
			{	
				clip_p[nb_clip][0] = x
				clip_p[nb_clip][1] = y
				nb_clip += 1
				ad[nb_clip] = 2 * a * x + b		
				bd[nb_clip] = y - ad[nb_clip] * x
			}
		}
	}
	if ((nb_clip < 2)&&(a < 0))
	{
		y = min_y
		delta = b * b - 4 * a * (c - y)
		if (delta > 0)
		{
			x = ( - b - Math.sqrt(delta)) / (2 * a )
			if ((x >= min_x)&&(x <= max_x))
			{	
				clip_p[nb_clip][0] = x
				clip_p[nb_clip][1] = y
				nb_clip += 1
				ad[nb_clip] = 2 * a * x + b		
				bd[nb_clip] = y - ad[nb_clip] * x
			}
			x = ( - b + Math.sqrt(delta)) / (2 * a )
			if ((x >= min_x)&&(x <= max_x)&&(nb_clip < 2))
			{	
				clip_p[nb_clip][0] = x
				clip_p[nb_clip][1] = y
				nb_clip += 1
				ad[nb_clip] = 2 * a * x + b		
				bd[nb_clip] = y - ad[nb_clip] * x
			}
		}
		else
		if (delta == 0)
		{
		x = - b  / (2 * a )
			if ((x >= min_x)&&(x <= max_x))
			{	
				clip_p[nb_clip][0] = x
				clip_p[nb_clip][1] = y
				nb_clip += 1
				ad[nb_clip] = 2 * a * x + b		
				bd[nb_clip] = y - ad[nb_clip] * x
			}
		}
	}
	if (nb_clip == 2)
	{
		clip_p[2][0] = (bd[1] - bd[2]) / (ad[2] - ad[1])
		clip_p[2][1] = ad[1] * clip_p[2][0] + bd[1]
	}				 
}

function eqdegre2_calcul()
{
	p1.setAttributeNS(null,"cx",x1)
	p1.setAttributeNS(null,"cy",y1)
	p2.setAttributeNS(null,"cx",x2)
	p2.setAttributeNS(null,"cy",y2)
	p3.setAttributeNS(null,"cx",x3)
	p3.setAttributeNS(null,"cy",y3)
	ap.setAttributeNS(null,"x",x1)
	ap.setAttributeNS(null,"y",y1)
	bp.setAttributeNS(null,"x",x2)
	bp.setAttributeNS(null,"y",y2)
	cp.setAttributeNS(null,"x",x3)
	cp.setAttributeNS(null,"y",y3)
	xA = parseInt(4 * (x1 - 350)) / 100
	yA = parseInt(4 * (350 - y1)) / 100
	xB = parseInt(4 * (x2 - 350)) / 100
	yB = parseInt(4 * (350 - y2)) / 100
	xC = parseInt(4 * (x3 - 350)) / 100
	yC = parseInt(4 * (350 - y3)) / 100
	a0 = (xB * xB - xA * xA) * (xC - xA) - (xC * xC - xA * xA) * (xB - xA)
	b0 = ( yB - yA) * (xC - xA) - ( yC - yA ) * (xB - xA)
	para = false
	if ( a0 != 0 )
	{
		a = b0 / a0
		if (xB != xA)
		{
			b = (yB - yA - a * (xB * xB - xA * xA))	/ (xB - xA)
			c = yA - a * xA * xA - b * xA
			u1.firstChild.data = Math.round(100 * a) / 100
			if (b < 0 )
				v1.firstChild.data = Math.round(100 * b) / 100
			else
				v1.firstChild.data = " + " + Math.round(100 * b) / 100
			if (c < 0 )
				w1.firstChild.data = Math.round(100 * c) / 100
			else
				w1.firstChild.data = " + " + Math.round(100 * c) / 100
			clip_para(a,b,c)
			para = true
		}
	}
	if ((para)&&(nb_clip == 2))
	{
		str = "M" + (350 + 25 * clip_p[0][0]) + "," + (350 - 25 * clip_p[0][1])	+ "Q"		
		str += (350 + 25 * clip_p[2][0]) + "," + (350 - 25 * clip_p[2][1]) + " "		
		str += (350 + 25 * clip_p[1][0]) + "," + (350 - 25 * clip_p[1][1])
		parabole.setAttributeNS(null, "d", str)				
		delta = b * b - 4 * a * c 
		detp.firstChild.data = Math.round(100 * delta) / 100
		if (delta >= 0)
		{
			x = ( - b - Math.sqrt(delta)) / (2 * a )
			p4.setAttributeNS(null,"cx", 350 + 25 * x)
			mp.setAttributeNS(null,"x", 350 + 25 * x)
			sol1.firstChild.data = Math.round(100 * x) / 100
			x = ( - b + Math.sqrt(delta)) / (2 * a )
			p5.setAttributeNS(null,"cx", 350 + 25 * x)		
			np.setAttributeNS(null,"x", 350 + 25 * x)
			sol2.firstChild.data = Math.round(100 * x) / 100
			solu.setAttributeNS(null,"visibility","visible")
		}
		else
		{
			sol1.firstChild.data = "No real value"
			sol2.firstChild.data = "No real value"
			solu.setAttributeNS(null,"visibility","hidden")
		}		
	}
}

