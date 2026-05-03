    var x = null, y = null, dx = null, dy = null;
    var phi0 = 0, click=false;
    var graph = null, graphPnts = null;

    function init_sumangles(evt)
    {
	click = false
	x1 = 150
	y1 = 300
	x2 = 300
	y2 = 300
       	p1 = svgdoc.getElementById("p1");
      	p2 = svgdoc.getElementById("p2");
		p3 = svgdoc.getElementById("p3");

    	ag1 = svgdoc.getElementById("ag1");
      	cost1 = svgdoc.getElementById("cos1");
       	sint1 = svgdoc.getElementById("sin1");
      	tant1 = svgdoc.getElementById("tan1");
     	ag2 = svgdoc.getElementById("ag2");
      	cost2 = svgdoc.getElementById("cos2");
       	sint2 = svgdoc.getElementById("sin2");
      	tant2 = svgdoc.getElementById("tan2");
    	ag3 = svgdoc.getElementById("ag3");
      	cost3 = svgdoc.getElementById("cos3");
       	sint3 = svgdoc.getElementById("sin3");
      	tant3 = svgdoc.getElementById("tan3");
  }
	function sumangles_move(evt)
	{
		if (click)
		{
			xm = coordo_x(evt.clientX)
			ym = coordo_y(evt.clientY)
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
			sumangles_calcul()
		}
	}

	function sumangles_calcul()
	{
		dist = Math.sqrt( (x1 - 100) * (x1 - 100) + (y1 - 300) * (y1 - 300))
		rapp = 50 / dist
		x1 = rapp * x1 + 100 * ( 1 - rapp)
		y1 = rapp * y1 + 300 * ( 1 - rapp)
		p1.setAttributeNS(null,"cx",x1)
		p1.setAttributeNS(null,"cy",y1)		
		cos1 = (x1 - 100) / 50
		if (cos1 < -1 )
			cos1 = -1
		if (cos1 > 1 )
			cos1 = 1
		angle1 = Math.acos(cos1)
		if (y1 > 300) 
			angle1 = 2 * Math.PI - angle1

		dist = Math.sqrt( (x2 - 250) * (x2 - 250) + (y2 - 300) * (y2 - 300))
		rapp = 50 / dist
		x2 = rapp * x2 + 250 * ( 1 - rapp)
		y2 = rapp * y2 + 300 * ( 1 - rapp)
		p2.setAttributeNS(null,"cx",x2)
		p2.setAttributeNS(null,"cy",y2)		
		cos2 = (x2 - 250) / 50
		if (cos2 < -1 )
			cos2 = -1
		if (cos2 > 1 )
			cos2 = 1
		angle2 = Math.acos(cos2)
		if (y2 > 300) 
			angle2 = 2 * Math.PI - angle2
		angle3 = angle1 + angle2
		if (angle3 >= 2 * Math.PI)
			angle3 -= 2 * Math.PI

		x3 = 450 + 50 * Math.cos( angle3 )
		y3 = 300 - 50 * Math.sin( angle3 )
		p3.setAttributeNS(null,"cx",x3)
		p3.setAttributeNS(null,"cy",y3)		
		ag1.firstChild.data = Math.round(angle1 * 180 / Math.PI)
		cost1.firstChild.data = Math.round( 1000 * Math.cos( angle1 )) / 1000
		sint1.firstChild.data = Math.round( 1000 * Math.sin( angle1 )) / 1000
		tant1.firstChild.data = Math.round( 1000 * Math.tan( angle1 )) / 1000
		ag2.firstChild.data = Math.round(angle2 * 180 / Math.PI)
		cost2.firstChild.data = Math.round( 1000 * Math.cos( angle2 )) / 1000
		sint2.firstChild.data = Math.round( 1000 * Math.sin( angle2 )) / 1000
		tant2.firstChild.data = Math.round( 1000 * Math.tan( angle2 )) / 1000
		ag3.firstChild.data = Math.round(angle3 * 180 / Math.PI)
		cost3.firstChild.data = Math.round( 1000 * Math.cos( angle3 )) / 1000
		sint3.firstChild.data = Math.round( 1000 * Math.sin( angle3 )) / 1000
		tant3.firstChild.data = Math.round( 1000 * Math.tan( angle3 )) / 1000
	}


    function init_arctangente(evt)
    {
	click = false
	x1 = 350
	y1 = 250
      	graph = svgdoc.getElementById("graph");
       	p1 = svgdoc.getElementById("p1");
      	p2 = svgdoc.getElementById("p2");
      	l1 = svgdoc.getElementById("l1");
    	ag = svgdoc.getElementById("ag");
      	atan = svgdoc.getElementById("atan");
	step = 0.02
      	arctangente_drawGraph(graph,-3.5,3.5,100,-100,350,250,step);
    }

    function arctangente_drawGraph(path, tmin, tmax, sx, sy,x_origin, y_origin, step)
    {
      var data = "M" + (tmin * sx + x_origin) + "," + (Math.atan(tmin) * sy + y_origin)
       for (var t=tmin + step; t < tmax; t += step)
          data += "L" + (t * sx + x_origin) + "," + (Math.atan(t) * sy + y_origin) + " "
       data += "L" + (tmax * sx + x_origin) + "," + (Math.atan(tmax) * sy + y_origin) + " "

     path.setAttribute("d", data);
     }

	function arctangente_move(evt)
	{
		if (click)
		{
			x1 = coordo_x(evt.clientX)
			if ( x1 < 0)
				x1 = 0
			if ( x1 > 700)
				x1 = 700
			arctangente_calcul()
		}
	}

	function arctangente_calcul()
	{
		p1.setAttributeNS(null,"cx",x1)
		atgte = ( x1 - 350 ) / 100
		angle = Math.atan(atgte)
		x2 = 550 + 100 * Math.cos(angle)
		y2 = 400 - 100 * Math.sin(angle)
		p2.setAttributeNS(null,"cx", x2)
		p2.setAttributeNS(null,"cy", y2)	
		l1.setAttributeNS(null,"x2", x2)
		l1.setAttributeNS(null,"y2", y2)		
		ag.firstChild.data = Math.round(angle * 180 / Math.PI)
		atan.firstChild.data = Math.round( 100 * atgte) / 100
	}



    function init_arccosinus(evt)
    {
	click = false
	x1 =  50
	y1 = 250
      	graph = svgdoc.getElementById("graph");
       	p1 = svgdoc.getElementById("p1");
      	p2 = svgdoc.getElementById("p2");
      	l1 = svgdoc.getElementById("l1");
    	ag = svgdoc.getElementById("ag");
      	acos = svgdoc.getElementById("acos");
	step = 0.02
      	arccosinus_drawGraph(graph,-1,1,100,-100,150,400,step);
    }

    function arccosinus_drawGraph(path, tmin, tmax, sx, sy,x_origin, y_origin, step)
    {
      var data = "M" + (tmin * sx + x_origin) + "," + (Math.acos(tmin) * sy + y_origin)
       for (var t=tmin + step; t < tmax; t += step)
          data += "L" + (t * sx + x_origin) + "," + (Math.acos(t) * sy + y_origin) + " "
       data += "L" + (tmax * sx + x_origin) + "," + (Math.acos(tmax) * sy + y_origin) + " "

     path.setAttribute("d", data);
     }

	function arccosinus_move(evt)
	{
		if (click)
		{
			x1 = coordo_x(evt.clientX)
			if ( x1 < 50)
				x1 = 50
			if ( x1 > 250)
				x1 = 250
			arccosinus_calcul()
		}
	}

	function arccosinus_calcul()
	{
		p1.setAttributeNS(null,"cx",x1)
		acosinus = ( x1 - 150 ) / 100
		angle = Math.acos(acosinus)
		x2 = 400 + 100 * Math.cos(angle)
		y2 = 250 - 100 * Math.sin(angle)
		p2.setAttributeNS(null,"cx", x2)
		p2.setAttributeNS(null,"cy", y2)	
		l1.setAttributeNS(null,"x2", x2)
		l1.setAttributeNS(null,"y2", y2)		
		ag.firstChild.data = Math.round(angle * 180 / Math.PI)
		acos.firstChild.data = Math.round( 100 * acosinus) / 100
	}



    function init_arcsinus(evt)
    {
	click = false
	x1 =  50
	y1 = 250
      	graph = svgdoc.getElementById("graph");
       	p1 = svgdoc.getElementById("p1");
      	p2 = svgdoc.getElementById("p2");
      	l1 = svgdoc.getElementById("l1");
    	ag = svgdoc.getElementById("ag");
      	asin = svgdoc.getElementById("asin");
	step = 0.02
      	arcsinus_drawGraph(graph,-1,1,100,-100,150,250,step);
    }

    function arcsinus_drawGraph(path, tmin, tmax, sx, sy,x_origin, y_origin, step)
    {
      var data = "M" + (tmin * sx + x_origin) + "," + (Math.asin(tmin) * sy + y_origin)
       for (var t=tmin + step; t < tmax; t += step)
          data += "L" + (t * sx + x_origin) + "," + (Math.asin(t) * sy + y_origin) + " "
       data += "L" + (tmax * sx + x_origin) + "," + (Math.asin(tmax) * sy + y_origin) + " "

     path.setAttribute("d", data);
     }

	function arcsinus_move(evt)
	{
		if (click)
		{
			x1 = coordo_x(evt.clientX)
			if ( x1 < 50)
				x1 = 50
			if ( x1 > 250)
				x1 = 250
			arcsinus_calcul()
		}
	}

	function arcsinus_calcul()
	{
		p1.setAttributeNS(null,"cx",x1)
		asinus = ( x1 - 150 ) / 100
		angle = Math.asin(asinus)
		x2 = 400 + 100 * Math.cos(angle)
		y2 = 250 - 100 * Math.sin(angle)
		p2.setAttributeNS(null,"cx", x2)
		p2.setAttributeNS(null,"cy", y2)	
		y3 = 350 + ( y1 - 350 ) * 50 / (x1 - 100)	
		l1.setAttributeNS(null,"x2", x2)
		l1.setAttributeNS(null,"y2", y2)		
		ag.firstChild.data = Math.round(angle * 180 / Math.PI)
		asin.firstChild.data = Math.round( 100 * asinus) / 100
	}


    function init_tangente()
    {
	click = false
	x1 =  150
	y1 = 200
      	graph = svgdoc.getElementById("graph");
       	p1 = svgdoc.getElementById("p1");
      	p2 = svgdoc.getElementById("p2");
      	l1 = svgdoc.getElementById("l1");
        l2 = svgdoc.getElementById("l2");
    	ag = svgdoc.getElementById("ag");
      	cosin = svgdoc.getElementById("cosin");
	step = 24
	step_pi = Math.PI/ step
       	tangente_drawGraph(step_pi);
    }
    function tangente_drawGraph(step)
    {
   	x = new Array()
       	y = new Array()
       	dx = new Array()
	dy = new Array()
       Evaluate(Tangente, x, y, dx, dy, -1.4, 1.5, step);
       SplineGraph(graph, x, y, dx, dy , 50, 50, 250, 350);
    }
     function Tangente(t, dt, x, y, dx, dy)
    {
       x[x.length] = t;
       dx[dx.length] = dt;
       y[y.length] = Math.tan(t);
       dy[dy.length] = dt / (Math.cos(t) * Math.cos(t));
    }
    function Evaluate(Func, x, y, dx, dy, tmin, tmax, dt)
    {
       for (var t=tmin; t<=tmax+dt/2; t+=dt)
          Func(t, dt, x, y, dx, dy);
    }
    function SplineGraph(path, x, y, dx, dy, sx, sy,x_origin, y_origin)
    {
	    sy = -sy   
       var data = "M" + (x[0]*sx + x_origin) + "," + (y[0]*sy + y_origin)
       for (var i=1; i < x.length; i++)
          data += "C" + ((x[i-1] + dx[i-1]/3)*sx + x_origin) + "," + ((y[i-1] + dy[i-1]/3)*sy + y_origin) + " "
                      + ((x[i] - dx[i]/3)*sx + x_origin) + "," + ((y[i] - dy[i]/3)*sy + y_origin)+ " "
                      + (x[i]*sx + x_origin) + "," + (y[i]*sy + y_origin) + " ";
       path.setAttribute("d", data);
    }

	function tangente_move(evt)
	{
		if (click)
		{
			x1 = coordo_x(evt.clientX)
			y1 = coordo_y(evt.clientY)
			tangente_calcul()
		}
	}

	function tangente_calcul()
	{
		dist = Math.sqrt( (x1 - 100) * (x1 - 100) + (y1 - 350) * (y1 - 350))
		rapp = 50 / dist
		x1 = rapp * x1 + 100 * ( 1 - rapp)
		y1 = rapp * y1 + 350 * ( 1 - rapp)
		p1.setAttributeNS(null,"cx",x1)
		p1.setAttributeNS(null,"cy",y1)		
		angle = Math.atan((350 - y1) / (x1 - 100))
		if (x1 < 100) 
			angle2 = angle + Math.PI
		else
			angle2 = angle
		x2 = 250 + 50 * angle
		y2 = 350 - 50 * Math.tan( angle )

		p2.setAttributeNS(null,"cx",x2)
		p2.setAttributeNS(null,"cy",y2)	
		y3 = 350 + ( y1 - 350 ) * 50 / (x1 - 100)	
		l1.setAttributeNS(null,"y1", y3)
		l1.setAttributeNS(null,"y2", y3)		
		if ( x1 < 100)
		{
			l2.setAttributeNS(null,"x1",x1)
			l2.setAttributeNS(null,"y1",y1)
		}
		else
		{
			l2.setAttributeNS(null,"x1",100)
			l2.setAttributeNS(null,"y1",350)
		}
		l2.setAttributeNS(null,"y2",y3)		
		ag.firstChild.data = Math.round(angle2 * 180 / Math.PI)
		cosin.firstChild.data = Math.round( 1000 * Math.tan( angle )) / 1000
	}


    function init_cosinus()
    {
	click = false
	x1 =  150
	y1 = 200
      	graph = svgdoc.getElementById("graph");
       	p1 = svgdoc.getElementById("p1");
      	p2 = svgdoc.getElementById("p2");
      	l1 = svgdoc.getElementById("l1");
        l2 = svgdoc.getElementById("l2");
    	ag = svgdoc.getElementById("ag");
      	cosin = svgdoc.getElementById("cosin");
	step = 6
	step_pi = Math.PI/ step
       	cosinus_drawGraph(step_pi);
    }
    function cosinus_drawGraph(step)
    {
   	x = new Array()
       	y = new Array()
       	dx = new Array()
	dy = new Array()
       Evaluate(Cosine, x, y, dx, dy, 0, 6.29, step);
       SplineGraph(graph, x, y, dx, dy , 50, 50, 200, 200);
    }
    function Sine(t, dt, x, y, dx, dy)
    {
       x[x.length] = t;
       dx[dx.length] = dt;
       y[y.length] = Math.sin(t);
       dy[dy.length] = Math.cos(t)*dt;
    }
    function Cosine(t, dt, x, y, dx, dy)
    {
       x[x.length] = t;
       dx[dx.length] = dt;
       y[y.length] = Math.cos(t);
       dy[dy.length] = - Math.sin(t)*dt;
    }
    function Evaluate(Func, x, y, dx, dy, tmin, tmax, dt)
    {
       for (var t=tmin; t<=tmax+dt/2; t+=dt)
          Func(t, dt, x, y, dx, dy);
    }
    function SplineGraph(path, x, y, dx, dy, sx, sy,x_origin, y_origin)
    {
	    sy = -sy   
       var data = "M" + (x[0]*sx + x_origin) + "," + (y[0]*sy + y_origin)
       for (var i=1; i < x.length; i++)
          data += "C" + ((x[i-1] + dx[i-1]/3)*sx + x_origin) + "," + ((y[i-1] + dy[i-1]/3)*sy + y_origin) + " "
                      + ((x[i] - dx[i]/3)*sx + x_origin) + "," + ((y[i] - dy[i]/3)*sy + y_origin)+ " "
                      + (x[i]*sx + x_origin) + "," + (y[i]*sy + y_origin) + " ";
       path.setAttribute("d", data);
    }

	function cosinus_move(evt)
	{
		if (click)
		{
			x1 = coordo_x(evt.clientX)
			y1 = coordo_y(evt.clientY)
			cosinus_calcul()
		}
	}

	function cosinus_calcul()
	{
		dist = Math.sqrt( (x1 - 100) * (x1 - 100) + (y1 - 200) * (y1 - 200))
		rapp = 50 / dist
		x1 = rapp * x1 + 100 * ( 1 - rapp)
		y1 = rapp * y1 + 200 * ( 1 - rapp)
		p1.setAttributeNS(null,"cx",x1)
		p1.setAttributeNS(null,"cy",y1)		
		cosi = (x1 - 100) / 50
		if (cosi < -1 )
			cosi = -1
		if (cosi > 1 )
			cosi = 1
		angle = Math.acos(cosi)
		if (y1 > 200) 
			angle = 2 * Math.PI - angle
		x2 = 200 + 50 * angle
		y2 = 200 - 50 * Math.cos( angle )
		p2.setAttributeNS(null,"cx",x2)
		p2.setAttributeNS(null,"cy",y2)		
		l1.setAttributeNS(null,"y1", 300 - x1)
		l1.setAttributeNS(null,"y2", 300 - x1)		

		l2.setAttributeNS(null,"x1",x1)
		l2.setAttributeNS(null,"x2",x1)		
		ag.firstChild.data = Math.round(angle * 180 / Math.PI)
		cosin.firstChild.data = Math.round( 1000 * Math.cos( angle )) / 1000
	}


    function init_sinus()
    {
	click = false
	x1 =  150
	y1 = 200
      	graph = svgdoc.getElementById("graph");
       	p1 = svgdoc.getElementById("p1");
      	p2 = svgdoc.getElementById("p2");
      	l1 = svgdoc.getElementById("l1");
      	ag = svgdoc.getElementById("ag");
      	sin = svgdoc.getElementById("sin");
	step = 6
	step_pi = Math.PI/ step
       	sinus_drawGraph(step_pi);
    }
    function sinus_drawGraph(step)
    {
   	x = new Array()
       	y = new Array()
       	dx = new Array()
	dy = new Array()
       Evaluate(Sine, x, y, dx, dy, 0, 6.29, step);
       SplineGraph(graph, x, y, dx, dy , 50, 50, 200, 200);
    }
    function Sine(t, dt, x, y, dx, dy)
    {
       x[x.length] = t;
       dx[dx.length] = dt;
       y[y.length] = Math.sin(t);
       dy[dy.length] = Math.cos(t)*dt;
    }
    function Evaluate(Func, x, y, dx, dy, tmin, tmax, dt)
    {
       for (var t=tmin; t<=tmax+dt/2; t+=dt)
          Func(t, dt, x, y, dx, dy);
    }
    function SplineGraph(path, x, y, dx, dy, sx, sy,x_origin, y_origin)
    {
	    sy = -sy   
       var data = "M" + (x[0]*sx + x_origin) + "," + (y[0]*sy + y_origin)
       for (var i=1; i < x.length; i++)
          data += "C" + ((x[i-1] + dx[i-1]/3)*sx + x_origin) + "," + ((y[i-1] + dy[i-1]/3)*sy + y_origin) + " "
                      + ((x[i] - dx[i]/3)*sx + x_origin) + "," + ((y[i] - dy[i]/3)*sy + y_origin)+ " "
                      + (x[i]*sx + x_origin) + "," + (y[i]*sy + y_origin) + " ";
       path.setAttribute("d", data);
    }

	function sinus_move(evt)
	{
		if (click)
		{
			x1 = coordo_x(evt.clientX)
			y1 = coordo_y(evt.clientY)
			sinus_calcul()
		}
	}

	function sinus_calcul()
	{
		dist = Math.sqrt( (x1 - 100) * (x1 - 100) + (y1 - 200) * (y1 - 200))
		rapp = 50 / dist
		x1 = rapp * x1 + 100 * ( 1 - rapp)
		y1 = rapp * y1 + 200 * ( 1 - rapp)
		p1.setAttributeNS(null,"cx",x1)
		p1.setAttributeNS(null,"cy",y1)		
		cosi = (x1 - 100) / 50
		if (cosi < -1 )
			cosi = -1
		if (cosi > 1 )
			cosi = 1
		angle = Math.acos(cosi)
		if (y1 > 200) 
			angle = 2 * Math.PI - angle
		x2 = 200 + 50 * angle
		y2 = 200 - 50 * Math.sin( angle )
		p2.setAttributeNS(null,"cx",x2)
		p2.setAttributeNS(null,"cy",y2)		
		l1.setAttributeNS(null,"y1",y2)
		l1.setAttributeNS(null,"y2",y2)		
		ag.firstChild.data = Math.round(angle * 180 / Math.PI)
		sin.firstChild.data = Math.round( 1000 * Math.sin( angle )) / 1000
	}

