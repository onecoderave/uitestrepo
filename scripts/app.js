var myModule = angular.module("testApp", [])

myModule.service('myService', function($http) {
  return {
    httpService: function(url) {
      return $http.get(url);  // this returns promise
    }
  };
}).controller('recipeCtrl', function($scope, myService) {
	$scope.recipes = [];
	
	if (sessionStorage.recipes){
		$scope.recipes = JSON.parse(sessionStorage.recipes);
	}
	else {	
		myService.httpService('scripts/data/recipes.json').then(
			function(response){
				sessionStorage.recipes = JSON.stringify(response.data.recipes);
				$scope.recipes = JSON.parse(sessionStorage.recipes);
			},
			function(e){
				var error = e;
				console.log('recipies data retrieval failed.')
			}
		);
	}
	
	
	$scope.getSelected = function(){
		var imgSrc,
			liTarget,
			selectedEl;
			
		function hasClass(el, cls) {
		  return el.className && new RegExp("(\\s|^)" + cls + "(\\s|$)").test(el.className);
		}
		
		function findLI(elem){
			var elemLI = elem.parentNode.tagName == "LI" ? elem.parentNode : elem.parentNode.parentNode;
			return elemLI;
		}
			
		liTarget = event.target ? event.target : event.srcElement;
		if (liTarget.tagName != "LI")
			liTarget = findLI(liTarget);
			
		if (hasClass(liTarget, "active"))
			return;
		
		selectedEl = document.getElementsByClassName("active");
		if (selectedEl.length != 0)
			selectedEl[0].classList.remove("active");
			
		liTarget.classList.add("active"); 
		
		imgSrc = liTarget.getAttribute("imgsrc");
		if (imgSrc != null)
			document.getElementById("topicImage").src="assets/images/" + imgSrc;
	}
	
	$scope.showAddRecipe = false;
	$scope.showAddRecipeWindow = function(){
		$scope.showAddRecipe = true;
		document.body.classList.add("removeoverflowy");
	}
	
	$scope.closeAddRecipe = function(){
		$scope.showAddRecipe = false;
		document.body.classList.remove("removeoverflowy");
	}
	
	function get_date(){
		var month = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"); 
		d=new Date();
		return month[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
	}
	
	$scope.addRecipe = function(){
		var title = $scope.addTitle.trim(),
			summary = $scope.addSummary.trim(),
			date;
		
		if (title == "" || summary == "")
			return;
			
		date = get_date();
		
		$scope.showAddRecipe = false;
		document.body.classList.remove("removeoverflowy");
		
		var newRecipe = {};
		newRecipe.title = title;
		newRecipe.summary = summary;
		newRecipe.date = date;
		newRecipe.image = "newimage.png";
		
		
		var rcps = JSON.parse(sessionStorage.recipes);
		rcps.unshift(newRecipe);
		var recipies = rcps.slice(0, 4);
		sessionStorage.recipes = JSON.stringify(recipies);
		$scope.recipes = JSON.parse(sessionStorage.recipes);
		
	}
	
});