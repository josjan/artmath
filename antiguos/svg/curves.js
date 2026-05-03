var click = false

function init_svg_ellipse(evt)
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
}

function ellipse_svg_move(evt)
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
			ellipse_svg_calcul()
		}
}

function ellipse_svg_calcul()
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
	axis.setAttributeNS(null,"x1",x2 - 500 * Math.cos(angle))
	axis.setAttributeNS(null,"y1",y2 - 500 * Math.sin(angle))
	axis.setAttributeNS(null,"x2",x2 + 500 * Math.cos(angle))
	axis.setAttributeNS(null,"y2",y2 + 500 * Math.sin(angle))
	svgdoc.getElementById("cx").firstChild.data = x2
	svgdoc.getElementById("cx2").firstChild.data = x2		
	svgdoc.getElementById("cy").firstChild.data = y2
	svgdoc.getElementById("cy2").firstChild.data = y2		
	svgdoc.getElementById("rx").firstChild.data = parseInt(Math.abs(x2 - x3))
	svgdoc.getElementById("ry").firstChild.data = parseInt(Math.abs(y2 - y3))		
	svgdoc.getElementById("ag").firstChild.data = parseInt(angle2)		
}


function svg_quadratic_move(evt)
{if (click)
{
		xm=coordo_x(evt.clientX)
		ym=coordo_y(evt.clientY)
evt.target.setAttribute("cx",xm)
evt.target.setAttribute("cy",ym)
cible = evt.target.getAttributeNS(null,"id")
if (cible=="A1") {xA1=xm;yA1=ym};
if (cible=="C1") 
{xC1=xm;yC1=ym;xC2=2*xA2-xC1;yC2=2*yA2-yC1;
C2.setAttribute("cx",xC2);C2.setAttribute("cy",yC2);};
if (cible=="A2") {xA2=xm;yA2=ym;xC2=2*xA2-xC1;yC2=2*yA2-yC1;
C2.setAttribute("cx",xC2);C2.setAttribute("cy",yC2);};
if (cible=="A3") {xA3=xm;yA3=ym};
svg_quadratic_calcul();
}}

function svg_quadratic_calcul()
{trace="M"+xA1+" "+yA1+"Q"+xC1+","+yC1+" "+xA2+","+yA2+" T"+xA3+","+yA3;
courbe.setAttribute("d",trace);
code.firstChild.setData("Code for path : "+trace);
trace="M"+xA1+" "+yA1+" L"+xC1+" "+yC1+" "+xC2+" "+yC2+" "+xA3+" "+yA3;
tang.setAttribute("d",trace);
longueur=courbe.getTotalLength();
taille.getFirstChild.setData("Length of curve : "+(Math.round(100*longueur)/100).toString());
point=courbe.getPointAtLength(longueur/2);
milieu.setAttribute('cx',point.x);milieu.setAttribute('cy',point.y);
}

function init_svg_quadratic(evt)
{ 
	click=false
	xA1=100
	yA1=300
	xC1=200
	yC1=200
	xA2=300
	yA2=300
	xC2=400
	yC2=400
	xA3=500
	yA3=300
    	A1 = svgdoc.getElementById("A1");
	C1 = svgdoc.getElementById("C1");
	A2 = svgdoc.getElementById("A2");
	A3 = svgdoc.getElementById("A3");
	C2 = svgdoc.getElementById("C2");
	courbe = svgdoc.getElementById("courbe");
	tang = svgdoc.getElementById("tang");
        taille=svgdoc.getElementById("long");
        milieu=svgdoc.getElementById("milieu");
        code=svgdoc.getElementById("code");
longueur=courbe.getTotalLength();
taille.firstChild.setData("Length of curve : "+(Math.round(100*longueur)/100).toString());
point=courbe.getPointAtLength(longueur/2)
milieu.setAttribute('cx',point.x)
milieu.setAttribute('cy',point.y)
}

function svg_cubic_move(evt)
{if (click)
	{
		xm=coordo_x(evt.clientX)
		ym=coordo_y(evt.clientY)
		evt.target.setAttribute("cx",xm)
		evt.target.setAttribute("cy",ym)
		cible = evt.target.getAttributeNS(null,"id")
		if (cible=="A1") {xA1=xm;yA1=ym};
		if (cible=="C1") {xC1=xm;yC1=ym};
		if (cible=="C2") 
			{xC2=xm;yC2=ym;xC3=2*xA2-xC2;yC3=2*yA2-yC2;
		C3.setAttribute("cx",xC3);C3.setAttribute("cy",yC3);};
		if (cible=="A2") {xA2=xm;yA2=ym;xC3=2*xA2-xC2;yC3=2*yA2-yC2;
			C3.setAttribute("cx",xC3);C3.setAttribute("cy",yC3);};
		if (cible=="C4") {xC4=xm;yC4=ym};
		if (cible=="A3") {xA3=xm;yA3=ym};
		svg_cubic_calcul();
	}
}

function svg_cubic_calcul()
{trace="M"+xA1+" "+yA1+"C"+xC1+","+yC1+" "+xC2+","+yC2+" "+xA2+","+yA2+" S"+xC4+","+yC4+" "+xA3+","+yA3;
courbe.setAttribute("d",trace);
code.firstChild.setData("Code for path : "+trace);
trace="M"+xA1+" "+yA1+" L"+xC1+" "+yC1+" M"+xC2+" "+yC2+" L"+xC3+" "+yC3+" M"+xC4+" "+yC4+" L"+xA3+" "+yA3;
tang.setAttribute("d",trace);
longueur=courbe.getTotalLength();
taille.firstChild.setData("Length of curve : "+(Math.round(100*longueur)/100).toString());
point=courbe.getPointAtLength(longueur/2);
milieu.setAttribute('cx',point.x);milieu.setAttribute('cy',point.y);
}

function init_svg_cubic(evt)
{ 
	click=false
	xA1=100
	yA1=300
	xC1=200
	yC1=100
	xC2=250
	yC2=400
	xA2=300
	yA2=300
	xC3=350
	yC3=200
	xC4=450
	yC4=400
	xA3=500
	yA3=300
    	A1 = svgdoc.getElementById("A1");
	C1 = svgdoc.getElementById("C1");
	A2 = svgdoc.getElementById("A2");
	A3 = svgdoc.getElementById("A3");
	C2 = svgdoc.getElementById("C2");
	C3 = svgdoc.getElementById("C3");
	C4 = svgdoc.getElementById("C4");
	courbe = svgdoc.getElementById("courbe");
	tang = svgdoc.getElementById("tang");
        taille=svgdoc.getElementById("long");
        milieu=svgdoc.getElementById("milieu");
        code=svgdoc.getElementById("code");
longueur=courbe.getTotalLength()
taille.firstChild.setData("Length of curve : "+(Math.round(100*longueur)/100).toString());
point=courbe.getPointAtLength(longueur/2);
milieu.setAttribute('cx',point.x)
milieu.setAttribute('cy',point.y);
}


function init_svg_circle(evt)
{
	x1 = 423
	y1 = 164
	x2 = 600
	y2 = 300	
	x3 = 400
	y3 = 300
	x4 = 600
	y4 = 175	
	a = svgdoc.getElementById("a")
	b = svgdoc.getElementById("b")
	c = svgdoc.getElementById("c")
	d = svgdoc.getElementById("d")
	p1 = svgdoc.getElementById("p1")
	p2 = svgdoc.getElementById("p2")
	p3 = svgdoc.getElementById("p3")
	p4 = svgdoc.getElementById("p4")
	circ = svgdoc.getElementById("circ")
	svg_circle_calcul()
}

function svg_circle_move(evt)
{
	if (click)
		{
		xm=coordo_x(evt.clientX)
		ym=coordo_y(evt.clientY)
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
			svg_circle_calcul()
		}
}


function svg_circle_calcul()
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
	}
}

function arcCircle_svg_move(evt)
{if (click)
{cible=evt.target.getAttributeNS(null,"id")
xm=coordo_x(evt.clientX)
ym=coordo_y(evt.clientY) + 50

if (cible=="A1") {xA1=xm;yA1=ym;evt.target.setAttribute("cx",xm);evt.target.setAttribute("cy",ym)};
if (cible=="A2") {xA2=xm;yA2=ym;evt.target.setAttribute("cx",xm);evt.target.setAttribute("cy",ym)};
if (cible=="C2") {yC2=ym;ry=580-ym;evt.target.setAttribute("cy",ym);ryy.setAttribute("y2",ym);rx = ry}
arc_svg_calcul()
}
}


function init_svg_arcCircle(evt)
{
	xA1=200
	yA1=300
	xA2=300
	yA2=200
	rx = 80
	ry = 80
	angle = 0
	large = 0
	sweep = 0
	choosed=0
    	A1 = svgdoc.getElementById("A1");
	A2 = svgdoc.getElementById("A2");
	D1 = svgdoc.getElementById("D1");
	D2 = svgdoc.getElementById("D2");
	arc0 = svgdoc.getElementById("arc0");
	arc1 = svgdoc.getElementById("arc1");
 	arc2 = svgdoc.getElementById("arc2");
 	arc3 = svgdoc.getElementById("arc3");
        code = svgdoc.getElementById("code");
        ryy = svgdoc.getElementById("ryy");
        sf = svgdoc.getElementById("sf");
        lf = svgdoc.getElementById("lf");
	arc_svg_calcul()
}


function arc_svg_move(evt)
{if (click)
{cible=evt.target.getAttributeNS(null,"id")
xm=coordo_x(evt.clientX)
ym=coordo_y(evt.clientY) + 50

if (cible=="A1") {xA1=xm;yA1=ym;evt.target.setAttribute("cx",xm);evt.target.setAttribute("cy",ym)};
if (cible=="A2") {xA2=xm;yA2=ym;evt.target.setAttribute("cx",xm);evt.target.setAttribute("cy",ym)};
if (cible=="C1") {xC1=xm;rx=xm-20;evt.target.setAttribute("cx",xm);rxx.setAttribute("x2",xm);}
if (cible=="C2") {yC2=ym;ry=580-ym;evt.target.setAttribute("cy",ym);ryy.setAttribute("y2",ym);}
if (cible=="C3") 
{
	radius=Math.sqrt((xm-535)*(xm-535)+(ym-465)*(ym-465))
	angle_radian=Math.acos((xm-535)/radius)
	if (ym<465) angle_radian*=-1
	evt.target.setAttribute("cx",535+50*Math.cos(angle_radian))	
	evt.target.setAttribute("cy",465+50*Math.sin(angle_radian))
	angle = parseInt(angle_radian*180/Math.PI)	
}
arc_svg_calcul()
}
}


function arc_svg_choix(evt)
{cible=evt.target.getAttribute("id");
param=cible.substring(0,2);value=parseInt(cible.substring(2,3));
if (param=="lf")
{large=value;lf.setAttribute("cx",520+30*value)}
if (param=="sf")
{sweep=value;sf.setAttribute("cx",520+30*value)}
choosed=2*large+sweep
arc_svg_calcul();
}

function arc_svg_calcul()
{trace_begin="M"+xA1+" "+yA1+"A"+rx+" "+ry+" "+angle+" "
trace_end=" "+xA2+","+yA2;
for (i=0;i<4;i++)
eval("arc"+i.toString()+".setAttribute('stroke','blue')");
eval("arc"+choosed.toString()+".setAttribute('stroke','red')");
arc0.setAttribute("d",trace_begin+"0 0"+trace_end);
arc1.setAttribute("d",trace_begin+"0 1"+trace_end);
arc2.setAttribute("d",trace_begin+"1 0"+trace_end);
arc3.setAttribute("d",trace_begin+"1 1"+trace_end);
code.firstChild.setData("Code for path : "+trace_begin+large+" "+sweep+trace_end);
node = svgdoc.getElementById("axis")
if (node != null)
   node.firstChild.setData(angle.toString()+" degrees")
arc_svg_center()}

function arc_svg_center()
{var a=angle*Math.PI/180
 var cos = Math.cos(a)       
 var sin = Math.sin(a)       
 var x1 = cos*(xA1-xA2)/2 + sin*(yA1-yA2)/2
 var y1 = -sin*(xA1-xA2)/2 + cos*(yA1-yA2)/2
 var k2 = (rx*rx*ry*ry-rx*rx*y1*y1-ry*ry*x1*x1)/(rx*rx*y1*y1+ry*ry*x1*x1)
 var k = 0
 if (k2>0) k= Math.sqrt(k2)
 var dx = cos*k*rx*y1/ry + sin*k*ry*x1/rx
 var dy = sin*k*rx*y1/ry - cos*k*ry*x1/rx
 var cx1 = dx + (xA1+xA2)/2
 var cy1 = dy + (yA1+yA2)/2
 var cx2 = -dx + (xA1+xA2)/2
 var cy2 = -dy + (yA1+yA2)/2
 D1.setAttribute("cx",cx1); D1.setAttribute("cy",cy1);
 D2.setAttribute("cx",cx2); D2.setAttribute("cy",cy2);
} 


function init_svg_arcEllipse(evt)
{
	xA1=200
	yA1=300
	xA2=300
	yA2=200
	xC1=120
	yC1=580
	xC2=20
	yC2=500
	xC3=585
	yC3=465
	rx = 100
	ry = 80
	angle = 0
	large = 0
	sweep = 0
	choosed=0
    	A1 = svgdoc.getElementById("A1");
	A2 = svgdoc.getElementById("A2");
	C1 = svgdoc.getElementById("C1");
	C2 = svgdoc.getElementById("C2");
	C3 = svgdoc.getElementById("C3");
    	D1 = svgdoc.getElementById("D1");
	D2 = svgdoc.getElementById("D2");
	arc0 = svgdoc.getElementById("arc0");
	arc1 = svgdoc.getElementById("arc1");
 	arc2 = svgdoc.getElementById("arc2");
 	arc3 = svgdoc.getElementById("arc3");
        code = svgdoc.getElementById("code");
        rxx = svgdoc.getElementById("rxx");
        ryy = svgdoc.getElementById("ryy");
        sf = svgdoc.getElementById("sf");
        lf = svgdoc.getElementById("lf");
        axis = svgdoc.getElementById("axis");
}
