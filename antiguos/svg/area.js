var aires = new Array(),poly_num = 1
var coordo = new Array(),points="",surf=0,surf2=0;
var num = 0,area1=0, vect1 = "", wined = 0, tried = 0

function init_svg_parallelogramArea(evt)
{
obj=svgdoc.getElementById('pol1')
longueur=obj.getTotalLength()
obj.getStyle().setProperty('stroke-dasharray',longueur.toString()+" "+longueur.toString());
obj.getStyle().setProperty('stroke-dashoffset',longueur.toString())
obj=svgdoc.getElementById('a1')
obj.setAttribute('from',longueur.toString())
}

function init_svg_rectangleArea(evt)
{
obj=svgdoc.getElementById('pol1');
w=parseFloat(obj.getAttribute("width"))
h=parseFloat(obj.getAttribute("height"))
longueur=2*( w + h )
obj.getStyle().setProperty('stroke-dasharray',longueur.toString()+" "+longueur.toString());
obj.getStyle().setProperty('stroke-dashoffset',longueur.toString())
obj=svgdoc.getElementById('a1')
obj.setAttribute('from',longueur.toString())
}

function test_area(evt)
{
	str = evt.target.getAttributeNS(null,"d") 
	l_pos = str.indexOf("l")
	str = str.substring(l_pos +1,str.length - 1)
	values = str.split(" ")
	if (num == 0)
	{
		vect1 = evt.target
		num = 1
		area1 = 0.5 * Math.abs( values[0] * values[3] - values[1] * values[2])
	}
	else
	{
		area2 = 0.5 * Math.abs( values[0] * values[3] - values[1] * values[2])
		if ( evt.target != vect1)
		{
		if (area1 == area2)	
		{
			evt.target.setAttributeNS(null,"visibility","hidden")
			vect1.setAttributeNS(null,"visibility","hidden")
			wined += 1
			if (wined == 5)
				alert("You find the five couples in " + (tried + 1) + " trials")
			else
				alert("Good! Continue they are others triangles to find ...")	
		}		
		else
			alert("Your triangles have not same area")
		}
		else
			alert("It's not serious ...")
		num = 0
		tried += 1
		if (wined == 5)
			area_reset(evt)
	}
}

function area_reset(evt)
{
	wined = 0
	tried = 0
	group = evt.currentTarget
	childs = group.childNodes
	for (i = 0 ; i < childs.length ; i ++)
	if (childs.item( i ).nodeType == 1)
		childs.item( i ).setAttributeNS(null,"visibility","visible")
}

function init_svg_polygonArea(evt)
{
obj = svgdoc.getElementById('pol1')
points = obj.getAttribute("points")
coordo = points.split(" ")
svg_polygonArea_purger()
x0=50
y0=0
surf=0
for (i = 0 ; i <coordo.length - 1 ; i++)
	{
		svg_polygonArea_calcul( i, i + 1)
		surf = surf + surf2
	}
svg_polygonArea_calcul(coordo.length - 1 , 0)
surf = surf + surf2
obj = svgdoc.getElementById('inf1').firstChild
obj.data = "area : "+Math.abs(surf.toString())
obj = svgdoc.getElementById('pol2')
points = obj.getAttribute("points")
coordo = points.split(" ")
svg_polygonArea_purger()
x0 = 0
y0 = 0
surf = 0
for (i = 0 ; i < coordo.length - 1 ; i++)
	{
		svg_polygonArea_calcul2( i , i + 1)
		surf = surf + surf2
	}
svg_polygonArea_calcul2(coordo.length - 1 , 0)
surf=surf+surf2
obj = svgdoc.getElementById('inf2').firstChild
obj.data = "area : " + Math.abs(surf.toString())
}


function svg_polygonArea_calcul(j,k)
{
p0=coordo[j].split(",")
x1=p0[0]
y1=p0[1]
p0=coordo[k].split(",")
x2=p0[0]
y2=p0[1]
surf2=((x1-x0)*(y2-y0)-(x2-x0)*(y1-y0))/2
chaine="M"+x0+" "+y0+"L"+x1+" "+y1+" "+x2+" "+y2+"z"
node=svgdoc.createElement('path')
node.setAttribute('d',chaine);
if (surf2<0) 
	obj=svgdoc.getElementById('decoupe')
else 
	obj=svgdoc.getElementById('decoupe2')
obj.appendChild(node)
}

function svg_polygonArea_calcul2(j,k)
{
p0=coordo[j].split(",")
x1=p0[0]
y1=p0[1]
p0=coordo[k].split(",")
x2=p0[0]
y2=p0[1]
surf2=(x1-x2)*(parseFloat(y2)+parseFloat(y1))/2
chaine="M"+x1+" "+y0+"L"+x1+" "+y1+" "+x2+" "+y2+" "+x2+" "+y0+"z"
node=svgdoc.createElement('path')
node.setAttribute('d',chaine);
if (surf2<0) 
	obj=svgdoc.getElementById('decoupe')
else 
	obj=svgdoc.getElementById('decoupe2')
obj.appendChild(node)
}

function svg_polygonArea_purger()
{n=coordo.length
k=-1
var coordo2 = new Array()
for (i=0;i<n;i++)
{
	if (coordo[i]!="")
	{
		k+=1
		coordo2[k]=coordo[i]
	}
}
coordo=coordo2
}


function init_svg_regularPolygonArea(evt)
{
	p1 = svgdoc.getElementById("p1")	
	polygon = svgdoc.getElementById("polygon")	
	envelop = svgdoc.getElementById("envelop")	
	sides_counter = svgdoc.getElementById("sides_2")	
	step_counter = svgdoc.getElementById("step_2")	
	x1 = 550
	y1 = 300
	sides = 5
	step = 2
	radius = 200
	svg_regularPolygonArea_calcul()
}

function svg_regularPolygonArea_move(evt)
{
	if (click)
		{
			x1 = coordo_x(evt.clientX)
			y1 = coordo_y(evt.clientY)
			svg_regularPolygonArea_calcul()
		}
}

function svg_change_sides(num)
{
	sides = sides + num
	if (sides < 3)
		sides = 3
	sides_counter.firstChild.data = sides.toString()
	svg_regularPolygonArea_calcul()
}

function svg_change_step(num)
{
	step = step + num
	if (step < 1)
		step = 1
	step_counter.firstChild.data = step.toString()
	svg_regularPolygonArea_calcul()
}	

function svg_regularPolygonArea_calcul()
{
	p1.setAttributeNS(null,"cx",x1)
	p1.setAttributeNS(null,"cy",y1)
	angle = 2 * Math.PI / sides
	radius = Math.sqrt( (x1 - 350) * (x1 - 350) + (y1 - 300) * (y1 - 300) )
	envelop.setAttributeNS(null,"r",radius)
	str = ""
	for ( i = 0 ; i < sides * step ; i ++ )
	{
		points_x[i] = 350 + radius * Math.cos(angle * i * step)
		points_y[i] = 300 + radius * Math.sin(angle * i * step)
		str += points_x[i] + "," + points_y[i] + " "
	}
	polygon.setAttributeNS(null,"points",str)
}


function init_svg_trapezeArea(evt)
{
	trapezeArea_svg_polygon(evt)
}

function trapezeArea_svg_polygon(evt)
{
	y0 = 350
	area = 0
	str=""
	for (i = 1; i <=8 ; i++)
	{
	side = svgdoc.getElementById("t" + i.toString()).getAttributeNS(null , "d").substring(9,24)
	coordo = side.split(" ")
	p1 = coordo[0].split(",")
	p2 = coordo[1].split(",")
	aires[i] = ((700 - p1[1] - p2[1]) * (p2[0] - p1[0])) / 1250
	area += aires[i]
	str += aires[i].toString() + " ; "
	}
	svgdoc.getElementById("aires").firstChild.data = str
	svgdoc.getElementById("poly").firstChild.data = area.toString()
}

function trapezeArea_svg_area()
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
	setTimeout("trapezeArea_svg_area()",1000)
}
function init_svg_ellipseArea(evt)
{
obj=svgdoc.getElementById('pol1')
rx=parseFloat(obj.getAttribute("rx"))
ry=parseFloat(obj.getAttribute("ry"))
longueur=Math.sqrt(2 * (rx*rx+ry*ry))*Math.PI
obj.getStyle().setProperty('stroke-dasharray',longueur.toString()+" "+longueur.toString());
obj.getStyle().setProperty('stroke-dashoffset',longueur.toString());
obj=svgdoc.getElementById('a1');
obj.setAttribute('from',longueur.toString());
}

function init_svg_circleArea(evt)
{
obj=svgdoc.getElementById('pol1');
r=parseFloat(obj.getAttribute("r"));
longueur=2*Math.PI*r
obj.getStyle().setProperty('stroke-dasharray',longueur.toString()+" "+longueur.toString());
obj.getStyle().setProperty('stroke-dashoffset',longueur.toString());
obj=svgdoc.getElementById('a1');
obj.setAttribute('from',longueur.toString());
}