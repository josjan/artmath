var click = false
var clip_p = new Array([0,0],[0,0])
var sol_poly = new Array()

function init_intersegmentcubic(evt)
{
	x1 = 178
	y1 = 101
	x2 = 467
	y2 = 421	
	x3 = 525
	y3 = 125
	x4 = 175
	y4 = 374
	x5 = 350
	y5 = 75
	x6 = 350
	y6 = 450
	a = svgdoc.getElementById("a")
	b = svgdoc.getElementById("b")
	c = svgdoc.getElementById("c")
	d = svgdoc.getElementById("d")
	e = svgdoc.getElementById("e")
	f = svgdoc.getElementById("f")
	m1 = svgdoc.getElementById("m1")
	m2 = svgdoc.getElementById("m2")
	m3 = svgdoc.getElementById("m3")
	p1 = svgdoc.getElementById("p1")
	p2 = svgdoc.getElementById("p2")
	p3 = svgdoc.getElementById("p3")
	p4 = svgdoc.getElementById("p4")
	p5 = svgdoc.getElementById("p5")
	p6 = svgdoc.getElementById("p6")
	p7 = svgdoc.getElementById("p7")
	p8 = svgdoc.getElementById("p8")
	p9 = svgdoc.getElementById("p9")
	line1 = svgdoc.getElementById("line1")
	cubic = svgdoc.getElementById("cubic")
	inter = svgdoc.getElementById("inter")
	intersegmentcubic_calcul()
}

function intersegmentcubic_move(evt)
{
	if (click)
		{
			xm = coordo_x(evt.clientX)
			ym = coordo_y(evt.clientY)
			cible = evt.target.getAttributeNS(null,"id")
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
			if (cible == "p6")
				{ 
				x6 = xm
				y6 = ym
				}
			intersegmentcubic_calcul()
		}
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


function intersegmentcubic_calcul()
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
	p6.setAttributeNS(null,"cx",x6)
	p6.setAttributeNS(null,"cy",y6)
	line1.setAttributeNS(null,"x1",x1)	
	line1.setAttributeNS(null,"y1",y1)	
	line1.setAttributeNS(null,"x2",x2)	
	line1.setAttributeNS(null,"y2",y2)	
	str = "M" + x3 + "," + y3 +"C" + x5 + "," + y5 + " " + x6 + "," + y6 + " " + x4 + "," + y4
	cubic.setAttributeNS(null,"d",str)	
	a.setAttributeNS(null,"x",x1)
	a.setAttributeNS(null,"y",y1)
	b.setAttributeNS(null,"x",x2)
	b.setAttributeNS(null,"y",y2)
	c.setAttributeNS(null,"x",x3)
	c.setAttributeNS(null,"y",y3)
	d.setAttributeNS(null,"x",x4)
	d.setAttributeNS(null,"y",y4)
	e.setAttributeNS(null,"x",x5)
	e.setAttributeNS(null,"y",y5)
	f.setAttributeNS(null,"x",x6)
	f.setAttributeNS(null,"y",y6)
	a13 = x4 - 3 * x6 + 3 * x5 - x3
	a12 = 3 * x6 - 6 * x5 + 3 * x3
	a11 = 3 * x5 - 3 * x3
	a10 = x3
	a23 = y4 - 3 * y6 + 3 * y5 - y3
	a22 = 3 * y6 - 6 * y5 + 3 * y3
	a21 = 3 * y5 - 3 * y3
	a20 = y3
	b11 = x2 - x1
	b10 = x1
	b21 = y2 - y1
	b20 = y1
	a01 = b21 * a13 - b11 * a23
	b01 = b21 * a12 - b11 * a22
	c01 = b21 * a11 - b11 * a21
	d01 = b21 * ( a10 - b10 ) - b11 * ( a20 - b20 )
	solve_cubic(a01,b01,c01,d01)
	for ( i = 1 ; i < 4 ; i++)
	{
		eval("p" + (6 + i).toString() + ".setAttributeNS(null,'cx','-50')")
		eval("p" + (6 + i).toString() + ".setAttributeNS(null,'cy','-50')")
		eval("m" + i.toString() + ".setAttributeNS(null,'x','-50')")
		eval("m" + i.toString() + ".setAttributeNS(null,'y','-50')")
	}

	if ( nb_sol > 0 )
	{
		nb_solu = 0
		for ( i = 0 ; i < nb_sol ; i ++)
		{
		if ((sol_poly[i] >= 0) && (sol_poly[i] <= 1))
		{
		if ( b11 != 0)
			k = ( a13 * sol_poly[i] * sol_poly[i] * sol_poly[i] + a12 * sol_poly[i] * sol_poly[i] + a11 * sol_poly[i] + a10 - b10 ) / b11
		else
			k = ( a23 * sol_poly[i] * sol_poly[i] * sol_poly[i] + a22 * sol_poly[i] * sol_poly[i] + a21 * sol_poly[i] + a20 - b20 ) / b21
		if ((k >= 0)&&(k <= 1))
			{
			nb_solu += 1
			x7 = x1 + k * (x2 - x1)
			y7 = y1 + k * (y2 - y1)
			eval("p" + (6 + nb_solu).toString() + ".setAttributeNS(null,'cx','"+ x7 + "')")
			eval("p" + (6 + nb_solu).toString() + ".setAttributeNS(null,'cy','" + y7 + "')")
			eval("m" + nb_solu.toString() + ".setAttributeNS(null,'x','" + x7 + "')")
			eval("m" + nb_solu.toString() + ".setAttributeNS(null,'y','" + y7 + "')")
			}
		}
		}
	}
	if (nb_solu > 0 )
		inter.setAttributeNS(null,"visibility","visible")
	else
		inter.setAttributeNS(null,"visibility","hidden")
}


function init_unionpolygons(evt)
{
	P1_x = [225,175,350,450,425]
	P1_y = [150,300,425,275,175]
	P1_nbpts = 5
	polygo1 = svgdoc.getElementById("polygo1")	
	P2_x = [275,175,250,475]
	P2_y = [125,250,300,225]
	P2_nbpts = 4
	polygo2 = svgdoc.getElementById("polygo2")	
	polygo3 = svgdoc.getElementById("polygo3")	
	choice = svgdoc.getElementById("choice")	
	type_inter = 1
	debut = true
	interpolygons_calcul()
	debut = false
}

function init_lineinter(evt)
{
	x1 = 200
	y1 = 400
	x2 = 300
	y2 = 200	
	x3 = 400
	y3 = 400
	x4 = 100
	y4 = 200
	v1 = svgdoc.getElementById("v1")
	v2 = svgdoc.getElementById("v2")
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
	xya = svgdoc.getElementById("xya")
	xyb = svgdoc.getElementById("xyb")
	xyc = svgdoc.getElementById("xyc")
	xyd = svgdoc.getElementById("xyd")
	xym = svgdoc.getElementById("xym")
	vxt = svgdoc.getElementById("vxt")
	vyt = svgdoc.getElementById("vyt")
	vxt2 = svgdoc.getElementById("vxt2")
	vyt2 = svgdoc.getElementById("vyt2")
	ut = svgdoc.getElementById("ut")
	ut2 = svgdoc.getElementById("ut2")
	lineinter_calcul()
}

function lineinter_move(evt)
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
			lineinter_calcul()
		}
}

function clip_line2(u,v,w)
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

function lineinter_calcul()
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
	xA = parseInt(4 * (x1 - 350)) / 100
	yA = parseInt(4 * (350 - y1)) / 100
	xB = parseInt(4 * (x2 - 350)) / 100
	yB = parseInt(4 * (350 - y2)) / 100
	xC = parseInt(4 * (x3 - 350)) / 100
	yC = parseInt(4 * (350 - y3)) / 100
	xD = parseInt(4 * (x4 - 350)) / 100
	yD = parseInt(4 * (350 - y4)) / 100
	uX = parseInt(4 * (x2 - x1)) / 100
	uY = parseInt(4 * (y1 - y2)) / 100
	u0 = uY
	v0 = - uX
	w0 = - xA * uY + yA * uX
	clip_line2(u0,v0,w0)
	v1.setAttributeNS(null,"x1",clip_p[0][0] * 25 + 350)
	v1.setAttributeNS(null,"x2",clip_p[1][0] * 25 + 350)
	v1.setAttributeNS(null,"y1",350 - clip_p[0][1] * 25)
	v1.setAttributeNS(null,"y2",350 - clip_p[1][1] * 25)
	xya.firstChild.data = xA + " ; " + yA
	xyb.firstChild.data = xB + " ; " + yB
	xyc.firstChild.data = xC + " ; " + yC
	xyd.firstChild.data = xD + " ; " + yD
	vxt.firstChild.data = uX
	vyt.firstChild.data = uY
	if ( u0 == 0 )
		streq = ""
	else
		streq = u0 + "* x "
	if ( v0 != 0 )
		if ( v0 > 0 )
			streq += "+ " + v0 + " * y "
		else
			streq += v0 + " * y "
	if ( w0 != 0 )
		if ( w0 > 0 )
			streq += "+ " + parseInt(100 * w0) / 100
		else
			streq += parseInt(100 * w0) / 100 
	streq += " = 0"
	ut.firstChild.data = streq
	uX = parseInt(4 * (x4 - x3)) / 100
	uY = parseInt(4 * (y3 - y4)) / 100
	u = uY
	v = - uX
	w = - xC * uY + yC * uX
	clip_line2(u,v,w)
	v2.setAttributeNS(null,"x1",clip_p[0][0] * 25 + 350)
	v2.setAttributeNS(null,"x2",clip_p[1][0] * 25 + 350)
	v2.setAttributeNS(null,"y1",350 - clip_p[0][1] * 25)
	v2.setAttributeNS(null,"y2",350 - clip_p[1][1] * 25)
	vxt2.firstChild.data = uX
	vyt2.firstChild.data = uY
	if ( u == 0 )
		streq = ""
	else
		streq = u + "* x "
	if ( v != 0 )
		if ( v > 0 )
			streq += "+ " + v + " * y "
		else
			streq += v + " * y "
	if ( w != 0 )
		if ( w > 0 )
			streq += "+ " + parseInt(100 * w) / 100
		else
			streq += parseInt(100 * w) / 100 
	streq += " = 0"
	ut2.firstChild.data = streq
	det = u0 * v - u * v0
	if (det != 0)
	{
		xM = (v0 * w - v * w0 ) / det
		yM = (w0 * u - w * u0 ) / det
		x5 = 25 * xM + 350
		y5 = 350 - 25 * yM
		p5.setAttributeNS(null,"cx",x5)
		p5.setAttributeNS(null,"cy",y5)
		xym.firstChild.data = parseInt(100 * xM) / 100 + " ; " + parseInt(yM * 100) / 100
		m.setAttributeNS(null,"x",x5)
		m.setAttributeNS(null,"y",y5)
	}
}


function init_intersegments(evt)
{
	x1 = 178
	y1 = 101
	x2 = 467
	y2 = 421	
	x3 = 525
	y3 = 125
	x4 = 175
	y4 = 374
	a = svgdoc.getElementById("a")
	b = svgdoc.getElementById("b")
	c = svgdoc.getElementById("c")
	d = svgdoc.getElementById("d")
	e = svgdoc.getElementById("e")
	p1 = svgdoc.getElementById("p1")
	p2 = svgdoc.getElementById("p2")
	p3 = svgdoc.getElementById("p3")
	p4 = svgdoc.getElementById("p4")
	p5 = svgdoc.getElementById("p5")
	line1 = svgdoc.getElementById("line1")
	line2 = svgdoc.getElementById("line2")
	inter = svgdoc.getElementById("inter")
	intersegments_calcul()
}

function intersegments_move(evt)
{
	if (click)
		{
			xm = coordo_x(evt.clientX)
			ym = coordo_y(evt.clientY)
			cible = evt.target.getAttributeNS(null,"id")
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
			intersegments_calcul()
		}
}

function intersegments_calcul()
{
	p1.setAttributeNS(null,"cx",x1)
	p1.setAttributeNS(null,"cy",y1)
	p2.setAttributeNS(null,"cx",x2)
	p2.setAttributeNS(null,"cy",y2)
	p3.setAttributeNS(null,"cx",x3)
	p3.setAttributeNS(null,"cy",y3)
	p4.setAttributeNS(null,"cx",x4)
	p4.setAttributeNS(null,"cy",y4)
	line1.setAttributeNS(null,"x1",x1)	
	line1.setAttributeNS(null,"y1",y1)	
	line1.setAttributeNS(null,"x2",x2)	
	line1.setAttributeNS(null,"y2",y2)	
	line2.setAttributeNS(null,"x1",x3)	
	line2.setAttributeNS(null,"y1",y3)	
	line2.setAttributeNS(null,"x2",x4)	
	line2.setAttributeNS(null,"y2",y4)	
	a.setAttributeNS(null,"x",x1)
	a.setAttributeNS(null,"y",y1)
	b.setAttributeNS(null,"x",x2)
	b.setAttributeNS(null,"y",y2)
	c.setAttributeNS(null,"x",x3)
	c.setAttributeNS(null,"y",y3)
	d.setAttributeNS(null,"x",x4)
	d.setAttributeNS(null,"y",y4)
	det = (x2 - x1) * (y3 - y4) - (y2 - y1) * (x3 - x4)
	k1 = ((x3 - x1) * (y3 - y4) - (y3 - y1) * (x3 - x4)) / det
	k2 = ((x2 - x1) * (y3 - y1) - (y2 - y1) * (x3 - x1)) / det
	if ((k1 > 0)&&(k1 < 1)&&(k2 > 0)&&(k2 < 1))
	{
		x5 = x1 + k1 * (x2 - x1)
		y5 = y1 + k1 * (y2 - y1)
		p5.setAttributeNS(null,"cx",x5)	
		p5.setAttributeNS(null,"cy",y5)	
		e.setAttributeNS(null,"x",x5)
		e.setAttributeNS(null,"y",y5)
		inter.setAttributeNS(null,"visibility","visible")
	}
	else
		inter.setAttributeNS(null,"visibility","hidden")
}


function init_interpolygons(evt)
{
	P1_x = [225,175,350,450,425]
	P1_y = [150,300,425,275,175]
	P1_nbpts = 5
	polygo1 = svgdoc.getElementById("polygo1")	
	P2_x = [275,175,250,475]
	P2_y = [125,250,300,225]
	P2_nbpts = 4
	polygo2 = svgdoc.getElementById("polygo2")	
	polygo3 = svgdoc.getElementById("polygo3")	
	choice = svgdoc.getElementById("choice")	
	type_inter = 0
	debut = true
	interpolygons_calcul()
	debut = false
}

function interpolygons_move(evt)
{
	if (click)
		{
			xm = coordo_x(evt.clientX)
			ym = coordo_y(evt.clientY)
			cible = evt.target.getAttributeNS(null,"id")
			type_pol = cible.substring(0,1)
			num = parseInt(cible.substring(1,cible.length))
			if (type_pol == "P")
			{
				P1_x[num] = xm
				P1_y[num] = ym
			}
			if (type_pol == "Q")
			{
				P2_x[num] = xm
				P2_y[num] = ym
			}
			evt.target.setAttributeNS(null, "cx", xm)
			evt.target.setAttributeNS(null, "cy", ym)
			node = svgdoc.getElementById("t" + cible)
			node.setAttributeNS(null, "x", xm)
			node.setAttributeNS(null, "y", ym)
			interpolygons_calcul()
		}
}

function interpolygons_click()
{
	node = svgdoc.getElementById("inter")
	svgdoc.getElementById("main").removeChild(node)
	polygo3.setAttributeNS(null, "d", "M0 0")
	click = true
}

function interpolygons_up()
{
	intersect_polygons()
	click = false
}

function interpolygons_choice(num)
{
	type_inter = num
	choice.setAttributeNS(null,"cy",520 + 25 * num)
	intersect_polygons()
}

function interpolygons_addpoint(num_poly)
{
	if (num_poly == 1 )
	{
	P1_x[P1_nbpts] = ( P1_x[0] + P1_x[P1_nbpts - 1] ) / 2
	P1_y[P1_nbpts] = ( P1_y[0] + P1_y[P1_nbpts - 1] ) / 2
	create_point(P1_x[P1_nbpts],P1_y[P1_nbpts],"pts","red","P",P1_nbpts)
	P1_nbpts += 1
	}
	else
	{
	P2_x[P2_nbpts] = ( P2_x[0] + P2_x[P2_nbpts - 1] ) / 2
	P2_y[P2_nbpts] = ( P2_y[0] + P2_y[P2_nbpts - 1] ) / 2
	create_point(P2_x[P2_nbpts],P2_y[P2_nbpts],"pts","red","Q",P2_nbpts)
	P2_nbpts += 1
	}
	interpolygons_calcul()
	intersect_polygons()
}

function interpolygons_removepoint(num_poly)
{
	if (num_poly == 1 )
	{
		if ( P1_nbpts > 3 )
		{
			P1_nbpts -= 1
			node = svgdoc.getElementById("P" + P1_nbpts.toString())
			svgdoc.getElementById("pts").removeChild(node)			
			node = svgdoc.getElementById("tP" + P1_nbpts.toString())
			svgdoc.getElementById("names").removeChild(node)			
		}
	}
	else
	{
		if ( P2_nbpts > 3 )
		{

			P2_nbpts -= 1
			node = svgdoc.getElementById("Q" + P2_nbpts.toString())
			svgdoc.getElementById("pts").removeChild(node)			
			node = svgdoc.getElementById("tQ" + P2_nbpts.toString())
			svgdoc.getElementById("names").removeChild(node)			
		}
	}
	node = svgdoc.getElementById("inter")
	svgdoc.getElementById("main").removeChild(node)
	interpolygons_calcul()
	intersect_polygons()
}

function inter_segments(x1,y1,x2,y2,x3,y3,x4,y4)
{
	det = (x2 - x1) * (y3 - y4) - (y2 - y1) * (x3 - x4)
	k1 = ((x3 - x1) * (y3 - y4) - (y3 - y1) * (x3 - x4)) / det
	k2 = ((x2 - x1) * (y3 - y1) - (y2 - y1) * (x3 - x1)) / det
	if ((k1 > 0)&&(k1 < 1)&&(k2 > 0)&&(k2 < 1))
	{
		exist_inter = true
		x_inter = x1 + k1 * (x2 - x1)
		y_inter = y1 + k1 * (y2 - y1)
		if (type_inter == 0)
			if (det < 0 )
				interior = true
			else
				interior = false
		else
			if (det > 0 )
				interior = true
			else
				interior = false
	}
	else
		exist_inter = false
		
}

function intersect_polygons()
{
	var R_x = new Array()
	var R_y = new Array()
	var R_in = new Array()
	var R_k1 = new Array()
	var R_k2 = new Array()
	var P1_list = P1_liste.split(";")
	var P2_list = P2_liste.split(";")

	if (svgdoc.getElementById("inter") == null)
	{
		node = svgdoc.createElementNS(null,"g")
		node.setAttributeNS(null,"id","inter")
		svgdoc.getElementById("main").appendChild(node)
	}
	
	P1_x[P1_nbpts] = P1_x[0]
	P1_y[P1_nbpts] = P1_y[0]
	P2_x[P2_nbpts] = P2_x[0]
	P2_y[P2_nbpts] = P2_y[0]
	inter_num = - 1
	for (i = 0 ; i < P1_nbpts ; i++)
		for ( j = 0 ; j < P2_nbpts ; j++ )
		{
		inter_segments(P1_x[i],P1_y[i],P1_x[i + 1],P1_y[i + 1],P2_x[j],P2_y[j],P2_x[j + 1],P2_y[j + 1])	
		if (exist_inter)
			{
			inter_num += 1
			R_x[inter_num] = x_inter
			R_y[inter_num] = y_inter
			R_k1[inter_num] = k1
			R_k2[inter_num] = k2
			R_in[inter_num] = interior
			l = 0
			while (P1_list[ l ] != "P" + i.toString())
				l += 1
			if (P1_list[ l + 1 ].indexOf("P") < 0)
				{
				s = 0
				before = false
				while (!before)
					{
					s += 1
					if (P1_list[ l + s ].indexOf("P") < 0)
					{
					num_I = parseInt(P1_list[ l + s ].substring(1,P1_list[ l + s ].length))
					if (R_k1[inter_num] < R_k1[num_I])	
						before = true
					}
					else
						before = true

					}
				l += s - 1						
				}
			for ( m = P1_list.length ; m > l ; m-- )
				P1_list[ m ] = P1_list[ m - 1 ]
			P1_list[ l + 1 ] = "I" + inter_num.toString()
			l = 0
			while (P2_list[ l ] != "Q" + j.toString())
				l += 1
			if (P2_list[ l + 1 ].indexOf("Q") < 0)
				{
				s = 0
				before = false
				while (!before)
					{
					s += 1
					if (P2_list[ l + s ].indexOf("Q") < 0)
					{
					num_I = parseInt(P2_list[ l + s ].substring(1,P2_list[ l + s ].length))
					if (R_k2[inter_num] < R_k2[num_I])	
						before = true
					}
					else
						before = true
					}
				l += s - 1						
				}
			for ( m = P2_list.length ; m > l + 1 ; m-- )
				P2_list[ m ] = P2_list[ m - 1 ]
			P2_list[ l + 1 ] = "I" + inter_num.toString()
				create_point(R_x[inter_num],R_y[inter_num],"inter","blue","I",inter_num)
			}
		}


	if (inter_num > - 1)
	{
	i = 0
	var enterList = ""
	while (i < P1_list.length)
	{
		if (P1_list[ i ].indexOf("P") == -1)
		{
			num_I = parseInt(P1_list[ i ].substring(1,P1_list[ i ].length))
			interior = R_in[num_I]
			if (interior)
				enterList += "I" + num_I.toString()
		}
		i += 1
	}

	str = ""
	counter = 0
	counter2 = 0
	while ( enterList != "")
	{
	if ( enterList.indexOf("I",1) > 0 )
		begin_pt = enterList.substring(0,enterList.indexOf("I",1))
	else
		begin_pt = enterList
	num_I = parseInt(begin_pt.substring(1,begin_pt.length))
	enterList = enterList.substring(begin_pt.length - 1,enterList.length)
	str += "M" + R_x[num_I] + "," + R_y[num_I] + " "
	i = 0
	while (P1_list[ i ]!= begin_pt)
		i += 1		
	next_pt = ""
	liste_num = 1
	i += 1
	while (next_pt != begin_pt)
	{
	if (liste_num == 1)
		{
			if (P1_list[ i ].indexOf("P") > - 1)
				while (P1_list[ i ].indexOf("P") > - 1)
				{
				num_I = parseInt(P1_list[ i ].substring(1,P1_list[ i ].length))
				str += "L" + P1_x[num_I] + "," + P1_y[num_I] + " "				
				i = (i + 1) % (P1_list.length - 1)
				}
			num_I = parseInt(P1_list[ i ].substring(1,P1_list[ i ].length))
			next_pt = "I" + num_I.toString()
			interior = R_in[num_I]
			if (!interior)
			{
				liste_num = 2			
				i = 0
				while (P2_list[ i ]!= next_pt)
					i += 1		
				i += 1
			}
			else
			{
				deb_efface = enterList.indexOf(next_pt)
				debList = enterList.substring(0,deb_efface) 
				finList = enterList.substring(deb_efface + next_pt.length,enterList.length)
				enterList = debList + finList
			}
		}
		else
		{	
			if (P2_list[ i ].indexOf("Q") > - 1)
				while (P2_list[ i ].indexOf("Q") > -1)
				{
					num_I = parseInt(P2_list[ i ].substring(1,P2_list[ i ].length))
					str += "L" + P2_x[num_I] + "," + P2_y[num_I] + " "				
				i = (i + 1) % (P2_list.length - 1)
				}
			num_I = parseInt(P2_list[ i ].substring(1,P2_list[ i ].length))
			next_pt = "I" + num_I.toString()
			interior = R_in[num_I]
			if (interior)
			{
				if (enterList != "")
				{	
					deb_efface = enterList.indexOf(next_pt)
					debList = enterList.substring(0,deb_efface) 
					finList = enterList.substring(deb_efface + next_pt.length,enterList.length)
					enterList = debList + finList
				}
				liste_num = 1			
				i = 0
				while (P1_list[ i ]!= next_pt)
					i += 1		
				i += 1
			}
		}
		str += "L" + R_x[num_I] + "," + R_y[num_I] + " "
		counter += 1
		if (counter > 30)
			return
	}
	str += "z"
	counter2 += 1
	if (counter2 > 10)
			return
	}
	polygo3.setAttributeNS(null,"d",str)
	}
	else
// pas d'intersections ....
	{


	}
}	


function interpolygons_calcul()
{
	str = ""
	P1_liste = ""
	for ( i = 0 ; i < P1_nbpts ; i++)
	{
		str += P1_x[i] + "," + P1_y[i] + " "
		P1_liste += "P" + i.toString() + ";"
		if (debut)
			create_point(P1_x[i],P1_y[i],"pts","red","P",i)
	}
	P1_liste += "P" + P1_nbpts.toString() 
	polygo1.setAttributeNS(null,"points",str)
	str = ""
	P2_liste = ""
	for ( i = 0 ; i < P2_nbpts ; i++)
	{
		str += P2_x[i] + "," + P2_y[i] + " "
		P2_liste += "Q" + i.toString() + ";"
		if (debut)
			create_point(P2_x[i],P2_y[i],"pts","red","Q",i)
	}
	P2_liste += "Q" + P2_nbpts.toString() 
	polygo2.setAttributeNS(null,"points",str)
	if (debut)
		intersect_polygons()	
}

function create_point(x,y,group,color,letter,number)
{
	var str1 = "<circle cx='" + x + "' cy='" + y + "' id='" + letter + number.toString() + "' r='4' fill='" + color +"'/>"
	node = parseXML(str1,svgdoc)
	svgdoc.getElementById(group).appendChild(node)
	str1 = "<text id='t" + letter + number.toString() + "' style='text-anchor:middle;font-size:15;fill:blue' x='"
	str1 += x +"' y='" + y + "' dx='15' dy='15'>"
	str1 += letter + "<tspan baseline-shift='sub' font-size='9'>" + number + "</tspan></text>"
	node = parseXML(str1,svgdoc)
	if (letter != "I")
		svgdoc.getElementById("names").appendChild(node)
	else
		svgdoc.getElementById("inter").appendChild(node)


}


function init_interlinecircle(evt)
{
	x1 = 350
	y1 = 75
	x2 = 450
	y2 = 425	
	x4 = 200
	y4 = 350
	x3 = 325
	y3 = 275
	a = svgdoc.getElementById("a")
	b = svgdoc.getElementById("b")
	w = svgdoc.getElementById("w")
	c = svgdoc.getElementById("c")
	e = svgdoc.getElementById("e")
	f = svgdoc.getElementById("f")
	p1 = svgdoc.getElementById("p1")
	p2 = svgdoc.getElementById("p2")
	p3 = svgdoc.getElementById("p3")
	p4 = svgdoc.getElementById("p4")
	p5 = svgdoc.getElementById("p5")
	p6 = svgdoc.getElementById("p6")
	circ1 = svgdoc.getElementById("circ1")
	line1 = svgdoc.getElementById("line1")
	inter = svgdoc.getElementById("inter")
	interlinecircle_calcul()
}

function interlinecircle_move(evt)
{
	if (click)
		{
			xm = coordo_x(evt.clientX)
			ym = coordo_y(evt.clientY)
			cible = evt.target.getAttributeNS(null,"id")
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
			interlinecircle_calcul()
		}
}

function clip_line(u,v,w)
{
	max_x = 14
	max_y = 12
	min_x = -14
	min_y = -12
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


function interlinecircle_calcul()
{
	p1.setAttributeNS(null,"cx",x1)
	p1.setAttributeNS(null,"cy",y1)
	p2.setAttributeNS(null,"cx",x2)
	p2.setAttributeNS(null,"cy",y2)
	xA = (x1 - 350) / 25
	yA = (300 - y1 ) / 25
	xB = (x2 - 350) / 25
	yB = (300 - y2 ) / 25
	xW = (x3 - 350) / 25
	yW = (300 - y3 ) / 25
	xC = (x4 - 350) / 25
	yC = (300 - y4 ) / 25
	u1 = yB - yA
	v1 = xA - xB
	w1 = - u1 * xA - v1 * yA
	clip_line(u1,v1,w1)
	line1.setAttributeNS(null,"x1",350 + clip_p[0][0] * 25)	
	line1.setAttributeNS(null,"y1",300 - clip_p[0][1] * 25)	
	line1.setAttributeNS(null,"x2",350 + clip_p[1][0] * 25)	
	line1.setAttributeNS(null,"y2",300 - clip_p[1][1] * 25)	
	p3.setAttributeNS(null,"cx",x3)
	p3.setAttributeNS(null,"cy",y3)
	p4.setAttributeNS(null,"cx",x4)
	p4.setAttributeNS(null,"cy",y4)
	a.setAttributeNS(null,"x",x1)
	a.setAttributeNS(null,"y",y1)
	b.setAttributeNS(null,"x",x2)
	b.setAttributeNS(null,"y",y2)
	w.setAttributeNS(null,"x",x3)
	w.setAttributeNS(null,"y",y3)
	c.setAttributeNS(null,"x",x4)
	c.setAttributeNS(null,"y",y4)
	r = Math.sqrt ((xC - xW) * (xC - xW) + (yC - yW) * (yC - yW)) 
	circ1.setAttributeNS(null,"cx",x3)
	circ1.setAttributeNS(null,"cy",y3)
	circ1.setAttributeNS(null,"r",25 * r)		
	dist = - (u1 * xW + v1 * yW + w1) / Math.sqrt(u1 * u1 + v1 * v1)
	if ( Math.abs(dist) <= r )
	{
		ag1 = Math.acos(u1 /  Math.sqrt(u1 * u1 + v1 * v1) )
		if ( v1 > 0)	
			ag1 = - ag1
		ag2 = Math.acos( dist / r )
		xE = xW + r * Math.cos(ag2 - ag1)
		yE = yW + r * Math.sin(ag2 - ag1)
		xF = xW + r * Math.cos(- ag2 - ag1)
		yF = yW + r * Math.sin(- ag2 - ag1)
		p5.setAttributeNS(null,"cx",350 + xE * 25)	
		p5.setAttributeNS(null,"cy",300 - yE * 25)	
		e.setAttributeNS(null,"x",350 + xE * 25)	
		e.setAttributeNS(null,"y",300 - yE * 25)	
		p6.setAttributeNS(null,"cx",350 + xF * 25)	
		p6.setAttributeNS(null,"cy",300 - yF * 25)	
		f.setAttributeNS(null,"x",350 + xF * 25)	
		f.setAttributeNS(null,"y",300 - yF * 25)	
				
		inter.setAttributeNS(null,"visibility","visible")
	}
	else
	{
		inter.setAttributeNS(null,"visibility","hidden")
	}
}


function init_interdisks(evt)
{
	x1 = 475
	y1 = 250
	x2 = 350
	y2 = 200	
	x4 = 200
	y4 = 350
	x3 = 325
	y3 = 275
	a = svgdoc.getElementById("a")
	b = svgdoc.getElementById("b")
	w = svgdoc.getElementById("w")
	c = svgdoc.getElementById("c")
	e = svgdoc.getElementById("e")
	f = svgdoc.getElementById("f")
	p1 = svgdoc.getElementById("p1")
	p2 = svgdoc.getElementById("p2")
	p3 = svgdoc.getElementById("p3")
	p4 = svgdoc.getElementById("p4")
	p5 = svgdoc.getElementById("p5")
	p6 = svgdoc.getElementById("p6")
	circ1 = svgdoc.getElementById("circ1")
	circ2 = svgdoc.getElementById("circ2")
	lunule = svgdoc.getElementById("lunule")
	inter = svgdoc.getElementById("inter")
	interdisks_calcul()
}

function interdisks_move(evt)
{
	if (click)
		{
			xm = coordo_x(evt.clientX)
			ym = coordo_y(evt.clientY)
			cible = evt.target.getAttributeNS(null,"id")
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
			interdisks_calcul()
		}
}



function interdisks_calcul()
{
	p1.setAttributeNS(null,"cx",x1)
	p1.setAttributeNS(null,"cy",y1)
	p2.setAttributeNS(null,"cx",x2)
	p2.setAttributeNS(null,"cy",y2)
	xW2 = (x1 - 350) / 25
	yW2 = (300 - y1 ) / 25
	xB = (x2 - 350) / 25
	yB = (300 - y2 ) / 25
	xW1 = (x3 - 350) / 25
	yW1 = (300 - y3 ) / 25
	xC = (x4 - 350) / 25
	yC = (300 - y4 ) / 25
	p3.setAttributeNS(null,"cx",x3)
	p3.setAttributeNS(null,"cy",y3)
	p4.setAttributeNS(null,"cx",x4)
	p4.setAttributeNS(null,"cy",y4)
	a.setAttributeNS(null,"x",x1)
	a.setAttributeNS(null,"y",y1)
	b.setAttributeNS(null,"x",x2)
	b.setAttributeNS(null,"y",y2)
	w.setAttributeNS(null,"x",x3)
	w.setAttributeNS(null,"y",y3)
	c.setAttributeNS(null,"x",x4)
	c.setAttributeNS(null,"y",y4)
	r1 = Math.sqrt ((xC - xW1) * (xC - xW1) + (yC - yW1) * (yC - yW1)) 
	circ1.setAttributeNS(null,"cx",x3)
	circ1.setAttributeNS(null,"cy",y3)
	circ1.setAttributeNS(null,"r",25 * r1)		
	r2 = Math.sqrt ((xB - xW2) * (xB - xW2) + (yB - yW2) * (yB - yW2)) 
	circ2.setAttributeNS(null,"cx",x1)
	circ2.setAttributeNS(null,"cy",y1)
	circ2.setAttributeNS(null,"r",25 * r2)		
	dist = Math.sqrt((xW1 - xW2) * (xW1 - xW2) + (yW1 - yW2) * (yW1 - yW2))
	if ((dist < r1 + r2)&&(dist > Math.abs(r1 - r2)))
	{
		u1 = xW1 - xW2
		v1 = yW1 - yW2
		w1 = (xW2 * xW2 + yW2 * yW2 + r1 * r1 - r2 * r2 - xW1 * xW1 - yW1 * yW1) / 2
		dist2 = - (u1 * xW1 + v1 * yW1 + w1) / Math.sqrt(u1 * u1 + v1 * v1)
		ag1 = Math.acos(u1 /  Math.sqrt(u1 * u1 + v1 * v1) )
		if ( v1 > 0)	
			ag1 = - ag1
		ag2 = Math.acos( dist2 / r1 )
		xE = xW1 + r1 * Math.cos(ag2 - ag1)
		yE = yW1 + r1 * Math.sin(ag2 - ag1)
		xF = xW1 + r1 * Math.cos(- ag2 - ag1)
		yF = yW1 + r1 * Math.sin(- ag2 - ag1)
		p5.setAttributeNS(null,"cx",350 + xE * 25)	
		p5.setAttributeNS(null,"cy",300 - yE * 25)	
		e.setAttributeNS(null,"x",350 + xE * 25)	
		e.setAttributeNS(null,"y",300 - yE * 25)	
		p6.setAttributeNS(null,"cx",350 + xF * 25)	
		p6.setAttributeNS(null,"cy",300 - yF * 25)	
		f.setAttributeNS(null,"x",350 + xF * 25)	
		f.setAttributeNS(null,"y",300 - yF * 25)	
		inter.setAttributeNS(null,"visibility","visible")
		if (ag2 <= Math.PI / 2)
			sweep1 = 1
		else
			sweep1 = 0
		dist3 = - (u1 * xW2 + v1 * yW2 + w1) / Math.sqrt(u1 * u1 + v1 * v1)
		ag3 = Math.acos( dist3 / r2 )
		if (ag3 <= Math.PI / 2)
			sweep2 = 0
		else
			sweep2 = 1
		str = "M" + (350 + xE * 25) +","+ (300 - yE * 25) + "A" + (r1 * 25) + "," + (r1 * 25) + " 0 " + sweep1 + " 0 "
		str += (350 + xF * 25) +","+ (300 - yF * 25) + "A" + (r2 * 25) + "," + (r2 * 25) + " 0 " + sweep2 + " 0 "
		str += (350 + xE * 25) +","+ (300 - yE * 25)+ " z"
		lunule.setAttributeNS(null,"d",str)
		lunule.setAttributeNS(null,"visibility","visible")
	}
	else
	{
		inter.setAttributeNS(null,"visibility","hidden")
		if (dist < r1 + r2)
		{
			if ( r1 < r2)
			{
				str = "M" + (350 + xW1 * 25 + r1 * 25) + "," + (300 - yW1 * 25) + "A" + (r1 * 25) + "," + (r1 * 25) +" 0 0 0 "
				str += (350 + xW1 * 25 - r1 * 25) + "," + (300 - yW1 * 25) + "A" + (r1 * 25) + "," + (r1 * 25) +" 0 0 0 "
				str += (350 + xW1 * 25 + r1 * 25) + "," + (300 - yW1 * 25) + "z"			
			}
			else
			{
				str = "M" + (350 + xW2 * 25 + r2 * 25) + "," + (300 - yW2 * 25) + "A" + (r2 * 25) + "," + (r2 * 25) +" 0 0 0 "
				str += (350 + xW2 * 25 - r2 * 25) + "," + (300 - yW2 * 25) + "A" + (r2 * 25) + "," + (r2 * 25) +" 0 0 0 "
				str += (350 + xW2 * 25 + r2 * 25) + "," + (300 - yW2 * 25) + "z"			
			}
			lunule.setAttributeNS(null,"d",str)
			lunule.setAttributeNS(null,"visibility","visible")
		}
		else
			lunule.setAttributeNS(null,"visibility","hidden")
	}
}


function init_intercircles(evt)
{
	x1 = 475
	y1 = 250
	x2 = 350
	y2 = 200	
	x4 = 200
	y4 = 350
	x3 = 325
	y3 = 275
	a = svgdoc.getElementById("a")
	b = svgdoc.getElementById("b")
	w = svgdoc.getElementById("w")
	c = svgdoc.getElementById("c")
	e = svgdoc.getElementById("e")
	f = svgdoc.getElementById("f")
	p1 = svgdoc.getElementById("p1")
	p2 = svgdoc.getElementById("p2")
	p3 = svgdoc.getElementById("p3")
	p4 = svgdoc.getElementById("p4")
	p5 = svgdoc.getElementById("p5")
	p6 = svgdoc.getElementById("p6")
	circ1 = svgdoc.getElementById("circ1")
	circ2 = svgdoc.getElementById("circ2")
	inter = svgdoc.getElementById("inter")
	intercircles_calcul()
}

function intercircles_move(evt)
{
	if (click)
		{
			xm = coordo_x(evt.clientX)
			ym = coordo_y(evt.clientY)
			cible = evt.target.getAttributeNS(null,"id")
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
			intercircles_calcul()
		}
}



function intercircles_calcul()
{
	p1.setAttributeNS(null,"cx",x1)
	p1.setAttributeNS(null,"cy",y1)
	p2.setAttributeNS(null,"cx",x2)
	p2.setAttributeNS(null,"cy",y2)
	xW2 = (x1 - 350) / 25
	yW2 = (300 - y1 ) / 25
	xB = (x2 - 350) / 25
	yB = (300 - y2 ) / 25
	xW1 = (x3 - 350) / 25
	yW1 = (300 - y3 ) / 25
	xC = (x4 - 350) / 25
	yC = (300 - y4 ) / 25
	p3.setAttributeNS(null,"cx",x3)
	p3.setAttributeNS(null,"cy",y3)
	p4.setAttributeNS(null,"cx",x4)
	p4.setAttributeNS(null,"cy",y4)
	a.setAttributeNS(null,"x",x1)
	a.setAttributeNS(null,"y",y1)
	b.setAttributeNS(null,"x",x2)
	b.setAttributeNS(null,"y",y2)
	w.setAttributeNS(null,"x",x3)
	w.setAttributeNS(null,"y",y3)
	c.setAttributeNS(null,"x",x4)
	c.setAttributeNS(null,"y",y4)
	r1 = Math.sqrt ((xC - xW1) * (xC - xW1) + (yC - yW1) * (yC - yW1)) 
	circ1.setAttributeNS(null,"cx",x3)
	circ1.setAttributeNS(null,"cy",y3)
	circ1.setAttributeNS(null,"r",25 * r1)		
	r2 = Math.sqrt ((xB - xW2) * (xB - xW2) + (yB - yW2) * (yB - yW2)) 
	circ2.setAttributeNS(null,"cx",x1)
	circ2.setAttributeNS(null,"cy",y1)
	circ2.setAttributeNS(null,"r",25 * r2)		
	dist = Math.sqrt((xW1 - xW2) * (xW1 - xW2) + (yW1 - yW2) * (yW1 - yW2))
	if ((dist < r1 + r2)&&(dist > Math.abs(r1 - r2)))
	{
		u1 = xW1 - xW2
		v1 = yW1 - yW2
		w1 = (xW2 * xW2 + yW2 * yW2 + r1 * r1 - r2 * r2 - xW1 * xW1 - yW1 * yW1) / 2
		dist2 = - (u1 * xW1 + v1 * yW1 + w1) / Math.sqrt(u1 * u1 + v1 * v1)
		ag1 = Math.acos(u1 /  Math.sqrt(u1 * u1 + v1 * v1) )
		if ( v1 > 0)	
			ag1 = - ag1
		ag2 = Math.acos( dist2 / r1 )
		xE = xW1 + r1 * Math.cos(ag2 - ag1)
		yE = yW1 + r1 * Math.sin(ag2 - ag1)
		xF = xW1 + r1 * Math.cos(- ag2 - ag1)
		yF = yW1 + r1 * Math.sin(- ag2 - ag1)
		p5.setAttributeNS(null,"cx",350 + xE * 25)	
		p5.setAttributeNS(null,"cy",300 - yE * 25)	
		e.setAttributeNS(null,"x",350 + xE * 25)	
		e.setAttributeNS(null,"y",300 - yE * 25)	
		p6.setAttributeNS(null,"cx",350 + xF * 25)	
		p6.setAttributeNS(null,"cy",300 - yF * 25)	
		f.setAttributeNS(null,"x",350 + xF * 25)	
		f.setAttributeNS(null,"y",300 - yF * 25)	
		inter.setAttributeNS(null,"visibility","visible")
	}
	else
	{
		inter.setAttributeNS(null,"visibility","hidden")
	}
}


function init_intersegmentquadra(evt)
{
	x1 = 178
	y1 = 101
	x2 = 467
	y2 = 421	
	x3 = 525
	y3 = 125
	x4 = 175
	y4 = 374
	x5 = 350
	y5 = 75
	a = svgdoc.getElementById("a")
	b = svgdoc.getElementById("b")
	c = svgdoc.getElementById("c")
	d = svgdoc.getElementById("d")
	e = svgdoc.getElementById("e")
	f = svgdoc.getElementById("f")
	g = svgdoc.getElementById("g")
	p1 = svgdoc.getElementById("p1")
	p2 = svgdoc.getElementById("p2")
	p3 = svgdoc.getElementById("p3")
	p4 = svgdoc.getElementById("p4")
	p5 = svgdoc.getElementById("p5")
	p6 = svgdoc.getElementById("p6")
	p7 = svgdoc.getElementById("p7")
	line1 = svgdoc.getElementById("line1")
	quadra = svgdoc.getElementById("quadra")
	inter = svgdoc.getElementById("inter")
	intersegmentquadra_calcul()
}

function intersegmentquadra_move(evt)
{
	if (click)
		{
			xm = coordo_x(evt.clientX)
			ym = coordo_y(evt.clientY)
			cible = evt.target.getAttributeNS(null,"id")
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
			intersegmentquadra_calcul()
		}
}



function intersegmentquadra_calcul()
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
	line1.setAttributeNS(null,"x1",x1)	
	line1.setAttributeNS(null,"y1",y1)	
	line1.setAttributeNS(null,"x2",x2)	
	line1.setAttributeNS(null,"y2",y2)	
	str = "M" + x3 + "," + y3 +"Q" + x5 + "," + y5 + " " + x4 + "," + y4
	quadra.setAttributeNS(null,"d",str)	
	a.setAttributeNS(null,"x",x1)
	a.setAttributeNS(null,"y",y1)
	b.setAttributeNS(null,"x",x2)
	b.setAttributeNS(null,"y",y2)
	c.setAttributeNS(null,"x",x3)
	c.setAttributeNS(null,"y",y3)
	d.setAttributeNS(null,"x",x4)
	d.setAttributeNS(null,"y",y4)
	e.setAttributeNS(null,"x",x5)
	e.setAttributeNS(null,"y",y5)
	a12 = x3 - 2 * x5 + x4
	a11 = 2 * x5 - 2 * x3
	a10 = x3
	a22 = y3 - 2 * y5 + y4
	a21 = 2 * y5 - 2 * y3
	a20 = y3
	b11 = x2 - x1
	b10 = x1
	b21 = y2 - y1
	b20 = y1
	a01 = b21 * a12 - b11 * a22
	b01 = b21 * a11 - b11 * a21
	c01 = b21 * ( a10 - b10 ) - b11 * ( a20 - b20 )
	var solu = new Array()
	if ( a01 != 0 )
	{
	discrim = b01 * b01 - 4 * a01 * c01
	nb_sol = 0
	nb_solu = 0
	if ( discrim > 0 )
	{
		solu[0] = ( - b01 - Math.sqrt(discrim)) / ( 2 * a01 )	
		solu[1] = ( - b01 + Math.sqrt(discrim)) / ( 2 * a01 )
		nb_sol = 2
	}
	else
	if ( discrim == 0)
	{
		solu[0] = - b01 / ( 2 * a01 )	
		nb_sol = 1
	}
	}
	else
	if ( b01 != 0 )
	{
		solu[0] = - c01 / b01 
		nb_sol = 1	

	}	
	if ( nb_sol > 0 )
	{
		for ( i = 0 ; i < nb_sol ; i ++)
		{
		if ((solu[i] >= 0) && (solu[i] <= 1))
		{
		if ( b11 != 0)
			k = ( a12 * solu[i] * solu[i] + a11 * solu[i] + a10 - b10 ) / b11
		else
			k = ( a22 * solu[i] * solu[i] + a21 * solu[i] + a20 - b20 ) / b21
		if ((k >= 0)&&(k <= 1))
			{
			x6 = x1 + k * (x2 - x1)
			y6 = y1 + k * (y2 - y1)
			if (nb_solu == 0)
			{
				letter ="f"
				point = "p6"
			}
			else
			{
				letter = "g"
				point = "p7"
			}
			eval(point + ".setAttributeNS(null,'cx',x6)")	
			eval(point + ".setAttributeNS(null,'cy',y6)")	
			eval(letter +".setAttributeNS(null,'x',x6)")	
			eval(letter +".setAttributeNS(null,'y',y6)")	
			nb_solu += 1
			}
		}
		}
	}
	if (nb_solu == 1)
	{
		p7.setAttributeNS(null,"cx","-50")
		p7.setAttributeNS(null,"cy","-50")
		g.setAttributeNS(null,"x","-50")
		g.setAttributeNS(null,"y","-50")
	}
	if (nb_solu > 0 )
		inter.setAttributeNS(null,"visibility","visible")
	else
		inter.setAttributeNS(null,"visibility","hidden")
}
