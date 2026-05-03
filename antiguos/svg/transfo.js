var a="0",b="0",c="0",d="0",e="0",f="0",transfo=""
var mat_ok=false

function enter_matrix(evt)
{
	matrix = prompt("Enter a b c d e f with space as separator","")
	if (matrix)
	{
		mat = matrix.split(" ")
		a = mat[0]
		b = mat[1]
		c = mat[2]
		d = mat[3]
		e = mat[4]
		f = mat[5]
		analyse_transfo()
		if (mat_ok)
			draw_shapes(evt)
	}
}
	
function draw_shapes(evt)
{
	test1.setAttributeNS(null,"transform","matrix("+a+" "+b+" "+c+" "+d+" "+e+" "+f+")")
	test2.setAttributeNS(null,"transform",transfo)
	matrix_a.firstChild.data = Math.round(100*a)/100
	matrix_b.firstChild.data = Math.round(100*b)/100
	matrix_c.firstChild.data = Math.round(100*c)/100
	matrix_d.firstChild.data = Math.round(100*d)/100
	matrix_e.firstChild.data = Math.round(100*e)/100
	matrix_f.firstChild.data = Math.round(100*f)/100
	transform.firstChild.data = transfo
}

function analyse_transfo()
{
	if (a*d-b*c==0) 
	{
		alert("Transformation is not defined : ad-bc=0")
		mat_ok = false
	}
	else
	{
		mat_ok = true
		if (a*c+b*d==0)
		{
			param1 = a*a+b*b
			if (param1 == c*c+d*d)
			{
				angle = Math.round(1000 * Math.acos(a / Math.sqrt(param1))*180/Math.PI) / 1000
				if (b < 0)
					angle = angle * -1
				rapp = parseInt(1000 * Math.sqrt(param1)) / 1000
				if (a*d - b*c < 0)
					transfo="scale("+ rapp +"," + rapp * -1 + ")"
				else
				if (param1==1)
 					transfo=""
				else
					transfo="scale("+ rapp + "," + rapp + ")"
					
				if (angle!=0)
					transfo = "rotate("+ angle +") " + transfo 
			}
			else
			{
				if (a != 0)
					transfo = "scale(" + a + "," + d + ")"
				else
					transfo = "scale(" + - c + "," + b + ") rotate(90)"
			}
		}
		else
		{
			if (d!=0)
			{
				transfo="scale("+parseInt(1000 *(a*d-b*c)/d) / 1000 + "," + d + ") " 
				if ( c * d != 0 )
       				transfo += "skewX("+ parseInt(1000 * Math.atan(c*d/(a*d-b*c)) * 180 / Math.PI) / 1000 + ") "
				if ( b != 0 )
				transfo += "skewY("+ parseInt(1000 * Math.atan( b / d) * 180 / Math.PI) / 1000 +") "
			}
			else
			{
				transfo = "scale(" + (c * -1) + "," + b + ") rotate(90) "
				if ( a != 0 )
				transfo += "skewY("+ parseInt(1000 * Math.atan(a/c)*180/Math.PI) / 1000 +") "
			}
		}
	if ((e!=0)||(f!=0))
		transfo = "translate(" + e + "," + f + ") " + transfo
	}
}

function init_svg_any(evt)
{
	test1 = svgdoc.getElementById("test1")
	test2 = svgdoc.getElementById("test2")
	transform = svgdoc.getElementById("transform")
	matrix_a = svgdoc.getElementById("matrix_a")
	matrix_b = svgdoc.getElementById("matrix_b")
	matrix_c = svgdoc.getElementById("matrix_c")
	matrix_d = svgdoc.getElementById("matrix_d")
	matrix_e = svgdoc.getElementById("matrix_e")
	matrix_f = svgdoc.getElementById("matrix_f")
}



