var appui=false, click = false
var cible="";
var xC1=250,yC1=250,xD1=150,yD1=320,xE1=50,yE1=290,xF1=200,yF1=100;
var ag="",agt="",cursor=""
var x1=100,y1=130,x2=120,y2=280,x3=250,y3=250,x4=230,y4=100
var a_m=0.65,b_m=-0.15,c_m=0.1,d_m=0.75,e_m=30,f_m=40


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

function init_explore(evt)
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

