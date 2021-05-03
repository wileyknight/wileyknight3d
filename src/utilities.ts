
import react from 'react';
export {};
/*
const utilities = {
    getAspect: (aspectW: number, aspectH: number) => {
      let aString = aspectW / aspectH;
      return aString.toFixed(3);
    },
    getHeight: (aspectW: number, aspectR: number) => {
      return aspectW / aspectR;
    },
    getWidth: (aspectH: number, aspectR: number) => {
      return aspectH * aspectR;
    },
    scalePct: (range: number, pct: number) => {
      return (range / 100) * pct;
    },
    getPct: (range: number, total: number) => {
      return range / (total / 100);
    },
    easeInCubic: (time: number, begin: number, change: number, duration: number) => {
      if (time >= begin && time < begin + duration) {
        return change * (time /= duration) * time * time + begin;
      } else if (begin > time) {
        return begin;
      } else {
        return begin + change;
      }
    },
    easeOutCubic: (time: number, begin: number, change: number, duration: number) => {
      if (time >= begin && time < begin + duration) {
        return change * ((time = time / duration - 1) * time * time + 1) + begin;
      } else if (begin > time) {
        return begin;
      } else {
        return begin + change;
      }
    },
    easeInOutCubic: (time: number, begin: number, change: number, duration: number) => {
      if (time >= begin && time < begin + duration) {
        if ((time /= duration / 2) < 1)
          return (change / 2) * time * time * time + begin;
        return (change / 2) * ((time -= 2) * time * time + 2) + begin;
      } else if (begin > time) {
        return begin;
      } else {
        return begin + change;
      }
    },
    easeLinear: (time: number, begin: number, change: number, duration: number) => {
      if (time >= begin && time < begin + duration) {
        var timelineTemp = (time * 100) / duration;
        return this.scalePct(timelineTemp, change);
      } else if (begin > time) {
        return begin;
      } else {
        return begin + change;
      }
    },
    easeInQuad: function (t: number, b: number, c: number, d: number) {
      t /= d;
      return c * t * t + b;
    },
    easeOutQuad: function (t: number, b: number, c: number, d: number) {
      t /= d;
      return -c * t * (t - 2) + b;
    },
    easeInOutQuad: function (t: number, b: number, c: number, d: number) {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t + b;
      t--;
      return (-c / 2) * (t * (t - 2) - 1) + b;
    },
    easeInQuart: function (t: number, b: number, c: number, d: number) {
      t /= d;
      return c * t * t * t * t + b;
    },
    easeOutQuart: function (t: number, b: number, c: number, d: number) {
      t /= d;
      t--;
      return -c * (t * t * t * t - 1) + b;
    },
    easeInOutQuart: function (t: number, b: number, c: number, d: number) {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t * t * t + b;
      t -= 2;
      return (-c / 2) * (t * t * t * t - 2) + b;
    },
    easeInQuint: function (t: number, b: number, c: number, d: number) {
      t /= d;
      return c * t * t * t * t * t + b;
    },
    easeOutQuint: function (t: number, b: number, c: number, d: number) {
      t /= d;
      t--;
      return c * (t * t * t * t * t + 1) + b;
    },
    easeInOutQuint: function (t: number, b: number, c: number, d: number) {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t * t * t * t + b;
      t -= 2;
      return (c / 2) * (t * t * t * t * t + 2) + b;
    },
    easeInSine: function (t: number, b: number, c: number, d: number) {
      return -c * Math.cos((t / d) * (Math.PI / 2)) + c + b;
    },
    easeOutSine: function (t: number, b: number, c: number, d: number) {
      return c * Math.sin((t / d) * (Math.PI / 2)) + b;
    },
    easeInOutSine: function (t: number, b: number, c: number, d: number) {
      return (-c / 2) * (Math.cos((Math.PI * t) / d) - 1) + b;
    },
    easeInExpo: function (t: number, b: number, c: number, d: number) {
      return c * Math.pow(2, 10 * (t / d - 1)) + b;
    },
    easeOutExpo: function (t: number, b: number, c: number, d: number) {
      return c * (-Math.pow(2, (-10 * t) / d) + 1) + b;
    },
    easeInOutExpo: function (t: number, b: number, c: number, d: number) {
      t /= d / 2;
      if (t < 1) return (c / 2) * Math.pow(2, 10 * (t - 1)) + b;
      t--;
      return (c / 2) * (-Math.pow(2, -10 * t) + 2) + b;
    },
    easeInCirc: function (t: number, b: number, c: number, d: number) {
      t /= d;
      return -c * (Math.sqrt(1 - t * t) - 1) + b;
    },
    easeOutCirc: function (t: number, b: number, c: number, d: number) {
      t /= d;
      t--;
      return c * Math.sqrt(1 - t * t) + b;
    },
    easeInOutCirc: function (t: number, b: number, c: number, d: number) {
      t /= d / 2;
      if (t < 1) return (-c / 2) * (Math.sqrt(1 - t * t) - 1) + b;
      t -= 2;
      return (c / 2) * (Math.sqrt(1 - t * t) + 1) + b;
    },
    isFullscreen: function () {
      if (
        document.fullscreenElement &&
        document.fullscreenElement.nodeName === 'HTML'
      ) {
        return true;
      } else {
        return false;
      }
    },
  };
  
  export default utilities;
  
interface IPoint {
    x: () => number;
    y: () => number;
}

  const PLOT_HEIGHT = 500;
  
  window.addEventListener('load', () => {
    //let graph = new Graph('graph');
  
    let bezierCurve = new BezierCurve([
      new Point(10, 10),
      new Point(70, 310),
      new Point(210, 210),
      new Point(210, 10),
      // new Point(350, 50),
      // new Point(200, 290),
      // new Point(400, 80),
      // new Point(420, 100)
    ]);
  
    //drawHandles(graph, bezierCurve);
    //graph.drawCurveFromPoints(bezierCurve.drawingPoints);
  });
  
  /*
   * Class : Point( x coordinate, y coordinate )
   * -------------------------------------------
   * Represents a single point on the plot.
   *
  class Point {
    numX: number;
    numY: number;
  
    constructor(numX: number = 0, numY: number = 0) {
      this.numX = numX;
      /*
              The reason to the following is because we 
              want the origin to be at bottom left corner 
              instead of the top left.	
          *
      this.numY = PLOT_HEIGHT - numY;
    }
  
    x=()=> {
      return this.numX;
    }
  
    y=()=> {
      return this.numY;
    }
  
    mark() {
        //if (document.getElementById('graph') != null) {
        //    
        //    .insertAdjacentHTML(
         //     'beforeend',
         //     `<circle cx="${this.x}" cy="${this.y}" r="5" fill="#000" />`,
         //   );
       // }
    }
  }
  
  /*
   * Class : BezierCurve( Collection of n points for a curve of degree n)
   * ------------------------------------------------------------------
   * Represents a Bezier curve, the number of points passed in the con-
   * structor determine the degree of the curve.
   *
  
  class BezierCurve {
    points: any;
    numDrawingPoints: number;
    drawingPoints: object[];
  
    constructor(points: IPoint[]) {
      if (points instanceof Point) {
        this.points = [];
        for (let i = 0; i < arguments.length; i++) {
          if (arguments[i] instanceof Point) {
            this.points.push(arguments[i]);
          }
        }
      } else if (typeof points === 'object') {
        this.points = points;
      } else {
        this.points = [];
      }
  
      // Drawing points are the number of points that render the curve,
      // the more the number of drawing points, smoother the curve.
      this.numDrawingPoints = 100;
      this.drawingPoints = [];
  
      this.calculateDrawingPoints();
    }
  
    calculateDrawingPoints() {
      let interval = 1 / this.numDrawingPoints;
      let t = interval;
  
      this.drawingPoints.push(this.calculateNewPoint(0));
  
      for (let i = 0; i < this.numDrawingPoints; i++) {
        this.drawingPoints.push(this.calculateNewPoint(t));
        t += interval;
      }
    }
  
    calculateNewPoint(t: number) {
      // Coordinates calculated using the general formula are relative to
      // origin at bottom left.
      let x: number = 0;
      let y: number = 0;
      let n: number = this.points.length - 1;
      for (let i = 0; i <= n; i++) {
        let bin = C(n, i) * Math.pow(1 - t, n - i) * Math.pow(t, i);
        x += bin * this.points[i].x;
        y += bin * this.points[i].y;
      }
  
      return new Point(x, PLOT_HEIGHT - y);
    }
  }
  
  /*
   * Class : Graph(id of the svg container)
   * -------------------------------------------
   * Represents a graph and exports methods for
   * drawing lines and curves.
   *
  class Graph {
    //el: HTMLElement;
    constructor(id: string) {
      //this.el = document.getElementById(id);
    }
  
    drawLine(point1: object, point2: object, stroke:number = 2, color:string = '#000000') {
      //this.el.insertAdjacentHTML(
        //'beforeend',
        //`<line x1="${point1.x}" y1="${point1.y}" x2="${point2.x}" y2="${point2.y}" stroke="${color}" stroke-width="${stroke}" id="line"/>`,
      //);
    }
  
    drawCurveFromPoints(points: object[]) {
      for (let i = 0; i < points.length; i++) {
        if (i + 1 < points.length) this.drawLine(points[i], points[i + 1]);
      }
    }
  }
  
  // Utilty functions
  
  function drawHandles(graph: {drawLine: (point1: object, point2: object, stroke?: number, color?: string) => void}
    , curve: any) {
    if (curve.points.length === 1) {
      curve.points[0].mark();
      return;
    }
    for (let i = 1; i < curve.points.length; i++) {
      if (i == 1 || i == curve.points.length - 1) {
        curve.points[i - 1].mark();
        curve.points[i].mark();
      }
      graph.drawLine(
        curve.points[i - 1],
        curve.points[i],
        1,
        i == 1 || i == curve.points.length - 1 ? '#00FF00' : '#AA4444',
      );
    }
    if (curve.points.length === 1) {
      curve.points[0].mark();
      return;
    }
  }
  
  function C(n: number, k: number): number {
    var coeff = 1;
    for (var x = n - k + 1; x <= n; x++) coeff *= x;
    for (x = 1; x <= k; x++) coeff /= x;
    return coeff;
  }

/********************************************************************************************************************************** 
Copyright (C) 2015 Ivan Kuckir

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*


  function CSPL(){
	
	const _gaussJ = {
        solve: function(A: any, x: number[])	// in Matrix, out solutions
        {
            var m = A.length;
            for(var k=0; k<m; k++)	// column
            {
                // pivot for column
                var i_max = 0; var vali = Number.NEGATIVE_INFINITY;
                for(var i=k; i<m; i++) if(Math.abs(A[i][k])>vali) { i_max = i; vali = Math.abs(A[i][k]);}
                this.swapRows(A, k, i_max);
                
                //if(A[k][k] == 0) console.log("matrix is singular!");
                
                // for all rows below pivot
                for(var i=k+1; i<m; i++)
                {
                    var cf = (A[i][k] / A[k][k]);
                    for(var j=k; j<m+1; j++)  A[i][j] -= A[k][j] * cf;
                }
            }
            
            for(var i:number=m-1; i>=0; i--)	// rows = columns
            {
                var v = A[i][m] / A[i][i];
                x[i] = v;
                for(var j=i-1; j>=0; j--)	// rows
                {
                    A[j][m] -= A[j][i] * v;
                    A[j][i] = 0;
                }
            }
        },
        zerosMat: function(r: number,c: number) {
            var A: any = [];
            for (var i=0; i<r; i++) {
                A.push([]);
                for(var j=0; j<c; j++) {
                    A[i].push(0);
                };
            }
            return A;
        },
        printMat: function(A: number[]){
            for(var i=0; i<A.length; i++)
            {
                console.log(A[i]);
            }
        },
        swapRows: function(m: number[], k: number, l:number) {
            var p = m[k];
            m[k] = m[l];
            m[l] = p;
        }
    };
		
	const getNaturalKs = function(xs: number[], ys: number[], ks: number[])	// in x values, in y values, out k values
	{
		var n = xs.length-1;
		var A:any = _gaussJ.zerosMat(n+1, n+2);
			
		for (var i=1; i<n; i++)	// rows
		{
			A[i][i-1] = 1/(xs[i] - xs[i-1]);
			
			A[i][i  ] = 2 * (1/(xs[i] - xs[i-1]) + 1/(xs[i+1] - xs[i])) ;
			
			A[i][i+1] = 1/(xs[i+1] - xs[i]);
			
			A[i][n+1] = 3*( (ys[i]-ys[i-1])/((xs[i] - xs[i-1])*(xs[i] - xs[i-1]))  +  (ys[i+1]-ys[i])/ ((xs[i+1] - xs[i])*(xs[i+1] - xs[i])) );
		}
		
		A[0][0  ] = 2/(xs[1] - xs[0]);
		A[0][1  ] = 1/(xs[1] - xs[0]);
		A[0][n+1] = 3 * (ys[1] - ys[0]) / ((xs[1]-xs[0])*(xs[1]-xs[0]));
		
		A[n][n-1] = 1/(xs[n] - xs[n-1]);
		A[n][n  ] = 2/(xs[n] - xs[n-1]);
		A[n][n+1] = 3 * (ys[n] - ys[n-1]) / ((xs[n]-xs[n-1])*(xs[n]-xs[n-1]));
			
		_gaussJ.solve(A, ks);		
	}
		
	const evalSpline = function(x: number, xs: number[], ys: number[], ks: number[])
	{
		var i = 1;
		while (xs[i]<x) i++;
		
		var t = (x - xs[i-1]) / (xs[i] - xs[i-1]);
		
		var a =  ks[i-1]*(xs[i]-xs[i-1]) - (ys[i]-ys[i-1]);
		var b = -ks[i  ]*(xs[i]-xs[i-1]) + (ys[i]-ys[i-1]);
		
		var q = (1-t)*ys[i-1] + t*ys[i] + t*(1-t)*(a*(1-t)+b*t);
		return q;
    }
};
*/