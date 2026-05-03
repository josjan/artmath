var appui=false, click = false
var cible="";
var xC1=250,yC1=250,xD1=150,yD1=320,xE1=50,yE1=290,xF1=200,yF1=100;
var ag="",agt="",cursor=""
var x1=100,y1=130,x2=120,y2=280,x3=250,y3=250,x4=230,y4=100
var a_m=0.65,b_m=-0.15,c_m=0.1,d_m=0.75,e_m=30,f_m=40

function init_any(evt)
{
	x1=100
	y1=130
	x2=120
	y2=280
	x3=250
	y3=250
	x4=230
	y4=100
	a_m=0.65
	b_m=-0.15
	c_m=0.1
	d_m=0.75
	e_m=30
	f_m=40
}

function any_move(evt)
{
	if (click)
	{
		xm = coordo_x(evt.clientX)
		ym = coordo_y(evt.clientY)
		if (xm < 20) xm = 20
		if (ym < 40) ym = 40
		if (xm > 320) xm = 320
		if (ym > 340) ym = 340
		evt.target.setAttributeNS(null,"cx",xm)
		evt.target.setAttributeNS(null,"cy",ym)
		if (evt.target.getAttributeNS(null, "id") == "P1")
			{
				x1 = xm
				y1 = ym
			}
		if (evt.target.getAttributeNS(null, "id") == "P2")
			{
				x2 = xm
				y2 = ym
			}
		if (evt.target.getAttributeNS(null, "id") == "P3")
			{
				x3 = xm
				y3 = ym
			}
		x4 = x1 + x3 - x2
		y4 = y1 + y3 - y2
		svgdoc.getElementById("P4").setAttributeNS(null,"cx",x4)
		svgdoc.getElementById("P4").setAttributeNS(null,"cy",y4)
		str = "M" + x1.toString() + " " + y1.toString()
		str += "L" + x2.toString() + " " + y2.toString()
		str += "L" + x3.toString() + " " + y3.toString()
		str += "L" + x4.toString() + " " + y4.toString() +"z"
		svgdoc.getElementById("def").setAttributeNS(null,"d",str)
		get_matrix(evt)	
	}
}

function get_matrix(evt)
{
	a_m = (x3 - x2) / 200
	b_m = (y3 - y2) / 200
	c_m = (x2 - x1) / 200
	d_m = (y2 - y1) / 200
	e_m = x1 - 70
	f_m = y1 - 90
	str = "matrix(" + a_m.toString() + " " + b_m.toString() + " " + c_m.toString() + " " + d_m.toString() + " "
	str += (e_m + 400).toString() + " " + (f_m + 150).toString() + ")"
	if (a_m * d_m - b_m * c_m !=0 )
		svgdoc.getElementById("image").setAttributeNS(null,"transform",str)	
	svgdoc.getElementById("matrix_a").firstChild.data = a_m.toString()
	svgdoc.getElementById("matrix_b").firstChild.data = b_m.toString()
	svgdoc.getElementById("matrix_c").firstChild.data = c_m.toString()
	svgdoc.getElementById("matrix_d").firstChild.data = d_m.toString()
	svgdoc.getElementById("matrix_e").firstChild.data = e_m.toString()
	svgdoc.getElementById("matrix_f").firstChild.data = f_m.toString()
}

function sim_cliquer(evt)
{cible=evt.target.getAttribute("id");
if ((cible=="A")||(cible=="H")||(cible=="B")||(cible=="C")||(cible=="D")||(cible=="E")||(cible=="F"))
{appui=true;}}

function sim_bouger(evt)
{if (appui==true)
{obj=svgdoc.getElementById(cible);
xm=coordo_x(evt.clientX);ym=coordo_y(evt.clientY);
if (cible=="A") {xA=xm;yA=ym};if (cible=="C") {xC=xm;yC=ym};
if (cible=="D") {xD=xm;yD=ym};if (cible=="E") {xE=xm;yE=ym};
if (cible=="F") {xF=xm;yF=ym};
if (cible=="H") {if ((xm<373)&&(xm>79)) {xH=xm;rapp=(xH-225)/75;
rapp_val.firstChild.setData(Math.round(100*rapp)/100)}};
if (cible=="B") {dist=Math.sqrt((xm-30)*(xm-30)+(ym-30)*(ym-30));k=Math.acos((xm-30)/dist);
if (ym>30){k=-k};if (k>Math.PI) {k=k-Math.PI};if (k<-Math.PI) {k=k+Math.PI}; 
angle_val.firstChild.setData(Math.round(-k*180/Math.PI));
xB=Math.round(30+24*Math.cos(k));yB=Math.round(30-24*Math.sin(k));
xm=xB;ym=yB;}
if (cible!="H") {obj.setAttribute("cx",xm);obj.setAttribute("cy",ym)} 
else {obj.setAttribute("x",xH)};
sim_calcul();
}}

function sim_calcul()
{trace="M "+xC+" "+yC+" "+xD+" "+yD+" "+xE+" "+yE+" "+xF+" "+yF+" z";
objet.setAttribute("d",trace);a=rapp*Math.cos(k);b=rapp*Math.sin(k);
m_a=a
m_c=b
m_e=(1-a)*xA-b*yA
m_b=-b
m_d=a
m_f=(1-a)*yA+b*xA
xC1=Math.round(a*xC+b*yC+(1-a)*xA-b*yA);yC1=Math.round(-b*xC+a*yC+(1-a)*yA+b*xA);
xD1=Math.round(a*xD+b*yD+(1-a)*xA-b*yA);yD1=Math.round(-b*xD+a*yD+(1-a)*yA+b*xA);
xE1=Math.round(a*xE+b*yE+(1-a)*xA-b*yA);yE1=Math.round(-b*xE+a*yE+(1-a)*yA+b*xA);
xF1=Math.round(a*xF+b*yF+(1-a)*xA-b*yA);yF1=Math.round(-b*xF+a*yF+(1-a)*yA+b*xA);
C1.setAttribute("cx",xC1);C1.setAttribute("cy",yC1);
D1.setAttribute("cx",xD1);D1.setAttribute("cy",yD1);
E1.setAttribute("cx",xE1);E1.setAttribute("cy",yE1);
F1.setAttribute("cx",xF1);F1.setAttribute("cy",yF1);
trace="M "+xC1+" "+yC1+" "+xD1+" "+yD1+" "+xE1+" "+yE1+" "+xF1+" "+yF1+" z";
image.setAttribute("d",trace);
if (k>0) {trace="M 54 30 A 24 24 0 0 0 "+xB+" "+yB+" L 30 30 z"};
if (k<0) {trace="M 54 30 A 24 24 0 0 1 "+xB+" "+yB+" L 30 30 z"};
if (k==0) {trace="M 54 30 30 30"};
angle.setAttribute("d",trace);
matrix_a.firstChild.setData(Math.round(100*m_a)/100)
matrix_b.firstChild.setData(Math.round(100*m_b)/100)
matrix_c.firstChild.setData(Math.round(100*m_c)/100)
matrix_d.firstChild.setData(Math.round(100*m_d)/100)
matrix_e.firstChild.setData(Math.round(100*m_e)/100)
matrix_f.firstChild.setData(Math.round(100*m_f)/100)
}

function init_similarity(evt)
{ 
	appui=false
	xA=300
	yA=300
	xC=350
	yC=250
	xD=450
	yD=320
	xE=550
	yE=290
	xF=400
	yF=100
	xB=6
	yB=30
	xH=300
	k=Math.PI
	rapp=1
    	A = svgdoc.getElementById("A");
   	B = svgdoc.getElementById("B");
	C = svgdoc.getElementById("C");
	D = svgdoc.getElementById("D");
	E = svgdoc.getElementById("E");
	F = svgdoc.getElementById("F");
	objet = svgdoc.getElementById("objet");
	angle = svgdoc.getElementById("angle");
	C1 = svgdoc.getElementById("C1");
	D1 = svgdoc.getElementById("D1");
	E1 = svgdoc.getElementById("E1");
	F1 = svgdoc.getElementById("F1");
	image = svgdoc.getElementById("image");
	rapp_val = svgdoc.getElementById("rapp_val");
	angle_val = svgdoc.getElementById("angle_val");
	matrix_a = svgdoc.getElementById("matrix_a");
 	matrix_b = svgdoc.getElementById("matrix_b");
 	matrix_c = svgdoc.getElementById("matrix_c");
 	matrix_d = svgdoc.getElementById("matrix_d");
 	matrix_e = svgdoc.getElementById("matrix_e");
 	matrix_f = svgdoc.getElementById("matrix_f");
	sim_calcul()
}

function aff_cliquer(evt)
{cible=evt.target.getAttribute("id");
if ((cible=="A")||(cible=="B")||(cible=="C")||(cible=="D")||(cible=="E")||(cible=="F")||(cible=="H")||(cible=="K")||(cible=="R"))
{appui=true;}}

function aff_bouger(evt)
{if (appui==true)
{obj=svgdoc.getElementById(cible);
xm=coordo_x(evt.clientX);ym=coordo_y(evt.clientY);
if (cible!="R") {obj.setAttribute("cx",xm);obj.setAttribute("cy",ym)};
if (cible=="A") {xA=xm;yA=ym};if (cible=="B") {xB=xm;yB=ym};
if (cible=="H") {xH=xm;yH=ym};if (cible=="K") {xK=xm;yK=ym};
if (cible=="C") {xC=xm;yC=ym};
if (cible=="D") {xD=xm;yD=ym};if (cible=="E") {xE=xm;yE=ym};
if (cible=="F") {xF=xm;yF=ym};
if (cible=="R") {if ((ym<203)&&(ym>9)) {yR=ym;obj.setAttribute("y",ym);k=(106-yR)/50}};
aff_calcul();
}}

function aff_calcul()
{trace="M "+xC+" "+yC+" "+xD+" "+yD+" "+xE+" "+yE+" "+xF+" "+yF+" z";
objet.setAttribute("d",trace);
trace="M "+xA+" "+yA+" "+xB+" "+yB;axe.setAttribute("d",trace);
trace="M "+xH+" "+yH+" "+xK+" "+yK;direc.setAttribute("d",trace);
u=yB-yA;v=xA-xB;w=xA*yB-xB*yA;ud=xH-xK;vd=yH-yK;
det=-v*vd-u*ud;
m_a=(-v*vd-k*u*ud)/det
m_c=(1-k)*ud*v/det
m_e=(k-1)*ud*w/det
m_b=(1-k)*u*vd/det
m_d=(-k*vd*v-ud*u)/det
m_f=(k-1)*vd*w/det
xC1=Math.round(m_a*xC+m_c*yC+m_e);
yC1=Math.round(m_b*xC+m_d*yC+m_f);
xD1=Math.round(m_a*xD+m_c*yD+m_e);
yD1=Math.round(m_b*xD+m_d*yD+m_f);
xE1=Math.round(m_a*xE+m_c*yE+m_e);
yE1=Math.round(m_b*xE+m_d*yE+m_f);
xF1=Math.round(m_a*xF+m_c*yF+m_e);
yF1=Math.round(m_b*xF+m_d*yF+m_f);
C1.setAttribute("cx",xC1);C1.setAttribute("cy",yC1);
D1.setAttribute("cx",xD1);D1.setAttribute("cy",yD1);
E1.setAttribute("cx",xE1);E1.setAttribute("cy",yE1);
F1.setAttribute("cx",xF1);F1.setAttribute("cy",yF1);
trace="M "+xC1+" "+yC1+" "+xD1+" "+yD1+" "+xE1+" "+yE1+" "+xF1+" "+yF1+" z";
image.setAttribute("d",trace);
matrix_a.firstChild.setData(Math.round(100*m_a)/100)
matrix_b.firstChild.setData(Math.round(100*m_b)/100)
matrix_c.firstChild.setData(Math.round(100*m_c)/100)
matrix_d.firstChild.setData(Math.round(100*m_d)/100)
matrix_e.firstChild.setData(Math.round(100*m_e)/100)
matrix_f.firstChild.setData(Math.round(100*m_f)/100)
}


function init_affinity(evt)
{ 
	appui=false
	xC=150
	yC=250
	xD=350
	yD=280
	xE=450
	yE=150
	xF=200
	yF=200
	xB=590
	yB=300
	xA=10
	yA=300
	xB=590
	yB=300
	xH=50
	yH=10
	xK=50
	yK=590
	xR=11
	yR=156
	k=-1
    	A = svgdoc.getElementById("A");
   	B = svgdoc.getElementById("B");
    	H = svgdoc.getElementById("H");
   	K = svgdoc.getElementById("K");
   	R = svgdoc.getElementById("R");
	C = svgdoc.getElementById("C");
	D = svgdoc.getElementById("D");
	E = svgdoc.getElementById("E");
	F = svgdoc.getElementById("F");
	axe = svgdoc.getElementById("axe");
	direc = svgdoc.getElementById("direc");
	objet = svgdoc.getElementById("objet");
	C1 = svgdoc.getElementById("C1");
	D1 = svgdoc.getElementById("D1");
	E1 = svgdoc.getElementById("E1");
	F1 = svgdoc.getElementById("F1");
	image = svgdoc.getElementById("image");
	matrix_a = svgdoc.getElementById("matrix_a");
 	matrix_b = svgdoc.getElementById("matrix_b");
 	matrix_c = svgdoc.getElementById("matrix_c");
 	matrix_d = svgdoc.getElementById("matrix_d");
 	matrix_e = svgdoc.getElementById("matrix_e");
 	matrix_f = svgdoc.getElementById("matrix_f");
	aff_calcul()
}

function ref_cliquer(evt)
{cible=evt.target.getAttribute("id");
if ((cible=="A")||(cible=="B")||(cible=="C")||(cible=="D")||(cible=="E")||(cible=="F"))
{appui=true;}}

function ref_bouger(evt)
{if (appui==true)
{obj=svgdoc.getElementById(cible);
xm=coordo_x(evt.clientX);ym=coordo_y(evt.clientY);
obj.setAttribute("cx",xm);obj.setAttribute("cy",ym);
if (cible=="A") {xA=xm;yA=ym};if (cible=="B") {xB=xm;yB=ym};if (cible=="C") {xC=xm;yC=ym};
if (cible=="D") {xD=xm;yD=ym};if (cible=="E") {xE=xm;yE=ym};if (cible=="F") {xF=xm;yF=ym};
ref_calcul();
}}

function ref_calcul()
{trace="M "+xC+" "+yC+" "+xD+" "+yD+" "+xE+" "+yE+" "+xF+" "+yF+" z";
objet.setAttribute("d",trace);
u=xB-xA;v=yB-yA;w=xA*yB-xB*yA;det=u*u+v*v;
ca=(u*u-v*v)/det;cb=2*u*v/det;cc=2*v*w/det;cd=cb;ce=-ca;cf=-2*u*w/det;
m_a=ca
m_c=cb
m_e=cc
m_b=cd
m_d=ce
m_f=cf
xC1=Math.round(ca*xC+cb*yC+cc);yC1=Math.round(cd*xC+ce*yC+cf);
xD1=Math.round(ca*xD+cb*yD+cc);yD1=Math.round(cd*xD+ce*yD+cf);
xE1=Math.round(ca*xE+cb*yE+cc);yE1=Math.round(cd*xE+ce*yE+cf);
xF1=Math.round(ca*xF+cb*yF+cc);yF1=Math.round(cd*xF+ce*yF+cf);
C1.setAttribute("cx",xC1);C1.setAttribute("cy",yC1);
D1.setAttribute("cx",xD1);D1.setAttribute("cy",yD1);
E1.setAttribute("cx",xE1);E1.setAttribute("cy",yE1);
F1.setAttribute("cx",xF1);F1.setAttribute("cy",yF1);
trace="M "+xC1+" "+yC1+" "+xD1+" "+yD1+" "+xE1+" "+yE1+" "+xF1+" "+yF1+" z";
image.setAttribute("d",trace);
trace="M "+xA+" "+yA+" "+xB+" "+yB;
axe.setAttribute("d",trace);
matrix_a.firstChild.setData(Math.round(100*m_a)/100)
matrix_b.firstChild.setData(Math.round(100*m_b)/100)
matrix_c.firstChild.setData(Math.round(100*m_c)/100)
matrix_d.firstChild.setData(Math.round(100*m_d)/100)
matrix_e.firstChild.setData(Math.round(100*m_e)/100)
matrix_f.firstChild.setData(Math.round(100*m_f)/100)
}

function init_reflection(evt)
{
	appui=false
	xA=300
	yA=10
	xB=300
	yB=590
	xC=350
	yC=250
	xD=450
	yD=320
	xE=550
	yE=290
	xF=400
	yF=100
    	A = svgdoc.getElementById("A");
	B = svgdoc.getElementById("B");
	axe = svgdoc.getElementById("axe");
	C = svgdoc.getElementById("C");
	D = svgdoc.getElementById("D");
	E = svgdoc.getElementById("E");
	F = svgdoc.getElementById("F");
	objet = svgdoc.getElementById("objet");
	C1 = svgdoc.getElementById("C1");
	D1 = svgdoc.getElementById("D1");
	E1 = svgdoc.getElementById("E1");
	F1 = svgdoc.getElementById("F1");
	image = svgdoc.getElementById("image");
	matrix_a = svgdoc.getElementById("matrix_a");
 	matrix_b = svgdoc.getElementById("matrix_b");
 	matrix_c = svgdoc.getElementById("matrix_c");
 	matrix_d = svgdoc.getElementById("matrix_d");
 	matrix_e = svgdoc.getElementById("matrix_e");
 	matrix_f = svgdoc.getElementById("matrix_f");
	ref_calcul()
}

function uns_cliquer(evt)
{cible=evt.target.getAttribute("id");
if ((cible=="A")||(cible=="B")||(cible=="C")||(cible=="D")||(cible=="E")||(cible=="F"))
{appui=true;}}

function uns_bouger(evt)
{if (appui==true)
{obj=svgdoc.getElementById(cible);
xm=coordo_x(evt.clientX);ym=coordo_y(evt.clientY);
obj.setAttribute("cx",xm);
if (cible!="B") {obj.setAttribute("cx",xm);obj.setAttribute("cy",ym)}
else {obj.setAttribute("x",xm)};
if (cible=="C") {xC=xm;yC=ym};
if (cible=="D") {xD=xm;yD=ym};if (cible=="E") {xE=xm;yE=ym};
if (cible=="F") {xF=xm;yF=ym};
if (cible=="B") {xB=xm;k=(xB-295)/150};
angle_val.firstChild.setData(Math.round(k*100)/100);
uns_calcul();
}}

function uns_calcul()
{trace="M "+xC+" "+yC+" "+xD+" "+yD+" "+xE+" "+yE+" "+xF+" "+yF+" z";
objet.setAttribute("d",trace);
m_a=k
m_c=0
m_e=(1-k)*xA
m_b=0
m_d=k
m_f=(1-k)*yA
xC1=Math.round(k*xC+(1-k)*xA);yC1=Math.round(k*yC+(1-k)*yA);
xD1=Math.round(k*xD+(1-k)*xA);yD1=Math.round(k*yD+(1-k)*yA);
xE1=Math.round(k*xE+(1-k)*xA);yE1=Math.round(k*yE+(1-k)*yA);
xF1=Math.round(k*xF+(1-k)*xA);yF1=Math.round(k*yF+(1-k)*yA);
C1.setAttribute("cx",xC1);C1.setAttribute("cy",yC1);
D1.setAttribute("cx",xD1);D1.setAttribute("cy",yD1);
E1.setAttribute("cx",xE1);E1.setAttribute("cy",yE1);
F1.setAttribute("cx",xF1);F1.setAttribute("cy",yF1);
trace="M "+xC1+" "+yC1+" "+xD1+" "+yD1+" "+xE1+" "+yE1+" "+xF1+" "+yF1+" z";
image.setAttribute("d",trace);
matrix_a.firstChild.setData(Math.round(100*m_a)/100)
matrix_b.firstChild.setData(Math.round(100*m_b)/100)
matrix_c.firstChild.setData(Math.round(100*m_c)/100)
matrix_d.firstChild.setData(Math.round(100*m_d)/100)
matrix_e.firstChild.setData("0")
matrix_f.firstChild.setData("0")
}

function init_uniformScale(evt)
{
	appui=false
	xA=300
	yA=300
	xC=350
	yC=250
	xD=450
	yD=320
	xE=550
	yE=290
	xF=400
	yF=100
	k=-1
	xB=11
	yB=11
    	A = svgdoc.getElementById("A");
   	B = svgdoc.getElementById("B");
	C = svgdoc.getElementById("C");
	D = svgdoc.getElementById("D");
	E = svgdoc.getElementById("E");
	F = svgdoc.getElementById("F");
	objet = svgdoc.getElementById("objet");
	C1 = svgdoc.getElementById("C1");
	D1 = svgdoc.getElementById("D1");
	E1 = svgdoc.getElementById("E1");
	F1 = svgdoc.getElementById("F1");
	image = svgdoc.getElementById("image");
	matrix_a = svgdoc.getElementById("matrix_a");
 	matrix_b = svgdoc.getElementById("matrix_b");
 	matrix_c = svgdoc.getElementById("matrix_c");
 	matrix_d = svgdoc.getElementById("matrix_d");
 	matrix_e = svgdoc.getElementById("matrix_e");
 	matrix_f = svgdoc.getElementById("matrix_f");
	angle_val = svgdoc.getElementById("angle_val");
	uns_calcul()
   }

function sky_cliquer(evt)
{cible=evt.target.getAttribute("id");
if ((cible=="B")||(cible=="C")||(cible=="D")||(cible=="E")||(cible=="F"))
{appui=true;}}

function sky_bouger(evt)
{if (appui==true)
{obj=svgdoc.getElementById(cible);
xm=coordo_x(evt.clientX);ym=coordo_y(evt.clientY);
if (cible=="C") {xC=xm;yC=ym};
if (cible=="D") {xD=xm;yD=ym};if (cible=="E") {xE=xm;yE=ym};
if (cible=="F") {xF=xm;yF=ym};
if (cible=="B") {dist=Math.sqrt((xm-30)*(xm-30)+(ym-30)*(ym-30));k=Math.acos((xm-30)/dist);
if (ym>30){k=-k};if (k>Math.PI) {k=k-Math.PI};if (k<-Math.PI) {k=k+Math.PI}; 
angle_val.firstChild.setData(Math.round(-k*180/Math.PI));
xB=Math.round(30+24*Math.cos(k));yB=Math.round(30-24*Math.sin(k));
xm=xB;ym=yB;}
obj.setAttribute("cx",xm);obj.setAttribute("cy",ym);
sky_calcul();
}
}

function sky_calcul()
{trace="M "+xC+" "+yC+" "+xD+" "+yD+" "+xE+" "+yE+" "+xF+" "+yF+" z";
objet.setAttribute("d",trace);
m_a=1
m_c=0
m_e=0
m_b=Math.tan(-k)
m_d=1
m_f=0
xC1=Math.round(m_a*xC+m_c*yC+m_e);yC1=Math.round(m_b*xC+m_d*yC+m_f);
xD1=Math.round(m_a*xD+m_c*yD+m_e);yD1=Math.round(m_b*xD+m_d*yD+m_f);
xE1=Math.round(m_a*xE+m_c*yE+m_e);yE1=Math.round(m_b*xE+m_d*yE+m_f);
xF1=Math.round(m_a*xF+m_c*yF+m_e);yF1=Math.round(m_b*xF+m_d*yF+m_f);
C1.setAttribute("cx",xC1);C1.setAttribute("cy",yC1);
D1.setAttribute("cx",xD1);D1.setAttribute("cy",yD1);
E1.setAttribute("cx",xE1);E1.setAttribute("cy",yE1);
F1.setAttribute("cx",xF1);F1.setAttribute("cy",yF1);
trace="M "+xC1+" "+yC1+" "+xD1+" "+yD1+" "+xE1+" "+yE1+" "+xF1+" "+yF1+" z";
image.setAttribute("d",trace);
if (k>0) {trace="M 54 30 A 24 24 0 0 0 "+xB+" "+yB+" L 30 30 z"};
if (k<0) {trace="M 54 30 A 24 24 0 0 1 "+xB+" "+yB+" L 30 30 z"};
if (k==0) {trace="M 54 30 30 30"};
angle.setAttribute("d",trace);
matrix_a.firstChild.setData(Math.round(100*m_a)/100)
matrix_b.firstChild.setData(Math.round(100*m_b)/100)
matrix_c.firstChild.setData(Math.round(100*m_c)/100)
matrix_d.firstChild.setData(Math.round(100*m_d)/100)
matrix_e.firstChild.setData(Math.round(100*m_e)/100)
matrix_f.firstChild.setData(Math.round(100*m_f)/100)
}


function init_skewY(evt)
{ 
	appui=false
	xA=300
	yA=300
	xC=200
	yC=150
	xD=250
	yD=50
	xE=500
	yE=100
	xF=450
	yF=200
	xB=51
	yB=42
	k=-Math.PI/6
   	B = svgdoc.getElementById("B");
	C = svgdoc.getElementById("C");
	D = svgdoc.getElementById("D");
	E = svgdoc.getElementById("E");
	F = svgdoc.getElementById("F");
	objet = svgdoc.getElementById("objet");
	angle = svgdoc.getElementById("angle");
	C1 = svgdoc.getElementById("C1");
	D1 = svgdoc.getElementById("D1");
	E1 = svgdoc.getElementById("E1");
	F1 = svgdoc.getElementById("F1");
	image = svgdoc.getElementById("image");
	matrix_a = svgdoc.getElementById("matrix_a");
 	matrix_b = svgdoc.getElementById("matrix_b");
 	matrix_c = svgdoc.getElementById("matrix_c");
 	matrix_d = svgdoc.getElementById("matrix_d");
 	matrix_e = svgdoc.getElementById("matrix_e");
 	matrix_f = svgdoc.getElementById("matrix_f");
	angle_val = svgdoc.getElementById("angle_val");
	sky_calcul()
   }

function skx_cliquer(evt)
{cible=evt.target.getAttribute("id");
if ((cible=="B")||(cible=="C")||(cible=="D")||(cible=="E")||(cible=="F"))
{appui=true;}}

function skx_bouger(evt)
{if (appui==true)
{obj=svgdoc.getElementById(cible);
xm=coordo_x(evt.clientX);ym=coordo_y(evt.clientY);
if (cible=="C") {xC=xm;yC=ym};
if (cible=="D") {xD=xm;yD=ym};if (cible=="E") {xE=xm;yE=ym};
if (cible=="F") {xF=xm;yF=ym};
if (cible=="B") {dist=Math.sqrt((xm-30)*(xm-30)+(ym-30)*(ym-30));k=Math.acos((xm-30)/dist);
if (ym>30){k=-k};if (k>Math.PI) {k=k-Math.PI};if (k<-Math.PI) {k=k+Math.PI}; 
angle_val.firstChild.setData(Math.round(-k*180/Math.PI));
xB=Math.round(30+24*Math.cos(k));yB=Math.round(30-24*Math.sin(k));
xm=xB;ym=yB;}
obj.setAttribute("cx",xm);obj.setAttribute("cy",ym);
skx_calcul();
}}

function skx_calcul()
{trace="M "+xC+" "+yC+" "+xD+" "+yD+" "+xE+" "+yE+" "+xF+" "+yF+" z";
objet.setAttribute("d",trace);
m_a=1
m_c=Math.tan(-k)
m_e=0
m_b=0
m_d=1
m_f=0
xC1=Math.round(m_a*xC+m_c*yC+m_e);yC1=Math.round(m_b*xC+m_d*yC+m_f);
xD1=Math.round(m_a*xD+m_c*yD+m_e);yD1=Math.round(m_b*xD+m_d*yD+m_f);
xE1=Math.round(m_a*xE+m_c*yE+m_e);yE1=Math.round(m_b*xE+m_d*yE+m_f);
xF1=Math.round(m_a*xF+m_c*yF+m_e);yF1=Math.round(m_b*xF+m_d*yF+m_f);
C1.setAttribute("cx",xC1);C1.setAttribute("cy",yC1);
D1.setAttribute("cx",xD1);D1.setAttribute("cy",yD1);
E1.setAttribute("cx",xE1);E1.setAttribute("cy",yE1);
F1.setAttribute("cx",xF1);F1.setAttribute("cy",yF1);
trace="M "+xC1+" "+yC1+" "+xD1+" "+yD1+" "+xE1+" "+yE1+" "+xF1+" "+yF1+" z";
image.setAttribute("d",trace);
if (k>0) {trace="M 54 30 A 24 24 0 0 0 "+xB+" "+yB+" L 30 30 z"};
if (k<0) {trace="M 54 30 A 24 24 0 0 1 "+xB+" "+yB+" L 30 30 z"};
if (k==0) {trace="M 54 30 30 30"};
angle.setAttribute("d",trace);
matrix_a.firstChild.setData(Math.round(100*m_a)/100)
matrix_b.firstChild.setData(Math.round(100*m_b)/100)
matrix_c.firstChild.setData(Math.round(100*m_c)/100)
matrix_d.firstChild.setData(Math.round(100*m_d)/100)
matrix_e.firstChild.setData(Math.round(100*m_e)/100)
matrix_f.firstChild.setData(Math.round(100*m_f)/100)
}

function init_skewX(evt)
{ 
	appui=false
	xA=300
	yA=300
	xC=350
	yC=250
	xD=450
	yD=320
	xE=500
	yE=170
	xF=400
	yF=100
	xB=47
	yB=13
	k=Math.PI/4
   	B = svgdoc.getElementById("B");
	C = svgdoc.getElementById("C");
	D = svgdoc.getElementById("D");
	E = svgdoc.getElementById("E");
	F = svgdoc.getElementById("F");
	objet = svgdoc.getElementById("objet");
	angle = svgdoc.getElementById("angle");
	C1 = svgdoc.getElementById("C1");
	D1 = svgdoc.getElementById("D1");
	E1 = svgdoc.getElementById("E1");
	F1 = svgdoc.getElementById("F1");
	image = svgdoc.getElementById("image");
	matrix_a = svgdoc.getElementById("matrix_a");
 	matrix_b = svgdoc.getElementById("matrix_b");
 	matrix_c = svgdoc.getElementById("matrix_c");
 	matrix_d = svgdoc.getElementById("matrix_d");
 	matrix_e = svgdoc.getElementById("matrix_e");
 	matrix_f = svgdoc.getElementById("matrix_f");
	angle_val = svgdoc.getElementById("angle_val");
	skx_calcul()
}

function sca_cliquer(evt)
{cible=evt.target.getAttribute("id");
if ((cible=="A")||(cible=="B")||(cible=="C")||(cible=="D")||(cible=="E")||(cible=="F"))
{appui=true;}}

function sca_bouger(evt)
{if (appui==true)
{obj=svgdoc.getElementById(cible);
xm=coordo_x(evt.clientX);ym=coordo_y(evt.clientY);
obj.setAttribute("cx",xm);
if ((cible!="B")&&(cible!="A")) {obj.setAttribute("cx",xm);obj.setAttribute("cy",ym)}
else 
{if (cible=="B") obj.setAttribute("x",xm)
if (cible=="A") obj.setAttribute("y",ym)
};
if (cible=="C") {xC=xm;yC=ym};
if (cible=="D") {xD=xm;yD=ym};if (cible=="E") {xE=xm;yE=ym};
if (cible=="F") {xF=xm;yF=ym};
if (cible=="B") {xB=xm;kx=(xB-295)/150};
if (cible=="A") {yA=ym;ky=(yA-295)/150};
angle_val.firstChild.setData(Math.round(kx*100)/100+","+Math.round(ky*100)/100);
sca_calcul();
}}

function sca_calcul()
{trace="M "+xC+" "+yC+" "+xD+" "+yD+" "+xE+" "+yE+" "+xF+" "+yF+" z";
objet.setAttribute("d",trace);
m_a=kx
m_c=0
m_e=(1-kx)*300
m_b=0
m_d=ky
m_f=(1-ky)*300
xC1=Math.round(m_a*xC+m_e);yC1=Math.round(m_d*yC+m_f);
xD1=Math.round(m_a*xD+m_e);yD1=Math.round(m_d*yD+m_f);
xE1=Math.round(m_a*xE+m_e);yE1=Math.round(m_d*yE+m_f);
xF1=Math.round(m_a*xF+m_e);yF1=Math.round(m_d*yF+m_f);
C1.setAttribute("cx",xC1);C1.setAttribute("cy",yC1);
D1.setAttribute("cx",xD1);D1.setAttribute("cy",yD1);
E1.setAttribute("cx",xE1);E1.setAttribute("cy",yE1);
F1.setAttribute("cx",xF1);F1.setAttribute("cy",yF1);
trace="M "+xC1+" "+yC1+" "+xD1+" "+yD1+" "+xE1+" "+yE1+" "+xF1+" "+yF1+" z";
image.setAttribute("d",trace);
matrix_a.firstChild.setData(Math.round(100*m_a)/100)
matrix_b.firstChild.setData("0")
matrix_c.firstChild.setData("0")
matrix_d.firstChild.setData(Math.round(100*m_d)/100)
matrix_e.firstChild.setData("0")
matrix_f.firstChild.setData("0")
}

function init_scale(evt)
{ 
	appui=false
	xA=11
	yA=155
	xC=350
	yC=250
	xD=450
	yD=320
	xE=550
	yE=290
	xF=400
	yF=100
	kx=-1
	ky=-1
	xB=11
	yB=11
    	A = svgdoc.getElementById("A");
   	B = svgdoc.getElementById("B");
	C = svgdoc.getElementById("C");
	D = svgdoc.getElementById("D");
	E = svgdoc.getElementById("E");
	F = svgdoc.getElementById("F");
	objet = svgdoc.getElementById("objet");
	C1 = svgdoc.getElementById("C1");
	D1 = svgdoc.getElementById("D1");
	E1 = svgdoc.getElementById("E1");
	F1 = svgdoc.getElementById("F1");
	image = svgdoc.getElementById("image");
	matrix_a = svgdoc.getElementById("matrix_a");
 	matrix_b = svgdoc.getElementById("matrix_b");
 	matrix_c = svgdoc.getElementById("matrix_c");
 	matrix_d = svgdoc.getElementById("matrix_d");
 	matrix_e = svgdoc.getElementById("matrix_e");
 	matrix_f = svgdoc.getElementById("matrix_f");
	angle_val = svgdoc.getElementById("angle_val");
	sca_calcul()
   }

function rot_cliquer(evt)
{cible=evt.target.getAttribute("id");
if ((cible=="A")||(cible=="B")||(cible=="C")||(cible=="D")||(cible=="E")||(cible=="F"))
{appui=true;}}

function rot_bouger(evt)
{if (appui==true)
{obj=svgdoc.getElementById(cible);
xm=coordo_x(evt.clientX);ym=coordo_y(evt.clientY);
if (cible=="A") {xA=xm;yA=ym};if (cible=="C") {xC=xm;yC=ym};
if (cible=="D") {xD=xm;yD=ym};if (cible=="E") {xE=xm;yE=ym};
if (cible=="F") {xF=xm;yF=ym};
if (cible=="B") {dist=Math.sqrt((xm-30)*(xm-30)+(ym-30)*(ym-30));k=Math.acos((xm-30)/dist);
if (ym>30){k=-k};if (k>Math.PI) {k=k-Math.PI};if (k<-Math.PI) {k=k+Math.PI}; 
xB=Math.round(30+24*Math.cos(k));yB=Math.round(30-24*Math.sin(k));
xm=xB;ym=yB;}
angle_val.firstChild.setData(Math.round(-k*180/Math.PI)+","+xA.toString()+","+yA.toString());
obj.setAttribute("cx",xm);obj.setAttribute("cy",ym);
rot_calcul();
}}

function rot_calcul()
{trace="M "+xC+" "+yC+" "+xD+" "+yD+" "+xE+" "+yE+" "+xF+" "+yF+" z";
objet.setAttribute("d",trace);a=Math.cos(k);b=Math.sin(k);
m_a=a
m_c=b
m_e=(1-a)*xA-b*yA
m_b=-b
m_d=a
m_f=(1-a)*yA+b*xA
xC1=Math.round(a*xC+b*yC+(1-a)*xA-b*yA);yC1=Math.round(-b*xC+a*yC+(1-a)*yA+b*xA);
xD1=Math.round(a*xD+b*yD+(1-a)*xA-b*yA);yD1=Math.round(-b*xD+a*yD+(1-a)*yA+b*xA);
xE1=Math.round(a*xE+b*yE+(1-a)*xA-b*yA);yE1=Math.round(-b*xE+a*yE+(1-a)*yA+b*xA);
xF1=Math.round(a*xF+b*yF+(1-a)*xA-b*yA);yF1=Math.round(-b*xF+a*yF+(1-a)*yA+b*xA);
C1.setAttribute("cx",xC1);C1.setAttribute("cy",yC1);
D1.setAttribute("cx",xD1);D1.setAttribute("cy",yD1);
E1.setAttribute("cx",xE1);E1.setAttribute("cy",yE1);
F1.setAttribute("cx",xF1);F1.setAttribute("cy",yF1);
trace="M "+xC1+" "+yC1+" "+xD1+" "+yD1+" "+xE1+" "+yE1+" "+xF1+" "+yF1+" z";
image.setAttribute("d",trace);
if (k>0) {trace="M 54 30 A 24 24 0 0 0 "+xB+" "+yB+" L 30 30 z"};
if (k<0) {trace="M 54 30 A 24 24 0 0 1 "+xB+" "+yB+" L 30 30 z"};
if (k==0) {trace="M 54 30 30 30"};
angle.setAttribute("d",trace);
matrix_a.firstChild.setData(Math.round(100*m_a)/100)
matrix_b.firstChild.setData(Math.round(100*m_b)/100)
matrix_c.firstChild.setData(Math.round(100*m_c)/100)
matrix_d.firstChild.setData(Math.round(100*m_d)/100)
matrix_e.firstChild.setData(Math.round(100*m_e)/100)
matrix_f.firstChild.setData(Math.round(100*m_f)/100)
}


function init_rotate(evt)
{ 
	appui=false
	xA=300 
	yA=300
	xC=350
	yC=250
	xD=450
	yD=320
	xE=550
	yE=290
	xF=400
	yF=100
	xB=6
	yB=30
	k=Math.PI
    	A = svgdoc.getElementById("A");
   	B = svgdoc.getElementById("B");
	C = svgdoc.getElementById("C");
	D = svgdoc.getElementById("D");
	E = svgdoc.getElementById("E");
	F = svgdoc.getElementById("F");
	objet = svgdoc.getElementById("objet");
	angle = svgdoc.getElementById("angle");
	C1 = svgdoc.getElementById("C1");
	D1 = svgdoc.getElementById("D1");
	E1 = svgdoc.getElementById("E1");
	F1 = svgdoc.getElementById("F1");
	image = svgdoc.getElementById("image");
	matrix_a = svgdoc.getElementById("matrix_a");
 	matrix_b = svgdoc.getElementById("matrix_b");
 	matrix_c = svgdoc.getElementById("matrix_c");
 	matrix_d = svgdoc.getElementById("matrix_d");
 	matrix_e = svgdoc.getElementById("matrix_e");
 	matrix_f = svgdoc.getElementById("matrix_f");
	angle_val = svgdoc.getElementById("angle_val");
	rot_calcul()
   
}

function trans_cliquer(evt)
{cible=evt.target.getAttribute("id");
if ((cible=="A")||(cible=="B")||(cible=="C")||(cible=="D")||(cible=="E")||(cible=="F"))
{appui=true;}}

function trans_bouger(evt)
{if (appui==true)
{obj=svgdoc.getElementById(cible);
xm=coordo_x(evt.clientX);ym=coordo_y(evt.clientY);
obj.setAttribute("cx",xm);obj.setAttribute("cy",ym);
if (cible=="A") {xA=xm;yA=ym};if (cible=="B") {xB=xm;yB=ym};if (cible=="C") {xC=xm;yC=ym};
if (cible=="D") {xD=xm;yD=ym};if (cible=="E") {xE=xm;yE=ym};if (cible=="F") {xF=xm;yF=ym};
angle_val.firstChild.setData(Math.round(xB-xA)+","+Math.round(yB-yA));
trans_calcul();
}}
function trans_calcul()
{trace="M "+xC+" "+yC+" "+xD+" "+yD+" "+xE+" "+yE+" "+xF+" "+yF+" z";
objet.setAttribute("d",trace);
m_a=1
m_c=0
m_e=xB-xA
m_b=0
m_d=1
m_f=yB-yA

xC1=Math.round(xC+m_e);yC1=Math.round(yC+m_f);
xD1=Math.round(xD+m_e);yD1=Math.round(yD+m_f);
xE1=Math.round(xE+m_e);yE1=Math.round(yE+m_f);
xF1=Math.round(xF+m_e);yF1=Math.round(yF+m_f);
C1.setAttribute("cx",xC1);C1.setAttribute("cy",yC1);
D1.setAttribute("cx",xD1);D1.setAttribute("cy",yD1);
E1.setAttribute("cx",xE1);E1.setAttribute("cy",yE1);
F1.setAttribute("cx",xF1);F1.setAttribute("cy",yF1);
trace="M "+xC1+" "+yC1+" "+xD1+" "+yD1+" "+xE1+" "+yE1+" "+xF1+" "+yF1+" z";
image.setAttribute("d",trace);
trace="M "+xA+" "+yA+" "+xB+" "+yB;
axe.setAttribute("d",trace);
matrix_a.firstChild.setData(Math.round(100*m_a)/100)
matrix_b.firstChild.setData(Math.round(100*m_b)/100)
matrix_c.firstChild.setData(Math.round(100*m_c)/100)
matrix_d.firstChild.setData(Math.round(100*m_d)/100)
matrix_e.firstChild.setData(Math.round(100*m_e)/100)
matrix_f.firstChild.setData(Math.round(100*m_f)/100)
}

function init_translate(evt)
{
	appui=false
	xA=500
	yA=10
	xB=300
	yB=110
	xC=350
	yC=250
	xD=450
	yD=320
	xE=550
	yE=290
	xF=400
	yF=100
    	A = svgdoc.getElementById("A");
	B = svgdoc.getElementById("B");
	axe = svgdoc.getElementById("axe");
	C = svgdoc.getElementById("C");
	D = svgdoc.getElementById("D");
	E = svgdoc.getElementById("E");
	F = svgdoc.getElementById("F");
	objet = svgdoc.getElementById("objet");
	C1 = svgdoc.getElementById("C1");
	D1 = svgdoc.getElementById("D1");
	E1 = svgdoc.getElementById("E1");
	F1 = svgdoc.getElementById("F1");
	image = svgdoc.getElementById("image");
	matrix_a = svgdoc.getElementById("matrix_a");
 	matrix_b = svgdoc.getElementById("matrix_b");
 	matrix_c = svgdoc.getElementById("matrix_c");
 	matrix_d = svgdoc.getElementById("matrix_d");
 	matrix_e = svgdoc.getElementById("matrix_e");
 	matrix_f = svgdoc.getElementById("matrix_f");
	angle_val = svgdoc.getElementById("angle_val");
	trans_calcul()
}

function sym_cliquer(evt)
{cible=evt.target.getAttribute("id");
if ((cible=="A")||(cible=="C")||(cible=="D")||(cible=="E")||(cible=="F"))
{appui=true;}}

function sym_bouger(evt)
{if (appui==true)
{obj=svgdoc.getElementById(cible);
xm=coordo_x(evt.clientX);ym=coordo_y(evt.clientY);
obj.setAttribute("cx",xm);obj.setAttribute("cy",ym);
if (cible=="A") {xA=xm;yA=ym};if (cible=="C") {xC=xm;yC=ym};
if (cible=="D") {xD=xm;yD=ym};if (cible=="E") {xE=xm;yE=ym};if (cible=="F") {xF=xm;yF=ym};
sym_calcul();
}}

function sym_calcul()
{trace="M "+xC+" "+yC+" "+xD+" "+yD+" "+xE+" "+yE+" "+xF+" "+yF+" z";
objet.setAttribute("d",trace);
m_a=-1
m_c=0
m_e=2*xA
m_b=0
m_d=1
m_f=2*yA
xC1=Math.round(2*xA-xC);yC1=Math.round(2*yA-yC);
xD1=Math.round(2*xA-xD);yD1=Math.round(2*yA-yD);
xE1=Math.round(2*xA-xE);yE1=Math.round(2*yA-yE);
xF1=Math.round(2*xA-xF);yF1=Math.round(2*yA-yF);
C1.setAttribute("cx",xC1);C1.setAttribute("cy",yC1);
D1.setAttribute("cx",xD1);D1.setAttribute("cy",yD1);
E1.setAttribute("cx",xE1);E1.setAttribute("cy",yE1);
F1.setAttribute("cx",xF1);F1.setAttribute("cy",yF1);
trace="M "+xC1+" "+yC1+" "+xD1+" "+yD1+" "+xE1+" "+yE1+" "+xF1+" "+yF1+" z";
image.setAttribute("d",trace);
matrix_a.firstChild.setData(Math.round(100*m_a)/100)
matrix_b.firstChild.setData(Math.round(100*m_b)/100)
matrix_c.firstChild.setData(Math.round(100*m_c)/100)
matrix_d.firstChild.setData(Math.round(100*m_d)/100)
matrix_e.firstChild.setData(Math.round(100*m_e)/100)
matrix_f.firstChild.setData(Math.round(100*m_f)/100)
}


function init_symetry(evt)
{ 
	appui=false
        xC=350
	yC=250
	xD=450
	yD=320
	xE=550
	yE=290
	xF=400
	yF=100
	xA=300
	yA=300
    	A = svgdoc.getElementById("A")
	C = svgdoc.getElementById("C")
	D = svgdoc.getElementById("D")
	E = svgdoc.getElementById("E")
	F = svgdoc.getElementById("F")
	objet = svgdoc.getElementById("objet")
	C1 = svgdoc.getElementById("C1")
	D1 = svgdoc.getElementById("D1")
	E1 = svgdoc.getElementById("E1")
	F1 = svgdoc.getElementById("F1")
	image = svgdoc.getElementById("image")
	matrix_a = svgdoc.getElementById("matrix_a")
 	matrix_b = svgdoc.getElementById("matrix_b")
 	matrix_c = svgdoc.getElementById("matrix_c")
 	matrix_d = svgdoc.getElementById("matrix_d")
 	matrix_e = svgdoc.getElementById("matrix_e")
 	matrix_f = svgdoc.getElementById("matrix_f")
	sym_calcul()
   }

