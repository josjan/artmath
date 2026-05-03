var x1=200,y1=400,x2=400,y2=200,x3=400,y3=400
var v1="",p1="",p2="",p3="",a="",b="",c="",xya="",xyb="",xyc="",v1="",v2="",ut="",ut2=""
var click = false
var clip_p = new Array([0,0],[0,0])

function init_linedist(evt)
{
	x1 = 200
	y1 = 400
	x2 = 300
	y2 = 200	
	x3 = 400
	y3 = 300	
	v1 = svgdoc.getElementById("v1")
	a = svgdoc.getElementById("a")
	b = svgdoc.getElementById("b")
	c = svgdoc.getElementById("c")
	p1 = svgdoc.getElementById("p1")
	p2 = svgdoc.getElementById("p2")
	p3 = svgdoc.getElementById("p3")
	xya = svgdoc.getElementById("xya")
	xyb = svgdoc.getElementById("xyb")
	xyc = svgdoc.getElementById("xyc")
	vxt = svgdoc.getElementById("vxt")
	vyt = svgdoc.getElementById("vyt")
	ut = svgdoc.getElementById("ut")
	dist = svgdoc.getElementById("dist")
	linedist_calcul()
}

function linedist_move(evt)
{
	if (click)
		{
			xm = coordo_x(evt.clientX)
			ym = coordo_y(evt.clientY)
			if (xm < 25 ) xm = 25
			if (xm > 675 ) xm = 675
			if (ym < 125 ) ym = 125
			if (ym > 575 ) ym = 575
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
			linedist_calcul()
		}
}

function linedist_calcul()
{
	p1.setAttributeNS(null,"cx",x1)
	p1.setAttributeNS(null,"cy",y1)
	p2.setAttributeNS(null,"cx",x2)
	p2.setAttributeNS(null,"cy",y2)
	p3.setAttributeNS(null,"cx",x3)
	p3.setAttributeNS(null,"cy",y3)
	a.setAttributeNS(null,"x",x1)
	a.setAttributeNS(null,"y",y1)
	b.setAttributeNS(null,"x",x2)
	b.setAttributeNS(null,"y",y2)
	c.setAttributeNS(null,"x",x3)
	c.setAttributeNS(null,"y",y3)
	xA = parseInt(4 * (x1 - 350)) / 100
	yA = parseInt(4 * (350 - y1)) / 100
	xB = parseInt(4 * (x2 - 350)) / 100
	yB = parseInt(4 * (350 - y2)) / 100
	xC = parseInt(4 * (x3 - 350)) / 100
	yC = parseInt(4 * (350 - y3)) / 100
	uX = parseInt(4 * (x2 - x1)) / 100
	uY = parseInt(4 * (y1 - y2)) / 100
	u = uY
	v = - uX
	w = - xA * uY + yA * uX
	clip_line(u,v,w)
	v1.setAttributeNS(null,"x1",clip_p[0][0] * 25 + 350)
	v1.setAttributeNS(null,"x2",clip_p[1][0] * 25 + 350)
	v1.setAttributeNS(null,"y1",350 - clip_p[0][1] * 25)
	v1.setAttributeNS(null,"y2",350 - clip_p[1][1] * 25)
	xya.firstChild.data = xA + " ; " + yA
	xyb.firstChild.data = xB + " ; " + yB
	xyc.firstChild.data = xC + " ; " + yC
	vxt.firstChild.data = uX
	vyt.firstChild.data = uY
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
	ut.firstChild.data = streq
	distC = parseInt( 1000 * Math.abs(u * xC + v * yC + w) / Math.sqrt(u * u + v * v)) / 1000
	dist.firstChild.data = distC.toString()
}

function init_lineparam()
{
	x1 = 200
	y1 = 400
	x2 = 300
	y2 = 200	
	x3 = 250
	y3 = 300	
	v1 = svgdoc.getElementById("v1")
	a = svgdoc.getElementById("a")
	b = svgdoc.getElementById("b")
	m = svgdoc.getElementById("m")
	p1 = svgdoc.getElementById("p1")
	p2 = svgdoc.getElementById("p2")
	p3 = svgdoc.getElementById("p3")
	xya = svgdoc.getElementById("xya")
	xyb = svgdoc.getElementById("xyb")
	vxt = svgdoc.getElementById("vxt")
	vyt = svgdoc.getElementById("vyt")
	utx = svgdoc.getElementById("utx")
	uty = svgdoc.getElementById("uty")
	utm = svgdoc.getElementById("utm")
	lineparam_calcul()
}

function lineparam_move(evt)
{
	if (click)
		{
			xm = coordo_x(evt.clientX)
			ym = coordo_y(evt.clientY)
			if (xm < 25 ) xm = 25
			if (xm > 675 ) xm = 675
			if (ym < 125 ) ym = 125
			if (ym > 575 ) ym = 575
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
			lineparam_calcul()
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

function lineparam_calcul()
{
	p1.setAttributeNS(null,"cx",x1)
	p1.setAttributeNS(null,"cy",y1)
	p2.setAttributeNS(null,"cx",x2)
	p2.setAttributeNS(null,"cy",y2)
	xA = parseInt(4 * (x1 - 350)) / 100
	yA = parseInt(4 * (350 - y1)) / 100
	xB = parseInt(4 * (x2 - 350)) / 100
	yB = parseInt(4 * (350 - y2)) / 100
	uX = parseInt(4 * (x2 - x1)) / 100
	uY = parseInt(4 * (y1 - y2)) / 100
	u = uY
	v = - uX
	w = - xA * uY + yA * uX
	clip_line(u,v,w)
	v1.setAttributeNS(null,"x1",clip_p[0][0] * 25 + 350)
	v1.setAttributeNS(null,"x2",clip_p[1][0] * 25 + 350)
	v1.setAttributeNS(null,"y1",350 - clip_p[0][1] * 25)
	v1.setAttributeNS(null,"y2",350 - clip_p[1][1] * 25)
	xM = parseInt(4 * (x3 - 350)) / 100
	yM = parseInt(4 * (350 - y3)) / 100
	det = u * u + v * v
	if ( det != 0 )
	{
		x0 = ( - w * u + v * v * xM - u * v * yM ) / det
		y0 = ( - u * v * xM + u * u * yM - v * w ) / det
		xM = x0
		yM = y0
	}		
	x3 = 25 * xM + 350
	y3 = 350 - 25 * yM
	t = parseInt(100 * ( xM - xA ) / (xB - xA)) / 100
	utm.firstChild.data = t.toString()
	p3.setAttributeNS(null,"cx",x3)
	p3.setAttributeNS(null,"cy",y3)
	a.setAttributeNS(null,"x",x1)
	a.setAttributeNS(null,"y",y1)
	b.setAttributeNS(null,"x",x2)
	b.setAttributeNS(null,"y",y2)
	m.setAttributeNS(null,"x",x3)
	m.setAttributeNS(null,"y",y3)
	xya.firstChild.data = xA + " ; " + yA
	xyb.firstChild.data = xB + " ; " + yB
	vxt.firstChild.data = uX
	vyt.firstChild.data = uY
	streq = " x = "
	if ( xA != 0 )
		streq += xA + " "
	if ( uX != 0 )
		if ( uX > 0 )
			streq += "+ t * " + uX
		else
			streq += "- t * " + - uX
	utx.firstChild.data = streq
	streq = " y = "
	if ( yA != 0 )
		streq += yA + " "
	if ( uY != 0 )
		if ( uY > 0 )
			streq += "+ t * " + uY
		else
			streq += "- t * " + - uY
	uty.firstChild.data = streq
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
	clip_line(u0,v0,w0)
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
	clip_line(u,v,w)
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

function init_lineAB(evt)
{
	x1 = 200
	y1 = 400
	x2 = 300
	y2 = 200	
	v1 = svgdoc.getElementById("v1")
	a = svgdoc.getElementById("a")
	b = svgdoc.getElementById("b")
	p1 = svgdoc.getElementById("p1")
	p2 = svgdoc.getElementById("p2")
	xya = svgdoc.getElementById("xya")
	xyb = svgdoc.getElementById("xyb")
	vxt = svgdoc.getElementById("vxt")
	vyt = svgdoc.getElementById("vyt")
	ut = svgdoc.getElementById("ut")
	lineAB_calcul()
}

function lineAB_move(evt)
{
	if (click)
		{
			xm = coordo_x(evt.clientX)
			ym = coordo_y(evt.clientY)
			if (xm < 25 ) xm = 25
			if (xm > 675 ) xm = 675
			if (ym < 125 ) ym = 125
			if (ym > 575 ) ym = 575
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
			lineAB_calcul()
		}
}

function lineAB_calcul()
{
	x_vector = ( x2 - x1 ) / 25
	y_vector = ( y1 - y2 ) / 25

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
	u = uY
	v = - uX
	w = - xA * uY + yA * uX
	clip_line(u,v,w)
	v1.setAttributeNS(null,"x1",clip_p[0][0] * 25 + 350)
	v1.setAttributeNS(null,"x2",clip_p[1][0] * 25 + 350)
	v1.setAttributeNS(null,"y1",350 - clip_p[0][1] * 25)
	v1.setAttributeNS(null,"y2",350 - clip_p[1][1] * 25)
	xya.firstChild.data = xA + " ; " + yA
	xyb.firstChild.data = xB + " ; " + yB
	vxt.firstChild.data = uX
	vyt.firstChild.data = uY
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
	ut.firstChild.data = streq
}


function init_mediatrix(evt)
{
	x1 = 200
	y1 = 400
	x2 = 300
	y2 = 200	
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
	ut = svgdoc.getElementById("ut")
	mediatrix_calcul()
}

function mediatrix_move(evt)
{
	if (click)
		{
			xm = coordo_x(evt.clientX)
			ym = coordo_y(evt.clientY)
			if (xm < 25 ) xm = 25
			if (xm > 675 ) xm = 675
			if (ym < 125 ) ym = 125
			if (ym > 575 ) ym = 575
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
			mediatrix_calcul()
		}
}

function mediatrix_calcul()
{
	p1.setAttributeNS(null,"cx",x1)
	p1.setAttributeNS(null,"cy",y1)
	p2.setAttributeNS(null,"cx",x2)
	p2.setAttributeNS(null,"cy",y2)
	a.setAttributeNS(null,"x",x1)
	a.setAttributeNS(null,"y",y1)
	b.setAttributeNS(null,"x",x2)
	b.setAttributeNS(null,"y",y2)
	v2.setAttributeNS(null,"x1",x1)
	v2.setAttributeNS(null,"y1",y1)
	v2.setAttributeNS(null,"x2",x2)
	v2.setAttributeNS(null,"y2",y2)

	xA = parseInt(4 * (x1 - 350)) / 100
	yA = parseInt(4 * (350 - y1)) / 100
	xB = parseInt(4 * (x2 - 350)) / 100
	yB = parseInt(4 * (350 - y2)) / 100
	uX = parseInt(4 * (x2 - x1)) / 100
	uY = parseInt(4 * (y1 - y2)) / 100
	u = uX
	v = uY
	w = - (xA + xB) * uX / 2 - (yA + yB) * uY / 2
	clip_line(u,v,w)
	v1.setAttributeNS(null,"x1",clip_p[0][0] * 25 + 350)
	v1.setAttributeNS(null,"x2",clip_p[1][0] * 25 + 350)
	v1.setAttributeNS(null,"y1",350 - clip_p[0][1] * 25)
	v1.setAttributeNS(null,"y2",350 - clip_p[1][1] * 25)
	xya.firstChild.data = xA + " ; " + yA
	xyb.firstChild.data = xB + " ; " + yB
	vxt.firstChild.data = uX
	vyt.firstChild.data = uY
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
	ut.firstChild.data = streq
}



function init_lineparallel(evt)
{
	x1 = 200
	y1 = 400
	x2 = 300
	y2 = 200	
	x3 = 400
	y3 = 400
	v1 = svgdoc.getElementById("v1")
	v2 = svgdoc.getElementById("v2")
	a = svgdoc.getElementById("a")
	b = svgdoc.getElementById("b")
	c = svgdoc.getElementById("c")
	p1 = svgdoc.getElementById("p1")
	p2 = svgdoc.getElementById("p2")
	p3 = svgdoc.getElementById("p3")
	xya = svgdoc.getElementById("xya")
	xyb = svgdoc.getElementById("xyb")
	xyc = svgdoc.getElementById("xyc")
	vxt = svgdoc.getElementById("vxt")
	vyt = svgdoc.getElementById("vyt")
	ut = svgdoc.getElementById("ut")
	ut2 = svgdoc.getElementById("ut2")
	lineparallel_calcul()
}

function lineparallel_move(evt)
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
			lineparallel_calcul()
		}
}

function lineparallel_calcul()
{
	x_vector = ( x2 - x1 ) / 25
	y_vector = ( y1 - y2 ) / 25

	p1.setAttributeNS(null,"cx",x1)
	p1.setAttributeNS(null,"cy",y1)

	p2.setAttributeNS(null,"cx",x2)
	p2.setAttributeNS(null,"cy",y2)
	p3.setAttributeNS(null,"cx",x3)
	p3.setAttributeNS(null,"cy",y3)
	a.setAttributeNS(null,"x",x1)
	a.setAttributeNS(null,"y",y1)
	b.setAttributeNS(null,"x",x2)
	b.setAttributeNS(null,"y",y2)
	c.setAttributeNS(null,"x",x3)
	c.setAttributeNS(null,"y",y3)
	xA = parseInt(4 * (x1 - 350)) / 100
	yA = parseInt(4 * (350 - y1)) / 100
	xB = parseInt(4 * (x2 - 350)) / 100
	yB = parseInt(4 * (350 - y2)) / 100
	xC = parseInt(4 * (x3 - 350)) / 100
	yC = parseInt(4 * (350 - y3)) / 100
	uX = parseInt(4 * (x2 - x1)) / 100
	uY = parseInt(4 * (y1 - y2)) / 100
	u = uY
	v = - uX
	w = - xA * uY + yA * uX
	clip_line(u,v,w)
	v1.setAttributeNS(null,"x1",clip_p[0][0] * 25 + 350)
	v1.setAttributeNS(null,"x2",clip_p[1][0] * 25 + 350)
	v1.setAttributeNS(null,"y1",350 - clip_p[0][1] * 25)
	v1.setAttributeNS(null,"y2",350 - clip_p[1][1] * 25)
	xya.firstChild.data = xA + " ; " + yA
	xyb.firstChild.data = xB + " ; " + yB
	xyc.firstChild.data = xC + " ; " + yC
	vxt.firstChild.data = uX
	vyt.firstChild.data = uY
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
	ut.firstChild.data = streq
	w = - xC * uY + yC * uX
	clip_line(u,v,w)
	v2.setAttributeNS(null,"x1",clip_p[0][0] * 25 + 350)
	v2.setAttributeNS(null,"x2",clip_p[1][0] * 25 + 350)
	v2.setAttributeNS(null,"y1",350 - clip_p[0][1] * 25)
	v2.setAttributeNS(null,"y2",350 - clip_p[1][1] * 25)
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
}

function init_lineortho(evt)
{
	x1 = 200
	y1 = 400
	x2 = 300
	y2 = 200	
	x3 = 400
	y3 = 400
	v1 = svgdoc.getElementById("v1")
	v2 = svgdoc.getElementById("v2")
	a = svgdoc.getElementById("a")
	b = svgdoc.getElementById("b")
	c = svgdoc.getElementById("c")
	p1 = svgdoc.getElementById("p1")
	p2 = svgdoc.getElementById("p2")
	p3 = svgdoc.getElementById("p3")
	xya = svgdoc.getElementById("xya")
	xyb = svgdoc.getElementById("xyb")
	xyc = svgdoc.getElementById("xyc")
	vxt = svgdoc.getElementById("vxt")
	vyt = svgdoc.getElementById("vyt")
	ut = svgdoc.getElementById("ut")
	ut2 = svgdoc.getElementById("ut2")
	lineortho_calcul()
}

function lineortho_move(evt)
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
			lineortho_calcul()
		}
}


function lineortho_calcul()
{
	x_vector = ( x2 - x1 ) / 25
	y_vector = ( y1 - y2 ) / 25

	p1.setAttributeNS(null,"cx",x1)
	p1.setAttributeNS(null,"cy",y1)

	p2.setAttributeNS(null,"cx",x2)
	p2.setAttributeNS(null,"cy",y2)
	p3.setAttributeNS(null,"cx",x3)
	p3.setAttributeNS(null,"cy",y3)
	a.setAttributeNS(null,"x",x1)
	a.setAttributeNS(null,"y",y1)
	b.setAttributeNS(null,"x",x2)
	b.setAttributeNS(null,"y",y2)
	c.setAttributeNS(null,"x",x3)
	c.setAttributeNS(null,"y",y3)
	xA = parseInt(4 * (x1 - 350)) / 100
	yA = parseInt(4 * (350 - y1)) / 100
	xB = parseInt(4 * (x2 - 350)) / 100
	yB = parseInt(4 * (350 - y2)) / 100
	xC = parseInt(4 * (x3 - 350)) / 100
	yC = parseInt(4 * (350 - y3)) / 100
	uX = parseInt(4 * (x2 - x1)) / 100
	uY = parseInt(4 * (y1 - y2)) / 100
	u = uY
	v = - uX
	w = - xA * uY + yA * uX
	clip_line(u,v,w)
	v1.setAttributeNS(null,"x1",clip_p[0][0] * 25 + 350)
	v1.setAttributeNS(null,"x2",clip_p[1][0] * 25 + 350)
	v1.setAttributeNS(null,"y1",350 - clip_p[0][1] * 25)
	v1.setAttributeNS(null,"y2",350 - clip_p[1][1] * 25)
	xya.firstChild.data = xA + " ; " + yA
	xyb.firstChild.data = xB + " ; " + yB
	xyc.firstChild.data = xC + " ; " + yC
	vxt.firstChild.data = uX
	vyt.firstChild.data = uY
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
	ut.firstChild.data = streq
	u = uX
	v = uY
	w = - xC * uX - yC * uY
	clip_line(u,v,w)
	v2.setAttributeNS(null,"x1",clip_p[0][0] * 25 + 350)
	v2.setAttributeNS(null,"x2",clip_p[1][0] * 25 + 350)
	v2.setAttributeNS(null,"y1",350 - clip_p[0][1] * 25)
	v2.setAttributeNS(null,"y2",350 - clip_p[1][1] * 25)
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
}
