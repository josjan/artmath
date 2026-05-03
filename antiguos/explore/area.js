var x1=300,y1=250,x2=425,y2=150,x3=250,y3=175,x4=350,y4=250,x0 = 200,y0 = 350
var v1="",p1="",p2="",xya="",xyb="",vxt="",vyt="",vl="",ag="",agt="",cursor=""
var click = false
var points_x = new Array()
var points_y = new Array()

function init_polygonArea(evt)
{
	points_x = [50,225,175,350,450,425]
	points_y = [250,150,300,425,275,175]
	polygo = svgdoc.getElementById("polygo")	
	area = svgdoc.getElementById("area")	
	area_t = svgdoc.getElementById("area_t")	
	peri = svgdoc.getElementById("peri")	
	nb_points = 5
	polygonArea_calcul()
}

function polygonArea_move(evt)
{
	if (click)
		{
			xm = coordo_x(evt.clientX)
			ym = coordo_y(evt.clientY)
			cible = evt.target.getAttributeNS(null,"id")
			num = parseInt(cible.substring(1,cible.length))
			points_x[num] = xm
			points_y[num] = ym
			polygonArea_calcul()
		}
}


function polygonArea_addpoint()
{
	if (nb_points < 10 )
	{
	nb_points += 1
	points_x[nb_points] = ( points_x[nb_points - 1] + points_x[1] ) / 2
	points_y[nb_points] = ( points_y[nb_points - 1] + points_y[1] ) / 2
	str = "<text id='n" + nb_points +"' style='text-anchor:middle;font-size:15;fill:blue' x='200' y='400' dx='15' dy='15'>P<tspan baseline-shift='sub' font-size='9'>"
	str += nb_points + "</tspan></text>"
	node = parseXML( str , svgdoc )
	svgdoc.getElementById("name_pts").appendChild(node)
	xp = 20 + 200 * Math.floor(nb_points / 6)
	yp = 485 + 15 * (nb_points - 6 * Math.floor(nb_points / 6))
	str = "<text id='t" + nb_points + "' x='" + xp + "' y='" + yp + "'>Coordinates P<tspan baseline-shift='sub' font-size='9'>" + nb_points + "</tspan> : <tspan id='c" 
	str += nb_points +"'> 6 ; -6 </tspan></text>"
	node = parseXML( str , svgdoc )
	svgdoc.getElementById("coordo").appendChild(node)
	str = "<path id='tr" + nb_points +"' d='M50 250L425 175 225 150z' fill='red' fill-opacity='0.2' stroke='gray'/>"
	node = parseXML( str , svgdoc )
	svgdoc.getElementById("tri").appendChild(node)
	str = "<circle id='p" + nb_points +"' cx='300' cy='200' r='4' fill='red'/>"
	node = parseXML( str , svgdoc )
	svgdoc.getElementById("pts").appendChild(node)
	polygonArea_calcul()
	}
}

function polygonArea_removepoint()
{
	if (nb_points > 3 )
	{
	node = svgdoc.getElementById("n" + nb_points)
	svgdoc.getElementById("name_pts").removeChild(node)
	node = svgdoc.getElementById("t" + nb_points)
	svgdoc.getElementById("coordo").removeChild(node)
	node = svgdoc.getElementById("tr" + nb_points)
	svgdoc.getElementById("tri").removeChild(node)
	node = svgdoc.getElementById("p" + nb_points)
	svgdoc.getElementById("pts").removeChild(node)
	nb_points -= 1
	polygonArea_calcul()
	}
}


function polygonArea_calcul()
{
	str = ""
	area_tri = ""
	area_polygon = 0
	peri_polygon = 0
	for ( i = 0 ; i <= nb_points ; i++)
	{
		node = svgdoc.getElementById("p" + i.toString())
		node.setAttributeNS(null,"cx",points_x[i])
		node.setAttributeNS(null,"cy",points_y[i])
		node = svgdoc.getElementById("n" + i.toString())
		node.setAttributeNS(null,"x",points_x[i])
		node.setAttributeNS(null,"y",points_y[i])
		node = svgdoc.getElementById("c" + i.toString())
		node.firstChild.data = parseInt(4 * (points_x[i] - 50)) / 100 + " ; " + parseInt(4 * (250 - points_y[i])) / 100
		if ( i > 0 )
		{
		str += points_x[i] + "," + points_y[i] + " "
		str2 = "M" + points_x[0] + " " + points_y[0] + "L" + points_x[i]  + " " + points_y[i] + " " 
		if ( i < nb_points )
			{
			str2 += points_x[i + 1]  + " " + points_y[i + 1] + "z"
			cross = (points_x[i] - points_x[0]) * (points_y[i + 1] - points_y[0]) - (points_x[i + 1 ] - points_x[0]) * (points_y[i] - points_y[0])
			length2 = Math.sqrt((points_x[i+1] - points_x[i]) * (points_x[i+1] - points_x[i]) + (points_y[i+1] - points_y[i]) * (points_y[i+1] - points_y[i]))
			}
		else
			{
			str2 += points_x[1]  + " " + points_y[1] + "z"
			cross = (points_x[i] - points_x[0]) * (points_y[1] - points_y[0]) - (points_x[1] - points_x[0]) * (points_y[i] - points_y[0])
			length2 = Math.sqrt((points_x[1] - points_x[i]) * (points_x[1] - points_x[i]) + (points_y[1] - points_y[i]) * (points_y[1] - points_y[i]))
			}
		node = svgdoc.getElementById("tr" + i.toString())
		node.setAttributeNS(null,"d",str2)
		if (cross > 0 )
			node.setAttributeNS(null,"fill","yellow")
		else		
			node.setAttributeNS(null,"fill","red")
		area_tri += Math.round( - 500 * cross / 625) / 1000 + " ; "
		area_polygon += cross / 2
		peri_polygon += length2
		}
	}
	polygo.setAttributeNS(null,"points",str)
	area.firstChild.data = Math.round( 1000 * Math.abs(area_polygon) / 625 ) / 1000
	area_t.firstChild.data = area_tri
	peri.firstChild.data = Math.round( 1000 * peri_polygon / 25 ) / 1000
	
}


function init_regularPolygonArea(evt)
{
	p1 = svgdoc.getElementById("p1")	
	polygon = svgdoc.getElementById("polygon")	
	perimeter = svgdoc.getElementById("perimeter")	
	area = svgdoc.getElementById("area")	
	sides_number = svgdoc.getElementById("sides")	
	sides_counter = svgdoc.getElementById("sides_2")	
	radius_value = svgdoc.getElementById("radius")	
	envelop = svgdoc.getElementById("envelop")	
	x1 = 550
	y1 = 300
	sides = 5
	radius = 200
	regularPolygonArea_calcul()
}

function regularPolygonArea_move(evt)
{
	if (click)
		{
			x1 = coordo_x(evt.clientX)
			y1 = coordo_y(evt.clientY)
			regularPolygonArea_calcul()
		}
}

function change_sides(num)
{
	sides = sides + num
	if (sides < 3)
		sides = 3
	sides_counter.firstChild.data = sides.toString()
	regularPolygonArea_calcul()
}
	

function regularPolygonArea_calcul()
{
	p1.setAttributeNS(null,"cx",x1)
	p1.setAttributeNS(null,"cy",y1)
	angle = 2 * Math.PI / sides
	radius = Math.sqrt( (x1 - 350) * (x1 - 350) + (y1 - 300) * (y1 - 300) )
	envelop.setAttributeNS(null,"r",radius)
	str = ""
	for ( i = 0 ; i < sides ; i ++ )
	{
		points_x[i] = 350 + radius * Math.cos(angle * i)
		points_y[i] = 300 + radius * Math.sin(angle * i)
		str += points_x[i] + "," + points_y[i] + " "
	}
	polygon.setAttributeNS(null,"points",str)
	r = radius / 25
	area_polygon = sides * r * r * Math.cos( angle / 2 ) * Math.sin( angle / 2 )
	perimeter_polygon = sides * 2 * r * Math.sin( angle / 2 )
	sides_number.firstChild.data = sides.toString()
	area.firstChild.data = Math.round( 100 * area_polygon) / 100
	perimeter.firstChild.data = Math.round(100 * perimeter_polygon) / 100
	radius_value.firstChild.data = Math.round(4 * radius) / 100
}


function init_trapezeArea(evt)
{
	x1 = 100
	y1 = 350
	x2 = 250
	y2 = 150	
	x3 = 375
	y3 = 400
	x4 = 415
	y4 = 180
	AB = svgdoc.getElementById("AB")
	AC = svgdoc.getElementById("AC")
	BD = svgdoc.getElementById("BD")
	CD = svgdoc.getElementById("CD")
	a = svgdoc.getElementById("a")
	b = svgdoc.getElementById("b")
	c = svgdoc.getElementById("c")
	d = svgdoc.getElementById("d")
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
	vxt3 = svgdoc.getElementById("vxt3")
	vyt3 = svgdoc.getElementById("vyt3")
	vl3 = svgdoc.getElementById("vl3")	
	vxt4 = svgdoc.getElementById("vxt4")
	vyt4 = svgdoc.getElementById("vyt4")
	vl4 = svgdoc.getElementById("vl4")	
	vzt = svgdoc.getElementById("vzt")
	vzt2 = svgdoc.getElementById("vzt2")	
	area = svgdoc.getElementById("area")	
	peri = svgdoc.getElementById("peri")	
	tri = svgdoc.getElementById("tri")	
	trapezeArea_calcul()
}

function trapezeArea_move(evt)
{
	if (click)
		{
			xm = coordo_x(evt.clientX)
			ym = coordo_y(evt.clientY)
			rapp = (x4 - x2) / (x3 - x1)
			cible = evt.target.getAttributeNS(null,"id")
			if (cible == "p1")
				{ 
				x1 = xm
				y1 = ym
				x4 = x2 + rapp * (x3 - x1)
				y4 = y2 + rapp * (y3 - y1)
				}
			if (cible == "p2")
				{ 
				x2 = xm
				y2 = ym
				x4 = x2 + rapp * (x3 - x1)
				y4 = y2 + rapp * (y3 - y1)
				}
			if (cible == "p3")
				{ 
				x3 = xm
				y3 = ym
				x4 = x2 + rapp * (x3 - x1)
				y4 = y2 + rapp * (y3 - y1)
				}
			if (cible == "p4")
				{ 
				x4 = xm
				y4 = ym
				rapp = (x4 - x2) / (x3 - x1)
				x4 = x2 + rapp * (x3 - x1)
				y4 = y2 + rapp * (y3 - y1)
				}
			trapezeArea_calcul()
		}
}


function trapezeArea_calcul()
{
	p1.setAttributeNS(null,"cx",x1)
	p1.setAttributeNS(null,"cy",y1)
	p2.setAttributeNS(null,"cx",x2)
	p2.setAttributeNS(null,"cy",y2)
	p3.setAttributeNS(null,"cx",x3)
	p3.setAttributeNS(null,"cy",y3)
	p4.setAttributeNS(null,"cx",x4)
	p4.setAttributeNS(null,"cy",y4)

	AB.setAttributeNS(null,"x1",x1)
	AB.setAttributeNS(null,"y1",y1)
	AB.setAttributeNS(null,"x2",x2)
	AB.setAttributeNS(null,"y2",y2)
	AC.setAttributeNS(null,"x1",x1)
	AC.setAttributeNS(null,"y1",y1)
	AC.setAttributeNS(null,"x2",x3)
	AC.setAttributeNS(null,"y2",y3)
	BD.setAttributeNS(null,"x1",x2)
	BD.setAttributeNS(null,"y1",y2)
	BD.setAttributeNS(null,"x2",x4)
	BD.setAttributeNS(null,"y2",y4)
	CD.setAttributeNS(null,"x1",x3)
	CD.setAttributeNS(null,"y1",y3)
	CD.setAttributeNS(null,"x2",x4)
	CD.setAttributeNS(null,"y2",y4)
	tri.setAttributeNS(null,"x1",x3)
	tri.setAttributeNS(null,"y1",y3)
	tri.setAttributeNS(null,"x2",x2)
	tri.setAttributeNS(null,"y2",y2)

	uX = parseInt(4 * (x2 - x1)) / 100
	uY = parseInt(4 * (y1 - y2)) / 100
	uX2 = parseInt(4 * (x3 - x1)) / 100
	uY2 = parseInt(4 * (y1 - y3)) / 100
	cross = uX * uY2 - uY * uX2
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
	l_v = Math.sqrt(uX * uX + uY * uY)
	l_v2 = Math.sqrt(uX2 * uX2 + uY2 * uY2)
	xya.firstChild.data = xA + " ; " + yA
	xyb.firstChild.data = xB + " ; " + yB
	xyc.firstChild.data = xC + " ; " + yC
	xyd.firstChild.data = xD + " ; " + yD
	vxt.firstChild.data = uX
	vyt.firstChild.data = uY
	vl.firstChild.data = parseInt(100 * l_v) / 100
	vxt2.firstChild.data = uX2
	vyt2.firstChild.data = uY2
	vl2.firstChild.data = parseInt(100 * l_v2) / 100
	uX3 = parseInt(4 * (x2 - x4)) / 100
	uY3 = parseInt(4 * (y4 - y2)) / 100
	uX4 = parseInt(4 * (x3 - x4)) / 100
	uY4 = parseInt(4 * (y4 - y3)) / 100
	l_v3 = Math.sqrt(uX3 * uX3 + uY3 * uY3)
	l_v4 = Math.sqrt(uX4 * uX4 + uY4 * uY4)
	vxt3.firstChild.data = uX3
	vyt3.firstChild.data = uY3
	vl3.firstChild.data = parseInt(100 * l_v3) / 100
	vxt4.firstChild.data = uX4
	vyt4.firstChild.data = uY4
	vl4.firstChild.data = parseInt(100 * l_v4) / 100
	cross2 = uX3 * uY4 - uY3 * uX4
	vzt.firstChild.data = cross
	vzt2.firstChild.data = cross2
	area.firstChild.data = 0.5 * ( Math.abs(cross) + Math.abs(cross2) )
	perimeter = parseInt(100 * (l_v + l_v2 + l_v3 + l_v4 )) / 100
	peri.firstChild.data = perimeter
}


function init_circleArea(evt)
{
	x1 = 425
	y1 = 225
	x2 = 450
	y2 = 400	
	x3 = 125
	y3 = 350
	a = svgdoc.getElementById("a")
	b = svgdoc.getElementById("b")
	c = svgdoc.getElementById("c")
	d = svgdoc.getElementById("d")
	p1 = svgdoc.getElementById("p1")
	p2 = svgdoc.getElementById("p2")
	p3 = svgdoc.getElementById("p3")
	p4 = svgdoc.getElementById("p4")
	circ = svgdoc.getElementById("circ")
	circleArea_calcul()
}

function circleArea_move(evt)
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
			circleArea_calcul()
		}
}


function circleArea_calcul()
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
	u1 = x2 - x1
	v1 = y2 - y1
	w1 = (x2 * x2 + y2 * y2 - x1 * x1 - y1 * y1) / 2	
	u2 = x3 - x1
	v2 = y3 - y1
	w2 = (x3 * x3 + y3 * y3 - x1 * x1 - y1 * y1) / 2	
	det = u1 * v2 - u2 * v1
	if (det != 0 )
	{
		x4 = ( w1 * v2 - w2 * v1 ) / det
		y4 = ( u1 * w2 - u2 * w1 ) / det
		d.setAttributeNS(null,"x",x4)
		d.setAttributeNS(null,"y",y4)
		p4.setAttributeNS(null,"cx",x4)
		p4.setAttributeNS(null,"cy",y4)
		r = Math.sqrt ( (x1 - x4) * (x1 - x4) + (y1 - y4) * (y1 - y4))
		circ.setAttributeNS(null,"cx",x4)
		circ.setAttributeNS(null,"cy",y4)
		circ.setAttributeNS(null,"r",r)
		area = Math.PI * r * r / 625
		perimeter = 2 * Math.PI * r / 25
		svgdoc.getElementById("r").firstChild.data = Math.round( 40 * r ) / 1000
		svgdoc.getElementById("area").firstChild.data = Math.round( 1000 * area ) / 1000
		svgdoc.getElementById("perimeter").firstChild.data = Math.round( 1000 * perimeter ) / 1000
	}
}


function init_ellipseArea(evt)
{
	p1 = svgdoc.getElementById("p1")
	p2 = svgdoc.getElementById("p2")
	p3 = svgdoc.getElementById("p3")
	axis = svgdoc.getElementById("axis")	
	ellipse = svgdoc.getElementById("ellipse")	
	box = svgdoc.getElementById("box")	
	rotate = svgdoc.getElementById("rotate")	
	x1 = 600
	y1 = 250
	x2 = 350
	y2 = 250
	x3 = 450
	y3 = 325
	angle = 0
	ellipseArea_calcul()
}

function ellipseArea_move(evt)
{
	if (click)
		{
			xm = coordo_x(evt.clientX)
			ym = coordo_y(evt.clientY)
			cible = evt.target.getAttributeNS(null,"id")
			if (cible == "p1")
			{
				y1 = ym
				angle = Math.atan((y1 - y2) / (x1 - x2))
			}	
			if (cible == "p2")
			{
				x2 = xm
				y2 = ym
				y1 = y2 + (600 - x2) * Math.tan(angle) 
			}
			if (cible == "p3")
			{
				x3 = x2 + (xm - x2 ) * Math.cos(angle) + (ym - y2) * Math.sin(angle) 
				y3 = y2 - (xm - x2 ) * Math.sin(angle) + (ym - y2) * Math.cos(angle) 
			}
			ellipseArea_calcul()
		}
}

function ellipseArea_calcul()
{
	p1.setAttributeNS(null,"cy",y1)
	p2.setAttributeNS(null,"cx",x2)
	p2.setAttributeNS(null,"cy",y2)
	p3.setAttributeNS(null,"cx",x3)
	p3.setAttributeNS(null,"cy",y3)
	angle2 = angle * 180 / Math.PI	
	str = "rotate(" + angle2 + ","+ x2 + "," + y2 + ")"
	rotate.setAttributeNS(null,"transform",str)
	p3.setAttributeNS(null,"transform",str)
	ellipse.setAttributeNS(null,"cx",x2)
	ellipse.setAttributeNS(null,"cy",y2)
	if (x3 > x2)
		box.setAttributeNS(null,"x",2 * x2 - x3)
	else
		box.setAttributeNS(null,"x",x3)
	if (y3 > y2)
		box.setAttributeNS(null,"y",2 * y2 - y3)
	else
		box.setAttributeNS(null,"y",y3)
	box.setAttributeNS(null,"width",2 * Math.abs(x2 - x3))
	box.setAttributeNS(null,"height",2 * Math.abs(y2 - y3))
	ellipse.setAttributeNS(null,"rx",Math.abs(x2 - x3))
	ellipse.setAttributeNS(null,"ry",Math.abs(y2 - y3))
	rx = Math.abs(x2 - x3) / 25
	ry = Math.abs(y2 - y3) / 25
	axis.setAttributeNS(null,"x1",x2 - 500 * Math.cos(angle))
	axis.setAttributeNS(null,"y1",y2 - 500 * Math.sin(angle))
	axis.setAttributeNS(null,"x2",x2 + 500 * Math.cos(angle))
	axis.setAttributeNS(null,"y2",y2 + 500 * Math.sin(angle))
	svgdoc.getElementById("rx").firstChild.data = parseInt(100 * rx) / 100
	svgdoc.getElementById("ry").firstChild.data = parseInt(100 * ry) / 100
	area = Math.PI * rx * ry
	svgdoc.getElementById("area").firstChild.data = parseInt(100 * area) / 100
	perimeter = Math.PI * Math.sqrt( 2 * (rx * rx + ry * ry)) / 25
	svgdoc.getElementById("perimeter").firstChild.data = parseInt(100 * perimeter) / 100
}


function init_rectangleArea(evt)
{
	x1 = 100
	y1 = 350
	x2 = 100
	y2 = 150	
	x3 = 425
	y3 = 350
	x4 = 425
	y4 = 150
	AB = svgdoc.getElementById("AB")
	AC = svgdoc.getElementById("AC")
	BD = svgdoc.getElementById("BD")
	CD = svgdoc.getElementById("CD")
	a = svgdoc.getElementById("a")
	b = svgdoc.getElementById("b")
	c = svgdoc.getElementById("c")
	d = svgdoc.getElementById("d")
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
	area = svgdoc.getElementById("area")	
	ang = svgdoc.getElementById("ang")	
	peri = svgdoc.getElementById("peri")	
	rectangleArea_calcul()
}

function rectangleArea_move(evt)
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
				x2 = x1
				y3 = y1
				}
			if (cible == "p2")
				{ 
				x2 = xm
				y2 = ym
				x1 = x2
				y4 = y2
				}
			if (cible == "p3")
				{ 
				x3 = xm
				y3 = ym
				x4 = x3
				y1 = y3
				}
			if (cible == "p4")
				{ 
				x4 = xm
				y4 = ym
				x3 = x4
				y2 = y4
				}

			rectangleArea_calcul()
		}
}


function rectangleArea_calcul()
{
	p1.setAttributeNS(null,"cx",x1)
	p1.setAttributeNS(null,"cy",y1)
	p2.setAttributeNS(null,"cx",x2)
	p2.setAttributeNS(null,"cy",y2)
	p3.setAttributeNS(null,"cx",x3)
	p3.setAttributeNS(null,"cy",y3)
	p4.setAttributeNS(null,"cx",x4)
	p4.setAttributeNS(null,"cy",y4)

	AB.setAttributeNS(null,"x1",x1)
	AB.setAttributeNS(null,"y1",y1)
	AB.setAttributeNS(null,"x2",x2)
	AB.setAttributeNS(null,"y2",y2)
	AC.setAttributeNS(null,"x1",x1)
	AC.setAttributeNS(null,"y1",y1)
	AC.setAttributeNS(null,"x2",x3)
	AC.setAttributeNS(null,"y2",y3)
	BD.setAttributeNS(null,"x1",x2)
	BD.setAttributeNS(null,"y1",y2)
	BD.setAttributeNS(null,"x2",x4)
	BD.setAttributeNS(null,"y2",y4)
	CD.setAttributeNS(null,"x1",x3)
	CD.setAttributeNS(null,"y1",y3)
	CD.setAttributeNS(null,"x2",x4)
	CD.setAttributeNS(null,"y2",y4)

	uX = parseInt(4 * (x2 - x1)) / 100
	uY = parseInt(4 * (y1 - y2)) / 100
	uX2 = parseInt(4 * (x3 - x1)) / 100
	uY2 = parseInt(4 * (y1 - y3)) / 100
	cross = uX * uY2 - uY * uX2
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
	area.firstChild.data = Math.abs(cross)
	dp = "M" + (x1 + 75 * uX2 / l_v2).toString() + " " + (y1 - 75 * uY2 / l_v2).toString() 
	dp += "A 75 75 0 0 "
	if ((uX * uY2 - uX2 * uY) <= 0) 
		dp += "0 "
	else
		dp += "1 "
	dp += (x1 + 75 * uX / l_v).toString() + " " + (y1 - 75 * uY / l_v).toString() 
	ag.setAttributeNS(null,"d",dp)
	perimeter = 2 * l_v + 2 * l_v2
	peri.firstChild.data = parseInt(100 * perimeter) / 100
}


function init_parallelogramArea(evt)
{
	x1 = 100
	y1 = 350
	x2 = 250
	y2 = 150	
	x3 = 375
	y3 = 400
	x4 = 525
	y4 = 200
	AB = svgdoc.getElementById("AB")
	AC = svgdoc.getElementById("AC")
	BD = svgdoc.getElementById("BD")
	CD = svgdoc.getElementById("CD")
	a = svgdoc.getElementById("a")
	b = svgdoc.getElementById("b")
	c = svgdoc.getElementById("c")
	d = svgdoc.getElementById("d")
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
	area = svgdoc.getElementById("area")	
	ang = svgdoc.getElementById("ang")	
	peri = svgdoc.getElementById("peri")	
	parallelogramArea_calcul()
}

function parallelogramArea_move(evt)
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
				x4 = x2 + x3 - x1
				y4 = y2 + y3 - y1

			parallelogramArea_calcul()
		}
}


function parallelogramArea_calcul()
{
	p1.setAttributeNS(null,"cx",x1)
	p1.setAttributeNS(null,"cy",y1)
	p2.setAttributeNS(null,"cx",x2)
	p2.setAttributeNS(null,"cy",y2)
	p3.setAttributeNS(null,"cx",x3)
	p3.setAttributeNS(null,"cy",y3)
	p4.setAttributeNS(null,"cx",x4)
	p4.setAttributeNS(null,"cy",y4)

	AB.setAttributeNS(null,"x1",x1)
	AB.setAttributeNS(null,"y1",y1)
	AB.setAttributeNS(null,"x2",x2)
	AB.setAttributeNS(null,"y2",y2)
	AC.setAttributeNS(null,"x1",x1)
	AC.setAttributeNS(null,"y1",y1)
	AC.setAttributeNS(null,"x2",x3)
	AC.setAttributeNS(null,"y2",y3)
	BD.setAttributeNS(null,"x1",x2)
	BD.setAttributeNS(null,"y1",y2)
	BD.setAttributeNS(null,"x2",x4)
	BD.setAttributeNS(null,"y2",y4)
	CD.setAttributeNS(null,"x1",x3)
	CD.setAttributeNS(null,"y1",y3)
	CD.setAttributeNS(null,"x2",x4)
	CD.setAttributeNS(null,"y2",y4)

	uX = parseInt(4 * (x2 - x1)) / 100
	uY = parseInt(4 * (y1 - y2)) / 100
	uX2 = parseInt(4 * (x3 - x1)) / 100
	uY2 = parseInt(4 * (y1 - y3)) / 100
	cross = uX * uY2 - uY * uX2
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

	l_v =  Math.sqrt(uX * uX + uY * uY)
	l_v2 = Math.sqrt(uX2 * uX2 + uY2 * uY2) 
	xya.firstChild.data = xA + " ; " + yA
	xyb.firstChild.data = xB + " ; " + yB
	xyc.firstChild.data = xC + " ; " + yC
	xyd.firstChild.data = xD + " ; " + yD

	vxt.firstChild.data = uX
	vyt.firstChild.data = uY
	vl.firstChild.data = parseInt(100 * l_v) / 100

	vxt2.firstChild.data = uX2
	vyt2.firstChild.data = uY2
	vl2.firstChild.data = parseInt(100 * l_v2) / 100
	vxs.firstChild.data = cross
	vls.firstChild.data = Math.abs(cross)
	area.firstChild.data = Math.abs(cross)
	dp = "M" + (x1 + 75 * uX2 / l_v2).toString() + " " + (y1 - 75 * uY2 / l_v2).toString() 
	dp += "A 75 75 0 0 "
	if ((uX * uY2 - uX2 * uY) <= 0) 
		dp += "0 "
	else
		dp += "1 "
	dp += (x1 + 75 * uX / l_v).toString() + " " + (y1 - 75 * uY / l_v).toString() 
	ag.setAttributeNS(null,"d",dp)
	angle = Math.asin( Math.abs(cross) / (l_v * l_v2)) * 180 / Math.PI
	ang.firstChild.data = Math.round(angle)
	perimeter = 2 * l_v + 2 * l_v2
	peri.firstChild.data = parseInt( 100 * perimeter) / 100
}


function init_triangleArea(evt)
{
	x3 = 425
	y3 = 325
	x1 = 100
	y1 = 350
	x2 = 250
	y2 = 150	
	AB = svgdoc.getElementById("AB")
	AC = svgdoc.getElementById("AC")
	BC = svgdoc.getElementById("BC")
	a = svgdoc.getElementById("a")
	b = svgdoc.getElementById("b")
	c = svgdoc.getElementById("c")
	p1 = svgdoc.getElementById("p1")
	p2 = svgdoc.getElementById("p2")
	p3 = svgdoc.getElementById("p3")
	ag = svgdoc.getElementById("ag")
	xya = svgdoc.getElementById("xya")
	xyb = svgdoc.getElementById("xyb")
	xyc = svgdoc.getElementById("xyc")
	vxt = svgdoc.getElementById("vxt")
	vyt = svgdoc.getElementById("vyt")
	vl = svgdoc.getElementById("vl")	
	vxt2 = svgdoc.getElementById("vxt2")
	vyt2 = svgdoc.getElementById("vyt2")
	vl2 = svgdoc.getElementById("vl2")	
	vxt3 = svgdoc.getElementById("vxt3")
	vyt3 = svgdoc.getElementById("vyt3")
	vl3 = svgdoc.getElementById("vl3")	
	vxs = svgdoc.getElementById("vxs")
	vys = svgdoc.getElementById("vys")
	vls = svgdoc.getElementById("vls")	
	area = svgdoc.getElementById("area")	
	ang = svgdoc.getElementById("ang")	
	peri = svgdoc.getElementById("peri")	
	triangleArea_calcul()
}

function triangleArea_move(evt)
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
			triangleArea_calcul()
		}
}


function triangleArea_calcul()
{
	p1.setAttributeNS(null,"cx",x1)
	p1.setAttributeNS(null,"cy",y1)
	p2.setAttributeNS(null,"cx",x2)
	p2.setAttributeNS(null,"cy",y2)
	p3.setAttributeNS(null,"cx",x3)
	p3.setAttributeNS(null,"cy",y3)

	AB.setAttributeNS(null,"x1",x1)
	AB.setAttributeNS(null,"y1",y1)
	AB.setAttributeNS(null,"x2",x2)
	AB.setAttributeNS(null,"y2",y2)
	AC.setAttributeNS(null,"x1",x1)
	AC.setAttributeNS(null,"y1",y1)
	AC.setAttributeNS(null,"x2",x3)
	AC.setAttributeNS(null,"y2",y3)
	BC.setAttributeNS(null,"x1",x2)
	BC.setAttributeNS(null,"y1",y2)
	BC.setAttributeNS(null,"x2",x3)
	BC.setAttributeNS(null,"y2",y3)

	uX = parseInt(4 * (x2 - x1)) / 100
	uY = parseInt(4 * (y1 - y2)) / 100
	uX2 = parseInt(4 * (x3 - x1)) / 100
	uY2 = parseInt(4 * (y1 - y3)) / 100
	uX3 = parseInt(4 * (x3 - x2)) / 100
	uY3 = parseInt(4 * (y2 - y3)) / 100
	cross = uX * uY2 - uY * uX2
	a.setAttributeNS(null,"x",x1)
	a.setAttributeNS(null,"y",y1)
	b.setAttributeNS(null,"x",x2)
	b.setAttributeNS(null,"y",y2)
	c.setAttributeNS(null,"x",x3)
	c.setAttributeNS(null,"y",y3)
	xA = parseInt(4 * (x1 - 50)) / 100
	yA = parseInt(4 * (250 - y1)) / 100
	xB = parseInt(4 * (x2 - 50)) / 100
	yB = parseInt(4 * (250 - y2)) / 100
	xC = parseInt(4 * (x3 - 50)) / 100
	yC = parseInt(4 * (250 - y3)) / 100

	l_v = Math.sqrt(uX * uX + uY * uY)
	l_v2 = Math.sqrt(uX2 * uX2 + uY2 * uY2)
	l_v3 = Math.sqrt(uX3 * uX3 + uY3 * uY3)
	xya.firstChild.data = xA + " ; " + yA
	xyb.firstChild.data = xB + " ; " + yB
	xyc.firstChild.data = xC + " ; " + yC

	vxt.firstChild.data = uX
	vyt.firstChild.data = uY
	vl.firstChild.data = parseInt(100 * l_v) / 100

	vxt2.firstChild.data = uX2
	vyt2.firstChild.data = uY2
	vl2.firstChild.data = parseInt(100 * l_v2) / 100
	vxt3.firstChild.data = uX3
	vyt3.firstChild.data = uY3
	vl3.firstChild.data = parseInt(100 * l_v3) / 100
	vxs.firstChild.data = cross
	vls.firstChild.data = Math.abs(cross)
	area.firstChild.data = Math.abs(cross) / 2
	dp = "M" + (x1 + 75 * uX2 / l_v2).toString() + " " + (y1 - 75 * uY2 / l_v2).toString() 
	dp += "A 75 75 0 0 "
	if ((uX * uY2 - uX2 * uY) <= 0) 
		dp += "0 "
	else
		dp += "1 "
	dp += (x1 + 75 * uX / l_v).toString() + " " + (y1 - 75 * uY / l_v).toString() 
	ag.setAttributeNS(null,"d",dp)
	angle = Math.asin( Math.abs(cross) / (l_v * l_v2)) * 180 / Math.PI
	ang.firstChild.data = Math.round(angle)
	perimeter = l_v + l_v2 + l_v3
	peri.firstChild.data = parseInt( 100 * perimeter ) / 100
}
