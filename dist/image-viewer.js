/**
 * @Angular Image Vieer Directive
 *
 * @Author 			: Ranjithprabhu K
 *
 * @Module Name 	: 	imageViewer
 *
 * @Directive Name	:	image-viewer [in DOM]
 *
 * @Description:  This handles the image viewer with image zoom-in, zoom-out, rotate-left, rotate-right options.
 *
 */

(function () {
"use strict";
angular.module('imageViewer',[]).directive('imageViewer',function(){

     return {
         restrict: 'EA',
         template:'<div style="padding:10px;">\
                <button id="girardir" class="btn btn-primary btn-lg" ng-disabled="noImage"><span class="glyphicon glyphicon-menu-left"> </span> Rotate to Left</button>\
                <button id="giraresq" class="btn btn-primary btn-lg" ng-disabled="noImage">Rotate to Right <span class="glyphicon glyphicon-menu-right"> </span></button>\
                <button id="zoomIn" class="btn btn-info btn-lg" ng-disabled="noImage"><span class="glyphicon glyphicon-zoom-in"> </span> Zoom In</button>\
                <button id="zoomOut" class="btn btn-info btn-lg" ng-disabled="noImage"><span class="glyphicon glyphicon-zoom-out"> </span> Zoom Out</button>\
                <button id="carregar" class="btn btn-warning btn-lg" ng-disabled="noImage"><span class="fa fa-arrow-left"> </span> Reset</button>\
                </div>\
				<div id="image-zoom" style="padding:10px;">\
				<h2 class="text-center text-danger" id="error-message" style="border:1px solid #000;display:none;padding:20px">Image Not Available</h2>\
                <canvas id="canvas" height="650" data-girar="0" style="border:1px solid #000;z-index:555555;cursor:grab;">sdsd</canvas>\
                <img ng-src="{{image}}" id="image" style="display:none" /> </div>',
         link: function(scope,element,attr){
             scope.image = attr.src;
			 scope.noImage = false;

		//options for the zoom and rotate 
		var canvas = document.getElementById('canvas');
		var image = document.getElementById('image');
		var element = canvas.getContext("2d");
		var angleInDegrees = 0;
		var zoomDelta = 0.1;
		var currentScale = 1;
		var currentAngle = 0;
		var canvasWidth = 600;
		var novosDadosTRBL;
		var novosDadosWH;
		var novosDadosW;
		var novosDadosH;
		var startX, startY, isDown = false;
		scope.flag=1;




		//set the width of the canvas
		setTimeout(function(){
			canvas.width = angular.element('#image-zoom').width();

			//append the image in canvas
			document.getElementById('carregar').click();
		},0);

		//method to reset the image to its original position
		angular.element('#carregar').click(function () {
			
			//check the image load
			angular.element('#image').on('load',resetImage())
			
			//if the image is not loaded 
			.on('error', function() { 
				//hide the canvas
				angular.element('#canvas').hide();
				
				//disable the buttons
				scope.noImage = true;
				
				//display the image not loaded text
				angular.element('#error-message').show();
				console.log("error loading image"); });
			
		});
		
		//method to reset the image
		function resetImage(){
				//load the  image in canvas if the image is loaded successfully
				image = document.getElementById('image');
				element = canvas.getContext("2d");
				angleInDegrees = 0;
				currentScale = 1;
				currentAngle = 0;
				if(scope.flag){
					scope.flag = 0;
					drawImage();
					element.translate(canvas.width / 2, canvas.height / 2);
				}
				else
					element.translate(0,0);
				setTimeout(function(){
					angular.element('#canvas').attr('data-girar', 0);
					drawImage();
				},1000);
				
		};

		//method to rotate the image in clockwise
		angular.element('#giraresq').click(function () {
			//set the rotate angle for clockwise rotation
			angleInDegrees = 5;
			currentAngle += angleInDegrees;
			drawImage();
		});


		//method to rotate the image in anti clockwise
		angular.element('#girardir').click(function () {
			//set the rotate angle for anti clockwise rotation
			angleInDegrees = -5;
			currentAngle += angleInDegrees;
			drawImage();
		});


		//method to zoom in the image
		angular.element('#zoomIn').click(function () {
			currentScale += zoomDelta;
			drawImage();
		});


		//method to zoom in and zoom out the image on mouse wheel scroll
		angular.element('#canvas').bind('mousewheel DOMMouseScroll', function(event){
			if (event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0) {
				// scroll up
				 currentScale += zoomDelta;
				drawImage();
			}
			else {
				// scroll down
				if(currentScale-zoomDelta - 0.1 > 0){
					currentScale -= zoomDelta;
					drawImage();
				 }
			}
		});

		//method to zoom out the image
		angular.element('#zoomOut').click(function () {
			currentScale -= zoomDelta;
			drawImage();
		});

		//method to get the mouse position when mouse button is down
		canvas.onmousedown = function (e) {
			var pos = getMousePos(canvas, e);
			startX = pos.x;
			startY = pos.y;
			isDown = true;
		}
		
		//method to update the image position in the canvas when it is dragged
		canvas.onmousemove = function (e) {
			if (isDown === true) {
				var pos = getMousePos(canvas, e);
				var x = pos.x;
				var y = pos.y;

				element.translate(x - startX, y - startY);
				drawImage();
				
				startX = x;
				startY = y;
			}
		}
		
		//method to detect the mouse up for image dragging
		window.onmouseup = function (e) {
			isDown = false;
		}
		
		//method to draw the image in the canvas from image element
		function drawImage() {
			clear();
			element.save();
			element.scale(currentScale, currentScale);
			element.rotate(currentAngle * Math.PI / 180);
			element.drawImage(image, -image.width / 2, -image.height / 2);
			element.restore();
		}
		
		//method to clear the canvas
		function clear() {
			element.clearRect(-2000,-2000,5000,5000);
		}
		
		//method to get the mouse position
		function getMousePos(canvas, evt) {
			var rect = canvas.getBoundingClientRect();
			return {
				x: evt.clientX - rect.left,
				y: evt.clientY - rect.top
			};
		}


	}
   }
 });
 
})();