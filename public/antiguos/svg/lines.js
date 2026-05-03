var x1=200,y1=400,x2=400,y2=200,x3=512,y3=232,x4=600,y4=0
var v1="",p1="",p2="",rx="",ry="",cx="",cy="",vx="",vy="",xya="",xyb="",vxt="",vyt="",vl=""
var click = false
var clip_p = new Array([0,0],[0,0])

function init_svg_linedist(evt)
{
	x1 = 423
	y1 = 164
	x2 = 600
	y2 = 300	
	x3 = 400
	y3 = 300
	x4 = 600
	y4 = 175	
	v1 = svgdoc.getElementById("v1")
	v2 = svgdoc.getElementById("v2")
	v3 = svgdoc.getElementById("v3")
	v4 = svgdoc.getElementById("v4")
	a = svgdoc.getElementById("a")
	b = svgdoc.getElementById("b")
	c = svgdoc.getElementById("c")
	d = svgdoc.getElementById("d")
	p1 = svgdoc.getElementById("p1")
	p2 = svgdoc.getElementById("p2")
	p3 = svgdoc.getElementById("p3")
	p4 = svgdoc.getElementById("p4")
	svg_linedist_calcul()
}

function svg_linedist_move(evt)
{
	if (click)
		{
			xm = coordo_x(evt.clientX)
			ym = coordo_y(evt.clientY) - 200
			if (xm < 325 ) xm = 325
			if (xm > 675 ) xm = 675
			if (ym < 125 ) ym = 125
			if (ym > 375 ) ym = 375
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
			svg_linedist_calcul()
		}
}

function svg_linedist_calcul()
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
	uX = parseInt(4 * (x2 - x1)) / 100
	uY = parseInt(4 * (y1 - y2)) / 100
	u = uY
	v = - uX
	w = - xA * uY + yA * uX
	clip_line2(u,v,w)
	v1.setAttributeNS(null,"x1",clip_p[0][0] * 25 + 350)
	v1.setAttributeNS(null,"x2",clip_p[1][0] * 25 + 350)
	v1.setAttributeNS(null,"y1",350 - clip_p[0][1] * 25)
	v1.setAttributeNS(null,"y2",350 - clip_p[1][1] * 25)
	xC = parseInt(4 * (x3 - 350)) / 100
	yC = parseInt(4 * (350 - y3)) / 100
	xD = parseInt(4 * (x4 - 350)) / 100
	yD = parseInt(4 * (350 - y4)) / 100
	uX2 = parseInt(4 * (x4 - x3)) / 100
	uY2 = parseInt(4 * (y3 - y4)) / 100
	ub = uY2
	vb = - uX2
	wb = - xC * uY2 + yC * uX2
	clip_line2(ub,vb,wb)
	v2.setAttributeNS(null,"x1",clip_p[0][0] * 25 + 350)
	v2.setAttributeNS(null,"x2",clip_p[1][0] * 25 + 350)
	v2.setAttributeNS(null,"y1",350 - clip_p[0][1] * 25)
	v2.setAttributeNS(null,"y2",350 - clip_p[1][1] * 25)
	uc = u * Math.sqrt( ub * ub + vb * vb ) - ub * Math.sqrt( u * u + v * v )
	vc = v * Math.sqrt( ub * ub + vb * vb ) - vb * Math.sqrt( u * u + v * v )
	wc = w * Math.sqrt( ub * ub + vb * vb ) - wb * Math.sqrt( u * u + v * v )
	clip_line2(uc,vc,wc)
	v3.setAttributeNS(null,"x1",clip_p[0][0] * 25 + 350)
	v3.setAttributeNS(null,"x2",clip_p[1][0] * 25 + 350)
	v3.setAttributeNS(null,"y1",350 - clip_p[0][1] * 25)
	v3.setAttributeNS(null,"y2",350 - clip_p[1][1] * 25)
	uc = u * Math.sqrt( ub * ub + vb * vb ) + ub * Math.sqrt( u * u + v * v )
	vc = v * Math.sqrt( ub * ub + vb * vb ) + vb * Math.sqrt( u * u + v * v )
	wc = w * Math.sqrt( ub * ub + vb * vb ) + wb * Math.sqrt( u * u + v * v )
	clip_line2(uc,vc,wc)
	v4.setAttributeNS(null,"x1",clip_p[0][0] * 25 + 350)
	v4.setAttributeNS(null,"x2",clip_p[1][0] * 25 + 350)
	v4.setAttributeNS(null,"y1",350 - clip_p[0][1] * 25)
	v4.setAttributeNS(null,"y2",350 - clip_p[1][1] * 25)
}


function init_svg_lineparam(evt)
{
	x1 = 423
	y1 = 164
	x2 = 600
	y2 = 300	
	x3 = 512
	y3 = 232
	m = svgdoc.getElementById("m")
	p1 = svgdoc.getElementById("p1")
}

function svg_lineparam_move(evt)
{
	if (click)
		{
			xm = coordo_x(evt.clientX)
			ym = coordo_y(evt.clientY)
			if (xm < 325 ) xm = 325
			if (xm > 675 ) xm = 675
			if (ym < 125 ) ym = 125
			if (ym > 375 ) ym = 375
			x3 = xm
			y3 = ym
			svg_lineparam_calcul()
		}
}

function svg_lineparam_calcul()
{
	l1 = Math.sqrt((x3 - x1) * (x3 - x1) + (y3 - y1) * (y3 - y1))
	l2 = Math.sqrt((x3 - x2) * (x3 - x2) + (y3 - y2) * (y3 - y2))
	k = l1 / (l1 + l2)
	x3 = x1 + k * (x2 - x1)
	y3 = y1 + k * (y2 - y1)
	p1.setAttributeNS(null,"cx",x3)
	p1.setAttributeNS(null,"cy",y3)
	m.setAttributeNS(null,"x",x3)
	m.setAttributeNS(null,"y",y3)
}

function init_svg_lineinter(evt)
{
	x1 = 423
	y1 = 164
	x2 = 600
	y2 = 300	
	x3 = 400
	y3 = 300
	x4 = 600
	y4 = 175	
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
	svg_lineinter_calcul()
}

function svg_lineinter_move(evt)
{
	if (click)
		{
			xm = coordo_x(evt.clientX)
			ym = coordo_y(evt.clientY)
			if (xm < 325 ) xm = 325
			if (xm > 675 ) xm = 675
			if (ym < 125 ) ym = 125
			if (ym > 375 ) ym = 375
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
			svg_lineinter_calcul()
		}
}

function svg_lineinter_calcul()
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
	uX = parseInt(4 * (x2 - x1)) / 100
	uY = parseInt(4 * (y1 - y2)) / 100
	u = uY
	v = - uX
	w = - xA * uY + yA * uX
	clip_line2(u,v,w)
	v1.setAttributeNS(null,"x1",clip_p[0][0] * 25 + 350)
	v1.setAttributeNS(null,"x2",clip_p[1][0] * 25 + 350)
	v1.setAttributeNS(null,"y1",350 - clip_p[0][1] * 25)
	v1.setAttributeNS(null,"y2",350 - clip_p[1][1] * 25)
	xC = parseInt(4 * (x3 - 350)) / 100
	yC = parseInt(4 * (350 - y3)) / 100
	xD = parseInt(4 * (x4 - 350)) / 100
	yD = parseInt(4 * (350 - y4)) / 100
	uX2 = parseInt(4 * (x4 - x3)) / 100
	uY2 = parseInt(4 * (y3 - y4)) / 100
	ub = uY2
	vb = - uX2
	wb = - xC * uY2 + yC * uX2
	clip_line2(ub,vb,wb)
	v2.setAttributeNS(null,"x1",clip_p[0][0] * 25 + 350)
	v2.setAttributeNS(null,"x2",clip_p[1][0] * 25 + 350)
	v2.setAttributeNS(null,"y1",350 - clip_p[0][1] * 25)
	v2.setAttributeNS(null,"y2",350 - clip_p[1][1] * 25)
	det = u * vb - v * ub
	if ( det != 0 )
	{
		xM = ( v * wb - vb * w ) / det
		yM = ( - u * wb + w * ub ) / det
		p5.setAttributeNS(null,"cx",25 * xM + 350)
		p5.setAttributeNS(null,"cy",350 - 25 * yM)
 		m.setAttributeNS(null,"x",25 * xM + 350)
		m.setAttributeNS(null,"y",350 - 25 * yM)
	}
}

function init_svg_mediatrix(evt)
{
	x1 = 423
	y1 = 164
	x2 = 600
	y2 = 300	
	v1 = svgdoc.getElementById("v1")
	v2 = svgdoc.getElementById("v2")
	a = svgdoc.getElementById("a")
	b = svgdoc.getElementById("b")
	p1 = svgdoc.getElementById("p1")
	p2 = svgdoc.getElementById("p2")
	svg_mediatrix_calcul()
}

function svg_mediatrix_move(evt)
{
	if (click)
		{
			xm = coordo_x(evt.clientX)
			ym = coordo_y(evt.clientY)
			if (xm < 325 ) xm = 325
			if (xm > 675 ) xm = 675
			if (ym < 125 ) ym = 125
			if (ym > 375 ) ym = 375
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
			svg_mediatrix_calcul()
		}
}


function svg_mediatrix_calcul()
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
	u = uY
	v = - uX
	w = - xA * uY + yA * uX
	clip_line2(u,v,w)
	v1.setAttributeNS(null,"x1",clip_p[0][0] * 25 + 350)
	v1.setAttributeNS(null,"x2",clip_p[1][0] * 25 + 350)
	v1.setAttributeNS(null,"y1",350 - clip_p[0][1] * 25)
	v1.setAttributeNS(null,"y2",350 - clip_p[1][1] * 25)
	u = uX
	v = uY
	w = - uX * ( xA + xB ) / 2 - uY * ( yA + yB ) / 2
	clip_line2(u,v,w)
	v2.setAttributeNS(null,"x1",clip_p[0][0] * 25 + 350)
	v2.setAttributeNS(null,"x2",clip_p[1][0] * 25 + 350)
	v2.setAttributeNS(null,"y1",350 - clip_p[0][1] * 25)
	v2.setAttributeNS(null,"y2",350 - clip_p[1][1] * 25)
}


function init_svg_lineparallel(evt)
{
	x1 = 423
	y1 = 164
	x2 = 600
	y2 = 300	
	x3 = 450
	y3 = 250
	v1 = svgdoc.getElementById("v1")
	v2 = svgdoc.getElementById("v2")
	svg_lineparallel_calcul()
}

function svg_lineparallel_move(evt)
{
	if (click)
		{
			xm = coordo_x(evt.clientX)
			ym = coordo_y(evt.clientY)
			if (xm < 325 ) xm = 325
			if (xm > 675 ) xm = 675
			if (ym < 125 ) ym = 125
			if (ym > 375 ) ym = 375
			x3 = xm
			y3 = ym
			svg_lineparallel_calcul()
		}
}

function svg_lineparallel_calcul()
{
	xA = parseInt(4 * (x1 - 350)) / 100
	yA = parseInt(4 * (350 - y1)) / 100
	xB = parseInt(4 * (x2 - 350)) / 100
	yB = parseInt(4 * (350 - y2)) / 100
	xM = parseInt(4 * (x3 - 350)) / 100
	yM = parseInt(4 * (350 - y3)) / 100
	u = yB - yA
	v = xA - xB
	w = - xM * u - yM * v
	clip_line2(u,v,w)
	v2.setAttributeNS(null,"x1",clip_p[0][0] * 25 + 350)
	v2.setAttributeNS(null,"x2",clip_p[1][0] * 25 + 350)
	v2.setAttributeNS(null,"y1",350 - clip_p[0][1] * 25)
	v2.setAttributeNS(null,"y2",350 - clip_p[1][1] * 25)
}

function init_svg_lineortho(evt)
{
	x1 = 423
	y1 = 164
	x2 = 600
	y2 = 300	
	x3 = 512
	y3 = 232
	v1 = svgdoc.getElementById("v1")
	m = svgdoc.getElementById("m")
	p1 = svgdoc.getElementById("p1")
}

function svg_lineortho_move(evt)
{
	if (click)
		{
			xm = coordo_x(evt.clientX)
			ym = coordo_y(evt.clientY)
			if (xm < 325 ) xm = 325
			if (xm > 675 ) xm = 675
			if (ym < 125 ) ym = 125
			if (ym > 375 ) ym = 375
			x3 = xm
			y3 = ym
			svg_lineortho_calcul()
		}
}


function svg_lineortho_calcul()
{
	xA = parseInt(4 * (x1 - 350)) / 100
	yA = parseInt(4 * (350 - y1)) / 100
	xB = parseInt(4 * (x2 - 350)) / 100
	yB = parseInt(4 * (350 - y2)) / 100
	xM = parseInt(4 * (x3 - 350)) / 100
	yM = parseInt(4 * (350 - y3)) / 100
	u = yA - yB
	v = xB - xA
	w = - xA * u - yA * v
	w2 = xM * v - yM * u
	det = u * u + v * v
	xM = ( v * w2 - w * u ) / det
	yM = ( - u * w2 - v * w ) / det
	x3 = 25 * xM + 350
	y3 = 350 - 25 * yM
	p1.setAttributeNS(null,"cx",x3)
	p1.setAttributeNS(null,"cy",y3)
	m.setAttributeNS(null,"x",x3)
	m.setAttributeNS(null,"y",y3)
}

function init_svg_lineAB(evt)
{
	x1 = 423
	y1 = 164
	x2 = 600
	y2 = 300	
	v1 = svgdoc.getElementById("v1")
	a = svgdoc.getElementById("a")
	b = svgdoc.getElementById("b")
	p1 = svgdoc.getElementById("p1")
	p2 = svgdoc.getElementById("p2")
	svg_lineAB_calcul()
}

function svg_lineAB_move(evt)
{
	if (click)
		{
			xm = coordo_x(evt.clientX)
			ym = coordo_y(evt.clientY)
			if (xm < 325 ) xm = 325
			if (xm > 675 ) xm = 675
			if (ym < 125 ) ym = 125
			if (ym > 375 ) ym = 375
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
			svg_lineAB_calcul()
		}
}

function clip_line2(u,v,w)
{
	max_x = 13
	max_y = 9
	min_x = -1
	min_y = -1
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
				if ((x >= min_x)&&(x <= max_x))
				{	
				clip_p[nb_clip][0] = x
				clip_p[nb_clip][1] = min_y
				nb_clip += 1
				}
				x = ( - v * max_y - w ) / u
				if ((x >= min_x)&&(x <= max_x))
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

function svg_lineAB_calcul()
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
	u = uY
	v = - uX
	w = - xA * uY + yA * uX
	clip_line2(u,v,w)
	v1.setAttributeNS(null,"x1",clip_p[0][0] * 25 + 350)
	v1.setAttributeNS(null,"x2",clip_p[1][0] * 25 + 350)
	v1.setAttributeNS(null,"y1",350 - clip_p[0][1] * 25)
	v1.setAttributeNS(null,"y2",350 - clip_p[1][1] * 25)
}
