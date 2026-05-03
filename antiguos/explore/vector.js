var v1="",p1="",p2="",rx="",ry="",cx="",cy="",vx="",vy="",xya="",xyb="",vxt="",vyt="",vl=""
var click = false
var x1=300,y1=250,x2=425,y2=150,x3=250,y3=175,x4=350,y4=250,x0 = 200,y0 = 350,k=-1
var ag="",agt="",cursor=""

function init_barycenter(evt)
{
	x1 = 200
	y1 = 450
	x2 = 400
	y2 = 250	
	a = svgdoc.getElementById("a")
	b = svgdoc.getElementById("b")
	g = svgdoc.getElementById("g")
	p1 = svgdoc.getElementById("p1")
	p2 = svgdoc.getElementById("p2")
	p3 = svgdoc.getElementById("p3")
	ka = svgdoc.getElementById("ka")
	kb = svgdoc.getElementById("kb")
	kat = svgdoc.getElementById("kat")
	kbt = svgdoc.getElementById("kbt")
	trace = svgdoc.getElementById("trace")
	vxt = svgdoc.getElementById("vxt")
	barycenter_calcul()
}

function barycenter_move(evt)
{
	if (click)
		{
			ym = coordo_y(evt.clientY)
			cible = evt.target.getAttributeNS(null,"id")
			if (cible == "p1")
				{ 
				y1 = ym
				}
			else
				{ 
				y2 = ym
				}
			barycenter_calcul()
		}
}

function barycenter_calcul()
{
	p1.setAttributeNS(null,"cy",y1)
	p2.setAttributeNS(null,"cy",y2)
	ka.setAttributeNS(null,"y2",y1)
	kb.setAttributeNS(null,"y2",y2)
	a.setAttributeNS(null,"y",150 + y1 / 2)
	b.setAttributeNS(null,"y",150 + y2 / 2)
	k1 = ( 300 - y1) / 25
	k2 = ( 300 - y2) / 25
	if ( k1 + k2 != 0)
	{
		xG = ( 200 * k1 + 400 * k2 ) / ( k1 + k2 )
		p3.setAttributeNS(null,"cx",xG)
		g.setAttributeNS(null,"x",xG)
		str = "M400 " + y1 + "V" + y2 + "L200 " + (600 - y2) +"z M200 300V" + (600 - y2) + "L"+xG +" 300"
		trace.setAttributeNS(null,"d",str)
		xA = parseInt(4 * (xG - 50)) / 100
		vxt.firstChild.data = parseInt(xA * 100) / 100
	}
	kat.firstChild.data = k1
	kbt.firstChild.data = k2
}

function init_systvect(evt)
{
	x1 = 175
	y1 = 200
	x2 = 150
	y2 = 350
	x3 = 400
	y3 = 300
	x0 = 50
	y0 = 275	
	v1 = svgdoc.getElementById("v1")
	v2 = svgdoc.getElementById("v2")
	v3 = svgdoc.getElementById("v3")
	v2b = svgdoc.getElementById("v2b")
	v1b = svgdoc.getElementById("v1b")
	v1c = svgdoc.getElementById("v1c")
	v2c = svgdoc.getElementById("v2c")
	a = svgdoc.getElementById("a")
	b = svgdoc.getElementById("b")
	c = svgdoc.getElementById("c")
	d = svgdoc.getElementById("d")
	p0 = svgdoc.getElementById("p0")
	p1 = svgdoc.getElementById("p1")
	p2 = svgdoc.getElementById("p2")
	p3 = svgdoc.getElementById("p3")
	vxt = svgdoc.getElementById("vxt")
	vyt = svgdoc.getElementById("vyt")
	vxt2 = svgdoc.getElementById("vxt2")
	vyt2 = svgdoc.getElementById("vyt2")
	vxs = svgdoc.getElementById("vxs")
	vys = svgdoc.getElementById("vys")
	sx = svgdoc.getElementById("sx")
	sy = svgdoc.getElementById("sy")

	systvect_calcul()
}

function systvect_move(evt)
{
	if (click)
		{
			xm = coordo_x(evt.clientX)
			ym = coordo_y(evt.clientY)
			cible = evt.target.getAttributeNS(null,"id")
			if (cible == "p0")
				{ 
				x0 = xm
				y0 = ym
				}
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
			systvect_calcul()
		}
}


function systvect_calcul()
{
	p0.setAttributeNS(null,"cx",x0)
	p0.setAttributeNS(null,"cy",y0)
	p1.setAttributeNS(null,"cx",x1)
	p1.setAttributeNS(null,"cy",y1)
	p2.setAttributeNS(null,"cx",x2)
	p2.setAttributeNS(null,"cy",y2)
	p3.setAttributeNS(null,"cx",x3)
	p3.setAttributeNS(null,"cy",y3)
	v1.setAttributeNS(null,"x1",x0)
	v1.setAttributeNS(null,"y1",y0)
	v1.setAttributeNS(null,"x2",x1)
	v1.setAttributeNS(null,"y2",y1)
	v2.setAttributeNS(null,"x1",x0)
	v2.setAttributeNS(null,"y1",y0)
	v2.setAttributeNS(null,"x2",x2)
	v2.setAttributeNS(null,"y2",y2)
	v3.setAttributeNS(null,"x1",x0)
	v3.setAttributeNS(null,"y1",y0)
	v3.setAttributeNS(null,"x2",x3)
	v3.setAttributeNS(null,"y2",y3)
	uX = parseInt(4 * (x1 - x0)) / 100
	uY = parseInt(4 * (y0 - y1)) / 100
	uX2 = parseInt(4 * (x2 - x0)) / 100
	uY2 = parseInt(4 * (y0 - y2)) / 100
	uX3 = parseInt(4 * (x3 - x0)) / 100
	uY3 = parseInt(4 * (y0 - y3)) / 100
	det = uX * uY2 - uX2 * uY
	if ( det != 0 )
	{
		x = ( uX3 * uY2 - uY3 * uX2 ) / det
		y = ( uX * uY3 - uY * uX3 ) / det
		x4 = x0 + x * (x1 - x0)		
		y4 = y0 + x * (y1 - y0)		
		x5 = x0 + y * (x2 - x0)		
		y5 = y0 + y * (y2 - y0)		

	v1b.setAttributeNS(null,"x1",x0)
	v1b.setAttributeNS(null,"y1",y0)
	v1b.setAttributeNS(null,"x2",x4)
	v1b.setAttributeNS(null,"y2",y4)

	v2b.setAttributeNS(null,"x1",x0)
	v2b.setAttributeNS(null,"y1",y0)
	v2b.setAttributeNS(null,"x2",x5)
	v2b.setAttributeNS(null,"y2",y5)

	v1c.setAttributeNS(null,"x1",x3)
	v1c.setAttributeNS(null,"y1",y3)
	v1c.setAttributeNS(null,"x2",x4)
	v1c.setAttributeNS(null,"y2",y4)

	v2c.setAttributeNS(null,"x1",x3)
	v2c.setAttributeNS(null,"y1",y3)
	v2c.setAttributeNS(null,"x2",x5)
	v2c.setAttributeNS(null,"y2",y5)
	sx.firstChild.data = parseInt(100 * x) / 100
	sy.firstChild.data = parseInt(100 * y) / 100
	}
	else
	{
	sx.firstChild.data = " ? "
	sy.firstChild.data = " ? "
	}
	a.setAttributeNS(null,"x",x1)
	a.setAttributeNS(null,"y",y1)
	b.setAttributeNS(null,"x",x2)
	b.setAttributeNS(null,"y",y2)
	c.setAttributeNS(null,"x",x3)
	c.setAttributeNS(null,"y",y3)
	d.setAttributeNS(null,"x",x0)
	d.setAttributeNS(null,"y",y0)

	vxt.firstChild.data = uX
	vyt.firstChild.data = uY
	vxt2.firstChild.data = uX2
	vyt2.firstChild.data = uY2
	vxs.firstChild.data = uX3
	vys.firstChild.data = uY3
}

function init_midpoint()
{
	x1 = 200
	y1 = 400
	x2 = 400
	y2 = 200	
	x3 = 300
	y3 = 300	
	x4 = 100
	y4 = 200	
	v1 = svgdoc.getElementById("v1")
	a = svgdoc.getElementById("a")
	b = svgdoc.getElementById("b")
	m = svgdoc.getElementById("m")
	p1 = svgdoc.getElementById("p1")
	p2 = svgdoc.getElementById("p2")
	p3 = svgdoc.getElementById("p3")
	p4 = svgdoc.getElementById("p4")
	para = svgdoc.getElementById("para")
	xya = svgdoc.getElementById("xya")
	xyb = svgdoc.getElementById("xyb")
	xym = svgdoc.getElementById("xym")
	midpoint_calcul()
}

function midpoint_move(evt)
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
			if (cible == "p4")
				{ 
				x4 = xm
				y4 = ym
				}
			midpoint_calcul()
		}
}

function midpoint_calcul()
{
	x3 = ( x2 + x1 ) / 2
	y3 = ( y1 + y2 ) / 2

	p1.setAttributeNS(null,"cx",x1)
	p1.setAttributeNS(null,"cy",y1)

	p2.setAttributeNS(null,"cx",x2)
	p2.setAttributeNS(null,"cy",y2)
	p3.setAttributeNS(null,"cx",x3)
	p3.setAttributeNS(null,"cy",y3)
	p4.setAttributeNS(null,"cx",x4)
	p4.setAttributeNS(null,"cy",y4)
	v1.setAttributeNS(null,"x1",x1)
	v1.setAttributeNS(null,"x2",x2)
	v1.setAttributeNS(null,"y1",y1)
	v1.setAttributeNS(null,"y2",y2)
	a.setAttributeNS(null,"x",x1)
	a.setAttributeNS(null,"y",y1)
	b.setAttributeNS(null,"x",x2)
	b.setAttributeNS(null,"y",y2)
	m.setAttributeNS(null,"x",x3)
	m.setAttributeNS(null,"y",y3)
	xA = parseInt(4 * (x1 - 50)) / 100
	yA = parseInt(4 * (250 - y1)) / 100
	xB = parseInt(4 * (x2 - 50)) / 100
	yB = parseInt(4 * (250 - y2)) / 100
	xM = parseInt(4 * (x3 - 50)) / 100
	yM = parseInt(4 * (250 - y3)) / 100
	xya.firstChild.data = xA + " ; " + yA
	xyb.firstChild.data = xB + " ; " + yB
	xym.firstChild.data = xM + " ; " + yM
	str = "M"+ x4 + " " + y4 +"L"+x1+" "+y1+"L" + (x1 + x2 - x4) +" "+(y1 + y2 - y4)
	str += "L" + x2 +" " +y2+"zM" + x4 +" "+ y4+"L"+ (x1 + x2 - x4) +" "+(y1 + y2 - y4)
	para.setAttributeNS(null,"d",str)
}

function init_cross(evt)
{
	x3 = 200
	y3 = 150
	x4 = 325
	y4 = 125
	x1 = 250
	y1 = 175
	x2 = 350
	y2 = 200	
	x0 = 100
	y0 = 350	
	v1 = svgdoc.getElementById("v1")
	v2 = svgdoc.getElementById("v2")
	v1b = svgdoc.getElementById("v1b")
	v2b = svgdoc.getElementById("v2b")
	v1c = svgdoc.getElementById("v1c")
	v2c = svgdoc.getElementById("v2c")
	vs = svgdoc.getElementById("vs")
	a = svgdoc.getElementById("a")
	b = svgdoc.getElementById("b")
	c = svgdoc.getElementById("c")
	d = svgdoc.getElementById("d")
	p0 = svgdoc.getElementById("p0")
	p1 = svgdoc.getElementById("p1")
	p2 = svgdoc.getElementById("p2")
	p3 = svgdoc.getElementById("p3")
	p4 = svgdoc.getElementById("p4")
	ag = svgdoc.getElementById("ag")
	xya = svgdoc.getElementById("xya")
	xyb = svgdoc.getElementById("xyb")
	xyc = svgdoc.getElementById("xyc")
	xyd = svgdoc.getElementById("xyd")
	vxt = svgdoc.getElementById("vxt")
	vyt = svgdoc.getElementById("vyt")
	vl = svgdoc.getElementById("vl")	
	vxt2 = svgdoc.getElementById("vxt2")
	vyt2 = svgdoc.getElementById("vyt2")
	vl2 = svgdoc.getElementById("vl2")	
	vxs = svgdoc.getElementById("vxs")
	vys = svgdoc.getElementById("vys")
	vls = svgdoc.getElementById("vls")	

	cross_calcul()
}

function cross_move(evt)
{
	if (click)
		{
			xm = coordo_x(evt.clientX)
			ym = coordo_y(evt.clientY)

			cible = evt.target.getAttributeNS(null,"id")
			if (cible == "p0")
				{ 
				x0 = xm
				y0 = ym
				}
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
			
			cross_calcul()
		}
}


function cross_calcul()
{
	p0.setAttributeNS(null,"cx",x0)
	p0.setAttributeNS(null,"cy",y0)
	p1.setAttributeNS(null,"cx",x1)
	p1.setAttributeNS(null,"cy",y1)
	p2.setAttributeNS(null,"cx",x2)
	p2.setAttributeNS(null,"cy",y2)
	p3.setAttributeNS(null,"cx",x3)
	p3.setAttributeNS(null,"cy",y3)
	p4.setAttributeNS(null,"cx",x4)
	p4.setAttributeNS(null,"cy",y4)
	v1.setAttributeNS(null,"x1",x1)
	v1.setAttributeNS(null,"y1",y1)
	v1.setAttributeNS(null,"x2",x2)
	v1.setAttributeNS(null,"y2",y2)
	v2.setAttributeNS(null,"x1",x3)
	v2.setAttributeNS(null,"y1",y3)
	v2.setAttributeNS(null,"x2",x4)
	v2.setAttributeNS(null,"y2",y4)
	v1c.setAttributeNS(null,"x1",x0 + x4 - x3)
	v1c.setAttributeNS(null,"y1",y0 + y4 - y3)
	v1c.setAttributeNS(null,"x2",x0 + x4 - x3 + x2 - x1)
	v1c.setAttributeNS(null,"y2",y0 + y4 - y3 + y2 - y1)
	v2c.setAttributeNS(null,"x1",x0 + x2 - x1)
	v2c.setAttributeNS(null,"y1",y0 + y2 - y1)
	v2c.setAttributeNS(null,"x2",x0 + x2 - x1 + x4 - x3)
	v2c.setAttributeNS(null,"y2",y0 + y2 - y1 + y4 - y3)
	v1b.setAttributeNS(null,"x1",x0)
	v1b.setAttributeNS(null,"y1",y0)
	v1b.setAttributeNS(null,"x2",x0 + x2 - x1)
	v1b.setAttributeNS(null,"y2",y0 + y2 - y1)
	v2b.setAttributeNS(null,"x1",x0)
	v2b.setAttributeNS(null,"y1",y0)
	v2b.setAttributeNS(null,"x2",x0 + x4 - x3)
	v2b.setAttributeNS(null,"y2",y0 + y4 - y3)
	uX = parseInt(4 * (x2 - x1)) / 100
	uY = parseInt(4 * (y1 - y2)) / 100
	uX2 = parseInt(4 * (x4 - x3)) / 100
	uY2 = parseInt(4 * (y3 - y4)) / 100
	cross = uX * uY2 - uY * uX2
	vs.setAttributeNS(null,"x1",x0)
	vs.setAttributeNS(null,"y1",y0)
	vs.setAttributeNS(null,"x2",x0)
	vs.setAttributeNS(null,"y2",y0 - cross * 25)
	a.setAttributeNS(null,"x",x1)
	a.setAttributeNS(null,"y",y1)
	b.setAttributeNS(null,"x",x2)
	b.setAttributeNS(null,"y",y2)
	c.setAttributeNS(null,"x",x3)
	c.setAttributeNS(null,"y",y3)
	d.setAttributeNS(null,"x",x4)
	d.setAttributeNS(null,"y",y4)
	xA = parseInt(4 * (x1 - 50)) / 100
	yA = parseInt(4 * (250 - y1)) / 100
	xB = parseInt(4 * (x2 - 50)) / 100
	yB = parseInt(4 * (250 - y2)) / 100
	xC = parseInt(4 * (x3 - 50)) / 100
	yC = parseInt(4 * (250 - y3)) / 100
	xD = parseInt(4 * (x4 - 50)) / 100
	yD = parseInt(4 * (250 - y4)) / 100
	l_v = parseInt(100 * Math.sqrt(uX * uX + uY * uY)) / 100
	l_v2 = parseInt(100 * Math.sqrt(uX2 * uX2 + uY2 * uY2)) / 100
	xya.firstChild.data = xA + " ; " + yA
	xyb.firstChild.data = xB + " ; " + yB
	xyc.firstChild.data = xC + " ; " + yC
	xyd.firstChild.data = xD + " ; " + yD
	vxt.firstChild.data = uX
	vyt.firstChild.data = uY
	vl.firstChild.data = l_v
	vxt2.firstChild.data = uX2
	vyt2.firstChild.data = uY2
	vl2.firstChild.data = l_v2
	vxs.firstChild.data = cross
	vls.firstChild.data = Math.abs(cross)
	dp = "M" + (x0 + 75 * uX / l_v).toString() + " " + (y0 - 75 * uY / l_v).toString() 
	dp += "A 75 75 0 0 "
	if ((uX * uY2 - uX2 * uY) <= 0) 
		dp += "1 "
	else
		dp += "0 "
	dp += (x0 + 75 * uX2 / l_v2).toString() + " " + (y0 - 75 * uY2 / l_v2).toString() 
	ag.setAttributeNS(null,"d",dp)
}

function init_dot(evt)
{
	x1 = 200
	y1 = 150
	x2 = 400
	y2 = 100
	x3 = 250
	y3 = 175
	x4 = 350
	y4 = 250	
	x0 = 200
	y0 = 350	
	v1 = svgdoc.getElementById("v1")
	v2 = svgdoc.getElementById("v2")
	v1b = svgdoc.getElementById("v1b")
	v2b = svgdoc.getElementById("v2b")
	v1c = svgdoc.getElementById("v1c")
	vs = svgdoc.getElementById("vs")
	a = svgdoc.getElementById("a")
	b = svgdoc.getElementById("b")
	c = svgdoc.getElementById("c")
	d = svgdoc.getElementById("d")
	p0 = svgdoc.getElementById("p0")
	p1 = svgdoc.getElementById("p1")
	p2 = svgdoc.getElementById("p2")
	p3 = svgdoc.getElementById("p3")
	p4 = svgdoc.getElementById("p4")
	ag = svgdoc.getElementById("ag")
	xya = svgdoc.getElementById("xya")
	xyb = svgdoc.getElementById("xyb")
	xyc = svgdoc.getElementById("xyc")
	xyd = svgdoc.getElementById("xyd")
	vxt = svgdoc.getElementById("vxt")
	vyt = svgdoc.getElementById("vyt")
	vl = svgdoc.getElementById("vl")	
	vxt2 = svgdoc.getElementById("vxt2")
	vyt2 = svgdoc.getElementById("vyt2")
	vl2 = svgdoc.getElementById("vl2")	
	vxs = svgdoc.getElementById("vxs")
	vys = svgdoc.getElementById("vys")
	vls = svgdoc.getElementById("vls")
	dot_calcul()
}

function dot_move(evt)
{
	if (click)
		{
		xm = coordo_x(evt.clientX)
		ym = coordo_y(evt.clientY)
		cible = evt.target.getAttributeNS(null,"id")
			if (cible == "p0")
				{ 
				x0 = xm
				y0 = ym
				}
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
			
			dot_calcul()
		}
}


function dot_calcul()
{
	p0.setAttributeNS(null,"cx",x0)
	p0.setAttributeNS(null,"cy",y0)
	p1.setAttributeNS(null,"cx",x1)
	p1.setAttributeNS(null,"cy",y1)
	p2.setAttributeNS(null,"cx",x2)
	p2.setAttributeNS(null,"cy",y2)
	p3.setAttributeNS(null,"cx",x3)
	p3.setAttributeNS(null,"cy",y3)
	p4.setAttributeNS(null,"cx",x4)
	p4.setAttributeNS(null,"cy",y4)
	v1.setAttributeNS(null,"x1",x1)
	v1.setAttributeNS(null,"y1",y1)
	v1.setAttributeNS(null,"x2",x2)
	v1.setAttributeNS(null,"y2",y2)
	v2.setAttributeNS(null,"x1",x3)
	v2.setAttributeNS(null,"y1",y3)
	v2.setAttributeNS(null,"x2",x4)
	v2.setAttributeNS(null,"y2",y4)
	v1c.setAttributeNS(null,"x1",x0 + x4 - x3)
	v1c.setAttributeNS(null,"y1",y0 + y4 - y3)
	det = (y2 - y1) * (y2 - y1) + (x2 - x1) * (x2 - x1)
	if (Math.abs(det) > 0.001 )
	{
		xp = x0 + x4 - x3
		yp = y0 + y4 - y3
		x5 = x0 + (x2 - x1) * ((xp - x0) * (x2 - x1) + (yp - y0) * (y2 - y1)) / det
		y5 = y0 + (y2 - y1) * ((xp - x0) * (x2 - x1) + (yp - y0) * (y2 - y1)) / det
	}
	else
	{ 
		x5 = x0
		y5 = y0
	}

	v1c.setAttributeNS(null,"x2",x5)
	v1c.setAttributeNS(null,"y2",y5)
	v1b.setAttributeNS(null,"x1",x0)
	v1b.setAttributeNS(null,"y1",y0)
	v1b.setAttributeNS(null,"x2",x0 + x2 - x1)
	v1b.setAttributeNS(null,"y2",y0 + y2 - y1)
	v2b.setAttributeNS(null,"x1",x0)
	v2b.setAttributeNS(null,"y1",y0)
	v2b.setAttributeNS(null,"x2",x0 + x4 - x3)
	v2b.setAttributeNS(null,"y2",y0 + y4 - y3)
	vs.setAttributeNS(null,"x1",x0)
	vs.setAttributeNS(null,"y1",y0)
	vs.setAttributeNS(null,"x2",x5)
	vs.setAttributeNS(null,"y2",y5)
	a.setAttributeNS(null,"x",x1)
	a.setAttributeNS(null,"y",y1)
	b.setAttributeNS(null,"x",x2)
	b.setAttributeNS(null,"y",y2)
	c.setAttributeNS(null,"x",x3)
	c.setAttributeNS(null,"y",y3)
	d.setAttributeNS(null,"x",x4)
	d.setAttributeNS(null,"y",y4)

	xA = parseInt(4 * (x1 - 50)) / 100
	yA = parseInt(4 * (250 - y1)) / 100
	xB = parseInt(4 * (x2 - 50)) / 100
	yB = parseInt(4 * (250 - y2)) / 100
	xC = parseInt(4 * (x3 - 50)) / 100
	yC = parseInt(4 * (250 - y3)) / 100
	xD = parseInt(4 * (x4 - 50)) / 100
	yD = parseInt(4 * (250 - y4)) / 100
	uX = parseInt(4 * (x2 - x1)) / 100
	uY = parseInt(4 * (y1 - y2)) / 100
	uX2 = parseInt(4 * (x4 - x3)) / 100
	uY2 = parseInt(4 * (y3 - y4)) / 100
	l_v = parseInt(100 * Math.sqrt(uX * uX + uY * uY)) / 100
	l_v2 = parseInt(100 * Math.sqrt(uX2 * uX2 + uY2 * uY2)) / 100

	xya.firstChild.data = xA + " ; " + yA
	xyb.firstChild.data = xB + " ; " + yB
	xyc.firstChild.data = xC + " ; " + yC
	xyd.firstChild.data = xD + " ; " + yD
	vxt.firstChild.data = uX
	vyt.firstChild.data = uY
	vl.firstChild.data = l_v
	vxt2.firstChild.data = uX2
	vyt2.firstChild.data = uY2
	vl2.firstChild.data = l_v2
	vxs.firstChild.data = uX2 * uX + uY2 * uY
	cosi = (uX2 * uX + uY2 * uY) / (Math.sqrt(uX * uX + uY * uY) *  Math.sqrt(uX2 * uX2 + uY2 * uY2))
	vys.firstChild.data = cosi

	angle = parseInt(Math.acos(cosi) * 180 / Math.PI)
	vls.firstChild.data = angle
	dp = "M" + (x0 + 75 * uX2 / l_v2).toString() + " " + (y0 - 75 * uY2 / l_v2).toString() 
	dp += "A 75 75 0 0 "
	if ((uX * uY2 - uX2 * uY) <= 0) 
		dp += "0 "
	else
		dp += "1 "
	dp += (x0 + 75 * uX / l_v).toString() + " " + (y0 - 75 * uY / l_v).toString() 
	ag.setAttributeNS(null,"d",dp)
}

function init_sum()
{
	x1 = 200
	y1 = 150
	x2 = 400
	y2 = 100
	x3 = 250
	y3 = 175
	x4 = 350
	y4 = 250	
	x0 = 200
	y0 = 350	
	v1 = svgdoc.getElementById("v1")
	v2 = svgdoc.getElementById("v2")
	v1b = svgdoc.getElementById("v1b")
	v2b = svgdoc.getElementById("v2b")
	v1c = svgdoc.getElementById("v1c")
	v2c = svgdoc.getElementById("v2c")
	vs = svgdoc.getElementById("vs")
	a = svgdoc.getElementById("a")
	b = svgdoc.getElementById("b")
	c = svgdoc.getElementById("c")
	d = svgdoc.getElementById("d")
	p0 = svgdoc.getElementById("p0")
	p1 = svgdoc.getElementById("p1")
	p2 = svgdoc.getElementById("p2")
	p3 = svgdoc.getElementById("p3")
	p4 = svgdoc.getElementById("p4")
	xya = svgdoc.getElementById("xya")
	xyb = svgdoc.getElementById("xyb")
	xyc = svgdoc.getElementById("xyc")
	xyd = svgdoc.getElementById("xyd")
	vxt = svgdoc.getElementById("vxt")
	vyt = svgdoc.getElementById("vyt")
	vl = svgdoc.getElementById("vl")	
	vxt2 = svgdoc.getElementById("vxt2")
	vyt2 = svgdoc.getElementById("vyt2")
	vl2 = svgdoc.getElementById("vl2")	
	vxs = svgdoc.getElementById("vxs")
	vys = svgdoc.getElementById("vys")
	vls = svgdoc.getElementById("vls")	

	sum_calcul()
}

function sum_move(evt)
{
	if (click)
		{
		xm = coordo_x(evt.clientX)
		ym = coordo_y(evt.clientY)
		cible = evt.target.getAttributeNS(null,"id")
			if (cible == "p0")
				{ 
				x0 = xm
				y0 = ym
				}
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
			
			sum_calcul()
		}
}


function sum_calcul()
{
	p0.setAttributeNS(null,"cx",x0)
	p0.setAttributeNS(null,"cy",y0)
	p1.setAttributeNS(null,"cx",x1)
	p1.setAttributeNS(null,"cy",y1)
	p2.setAttributeNS(null,"cx",x2)
	p2.setAttributeNS(null,"cy",y2)
	p3.setAttributeNS(null,"cx",x3)
	p3.setAttributeNS(null,"cy",y3)
	p4.setAttributeNS(null,"cx",x4)
	p4.setAttributeNS(null,"cy",y4)
	v1.setAttributeNS(null,"x1",x1)
	v1.setAttributeNS(null,"y1",y1)
	v1.setAttributeNS(null,"x2",x2)
	v1.setAttributeNS(null,"y2",y2)
	v2.setAttributeNS(null,"x1",x3)
	v2.setAttributeNS(null,"y1",y3)
	v2.setAttributeNS(null,"x2",x4)
	v2.setAttributeNS(null,"y2",y4)
	v1c.setAttributeNS(null,"x1",x0 + x4 - x3)
	v1c.setAttributeNS(null,"y1",y0 + y4 - y3)
	v1c.setAttributeNS(null,"x2",x0 + x4 - x3 + x2 - x1)
	v1c.setAttributeNS(null,"y2",y0 + y4 - y3 + y2 - y1)
	v2c.setAttributeNS(null,"x1",x0 + x2 - x1)
	v2c.setAttributeNS(null,"y1",y0 + y2 - y1)
	v2c.setAttributeNS(null,"x2",x0 + x2 - x1 + x4 - x3)
	v2c.setAttributeNS(null,"y2",y0 + y2 - y1 + y4 - y3)
	v1b.setAttributeNS(null,"x1",x0)
	v1b.setAttributeNS(null,"y1",y0)
	v1b.setAttributeNS(null,"x2",x0 + x2 - x1)
	v1b.setAttributeNS(null,"y2",y0 + y2 - y1)
	v2b.setAttributeNS(null,"x1",x0)
	v2b.setAttributeNS(null,"y1",y0)
	v2b.setAttributeNS(null,"x2",x0 + x4 - x3)
	v2b.setAttributeNS(null,"y2",y0 + y4 - y3)
	vs.setAttributeNS(null,"x1",x0)
	vs.setAttributeNS(null,"y1",y0)
	vs.setAttributeNS(null,"x2",x0 + x4 - x3 + x2 - x1)
	vs.setAttributeNS(null,"y2",y0 + y4 - y3 + y2 - y1)
	a.setAttributeNS(null,"x",x1)
	a.setAttributeNS(null,"y",y1)
	b.setAttributeNS(null,"x",x2)
	b.setAttributeNS(null,"y",y2)
	c.setAttributeNS(null,"x",x3)
	c.setAttributeNS(null,"y",y3)
	d.setAttributeNS(null,"x",x4)
	d.setAttributeNS(null,"y",y4)
	xA = parseInt(4 * (x1 - 50)) / 100
	yA = parseInt(4 * (250 - y1)) / 100
	xB = parseInt(4 * (x2 - 50)) / 100
	yB = parseInt(4 * (250 - y2)) / 100
	xC = parseInt(4 * (x3 - 50)) / 100
	yC = parseInt(4 * (250 - y3)) / 100
	xD = parseInt(4 * (x4 - 50)) / 100
	yD = parseInt(4 * (250 - y4)) / 100
	uX = parseInt(4 * (x2 - x1)) / 100
	uY = parseInt(4 * (y1 - y2)) / 100
	uX2 = parseInt(4 * (x4 - x3)) / 100
	uY2 = parseInt(4 * (y3 - y4)) / 100
	l_v = parseInt(100 * Math.sqrt(uX * uX + uY * uY)) / 100
	l_v2 = parseInt(100 * Math.sqrt(uX2 * uX2 + uY2 * uY2)) / 100
	xya.firstChild.data = xA + " ; " + yA
	xyb.firstChild.data = xB + " ; " + yB
	xyc.firstChild.data = xC + " ; " + yC
	xyd.firstChild.data = xD + " ; " + yD
	vxt.firstChild.data = uX
	vyt.firstChild.data = uY
	vl.firstChild.data = l_v
	vxt2.firstChild.data = uX2
	vyt2.firstChild.data = uY2
	vl2.firstChild.data = l_v2
	vxs.firstChild.data = uX2 + uX
	vys.firstChild.data = uY2 + uY
	l_vs = parseInt(100 * Math.sqrt((xB - xA + xD - xC) * (xB - xA + xD - xC) + (yB - yA + yD - yC) * (yB - yA + yD - yC))) / 100
	vls.firstChild.data = l_vs
}


function init_scalar()
{
	x1 = 300
	y1 = 250
	x2 = 425
	y2 = 150	
	v1 = svgdoc.getElementById("v1")
	v2 = svgdoc.getElementById("v2")
	a = svgdoc.getElementById("a")
	b = svgdoc.getElementById("b")
	p1 = svgdoc.getElementById("p1")
	p2 = svgdoc.getElementById("p2")
	xya = svgdoc.getElementById("xya")
	xyb = svgdoc.getElementById("xyb")
	vxt = svgdoc.getElementById("vxt")
	vyt = svgdoc.getElementById("vyt")
	vl = svgdoc.getElementById("vl")	
	vxt2 = svgdoc.getElementById("vxt2")
	vyt2 = svgdoc.getElementById("vyt2")
	vl2 = svgdoc.getElementById("vl2")	
	kt = svgdoc.getElementById("kt")	
	curs = svgdoc.getElementById("cursor")	

	scalar_calcul()
}

function scalar_move(evt)
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
			else
				{ 
				x2 = xm
				y2 = ym
				}
			scalar_calcul()
		}
}

function scalar_cursor(evt)
{
	if (click)
		{
			xc = coordo_x(evt.clientX)
			if (xc < 100) xc = 100
			if (xc > 500) xc = 500
			k = (xc - 300) / 100
			curs.setAttributeNS(null,"x",xc - 5)
			scalar_calcul()
		}
}
function scalar_calcul()
{
	x_vector = ( x2 - x1 ) / 25
	y_vector = ( y1 - y2 ) / 25

	p1.setAttributeNS(null,"cx",x1)
	p1.setAttributeNS(null,"cy",y1)

	p2.setAttributeNS(null,"cx",x2)
	p2.setAttributeNS(null,"cy",y2)
	v1.setAttributeNS(null,"x1",x1)
	v1.setAttributeNS(null,"x2",x2)
	v1.setAttributeNS(null,"y1",y1)
	v1.setAttributeNS(null,"y2",y2)
	v2.setAttributeNS(null,"x1",x1)
	v2.setAttributeNS(null,"y1",y1)
	v2.setAttributeNS(null,"x2",x1 + (x2 - x1 ) * k)
	v2.setAttributeNS(null,"y2",y1 + (y2 - y1 ) * k)
	a.setAttributeNS(null,"x",x1)
	a.setAttributeNS(null,"y",y1)
	b.setAttributeNS(null,"x",x2)
	b.setAttributeNS(null,"y",y2)
	xA = parseInt(4 * (x1 - 50)) / 100
	yA = parseInt(4 * (250 - y1)) / 100
	xB = parseInt(4 * (x2 - 50)) / 100
	yB = parseInt(4 * (250 - y2)) / 100
	uX = parseInt(4 * (x2 - x1)) / 100
	uY = parseInt(4 * (y1 - y2)) / 100
	uX2 = parseInt(4 * k * (x2 - x1)) / 100
	uY2 = parseInt(4 * k * (y1 - y2)) / 100
	l_v = parseInt(100 * Math.sqrt(uX * uX + uY * uY)) / 100
	l_v2 = Math.abs(parseInt(100 * k * l_v) / 100)
	xya.firstChild.data = xA + " ; " + yA
	xyb.firstChild.data = xB + " ; " + yB
	vxt.firstChild.data = uX
	vyt.firstChild.data = uY
	vl.firstChild.data = l_v
	vxt2.firstChild.data = uX2
	vyt2.firstChild.data = uY2
	vl2.firstChild.data = l_v2
	kt.firstChild.data = k
}


function init_polar()
{
	x1 = 200
	y1 = 400
	x2 = 400
	y2 = 200	
	v1 = svgdoc.getElementById("v1")
	a = svgdoc.getElementById("a")
	b = svgdoc.getElementById("b")
	p1 = svgdoc.getElementById("p1")
	p2 = svgdoc.getElementById("p2")
	rx = svgdoc.getElementById("rx")
	rx2 = svgdoc.getElementById("rx2")
	ry = svgdoc.getElementById("ry")
	cx = svgdoc.getElementById("cx")
	cy = svgdoc.getElementById("cy")
	vx = svgdoc.getElementById("vx")
	vy = svgdoc.getElementById("vy")
	xya = svgdoc.getElementById("xya")
	xyb = svgdoc.getElementById("xyb")
	vxt = svgdoc.getElementById("vxt")
	vyt = svgdoc.getElementById("vyt")
	vl = svgdoc.getElementById("vl")	
	ag = svgdoc.getElementById("ag")	
	agt = svgdoc.getElementById("agt")	

	polar_calcul()
}

function polar_move(evt)
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
			else
				{ 
				x2 = xm
				y2 = ym
				}
			polar_calcul()
		}
}

function polar_calcul()
{

	p1.setAttributeNS(null,"cx",x1)
	p1.setAttributeNS(null,"cy",y1)

	p2.setAttributeNS(null,"cx",x2)
	p2.setAttributeNS(null,"cy",y2)
	v1.setAttributeNS(null,"x1",x1)
	v1.setAttributeNS(null,"x2",x2)
	v1.setAttributeNS(null,"y1",y1)
	v1.setAttributeNS(null,"y2",y2)
	ry.setAttributeNS(null,"x1",x2)
	ry.setAttributeNS(null,"x2",x2)
	rx.setAttributeNS(null,"y1",y2)
	rx.setAttributeNS(null,"y2",y2)
	rx2.setAttributeNS(null,"y1",y1)
	rx2.setAttributeNS(null,"y2",y1)
	cx.setAttributeNS(null,"x1",x1)
	cx.setAttributeNS(null,"y1",y1)
	cx.setAttributeNS(null,"x2",x2)
	cx.setAttributeNS(null,"y2",y1)
	cy.setAttributeNS(null,"x1",x1)
	cy.setAttributeNS(null,"y1",y1)
	cy.setAttributeNS(null,"x2",x1)
	cy.setAttributeNS(null,"y2",y2)
	vx.setAttributeNS(null,"x",(x1 + x2) / 2)
	vx.setAttributeNS(null,"y",y1)
	vy.setAttributeNS(null,"x",x1)
	vy.setAttributeNS(null,"y",(y2 + y1) / 2)
	a.setAttributeNS(null,"x",x1)
	a.setAttributeNS(null,"y",y1)
	b.setAttributeNS(null,"x",x2)
	b.setAttributeNS(null,"y",y2)
	xA = parseInt(4 * (x1 - 50)) / 100
	yA = parseInt(4 * (250 - y1)) / 100
	xB = parseInt(4 * (x2 - 50)) / 100
	yB = parseInt(4 * (250 - y2)) / 100
	uX = parseInt(4 * (x2 - x1)) / 100
	uY = parseInt(4 * (y1 - y2)) / 100
	l_v = parseInt(100 * Math.sqrt(uX * uX + uY * uY)) / 100
	xya.firstChild.data = xA + " ; " + yA
	xyb.firstChild.data = xB + " ; " + yB
	vxt.firstChild.data = uX
	vyt.firstChild.data = uY
	vl.firstChild.data = l_v
	angle_rad = Math.atan(uY / uX) 
	if (uX < 0 ) angle_rad = angle_rad + Math.PI
	if (angle_rad > Math.PI) angle_rad = angle_rad - 2 * Math.PI
	d = "M" + (x1 + 75).toString() + " " + y1.toString() + "a 75 75 0 0 "
	if (angle_rad >= 0) 
		d += "0 "
	else
		d += "1 "
	x_arc = 75 * ( Math.cos(angle_rad) - 1)
	y_arc = - 75 * Math.sin(angle_rad)
	d += x_arc.toString() + " " + y_arc.toString()
	ag.setAttributeNS(null,"d",d)
	angle = parseInt(angle_rad * 180 / Math.PI)
	agt.firstChild.data = angle

}

function init_coordo()
{
	x1 = 200
	y1 = 400
	x2 = 400
	y2 = 200	
	v1 = svgdoc.getElementById("v1")
	a = svgdoc.getElementById("a")
	b = svgdoc.getElementById("b")
	p1 = svgdoc.getElementById("p1")
	p2 = svgdoc.getElementById("p2")
	rx = svgdoc.getElementById("rx")
	ry = svgdoc.getElementById("ry")
	cx = svgdoc.getElementById("cx")
	cy = svgdoc.getElementById("cy")
	vx = svgdoc.getElementById("vx")
	vy = svgdoc.getElementById("vy")
	xya = svgdoc.getElementById("xya")
	xyb = svgdoc.getElementById("xyb")
	vxt = svgdoc.getElementById("vxt")
	vyt = svgdoc.getElementById("vyt")
	vl = svgdoc.getElementById("vl")	

	coordo_calcul()
}

function coordo_move(evt)
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
			else
				{ 
				x2 = xm
				y2 = ym
				}
			coordo_calcul()
		}
}

function coordo_calcul()
{
	p1.setAttributeNS(null,"cx",x1)
	p1.setAttributeNS(null,"cy",y1)

	p2.setAttributeNS(null,"cx",x2)
	p2.setAttributeNS(null,"cy",y2)
	v1.setAttributeNS(null,"x1",x1)
	v1.setAttributeNS(null,"x2",x2)
	v1.setAttributeNS(null,"y1",y1)
	v1.setAttributeNS(null,"y2",y2)
	ry.setAttributeNS(null,"x1",x2)
	ry.setAttributeNS(null,"x2",x2)
	rx.setAttributeNS(null,"y1",y2)
	rx.setAttributeNS(null,"y2",y2)
	cx.setAttributeNS(null,"x1",x1)
	cx.setAttributeNS(null,"y1",y1)
	cx.setAttributeNS(null,"x2",x2)
	cx.setAttributeNS(null,"y2",y1)
	cy.setAttributeNS(null,"x1",x1)
	cy.setAttributeNS(null,"y1",y1)
	cy.setAttributeNS(null,"x2",x1)
	cy.setAttributeNS(null,"y2",y2)
	vx.setAttributeNS(null,"x",(x1 + x2) / 2)
	vx.setAttributeNS(null,"y",y1)
	vy.setAttributeNS(null,"x",x1)
	vy.setAttributeNS(null,"y",(y2 + y1) / 2)
	a.setAttributeNS(null,"x",x1)
	a.setAttributeNS(null,"y",y1)
	b.setAttributeNS(null,"x",x2)
	b.setAttributeNS(null,"y",y2)
	xA = parseInt(4 * (x1 - 50)) / 100
	yA = parseInt(4 * (250 - y1)) / 100
	xB = parseInt(4 * (x2 - 50)) / 100
	yB = parseInt(4 * (250 - y2)) / 100
	uX = parseInt(4 * (x2 - x1)) / 100
	uY = parseInt(4 * (y1 - y2)) / 100
	l_v = parseInt(100 * Math.sqrt(uX * uX + uY * uY)) / 100
	xya.firstChild.data = xA + " ; " + yA
	xyb.firstChild.data = xB + " ; " + yB
	vxt.firstChild.data = uX
	vyt.firstChild.data = uY
	vl.firstChild.data = l_v
}

