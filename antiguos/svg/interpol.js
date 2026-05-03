    var xz = new Array(20, 130, 190, 300, 360, 420, 480),   
        yz = new Array(70, 50, 80, 10, 70,  60, 90),        
        dx = new Array(), dy = new Array(),
        s_anim = 0.5,
	step = 0.05,
        graphcd = null;    
    var active = false;

    function CardinalSplineGraph_svg()
    {
       var data = "M" + xz[0] + "," + yz[0];
       for (var i=1; i < xz.length; i++)
          data += "C" + (xz[i-1]+dx[i-1]/3) + "," + (yz[i-1]+dy[i-1]/3) + " "
                      + (xz[i]-dx[i]/3)     + "," + (yz[i]-dy[i]/3)     + " "
                      + xz[i]               + "," + yz[i]               + " ";
       graphcd.setAttribute("d", data);
    }
    function CardinalTangents_svg()
    {
       var n = 7;
       for (var i=1; i < n-1; i++)
       {
          dx[i] = (xz[i+1] - xz[i-1])*s_anim;
          dy[i] = (yz[i+1] - yz[i-1])*s_anim;
       }
       dx[0]   = 0.5*(3*(xz[1]-xz[0]) - dx[1]);
       dy[0]   = 0.5*(3*(yz[1]-yz[0]) - dy[1]);
       dx[n-1] = 0.5*(3*(xz[n-1]-xz[n-2]) - dx[n-2]);
       dy[n-1] = 0.5*(3*(yz[n-1]-yz[n-2]) - dy[n-2]);
    }

    function CardinalDraw_svg()
    {
      CardinalTangents_svg();
      CardinalSplineGraph_svg();
    }

    function init_svg_cardinalInterpo()
    {
	s_anim = 0.5
	active = false
       graphcd = svgdoc.getElementById("cardinalanime");
	CardinalDraw_svg()
  }


    function svg_cardinalInterpoGo()
    {
       active = !active
       svg_cardinalInterpoAnimate();
    }

    function svg_cardinalInterpoAnimate()
    {
       if (s_anim >= 1 )
		{
			s_anim = 1
			step = - 0.05
		}
	if (s_anim <= 0 )
		{
			s_anim = 0
			step = 0.05
		}
       s_anim += step
       CardinalDraw_svg();
       if (active) window.setTimeout("svg_cardinalInterpoAnimate()", 50);
       return true
  }
 
    function init_svg_hermiteInterpo(evt)
    {
 	phi0_anim = Math.PI/6
 	active = false
    graphanime2 = svgdoc.getElementById("graphanime2");
       graphPnts = svgdoc.getElementById("graphPnts");
       svg_hermiteInterpoDrawGraph();
    }
    function svg_hermiteInterpoGo()
    {
       active = !active
       svg_hermiteInterpoAnimate();
    }
    function svg_hermiteInterpoAnimate()
    {
       phi0_anim = (phi0_anim + Math.PI/120) % (2*Math.PI);
       svg_hermiteInterpoDrawGraph();
       if (active) window.setTimeout("svg_hermiteInterpoAnimate()", 1);
       return true;
    }
    function svg_hermiteInterpoDrawGraph()
    {
       xpa  = new Array();  ypa  = new Array();
       dx = new Array(); dy = new Array();
       svg_hermiteInterpoEvaluate(svg_hermiteInterpoSine, xpa, ypa, dx, dy, 0, 2*Math.PI, Math.PI/2);
       svg_hermiteInterpoSplineGraph(graphanime2, xpa, ypa, dx, dy, 500/(2*Math.PI), -100/2);
       svg_hermiteInterpoGraphPnts(graphPnts, xpa, ypa, 500/(2*Math.PI), -100/2);
    }
    function svg_hermiteInterpoSine(t, dt, x, y, dx, dy)
    {
       x[x.length] = t;
       dx[dx.length] = dt;
       y[y.length] = Math.sin(t+phi0_anim);
       dy[dy.length] = Math.cos(t+phi0_anim)*dt;
    }
    function svg_hermiteInterpoEvaluate(Func, x, y, dx, dy, tmin, tmax, dt)
    {
       for (var t=tmin; t<=tmax+dt/10; t+=dt)
          Func(t, dt, x, y, dx, dy);
    }
    function svg_hermiteInterpoSplineGraph(path, x, y, dx, dy, sx, sy)
    {
       var data = "M" + x[0]*sx + "," + y[0]*sy;
       for (var i=1; i < x.length; i++)
          data += "C" + (x[i-1] + dx[i-1]/3)*sx + "," + (y[i-1] + dy[i-1]/3)*sy + " "
                      + (x[i] - dx[i]/3)*sx + "," + (y[i] - dy[i]/3)*sy + " "
                      + x[i]*sx + "," + y[i]*sy + " ";
       path.setAttribute("d", data);
    }
    function svg_hermiteInterpoGraphPnts(path, x, y, sx, sy)
    {
       var data = "";
       for (var i=0; i<x.length; i++)
          data += "M" + x[i]*sx + "," + y[i]*sy + "Z ";
       path.setAttribute("d", data);
    }


    function init_svg_linearInterpo(evt)
    {
	phi0_anim = Math.PI/6	
	active = false
       graphanime = svgdoc.getElementById("graphanime");
       graphPnts = svgdoc.getElementById("graphPnts");
       svg_linearInterpoDrawGraph();
    }
    function svg_linearInterpoGo()
    {
       active = !active; 
       svg_linearInterpoAnimate();
    }
    function svg_linearInterpoAnimate()
    {
       phi0_anim = (phi0_anim + Math.PI/120) % (2*Math.PI);
       svg_linearInterpoDrawGraph();
       if (active) window.setTimeout("svg_linearInterpoAnimate()", 1);
       return true;
    }
    function svg_linearInterpoDrawGraph()
    {
       xp = new Array();
       yp = new Array();
       svg_linearInterpoLinearEvaluate(svg_linearInterpoSine, xp, yp, 0, 2*Math.PI, Math.PI/6, 0);
       svg_linearInterpoLinearGraph(graphanime, xp, yp, 500/(2*Math.PI), 100/2);
       svg_linearInterpoLinearGraphPnts(graphPnts, xp, yp, 500/(2*Math.PI), 100/2);
    }
    function svg_linearInterpoSine(t, xp, yp)
    {
       xp[xp.length] = t;
       yp[yp.length] = Math.sin(t+phi0_anim);
    }
    function svg_linearInterpoLinearEvaluate(Func, xp, yp, tmin, tmax, dt)
    {
       for (var t=tmin; t<=tmax+dt/10; t+=dt)
          Func(t, xp, yp);
    }
    function svg_linearInterpoLinearGraph(path, xp, yp, sx, sy)
    {
       var data = "M";
       sy = -sy;
       for (var i=0; i<xp.length; i++)
          data += xp[i]*sx + "," + yp[i]*sy + " ";
       path.setAttribute("d", data);
    }
    function svg_linearInterpoLinearGraphPnts(path, xp, yp, sx, sy)
    {
       var data = "";
       sy = -sy;
       for (var i=0; i<xp.length; i++)
          data += "M" + xp[i]*sx + "," + yp[i]*sy + "Z ";
       path.setAttribute("d", data);
    }
    function Lissajou(curvepath, pointpath, spline)  
    {
       this.curve  = curvepath;
       this.points = pointpath;
       this.r      = 100;
       this.omega1 = 1;
       this.omega2 = 2;
       this.phi    = Math.PI/6;
       this.dphi   = Math.PI/60;
       this.dt     = (spline == true) ? Math.PI/12 : Math.PI/45;
       this.Graph  = (spline == true) ? this.SplineGraph : this.LinearGraph;
       this.active = false;
    }

    Lissajou.prototype.X = function(t) { return this.r*Math.sin(this.omega1*t); }
    Lissajou.prototype.Y = function(t) { return this.r*Math.cos(this.omega2*t + this.phi); }
    Lissajou.prototype.DX = function(t, dt) { return  this.r*Math.cos(this.omega1*t)*this.omega1*dt; }
    Lissajou.prototype.DY = function(t, dt) { return -this.r*Math.sin(this.omega2*t + this.phi)*this.omega2*dt; }

    Lissajou.prototype.LinearGraph = function()
    {
       var cdata = "M", pdata = "", pi2 = 2.001*Math.PI;

       for (var t=0.0; t <= pi2; t += this.dt)
       {
          cdata += this.X(t) + "," + this.Y(t) + " ";
          pdata += "M" + this.X(t) + "," + this.Y(t) + "Z ";
       }

       this.curve.setAttribute("d", cdata);
       this.points.setAttribute("d", pdata);
    }

    Lissajou.prototype.SplineGraph = function()
    {
       var pi2 = 2.001*Math.PI;
       var x0 = this.X(0), y0 = this.Y(0), dx0 = this.DX(0, this.dt), dy0 = this.DY(0, this.dt),
           x1, y1, dx1, dy1;
       var cdata = "M" + x0 + "," + y0, pdata = "";

       for (var t=this.dt; t <= pi2; t += this.dt)
       {
          x1 = this.X(t); y1 = this.Y(t); dx1 = this.DX(t, this.dt); dy1 = this.DY(t, this.dt);
          pdata += "M" + x0 + "," + y0 + "Z ";
          cdata += "C" + (x0 + dx0/3) + "," + (y0 + dy0/3) + " "
                       + (x1 - dx1/3) + "," + (y1 - dy1/3) + " "
                       + x1 + "," + y1 + " ";
          x0 = x1; dx0 = dx1; y0 = y1; dy0 = dy1;
       }

       this.curve.setAttribute("d", cdata);
       this.points.setAttribute("d", pdata);
    }

    function LinearAnimate()
    {
       var lissajou = window.lissajouLinear;
       if (lissajou.active)
       {
          lissajou.phi += lissajou.dphi;
          lissajou.Graph();
          window.setTimeout("LinearAnimate()", 1);
       }
       return true;
    }
    function SplineAnimate()
    {
       var lissajou = window.lissajouSpline;
       if (lissajou.active)
       {
          lissajou.phi += lissajou.dphi;
          lissajou.Graph();
          window.setTimeout("SplineAnimate()", 1);
       }
       return true;
    }

    function init_svg_compareInterpo(evt)
    {
       window.lissajouLinear = new Lissajou(svgdoc.getElementById("linearGraph"),
                                            svgdoc.getElementById("linearPnts"),
                                            false);
       window.lissajouSpline = new Lissajou(svgdoc.getElementById("splineGraph"),
                                            svgdoc.getElementById("splinePnts"),
                                            true);
       window.lissajouLinear.Graph();
       window.lissajouSpline.Graph();
    }

    function Go(evt)
    {
       if (evt.target.getAttribute("id") == "linearGo")
       {
         window.lissajouLinear.active = !window.lissajouLinear.active;
         LinearAnimate();
       }
       else
       {
         window.lissajouSpline.active = !window.lissajouSpline.active;
         SplineAnimate();
       }
    }
