var num = 0,u1 = 0, u2 = 0, vect1 = "", wined = 0, tried = 0
var poly_num = 1
var click = false
var clip_p = new Array([0,0],[0,0])

function init_svg_systvect(evt)
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


function init_svg_midpoint(evt)
{
	x1 = 423
	y1 = 164
	x2 = 600
	y2 = 300	
	v1 = svgdoc.getElementById("v1")
	a = svgdoc.getElementById("a")
	b = svgdoc.getElementById("b")
	m = svgdoc.getElementById("m")
	p1 = svgdoc.getElementById("p1")
	p2 = svgdoc.getElementById("p2")
	p3 = svgdoc.getElementById("p3")
	svg_midpoint_calcul()
}

function svg_midpoint_move(evt)
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
			svg_midpoint_calcul()
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

function svg_midpoint_calcul()
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
	x3 = ( x1 + x2 ) / 2
	y3 = ( y1 + y2 ) / 2
	p3.setAttributeNS(null,"cx",x3)
	p3.setAttributeNS(null,"cy",y3)
	m.setAttributeNS(null,"x",x3)
	m.setAttributeNS(null,"y",y3)
}

function test_sum(evt)
{
	x1 = evt.target.getAttributeNS(null,"x1") - 0
	y1 = evt.target.getAttributeNS(null,"y1") - 0
	x2 = evt.target.getAttributeNS(null,"x2") - 0
	y2 = evt.target.getAttributeNS(null,"y2") - 0
	u = x2 - x1
	v = y2 - y1
	if (num == 0)
	{
		u1 = u
		v1 = v
		vect1 = evt.target
		num = 1
	}
	else
	{
		if ( evt.target != vect1)
		{
		if (u1 + u == 0)	
		{
			evt.target.setAttributeNS(null,"visibility","hidden")
			vect1.setAttributeNS(null,"visibility","hidden")
			wined += 1
			if (wined == 5)
				alert("You find the five couples in " + (tried + 1) + " trials")
			else
				alert("Good! Continue they are others vectors to find ...")	
		}		
		else
			alert("Sum of vectors is " + (u1 + u) / 25 +" , "+ (v1 + v) / 25)
		}
		else
			alert("It's not serious ...")
		num = 0
		tried += 1
		if (wined == 5)
			sum_reset(evt)
	}
}

function sum_reset(evt)
{
	wined = 0
	tried = 0
	group = evt.currentTarget
	childs = group.childNodes
	for (i = 0 ; i < childs.length ; i ++)
	if (childs.item( i ).nodeType == 1)
		childs.item( i ).setAttributeNS(null,"visibility","visible")
}

function scalar_svg_move(evt)
{if (click)
{
xm = coordo_x(evt.clientX)
if (xm < 69)
	xm = 69
if (xm > 515)
	ym = 515
k = 1 - (xm - 69 ) / 446
svgdoc.getElementById("B1").setAttributeNS(null,"cx",xm)
svgdoc.getElementById("m").setAttributeNS(null,"x",xm)
scalar_svg_calcul();
coeff2=Math.round((1-k)*100)/100
svgdoc.getElementById("code").firstChild.data = coeff2.toString()
}
}

function barycenter_svg_move(evt)
{if (click)
{
xm = coordo_x(evt.clientX)
if (xm < 69)
	xm = 69
if (xm > 515)
	ym = 515
k = 1 - (xm - 69 ) / 446
svgdoc.getElementById("B1").setAttributeNS(null,"cx",xm)
svgdoc.getElementById("m").setAttributeNS(null,"x",xm)
scalar_svg_calcul();
coeff1=Math.round((1-k)*100)/100
coeff2=Math.round(k*100)/100
svgdoc.getElementById("code").firstChild.data = coeff1.toString() + " ; " + coeff2.toString()
}
}

function scalar_svg_calcul()
{
xD1=parseInt(k*69+(1-k)*154)
yD1=parseInt(k*310+(1-k)*71);
svgdoc.getElementById("D1").setAttributeNS(null,"cx",xD1)
svgdoc.getElementById("D1").setAttributeNS(null,"cy",yD1)
svgdoc.getElementById("P").setAttributeNS(null,"x",xD1)
svgdoc.getElementById("P").setAttributeNS(null,"y",yD1)
xD2=parseInt(k*154+(1-k)*515)
yD2=parseInt(k*71+(1-k)*310)
svgdoc.getElementById("D2").setAttributeNS(null,"cx",xD2)
svgdoc.getElementById("D2").setAttributeNS(null,"cy",yD2)
svgdoc.getElementById("Q").setAttributeNS(null,"x",xD2)
svgdoc.getElementById("Q").setAttributeNS(null,"y",yD2)
xD3=parseInt(k*xD1+(1-k)*xD2)
yD3=parseInt(k*yD1+(1-k)*yD2)
svgdoc.getElementById("D3").setAttributeNS(null,"cx",xD3)
svgdoc.getElementById("D3").setAttributeNS(null,"cy",yD3)
svgdoc.getElementById("M").setAttributeNS(null,"x",xD3)
svgdoc.getElementById("M").setAttributeNS(null,"y",yD3)
trace="M"+xD1+" "+yD1+" L"+xD2+" "+yD2;
svgdoc.getElementById("tang2").setAttribute("d",trace);
}


function test_orthogo(evt)
{
	x1 = evt.target.getAttributeNS(null,"x1") - 0
	y1 = evt.target.getAttributeNS(null,"y1") - 0
	x2 = evt.target.getAttributeNS(null,"x2") - 0
	y2 = evt.target.getAttributeNS(null,"y2") - 0
	u = x2 - x1
	v = y2 - y1
	if (num == 0)
	{
		u1 = u
		v1 = v
		vect1 = evt.target
		num = 1
	}
	else
	{
		if ( evt.target != vect1)
		{
		dot = u1 * u + v1 * v
		if (dot == 0)	
		{
			evt.target.setAttributeNS(null,"visibility","hidden")
			vect1.setAttributeNS(null,"visibility","hidden")
			wined += 1
			if (wined == 5)
				alert("You find the five couples in " + (tried + 1) + " trials")
			else
				alert("Good! Continue they are others vectors to find ...")	
		}		
		else
			alert("Your vectors are not perpendicular")
		}
		else
			alert("It's not serious ...")
		num = 0
		tried += 1
		if (wined == 5)
			orthogo_reset(evt)
	}
}

function orthogo_reset(evt)
{
	wined = 0
	tried = 0
	group = evt.currentTarget
	childs = group.childNodes
	for (i = 0 ; i < childs.length ; i ++)
	if (childs.item( i ).nodeType == 1)
		childs.item( i ).setAttributeNS(null,"visibility","visible")
}


function anim_line(evt)
{
	MyLine = evt.target.ownerDocument.getElementById("MyLine")
	x1 = MyLine.getAttributeNS(null,"x1")
	y1 = MyLine.getAttributeNS(null,"y1")
	x2 = MyLine.getAttributeNS(null,"x2")
	y2 = MyLine.getAttributeNS(null,"y2")
	MyLine_length = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1))
	MyLine.style.setProperty("stroke-dasharray",MyLine_length + " " +MyLine_length)
	MyLine.style.setProperty("stroke-dashoffset",MyLine_length)
	MyAnim = evt.target.ownerDocument.getElementById("MyAnim")
	MyAnim.setAttributeNS(null,"from",MyLine_length)
	MyLine.style.setProperty("visibility","visible")
	MyAnim.beginElement()
}

function anim_area()
{
	if (poly_num == 1)
		for (i = 1 ; i <=8 ; i++)
			svgdoc.getElementById("t" + i.toString()).setAttributeNS(null, "visibility","hidden")
	
	if (poly_num > 8 )
	{
		poly_num = 1
		return
	}
	svgdoc.getElementById("t" + poly_num.toString()).setAttributeNS(null, "visibility","visible")
	poly_num += 1
	setTimeout("anim_area()",1000)
}