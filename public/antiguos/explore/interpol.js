    var x = null, y = null, dx = null, dy = null;
    var phi0 = 0;
    var graph = null, graphPnts = null;
    var xpc = new Array(20, 130, 190, 300, 360, 420, 480),   
        ypc = new Array(70, 50, 80, 10, 70,  60, 90),        
        dx = new Array(), dy = new Array(),
        s = 0.5,
        graph = null;


    function CardinalSplineGraph(path2, xp, yp, dx, dy)
    {
       var data = "M" + xp[0] + "," + yp[0];
       for (var i=1; i < xp.length; i++)
          data += "C" + (xp[i-1]+dx[i-1]/3) + "," + (yp[i-1]+dy[i-1]/3) + " "
                      + (xp[i]-dx[i]/3)     + "," + (yp[i]-dy[i]/3)     + " "
                      + xp[i]               + "," + yp[i]               + " ";
       path2.setAttribute("d", data);
    }
    function CardinalTangents(xp, yp, dx, dy, s)
    {
       var n = xp.length;
       for (var i=1; i < n-1; i++)
       {
          dx[i] = (xp[i+1] - xp[i-1])*s;
          dy[i] = (yp[i+1] - yp[i-1])*s;
       }
       dx[0]   = 0.5*(3*(xp[1]-xp[0]) - dx[1]);
       dy[0]   = 0.5*(3*(yp[1]-yp[0]) - dy[1]);
       dx[n-1] = 0.5*(3*(xp[n-1]-xp[n-2]) - dx[n-2]);
       dy[n-1] = 0.5*(3*(yp[n-1]-yp[n-2]) - dy[n-2]);
    }

    function init_cardinalInterpo(evt)
    {
       graph = svgdoc.getElementById("cardinal");
 	s = 0.5
       CardinalTangents(xpc, ypc, dx, dy, s);
       CardinalSplineGraph(graph, xpc, ypc, dx, dy);
      slider = svgdoc.getElementById("slider");
       thumb = svgdoc.getElementById("thumb");
       slider.addEventListener("mousedown", SliderDown, false);
       slider.addEventListener("mouseup", SliderUp, false);
       slider.addEventListener("mousemove", SliderMove, false);
       slider.addEventListener("click", SliderClick, false);
    }

    var slider = null, thumb = null, xoffset = 250, sliderActive = false; 

    function SliderCallback(val) 
    { 
       s = val/200; 
       CardinalTangents(xpc, ypc, dx, dy, s); 
       CardinalSplineGraph(graph, xpc, ypc, dx, dy); 
    }
    function SliderDown(event) { sliderActive = true; }
    function SliderUp(event)   { sliderActive = false; }
    function SliderMove(evt)
    {
       var value = coordo_x(evt.clientX) - xoffset - 4;
       if (sliderActive && value > 0 && value < 200)
       {
          thumb.setAttribute("transform", "translate(" + (value) + " 0)");
          SliderCallback(value);
       }
    }
    function SliderClick(evt)
    {
       var value = coordo_x(evt.clientX) - xoffset - 4;
       if (value > 0 && value < 200)
       {
          thumb.setAttribute("transform", "translate(" + (value) + " 0)");
          SliderCallback(value);
       }
    }



    function init_linearInterpo(evt)
    {
 	step = 6
	phi0 = 0
     	graphl = svgdoc.getElementById("graphlinear");
       	graphPntsl = svgdoc.getElementById("graphPntslinear");
       	step_counter = svgdoc.getElementById("step");
	step_pi = Math.PI/ step
       	linearInterpo_drawGraph(step_pi);
    }
    function linearInterpo_drawGraph(step)
    {
       x = new Array();
       y = new Array();
       LinearEvaluate(Sine, x, y, -6.6, 6.6, step);
       LinearGraph(graphl, x, y, 50, 50, 350, 200);
       LinearGraphPnts(graphPntsl, x, y, 50 , 50 , 350, 200);
    }
    function Sine(t, x, y)
    {
       x[x.length] = t;
       y[y.length] = Math.sin(t+phi0);
    }
    function LinearEvaluate(Func, x, y, tmin, tmax, dt)
    {
       for (var t=tmin; t<=tmax+dt/10; t+=dt)
          Func(t, x, y);
    }
    function LinearGraph(path, x, y, sx, sy, x_origin, y_origin)
    {
       var data = "M";
       sy = -sy;
       for (var i=0; i<x.length; i++)
          data += (x[i]*sx +x_origin) + "," + (y[i]*sy + y_origin) + " ";
       path.setAttribute("d", data);
    }
    function LinearGraphPnts(path, x, y, sx, sy, x_origin, y_origin)
    {
       var data = "";
       sy = -sy;
       for (var i=0; i<x.length; i++)
          data += "M" + (x[i]*sx +x_origin) + "," + (y[i]*sy + y_origin) + "Z ";
       path.setAttribute("d", data);
    }

function linearInterpo_change_step(num)
{
	step = step + num
	if (step < 2)
		step = 2
	step_counter.firstChild.data = step.toString()
	step_pi = Math.PI/ step
       	linearInterpo_drawGraph(step_pi);
}	


    function init_hermiteInterpo(evt)
    {
 	step = 6
	phi0 = 0
      	graphh = svgdoc.getElementById("graphhermite");
       	graphPntsh = svgdoc.getElementById("graphPntshermite");
       	step_counter = svgdoc.getElementById("step");
	step_pi = Math.PI/ step
       	hermiteInterpo_drawGraph(step_pi);
    }
    function hermiteInterpo_drawGraph(step)
    {
   	x = new Array()
       	y = new Array()
       	dx = new Array()
	dy = new Array()
       Evaluate2(Sine2, x, y, dx, dy, -6.6, 6.6, step, phi0);
       SplineGraph(graphh, x, y, dx, dy , 50, 50, 350, 200);
       LinearGraphPnts(graphPntsh, x, y, 50 , 50 , 350, 200);
    }

function hermiteInterpo_change_step(num)
{
	step = step + num
	if (step < 1)
		step = 1
	step_counter.firstChild.data = step.toString()
	step_pi = Math.PI/ step
       	hermiteInterpo_drawGraph(step_pi);
}	


    function init_compareInterpo(evt)
    {
 	step = 4
	phi0 = 0
      	graphc = svgdoc.getElementById("graphcompare");
       	graph2c = svgdoc.getElementById("graph2compare");
      	graphPntsc = svgdoc.getElementById("graphPntscompare");
       	step_counter = svgdoc.getElementById("step");
	step_pi = Math.PI/ step
       	compareInterpo_drawGraph(step_pi);
    }
    function compareInterpo_drawGraph(step)
    {
   	x = new Array()
       	y = new Array()
       	dx = new Array()
	dy = new Array()
       Evaluate2(Sine2, x, y, dx, dy, -6.6, 6.6, step, phi0);
       SplineGraph(graphc, x, y, dx, dy , 50, 50, 350, 200);
       LinearGraph(graph2c, x, y, 50, 50, 350, 200);
      LinearGraphPnts(graphPntsc, x, y, 50 , 50 , 350, 200);
    }
    function Sine2(t, dt, x, y, dx, dy, dec_ag)
    {
       x[x.length] = t;
       dx[dx.length] = dt;
       y[y.length] = Math.sin(t+dec_ag);
       dy[dy.length] = Math.cos(t+dec_ag)*dt;
    }
    function Evaluate2(Func, x, y, dx, dy, tmin, tmax, dt, decale)
    {
       for (var t=tmin; t<=tmax+dt/2; t+=dt)
          Func(t, dt, x, y, dx, dy, decale);
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

    function LinearGraph(path, x, y, sx, sy, x_origin, y_origin)
    {
       var data = "M";
       sy = -sy;
       for (var i=0; i<x.length; i++)
          data += (x[i]*sx +x_origin) + "," + (y[i]*sy + y_origin) + " ";
       path.setAttribute("d", data);
    }

    function LinearGraphPnts(path, x, y, sx, sy, x_origin, y_origin)
    {
       var data = "";
       sy = -sy;
       for (var i=0; i<x.length; i++)
          data += "M" + (x[i]*sx +x_origin) + "," + (y[i]*sy + y_origin) + "Z ";
       path.setAttribute("d", data);
    }

function compareInterpo_change_step(num)
{
	step = step + num
	if (step < 1)
		step = 1
	step_counter.firstChild.data = step.toString()
	step_pi = Math.PI/ step
       	compareInterpo_drawGraph(step_pi);
}	
