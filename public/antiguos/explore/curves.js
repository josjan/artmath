var click = false
var xA1=100,yA1=300,xC1=200,yC1=100,xC2=400,yC2=100,xA2=500,yA2=300;
var k=0.5,xD1=150,yD1=200,xD2=300,yD2=100,xD3=450,yD3=200;
var xD4=225,yD4=150,xD5=375,yD5=150,xD6=300,yD6=150,xB1=300,yB1=300;


function init_arcEllipse(evt)
{
	p1 = svgdoc.getElementById("p1")
	p2 = svgdoc.getElementById("p2")
	m1 = svgdoc.getElementById("m1")
	m2 = svgdoc.getElementById("m2")
	arc = svgdoc.getElementById("arc")	
	atx1 = svgdoc.getElementById("atx1")	
	atx2 = svgdoc.getElementById("atx2")	
	proj1 = svgdoc.getElementById("proj1")
	proj2 = svgdoc.getElementById("proj2")
	x1 = 500
	y1 = 250
	x2 = 350
	y2 = 100
	ag1 = 0
	ag2 = 90
}

function arcEllipse_move(evt)
{
	if (click)
		{
		xm= coordo_x(evt.clientX)
		ym= coordo_y(evt.clientY)
			cible = evt.target.getAttributeNS(null, "id")
			if ( cible == "p1")
			{
				x1 = xm
				y1 = ym
			}
			if ( cible == "p2")
			{
				x2 = xm
				y2 = ym
			}
			arcEllipse_calcul()
		}
}


function arcEllipse_calcul()
{
	if ( x1 != 350)
		ag1 = Math.atan((y1 - 250) / (x1 - 350)) * 180 / Math.PI
	else
		{
		ag1 = - 90
		if ( y1 > 250 ) ag1 = 90
		}
	if ( x1 < 350 )
		ag1 += 180	
	if ( x2 != 350)
		ag2 = Math.atan((y2 - 250) / (x2 - 350)) * 180 / Math.PI
	else
		{
		ag2 = - 90
		if ( y2 > 250 ) ag2 = 90
		}
	if ( x2 < 350 )
		ag2 += 180	
	if ( ag2 < ag1 )
		ag2 += 360

	x1 = 350 + 150 * Math.cos ( ag1 * Math.PI / 180 )
	y1 = 250 + 150 * Math.sin ( ag1 * Math.PI / 180 )
	x2 = 350 + 150 * Math.cos ( ag2 * Math.PI / 180 )
	y2 = 250 + 150 * Math.sin ( ag2 * Math.PI / 180 )

	p1.setAttributeNS(null,"cx",x1)
	p1.setAttributeNS(null,"cy",y1)
	p2.setAttributeNS(null,"cx",x2)
	p2.setAttributeNS(null,"cy",y2)
	proj1.setAttributeNS(null,"x1",x1)
	proj1.setAttributeNS(null,"x2",x1)
	proj2.setAttributeNS(null,"x1",x2)
	proj2.setAttributeNS(null,"x2",x2)

	m1.setAttributeNS(null,"x",x1)
	m1.setAttributeNS(null,"y",y1)
	m2.setAttributeNS(null,"x",x2)
	m2.setAttributeNS(null,"y",y2)

	ya1 = 250 + ( y1 - 250 ) * 2 / 3
	ya2 = 250 + ( y2 - 250 ) * 2 / 3

	str = "M 350 250 L" + x1 + " " + ya1 + "A150 100 0 "
	if (Math.abs( ag1 - ag2) < 180)
		str += " 1 "
	else
		str += " 0 "
	str += " 0 " + x2 + " " + ya2 + "z"

	arc.setAttributeNS(null, "d" , str )
	atx1.firstChild.data = parseInt(- 100 *ag1) / 100
	atx2.firstChild.data = parseInt( 100 * (360 - ag2)) / 100
		
}

function init_arcCircle(evt)
{
	p1 = svgdoc.getElementById("p1")
	p2 = svgdoc.getElementById("p2")
	m1 = svgdoc.getElementById("m1")
	m2 = svgdoc.getElementById("m2")
	arc = svgdoc.getElementById("arc")	
	atx1 = svgdoc.getElementById("atx1")	
	atx2 = svgdoc.getElementById("atx2")	
	x1 = 500
	y1 = 250
	x2 = 350
	y2 = 100
	ag1 = 0
	ag2 = 90
}

function arcCircle_move(evt)
{
	if (click)
		{
		xm= coordo_x(evt.clientX)
		ym= coordo_y(evt.clientY)
			cible = evt.target.getAttributeNS(null, "id")
			if ( cible == "p1")
			{
				x1 = xm
				y1 = ym
			}
			if ( cible == "p2")
			{
				x2 = xm
				y2 = ym
			}
			arcCircle_calcul()
		}
}


function arcCircle_calcul()
{
	if ( x1 != 350)
		ag1 = Math.atan((y1 - 250) / (x1 - 350)) * 180 / Math.PI
	else
		{
		ag1 = - 90
		if ( y1 > 250 ) ag1 = 90
		}
	if ( x1 < 350 )
		ag1 += 180	
	if ( x2 != 350)
		ag2 = Math.atan((y2 - 250) / (x2 - 350)) * 180 / Math.PI
	else
		{
		ag2 = - 90
		if ( y2 > 250 ) ag2 = 90
		}
	if ( x2 < 350 )
		ag2 += 180	
	if ( ag2 < ag1 )
		ag2 += 360

	x1 = 350 + 150 * Math.cos ( ag1 * Math.PI / 180 )
	y1 = 250 + 150 * Math.sin ( ag1 * Math.PI / 180 )
	x2 = 350 + 150 * Math.cos ( ag2 * Math.PI / 180 )
	y2 = 250 + 150 * Math.sin ( ag2 * Math.PI / 180 )

	p1.setAttributeNS(null,"cx",x1)
	p1.setAttributeNS(null,"cy",y1)
	p2.setAttributeNS(null,"cx",x2)
	p2.setAttributeNS(null,"cy",y2)

	m1.setAttributeNS(null,"x",x1)
	m1.setAttributeNS(null,"y",y1)
	m2.setAttributeNS(null,"x",x2)
	m2.setAttributeNS(null,"y",y2)


	str = "M 350 250 L" + x1 + " " + y1 + "A150 150 0 "
	if (Math.abs( ag1 - ag2) < 180)
		str += " 1 "
	else
		str += " 0 "
	str += " 0 " + x2 + " " + y2 + "z"

	arc.setAttributeNS(null, "d" , str )
	atx1.firstChild.data = parseInt(- 100 *ag1) / 100
	atx2.firstChild.data = parseInt( 100 * (360 - ag2)) / 100
		
}


function init_ellipse(evt)
{
	p1 = svgdoc.getElementById("p1")
	curs = svgdoc.getElementById("cursor")	
	axis = svgdoc.getElementById("axis")	
	ellipse = svgdoc.getElementById("ellipse")	
	x1 = 600
	y1 = 250
	k = 0.5
}

function ellipse_move(evt)
{
	if (click)
		{
			y1 = coordo_y(evt.clientY)
			ellipse_calcul()
		}
}

function ellipse_cursor(evt)
{
	if (click)
		{
			xc= coordo_x(evt.clientX)
			if (xc < 100) xc = 100
			if (xc > 500) xc = 500
			k = (xc - 100) / 200
			curs.setAttributeNS(null,"x",xc - 5)
			ellipse_calcul()
		}
}
function ellipse_calcul()
{
	p1.setAttributeNS(null,"cy",y1)
	ry = 125 * k
	ellipse.setAttributeNS(null,"ry",ry)
	angle = Math.atan((y1 - 250) / (x1 - 350)) * 180 / Math.PI	
	str = "translate(350,250) rotate(" + angle + ")"
	ellipse.setAttributeNS(null,"transform",str)
	axis.setAttributeNS(null,"y2",y1)
	axis.setAttributeNS(null,"y1",500 - y1)
		
}

function init_circle(evt)
{
	x1 = 423
	y1 = 164
	x2 = 600
	y2 = 300	
	x3 = 400
	y3 = 300
	x4 = 50
	y4 = 150
	x5 = 250
	y5 = 150
	x6 = 150
	y6 = 400
	x7 = 250
	y7 = 400
	x8 = 150
	y8 = 150	
	x10 = 150
	y10 = 150	
	a = svgdoc.getElementById("a")
	b = svgdoc.getElementById("b")
	c = svgdoc.getElementById("c")
	d = svgdoc.getElementById("d")
	e = svgdoc.getElementById("e")
	f = svgdoc.getElementById("f")
	g = svgdoc.getElementById("g")
	w1 = svgdoc.getElementById("w1")
	w2 = svgdoc.getElementById("w2")
	w3 = svgdoc.getElementById("w3")
	p1 = svgdoc.getElementById("p1")
	p2 = svgdoc.getElementById("p2")
	p3 = svgdoc.getElementById("p3")
	p4 = svgdoc.getElementById("p4")
	p5 = svgdoc.getElementById("p5")
	p6 = svgdoc.getElementById("p6")
	p7 = svgdoc.getElementById("p7")
	p8 = svgdoc.getElementById("p8")
	p9 = svgdoc.getElementById("p9")
	p10 = svgdoc.getElementById("p10")
	circ1 = svgdoc.getElementById("circ1")
	circ2 = svgdoc.getElementById("circ2")
	circ3 = svgdoc.getElementById("circ3")
	circle_calcul(3)
}

function circle_move(evt)
{
	if (click)
		{
		xm= coordo_x(evt.clientX)
		ym= coordo_y(evt.clientY)
			cible = evt.target.getAttributeNS(null,"id")
			if (cible == "p1")
				{ 
				x1 = xm
				y1 = ym
				num = 3
				}
			if (cible == "p2")
				{ 
				x2 = xm
				y2 = ym
				num = 3
				}
			if (cible == "p3")
				{ 
				x3 = xm
				y3 = ym
				num = 3
				}
			if (cible == "p4")
				{ 
				x4 = xm
				y4 = ym
				num = 1
				}
			if (cible == "p5")
				{ 
				x5 = xm
				y5 = ym
				num = 1
				}
			if (cible == "p6")
				{ 
				x6 = xm
				y6 = ym
				num = 2
				}
			if (cible == "p7")
				{ 
				x7 = xm
				y7 = ym
				num = 2
				}
			circle_calcul(num)
		}
}


function circle_calcul(num)
{
if (num == 1)
	{
	p4.setAttributeNS(null,"cx",x4)
	p4.setAttributeNS(null,"cy",y4)
	p5.setAttributeNS(null,"cx",x5)
	p5.setAttributeNS(null,"cy",y5)
	d.setAttributeNS(null,"x",x4)
	d.setAttributeNS(null,"y",y4)
	e.setAttributeNS(null,"x",x5)
	e.setAttributeNS(null,"y",y5)
	x8 = ( x4 + x5 ) / 2
	y8 = ( y4 + y5 ) / 2
	r = Math.sqrt ((x4 - x5) * (x4 - x5) + (y4 - y5) * (y4 - y5)) / 2
	circ1.setAttributeNS(null,"cx",x8)
	circ1.setAttributeNS(null,"cy",y8)
	circ1.setAttributeNS(null,"r",r)		
	w1.setAttributeNS(null,"x",x8)
	w1.setAttributeNS(null,"y",y8)
	p8.setAttributeNS(null,"cx",x8)
	p8.setAttributeNS(null,"cy",y8)
	}
if (num == 2)
	{
	p6.setAttributeNS(null,"cx",x6)
	p6.setAttributeNS(null,"cy",y6)
	p7.setAttributeNS(null,"cx",x7)
	p7.setAttributeNS(null,"cy",y7)
	f.setAttributeNS(null,"x",x6)
	f.setAttributeNS(null,"y",y6)
	g.setAttributeNS(null,"x",x7)
	g.setAttributeNS(null,"y",y7)
	r = Math.sqrt ((x6 - x7) * (x6 - x7) + (y6 - y7) * (y6 - y7)) 
	circ2.setAttributeNS(null,"cx",x6)
	circ2.setAttributeNS(null,"cy",y6)
	circ2.setAttributeNS(null,"r",r)		
	}
if (num == 3)
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
	ua = x2 - x1
	va = y2 - y1
	wa = (x2 * x2 + y2 * y2 - x1 * x1 - y1 * y1) / 2	
	ub = x3 - x1
	vb = y3 - y1
	wb = (x3 * x3 + y3 * y3 - x1 * x1 - y1 * y1) / 2	
	det = ua * vb - ub * va
	if (det != 0 )
		{
		x10 = ( wa * vb - wb * va ) / det
		y10 = ( ua * wb - ub * wa ) / det
		w3.setAttributeNS(null,"x",x10)
		w3.setAttributeNS(null,"y",y10)
		p10.setAttributeNS(null,"cx",x10)
		p10.setAttributeNS(null,"cy",y10)
		r = Math.sqrt ( (x1 - x10) * (x1 - x10) + (y1 - y10) * (y1 - y10))
		circ3.setAttributeNS(null,"cx",x10)
		circ3.setAttributeNS(null,"cy",y10)
		circ3.setAttributeNS(null,"r",r)
		}
	}
}


function quadratic_change(evt,voir)
{if (voir==0) {attrib="visible"} else {attrib="hidden"};
traits.setAttribute("visibility",attrib);
choix.setAttribute("cy",35+20*voir);}

function quadratic_move(evt)
{if (click)
{
xm= coordo_x(evt.clientX)
ym= coordo_y(evt.clientY)
cible = evt.target.getAttributeNS(null,"id")
if (cible!="B1") 
{evt.target.setAttribute("cx",xm)
evt.target.setAttribute("cy",ym)};
switch(cible)
{case "A1":
xA1=xm;yA1=ym;
xB1=parseInt(k*xA1+(1-k)*xA2);yB1=parseInt(k*yA1+(1-k)*yA2);
B1.setAttribute("cx",xB1);B1.setAttribute("cy",yB1);
break;
case "A2":
xA2=xm;yA2=ym;
xB1=parseInt(k*xA1+(1-k)*xA2);yB1=parseInt(k*yA1+(1-k)*yA2);
B1.setAttribute("cx",xB1);B1.setAttribute("cy",yB1);
break;
case "C1":
xC1=xm;yC1=ym;break;
case "B1":
xB1=xm;yB1=ym;
u=xA1-xA2;v=yA1-yA2;w=u*xB1+v*yB1;det=u*u+v*v;
if (det!=0)
{yp=parseInt((-u*v*xA1+u*u*yA1+u*v*xB1+v*v*yB1)/det);
xp=parseInt((v*v*xA1-u*v*yA1+u*u*xB1+u*v*yB1)/det);
xB1=xp;yB1=yp;AB=Math.sqrt(det);
GB=Math.sqrt((xB1-xA2)*(xB1-xA2)+(yB1-yA2)*(yB1-yA2));
k=GB/AB;
if (k>1) {k=1;xB1=xA1;yB1=yA1};
if ((xB1-xA2)*(xA2-xA1)+(yB1-yA2)*(yA2-yA1)>0)
{k=0;xB1=xA2;yB1=yA2};
B1.setAttribute("cx",xB1);B1.setAttribute("cy",yB1)};
break;}
quadratic_calcul();
}
}

function quadratic_calcul()
{trace="M"+xA1+" "+yA1+"Q"+xC1+","+yC1+" "+xA2+","+yA2;
courbe.setAttribute("d",trace);
code_q.firstChild.data = trace
coeff1=Math.round(k*100)/100;coeff2=Math.round((1-k)*100)/100;
code.firstChild.data = coeff1.toString()+" and "+coeff2.toString()
trace="M"+xA1+" "+yA1+" L"+xC1+" "+yC1+" L"+xA2+" "+yA2;
tang.setAttribute("d",trace);
xD1=parseInt(k*xA1+(1-k)*xC1);yD1=parseInt(k*yA1+(1-k)*yC1);
D1.setAttribute("cx",xD1);D1.setAttribute("cy",yD1);
xD2=parseInt(k*xC1+(1-k)*xA2);yD2=parseInt(k*yC1+(1-k)*yA2);
D2.setAttribute("cx",xD2);D2.setAttribute("cy",yD2);
xD3=parseInt(k*xD1+(1-k)*xD2);yD3=parseInt(k*yD1+(1-k)*yD2);
D3.setAttribute("cx",xD3);D3.setAttribute("cy",yD3);
trace="M"+xD1+" "+yD1+" L"+xD2+" "+yD2;
tang2.setAttribute("d",trace);
trace="M"+xA1+" "+yA1+" L"+xA2+" "+yA2;
tang4.setAttribute("d",trace);
}


function init_quadratic(evt)
{
	click=false
	xA1=100
	yA1=300
	xC1=200
	yC1=100
	xA2=500
	yA2=300
	k=0.5
	xD1=150
	yD1=200
	xD2=300
	yD2=100
	xD3=450
	yD3=200
	xB1=300
	yB1=300
     	A1 = svgdoc.getElementById("A1");
	C1 = svgdoc.getElementById("C1");
	A2 = svgdoc.getElementById("A2");
	B1 = svgdoc.getElementById("B1");
	D1 = svgdoc.getElementById("D1");
	D2 = svgdoc.getElementById("D2");
	D3 = svgdoc.getElementById("D3");
	courbe = svgdoc.getElementById("courbe");
	code_q = svgdoc.getElementById("code_q");
	tang = svgdoc.getElementById("tang");
	tang2 = svgdoc.getElementById("tang2");
 	tang4 = svgdoc.getElementById("tang4");
 	code=svgdoc.getElementById("code");
        choix=svgdoc.getElementById("choix");
        traits=svgdoc.getElementById("traits");
}

function cubic_change(evt,voir)
{if (voir==0) {attrib="visible"} else {attrib="hidden"};
traits.setAttribute("visibility",attrib);
choix.setAttribute("cy",35+20*voir);}

function cubic_move(evt)
{if (click)
{
xm=coordo_x(evt.clientX)
ym=coordo_y(evt.clientY)
cible = evt.target.getAttributeNS(null,"id")
if (cible!="B1") 
{evt.target.setAttribute("cx",xm);evt.target.setAttribute("cy",ym)};
switch(cible)
{case "A1":
xA1=xm;yA1=ym;
xB1=parseInt(k*xA1+(1-k)*xA2);yB1=parseInt(k*yA1+(1-k)*yA2);
B1.setAttribute("cx",xB1);B1.setAttribute("cy",yB1);
break;
case "A2":
xA2=xm;yA2=ym;
xB1=parseInt(k*xA1+(1-k)*xA2);yB1=parseInt(k*yA1+(1-k)*yA2);
B1.setAttribute("cx",xB1);B1.setAttribute("cy",yB1);
break;
case "C1":
xC1=xm;yC1=ym;break;
case "C2":
xC2=xm;yC2=ym;break;
case "B1":
xB1=xm;yB1=ym;
u=xA1-xA2;v=yA1-yA2;w=u*xB1+v*yB1;det=u*u+v*v;
if (det!=0)
{yp=parseInt((-u*v*xA1+u*u*yA1+u*v*xB1+v*v*yB1)/det);
xp=parseInt((v*v*xA1-u*v*yA1+u*u*xB1+u*v*yB1)/det);
xB1=xp;yB1=yp;AB=Math.sqrt(det);
GB=Math.sqrt((xB1-xA2)*(xB1-xA2)+(yB1-yA2)*(yB1-yA2));
k=GB/AB;
if (k>1) {k=1;xB1=xA1;yB1=yA1};
if ((xB1-xA2)*(xA2-xA1)+(yB1-yA2)*(yA2-yA1)>0)
{k=0;xB1=xA2;yB1=yA2};
B1.setAttribute("cx",xB1);B1.setAttribute("cy",yB1)};
break;}
cubic_calcul();
}}

function cubic_calcul()
{trace="M"+xA1+" "+yA1+"C"+xC1+","+yC1+" "+xC2+","+yC2+" "+xA2+","+yA2;
courbe.setAttribute("d",trace);
code_c.firstChild.data = trace
coeff1=Math.round(k*100)/100;coeff2=Math.round((1-k)*100)/100;
code.firstChild.data = coeff1.toString() + " and " + coeff2.toString()
trace="M"+xA1+" "+yA1+" L"+xC1+" "+yC1+" L"+xC2+" "+yC2+" L"+xA2+" "+yA2;
tang.setAttribute("d",trace);
xD1=parseInt(k*xA1+(1-k)*xC1);yD1=parseInt(k*yA1+(1-k)*yC1);
D1.setAttribute("cx",xD1);D1.setAttribute("cy",yD1);
xD2=parseInt(k*xC1+(1-k)*xC2);yD2=parseInt(k*yC1+(1-k)*yC2);
D2.setAttribute("cx",xD2);D2.setAttribute("cy",yD2);
xD3=parseInt(k*xC2+(1-k)*xA2);yD3=parseInt(k*yC2+(1-k)*yA2);
D3.setAttribute("cx",xD3);D3.setAttribute("cy",yD3);
xD4=parseInt(k*xD1+(1-k)*xD2);yD4=parseInt(k*yD1+(1-k)*yD2);
D4.setAttribute("cx",xD4);D4.setAttribute("cy",yD4);
xD5=parseInt(k*xD2+(1-k)*xD3);yD5=parseInt(k*yD2+(1-k)*yD3);
D5.setAttribute("cx",xD5);D5.setAttribute("cy",yD5);
xD6=parseInt(k*xD4+(1-k)*xD5);yD6=parseInt(k*yD4+(1-k)*yD5);
D6.setAttribute("cx",xD6);D6.setAttribute("cy",yD6);
trace="M"+xD1+" "+yD1+" L"+xD2+" "+yD2+" L"+xD3+" "+yD3;
tang2.setAttribute("d",trace);
trace="M"+xD4+" "+yD4+" L"+xD5+" "+yD5;
tang3.setAttribute("d",trace);
trace="M"+xA1+" "+yA1+" L"+xA2+" "+yA2;
tang4.setAttribute("d",trace);}

function init_cubic(evt)
{ 	
	xA1=100
	yA1=300
	xC1=200	
	yC1=100
	xC2=400
	yC2=400
	xA2=600
	yA2=300
	xB1=300
	yB1=300
	k = 0.6
      	click = false
    	A1 = svgdoc.getElementById("A1");
	C1 = svgdoc.getElementById("C1");
	A2 = svgdoc.getElementById("A2");
	C2 = svgdoc.getElementById("C2");
	B1 = svgdoc.getElementById("B1");
	D1 = svgdoc.getElementById("D1");
	D2 = svgdoc.getElementById("D2");
	D3 = svgdoc.getElementById("D3");
	D4 = svgdoc.getElementById("D4");
	D5 = svgdoc.getElementById("D5");
	D6 = svgdoc.getElementById("D6");
	courbe = svgdoc.getElementById("courbe");
	code_c = svgdoc.getElementById("code_c");
	tang = svgdoc.getElementById("tang");
	tang2 = svgdoc.getElementById("tang2");
	tang3 = svgdoc.getElementById("tang3");
	tang4 = svgdoc.getElementById("tang4");
        code=svgdoc.getElementById("code");
        choix=svgdoc.getElementById("choix");
        traits=svgdoc.getElementById("traits");
	cubic_calcul()
}
