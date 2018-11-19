



/*! xiaoyues-world - v0.1.0 - 2018-11-18
 * Copyright (c) 2018 Yunyun Li;
 * Licensed 
 */
'use strict';


// Declare app level module which depends on filters, and services
var xiaoyueApp = angular.module('xiaoyueApp', [
	'ngRoute',
    'firebase',
    'firebase.auth',
    'ngTouch',
    'ngSanitize',
    'ui.bootstrap',
    'LocalStorageModule',
    'public',
    'xiaoyueSecurity',
    'home',
    'category',
    'products',
    'xiaoyueServices',
    'xiaoyueFilters',
    'xiaoyueDirectives',
    'templates.app',
    'templates.common'
]);

xiaoyueApp.constant('API_SETTINGS', {
    ENDPOINT: 'data',
    VERSION: '1.0'
});

//point system every last 3 digits add 110
xiaoyueApp.constant('SITE_CONFIG', {
    imgBase: '/static/img',
    soundBase: '/static/sound'
});

xiaoyueApp.constant('MONGOLAB_CONFIG', {
  baseUrl: '/databases/',
  dbName: 'xiaoyueworld'
});

// your Firebase data URL goes here, no trailing slash
xiaoyueApp.constant('FBURL', "https://xyw.firebaseio.com");

// where to redirect users if they need to authenticate (see security.js)
xiaoyueApp.constant('loginRedirectPath', '/login');

xiaoyueApp.config(['$routeProvider', '$locationProvider', 'localStorageServiceProvider', 
    function ($routeProvider, $locationProvider, localStorageServiceProvider) {
      localStorageServiceProvider
        .setPrefix('xyw');

      $routeProvider.otherwise({redirectTo:'/login'});
      // $locationProvider.html5Mode(true);
      $locationProvider.hashPrefix('!');
}]);


xiaoyueApp.run(['$rootScope', 'siteLang', 'SITE_CONFIG', 'siteSetting', 'Auth', 'security', '$window',
    function($rootScope, siteLang, siteConfig, siteSetting, Auth, security, $window){
        $rootScope.lang = siteLang.getLang();
        $rootScope.CONFIG = siteConfig;
        $rootScope.isViewLoaded = false;
        $window._gaq.push(['_setCustomVar', 1, 'lang', $rootScope.lang, 2]);
        $window._gaq.push(['_setCustomVar', 2, 'isMobile', siteSetting.isMobile(), 2]);

        var oUser;
        Auth.$onAuth(function(user) {
            if(user){
                oUser = security.getUserById(user.uid);
                oUser.$loaded(function(data){
                    if(!oUser.name){
                        security.addUserByAuth(user);                           
                    }
                })
                oUser.$bindTo($rootScope, "oUser").then(function(cb){
                    $rootScope.unbind = cb;
                });                 
            }else{
                // console.log('no auth data');
                if($rootScope.unbind){
                    $rootScope.unbind();
                    oUser.$destroy();
                }
            }
        });        
        if(siteSetting.isMobile()){
            if(siteSetting.isPortrait()){
                $rootScope.isPortrait = true;
            }else{
                if(!siteSetting.isRightSize()){
                    $rootScope.isSmallSize = true;
                }
            }            
        }

        $rootScope.$on('$routeChangeStart', function(event, next, current) {
            $rootScope.isViewLoaded = false;
        });

        $rootScope.$on('$routeChangeSuccess', function(event, newUrl, oldUrl) {
            //loading screen
            $rootScope.isViewLoaded = true;
            //show option button for cards, will take out soon
            $rootScope.showOptions = false;

            //Add Title and track page view          
             if(newUrl.hasOwnProperty('$$route')){
                $rootScope.title = newUrl.$$route.title;
                $window._gaq.push(['_trackPageview', newUrl.$$route.originalPath]);
             }
        });

}]);


xiaoyueApp.controller('mainCtrl', ['$scope', 'siteLang', '$rootScope', '$location',
    function mainCtrl($scope, siteLang, $rootScope, $location){
        $rootScope.maxScreen = false;
        $scope.setLang = function (id){
            siteLang.setLang(id);
            $rootScope.lang = siteLang.getLang();
            // console.log($rootScope.lang);
         }
        $scope.setChoice= function(){
            $('div.cards').toggleClass('withOptions');
        }

        $scope.savePay = function(payment){
            switch(payment.product.type){
                case "gold":
                    $rootScope.$apply(function(){
                        $rootScope.oUser.gold = $rootScope.oUser.gold + payment.product.amount;
                        $rootScope.oUser.purchased = $rootScope.oUser.purchased || {};
                        $rootScope.oUser.purchased['gold'+Date.now().toString()] = payment||{'date':new Date().toJSON().slice(0,10)};
                    });                               
                    break;
                case "game":
                    $rootScope.$apply(function(){
                        $rootScope.oUser.purchased = $rootScope.oUser.purchased || {};
                        $rootScope.oUser.purchased[payment.product.detail.$id()] = payment||{'date':new Date().toJSON().slice(0,10)};;
                    }); 
                    break;                    
                default:
                    break;
            }
            $('#ifmPayment').hide();                        
        }

    }
]);


//stripe.com/docs, stripe config
// var handler = StripeCheckout.configure({
//     key: 'pk_test_RYhv1vMvgcSf9mVv0vKdy4rC',
//     image: '/static/img/logoch.png',
//     token: function(token) {
//       // Use the token to create the charge with a server-side script.
//       // You can access the token ID with `token.id`
//       // console.log(token);
//       var data = {'stripeToken': token.id, 'userEmail': 'yyunyun_lee@yahoo.com'};

//       $.post(
//         '/charge',
//         data,
//         function(msg){
//             console.log('success', msg);
//         }
//       );

//     }
// });

function closeIframe(iframeID, reloadPage){
    if(reloadPage){
        setTimeout(function(){
            window.location.reload();
        }, 1000);
        
    }else{
        $('#'+iframeID).hide();
    }
    document.cookie = "xyw-user=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
}
angular.module('category', ['resources.products', 'ngTouch'])

.config(['$routeProvider', function ($routeProvider) {
  	$routeProvider.
	  	when('/category/:categoryId', {
	    	templateUrl:'category/category-list.tpl.html',
	    	controller:'CategoryListCtrl',
	    	title: 'Category Summary',
	    	resolve:{
		      prodSum: ['Products', '$route', function(Products, $route){
		      	return Products.getSumByCategory($route.current.params.categoryId);
		      }]
	    	}
	 	}).
	  	when('/category/:categoryId/:itemId', {
	        templateUrl: 'category/category-detail.tpl.html',
	        controller:'CategoryDetailCtrl',
	        title: 'Category Detail',
	    	resolve:{
		      prod:['Products', '$route', function(Products, $route){
		        	return Products.getById($route.current.params.itemId);
		      }]
	    	}
	    });
}]);


angular.module('category').controller('CategoryListCtrl', ['$scope', 'prodSum', '$routeParams', '$location', '$rootScope',
	function($scope, prodSum, $routeParams, $location, $rootScope){
		$rootScope.title = $routeParams.categoryId+ ' Listing ';
		$scope.categoryId = $routeParams.categoryId; //category info, used on leftside menu

		if($routeParams.sub){
			$scope.sub = $routeParams.sub;
		}

		$scope.filteredList =prodSum;
		$scope.siteText = "XiaoYue's World::Chinese Learning Site";

		//button used in carousel
		$scope.go = function(slide){
		 	var url = '/category/'+slide.category+'/'+slide._id.$oid;
		 	$location.path(url);
		}

		//home page clik on left menu
		$scope.sectionDetail = function (id){
		 	if(["book", "game"].indexOf(id)== -1){
		 		var url = '/category/game';
		 		$location.search('sub', id);
		 	}else{
		 		var url = '/category/'+id;
		 	}
		 	
		 	$location.path(url);
		}

}]);

angular.module('category').controller('CategoryDetailCtrl', ['$scope', '$window', 'Products', 'prod', '$routeParams', '$http', '$rootScope', '$location', '$modal', 
	function($scope, $window, Products, prod, $routeParams, $http, $rootScope, $location, $modal){
		$rootScope.title = $routeParams.categoryId+ ' - ';
		$scope.categoryId = $routeParams.categoryId; //category info, used on leftside menu
		$scope.itemId = $routeParams.itemId; //item id

		if($rootScope.lang == 'zh'){
			$rootScope.title += prod.title_zh; 
		}else{
			$rootScope.title += prod.title_en; 
		}
		
		if($scope.categoryId == "game"){
			$scope.sub = prod.subCategory;
		}
			
		$scope.itemDetail = prod;

		 //close the item and go back to home page
		 $scope.closeItem = function(){
		 	var paths = $location.path().split('/');
		 	var url = '/'+paths[1]+'/'+paths[2];
		 	$location.path(url);
		 }

}]);


(function(angular){

	var app = angular.module('account', ["ngRoute", "xiaoyueSecurity"]);

	app.config(['$routeProvider', function($routeProvider){
		$routeProvider
			.whenAuthenticated('/:mapId/account', {
		  		templateUrl: 'home/account/account.tpl.html',
		  		controller:'accountCtrl',
		  		title: 'Account'
		  	});
	}]);

	app.controller("accountCtrl", ["$rootScope", "$scope", "$window", "FBURL", "$location",'$routeParams',
		function($rootScope, $scope, $window, FBURL, $location, $routeParams){
			$scope.close = function(){
				$location.url('/map/'+$routeParams.mapId);
			};
			// console.log($rootScope.oUser);
			$scope.password = {'show':false, 'msg': null};
			$scope.changePassword = function(){
				// $rootScope.isViewLoaded = false;
				$scope.password.show = false;
				$scope.password.msg = null;
				var ref = new $window.Firebase(FBURL);
				ref.changePassword({
				  email: $rootScope.oUser.email,
				  oldPassword: $scope.password.old,
				  newPassword: $scope.password.new
				}, function(error) {			  			  
				  if (error) {
				    switch (error.code) {
				      case "INVALID_PASSWORD":
				        $scope.password.msg = "The specified user account password is incorrect.";
				        break;
				      case "INVALID_USER":
				       	$scope.password.msg = "The specified user account does not exist.";
				        break;
				      default:
				        $scope.password.msg = "Error changing password:";
				    }
				  }else{
					$scope.password.msg = "User password changed successfully!";
				  }
				   // $rootScope.isViewLoaded = true;
				   // $scope.password.show = false;
				   $scope.password.old = $scope.password.new = null;
				});
			}			
	}]);

})(angular);
(function(angular){

	var app = angular.module('avatar', ["ngRoute", "resources.avatars"]);

	app.config(['$routeProvider', function($routeProvider){
		$routeProvider
			.whenAuthenticated('/:mapId/avatar', {
		  		templateUrl: 'home/avatar/avatar.tpl.html',
		  		controller:'AvatarCtrl',
		  		title: 'Avatar List',
		  		resolve:{
		  			avatars: ['Avatars', function(Avatars){
		  				return Avatars.getFree();
		  		}]
		  		}
		  	});
	}]);

	app.controller("AvatarCtrl", ["$rootScope", "$scope", "avatars", "$location", '$routeParams',
		function($rootScope, $scope, avatars, $location, $routeParams){
			if (!$rootScope.oUser.avatars){
				// $rootScope.oUser.avatars = avatars;
				$rootScope.oUser.avatars = {};
				angular.forEach(avatars, function(obj, key){
					$rootScope.oUser.avatars[obj.name] = obj;
				})
			}

			$scope.costumeID = 0;
			if($rootScope.oUser.avatar){
				angular.forEach($rootScope.oUser.avatars, function(obj, key){
					if(key == $rootScope.oUser.avatar.name){
						$scope.activeID = key;
						angular.forEach(obj.costumes, function(v,k){
							if(v== $rootScope.oUser.avatar.costume){
								$scope.costumeID = k;
							}
						})
					}
				});

			}else{
				$scope.activeID = avatars[0].name; //default select the first
				setAvatar($scope.activeID);
			}
			
			$scope.selAvatar = function(idx){
				$scope.activeID = idx;
				$scope.costumeID = 0;
				setAvatar(idx);
			};

			$scope.selCostume = function(idx){
				$rootScope.oUser.avatar.costume = $rootScope.oUser.avatars[$scope.activeID].costumes[idx];
				$scope.costumeID = idx;
			}

			$scope.close = function(){
				$location.url('/map/'+$routeParams.mapId);
			};

			function setAvatar(idx){
				$rootScope.oUser.avatar={
					name: $rootScope.oUser.avatars[idx].name,
					life: $rootScope.oUser.avatars[idx].life,
					costume: $rootScope.oUser.avatars[idx].costumes[$scope.costumeID],
					cards: $rootScope.oUser.avatars[idx].cards || {}
				}				
			}
	}]);

})(angular);
(function(angular){

	var app = angular.module('chest', ["ngRoute", "resources.goods", "resources.products"]);

	app.config(['$routeProvider', function($routeProvider){
		$routeProvider
			.whenAuthenticated('/:mapId/chest', {
		  		templateUrl: 'home/chest/chest.tpl.html',
		  		controller:'ChestCtrl',
		  		title: 'My Chest',
		  		resolve:{
			        goods:['Goods', function(Goods){
			        	return Goods.all();
			        }],
			        books: ['Products', function(Products){
			        	return Products.getSumByCategory('book');
			        }],
			        avatars: ['Avatars', function(Avatars){
		  				return Avatars.getFree();
		  			}]			  			
		  		}
		  	});

		$routeProvider
			.whenAuthenticated('/:mapId/:lessonId/chest', {
		  		templateUrl: 'home/chest/chest.tpl.html',
		  		controller:'ChestCtrl',
		  		title: 'My Chest',
		  		resolve:{
			        goods:['Goods', function(Goods){
			        	return Goods.all();
			        }],
			        books: ['Products', function(Products){
			        	return Products.getSumByCategory('book');
			        }]		  			
		  		}
		  	});
	}]);

	app.controller("ChestCtrl", ["$rootScope", "$scope", "goods", "books", "avatars","$location",'$routeParams', '$modal',
		function($rootScope, $scope, goods, books,  avatars, $location, $routeParams, $modal){
			var costumes = window._.filter(goods, function(item){return item.type == 'costume'});
			$scope.cards = window._.filter(goods, function(item){return item.type == 'card'});
			if(!$rootScope.oUser.avatars){
				$rootScope.oUser.avatars = {};
				angular.forEach(avatars, function(obj, key){
					$rootScope.oUser.avatars[obj.name] = obj;
				});
			}
			//calculate books that is bought or not
			$scope.books = books;
			if(!!$rootScope.oUser.books){
				var ownedBooks = Object.keys($rootScope.oUser.books);
				angular.forEach($scope.books, function(obj, key){
					var id = obj.$id();
					obj.owned = (ownedBooks.indexOf(id) > -1) ? true : false;
				})
			};

			//calculate costume not bought
			var ownedCostumes = [];
			angular.forEach($rootScope.oUser.avatars, function(obj, key){
				ownedCostumes = ownedCostumes.concat(obj.costumes);
			});	
			$scope.costumes =[];	
			angular.forEach(costumes, function(obj, key){
				if(ownedCostumes.indexOf(obj.costume) == -1){
					$scope.costumes.push(obj);
				}
			});
			$scope.close = function(){
				if($routeParams.lessonId){
					$location.url('/start/'+$routeParams.mapId+'/'+$routeParams.lessonId);
				}else{
					$location.url('/map/'+$routeParams.mapId);
				}
				
			};

			$scope.read = function(id){
				$location.url('/products/book/'+$routeParams.mapId+'/'+id);
			};

			$scope.buy = function(type, id, amount){
				var modalInstance = $modal.open({
					templateUrl: 'xywBuy.html',
					controller: 'buyCtrl',
					resolve:{
						item: function(){
							return {'type': type, 'id':id, 'amount': amount};
						}
					}
				});

				//after purchase recalculate the list
				modalInstance.result.then(function(oItemBought){
					// console.log(oItemBought);
					switch(oItemBought.type){
						case 'book':
							$scope.books = angular.forEach($scope.books, function(obj, key){
								if(obj.$id() == oItemBought.id){
									obj.owned = true;
								}
							});
							break;
						case 'costume':
							$scope.costumes = window._.reject($scope.costumes, function(obj){return obj.$id() == oItemBought.id});
							$scope.$broadcast('updateCostumes', $scope.costumes);
							break;
						case 'card':
							break;
					}
				})
			};

			$scope.buyGold = function(dollar, gold){
				var childScope = document.getElementById("ifmPayment").contentWindow.angular.element(".paymentPage").scope();
				childScope.$apply(function(){
						childScope.curUser = $rootScope.oUser;
						childScope.amount = dollar;
						childScope.product = {'type': 'gold', 'amount': gold};
				});
				$('#ifmPayment').show();	
			}
	}]);

	app.controller("buyCtrl", ['$scope', '$rootScope', 'item', '$modalInstance', 
		function($scope, $rootScope, item, $modalInstance){
		$scope.item = item;
		$scope.bAbleToBuy = ($rootScope.oUser.gold >= item.amount) ? true : false;

		$scope.buyItem = function(){
			$rootScope.oUser.gold -= item.amount;
			var oResult = {'type': item.type};
			switch(item.type){
				case "book":
					$rootScope.oUser.books = $rootScope.oUser.books || {};
					$rootScope.oUser.books[item.id] = true;
					oResult.id = item.id;
					break;
				case "costume":
					var sKey = item.id.name;
					var sCostume = item.id.costume;
					// console.log(item);
					angular.forEach($rootScope.oUser.avatars, function(obj,key){
						if(key == sKey){
							obj.costumes.push(sCostume);							
							oResult.id = item.id.$id();												
						}
					})
					break;
				case "card":
					var sKey = item.id.key;
					var sAvatar = $rootScope.oUser.avatar.name;
					$rootScope.oUser.avatar.cards = $rootScope.oUser.avatar.cards || {};
					$rootScope.oUser.avatars[sAvatar].cards = $rootScope.oUser.avatars[sAvatar].cards || {};
					$rootScope.oUser.avatar.cards[sKey] = ($rootScope.oUser.avatar.cards[sKey]||0) +1;
					$rootScope.oUser.avatars[sAvatar].cards[sKey] = $rootScope.oUser.avatar.cards[sKey];
					oResult.id = item.id.$id();
			}
			$modalInstance.close(oResult);
		};

		$scope.cancel = function(){
			$modalInstance.dismiss('cancel');
		};

	}])

})(angular);
angular.module('home', ['resources.maps', 'xiaoyueSecurity', 'map', 'quest', 'avatar', 'chest', 'account'])

.config(['$routeProvider', function($routeProvider){

  $routeProvider
    .whenAuthenticated('/main', {
      templateUrl:'home/home.tpl.html',
      controller:'homeMainCtrl',
      title: 'Available Games',
      resolve:{
        games: ['Maps', function(Maps){
          return Maps.getList();
        }]
      }
  });


}]);

angular.module('home').controller('homeMainCtrl', ['$scope', '$rootScope', 'security', '$modal', 'games',
  function($scope, $rootScope, security, $modal, games){
    $scope.games = games;
    $scope.logout = function(){
      security.logout();
    };

    $scope.gameDetail = function(game){
      var modalInstance = $modal.open({
        templateUrl: 'gameDetail.html',
        controller: 'gameDetailCtrl', //need quotation mark to reference the controller
        size: 'lg',
        windowClass: 'gameModal',
        resolve:{
          game: function(){
            return game;
          }
        }
      });
    }
}])


angular.module('home').controller('gameDetailCtrl', ['$scope', '$rootScope', '$location', '$modalInstance', 'game', '$window',
  function($scope, $rootScope, $location, $modalInstance, game, $window){
    $scope.game = game;
    $scope.game['authorized'] = false;
    if(game.price == 0){
      $scope.game['authorized'] = true;
    }else if($rootScope.oUser.purchased && $rootScope.oUser.purchased[game.$id()]){
      $scope.game['authorized'] = true;
    };

    $scope.close = function(){
      $modalInstance.dismiss('cancel');
    };

    $scope.play = function(){
      $modalInstance.close(game.map);
      $window._gaq.push( ['_trackEvent', game.map, 'open', $rootScope.oUser.name] );
      $location.url('/map/'+game.$id());
    };

    $scope.buy = function(item){
        $modalInstance.dismiss('cancel');
        var childScope = document.getElementById("ifmPayment").contentWindow.angular.element(".paymentPage").scope();
        childScope.$apply(function(){
            childScope.curUser = $rootScope.oUser;
            childScope.amount = item.price.replace('$','');
            childScope.product = {'type': 'game', 'detail': item};
        });
        $('#ifmPayment').show();  
    };

}]);





(function(angular){

	var app = angular.module('map', ["ngRoute", "resources.maps"]);

	app.config(['$routeProvider', function($routeProvider){
	  $routeProvider
	    .whenAuthenticated('/map/:mapId', {
	      templateUrl:'home/map/map.tpl.html',
	      title: 'Map',
	      controller:'mapCtrl',
	      resolve:{
	        map: ['Maps', '$route', function(Maps, $route){
	          return Maps.getById($route.current.params.mapId);     
	        }]
	      }
	    });
	}]);

	app.controller('mapCtrl', ['$scope', '$rootScope', 'map', '$modal', '$location', '$window', 'security',
	  function($scope, $rootScope, map, $modal, $location, $window, security){ 
	  // console.log(map);
	  // console.log($rootScope.oUser);

	  $rootScope.oUser.avatar = $rootScope.oUser.avatar || {'costume': 'amber', 'life': 3, 'name': 'Amber'};
	  
	  if(!$rootScope.oUser.level || $rootScope.oUser.level ==0){
	  	openTipWin();
	  }  

	  $scope.map = map;
	  $scope.routes = map.routes;
	  // $scope.blocks = map.blocks;
	  // console.log(map.routes); 
	  var newLesson = security.getNewLesson(map.$id());
	  var LessonId = map.routes[newLesson-1].lessonId;

	  if(!$rootScope.oUser.maps){
	     $rootScope.oUser.maps = {};
	     $rootScope.oUser.maps[map.$id()] = {};
	  };
	  
	  $rootScope.oUser.gold = $rootScope.oUser.gold || 0;
	  $rootScope.oUser.maps[map.$id()] = $rootScope.oUser.maps[map.$id()] || {};
	  $rootScope.oUser.maps[map.$id()][LessonId] = $rootScope.oUser.maps[map.$id()][LessonId] || {gold:0};
	  angular.forEach($scope.routes, function(value,key){
	    value.active = (key < newLesson) ? 'true' : 'false';
	  });

	  //finish the map gain extra 1000 gold 
	  if(newLesson == 10 && $rootScope.oUser.maps[map.$id()][LessonId].gold >=100){
	  	//gain a new level	  	
	  	if(typeof $rootScope.oUser.maps[map.$id()].level == 'undefined'){
	  		//need some kind of animation to notify
	  		$rootScope.oUser.maps[map.$id()].level = true;
	  		$rootScope.oUser.level++;
	  		$rootScope.oUser.gold += 1000;
	  	}
	  }
	  $scope.close = function(){
	    //anything need to be done or saved
	    $window._gaq.push( ['_trackEvent', map.key, 'close', $rootScope.oUser.name] );
	    $location.url('/main');
	  };

	  $scope.openTip = function(){
	  	openTipWin();
	  };

	  function openTipWin(){
	     var modalInstance = $modal.open({
	            templateUrl: 'xywTips.html',
	            controller: 'tipsCtrl',
	            windowClass: 'tipsHelp',
	            scope: $scope, //import step not to miss
	            size: 'sm',
	            backdrop: 'static'
	       }); 
	  };

	}]);


	//modal controller for game popup
	app.controller('playWinCtrl', ['$scope', '$rootScope', '$modalInstance', 'icon', '$location', 'detail', 'route', '$routeParams',
	  function ($scope, $rootScope, $modalInstance, icon, $location, detail, route, $routeParams){
	    var id, detail = detail[0];
	    $scope.route = route;
	    $scope.getIdx = function(n){
	    	var a = n.toString().split('');
	    	return a[a.length-1];
	    }
	    $scope.icon = icon;
	    $scope.use = function(type){
	      if(type == 'play'){
	        //start quest page
	        $modalInstance.close();
	        $location.url('/story/'+$routeParams.mapId+'/'+detail.$id());
	      }else{
	        if(detail[type]){
	          id = detail[type][0];
	        }else{
	          id = detail['play'][1].id; //temporary use for now
	        }
	        $modalInstance.close(id);
	        // console.log($routeParams.mapId,route.lessonId,id);
	        $location.url('/products/game/'+$routeParams.mapId+'/'+route.lessonId+'/'+id);
	      }
	    }
	    $scope.isComplete = $rootScope.oUser.maps[$routeParams.mapId][route.lessonId][detail['play'][0].id || detail['play'][0]] ? true : false;
	}]);

	//modal controller for tips popup
	app.controller('tipsCtrl', ['$scope', '$modalInstance', '$rootScope',
	  function ($scope, $modalInstance, $rootScope){
	    $scope.tips = {'active': 1};

	    $('.tipsHelp .modal-dialog').attr('id', 'mtip1');

	    $scope.close = function () {
	      //Finish reading tips, automatically add level up  
	      if(!$rootScope.oUser.level || $rootScope.oUser.level ==0){
	      	$rootScope.oUser.level = 1;
	      }	      
	      $modalInstance.close('done');
	    };

	    $scope.prev = function(){
	       $('.tipsHelp .modal-dialog').attr('id', 'mtip'+(--$scope.tips.active));
	    };

	    $scope.next = function(){
	      $('.tipsHelp .modal-dialog').attr('id', 'mtip'+(++$scope.tips.active));
	    };

	}]); 

	app.directive('xywArrow', ['Lessons',  '$modal', function(Lessons, $modal){
	  return{
	    restrict: 'A',
	    replace: false,
	    templateUrl: 'home/map/arrow.tpl.html',
	    link: function(scope,element,attr){      
	      scope.idx = attr.index;
	      element.bind("click", function(e){
	        $(element).addClass('current');
	        // scope.$emit('openGame', scope.route);
	        if(scope.route.active=='true'){
	          var modalInstance = $modal.open({
	                templateUrl: 'xywPlayWin.html',
	                controller: 'playWinCtrl',
	                size: 'lg',
	                windowClass: 'lessonWin',
	                resolve:{
	                    detail: function (){
	                      return Lessons.getLessonByKey(scope.route.lesson);
	                    },
	                    route: function(){
	                      return scope.route;
	                    },
	                    icon: function(){
	                    	return 'games/'+scope.map.key+'/'+scope.idx+'.png';
	                    }
	                }
	          });          
	        }
	      })
	    }
	  }
	}]);
})(angular);
(function(angular){

	var app = angular.module('quest', ["ngRoute", "resources.goods", "resources.lessons"]);

	app.config(['$routeProvider', function($routeProvider){

	  $routeProvider
	    .whenAuthenticated('/story/:mapId/:lessonId', {
	      templateUrl:'home/quest/quest-story.tpl.html',
	      controller: 'storyCtrl',
	      title: 'Stories',
	      resolve:{
	        lessons: ['Lessons', '$route', function(Lessons, $route){
	          return Lessons.getById($route.current.params.lessonId);
	        }]
	      }
	    });

	  $routeProvider
	    .whenAuthenticated('/start/:mapId/:lessonId', {
	      templateUrl:'home/quest/quest-start.tpl.html',
	      controller: 'startCtrl',
	      title: 'Start Game',
	      resolve:{
	        lessons: ['Lessons', '$route', function(Lessons, $route){
	          return Lessons.getById($route.current.params.lessonId);
	        }],
	        cards: ['Goods', function(Goods){
	        	return Goods.getCards();
	        }]
	      }
	    });

	}]);

	app.controller('storyCtrl', ['$scope', 'lessons', '$location', '$routeParams', 
	  function($scope, lessons, $location, $routeParams){
	  $scope.lesson = lessons;
	  $scope.idx = 0;
	  $scope.showQuest = (!!lessons.stories) ? false : true;
	  $scope.next = function(){
	    if($scope.idx+1 < lessons.stories.dialogues.length){
	      $scope.idx++;
	    }else{
	      $scope.showQuest = true;
	    }
	  }
	  $scope.go = function(act){
	    if(act=='learn'){
	      $location.url('/products/game/'+$routeParams.mapId+'/'+lessons.$id()+'/'+lessons.learn[0]);
	    }else{
	      $location.url('/start/'+$routeParams.mapId+'/'+lessons.$id());    
	    }
	  }
	  $scope.close = function(){
	    $location.url('/map/'+$routeParams.mapId);
	  }
	}]);

	app.controller('startCtrl', ['$scope', 'lessons', '$location', '$routeParams', 'cards','$modal',
	  function($scope, lessons, $location, $routeParams, cards, $modal){
	  $scope.lesson = lessons;
	  $scope.cards = {};
	  angular.forEach(cards, function(obj, key){
	  	$scope.cards[obj.key] = obj;
	  })
	  $scope.start = function(){
	    //temp for current structure
	    if(typeof lessons.play[0] == 'object'){
	      $location.url('/products/game/'+$routeParams.mapId+'/'+$routeParams.lessonId+'/'+lessons.play[0].id);
	    }else{
	      $location.url('/products/game/'+$routeParams.mapId+'/'+$routeParams.lessonId+'/'+lessons.play[0]);
	    }    
	  };

	  $scope.addLife = function(){
	  	var modalInstance = $modal.open({
	  		templateUrl: 'xywLife.html',
	  		controller: 'lifeCtrl'
	  	})
	  };

	  $scope.close = function(){
	    $location.url('/map/'+$routeParams.mapId);
	  };

	  $scope.buyCard = function(){
	  	$location.url('/'+$routeParams.mapId+'/'+$routeParams.lessonId+'/chest');
	  }
	  
	}]);

	app.controller('lifeCtrl', ['$scope', '$rootScope', '$modalInstance', function($scope, $rootScope, $modalInstance){
		$scope.bEnable = ($rootScope.oUser.gold >= 100) ? true : false;
		$scope.extraLife = function(){
			$rootScope.oUser.gold -= 100;
			$rootScope.oUser.avatar.life++;
			$rootScope.oUser.avatars[$rootScope.oUser.avatar.name].life++;
			$modalInstance.close();
		}
		$scope.cancel = function(){
			$modalInstance.dismiss('cancel');
		}
	}])

})(angular);
angular.module('books', ['ngTouch'])
.constant('audioDefaults', {
	currentTrack: 0,
	ended: undefined,
	playing: false,
	volume: 1
})

.directive('xywBook', ['$swipe', '$window', '$document', '$rootScope', function($swipe, $window, $document, $rootScope){
	// in container % how much we need to drag to trigger the slide change
	var moveTreshold = 0.05,
	    // used to compute the sliding speed
        timeConstant = 75, 
        // in container % how much we need to drag to trigger the slide change
        moveTreshold = 0.05,
        // in absolute pixels, at which distance the slide stick to the edge on release
        rubberTreshold = 3;

	var requestAnimationFrame = $window.requestAnimationFrame || $window.webkitRequestAnimationFrame || $window.mozRequestAnimationFrame;
	
	//https://github.com/darius/requestAnimationFrame/blob/master/requestAnimationFrame.js
	if(requestAnimationFrame == null){
        var lastTime = 0;
        requestAnimationFrame = function(callback) {
            var now = Date.now();
            var nextTime = Math.max(lastTime + 16, now);
            return setTimeout(function() { callback(lastTime = nextTime); },
                              nextTime - now);
        };
	}

	return{
		restrict: 'A',
		transclude: true,
		scope: {
			items: '=',
			product: '='
		},
		templateUrl: 'products/books/book.tpl.html',
		controller: ['$scope', '$element', '$attrs', '$rootScope', 'siteChar', 
		function($scope, $element, $attrs, $rootScope, siteChar){
			$element.addClass("book-wrapper");
			$scope.CONFIG = $rootScope.CONFIG;
			$scope.index = 0;
			// Add pingying to each character
			siteChar.getPingYin().then(function(response){
				var chars = response.data;
				angular.forEach($scope.items, function(value, key){
					if(value.id != 0){
						var tmpArray = value.text.split('');
						var tmpString = '';
						angular.forEach(tmpArray, function(value, key){
							if([', ', ' ', ','].indexOf(tmpArray[key]) == -1){
								var py = chars[value] ? chars[value] : '';
								var cssClass ='';
								if(py.length > 4){
									cssClass = 'long';
								}
								if(['？', '。', '，', '?', '：'].indexOf(value)> -1){
									cssClass = 'sign'
								} 
								tmpArray[key]= '<span class="'+cssClass+'">'+ value +'<i>'+ py +'</i></span>';
							}
						})				
						this[key].text = tmpArray.join('');
					}
				}, $scope.items);
			})
			$scope.textOff = false;
			var startX, 
				pressed, 
				amplitude, 
				timestamp, 
				destination,
				offset = 0,
				isIndexBound = false,
				swipeMoved = false;
			var is3dAvailable = detect3dSupport();
			var pageWrapper = $element.find('.page-wrapper');
			var transformProperty = 'transform';
			var containerWidth = Math.floor($element[0].getBoundingClientRect().width);

		    ['webkit', 'Moz', 'O', 'ms'].every(function (prefix) {
                var e = prefix + 'Transform';
                if (typeof document.body.style[e] !== 'undefined') {
                    transformProperty = e;
                    return false;
                }
                return true;
            });

   //          angular.element($window).bind('orientationchange', function () {
   //          	alert('xxx');
   //          	updateContainerWidth();
			// });

		    updateContainerWidth();

		    $scope.$watch('index', function(newValue){
		    	// console.log('new value is:'+newValue);
		    	$rootScope.$broadcast('indexChange');
		    });

		    $swipe.bind(pageWrapper, {
		    	start: swipeStart, 
		    	move: swipeMove, 
		    	end: swipeEnd, 
		    	cancel:function(event){
		    		swipeEnd({}, event);
		    	}
		    });

		    function swipeStart(coords, event){
		    	// console.log('swipe start');
		    	$document.bind('mouseup', documentMouseUpEvent);
		    	pressed = true;
		    	startX = coords.x;

                amplitude = 0;
                timestamp = Date.now();	

		    	return false;
		    }

		    function swipeMove(coords, event){		    	
		    	var x, delta;

		    	if(pressed){
		    		x = coords.x;
		    		delta = startX - x;
		    		if(delta > 2 || delta < -2){
		    			swipeMoved = true;
		    			startX = x;
						// console.log('swipe move delta, offset', delta, offset);
		    			/* We are using raf.js, a requestAnimationFrame polyfill, so this will work on IE9 */
		    			requestAnimationFrame(function(){
		    				scroll(capPosition(offset + delta));
		    			});
		    		}
		    	}
		    	return false;
		    }

		    function swipeEnd(coords, event, forceAnimation){
		    	// console.log('swipe End');
                // Prevent clicks on buttons inside slider to trigger "swipeEnd" event on touchend/mouseup
                if(event && !swipeMoved) {
                    return;
                }

                $document.unbind('mouseup', documentMouseUpEvent);
                pressed = false;
                swipeMoved = false;

                destination = offset;

                var minMove = getAbsMoveTreshold(),
                	currentOffset = ($scope.index * containerWidth),
                	absMove = currentOffset - destination,
                	slidesMove = -Math[absMove>=0 ? 'ceil' : 'floor'](absMove/containerWidth),
                	shouldMove = Math.abs(absMove) > minMove;
                // console.log(minMove, currentOffset, absMove, slidesMove, shouldMove, 'minMove, currentOffset, absMove, slidesMove, shouldMove');

                if((slidesMove + $scope.index) >= $scope.items.length){
                	slidesMove = $scope.items.length -1 - $scope.index;
                }

                if((slidesMove + $scope.index) < 0){
                	slidesMove = -$scope.index;
                }

                var moveOffset = shouldMove ? slidesMove : 0;

                destination = (moveOffset + $scope.index) * containerWidth;
                amplitude = destination - offset;
                timestamp = Date.now();

                // console.log(moveOffset, $scope.index, containerWidth, destination, amplitude);
                requestAnimationFrame(autoScroll);

		    	return false;
		    }

		    function capPosition(x){
		    	//limit position if start or end of slides
		    	var position = x;
		    	if($scope.index == 0){
		    		position =  Math.max(-getAbsMoveTreshold(), position);
		    	}else if($scope.index == $scope.items.length-1){
		    		position = Math.min((($scope.items.length-1)*containerWidth + getAbsMoveTreshold()), position);
		    	}
		    	return position;
		    }

            function getAbsMoveTreshold() {
                // return min pixels required to move a slide
                return moveTreshold * containerWidth;
            }

		    function documentMouseUpEvent(event){
		    	swipeMoved = true;
		    	swipeEnd({
		    		x: event.clientX,
		    		y: event.clientY
		    	}, event);
		    }

		    function updateContainerWidth(){
		    	$element.css('width', '100%');
		    	$element.css('width', containerWidth + 'px');
		    }

		    function detect3dSupport(){
                var el = document.createElement('p'),
                has3d,
                transforms = {
                    'webkitTransform':'-webkit-transform',
                    'OTransform':'-o-transform',
                    'msTransform':'-ms-transform',
                    'MozTransform':'-moz-transform',
                    'transform':'transform'
                };
                // Add it to the body to get the computed style
                document.body.insertBefore(el, null);
                for(var t in transforms){
                    if( el.style[t] !== undefined ){
                        el.style[t] = 'translate3d(1px,1px,1px)';
                        has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
                    }
                }
                document.body.removeChild(el);
                return (has3d !== undefined && has3d.length > 0 && has3d !== "none");
            }

			function scroll(x){
				// console.log('x', x);
				if(isNaN(x)){
					x = containerWidth * $scope.index; 
				}

				offset = x;
				var move = -Math.round(offset);
				// console.log('move', move);
				if(!is3dAvailable){
					pageWrapper[0].style[transformProperty] = 'translate(' + move + 'px, 0)';
				}else{
					pageWrapper[0].style[transformProperty] = 'translate3d(' + move + 'px, 0, 0)';
				}
			}

			function autoScroll(){
				//scroll smoothly to destination until we reach it
				//using requestAnimationFrame
				var elapsed, delta;

				if(amplitude){
					elapsed = Date.now() - timestamp;
					delta = amplitude * Math.exp(-elapsed / timeConstant);
			        if (delta > rubberTreshold || delta < -rubberTreshold) {
                        scroll(destination - delta);
                        /* We are using raf.js, a requestAnimationFrame polyfill, so
                        this will work on IE9 */
                        requestAnimationFrame(autoScroll);
                    } else {
                        goToSlide(destination / containerWidth);
                    }
				}
			}

			function goToSlide(i, animate){
				if(isNaN(i)){
					i = $scope.index;
				}
				$scope.index = capIndex(i);
		        // if outside of angular scope, trigger angular digest cycle
                // use local digest only for perfs if no index bound
                //to update the $scope.index value
                if ($rootScope.$$phase!=='$apply' && $rootScope.$$phase!=='$digest') { //$$phase is a flag to check if variable is digested
                    if (isIndexBound) {
                        $scope.$apply(); //apply will evaluate passed function and run $rootScope.$.digest()
                    } else {
                        $scope.$digest(); //digest only fire watchers on current scode
                    }
                }
				scroll();
			}

	        function capIndex(idx) {
                // ensure given index it inside bounds
                return (idx >= $scope.items.length) ? $scope.items.length: (idx <= 0) ? 0 : idx;
            }

			this.noPrev = function(){
				return ($scope.index == 0);
			}

			this.noNext = function(){
				return ($scope.index == $scope.items.length-1); 
			}

			this.selectPage = function(p){
				// console.log('selected: '+p);
				$scope.index = p;
				scroll();
			}

			this.getIndex = function(){
				return $scope.index; 
			}

			this.toggleText = function(){
				$scope.textOff = !$scope.textOff;
				return $scope.textOff;
			}

			$scope.detectTap = function(){
				$element.find('.book-footer').toggleClass('tapped');
			}

			var el = this;
			$scope.goToPage = function(p){
				el.selectPage(p);
			}

		}]
	}
}])

.directive('xywBookControl', ['$rootScope', '$timeout', function($rootScope, $timeout){
	return{
		restrict: 'A',
		require: '^xywBook',
		scope: true,
		templateUrl: 'products/books/book-page.tpl.html',
		link:function(scope,element,attrs, xywBookCtrl){

			scope.CONFIG = $rootScope.CONFIG;
			scope.index = xywBookCtrl.getIndex();
			var maxCount = 5;
			scope.count = 0;
			// console.log(scope.index, 'here for index');

			//update the pagination
			$timeout(function(){
				updatePagination();
			}, 500);

			scope.$on('indexChange', function(){
		    	scope.index = xywBookCtrl.getIndex();
		    	$('li[rel="pagelink"]', element).removeClass('active');
				$('li[rel="pagelink"]:eq('+scope.index+')', element).addClass('active');
		    	// console.log('got index changed', scope.index);  
		    	//emit counts for points calculation
		    	// if(scope.index == 0 && scope.count == 0){
		    	// 	//first time do nothing
		    	// }else{
		    	// 	// scope.$emit('addCount', ++scope.count);
		    	// }		    	
		    	updatePagination();
		    });

			//only show no more than maxCount(5) items at a time
			function updatePagination(){
				scope.index = parseInt(scope.index);
				var start = (scope.index - maxCount + 1) <0 ? 0 : (scope.index - maxCount +2);
	    		var current = scope.index > (maxCount -2) ? scope.index + 1 : (maxCount -1);
	    		if(current == scope.items.length){
	    			start = current - maxCount;
	    		}
		    	$('li[rel="pagelink"]', element).show();
	    		$('li[rel="pagelink"]:gt('+current+')', element).hide();		    		
	    		$('li[rel="pagelink"]:lt('+start+')', element).hide();

	    		if(scope.index == 0){
	    			$(element).parent().hide();
	    		}else{
	    			$(element).parent().show();
	    		}
			}

			scope.isActive = function(p){
				return (p.id == (scope.index));				
			};

			scope.selectNext = function(){
				if(scope.index < scope.items.length-1){
					scope.index ++;
					xywBookCtrl.selectPage(scope.index);
				}
			};

			scope.selectPrev = function(){
				if(scope.index > 0){
					scope.index --;
					xywBookCtrl.selectPage(scope.index);
				}
			};

			scope.selectPage = function(p){
				scope.index = p;
				xywBookCtrl.selectPage(scope.index);
			};

			scope.noPrev = function(){
				return xywBookCtrl.noPrev();
			}

			scope.noNext = function(){
				return xywBookCtrl.noNext();
			}

		}
	}
}])

.directive('xywBookSubtitle', [function(){
	return{
		restrict: 'A',
		require: '^xywBook',
		template: '<ul class="list-inline"><li><button class="btn-borderless"><span class="fa-stack fa-lg" ng-click="toggleText()"><i class="fa fa-stack-exchange fa-2x"></i><i class="fa fa-ban fa-stack-2x text-danger" ng-show="textOff"></i></span></button></li></ul>',
		link: function(scope, element, attrs, xywBookCtrl){
			
			scope.toggleText = function(){
				scope.textOff = xywBookCtrl.toggleText();
			}
		}
	}
}])

.directive('xywBookAudio', ['$rootScope', '$timeout', 'audioDefaults', '$document',
	function($rootScope, $timeout, audioDefaults, $document){

		var playerMethods ={
			load: function(mediaElement, autoplay){
				if(typeof mediaElement === 'boolean'){
					autoplay = mediaElement;
					mediaElement = null;
				}else if(typeof mediaElement === 'object'){
					this.$clearSourceList();
					this.$addSourceList(mediaElement);
				}
				this.$domEl.load();
				this.ended = undefined;
				if(autoplay){
					// console.log('begin play');
					if(Function.prototype.bind){
						this.$element.one('canplay', this.play.bind(this));
					}
				}
			},
		    reset: function (autoplay) {
		        angular.extend(this, audioDefaults);
		        this.$clearSourceList();
		        this.load(this.$playlist, autoplay);
		    },
			play: function(index){

				if (this.$playlist.length > index) {
					this.currentTrack = index+1;
					return this.load(this.$playlist[index], true);
				}

				if(this.ended){
					this.load(true);
				}else{
					this.$domEl.play();
				}
			},
			playPause: function(index){
		        // method overloading
		        // console.log('playpause');
		        // console.log(this.items, 'items');
		        if (typeof index === 'number') {
		         	this.play(index);
		        } else if(this.playing){
		        	this.pause();
		        }else{
		        	this.play();
		        }

			},
			pause: function(){
				this.$domEl.pause();
			},
			stop: function(){
				this.reset();
			},
			toggleMute: function(){
				this.muted = this.$domEl.muted = !this.$domEl.muted;
			},
			setVolume: function(value){
				// console.log('set volume', value);
				this.$domEl.volume = value;
			},
			$addSourceList: function(sourceList){
				var self = this;
				if (angular.isArray(sourceList)) {
					angular.forEach(sourceList, function(singleElement, index){
						var sourceElement = document.createElement('SOURCE');
						['src', 'type', 'media'].forEach(function(key){
							if(singleElement[key] !== undefined){
								if(key=='src'){
									sourceElement.setAttribute(key, $rootScope.CONFIG.soundBase+'/'+singleElement[key]);
								}else{
									sourceElement.setAttribute(key, singleElement[key]);
								}
								
							}
						});
						self.$element.append(sourceElement);
					})
				}else if (angular.isObject(sourceList)) {
			        var sourceElem = document.createElement('SOURCE');
			          	['src', 'type', 'media'].forEach(function (key) {
				            if (sourceList[key] !== undefined) {
					            if(key=='src'){
									sourceElem.setAttribute(key, $rootScope.CONFIG.soundBase+'/'+sourceList[key]);
								}else{
									sourceElem.setAttribute(key, sourceList[key]);
								}
				            }

			        });
			        self.$element.append(sourceElem); 	
				}
			},
			$clearSourceList:function(){
				this.$element.contents().remove();
			},
			$attachPlaylist: function (pl) {
		        if (pl === undefined || pl === null) {
		          this.playlist = [];
		        } else {
		          this.$playlist = pl;
		        }
		    }
		};

	    /**
	     * Binding function that gives life to AngularJS scope
	     * @param  {Scope}  au        Player Scope
	     * @param  {HTMLMediaElement} HTML5 element
	     * @param  {jQlite} element   <audio>/<video> element
	     * @return {function}
	     *
	     * Returns an unbinding function
	     */
		var bindListeners = function(au, al, element){
			var listeners = {
		        playing: function () {
		          au.$apply(function (scope) {
		            scope.playing = true;
		            scope.ended = false;
		          });
		        },
		        pause: function () {
		          au.$apply(function (scope) {
		            scope.playing = false;
		          });
		        },
		        ended: function () {
		            au.$apply(function (scope) {
		              scope.ended = true;
		              scope.playing = false; // IE9 does not throw 'pause' when file ends
		            });
			    },
		        volumechange: function () { // Sent when volume changes (both when the volume is set and when the muted attribute is changed).
		          au.$apply(function (scope) {
		            // scope.volume = Math.floor(al.volume * 100);
		            scope.volume = al.volume;
		            scope.muted = al.muted;
		          });
		        },
			};

			angular.forEach(listeners, function(f, listener){
				element.on(listener, f);
			})
		}
		var audioPlayer = function(element){
			var mediaScope = angular.extend($rootScope.$new(true), {
				$element: element,
				$domEl: element[0],
				$playlist: undefined
			}, audioDefaults, playerMethods);

			bindListeners(mediaScope, element[0], element);
			return mediaScope;
		};

		return{
			restrict: 'A',
			require: '^xywBook',
			scope: false,
			templateUrl: 'products/books/book-audio.tpl.html',
			link: function(scope, element, attrs, xywBookCtrl){
				var player = new audioPlayer(element.find('Audio'));
				var playlist = [];
				var mediaName = element.find('Audio').attr('media-player');
				var uiTrack = element.find('.ui-slider-track');
				var uiRange = element.find('.ui-slider-range');
				var uiHandle = element.find('.ui-slider-handle');
				var volumePercent = 100;
				var handleAvailable = uiTrack.width() - uiHandle.width();
				var dragStartX = 0; 
				var dragX= handleAvailable;

				scope.isMobile = function(){
					return (/iP(ad|hone|od)/.test(window.navigator.userAgent));
				}
				//add this for ios5.1, seems to make it faster to load the audio
				if(scope.isMobile()){
					$(element.find('Audio')).attr('autoplay', true);
				}

				if (mediaName !== undefined) { scope[mediaName] = player; }
				// console.log(mediaName);
				scope.$watch('items', function(newValue){
					if(scope.items.length > 0){
						//setup index and playlist
						//console.log(scope.items, 'itesm');
						scope.index = xywBookCtrl.getIndex();
						//generate the playlist based on data
						angular.forEach(scope.items, function(v, i){
							var tmp = {};
							['src', 'type'].forEach(function(key){
								tmp[key] = v[key];
							});
							playlist.push(tmp);
						});

						player.$attachPlaylist(playlist);

						if(playlist.length && !isNaN(scope.index)){
							//add source based on playlist, load player and play the audio
							// console.log(playlist);
							$timeout(function(){
								player.$clearSourceList();
								player.$addSourceList(playlist);
								player.load(true);						
							});
						}
					}

				});

				scope.$on('indexChange', function(){
		    		scope.index = xywBookCtrl.getIndex();
		    		//console.log(scope.index, 'index change');
		    		if(typeof player.$playlist != 'undefined'){
		    			player.pause();
		    			player.play(scope.index);
		    		}
		    	});

				//volume related ui
				uiRange.css('width', volumePercent+'%');
				uiHandle.css('left', dragX);
		    	// scope.$watch('player.volume', function(newValue){
		    	// 	console.log(player.volume);
		    	// })
				uiHandle.on('mousedown', function(e){
					e.preventDefault();
					dragStartX = e.pageX -dragX;
					// console.log(dragStartX, e.pageX, dragX, 'dragStart, e, dragX');
					$document.on('mousemove', dragMousemove);
					$document.on('mouseup', dragUnbind);					
				});

				function dragMousemove(e){
					// console.log('drag mouse move');
					dragX = e.pageX - dragStartX;
					if(dragX <0){
						dragX = 0;
					}
					if(dragX > handleAvailable){
						dragX = handleAvailable;
					}
					volumePercent = dragX/handleAvailable *100; 

					uiRange.css('width', volumePercent+'%');
					uiHandle.css('left', dragX);
				}

				function dragUnbind(){
					// console.log('unbind');
					// console.log(Math.round(volumePercent)/100, 'percent');

					$document.unbind('mousemove', dragMousemove);
					$document.unbind('mouseup', dragUnbind);

					player.setVolume(Math.round(volumePercent)/100);
				}
			}
		}
}])
angular.module('cards', [])
.directive('xywCard', ['$rootScope', '$timeout', 'siteAudio', function($rootScope, $timeout, siteAudio){
	return{
		restrict: 'A',
		replace: true,
		templateUrl: 'products/games/cards/cards-single.tpl.html',
		scope:{
			items: '=',
			hideText: '=',
			indicator: '='
		},
		link: function(scope, element, attr){
			var player = siteAudio.player(element.find('Audio'));
			var playlist = [];
			var mediaName = element.find('Audio').attr('media-player');
			var maxIndex = scope.items.length-1;			
			// var colors = ['#b5d368', '#d368c3', '#68afd3', '#d368ac', '#d38168'];
			//set background color, show the front page
			// setBG();
			// element.find('.card-front').addClass('active');

			scope.CONFIG = $rootScope.CONFIG;

			//set background color randomly from the color choice
			// function setBG(){
			// 	var color = colors[Math.floor(Math.random()*(colors.length-1))];
			// 	$('.mainImg', element).css('background-color', color);
			// }
			scope.count = 0;

			scope.isMobile = function(){
				return (/iP(ad|hone|od)/.test(window.navigator.userAgent));
			}
			// //add this for ios5.1, seems to make it faster to load the audio
			if(scope.isMobile()){
				$(element.find('Audio')).attr('autoplay', true);
			}

			if(mediaName !== undefined){scope[mediaName] = player; }

			// scope.$watch(items, function(newValue){
				if(scope.items.length > 0){
					angular.forEach(scope.items, function(v, i){
						var tmp = {};
						tmp['src'] = v.sound;
						playlist.push(tmp);
					});

					player.$attachPlaylist(playlist);

					if(playlist.length && !isNaN(scope.indicator)){
						$timeout(function(){
							player.$clearSourceList();
							player.$addSourceList(playlist);
							player.load(true);
						});
					}
				}
			// });

			scope.$watch('indicator', function(data){
				if(data == 0 && scope.count == 0){
					//first time do nothing
				}else{
					scope.$emit('addCount', ++scope.count);
				}				

				if(typeof player.$playlist != 'undefined'){					
					player.pause();
					player.play(scope.indicator);
				}
			});

			scope.$on('selCard', function(event, data){
				scope.indicator = data;
			});

			var audio = element.find('Audio')[0];

			scope.noPrevious = function(){
				return (scope.indicator>0) ? false : true;
			};

			scope.noNext = function(){
				return (scope.indicator<maxIndex) ? false : true;
			};

			scope.selPrev = function(){				
				if(!scope.noPrevious()){
					// setBG();
					scope.indicator--;
				}
			};

			scope.selNext = function(){
				if(!scope.noNext()){
					// setBG();
					scope.indicator++;
				}
			};

			scope.flip = function(){
				$('.feature').addClass('flip');		

				$timeout(function(){					
					$('.card-main').toggleClass('active');
					$('.feature').removeClass('flip');
				}, 1100);

			};

			scope.speak = function(){
				player.play(scope.indicator);

			};

			// scope.$watch('hideText', function(newValue){
			// 	console.log(newValue);
			// })

		}
	}
}])
angular.module('fillinblank', [])
.directive('xywFillblank', ['$document', '$rootScope', '$timeout', 'siteAudio', 
	function($document, $rootScope, $timeout, siteAudio) {
	    return {
	    	restrict: 'A',
	    	templateUrl: 'products/games/fillinblank/droppable.tpl.html',
	    	scope: {
	    		items: '=',
	    		indicator: '=',
	    		'close': '&onClose'
	    	},
	    	controller:['$scope', '$element', '$attrs', '$rootScope', function($scope,$element,$attrs, $rootScope){
				var maxIndicator,//max indicator
					dropBlankX,  //blank box x postion 
	    			dropBlankY,  //blank box y position 
	    			answer, 	 //id of the correct answer
	    			targetX, 	 //distance between the correct answer and blank in x axis
	    			targetY;	//distance between the correct answer and blank in y axis
			
				var player = siteAudio.player($element.find('Audio'));
				var playlist = [];
				var mediaName = $element.find('Audio').attr('media-player');

				// $element.find('Audio').attr('autoplay', true);
				if(mediaName !== undefined){$scope[mediaName] = player; }

				if($scope.items.length > 0){
					angular.forEach($scope.items, function(v, i){
						if(v.sound){
							var tmp = {};
							tmp['src'] = v.sound;
							playlist.push(tmp);
						}
					});

					player.$attachPlaylist(playlist);

					if(playlist.length && !isNaN($scope.indicator)){
						$timeout(function(){
							player.$clearSourceList();
							player.$addSourceList(playlist);
							// player.load(true);
						});
					}
				}

				$scope.speak = function(){
					player.play($scope.indicator);
				}

				$scope.CONFIG = $rootScope.CONFIG;
				$element.addClass('active');
				$scope.target = null;
				//whenever a new question starts
	    		$scope.$watch('indicator', function(newValue){
	    			// console.log('new indicaotr', $scope.items[$scope.indicator]);
	    			// console.log('indicator change', newValue);
	    			$timeout(function(){  
		    			if(typeof player.$playlist != 'undefined'){
							player.pause();
							player.play($scope.indicator);
						}
					}, 1000);
	    			answer = $scope.items[$scope.indicator].answer;
	    			maxIndicator = $scope.items.length - 1;
	    			// console.log(answer);
	    		})

	            $scope.$on('useCard', function(e, id){
					if($rootScope.oUser.avatar.cards[id] > 0){
						$rootScope.oUser.avatar.cards[id]--;
						var cardKeys = [], elimation = [];
						for(var i=0; i< $scope.items[$scope.indicator].choices.length; i++){
							if(i != ($scope.items[$scope.indicator].answer-1)){
								cardKeys.push(i);
							} 
						}
						var singleKey = Math.floor(Math.random()*3);
						cardKeys.splice(singleKey, 1);
						// console.log(cardKeys);
						switch(id){
							case 'tip1':

								angular.forEach($scope.items[$scope.indicator].choices, function(value, idx){
									if(cardKeys.indexOf(idx) == -1 && idx != ($scope.items[$scope.indicator].answer-1)){
										elimation.push(true);
									}else{
										elimation.push(false);
									}
								});
								$scope.items[$scope.indicator].elimation = elimation;
								break;

							case "tip2":

								angular.forEach($scope.items[$scope.indicator].choices, function(value, idx){
									if(cardKeys.indexOf(idx) > -1){
										elimation.push(true);
									}else{
										elimation.push(false);
									}
								});
								$scope.items[$scope.indicator].elimation = elimation;
								break;

							case "tip3":
								$scope.items[$scope.indicator].reveal = $scope.items[$scope.indicator].answer-1;
								break;
						}
					}
				});

	    		this.addTarget = function(targetID, position){
	    			$scope.$apply($scope.target = targetID);
	    			// console.log('answer select is:', targetID, position);
	    			//if the character move is the answer, calculate distance
	    			if(!dropBlankX || !dropBlankY){
		    			dropBlankX = $element.find('.blank').position().left;
		    			dropBlankY = $element.find('.blank').position().top;
		    			// console.log('blankx, y', dropBlankX, dropBlankY);     				
	    			}

	    			if(targetID == answer && !targetX){
	    				targetX = Math.round(dropBlankX - $("#char"+answer).position().left-14);
	    				targetY = Math.round(dropBlankY - $("#char"+answer).position().top);
	    				// console.log(targetX, targetY, 'targetx,y');
	    			}

	    		};
	    		this.checkTarget = function(event){
		    		var distanceX = Math.abs(dropBlankX - $(event.target).position().left);
	    			var distanceY = Math.abs(dropBlankY -$(event.target).position().top);
	    			// console.log(distanceX, distanceY, answer, $scope.target);
	    			// console.log('distancex, y', distanceX, distanceY);
	    			//based on the distance between drag choice and blank give class indicator
		    		if (distanceX < 15 & distanceY < 15) {
	    				var moreQuestion, correct=false;
	    				reset(event);
	    				if ($scope.target == answer) {
   							correct = true;
	    					if($scope.indicator < maxIndicator){
	    						moreQuestion = true;
	    						$scope.$apply($scope.indicator++);
		    					answer = $scope.items[$scope.indicator].answer;
    			    		}else{
    			    			//reach the end of the game, show success			    			
			    				moreQuestion = false;
    			    		}
		    			} else{
		    				$rootScope.oUser.avatars[$rootScope.oUser.avatar.name].life -= 1;
		    				if(--$rootScope.oUser.avatar.life <= 0){
		    					moreQuestion = false;
		    				}else{
		    					moreQuestion = true;
		    				}

		    			}

		    			if(!moreQuestion){
	    					$scope.close({'complete': correct});		    				
		    			}else{
		    				//based on correct to show sucess or fail message, need to add
		    				$timeout(function(){  
		    					$element.addClass('active');
		    					if(!correct){
		    						player.pause();
									player.play($scope.indicator);
		    					}
		    				}, 1000);
		    			}
			    			
		    		}
	    		};

	    		function reset(event){
	    			$scope.$broadcast('reset');
	    			$('.character').css({left: 0, top: 0});
					$element.removeClass('active');					
					dropBlankX = null;
					dropBlankY = null;
					targetX = null;
					targetY = null;
	    		};
	    	}]
	    }
	}
])

.directive('xywDraggable', ['$document', '$swipe',  function($document, $swipe) {
	//optimized mouse draggable directive
    return {
    	require: '^xywFillblank',
    	link: function(scope, element, attr, xywFillblankCtl) {
    		var supportsTouch = 'ontouchstart' in document.documentElement;
    		var startEvent = supportsTouch ? 'touchstart' : 'mousedown';
			var moveEvent = supportsTouch ? 'touchmove' : 'mousemove.draggable';
			var endEvent = supportsTouch ? 'touchend' : 'mouseup.draggable';

    		var dragX = 0, dragY = 0, dragStartX = 0, dragStartY = 0;
    		var position; //suppose to get position for the init time

			element.on(startEvent, mouseDown);

			//my own code is faster than implement the $swipe service
			// $swipe.bind(element, {
			// 	'start': function(coords){
			// 		// console.log('start', coords.x, coords.y);
			// 		dragStartX = coords.x - dragX;
			// 		dragStartY = coords.y - dragY;
			// 		xywFillblankCtl.addTarget(event.currentTarget.id.replace("char",""), position);
			// 	},
			// 	'move': function(coords){
			// 		// console.log('move', coords.x, coords.y);
			// 		dragX = coords.x - dragStartX;
			// 		dragY = coords.y - dragStartY;

			// 		element.css({
			// 			left: dragX,
			// 			top: dragY
			// 		});

			// 		xywFillblankCtl.checkTarget(event);

			// 	},
			// 	'end': function(coords){
			// 		console.log('end', coords);
			// 	},
			// 	'cancel': function(coords){
			// 		console.log('cancel');
			// 	}
			// })
			
			function mouseDown(event) {
				// Prevent default dragging of selected content
				event.preventDefault();
				if(!position){
					position = element.position();					
				}				
				xywFillblankCtl.addTarget(event.currentTarget.id.replace("char",""), position);
				var pageX = supportsTouch ? event.originalEvent.touches[0].pageX : event.pageX;
				var pageY = supportsTouch ? event.originalEvent.touches[0].pageY : event.pageY;

				dragStartX = pageX - dragX;
				dragStartY = pageY - dragY;

				$document.on(moveEvent, dragMousemove);
				$document.on(endEvent, dragUnbind);

			}
 
			function dragMousemove(event) {
				var pageX = supportsTouch ? event.originalEvent.touches[0].pageX : event.pageX;
				var pageY = supportsTouch ? event.originalEvent.touches[0].pageY : event.pageY;

				dragX = pageX - dragStartX;
				dragY = pageY - dragStartY;

				element.css({
					left: dragX,
					top: dragY
				});
				xywFillblankCtl.checkTarget(event);
			}
 
			function dragUnbind() {
				// console.log('unbind drag');
				$document.unbind(moveEvent, dragMousemove);
				$document.unbind(endEvent, dragUnbind);
			}

	        scope.$on('$destroy', function() {
				dragUnbind();
            });

            scope.$on('reset', function(){
				dragUnbind();
			})
		}
	}
}]);
angular.module('memory', [])
.directive('xywMemory', ['$rootScope', '$timeout', function($rootScope, $timeout){
	return{
		restrict: 'A',
		replace: true,
		templateUrl: 'products/games/memory/memory-single.tpl.html',
		scope: {
			items: '=',
			'close': '&onClose'
		},
		link: function(scope, element, attr){
			var firstPick, secondPick;
			scope.CONFIG = $rootScope.CONFIG;

			var tileDeck = makeDeck(scope.items);
			scope.grid = makeGrid(tileDeck);
			var unmatchedPairs = scope.items.length /2; 

			scope.flipTile= function(tile){
				if(tile.flipped){
					return;
				}
				tile.flipped = !tile.flipped;
				
				if(!firstPick || secondPick){
					
					if(secondPick){
						firstPick.flipped = !firstPick.flipped;
						secondPick.flipped = !secondPick.flipped;
						firstPick = secondPick = undefined;
					}

					firstPick = tile;					
				}else{

					if(firstPick.text == tile.text){
						unmatchedPairs--;
						firstPick = secondPick = undefined;
						if(unmatchedPairs == 0){
							//finish memory show star
							$timeout(function(){
								$('#stars').addClass('active');
							}, 900);
							
							//get close window
							$timeout(function(){
								$('#stars').removeClass('active');
								scope.close(true);
							},950);							
						}
					}else{
						secondPick = tile;
					}
				}
			}

			function makeDeck(items){
				var tileDeck = [];
				for(var i=0; i< items.length; i++){
					tileDeck[i] = items[i];
					tileDeck[i].flipped = false;
				}
				return tileDeck;
			}

			function makeGrid(tileDeck){
				//make 3x6 tile
				var gridDimension = 3;
				var rowDimension = 6; 
				var grid = [];

				for(var row=0; row< gridDimension; row++){
					grid[row] = [];
					for(var col=0; col < rowDimension; col++){
						grid[row][col] = removeRandomTile(tileDeck);
					}
				}

				return grid;
			}

			function removeRandomTile(tileDeck){
				var i = Math.floor(Math.random()*tileDeck.length);
				return tileDeck.splice(i, 1)[0];
			}
		}
	}
}])
angular.module('tracing', [])
.directive('xywTracing', ['$rootScope', '$timeout', 'siteAudio', function($rootScope, $timeout, siteAudio){
	return{
		restrict: 'A',
		replace: false,
		templateUrl: 'products/games/tracing/tracing-single.tpl.html',
		scope:{
			items: '=',
			indicator: '=',
	    	'close': '&onClose'			
		},
		link: function(scope, element, attr){
			var player = siteAudio.player(element.find('Audio'));
			var playlist = [];
			var mediaName = element.find('Audio').attr('media-player');

			scope.CONFIG = $rootScope.CONFIG;
			scope.imgs= [];
			scope.scores = [];

			scope.repeatCount = 0; //count for single character

			scope.range = function(n) {
		       if(n === parseInt(n, 10)){
		       		return new Array(n);
		       }else{
		       		return null;
		       }
		       
	    	};

			scope.isMobile = function(){
				return (/iP(ad|hone|od)/.test(window.navigator.userAgent));
			}
			// //add this for ios5.1, seems to make it faster to load the audio
			if(scope.isMobile()){
				$(element.find('Audio')).attr('autoplay', true);
			}

			if(mediaName !== undefined){scope[mediaName] = player; }


			if(scope.items.length > 0){
				//only add the sound file for the current char
				if(scope.indicator > scope.items.length-1){
					return false;
				}
				var tmp = {};
				tmp['src'] = scope.items[scope.indicator] && scope.items[scope.indicator].sound;
				playlist.push(tmp);

				player.$attachPlaylist(playlist);

				if(playlist.length && !isNaN(scope.indicator)){
					$timeout(function(){
						player.$clearSourceList();
						player.$addSourceList(playlist);
						//this to auto start the first source file
						player.load(true);
					});
				}
			}

			// var audio = element.find('Audio')[0];

			// var maxIndex = scope.items.length-1;

			scope.$on('startCount', function(e, resultImg, curScore){
				scope.$apply(function(){
					scope.imgs.push(resultImg);
					scope.scores.push(Math.round(3*curScore));
					scope.repeatCount++;
				});
				if(scope.repeatCount >= 3){
					//write 3 times, wait for a while and start a new character
					$timeout(function(){

						scope.$apply(function(){								
							scope.$emit('addCount', scope.scores);
						});	
						scope.close({'complete': true});

					}, 10);

				}else{
					// scope.write();
					scope.$broadcast('startWrite');
				}		
			})


			scope.speak = function(){
				player.play(scope.indicator);
			};	

		}
	}
}])
.directive('xywChar', ['$rootScope', '$timeout', function($rootScope, $timeout){
	return{
		restrict: 'A',
		scope: {
    		character: '=',
    		strokes: '='
	    },
		link: function(scope, element, attr){
			var supportsTouch = 'ontouchstart' in document.documentElement;
			//touchstart, touchmove, touchend
			var eventStart = supportsTouch ? 'touchstart' : 'mousedown';
			var eventMove = supportsTouch ? 'touchmove' : 'mousemove';
			var eventEnd = supportsTouch ? 'touchend' : 'mouseup';
			var ratio = 1; //this is for canvas rendered size vs actual size
			// console.log(supportsTouch);
			element[0].width = 440;
			element[0].height = 440;
			if($(window).width() < 700){
				//if device is phone, canvas size shrink down to 300x300, need to check canvas actual width	
				ratio = element[0].offsetWidth / element[0].width;
				// console.log('ratio', ratio);
			}	
			var ctx = element[0].getContext('2d');
			// ctx.globalAlpha = 1.0;
			var drawing = false;	//variable that decides if something should be drawn on mouseove
			var lastX, lastY; //last coordinates before the current move
			var animPlaying = false;
			var prevStroke, curStroke; //keep track of previous stroke and current stroke
			var i = 0;	//signle stroke stops
			var o = 0; //number of strokes
			var threshold = 100; // the px distance between the user mouse and the stroke
			var startStroke = false; //detect whether user starts the stroke
			var endStroke = false;  //detect whether user end the stroke
			var curScore = 1;

			// drawText(scope.character);

			scope.$watch('character', function(newValue){
				// reset();
				// drawText(newValue);	
				startAnimation();			
			})

			scope.$on('startWrite', function(){
				startAnimation();
			})

			element.bind(eventStart, function(event){
				if(event.offsetX !== undefined){
					lastX = event.offsetX;
					lastY = event.offsetY;				
				}else{ //firefox compatibility
					if(supportsTouch){
						lastX = event.originalEvent.touches[0].pageX - element[0].getBoundingClientRect().left;
						lastY = event.originalEvent.touches[0].pageY - element[0].getBoundingClientRect().top;
					}else{
						lastX = event.layerX - event.currentTarget.offsetLeft;
						lastY = event.layerY - event.currentTarget.offsetTop;
					}

				}
				lastX /= ratio;
				lastY /= ratio;
				// console.log(lastX, lastY);

				//detect if the start point match the start of the stroke
				if(prevStroke){
					var distance = Math.sqrt((prevStroke[0][0]-lastX)*(prevStroke[0][0]-lastX) + (prevStroke[0][1]-lastY)*(prevStroke[0][1]-lastY));
					if(distance < threshold){
						startStroke = true;	
					}
					// console.log(distance);
				}
							
				drawing = true;
			});

			element.bind(eventMove, function(event){
				event.preventDefault();
				if(drawing){
					//get current mouse position
					if(event.offsetX!==undefined){
						var currentX = event.offsetX;
						var currentY = event.offsetY;
					}else{
						if(supportsTouch){
							var currentX = event.originalEvent.touches[0].pageX - element[0].getBoundingClientRect().left;
							var currentY = event.originalEvent.touches[0].pageY - element[0].getBoundingClientRect().top;
						}else{
							var currentX = event.layerX - event.currentTarget.offsetLeft;
							var currentY = event.layerY - event.currentTarget.offsetTop;
						}
					}
					currentX /= ratio;
					currentY /= ratio;

					// console.log(lastX, lastY, currentX, currentY);
					//draw(lastX, lastY, currentX, currentY, '#000', 30);
					var last = [lastX, lastY];
					var current = [currentX, currentY];
					draw(last, current, '#000', 35, true);

					//set current coordinates to last one
					lastX = currentX;
					lastY = currentY;						

				}
			});

			element.bind(eventEnd, function(event){
				//stop drawing
				drawing = false;
				//detect if the end stroke match the end
				if(prevStroke){
					var idx = prevStroke.length -1;
					var distance = Math.sqrt((prevStroke[idx][0]-lastX)*(prevStroke[idx][0]-lastX) + (prevStroke[idx][1]-lastY)*(prevStroke[idx][1]-lastY));
					// console.log(distance);
					if(distance < threshold){
						endStroke = true;
					}
				}
				
				if (startStroke && endStroke){
					startStroke = false;
					endStroke = false;
					animateText();
				}else{
					//If not write correctly, wait little while and start next stroke
					$timeout(function(){
						startStroke = false;
						endStroke = false;
						animateText();
					},400);
				}
				
			});

			function reset(){
				element[0].width = element[0].width;
				prevStroke = null;
				curScore = 1;
			};

			function draw(l, c, color, width, isStart){
				
				//line from
				if(isStart){
					ctx.beginPath();
					if(l.length == 6){
						ctx.bezierCurveTo(l[0], l[1], l[2], l[3], l[4], l[5]);
						// console.log('curve', l[0], l[1], l[2], l[3], l[4], l[5]);
					}else{
						ctx.moveTo(l[0], l[1]);
						// console.log('moveTo', l[0], l[1]);
					}				
				}

				if(c.length == 6){
					//bezierCurve
					ctx.bezierCurveTo(c[0], c[1], c[2], c[3], c[4], c[5]);
					// console.log('continue curve to',c[0], c[1], c[2], c[3], c[4], c[5] );
				}else{
					//line to
					ctx.lineTo(c[0],c[1]);	
					// console.log('continue line to', c[0],c[1]);		
				}

				//color
				ctx.strokeStyle=color;
				//line width
				ctx.lineWidth = width;
				//draw it
				ctx.stroke();
			};

			function drawText(text){
				if(typeof text !== 'undefined'){
					ctx.fillStyle="#ccc";
					//ctx.font= "300px Arial";
					//http://www.kendraschaefer.com/2012/06/chinese-standard-web-fonts-the-ultimate-guide-to-css-font-family-declarations-for-web-design-in-simplified-chinese/
					ctx.font = "300px SimHei";
					ctx.fillText(text, 80, 320);

					ctx.globalCompositeOperation = 'source-atop'; //source-in, this is clip stroke inisde
				}

			};

			function startAnimation(){
				reset();
				drawText(scope.character);
				o= 0;
				i= 0;
				animateText();
			}

			function animateText(){
				// console.log('animateText', scope.strokes, o);
				if(!scope.strokes || scope.strokes.length == 0){
					return false;
				}

				curStroke = scope.strokes[o];

			    playAnimation();
			}

			function playAnimation(){
				if(typeof curStroke === 'undefined'){
					o = 0;
					// console.log('broadcast');
					// curStroke = scope.strokes[o];
					var imgData = ctx.getImageData(0,0,element[0].width,element[0].height).data;
					var redPixel = 0;
					for(var p=0; p<imgData.length/4; p++){
						if ( imgData[p*4] == 255){
							redPixel++;
						}
					}
					// console.log(redPixel);
					//calculate the amount of red pixel to see how good the writing is
					if(2500 < redPixel && redPixel < 8000){
						curScore = 0.6;
					}else if(redPixel > 8000){
						curScore = 0.3;
					}else{
						curScore = 1;
					}
					var resultImg = element[0].toDataURL();
					$rootScope.$broadcast('startCount', resultImg, curScore);
					return false;
				}
				(function writeSingleStroke(){					
					if(i< curStroke.length - 1){
						animPlaying = true;
						$timeout(function(){
							var start = curStroke[i];
							var end = curStroke[i+1];
							var isStart = false;
							if(i==0){
								isStart = true;
							}
							// console.log(start[0], start[1], end[0], end[1], "#f00", 30);
							// draw(start[0], start[1], end[0], end[1], "#f00", 30);
							draw(start, end, "#f00", 35, isStart);
							// console.log(start, end);
							i++;
							writeSingleStroke();				
						}, 300);
					}else{
						// console.log('finish one stroke');
						animPlaying = false;
						prevStroke = scope.strokes[o];
						o++;
						i=0;							
						curStroke = scope.strokes[o];
					}					
				})(); 
			}
		}
	}
}])
angular.module('products', ['resources.products', 'books', 'fillinblank', 'tracing', 'cards', 'memory', 'xiaoyueSecurity'])

.config(['$routeProvider', function ($routeProvider) {
  	$routeProvider.
	  	whenAuthenticated('/products/:categoryId/:mapId/:lessonId/:itemId', {
            templateUrl: 'products/products.tpl.html',
            controller: 'ProductsViewCtrl',
            title: 'Product Detail',
		    resolve:{
		      products:['Products', '$route', function(Products, $route){
		        return Products.getById($route.current.params.itemId);
		      }]
		    }
        });

  	$routeProvider.
	  	whenAuthenticated('/products/:categoryId/:mapId/:itemId', {
            templateUrl: 'products/books/audiobook/audiobook-detail.tpl.html',
            controller: 'ResourceViewCtrl',
            title: 'Product Detail',
		    resolve:{
		      products:['Products', '$route', function(Products, $route){
		        return Products.getById($route.current.params.itemId);
		      }]
		    }
        });
}]);

angular.module('products').controller('ResourceViewCtrl', ['$scope','products','$routeParams','$location', '$rootScope', 
	function ProductsViewCtrl($scope, products, $routeParams, $location, $rootScope) {
		$rootScope.title = products.title_en + ' ';
		$scope.itemDetail = products;
		$scope.items = products.items;
		$scope.categoryId = $routeParams.categoryId;

		$scope.closeWin = function(complete){
			$location.url('/'+$routeParams.mapId+'/chest');
		}

}]);

//use this to check the points of each game
angular.module('products').factory('pointSys', [function(){
	var points ={
		getPoint: function(category, times, count){
			// console.log(category, times, count);
			switch(category){
				case "memory":
					return Math.round(20*Math.pow(0.5, times)) || 1; //need to add constant number for 20, by the number of tries, min 1 gold
					break;
				case "card":
					return 1;
					break;
				case "tracing":
					var point =  count ?  window._.reduce(count, function(memo, num){return memo+num}, 0) : 0;
					return times ? (point? 1: point) : point; //first time get 3*3 full gold, afterwards only 1 per character
					break;
				case "fillinblank":
					return times ? 2 : 50; //first time 50 afterwards only 2
					break;
				default:
					return 0;
			}
		}

	};
	return points;
}]);

angular.module('products').controller('ProductsViewCtrl', ['$scope', 'products', 'security', '$routeParams','$location', '$rootScope', '$modal', '$window', 'pointSys',
	function ProductsViewCtrl($scope, products, security, $routeParams, $location, $rootScope, $modal, $window, pointSys) {
		// console.log(products);
		$rootScope.title = products.title_en + ' ' || '';
		$scope.itemDetail = products;
		$scope.items = products.items;
		$scope.count = 0;
		$scope.points = 0;
		$scope.categoryId = $routeParams.categoryId;
		var itemId = $routeParams.itemId; //item id
		var mapId = $routeParams.mapId;
		var lessonId = $routeParams.lessonId;
					
		if(!security.gameAllowed(mapId, lessonId)){
			$scope.itemDetail = {};	
			$scope.items = {};	
			var modalInstance = $modal.open({
                templateUrl: 'xywNoaccess.html',
                size: 'sm',
                controller: function ($scope, $modalInstance){

		            $scope.cancel = function () {
					    $modalInstance.dismiss('cancel');
					    $location.path('/main');
					};

			    }                
            });	

			return false;
		}else{

			$rootScope.oUser.maps[mapId][lessonId][itemId] = $rootScope.oUser.maps[mapId][lessonId][itemId] || 0;
		}

		switch( products.subCategory ){
			case 'card':
				$scope.activeId = 0;				
				$scope.selCard = function(id){
					$scope.activeId = id;
					$scope.$broadcast('selCard', id);
				};
				break;
			case 'tracing':
				$scope.count = [];
				$scope.points = $rootScope.oUser.maps[mapId][lessonId][itemId];
				if (typeof $rootScope.oUser.maps[mapId][lessonId][itemId] == 'number'){
					$rootScope.oUser.maps[mapId][lessonId][itemId] = {};
				}
				$scope.showMenu = (typeof $location.search()['idx'] == 'undefined') ? true : false;
				if(!$scope.showMenu){
					$scope.activeId = $location.search()['idx'];
				}				
				$scope.selChar = function(id){
					var curPath = $location.path();
					$location.path(curPath).search({'idx': id});
				};
				break;
			case 'fillinblank':
				$scope.useCard = function(id){
					$scope.$broadcast('useCard', id);
				};
				$scope.activeId = 0;
				break;

			default:
				$scope.activeId = 0;
				break;
		}

		// $scope.trustSrc = function(src){
		// 	return $sce.trustAsResourceUrl(src);
		// }

		//added count for points
		$scope.$on('addCount', function(event, data) { 
			$scope.count = data; 
		});


		$scope.closeWin = function(complete){
			//save points to user account and calculate level etc.
			// console.log(complete);
			if(products.subCategory=='tracing' && $scope.showMenu){
				$location.path('/map/'+mapId);
				return false;
			}
			if (complete || (products.subCategory=='card' && $scope.count >= 3)){
				if(products.subCategory=='tracing'){
					if($scope.points[$scope.activeId]){ //challenge already finished
						$scope.points = pointSys.getPoint(products.subCategory, true, $scope.count);	
						$rootScope.oUser.maps[mapId][lessonId][itemId][$scope.activeId] += $scope.points;
					}else{
						$scope.points = pointSys.getPoint(products.subCategory, false, $scope.count);	
						$rootScope.oUser.maps[mapId][lessonId][itemId][$scope.activeId]= $scope.points;				
					}			
					
				}else if(products.subCategory=="fillinblank"){
					$scope.points = pointSys.getPoint(products.subCategory, $rootScope.oUser.maps[mapId][lessonId][itemId]);			
					$rootScope.oUser.maps[mapId][lessonId][itemId] = true;					
				}else{
					$scope.points = pointSys.getPoint(products.subCategory, $rootScope.oUser.maps[mapId][lessonId][itemId]++);
				}
				$rootScope.oUser.maps[mapId][lessonId].gold += $scope.points;
				$rootScope.oUser.gold += $scope.points;
			}else{
				$scope.points = 0;
			}
			
			var modalInstance = $modal.open({
                templateUrl: 'xywSuccess.html',
                size: 'sm',
                backdrop: 'static',
                resolve: {
                	points: function(){
                		return $scope.points;
                	},
                	category: function(){
                		return products.subCategory;
                	}
                },
                controller: function ($scope, $modalInstance, points, category){
		            $scope.points = points;
		            $scope.category = category;

			    	$scope.again = function(){
			    		$window.location.reload();
			    	}
		            $scope.cancel = function () {
					    //close window and redirect
					    $modalInstance.dismiss('cancel');
					    if(category == 'tracing'){
					    	$location.url('/products/game'+'/'+mapId+'/'+lessonId+'/'+itemId);
					    }else{
					    	$location.path('/map/'+mapId);	
					    }
					    		    
					};

			    }
            });	
		}

}]);
angular.module('public', ['firebase.utils', 'firebase.auth', 'ngRoute'])

.config(['$routeProvider', function($routeProvider){
	$routeProvider
		.when("/login", {
			templateUrl: 'public/login.tpl.html',
			controller:'LoginCtrl',
			title: 'Login'
		});

	$routeProvider
		.when('/faq', {
		    templateUrl:'public/faq.tpl.html',
		    title: 'Faq',
		    controller:'staticPageCtrl',
	});

  	$routeProvider
  		.when('/ambers-world', {
		    templateUrl:'public/about.tpl.html',
		    title: 'About Us',
		    controller:'staticPageCtrl',
  	});

}]);

angular.module('public').controller('LoginCtrl', ['$scope', '$modal', 'Auth', '$location', 'fbutil', '$firebaseObject', 'security',
	function($scope, $modal, Auth, $location, fbutil, $firebaseObject, security){
		$scope.email = null;
		$scope.password = null;

		Auth.$onAuth(function(authData){
			if(authData){
				var ref = fbutil.ref('users', authData.uid);
				$location.url('/main');
				// console.log($firebaseObject(ref));
			}
		});	

		$scope.login = function(provider){
			$scope.err = null;
			(function(){
				if(provider){
					return (['facebook', 'twitter','google'].indexOf(provider)>=0) ? Auth.$authWithOAuthPopup(provider) : Auth.$authAnonymously();

				}else{
					return 	Auth.$authWithPassword({
						email: $scope.email,
						password: $scope.password
					});
				}
			})().catch(function(error){				
				$scope.err = "Error authentication " + errMessage(error);
			});
		};

		$scope.register = function(){
			$scope.err = null;
			Auth.$createUser({
				email: $scope.email,
				password: $scope.password
			}).then(function(user){
				return Auth.$authWithPassword({
					email: $scope.email,
					password: $scope.password
				})
				.catch(function(error){				
					$scope.err = "Error authentication " + errMessage(error);
				});
			})
		};

		$scope.showReset = function(){
			//show reset password window
			var modalInstance = $modal.open({
				templateUrl: 'xywResetPass.html',
				controller: 'resetPassCtrl',
				scope: $scope,
				size: 'sm',
				backdrop: 'static'
			})
		}
		function errMessage(err){
			return angular.isObject(err) && err.code ? err.code : err + '';
		};
		
}]);

angular.module('public').controller('resetPassCtrl', ['$scope', "$window", "FBURL",'$modalInstance',
	function($scope, $window, FBURL, $modalInstance){
	$scope.reset = {};
	$scope.resetPassword= function(email){
        var ref = new $window.Firebase(FBURL);
        ref.resetPassword({
         email: email
        }, function(error){
         if(error){
           switch (error.code) {
                 case "INVALID_USER":
                   $scope.reset.msg = "The specified user account does not exist.";
                   break;
                 default:
                   $scope.reset.msg = "Error resetting password";
           }
         }else{
           $modalInstance.close('done');
         }
        });		
		
	};
	$scope.close = function(){
		$modalInstance.dismiss();
	}
}]);

angular.module('public').controller('staticPageCtrl', ['$scope', '$rootScope', 
  function($scope, $rootScope){

}]);
var xiaoyueDirectives = angular.module('xiaoyueDirectives', []);


xiaoyueDirectives.directive('xywMap', [function(){
  return{
    restrict: 'A',
    replace: false,
    link: function(scope, element,attrs){
      scope.$watch(attrs.xywMap, function(value){
        element.css({'background-image': "url('/img/maps/"+value+"')"});
      })
    }
  }
}]);


xiaoyueDirectives.directive('xywPagination', ['$parse', function($parse){
    return{
        restrict: 'A',
        replace: false,
        transclude: true,
        scope: true,
        templateUrl: "directives/pagination.tpl.html",
        compile: function(element, attrs, transcludeFn){        
            element.find('.lst-main li').attr('ng-repeat', attrs.item);
            element.find('.lst-main li').attr('ng-show', attrs.item.split(' in ')[0]+'.show');
            // element.find('.lst-main li')[1].remove();
            return function postLink(scope, element, attrs){
                //get the ng-repeat object name
                var items = attrs.item.split(' in ')[1];
                var show = parseInt(attrs.show);

                scope[items] = $parse(items)(scope);           
                scope.activeFirst = 0;
                scope.preVisble = false;
                var itemLen = scope[items].length;
                scope.nexVisble = (itemLen > show) ? true : false; 

                scope.$watch('activeFirst', function(v){
                    angular.forEach(scope[items], function(o, i){
                        if(i>= v && i< v + show){
                            scope[items][i].show = true;
                        }else{
                            scope[items][i].show = false;
                        }
                    });
                    scope.nexVisble = (v+show < scope[items].length) ? true : false;
                    scope.preVisble = (v-show >= 0) ? true : false;
                });

                scope.$on('updateCostumes', function(e,d){
                    scope.costumes = d; 
                });

                scope.next = function(){
                    if(scope.activeFirst + show < itemLen){
                        scope.activeFirst += show;
                    }          
                };

                scope.prev = function(){                
                    if(scope.activeFirst - show >=0){
                        scope.activeFirst -= show;
                    }
                };
            }
        }
    }
}]);


//common draggable comment
xiaoyueDirectives.directive('xywSortable', ['$rootScope', '$document', function($rootScope, $document){
    return{
        restrict: 'A',
        link: function(scope,element,attrs){
            var supportsTouch = 'ontouchstart' in document.documentElement;
            var startEvent = supportsTouch ? 'touchstart' : 'mousedown';
            var moveEvent = supportsTouch ? 'touchmove' : 'mousemove.draggable';
            var endEvent = supportsTouch ? 'touchend' : 'mouseup.draggable';

            var dragX = 0, dragY = 0, dragStartX = 0, dragStartY = 0;
            var position; //suppose to get position for the init time

            var idx, item; //the item got picked
            function mouseDown(event){
                event.preventDefault();
                console.log('mousedown');
                item = event.currentTarget; 
                $(item).addClass('draggable');

                // console.log(scope[attrs.ngModel]);
                idx = $(item).index();
                // scope[attrs.ngModel].splice(idx, 1);

                if(!position){
                    position = $(item).position();                  
                } 

                var pageX = supportsTouch ? event.originalEvent.touches[0].pageX : event.pageX;
                var pageY = supportsTouch ? event.originalEvent.touches[0].pageY : event.pageY;

                dragStartX = pageX - dragX;
                dragStartY = pageY - dragY;  

                console.log('mousedown', dragStartX, dragStartY);
                $document.on(moveEvent, dragMousemove);
                $document.on(endEvent, dragUnbind);

            } 

            function dragMousemove(event) {
                console.log('drag move');
                var pageX = supportsTouch ? event.originalEvent.touches[0].pageX : event.pageX;
                var pageY = supportsTouch ? event.originalEvent.touches[0].pageY : event.pageY;

                dragX = pageX - dragStartX;
                dragY = pageY - dragStartY;

                console.log('mousemove', dragX, dragY);
                $(item).css({
                    left: dragX,
                    top: dragY
                });
            }

            function dragUnbind() {
                // console.log('drag unbind');
                $(item).removeClass('draggable').css({left: 0, top: 0});
                dragX = 0;
                dragY = 0; 
                dragStartX = 0;
                dragStartY = 0;
                
                scope.$apply(function(){
                    var data = scope[attrs.ngModel].splice(idx, 1);
                    // console.log(data);
                    (scope[attrs.ngModel]).push(data[0]);
                })              

                $document.unbind(moveEvent, dragMousemove);
                $document.unbind(endEvent, dragUnbind);
            }

            scope.$watch(attrs.ngModel+'.length', function(){
                var sortItem = element.find('li');

                if(sortItem.length > 0){
                    sortItem.on(startEvent, mouseDown);
                }
            });
        }
    }
}]);

//usage ng-repeat="i in []|range:10"
var xiaoyueFilters = angular.module('xiaoyueFilters', []);

xiaoyueFilters.filter('range', function(){
	return function(val, range) {
	    range = parseInt(range);
	    for (var i=0; i<range; i++)
	      val.push(i);
	    return val;
  	};
})
angular.module('resources.avatars', ['mongolabResource']);
angular.module('resources.avatars').factory('Avatars', ['mongolabResource', function ($mongolabResource) {

  var Avatars = $mongolabResource('avatars');

  Avatars.getFree = function(successcb, errorcb){
  	var queryJson = {"type": "free"};
  	return Avatars.getRaw(queryJson, successcb, errorcb);
  };
  
  return Avatars;
}]);
angular.module('resources.goods', ['mongolabResource']);
angular.module('resources.goods').factory('Goods', ['mongolabResource', function ($mongolabResource) {

  var Goods = $mongolabResource('goods');

  Goods.getCards = function(successcb, errorcb){
  	var queryJson = {'type':'card'};
  	return Goods.getRaw(queryJson, successcb, errorcb);
  };

  return Goods;
}]);
angular.module('resources.lessons', ['mongolabResource']);
angular.module('resources.lessons').factory('Lessons', ['mongolabResource', function ($mongolabResource) {

  var Lessons = $mongolabResource('lessons');

  Lessons.getLessonByKey= function(key, successcb, errorcb){
    // var queryJson = {tags: { $in: ['good deeds', 'pigs'] }};
   //get the most popular by the higest rating
    var queryJson = {"key": key};
    var queryOther = {};
    return Lessons.getRaw(queryJson, queryOther, successcb, errorcb);
  };


  return Lessons;
}]);
angular.module('resources.maps', ['mongolabResource']);
angular.module('resources.maps').factory('Maps', ['mongolabResource', function ($mongolabResource) {

  var Maps = $mongolabResource('maps');

  Maps.getMap= function(userpoint, successcb, errorcb){
    // var queryJson = {tags: { $in: ['good deeds', 'pigs'] }};
   //get the most popular by the higest rating
    var queryJson = {"points": { $gt: userpoint }};
    var queryOther = {s:{"points" : 1}};
    return Maps.getRaw(queryJson, queryOther, successcb, errorcb);
  };

  Maps.getMapByPoint= function(userpoint, successcb, errorcb){
    // var queryJson = {tags: { $in: ['good deeds', 'pigs'] }};
   //get the most popular by the higest rating
    var queryJson = {"points": { $lt: userpoint }};
    var queryOther = {s:{"points" : -1}};
    return Maps.getRaw(queryJson, queryOther, successcb, errorcb);
  };


  Maps.getMapByLevel= function(userlevel, successcb, errorcb){
    // var queryJson = {tags: { $in: ['good deeds', 'pigs'] }};
   //get the most popular by the higest rating
    var queryJson = {"level": userlevel};
    var queryOther = {s:{"points" : -1}};
    return Maps.getRaw(queryJson, queryOther, successcb, errorcb);
  };

  Maps.getList= function(successcb, errorcb){
    // var queryJson = {tags: { $in: ['good deeds', 'pigs'] }};
   //get the most popular by the higest rating
    var queryJson = {"active": true};
    var queryOther = {};
    return Maps.getRaw(queryJson, queryOther, successcb, errorcb);
  };

  Maps.getByKey = function(key, successcb, errorcb){
    var queryJson = {"key": key};
    var queryOther = {};
    return Maps.getRaw(queryJson, queryOther, successcb, errorcb);
  };

  return Maps;
}]);
angular.module('mongolabResource', []).factory('mongolabResource', ['MONGOLAB_CONFIG','$http', '$q', function (MONGOLAB_CONFIG, $http, $q) {

  function MongolabResourceFactory(collectionName) {

    var url = MONGOLAB_CONFIG.baseUrl + MONGOLAB_CONFIG.dbName + '/collections/' + collectionName;
    var urlLocal = '/static/data/'+collectionName+'.json';
    var defaultParams = {};
    if (MONGOLAB_CONFIG.apiKey) {
      defaultParams.apiKey = MONGOLAB_CONFIG.apiKey;
    }
    
    var thenFactoryMethod = function (httpPromise, successcb, errorcb, isArray, filterFn) {
      var scb = successcb || angular.noop;
      var ecb = errorcb || angular.noop;

      return httpPromise.then(function (response) {
        var result;
        // console.log(response);
        //added function to use local data instead if failed to connect to mongo
        if(typeof filterFn == 'function'){
          response.data = filterFn(response.data);
        }
        if (isArray) {
          result = [];
          for (var i = 0; i < response.data.length; i++) {
            result.push(new Resource(response.data[i]));
          }
        } else {
          //MongoLab has rather peculiar way of reporting not-found items, I would expect 404 HTTP response status...
          if (response.data === " null "){
            return $q.reject({
              code:'resource.notfound',
              collection:collectionName
            });
          } else {
            result = new Resource(response.data);
          }
        }
        // console.log(result);
        scb(result, response.status, response.headers, response.config);
        return result;
      }, function (response) {
        // ecb(undefined, response.status, response.headers, response.config);
        // return undefined;
        //below added functin to use local data intead, only filter data and sort by the first criteria asc
        var filterFn;
        var isArray = true;
        // console.log(response.config.url);
        if(response.config.url != url){
          var filterId = response.config.url.replace(url+'/','');
          filterFn = function(data){
            return window._.find(data, function(item){  return item._id.$oid == filterId;})
          };
          isArray = false;
        }else if(!window._.isEmpty(response.config.params)){
          // console.log(response.config.params);
          filterFn = function(data){
            var q = response.config.params.q;
            if(q.length > 2){
              data = window._.where(data, JSON.parse(q));
            }
            var s = response.config.params.s;
            if(!window._.isEmpty(s)){
              data = window._.sortBy(data, Object.keys(s)[0]);
            }
            return data;
          }
        }
        var localPromise = $http.get(urlLocal);
        return thenFactoryMethod(localPromise, successcb, errorcb, isArray, filterFn);
      });
    };

    var Resource = function (data) {
      angular.extend(this, data);
    };

    Resource.all = function (cb, errorcb) {
      return Resource.query({}, cb, errorcb);
    };

    Resource.getRaw = function(queryJson, queryOther, successcb, errorcb){
      var params = angular.isObject(queryJson) ? {q:JSON.stringify(queryJson)} : {}; 
      var httpPromise = $http.get(url, {params: angular.extend({}, queryOther, params)});
      //var httpPromise = $http.get(url, {params:queryObj});
      // console.log(url, {params: angular.extend({}, queryOther, params)});
      return thenFactoryMethod(httpPromise, successcb, errorcb, true);
    } 

    Resource.query = function (queryJson, successcb, errorcb) {
      var params = angular.isObject(queryJson) ? {q:JSON.stringify(queryJson)} : {};
      var httpPromise = $http.get(url, {params:angular.extend({}, defaultParams, params)});
      return thenFactoryMethod(httpPromise, successcb, errorcb, true);
    };

    Resource.getById = function (id, successcb, errorcb) {
      var httpPromise = $http.get(url + '/' + id, {params:defaultParams});
      return thenFactoryMethod(httpPromise, successcb, errorcb);
    };

    Resource.getByIds = function (ids, successcb, errorcb) {
      var qin = [];
      angular.forEach(ids, function (id) {
         qin.push({$oid: id});
      });
      return Resource.query({_id:{$in:qin}}, successcb, errorcb);
    };

    //instance methods

    Resource.prototype.$id = function () {
      if (this._id && this._id.$oid) {
        return this._id.$oid;
      }
    };

    Resource.prototype.$save = function (successcb, errorcb) {
      var httpPromise = $http.post(url, this, {params:defaultParams});
      return thenFactoryMethod(httpPromise, successcb, errorcb);
    };

    Resource.prototype.$update = function (successcb, errorcb) {
      var httpPromise = $http.put(url + "/" + this.$id(), angular.extend({}, this, {_id:undefined}), {params:defaultParams});
      return thenFactoryMethod(httpPromise, successcb, errorcb);
    };

    Resource.prototype.$remove = function (successcb, errorcb) {
      var httpPromise = $http['delete'](url + "/" + this.$id(), {params:defaultParams});
      return thenFactoryMethod(httpPromise, successcb, errorcb);
    };

    Resource.prototype.$saveOrUpdate = function (savecb, updatecb, errorSavecb, errorUpdatecb) {
      if (this.$id()) {
        return this.$update(updatecb, errorUpdatecb);
      } else {
        return this.$save(savecb, errorSavecb);
      }
    };

    return Resource;
  }
  return MongolabResourceFactory;
}]);

angular.module('resources.partners', ['mongolabResource']);
angular.module('resources.partners').factory('Partners', ['mongolabResource', function ($mongolabResource) {

  var Partners = $mongolabResource('partners');


  return Partners;
}]);
angular.module('resources.products', ['mongolabResource']);
angular.module('resources.products').factory('Products', ['mongolabResource', function ($mongolabResource) {

  var Products = $mongolabResource('products');

  Products.getPopular= function(successcb, errorcb){
    // var queryJson = {tags: { $in: ['good deeds', 'pigs'] }};
   //get the most popular by the higest rating
    var queryJson = {"active": true};
    var queryOther = {s:{"rating.total" : -1}, l:5};
    return Products.getRaw(queryJson, queryOther, successcb, errorcb);
  };

  Products.getSum = function(successcb, errorcb){
    var queryOther ={f: {"_id": 1, "category": 1, "subCategory": 1}};
    return Products.getRaw({"active": true}, queryOther, successcb, errorcb);
  };

  Products.getTotal = function(successcb, errorcb){
    var queryJson = {"active": true};
     var queryOther = {f:{"_id": 1}};
     return Products.getRaw(queryJson, queryOther, successcb, errorcb);
  };

  Products.getSumByCategory = function(category, successcb, errorcb){
    var queryJson = {"category": category, "active": true};
    var queryOther ={f: {"_id": 1, "category": 1, "subCategory": 1, "title_zh": 1, "title_en": 1,"level": 1, "thumb": 1, "gold": 1},s:{"gold" : 1}};
    return Products.getRaw(queryJson, queryOther, successcb, errorcb);
  };

  Products.getSelected = function(successcb, errorcb){
    //items seleted by the admin
    var queryJson = {"selected": true, "active": true};
    var queryOther = {l:5};
    return Products.getRaw(queryJson, queryOther, successcb, errorcb);
  };

  Products.getLatest = function(successcb, errorcb){
  	//get the latest by the date entered
    return Products.getRaw({"active": true}, {s:{"dateEntered" : -1}}, successcb, errorcb);
  };

  //get related products by tag
  Products.getByTag = function(tags, successcb, errorcb){
  	// return Products.query({tags:{$all: tags}}, successcb, errorcb);
    // var tags = ['good deeds'];
    if (tags.length == 0){
      tags = ['good deeds'];
    }
    
    return Products.getRaw({tags:{$in: tags}, "active": true}, {l:5}, successcb, errorcb);
  };

  return Products;
}]);
//https://github.com/grevory/angular-local-storage

(function() {
/* Start angularLocalStorage */
'use strict';
var angularLocalStorage = angular.module('LocalStorageModule', []);

angularLocalStorage.provider('localStorageService', function(){
  // You should set a prefix to avoid overwriting any local storage variables from the rest of your app
  // e.g. localStorageServiceProvider.setPrefix('youAppName');
  // With provider you can use config as this:
  // myApp.config(function (localStorageServiceProvider) {
  //    localStorageServiceProvider.prefix = 'yourAppName';
  // });

  this.prefix = 'ls';

  // Cookie options (usually in case of fallback)
  // expiry = Number of days before cookies expire // 0 = Does not expire
  // path = The web path the cookie represents
  this.cookie = {
    expiry: 30,
    path: '/'
  };

  // Send signals for each of the following actions?
  this.notify = {
    setItem: true,
    removeItem: false
  };

  // Setter for the prefix
  this.setPrefix = function(prefix){
    this.prefix = prefix;
  };

  // Setter for cookie config
  this.setStorageCookie = function(exp, path){
    this.cookie = {
      expiry: exp,
      path: path
    };
  };

  // Setter for notification config
  // itemSet & itemRemove should be booleans
  this.setNotify = function(itemSet, itemRemove){
    this.notify = {
      setItem: itemSet,
      removeItem: itemRemove
    };
  };

  this.$get = ['$rootScope', function($rootScope){

    var prefix = this.prefix;
    var cookie = this.cookie;
    var notify = this.notify;

    // If there is a prefix set in the config lets use that with an appended period for readability
    if (prefix.substr(-1) !== '.') {
      prefix = !!prefix ? prefix + '.' : '';
    }

    // Checks the browser to see if local storage is supported
    var browserSupportsLocalStorage = (function () {
      try {
        var supported = ('localStorage' in window && window['localStorage'] !== null);

        // When Safari (OS X or iOS) is in private browsing mode, it appears as though localStorage
        // is available, but trying to call .setItem throws an exception.
        //
        // "QUOTA_EXCEEDED_ERR: DOM Exception 22: An attempt was made to add something to storage
        // that exceeded the quota."
        var key = prefix + '__' + Math.round(Math.random() * 1e7);
        if (supported) {
          localStorage.setItem(key, '');
          localStorage.removeItem(key);
        }

        return true;
      } catch (e) {
        $rootScope.$broadcast('LocalStorageModule.notification.error', e.message);
        return false;
      }
    }());

    // Directly adds a value to local storage
    // If local storage is not available in the browser use cookies
    // Example use: localStorageService.add('library','angular');
    var addToLocalStorage = function (key, value) {

      // If this browser does not support local storage use cookies
      if (!browserSupportsLocalStorage) {
        $rootScope.$broadcast('LocalStorageModule.notification.warning', 'LOCAL_STORAGE_NOT_SUPPORTED');
        if (notify.setItem) {
          $rootScope.$broadcast('LocalStorageModule.notification.setitem', {key: key, newvalue: value, storageType: 'cookie'});
        }
        return addToCookies(key, value);
      }

      // Let's convert undefined values to null to get the value consistent
      if (typeof value === "undefined") {
        value = null;
      }

      try {
        if (angular.isObject(value) || angular.isArray(value)) {
          value = angular.toJson(value);
        }
        localStorage.setItem(prefix + key, value);
        if (notify.setItem) {
          $rootScope.$broadcast('LocalStorageModule.notification.setitem', {key: key, newvalue: value, storageType: 'localStorage'});
        }
      } catch (e) {
        $rootScope.$broadcast('LocalStorageModule.notification.error', e.message);
        return addToCookies(key, value);
      }
      return true;
    };

    // Directly get a value from local storage
    // Example use: localStorageService.get('library'); // returns 'angular'
    var getFromLocalStorage = function (key) {

      if (!browserSupportsLocalStorage) {
        $rootScope.$broadcast('LocalStorageModule.notification.warning','LOCAL_STORAGE_NOT_SUPPORTED');
        return getFromCookies(key);
      }

      var item = localStorage.getItem(prefix + key);
      // angular.toJson will convert null to 'null', so a proper conversion is needed
      // FIXME not a perfect solution, since a valid 'null' string can't be stored
      if (!item || item === 'null') {
        return null;
      }

      if (item.charAt(0) === "{" || item.charAt(0) === "[") {
        return angular.fromJson(item);
      }

      return item;
    };

    // Remove an item from local storage
    // Example use: localStorageService.remove('library'); // removes the key/value pair of library='angular'
    var removeFromLocalStorage = function (key) {
      if (!browserSupportsLocalStorage) {
        $rootScope.$broadcast('LocalStorageModule.notification.warning', 'LOCAL_STORAGE_NOT_SUPPORTED');
        if (notify.removeItem) {
          $rootScope.$broadcast('LocalStorageModule.notification.removeitem', {key: key, storageType: 'cookie'});
        }
        return removeFromCookies(key);
      }

      try {
        localStorage.removeItem(prefix+key);
        if (notify.removeItem) {
          $rootScope.$broadcast('LocalStorageModule.notification.removeitem', {key: key, storageType: 'localStorage'});
        }
      } catch (e) {
        $rootScope.$broadcast('LocalStorageModule.notification.error', e.message);
        return removeFromCookies(key);
      }
      return true;
    };

    // Return array of keys for local storage
    // Example use: var keys = localStorageService.keys()
    var getKeysForLocalStorage = function () {

      if (!browserSupportsLocalStorage) {
        $rootScope.$broadcast('LocalStorageModule.notification.warning', 'LOCAL_STORAGE_NOT_SUPPORTED');
        return false;
      }

      var prefixLength = prefix.length;
      var keys = [];
      for (var key in localStorage) {
        // Only return keys that are for this app
        if (key.substr(0,prefixLength) === prefix) {
          try {
            keys.push(key.substr(prefixLength));
          } catch (e) {
            $rootScope.$broadcast('LocalStorageModule.notification.error', e.Description);
            return [];
          }
        }
      }
      return keys;
    };

    // Remove all data for this app from local storage
    // Also optionally takes a regular expression string and removes the matching key-value pairs
    // Example use: localStorageService.clearAll();
    // Should be used mostly for development purposes
    var clearAllFromLocalStorage = function (regularExpression) {

      var regularExpression = regularExpression || "";
      //accounting for the '.' in the prefix when creating a regex
      var tempPrefix = prefix.slice(0, -1) + "\.";
      var testRegex = RegExp(tempPrefix + regularExpression);

      if (!browserSupportsLocalStorage) {
        $rootScope.$broadcast('LocalStorageModule.notification.warning', 'LOCAL_STORAGE_NOT_SUPPORTED');
        return clearAllFromCookies();
      }

      var prefixLength = prefix.length;

      for (var key in localStorage) {
        // Only remove items that are for this app and match the regular expression
        if (testRegex.test(key)) {
          try {
            removeFromLocalStorage(key.substr(prefixLength));
          } catch (e) {
            $rootScope.$broadcast('LocalStorageModule.notification.error',e.message);
            return clearAllFromCookies();
          }
        }
      }
      return true;
    };

    // Checks the browser to see if cookies are supported
    var browserSupportsCookies = function() {
      try {
        return navigator.cookieEnabled ||
          ("cookie" in document && (document.cookie.length > 0 ||
          (document.cookie = "test").indexOf.call(document.cookie, "test") > -1));
      } catch (e) {
          $rootScope.$broadcast('LocalStorageModule.notification.error', e.message);
          return false;
      }
    };

    // Directly adds a value to cookies
    // Typically used as a fallback is local storage is not available in the browser
    // Example use: localStorageService.cookie.add('library','angular');
    var addToCookies = function (key, value) {

      if (typeof value === "undefined") {
        return false;
      }

      if (!browserSupportsCookies()) {
        $rootScope.$broadcast('LocalStorageModule.notification.error', 'COOKIES_NOT_SUPPORTED');
        return false;
      }

      try {
        var expiry = '',
            expiryDate = new Date();

        if (value === null) {
          // Mark that the cookie has expired one day ago
          expiryDate.setTime(expiryDate.getTime() + (-1 * 24 * 60 * 60 * 1000));
          expiry = "; expires=" + expiryDate.toGMTString();
          value = '';
        } else if (cookie.expiry !== 0) {
          expiryDate.setTime(expiryDate.getTime() + (cookie.expiry * 24 * 60 * 60 * 1000));
          expiry = "; expires=" + expiryDate.toGMTString();
        }
        if (!!key) {
          document.cookie = prefix + key + "=" + encodeURIComponent(value) + expiry + "; path="+cookie.path;
          }
      } catch (e) {
        $rootScope.$broadcast('LocalStorageModule.notification.error',e.message);
        return false;
      }
      return true;
    };

    // Directly get a value from a cookie
    // Example use: localStorageService.cookie.get('library'); // returns 'angular'
    var getFromCookies = function (key) {
      if (!browserSupportsCookies()) {
        $rootScope.$broadcast('LocalStorageModule.notification.error', 'COOKIES_NOT_SUPPORTED');
        return false;
      }

      var cookies = document.cookie.split(';');
      for(var i=0;i < cookies.length;i++) {
        var thisCookie = cookies[i];
        while (thisCookie.charAt(0)===' ') {
          thisCookie = thisCookie.substring(1,thisCookie.length);
        }
        if (thisCookie.indexOf(prefix + key + '=') === 0) {
          return decodeURIComponent(thisCookie.substring(prefix.length + key.length + 1, thisCookie.length));
        }
      }
      return null;
    };

    var removeFromCookies = function (key) {
      addToCookies(key,null);
    };

    var clearAllFromCookies = function () {
      var thisCookie = null, thisKey = null;
      var prefixLength = prefix.length;
      var cookies = document.cookie.split(';');
      for(var i = 0; i < cookies.length; i++) {
        thisCookie = cookies[i];
        
        while (thisCookie.charAt(0) === ' ') {
          thisCookie = thisCookie.substring(1, thisCookie.length);
        }

        var key = thisCookie.substring(prefixLength, thisCookie.indexOf('='));
        removeFromCookies(key);
      }
    };

    return {
      isSupported: browserSupportsLocalStorage,
      set: addToLocalStorage,
      add: addToLocalStorage, //DEPRECATED
      get: getFromLocalStorage,
      keys: getKeysForLocalStorage,
      remove: removeFromLocalStorage,
      clearAll: clearAllFromLocalStorage,
      cookie: {
        set: addToCookies,
        add: addToCookies, //DEPRECATED
        get: getFromCookies,
        remove: removeFromCookies,
        clearAll: clearAllFromCookies
      }
    };
  }]
});
}).call(this);

angular.module('firebase.auth', ['firebase'])
	.factory('Auth', ['$firebaseAuth', '$window', 'FBURL', function ($firebaseAuth, $window, FBURL) {

		var ref = new $window.Firebase(FBURL);
		return $firebaseAuth(ref);
	}]);

//a simple wrapper on firebase and angularFire to simplify deps and keep things DRY
angular.module("firebase.utils", ["firebase"])
	.factory("fbutil", ['$window', 'FBURL', '$q', function($window, FBURL, $q){
		var utils = {
	        // convert a node or Firebase style callback to a future
	        handler: function(fn, context) {
	          return utils.defer(function(def) {
	            fn.call(context, function(err, result) {
	              if( err !== null ) { def.reject(err); }
	              else { def.resolve(result);}
	            });
	          });
	        },

	        // abstract the process of creating a future/promise
	        defer: function(fn, context) {
	          var def = $q.defer();
	          fn.call(context, def);
	          return def.promise;
	        },

	        ref: firebaseRef
		};

		return utils;

		function pathRef(args) {
	        for (var i = 0; i < args.length; i++) {
	          if (angular.isArray(args[i])) {
	            args[i] = pathRef(args[i]);
	          }
	          else if( typeof args[i] !== 'string' ) {
	            throw new Error('Argument '+i+' to firebaseRef is not a string: '+args[i]);
	          }
	        }
	        return args.join('/');
      	};

      /**
       * Example:
       * <code>
       *    function(firebaseRef) {
         *       var ref = firebaseRef('path/to/data');
         *    }
       * </code>
       *
       * @function
       * @name firebaseRef
       * @param {String|Array...} path relative path to the root folder in Firebase instance
       * @return a Firebase instance
       */
      function firebaseRef(path) {
        var ref = new $window.Firebase(FBURL);
        var args = Array.prototype.slice.call(arguments);
        if( args.length ) {
          ref = ref.child(pathRef(args));
        }
        return ref;
      }

	}]);

(function(angular){
// when $routeProvider.whenAuthenticated() is called, the path is stored in this list
  // to be used by authRequired() in the services below
  var securedRoutes = [];
  var avatars = {};
  angular.module('xiaoyueSecurity', ['ngRoute', 'firebase', 'firebase.auth', 'firebase.utils', 'resources.avatars'])
  	.config(['$routeProvider', function($routeProvider){
  		$routeProvider.whenAuthenticated = function (path, route) {
	        securedRoutes.push(path); // store all secured routes for use with authRequired() below
	        route.resolve = route.resolve || {};
	        route.resolve.user = ['Auth', function (Auth) {
	          return Auth.$requireAuth();
	        }];
          
          route.resolve.userData = ['$rootScope', '$q', function($rootScope, $q){
            var deferred = $q.defer();
            $rootScope.$watch('oUser', function(newV, oldV){
              if(newV){
                deferred.resolve(newV);
              }
            });
            return deferred.promise;
          }];

	        $routeProvider.when(path, route);
	        return this;
      	};
  	}])

  /**
   * Apply some route security. Any route's resolve method can reject the promise with
   * { authRequired: true } to force a redirect. This method enforces that and also watches
   * for changes in auth status which might require us to navigate away from a path
   * that we can no longer view.
   */
    .run(['$rootScope', '$location', 'Auth', 'loginRedirectPath', '$firebaseObject','fbutil', 'security',"Avatars",
      function ($rootScope, $location, Auth, loginRedirectPath, $firebaseObject, fbutil, security, Avatars) {
        // watch for login status changes and redirect if appropriate
        Auth.$onAuth(check);

        Avatars.getFree().then(function(data){
          angular.forEach(data, function(obj, key){
              delete obj['_id'];
              avatars[obj.name] = obj;         
          })
        });

        // some of our routes may reject resolve promises with the special {authRequired: true} error
        // this redirects to the login page whenever that is encountered
        $rootScope.$on("$routeChangeError", function (e, next, prev, err) {
          if (err === "AUTH_REQUIRED") {
            $location.path(loginRedirectPath);
          }
        });

        function check(user) {
          if (!user && authRequired($location.path())) {
            console.log('check failed', user, $location.path()); //debug
            $location.path(loginRedirectPath);
          }
        }

        function authRequired(path) {
          // console.log('authRequired?', path, securedRoutes.indexOf(path)); //debug
          return securedRoutes.indexOf(path) !== -1;
        }
      }
    ])

    .factory('security', [ '$firebaseObject', 'fbutil', 'Auth', '$location', function($firebaseObject, fbutil, Auth, $location){
        
        function firstPartOfEmail(email) {
          return ucfirst(email.substr(0, email.indexOf('@'))||'');
        }

        function ucfirst (str) {
          // inspired by: http://kevin.vanzonneveld.net
          str += '';
          var f = str.charAt(0).toUpperCase();
          return f + str.substr(1);
        }

        var user ={
            oUser: null,
            getUserById: function(id){
              user.oUser = $firebaseObject(fbutil.ref('users', id));  
              return user.oUser; 
            },
            getNewLesson: function(map){
              if(!!user.oUser.maps && !!user.oUser.maps[map]){
                var keys = Object.keys(user.oUser.maps[map]);
                //finish all the lessons
                if(keys.length>=10){
                  return 10;
                }
                var lastKey = keys[keys.length-1];
                //Rules here if points over 100 open next lesson
                if(user.oUser.maps[map][lastKey].gold>=100){
                  return keys.length+1;
                }else{
                  return keys.length;
                }                
              }else{
                return 1;
              }
            },
            gameAllowed: function(mapId, lessonId){
              if(!!user.oUser.maps[mapId][lessonId]){
                return true;
              }else{
                return false;
              }
            },
            addUserByAuth: function(oUser){
              var ref =  fbutil.ref('users', oUser.uid);
              var name = '', email ='', provider = oUser.provider;
              if (provider == 'password'){
                email = oUser.password.email;
                name =  firstPartOfEmail(email);    
              }else if(provider == 'anonymous'){
                name = "guest" + Date.now();
              }else{
                name = oUser[provider].displayName;
              };
              var created = Date.now();
              return fbutil.handler(function(cb){
                ref.set({email: email, provider: provider, name: name, created: created, avatars:avatars}, cb);
              });
            },
            logout: function(){
              Auth.$unauth();     
              $location.path('/login');
            }
        };

        return user;
    }]);
})(angular);
var xiaoyueServices = angular.module('xiaoyueServices', ['ngResource', 'resources.maps']);

xiaoyueServices.factory('siteLang', ['$location', function($location){
    var language = 'zh'; //zh for chinese, en for english
    var factory ={};
    factory.getLang = function(){
        if($location.absUrl().indexOf('/cn/') == -1){
            language = 'en';
        }
        return language;
    }
    factory.setLang = function(lan){
        language = lan; //not for use at the moment
    }

    return factory;
}]);


xiaoyueServices.factory('siteChar', ['$http', function($http){
  var chars = {};

  chars.getPingYin = function(){
    return $http.get('/static/data/chars.json');
  }

  return chars;
}]);

xiaoyueServices.factory('siteSetting', ['$window', function($window){
  return {
    Android: function () { return navigator.userAgent.match(/Android/i) },
    BlackBerry: function () { return navigator.userAgent.match(/BlackBerry/i) },
    iOS: function () { return navigator.userAgent.match(/iPhone|iPad|iPod/i) },
    Opera: function() { return navigator.userAgent.match(/Opera Mini/i) },
    Windows: function() { return navigator.userAgent.match(/IEMobile/i) },
    isMobile: function(){
      return (this.Android() || this.BlackBerry() || this.iOS() || this.Opera() || this.Windows());
    },
    isIE8: function(){
      if(navigator.appName.indexOf("Internet Explorer")!= -1 && navigator.appVersion.indexOf("MSIE 8") != -1){
        return true;
      }else{
        return false;
      }
    },
    isLandscape: function(){
      if($window.width()> $window.height()){
        return true;
      }else{
        return false;
      }
    },
    isPortrait: function(){
      if($window.innerWidth < $window.innerHeight){
        return true;
      }else{
        return false;
      }
    },
    isRightSize: function(){
        return $window.innerWidth >= 960; //find device wider than 960 
    }
  }
}]);

xiaoyueServices.factory('siteAudio', ['$rootScope', function($rootScope){
  var siteAudio = {};
  var defaultSetting = {currentTrack: 0, ended: undefined, playing: false};
  var playerMethods ={
    load: function(mediaElement, autoplay){
      if(typeof mediaElement === "boolean"){
        autoplay = mediaElement;
        mediaElement = null;
      }else if(typeof mediaElement === "object"){
        this.$clearSourceList();
        this.$addSourceList(mediaElement);
      }
      this.$domEl.load();
      this.ended = undefined;
      if(autoplay){
        if(Function.prototype.bind){
          this.$element.one('canplay', this.play.bind(this));
        }else{
          // this.$element.one('canplay', function(){
             
          // });
        }
      }
    },
    play: function(index){
      if(this.$playlist.length > index){
        this.currentTrack = index+1;
        return this.load(this.$playlist[index], true);
      }

      if(this.ended){
        this.load(true);
      }else{
        this.$domEl.play();
      }
    },
    pause: function(){
      this.$domEl.pause();
    },
    playPause: function(index){
      if(typeof index === "number"){
        this.play(index);
      }else if(this.playing){
        this.pause();
      }else{
        this.play();
      }
    },
    $addSourceList: function(sourceList){
      var self = this;
      // console.log('addsourclist', sourceList);
      if(angular.isArray(sourceList)){
        angular.forEach(sourceList, function(singleElement, index){
          var sourceElement = document.createElement("SOURCE");
          sourceElement.setAttribute('src', $rootScope.CONFIG.soundBase+'/'+singleElement.src);
          self.$element.append(sourceElement);
        });       
      }else if (angular.isObject(sourceList)){
        var sourceElem = document.createElement("SOURCE");
        sourceElem.setAttribute('src', $rootScope.CONFIG.soundBase+'/'+sourceList.src);
        self.$element.append(sourceElem);
      }
    },
    $clearSourceList: function(){
      this.$element.contents().remove();
    },
    $attachPlaylist: function(pl){
      if(pl === undefined || pl === null){
        this.playlist = [];
      }else{
        this.$playlist = pl;
      }
    }
  };

  var bindListeners = function(au, al, element){
    var listeners = {
      playing: function(){
        au.$apply(function(scope){
          scope.playing = true;
          scope.ended = false;
        });
      },
      pause: function(){
        au.$apply(function(scope){
          scope.playing = false;
        })
      },
      ended: function(){
        au.$apply(function(scope){
          scope.ended = true;
          scope.playing = false;
        })
      }
    };

    angular.forEach(listeners, function(f, listener){
      element.on(listener, f);
    });
  };


  siteAudio.player = function(element){
    var mediaScope = angular.extend($rootScope.$new(true), {
      $element: element,
      $domEl: element[0],
      $playlist: undefined
    }, defaultSetting, playerMethods);

    bindListeners(mediaScope, element[0], element);
    return mediaScope;

  };

  return siteAudio;

}])
angular.module('templates.app', ['category/category-detail.tpl.html', 'category/category-list.tpl.html', 'home/account/account.tpl.html', 'home/avatar/avatar.tpl.html', 'home/chest/chest.tpl.html', 'home/home.tpl.html', 'home/map/arrow.tpl.html', 'home/map/map.tpl.html', 'home/quest/quest-start.tpl.html', 'home/quest/quest-story.tpl.html', 'products/books/audiobook/audiobook-detail.tpl.html', 'products/books/book-audio.tpl.html', 'products/books/book-page.tpl.html', 'products/books/book.tpl.html', 'products/games/cards/cards-detail.tpl.html', 'products/games/cards/cards-single.tpl.html', 'products/games/fillinblank/droppable.tpl.html', 'products/games/fillinblank/fillinblank.edit.tpl.html', 'products/games/memory/memory-detail.tpl.html', 'products/games/memory/memory-single.tpl.html', 'products/games/tracing/tracing-single.tpl.html', 'products/games/tracing/tracing.detail.tpl.html', 'products/products.tpl.html', 'public/about.tpl.html', 'public/faq.tpl.html', 'public/login.tpl.html', 'public/public-nav.tpl.html']);

angular.module("category/category-detail.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("category/category-detail.tpl.html",
    "<section id=\"category\" class=\"inside detail {{categoryId}} {{accSection}}\">\n" +
    "  <div class=\"row-fluid\">\n" +
    "      <section id=\"itemDetail\">\n" +
    "       <div class=\"item-detail\">\n" +
    "          <div class=\"thumb col-xs-3\">\n" +
    "            <img ng-src=\"{{CONFIG.imgBase}}/thumb/medium/{{itemDetail.thumb}}\" alt=\"AmbEr's World : {{itemDetail.title_en}}\">\n" +
    "          </div>\n" +
    "          <div class=\"detail col-xs-8\">\n" +
    "            <div class=\"nav pull-right\">\n" +
    "              <button class=\"quit btn-xs\" ng-click=\"closeItem()\"><i class=\"fa fa-times\"></i></button>\n" +
    "            </div>\n" +
    "            <div class=\"text\">\n" +
    "              <h1 class=\"title\">{{itemDetail.title_en}} <em>( Level {{itemDetail.level}} )</em></h3>           \n" +
    "\n" +
    "              <table class=\"pubDetail\">\n" +
    "                <tr>\n" +
    "                  <td>\n" +
    "                    <label> Publishing House：</label> {{itemDetail.pubHouse}}\n" +
    "                  </td>\n" +
    "                  <td> \n" +
    "                    <label>Serial No：</label>{{itemDetail.serial}}                    \n" +
    "                  </td>\n" +
    "                </tr>\n" +
    "                <tr>\n" +
    "                  <td>\n" +
    "                    <label>Date Published：</label>{{itemDetail.pubDate | date:'MM/dd/yyyy'}}\n" +
    "                  </td>\n" +
    "                  <td>\n" +
    "                    <label>Date Added：</label> {{itemDetail.dateEntered | date:'MM/dd/yyyy'}}\n" +
    "                  </td>\n" +
    "                </tr>\n" +
    "              </table>\n" +
    "\n" +
    "              <div class=\"item-description\">{{itemDetail.description_en}}</div> \n" +
    "\n" +
    "              <a ng-href=\"{{itemDetail.buyUrl}}\" class=\"read btn\" target=\"_blank\">\n" +
    "                <i class=\"fa fa-shopping-cart\"> Buy</i>\n" +
    "              </a>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </section>\n" +
    "  </div>\n" +
    "</section>");
}]);

angular.module("category/category-list.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("category/category-list.tpl.html",
    "<section id=\"category\" class=\"inside {{categoryId}}\">\n" +
    "  <div class=\"row-fluid\">\n" +
    "      <div class=\"section-nav\">\n" +
    "        <ul class=\"submenu\">\n" +
    "          <li ng-repeat=\"item in filteredList | filter:{ subCategory: sub}\" ng-if=\"sub || categoryId == 'book'\">\n" +
    "            <div class=\"inner\" data-ng-click=\"goPage(item.category,item.id)\">\n" +
    "              <span class=\"thumb col-xs-1\">\n" +
    "                <a href=\"#!/category/{{item.category}}/{{item._id.$oid}}\"><img ng-src=\"{{CONFIG.imgBase}}/thumb/xsmall/{{item.thumb}}\"></a>\n" +
    "              </span>\n" +
    "              <span class=\"detail col-xs-11\">\n" +
    "                <div class=\"title\">{{item.title_en}}</div>\n" +
    "                <div class=\"level\">Level（{{item.level}}）</div>\n" +
    "                <div class=\"more\">\n" +
    "                  <span class=\"score\">\n" +
    "                    Rating： {{item.rating.total/item.rating.votes | number: 1}}\n" +
    "                  </span>\n" +
    "                </div>\n" +
    "              </span>\n" +
    "            </div>\n" +
    "          </li>\n" +
    "          <ul ng-if=\"!sub && categoryId == 'game'\">\n" +
    "            <li>\n" +
    "              <div class=\"inner\" data-ng-click=\"sectionDetail('card')\">\n" +
    "                <span class=\"thumb\">\n" +
    "                  <img ng-src=\"{{CONFIG.imgBase}}/card-thumb.jpg\">\n" +
    "                </span>\n" +
    "                <span class=\"detail\">\n" +
    "                 <div class=\"title\">Flash Cards</div>\n" +
    "                </span>\n" +
    "              </div>\n" +
    "            </li>  \n" +
    "            <li>\n" +
    "              <div class=\"inner\" data-ng-click=\"sectionDetail('fillinblank')\">\n" +
    "                <span class=\"thumb\">\n" +
    "                  <img ng-src=\"{{CONFIG.imgBase}}/fillblank-thumb.jpg\">\n" +
    "                </span>\n" +
    "                <span class=\"detail\">\n" +
    "                 <div class=\"title\">Fill in Blank Games</div>\n" +
    "                </span>\n" +
    "              </div>\n" +
    "            </li>  \n" +
    "            <li>\n" +
    "              <div class=\"inner\" data-ng-click=\"sectionDetail('tracing')\">\n" +
    "                <span class=\"thumb\">\n" +
    "                  <img ng-src=\"{{CONFIG.imgBase}}/tracing-thumb.jpg\">\n" +
    "                </span>\n" +
    "                <span class=\"detail\">\n" +
    "                 <div class=\"title\">Tracing Games</div>\n" +
    "                </span>\n" +
    "              </div>\n" +
    "            </li>  \n" +
    "\n" +
    "            <li>\n" +
    "              <div class=\"inner\" data-ng-click=\"sectionDetail('memory')\">\n" +
    "                <span class=\"thumb\">\n" +
    "                  <img ng-src=\"{{CONFIG.imgBase}}/memory-thumb.jpg\">\n" +
    "                </span>\n" +
    "                <span class=\"detail\">\n" +
    "                 <div class=\"title\">Memory Games</div>\n" +
    "                </span>\n" +
    "              </div>\n" +
    "            </li>  \n" +
    "        </ul>\n" +
    "      </div>\n" +
    "  </div>\n" +
    "</section>");
}]);

angular.module("home/account/account.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("home/account/account.tpl.html",
    "<section id=\"account\" class=\"page-container\">\n" +
    "	<div class=\"row page-top\">\n" +
    "		<div class=\"col-xs-12 text-center\">\n" +
    "			<h1>Account</h1>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "	<div class=\"clearfix page-top-right\">\n" +
    "		<a href=\"javascript:;\" ng-click=\"close()\" class=\"btn btn-square\"><i class=\"fa fa-times\"></i></a>\n" +
    "	</div>\n" +
    "	<div class=\"page-main\">\n" +
    "		<div class=\"account-main\">\n" +
    "			<p><label>Level : </label> {{oUser.level}} </p>\n" +
    "			<p><label>Gold : </label> {{oUser.gold}} </p>\n" +
    "			<p><label>Avatar : </label> {{oUser.avatar.name}} </p>\n" +
    "			<p><label>Name : </label> <input type=\"text\" ng-model=\"oUser.name\"> </p>\n" +
    "			<p><label>Email : </label> \n" +
    "				<input type=\"text\" ng-model=\"oUser.email\" ng-show=\"oUser.provider !='password'\">\n" +
    "				<span ng-show=\"oUser.provider =='password'\">\n" +
    "					{{oUser.email}}\n" +
    "					<button class=\"btn btn-info\" ng-click=\"password.show=!password.show\">Change Password</button>\n" +
    "				</span>\n" +
    "			</p>\n" +
    "			<p ng-show=\"oUser.provider != 'password'\"><label>Log in: </label> {{oUser.provider}}</p>\n" +
    "			<fieldset ng-show=\"password.show\" class=\"passwordDiv\">\n" +
    "				<h5>Change Password: </h5>\n" +
    "				<label>Old Password: </label><input type=\"password\" ng-model=\"password.old\">\n" +
    "				<label>New Password: </label><input type=\"password\" ng-model=\"password.new\">\n" +
    "				<button class=\"btn btn-info\" ng-click=\"changePassword()\">Change</button>\n" +
    "			</fieldset>\n" +
    "			<p ng-show=\"password.msg\">{{password.msg}}</p>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "\n" +
    "</section>");
}]);

angular.module("home/avatar/avatar.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("home/avatar/avatar.tpl.html",
    "<section id=\"avatar\" class=\"page-container\">\n" +
    "	<div class=\"row page-top\">\n" +
    "		<div class=\"col-xs-12 text-center\">\n" +
    "			<h1>Avatar</h1>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "	<div class=\"clearfix page-top-right\">\n" +
    "		<a href=\"javascript:;\" ng-click=\"close()\" class=\"btn btn-square\"><i class=\"fa fa-times\"></i></a>\n" +
    "	</div>\n" +
    "	<div class=\"page-main text-center\">\n" +
    "		<div class=\"col-xs-6\">\n" +
    "			<div class=\"col-xs-8 avatar-wrap\">\n" +
    "				<p><label>Name:</label> {{oUser.avatar.name}}</p>\n" +
    "				<p><label>Ability:</label> {{oUser.avatars[activeID].ability_en}}</p>\n" +
    "				<p><label>Costume:</label> </p>\n" +
    "				<ul class=\"list-inline costume-list\">\n" +
    "					<li ng-repeat=\"(k, c) in oUser.avatars[activeID].costumes\" ng-click=\"selCostume(k)\" ng-class=\"{active: k == costumeID}\">\n" +
    "						<img ng-src=\"/static/img/avatar/thumbs/{{c}}.jpg\">\n" +
    "					</li>\n" +
    "				</ul>\n" +
    "				<div class=\"avatar-active\">\n" +
    "					<img ng-src=\"/static/img/avatar/full/{{oUser.avatar.costume}}.png\">\n" +
    "				</div>\n" +
    "			</div>		\n" +
    "		</div>\n" +
    "		<div class=\"col-xs-6\">\n" +
    "			<ul class=\"list-inline avatar-lst\">\n" +
    "				<li ng-repeat=\"(key, avatar) in oUser.avatars\" ng-class=\"{active: key == activeID}\">\n" +
    "					<div class=\"avatar-img\" ng-click=\"selAvatar(key)\">\n" +
    "						<img ng-src=\"/static/img/avatar/thumbs/{{avatar.costumes[0]}}.jpg\">\n" +
    "					</div>\n" +
    "					<div class=\"avatar-txt\">\n" +
    "						{{avatar.name}}\n" +
    "					</div>\n" +
    "				</li>\n" +
    "			</ul>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "	<div class=\"page-footer\">\n" +
    "		Choose your avatar. Each avatar has different abilities, you can change your avatar later.\n" +
    "	</div>\n" +
    "</section>");
}]);

angular.module("home/chest/chest.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("home/chest/chest.tpl.html",
    "<section id=\"chest\" class=\"page-container\">\n" +
    "	<div class=\"row page-top\">\n" +
    "		<div class=\"col-xs-12 text-center\">\n" +
    "			<h1>Chest</h1>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "	<div class=\"clearfix page-top-right\">\n" +
    "		<a href=\"javascript:;\" ng-click=\"close()\" class=\"btn btn-square\"><i class=\"fa fa-times\"></i></a>\n" +
    "	</div>\n" +
    "	<div class=\"goldMenu pull-right\">\n" +
    "		<i></i>\n" +
    "		<div class=\"label\"><span>{{oUser.gold}}</span><div class=\"btn-square\"><i class=\"fa fa-plus\"></i></div></div>	\n" +
    "	</div>\n" +
    "	<div class=\"page-main text-center\">\n" +
    "		<tabset>\n" +
    "			<tab active=\"tabID == 0\">\n" +
    "				<div id=\"lst-cards\">\n" +
    "					<ul class=\"list-inline\">\n" +
    "						<li ng-repeat=\"card in cards\" class=\"sCard\">\n" +
    "							<div class=\"num\"><i>{{oUser.avatar.cards[card.key]||0}}</i></div>\n" +
    "							<div class=\"card-inner\">\n" +
    "								<div class=\"card-img\">\n" +
    "									<img ng-src=\"/static/img/cards/{{card.key}}.jpg\">\n" +
    "								</div>\n" +
    "								<div class=\"card-txt text-center\">\n" +
    "									<h1>{{card.name_en}}</h1>\n" +
    "									<p>{{card.usage_en}}</p>\n" +
    "								</div>\n" +
    "							</div>\n" +
    "							<div class=\"gold-count btn-big btn\" ng-click=\"buy('card', card, card.gold)\">\n" +
    "								<span>{{card.gold}}</span>\n" +
    "							</div>\n" +
    "						</li>\n" +
    "					</ul>\n" +
    "				</div>\n" +
    "			</tab>\n" +
    "			<tab active=\"tabID == 1\">\n" +
    "				<!-- show means the number of visible items on the page -->\n" +
    "				<div xyw-pagination item=\"book in books\" show=\"3\" id=\"lst-books\">\n" +
    "					<div class=\"book-inner\">\n" +
    "						<img ng-src=\"/static/img/story/{{book.thumb}}\">\n" +
    "					</div>\n" +
    "					<div ng-show=\"!book.owned\" class=\"gold-count btn-big btn\" ng-click=\"buy('book', book.$id(), book.gold)\">\n" +
    "						<span>{{book.gold}}</span>\n" +
    "					</div>\n" +
    "					<div ng-show=\"book.owned\" class=\"btn-use btn-big btn\" ng-click=\"read(book.$id())\">\n" +
    "						<span>Read</span>\n" +
    "					</div>\n" +
    "				</div>\n" +
    "			</tab>\n" +
    "			<tab active=\"tabID == 2\">\n" +
    "				<!-- show means the number of visible items on the page -->\n" +
    "				<div xyw-pagination show=\"4\" id=\"lst-costumes\" item=\"costume in costumes\">\n" +
    "					<div class=\"title\">{{costume.name}}</div>\n" +
    "					<div class=\"costume-inner\">\n" +
    "						<img ng-src=\"/static/img/avatar/full/{{costume.costume}}.png\">\n" +
    "					</div>\n" +
    "					<div class=\"gold-count btn-big btn\" ng-click=\"buy('costume', costume, costume.gold)\">							\n" +
    "						<span>{{costume.gold}}</span>\n" +
    "					</div>\n" +
    "				</div>\n" +
    "			</tab>\n" +
    "			<tab active=\"tabID == 3\">\n" +
    "				<div id=\"lst-gold\">\n" +
    "					<div class=\"gold-inner\">\n" +
    "						<h1>1000</h1>\n" +
    "					</div>\n" +
    "					<div class=\"btn-big btn\" ng-click=\"buyGold(1.99, 1000)\">\n" +
    "						<span>$1.99</span>\n" +
    "					</div>\n" +
    "				</div>\n" +
    "			</tab>\n" +
    "		</tabset>\n" +
    "	</div>\n" +
    "	<div class=\"page-footer text-center\">\n" +
    "		<ul class=\"list-inline tab-buttons\" ng-init=\"tabID=0\">\n" +
    "			<li ng-class=\"{active: tabID ==0}\"> <a href=\"javascript:;\" ng-click=\"tabID = 0\">Special Cards</li>\n" +
    "			<li ng-class=\"{active: tabID ==1}\"> <a href=\"javascript:;\" ng-click=\"tabID = 1\">Books</li>\n" +
    "			<li ng-class=\"{active: tabID ==2}\"> <a href=\"javascript:;\" ng-click=\"tabID = 2\">Costumes</li>\n" +
    "			<li ng-class=\"{active: tabID ==3}\"> <a href=\"javascript:;\" ng-click=\"tabID = 3\">Gold</li>\n" +
    "		</ul>\n" +
    "	</div>\n" +
    "\n" +
    "	<script type=\"text/ng-template\" id=\"xywBuy.html\">\n" +
    "		<div class=\"modal-header\">\n" +
    "	        <h3 class=\"modal-title\">Purchase</h3>\n" +
    "	        <button class=\"btn close\" ng-click=\"cancel()\">\n" +
    "	          <span aria-hidden=\"true\">×</span>\n" +
    "	          <span class=\"sr-only\">Close</span>\n" +
    "	        </button>\n" +
    "		</div>\n" +
    "		<div class=\"modal-body\">		\n" +
    "			<h1 ng-show=\"bAbleToBuy\">You sure you are going to buy this item?</h1>\n" +
    "			<h1 ng-show=\"!bAbleToBuy\">Not enough gold to buy this item</h1>\n" +
    "			<a class=\"btn btn-big\" ng-click=\"buyItem()\" ng-show=\"bAbleToBuy\"><span>Pay</span></a>\n" +
    "			<a class=\"btn btn-big\" ng-click=\"cancel()\"><span>Cancel</span></a> \n" +
    "		</div>\n" +
    "		<div class=\"modal-footer\">\n" +
    "		</div>\n" +
    "	</script>\n" +
    "\n" +
    "</section>");
}]);

angular.module("home/home.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("home/home.tpl.html",
    "<section id=\"home\" class=\"page-container\">\n" +
    "	<div class=\"row page-top\">\n" +
    "		<div class=\"col-xs-12 text-center\">\n" +
    "			<h1>Available Games</h1>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "	<div class=\"clearfix page-top-right\">\n" +
    "		<a href=\"javascript:;\" ng-click=\"logout()\" class=\"btn btn-square\"><i class=\"fa fa-sign-out\"></i></a>\n" +
    "	</div>\n" +
    "	<div class=\"page-main text-center\">\n" +
    "		<ul class=\"list-inline game-lst\">\n" +
    "			<li ng-repeat=\"game in games\" ng-class=\"{unlocked: game.price==0, locked: game.price!==0}\">\n" +
    "				<div class=\"game-price\"><span ng-if=\"game.price==0\">Free</span>{{game.price==0 ? '' : game.price}}</div>\n" +
    "				<a class=\"game-img\" ng-click=\"gameDetail(game)\" herf=\"javascript:;\"><img ng-src=\"/static/img/games/{{game.thumb}}\"></a>\n" +
    "				<div class=\"game-title\"><span>{{game.title_en}}</span></div>\n" +
    "			</li>\n" +
    "			<li class=\"locked\">\n" +
    "				<div class=\"game-price\">&nbsp; </div>\n" +
    "				<div class=\"game-img\"><p>Coming Soon</p></div>\n" +
    "				<div class=\"game-title\"></div>\n" +
    "			</li>\n" +
    "		</ul>\n" +
    "	</div>\n" +
    "	<div class=\"page-footer\">\n" +
    "		Select the game above to play\n" +
    "	</div>\n" +
    "\n" +
    "	<!-- Template for game Detail -->\n" +
    "	<script type=\"text/ng-template\" id=\"gameDetail.html\">\n" +
    "		<div class=\"modal-header\">\n" +
    "		        <h3 class=\"modal-title\">{{game.title_en}}</h3>\n" +
    "		        <button class=\"btn close\" ng-click=\"close()\">\n" +
    "		          <span aria-hidden=\"true\">×</span>\n" +
    "		          <span class=\"sr-only\">Close</span>\n" +
    "		        </button>\n" +
    "		</div>\n" +
    "		<div class=\"modal-body\">\n" +
    "			<div class=\"row\">\n" +
    "				<div class=\"col-xs-5\"><img ng-src=\"/static/img/games/{{game.thumb}}\"></div>\n" +
    "				<div class=\"col-xs-7\">\n" +
    "					<p>{{game.description_en}}</p>\n" +
    "					<a class=\"btn btn-big\" ng-click=\"play()\" ng-if=\"game.authorized\"><span>Play</span></a>\n" +
    "					<a class=\"btn btn-big\" ng-click=\"buy(game)\" ng-if=\"!game.authorized\"><span>Purchase ({{game.price}})</span></a>\n" +
    "				</div>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "		<div class=\"modal-footer\">	\n" +
    "		</div>	\n" +
    "	</script>\n" +
    "</section>");
}]);

angular.module("home/map/arrow.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("home/map/arrow.tpl.html",
    "<div class=\"arrowBlck\">\n" +
    "	<em><img ng-src=\"/static/img/games/{{map.key}}/{{idx}}.png\"></em> {{route.text_zh}} ( {{route.text_en}} )\n" +
    "</div>");
}]);

angular.module("home/map/map.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("home/map/map.tpl.html",
    "<section id=\"splash\" class=\"page-container\">\n" +
    "	<div class=\"intro-wrapper\" xyw-map=\"map.image\">\n" +
    "		<div class=\"row page-top\">\n" +
    "			<div class=\"col-xs-12 text-center\">\n" +
    "				<h1>{{map.title_en}}</h1>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "		<div class=\"clearfix page-top-right\">\n" +
    "			<a href=\"javascript:;\" ng-click=\"close()\" class=\"btn btn-square\"><i class=\"fa fa-times\"></i></a>\n" +
    "		</div>\n" +
    "		\n" +
    "		<div class=\"page-top-left\">\n" +
    "			<a ng-href=\"#!/{{map.$id()}}/avatar\" class=\"btn btn-account\"><i class=\"fa fa-users\"></i>Avatar</a>\n" +
    "			<a href=\"#!/{{map.$id()}}/chest\" class=\"btn btn-account\"><i class=\"fa fa-archive\"></i>Chest</a>\n" +
    "			<a href=\"#!/{{map.$id()}}/account\" ng-click=\"close()\" class=\"btn btn-account\"><i class=\"fa fa-male\"></i>Account</a>\n" +
    "			<a href=\"javascript:;\" ng-click=\"openTip()\" class=\"btn btn-tip\"><i class=\"fa fa-question\"></i></a>\n" +
    "		</div>\n" +
    "		<!--div xyw-block id=\"step{{$index}}\" class=\"animWrapper\" ng-repeat=\"block in blocks\" ng-class=\"{flipped: f1}\" ng-init=\"f1 = false\">\n" +
    "		</div-->\n" +
    "\n" +
    "		<div xyw-arrow class=\"dirArrow ar{{$index}}\" ng-class=\"{active: route.active=='true', pulse: pulse, last:route.last =='true'}\" active=\"{{route.active}}\" ng-repeat=\"route in routes\" ng-mouseenter=\"pulse='pulse'\" ng-mouseout=\"pulse=''\" info=\"{{route.text_en}}\" index=\"{{$index+1}}\">\n" +
    "		</div>\n" +
    "\n" +
    "		<div class=\"goldMenu pull-right\">\n" +
    "			<i></i>\n" +
    "			<div class=\"label\"><span>{{oUser.gold}}</span><div class=\"btn-square\"><i class=\"fa fa-plus\"></i></div></div>\n" +
    "			\n" +
    "		</div>\n" +
    "		<div class=\"page-bot-left\">\n" +
    "			<div class=\"avatar\">\n" +
    "				<span>\n" +
    "					<img ng-src=\"/static/img/avatar/full/{{oUser.avatar.costume}}.png\">\n" +
    "				</span>\n" +
    "				<div class=\"avatar-life\">\n" +
    "					{{oUser.avatar.life}}\n" +
    "				</div>\n" +
    "			</div>\n" +
    "			<div class=\"level btn-square\"><i class=\"fa fa-star-half-o\"></i><span>Level {{oUser.level}}</span></div>\n" +
    "		</div>\n" +
    "\n" +
    "		<script type=\"text/ng-template\" id=\"xywPlayWin.html\">\n" +
    "	        <div class=\"modal-body text-center\" id=\"navBody\" style=\"height: 200px;\">\n" +
    "		        <div class=\"dirArrow ar{{getIdx(route.lesson-1)}}\"><div class=\"arrowBlck\">\n" +
    "					<em><img ng-src=\"/static/img/{{icon}}\"></em> {{route.text_zh}} ( {{route.text_en}} )\n" +
    "				</div></div>\n" +
    "	            <ul class=\"list-inline\" ng-hide=\"subLevel == true\">\n" +
    "	                <li>\n" +
    "	                    <a ng-click=\"use('play')\" ng-class=\"{'complete': isComplete}\"><span class=\"quest\"></span></a>\n" +
    "	                </li>\n" +
    "	                <li>\n" +
    "	                    <a ng-click=\"use('learn')\"><span class=\"explorer\"></span></a>\n" +
    "	                </li>\n" +
    "	                <li>\n" +
    "	                	<a ng-click=\"use('treasure')\"><span class=\"treasure\"></span></a>\n" +
    "	                </li>\n" +
    "	                <li>\n" +
    "	                	<a ng-click=\"use('write')\"><span class=\"challenge\"></span></a>\n" +
    "	                </li>\n" +
    "	            </ul>\n" +
    "	        </div>\n" +
    "    	</script>\n" +
    "\n" +
    "		<script type=\"text/ng-template\" id=\"xywTips.html\">\n" +
    "		    <div class=\"modal-header\">\n" +
    "		        <h3 class=\"modal-title\">How to use the site</h3>\n" +
    "		        <button class=\"btn close\" ng-click=\"close()\" ng-show=\"tips.active==5\">\n" +
    "		          <span aria-hidden=\"true\">×</span>\n" +
    "		          <span class=\"sr-only\">Close</span>\n" +
    "		        </button>\n" +
    "		    </div>\n" +
    "		    <div class=\"modal-body\">\n" +
    "		      <div id=\"tips1\" class=\"tip\" ng-show=\"tips.active==1\">\n" +
    "			    <h5> Click on the Number block to open an active game and start playing. Once you gained over 100 gold in the current game the next game will be available for you. </h5>\n" +
    "		      </div>\n" +
    "		      <div id=\"tips2\" class=\"tip\" ng-show=\"tips.active==2\">\n" +
    "		      	<h5> This shows the amount of gold you have earned, you can use gold to get speical cards, avatar and books etc. </h5>\n" +
    "		      </div>\n" +
    "		      <div id=\"tips3\" class=\"tip\" ng-show=\"tips.active==3\">\n" +
    "			      <h5> Click Avatar and Chest button to check your avatar and the treasure you have. Use account to update your personal info </h5>\n" +
    "		      </div>\n" +
    "		      <div id=\"tips4\" class=\"tip\" ng-show=\"tips.active==4\">\n" +
    "		      	<h5> Click Exit button to leave the current story and try a new one. </h5>\n" +
    "		      </div>\n" +
    "		      <div id=\"tips5\" class=\"tip\" ng-show=\"tips.active==5\">\n" +
    "		      	<h5> Congratulations! You can now start playing the game. </h5>\n" +
    "		      </div>\n" +
    "\n" +
    "		      <ul class=\"tipPagination list-inline\">\n" +
    "		      	<li><button type=\"button\" ng-click=\"prev()\" ng-disabled=\"tips.active==1\" class=\"btn btn-link\">&laquo; Previous tip</button></li>\n" +
    "		      	<li><button type=\"button\" ng-click=\"next()\" ng-disabled=\"tips.active==5\" class=\"btn btn-link\">Next tip &raquo;</button></li>\n" +
    "		      </ul>\n" +
    "\n" +
    "		    </div>\n" +
    "			<div class=\"modal-footer tipsFooter\">\n" +
    "		    </div>\n" +
    "		</script>\n" +
    "	</div>\n" +
    "</section>\n" +
    "		    \n" +
    "\n" +
    "");
}]);

angular.module("home/quest/quest-start.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("home/quest/quest-start.tpl.html",
    "<section class=\"page-container\" id=\"start\">\n" +
    "	<div class=\"intro-wrapper\" xyw-map=\"lesson.stories.story_bg\">\n" +
    "		<div class=\"row page-top\">\n" +
    "			<div class=\"col-xs-12 text-center\">\n" +
    "				<h1>{{lesson.stories.quest.title_en}}</h1>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "		<div class=\"clearfix page-top-right\">\n" +
    "			<a href=\"javascript:;\" ng-click=\"close()\" class=\"btn btn-square\"><i class=\"fa fa-times\"></i></a>\n" +
    "		</div>\n" +
    "		<div class=\"page-main\">\n" +
    "			<div class=\"col-xs-6\">\n" +
    "				<div class=\"start-avatar\">\n" +
    "					<div class=\"avatar-wrapper\">\n" +
    "						<img ng-src=\"/static/img/avatar/full/{{oUser.avatar.costume}}.png\">\n" +
    "					</div>\n" +
    "					<div class=\"avatar-life\" ng-click=\"addLife()\">\n" +
    "						{{oUser.avatar.life}}\n" +
    "					</div>\n" +
    "				</div>\n" +
    "				<div class=\"text-center avatar-cards\">\n" +
    "					<ul class=\"list-inline\">\n" +
    "						<li ng-repeat=\"i in ['tip1', 'tip2', 'tip3']\" ng-class=\"{empty: !oUser.avatar.cards[i]}\" ng-click=\"buyCard()\" class=\"sCard\">\n" +
    "							<div class=\"num\" ng-show=\"oUser.avatar.cards[i]\"><i>{{oUser.avatar.cards[i]}}</i></div>\n" +
    "							<div class=\"card-inner\" ng-show=\"oUser.avatar.cards[i]\">\n" +
    "								<div class=\"card-img\">\n" +
    "									<img ng-src=\"/static/img/cards/{{i}}.jpg\">\n" +
    "								</div>\n" +
    "								<div class=\"card-txt text-center\">\n" +
    "									<h1>{{cards[i].name_en}}</h1>\n" +
    "									<p>{{cards[i].usage_en}}</p>\n" +
    "								</div>\n" +
    "							</div>\n" +
    "						</li>\n" +
    "					</ul>\n" +
    "				</div>\n" +
    "			</div>\n" +
    "			<div class=\"col-xs-6 text-center\">\n" +
    "				<div class=\"start-wrapper\">\n" +
    "					<img src=\"/static/img/common/start.png\" class=\"img-responsive\"/>\n" +
    "				</div>\n" +
    "				<div class=\"btn-big btn\" ng-click=\"start()\" ng-class=\"{'disabled': oUser.avatar.life <=0}\">\n" +
    "					<div>\n" +
    "						<span>Start</span>\n" +
    "					</div>\n" +
    "				</div>				\n" +
    "			</div>			\n" +
    "		</div>\n" +
    "		<div class=\"page-footer\">\n" +
    "			Use Special cards to work with the quest\n" +
    "		</div>\n" +
    "	</div>\n" +
    "\n" +
    "	<script type=\"text/ng-template\" id=\"xywLife.html\">\n" +
    "		<div class=\"modal-header\">\n" +
    "	        <h3 class=\"modal-title\">Purchase</h3>\n" +
    "	        <button class=\"btn close\" ng-click=\"cancel()\">\n" +
    "	          <span aria-hidden=\"true\">×</span>\n" +
    "	          <span class=\"sr-only\">Close</span>\n" +
    "	        </button>\n" +
    "		</div>\n" +
    "		<div class=\"modal-body\">		\n" +
    "			<h1 ng-show=\"bEnable\">100 gold for extra life</h1>\n" +
    "			<h1 ng-show=\"!bEnable\">Not enough gold</h1>\n" +
    "			<a class=\"btn btn-big\" ng-click=\"extraLife()\" ng-show=\"bEnable\"><span>Buy</span></a>\n" +
    "			<a class=\"btn btn-big\" ng-click=\"cancel()\"><span>Cancel</span></a> \n" +
    "		</div>\n" +
    "		<div class=\"modal-footer\">\n" +
    "		</div>\n" +
    "	</script>\n" +
    "\n" +
    "</section>	");
}]);

angular.module("home/quest/quest-story.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("home/quest/quest-story.tpl.html",
    "<section class=\"page-container\" id=\"story\">\n" +
    "	<div class=\"intro-wrapper\" xyw-map=\"lesson.stories.story_bg\">\n" +
    "		<div class=\"row page-top\">\n" +
    "			<div class=\"col-xs-12 text-center\">\n" +
    "				<h1>{{lesson.stories.quest.title_en}}</h1>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "		<div class=\"clearfix page-top-right\">\n" +
    "			<a href=\"javascript:;\" ng-click=\"close()\" class=\"btn btn-square\"><i class=\"fa fa-times\"></i></a>\n" +
    "		</div>\n" +
    "		<div class=\"row\" ng-show=\"!showQuest\">\n" +
    "			<div class=\"col-xs-4\" />\n" +
    "			<div class=\"col-xs-8\">\n" +
    "				<div class=\"row\">\n" +
    "					<div class=\"dialog-q\">\n" +
    "						<h4>{{lesson.stories.character_en}}</h4>\n" +
    "						<div class=\"dialog-i dialog-box\">{{lesson.stories.dialogues[idx].q_en}}</div>\n" +
    "					</div>\n" +
    "				</div>\n" +
    "			</div> \n" +
    "		</div>\n" +
    "		<div class=\"page-bot-right\" ng-show=\"!showQuest\">\n" +
    "			<div class=\"dialog-a dialog-box\">\n" +
    "				{{lesson.stories.dialogues[idx].a_en}}\n" +
    "				<a href=\"javascript:;\" ng-click=\"next()\" class=\"btn btn-red\" ng-class=\"{flash:isFlash}\" ng-mouseover=\"isFlash=true;\" ng-mouseout=\"isFlash=false;\"><i class=\"fa fa-caret-right\"></i></a>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "		<div class=\"row quest\" ng-show=\"showQuest\">\n" +
    "			<div class=\"col-xs-4\" />\n" +
    "			<div class=\"col-xs-8 text-center\">\n" +
    "				<div class=\"btn-big\">\n" +
    "					<div class=\"row\">\n" +
    "						<div class=\"col-xs-1\">\n" +
    "							<img ng-src=\"/static/img/games/{{lesson.stories.quest_img}}\">\n" +
    "						</div>\n" +
    "						<div class=\"col-xs-11\">\n" +
    "							<h6>{{lesson.stories.quest.title_en}}</h6>\n" +
    "							<p>(Complete this quest gain 50 gold)</p>\n" +
    "						</div>\n" +
    "					</div>\n" +
    "				</div>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "		<div class=\"page-bot-right col-xs-8 text-center\" ng-show=\"showQuest\">\n" +
    "			<div class=\"btn btn-big btn-exp\" ng-click=\"go('learn')\"><div>Gain the knowledge</div></div>\n" +
    "			<div class=\"btn btn-big btn-ok\" ng-click=\"go('play')\"><div>ok!</div></div>\n" +
    "		</div>\n" +
    "		<div class=\"page-bot-left\">\n" +
    "			<img ng-src=\"/static/img/stories/{{lesson.stories.character_img}}\">\n" +
    "		</div>\n" +
    "	</div>\n" +
    "</section>	");
}]);

angular.module("products/books/audiobook/audiobook-detail.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("products/books/audiobook/audiobook-detail.tpl.html",
    "<section id=\"detail\" class=\"inside\">\n" +
    "	<div class=\"clearfix page-top-right\">\n" +
    "		<button class=\"btn btn-square\" ng-click=\"closeWin()\">\n" +
    "			<i class=\"fa fa-times\"></i>\n" +
    "		</button>\n" +
    "	</div>\n" +
    "	<div class=\"row-fluid {{categoryId}}\">\n" +
    "			<div class=\"detail-wrapper\">	\n" +
    "					<div xyw-book items=\"items\" product=\"itemDetail\">\n" +
    "						<span xyw-book-control class=\"book-control\"/>\n" +
    "						<span class=\"divider\"></span>\n" +
    "						<span xyw-book-audio class=\"book-audio\"></span>\n" +
    "						<span class=\"divider\"></span>\n" +
    "						<span xyw-book-subtitle />\n" +
    "						<span class=\"divider\"></span>\n" +
    "						<span class=\"footer-title\">{{itemDetail.text}} </span> \n" +
    "					</div>\n" +
    "				</div>\n" +
    "			</div>		\n" +
    "	</div>\n" +
    "</section>");
}]);

angular.module("products/books/book-audio.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("products/books/book-audio.tpl.html",
    "<audio media-player=\"audioPlayer\" id=\"audioPlayer\">	\n" +
    "	<source src=\"/static/sound/blank.mp3\" type=\"audio/mpeg\">\n" +
    "	Your browser isn't invited for super fun audio time.\n" +
    "	autoplay attribute seems to work better for ios5, cause probolem for desktop\n" +
    "</audio>\n" +
    "<ul class=\"player list-inline\">\n" +
    "	<li ng-click=\"audioPlayer.playPause(true)\">\n" +
    "		<button class=\"btn-borderless\">\n" +
    "			<i class=\"fa fa-play fa-2x\" ng-show=\"!audioPlayer.playing\"></i>\n" +
    "			<i class=\"fa fa-pause fa-2x\" ng-show=\"audioPlayer.playing\"></i>\n" +
    "		</button>\n" +
    "	</li>\n" +
    "	<li class=\"volume\" ng-click=\"audioPlayer.toggleMute()\" ng-show=\"!isMobile()\">\n" +
    "		<button class=\"btn-borderless\">\n" +
    "			<span class=\"fa-stack fa-lg\">\n" +
    "				<i class=\"fa fa-volume-up fa-stack-2x\"></i>\n" +
    "				<i class=\"fa fa-ban fa-stack-2x text-danger\" ng-show=\"audioPlayer.muted\"></i>\n" +
    "			</span>\n" +
    "		</button>\n" +
    "	</li>\n" +
    "	<li ng-show=\"!isMobile()\">\n" +
    "		<div class=\"ui-slider\">\n" +
    "			<div class=\"ui-slider-track\">\n" +
    "				<div class=\"ui-slider-range\"></div>\n" +
    "				<div class=\"ui-slider-handle\"></div>\n" +
    "			</div>\n" +
    "			<input type=\"text\">\n" +
    "		</div>\n" +
    "	</li>\n" +
    "</ul>");
}]);

angular.module("products/books/book-page.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("products/books/book-page.tpl.html",
    "<ul class=\"pagination list-unstyled\">\n" +
    "	<li rel=\"notnumber\" class=\"prev\" ng-class=\"{disabled: noPrev()}\">\n" +
    "		<a href=\"javascript:;\" ng-click=\"selectPrev()\"><img ng-src=\"{{CONFIG.imgBase}}/b-prev.png\"></a></li>\n" +
    "	<li rel=\"pagelink\" ng-repeat=\"p in items\" value=\"{{$index}}\" ng-class=\"{active: isActive(p)}\"  ng-click=\"selectPage(p.id)\">\n" +
    "		<a href=\"javascript:;\"><img ng-src=\"{{CONFIG.imgBase}}/story/{{p.picture}}\"></a>\n" +
    "	</li>\n" +
    "	<li rel=\"notnumber\" class=\"next\" ng-class=\"{disabled: noNext()}\">\n" +
    "		<a href=\"javascript:;\" ng-click=\"selectNext()\"><img ng-src=\"{{CONFIG.imgBase}}/b-next.png\"></a></li>\n" +
    "</ul>");
}]);

angular.module("products/books/book.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("products/books/book.tpl.html",
    "<div class=\"page-wrapper\">\n" +
    "	<div class=\"page-img\" ng-repeat=\"p in items\">\n" +
    "		<img ng-src=\"{{CONFIG.imgBase}}/story/{{p.picture}}\">\n" +
    "		<div class=\"subtitle\" ng-class=\"{off:textOff}\" ng-bind-html=\"p.text\" ng-if=\"p.id !=0\"/>\n" +
    "		<div class=\"cover\" ng-if=\"p.id == 0\" ng-click=\"goToPage(1)\">	\n" +
    "			<div class=\"topTitle\">\n" +
    "				<!--h4>{{product.description_en}}</h4-->\n" +
    "			</div>	\n" +
    "		</div>\n" +
    "	</div>	\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"book-footer\" ng-transclude></div>");
}]);

angular.module("products/games/cards/cards-detail.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("products/games/cards/cards-detail.tpl.html",
    "<div class=\"col-xs-10\" items=\"items\" hideText=\"hideText\" indicator=\"$parent.activeId\" xyw-card></div>\n" +
    "<div class=\"choices col-xs-2 pull-right\">\n" +
    "	<ul class=\"list-unstyled\">\n" +
    "		<li class=\"card-single\" ng-click=\"selCard($index)\" ng-repeat=\"i in items track by $index\">\n" +
    "			<div class=\"card-inner text-center\" ng-if=\"$index < 12\">\n" +
    "				<img ng-src=\"{{CONFIG.imgBase}}/thumb/cards/{{i.thumb}}\" class=\"smallImg\">\n" +
    "				<div class=\"card-text\">\n" +
    "					{{i.text}}\n" +
    "				</div>\n" +
    "			</div>\n" +
    "		</li>\n" +
    "	</ul>					\n" +
    "</div>\n" +
    "<div class=\"clearfix page-top-right\">\n" +
    "	<a href=\"javascript:;\" ng-click=\"closeWin()\" class=\"btn btn-square\"><i class=\"fa fa-times\"></i></a>\n" +
    "</div>");
}]);

angular.module("products/games/cards/cards-single.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("products/games/cards/cards-single.tpl.html",
    "<div class=\"feature\" ng-show=\"items[indicator].thumb\">\n" +
    "	<div id=\"card-front\" class=\"active card-main\">\n" +
    "		<div class=\"row\">\n" +
    "			<div class=\"col-xs-2\">\n" +
    "				<img ng-src=\"{{CONFIG.imgBase}}/thumb/cards/{{items[indicator].thumb}}\" class=\"mainImg\">\n" +
    "				<div class=\"speaker pull-right\" ng-click=\"speak()\"><a></a></div>\n" +
    "			</div>\n" +
    "			<div class=\"card-text col-xs-10\" ng-bind-html=\"items[indicator].backText\"></div>\n" +
    "		</div>\n" +
    "		<div class=\"row\">\n" +
    "			<div class=\"col-xs-12\" ng-bind-html=\"items[indicator].mainText\"></div>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "	<div id=\"card-back\" class=\"card-main\">\n" +
    "		<div ng-bind-html=\"items[indicator].backText\" class=\"backhtml\"></div>\n" +
    "		<img ng-src=\"{{CONFIG.imgBase}}/thumb/cards/{{items[indicator].back}}\" class=\"mainImg\" ng-if=\"items[indicator].back\">\n" +
    "	</div>\n" +
    "	<audio data-file=\"{{CONFIG.soundBase}}/{{items[indicator].sound}}\" media-player=\"audioCard\" id=\"audioCard\">\n" +
    "		<source src=\"/static/sound/blank.mp3\" type=\"audio/mpeg\">\n" +
    "			Your browser isn't invited for super fun audio time. autoplay attribute seems to work better for ios5, cause probolem for desktop\n" +
    "	</audio>\n" +
    "	<ul class=\"card-nav list-unstyled\">\n" +
    "		<li class=\"prev\" ng-click=\"selPrev()\" ng-class=\"{disabled: noPrevious()}\"><a></a></li>\n" +
    "		\n" +
    "		<li class=\"next\" ng-click=\"selNext()\" ng-class=\"{disabled: noNext()}\"><a></a></li>\n" +
    "	</ul>\n" +
    "</div>");
}]);

angular.module("products/games/fillinblank/droppable.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("products/games/fillinblank/droppable.tpl.html",
    "<div class=\"col-xs-3 img\" ng-show=\"items[indicator].picture\">\n" +
    "	<img ng-src=\"{{CONFIG.imgBase}}/{{items[indicator].picture}}\" class=\"mainImg img-responsive\">\n" +
    "	<div class=\"speaker pull-right\" ng-click=\"speak()\" ng-show=\"items[indicator].sound\"><a></a></div>\n" +
    "	<audio data-file=\"{{CONFIG.soundBase}}/{{items[indicator].sound}}\" media-player=\"audioFillblank\">\n" +
    "		<source src=\"/static/sound/blank.mp3\" type=\"audio/mpeg\">\n" +
    "			Your browser isn't invited for super fun audio time. autoplay attribute seems to work better for ios5, cause probolem for desktop\n" +
    "	</audio>\n" +
    "</div>\n" +
    "<div class=\"txt\" ng-class=\"items[indicator].picture =='' ? 'col-xs-12' : 'col-xs-9'\">\n" +
    "	<div class=\"question\">\n" +
    "		<div class=\"sentence1 sentence\">{{items[indicator].sentence1}}</div>\n" +
    "		<div class=\"blank sentence\"></div>\n" +
    "		<div class=\"sentence2 sentence\">{{items[indicator].sentence2}}</div>\n" +
    "	</div>\n" +
    "	<div class=\"clearfix\"></div>\n" +
    "	<div class=\"character\" id=\"char{{$index+1}}\" xyw-draggable ng-repeat=\"choice in items[indicator].choices\" ng-class=\"{'out': items[indicator].elimation[$index] == true, 'reveal': items[indicator].reveal && items[indicator].reveal == $index}\">\n" +
    "		{{choice}}\n" +
    "	</div>\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("products/games/fillinblank/fillinblank.edit.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("products/games/fillinblank/fillinblank.edit.tpl.html",
    "<div class=\"col-xs-2 choices\">\n" +
    "	<div class=\"choices-wrapper\">\n" +
    "		<div class=\"curAvatar\">\n" +
    "			<div class=\"avatar\">\n" +
    "				<span>\n" +
    "					<img ng-src=\"/static/img/avatar/full/{{oUser.avatar.costume}}.png\">\n" +
    "				</span>\n" +
    "				<div class=\"avatar-life\">\n" +
    "					{{oUser.avatar.life}}\n" +
    "				</div>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "		<ul class=\"list-unstyled lst-cards\">\n" +
    "			<li ng-repeat=\"i in ['tip1', 'tip2', 'tip3']\" ng-class=\"{empty: !oUser.avatar.cards[i]}\" ng-click=\"useCard(i)\" class=\"sCard\">\n" +
    "				<div class=\"num\" ng-show=\"oUser.avatar.cards[i]\"><i>{{oUser.avatar.cards[i]}}</i></div>\n" +
    "				<div class=\"card-inner\" ng-show=\"oUser.avatar.cards[i]\">\n" +
    "					<div class=\"card-img\">\n" +
    "						<img ng-src=\"/static/img/cards/{{i}}.jpg\">\n" +
    "					</div>\n" +
    "				</div>\n" +
    "			</li>\n" +
    "		</ul>\n" +
    "	</div>\n" +
    "</div>\n" +
    "<div class=\"col-xs-10\">\n" +
    "	<div class=\"imgs-wrapper-FIB\">\n" +
    "	    <div class=\"gameArea\" items=\"itemDetail.items\" indicator=\"activeId\" xyw-fillblank on-close=\"closeWin(complete)\">\n" +
    "	    </div>\n" +
    "	</div>\n" +
    "</div>\n" +
    "<div class=\"clearfix page-top-right\">\n" +
    "	<a href=\"javascript:;\" ng-click=\"closeWin(false)\" class=\"btn btn-square\"><i class=\"fa fa-times\"></i></a>\n" +
    "</div>\n" +
    "<div class=\"page-footer\">Drag the answer to the empty box above, use the cards on the left if you need help.If you run out of life, game is over.</div>\n" +
    "\n" +
    "");
}]);

angular.module("products/games/memory/memory-detail.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("products/games/memory/memory-detail.tpl.html",
    "<div class=\"clearfix page-top-right\">\n" +
    "	<a href=\"javascript:;\" ng-click=\"closeWin(false)\" class=\"btn btn-square\"><i class=\"fa fa-times\"></i></a>\n" +
    "</div>\n" +
    "<div items=\"items\" xyw-memory on-close=\"closeWin(true)\"></div>\n" +
    "<div class=\"page-footer\">\n" +
    "This is like memory game, click to find matching cards that have the same character.\n" +
    "</div>");
}]);

angular.module("products/games/memory/memory-single.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("products/games/memory/memory-single.tpl.html",
    "<div class=\"memory-cards\">\n" +
    "	<table>\n" +
    "	<tr ng-repeat=\"row in grid\">\n" +
    "		<td ng-repeat=\"tile in row\" ng-click=\"flipTile(tile)\">\n" +
    "			<div class=\"container\">\n" +
    "				<div class=\"card\" ng-class=\"{flipped: tile.flipped}\">\n" +
    "					<div class=\"card-single front\">\n" +
    "						<div class=\"pattern\"></div>\n" +
    "					</div>\n" +
    "					<div class=\"card-single back\">\n" +
    "						<img class=\"front\" ng-src=\"{{CONFIG.imgBase}}/thumb/cards/{{tile.thumb}}\" ng-if=\"tile.thumb\">						\n" +
    "						<p ng-if=\"tile.thumb\">{{tile.text}}</p>\n" +
    "						<h1 ng-if=\"!tile.thumb\">{{tile.text}}</h1>\n" +
    "					</div>\n" +
    "				</div>\n" +
    "			</div>\n" +
    "		</td>\n" +
    "	</tr>\n" +
    "	</table>\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("products/games/tracing/tracing-single.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("products/games/tracing/tracing-single.tpl.html",
    "<div class=\"tracing-main col-xs-10\">\n" +
    "	<div class=\"feature\">\n" +
    "		<canvas character=\"items[indicator].text\" strokes=\"items[indicator].strokes\" class=\"single-char\" xyw-char>Your browser does not support canvas</canvas>\n" +
    "		<audio data-file=\"{{CONFIG.soundBase}}/{{items[indicator].sound}}\" media-player=\"audioTracing\">\n" +
    "			<source src=\"/static/sound/blank.mp3\" type=\"audio/mpeg\">\n" +
    "				Your browser isn't invited for super fun audio time. autoplay attribute seems to work better for ios5, cause probolem for desktop\n" +
    "		</audio>\n" +
    "		<div class=\"feature-footer\">\n" +
    "			<div class=\"speaker pull-right\" ng-click=\"speak()\"><a href=\"javascript:;\"></a></div>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "</div>\n" +
    "<div class=\"choices col-xs-2\">\n" +
    "	<div class=\"feature-head\">\n" +
    "		<div class=\"single-char\" ng-repeat=\"img in imgs\">\n" +
    "			<div class=\"choice-text\">\n" +
    "				<img ng-src=\"{{img}}\" />\n" +
    "				<br/>\n" +
    "				<ul class=\"list-inline points\">\n" +
    "			    	<li ng-repeat=\"i in range(3) track by $index\">\n" +
    "			    		<i class=\"xyw-star\" ng-class=\"{empty: scores[$parent.$index]< $index+1}\"></i>\n" +
    "			    	</li>\n" +
    "		    	</ul>			\n" +
    "			</div>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "</div>	");
}]);

angular.module("products/games/tracing/tracing.detail.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("products/games/tracing/tracing.detail.tpl.html",
    "<div ng-show=\"showMenu\" class=\"text-center mainMenu\">\n" +
    "\n" +
    "	<ul class=\"list-inline\">\n" +
    "		<li ng-repeat=\"(key, obj) in items\" ng-class=\"{disabled: points[key]}\">\n" +
    "			<div class=\"single-char\" ng-click=\"selChar(key)\">\n" +
    "				<div class=\"choice-text\">{{obj.text}}</div>\n" +
    "			</div>\n" +
    "			<ul class=\"list-inline points\" ng-if=\"points[key]\">\n" +
    "				<li><i class=\"xyw-gold\"></i></li>\n" +
    "			</ul>\n" +
    "		</li>\n" +
    "	</ul>\n" +
    "</div>\n" +
    "<div items=\"items\" indicator=\"activeId\" xyw-tracing on-close=\"closeWin(complete)\" class=\"tracing-detail\" ng-if=\"!showMenu\"></div>\n" +
    "<div class=\"clearfix page-top-right\">\n" +
    "	<a href=\"javascript:;\" ng-click=\"closeWin()\" class=\"btn btn-square\"><i class=\"fa fa-times\"></i></a>\n" +
    "</div>\n" +
    "<div class=\"page-footer\">\n" +
    "<span ng-show=\"showMenu\">Click on the character above to start challenge. Once you complete the challenge and get rewarded you can still play, but you will only get 1 gold per character.</span>\n" +
    "<span ng-show=\"!showMenu\">Follow the animation to write the character 3 times. If you finish a stroke and next animation did not start, repeat the stroke.</span>\n" +
    "</div>");
}]);

angular.module("products/products.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("products/products.tpl.html",
    "<section id=\"detail\" class=\"inside\">\n" +
    "	<div class=\"row-fluid {{categoryId}}\">\n" +
    "		<div ng-include src=\"'products/books/audiobook/audiobook-detail.tpl.html'\" class=\"product-book\" ng-if=\"categoryId=='book'\"/>\n" +
    "\n" +
    "		<div class=\"animate-switch cards\" ng-if=\"categoryId=='game' && itemDetail.subCategory=='card'\" ng-include src=\"'products/games/cards/cards-detail.tpl.html'\" /> \n" +
    "\n" +
    "		<div class=\"animate-switch chars\" ng-if=\"categoryId=='game' && itemDetail.subCategory=='tracing'\" ng-include src=\"'products/games/tracing/tracing.detail.tpl.html'\" />\n" +
    "\n" +
    "		<div class=\"animate-switch fillinblank\" ng-if=\"categoryId=='game' && itemDetail.subCategory=='fillinblank'\" ng-include src=\"'products/games/fillinblank/fillinblank.edit.tpl.html'\" />\n" +
    "\n" +
    "		<div class=\"animate-switch memory\" ng-if=\"categoryId=='game' && itemDetail.subCategory=='memory'\" ng-include src=\"'products/games/memory/memory-detail.tpl.html'\" class=\"product-memory\"/>\n" +
    "\n" +
    "	</div>\n" +
    "	<div class=\"rewardAnim\" id=\"stars\">\n" +
    "	</div>\n" +
    "	<script type=\"text/ng-template\" id=\"xywNoaccess.html\">\n" +
    "	    <div class=\"modal-header\">\n" +
    "	        <h3 class=\"modal-title\">No Access</h3>\n" +
    "	        <button class=\"btn close\" ng-click=\"cancel()\">\n" +
    "	          <span aria-hidden=\"true\">×</span>\n" +
    "	          <span class=\"sr-only\">Close</span>\n" +
    "	        </button>\n" +
    "	    </div>\n" +
    "	    <div class=\"modal-body\">\n" +
    "	    	Your user level is not high enough to view that content. Please work harder!\n" +
    "	    </div>\n" +
    "	    <div class=\"modal-footer\">\n" +
    "	        <button class=\"btn btn-warning\" ng-click=\"cancel()\">Close</button>\n" +
    "	    </div>\n" +
    "    </script>\n" +
    "    <script type=\"text/ng-template\" id=\"xywSuccess.html\">\n" +
    "	    <div class=\"modal-header\">\n" +
    "	        <h3 class=\"modal-title\">Thanks for reading!</h3>\n" +
    "	        <button class=\"btn close\" ng-click=\"cancel()\">\n" +
    "	          <span aria-hidden=\"true\">×</span>\n" +
    "	          <span class=\"sr-only\">Close</span>\n" +
    "	        </button>\n" +
    "	    </div>\n" +
    "	    <div class=\"modal-body\">\n" +
    "	    	<div class=\"row\">\n" +
    "	    		<div class=\"col-xs-2\">\n" +
    "	    			<img ng-src=\"{{CONFIG.imgBase}}/noaward-a.png\" ng-if=\"points==0\">\n" +
    "		    		<img ng-src=\"{{CONFIG.imgBase}}/award-a.png\" ng-if=\"points > 0\">\n" +
    "	    		</div>\n" +
    "	    		<div class=\"col-xs-10\">	    			\n" +
    "	    			<h2>\n" +
    "	    				You earned \n" +
    "				    	<span>{{points}}</span>\n" +
    "				 		<i class=\"xyw-gold\"></i> !\n" +
    "				 	</h2>\n" +
    "	    		</div>\n" +
    "	    	</div>\n" +
    "	    	<h2>\n" +
    "\n" +
    "\n" +
    "	    	</h2>\n" +
    "	    </div>\n" +
    "	    <div class=\"modal-footer\">\n" +
    "	    	<a ng-click=\"checkReward()\" ng-if=\"showRewards\" class=\"pull-left\">Check your rewards <img ng-src=\"{{CONFIG.imgBase}}/gift.png\" width=\"30px\"/> </a>\n" +
    "	    	<button class=\"btn btn-info\" ng-click=\"again()\" ng-if=\"category!= 'tracing' && category!= 'fillinblank'\">Try Again</button>\n" +
    "	        <button class=\"btn btn-warning\" ng-click=\"cancel()\">Close</button>\n" +
    "	    </div>\n" +
    "    </script>\n" +
    "</section>\n" +
    "\n" +
    "\n" +
    "");
}]);

angular.module("public/about.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("public/about.tpl.html",
    "<section id=\"public\" class=\"public\">\n" +
    "    <div ng:include=\"'public/public-nav.tpl.html'\"></div>\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-xs-3\">\n" +
    "            <img src=\"/static/img/common/amberGreen.png\" class=\"pull-right img-responsive\">\n" +
    "        </div>\n" +
    "        <div class=\"col-xs-9\">\n" +
    "            <div class=\"col-xs-12\">\n" +
    "                <div class=\"page-wrapper\">\n" +
    "                    <ul class=\"list-inline\">\n" +
    "                        <li><a href=\"https://www.facebook.com/amberswd\" target=\"_blank\"><img src=\"https://www.facebookbrand.com/img/assets/asset.f.logo.lg.png\" width=\"22\" height=\"22\" alt=\"facebook\"></a></li>\n" +
    "                        <li><a href=\"https://www.pinterest.com/yunyunl/ambers-world/\" target=\"_blank\"><img src=\"https://business.pinterest.com/sites/business/themes/custom/pinterest_business/logo.png\" width=\"22\" height=\"22\" alt=\"pinterest\"></a></li>\n" +
    "                        <li><a href=\"http://amberswd.tumblr.com/\" target=\"_blank\"><img src=\"https://secure.assets.tumblr.com/images/logo_page/img_logo_34465d.png\" width=\"22\" height=\"22\" alt=\"tumblr\"></a></li>\n" +
    "                        <li><a href=\"http://amberwd.wordpress.com\" target=\"_blank\"><img src=\"https://s.w.org/about/images/logos/wordpress-logo-32-blue.png\" width=\"22\" height=\"22\" alt=\"wordpress\"></a></li>\n" +
    "                    </ul>\n" +
    "                    <p>\n" +
    "                        AmbEr’s World is created for anyone that is interested to learn Chinese as a second language. The site groups 50 new characters together as a game, each game uses a unique game map and let user advance 5 characters a time (each new point/lesson in the map will be open after you gained 100 gold from your previous learning experience).\n" +
    "                    </p>\n" +
    "                    <p>\n" +
    "                        The first game/map are free to use as long as you logged into the site. Other new games will charge $3.99 per game. We have finished developing 2 games and plan to roll out more.\n" +
    "                    </p>\n" +
    "                    <p>\n" +
    "                        The main Character in the game is called Amber. She is a 5 year old Chinese American girl, whose mother is Chinese and father is American. We are trying to sample part of Chinese culture and the language through the perspective of a 5 year old. AmbEr's World has published and illustrated 10 books based on our main character Amber. These books are available through out the game, but if you  interested to read the books only, right now you can purchase kindle version on amazon, here is the <a href='https://amberwd.wordpress.com/books-on-amazon/' target='_blank'>list of the books</a>.\n" +
    "                    </p>\n" +
    "                    <p>\n" +
    "                        The birth of AmbEr's world has to contribute largely to my now 6 year old girl, Amber. Since she was born, I have been busy introducing her to Chinese. A language that is not commonly used in her day to day life, yet has great impact on me. I soon found I don't have many resources to use, it is hard to buy Chinese teaching materials, books, not to say high quality and relevant products. Also the books and learning materials are costly, not like Children's book in English, with a library card, I can get tons of books for free, Chinese books and learning materials, evenly the cheapest flash cards costs me 3 or 4 dollars. As a developer/designer for almost 2 decades, the idea of creating a Chinese learning tool came to my mind. After a year's work, AmbEr's World finally came alive. There's still a lot to do for the site, but I feel it is good enough for people to start using the site and give me feed back, if you have any questions or comments, free feel to email me at: <a href='mailto:info@bcstudioinc.net'>info@bcstudioinc.net</a>.\n" +
    "                    </p>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</section>");
}]);

angular.module("public/faq.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("public/faq.tpl.html",
    "<section id=\"public\" class=\"public\">\n" +
    "    <div ng:include=\"'public/public-nav.tpl.html'\"></div>\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-xs-3\">\n" +
    "            <img src=\"/static/img/common/amberGreen.png\" class=\"pull-right img-responsive\">\n" +
    "        </div>\n" +
    "        <div class=\"col-xs-9\">\n" +
    "            <div class=\"col-xs-12\">\n" +
    "                <div class=\"page-wrapper\">\n" +
    "                    <ul>\n" +
    "                        <li>\n" +
    "                            <h5>Who can use AmbEr's World?</h5>\n" +
    "                            <p>AmbEr's World is best used for kids/adults that has some chinese background (either parents speak Chinese or going to some kind of Chinese learning program) that want to improve or gain more interest in learning the language. It can also be used as an intro for anyone that is interested to gain first hand experience in that language.</p>\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "                            <h5>How does AmbEr's World work?</h5>\n" +
    "                            <p>It groups 50 characters in a single map, where you practice these characters through different games, e.g. writing board, flash cards, memory game, books, etc. Each map has about 10 lessons, eash lesson has 5 new characters. As you play the game, based on your performance you gain points. Once you accumulated enough points and in our case 100 gold, you will get access to the next lesson. </p>\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "                            <h5>Why I can only view the first game?</h5>\n" +
    "                            <p>The first map/game is free to public, once you signed in to the site you can use it. You can purchase other games for $3.99/game, More new games are coming.</p>\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "                            <h5>I am only interested to try some of the game not the others, can I do that?</h5>\n" +
    "                            <p>Sure, you can only purchase the game you interested.</p>\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "                            <h5>The question I want to ask is not here, what should I do?</h5>\n" +
    "                            <p>You can send us an email at: info@bcstudioinc.net, we will reply to you in a timely manner.</p>\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</section>");
}]);

angular.module("public/login.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("public/login.tpl.html",
    "<section id=\"public\" class=\"public\">\n" +
    "    <div ng:include=\"'public/public-nav.tpl.html'\"></div>\n" +
    "    <div class=\"row-fluid\">\n" +
    "        <div class=\"col-xs-3\">\n" +
    "            <img src=\"/static/img/common/amberGreen.png\" class=\"pull-right img-responsive\">\n" +
    "        </div>\n" +
    "        <div class=\"col-xs-9\">\n" +
    "            <div class=\"col-xs-12\">\n" +
    "                <h1>Welcome to AmbEr's World</h1>\n" +
    "                <h4>Please first login to use the site. If you register to our site please use a valid email address as username. Click guest button if you don't want to make a commitment. When logged in as guest your info will be saved for 24 hours if you don't choose to log out. You can also login use your soical network. Check out this <a href='https://youtu.be/3seFsNgF1MQ' target='_blank'>youtube demo</a> or <a href='/#!faq' target='_parent'>FAQ page</a> if you need further assistance.</h4>\n" +
    "                <form id=\"frmLogin\">\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label for=\"txtEmail\"><i class=\"fa fa-envelope\"></i></label>\n" +
    "                        <input type=\"email\" class=\"form-control\" id=\"txtEmail\" placeholder=\"enter email\" ng-model=\"email\" name=\"email\">\n" +
    "                    </div>\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label for=\"txtPass\"><i class=\"fa fa-key\"></i></label>\n" +
    "                        <input type=\"password\" class=\"form-control\" id=\"txtPass\" placeholder=\"password\" name=\"password\" ng-model=\"password\">\n" +
    "                    </div>\n" +
    "                    <button class=\"btn btn-normal\" ng-click=\"login()\">Log in</button>\n" +
    "                    <button class=\"btn btn-normal\" ng-click=\"register()\">Register</button>\n" +
    "                    <a href=\"javascript:;\" class=\"showReset\" ng-click=\"showReset()\">Forgot Password?</a>\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <h5>Or login with one of the social network:</h5>\n" +
    "                        <div class=\"btn-group\">\n" +
    "                            <a href=\"javascript:;\" class=\"btn btn-primary\" ng-click=\"login('facebook')\">\n" +
    "                                <i class=\"fa fa-facebook-square\"></i> Facebook</a>\n" +
    "                            <a href=\"#\" class=\"btn btn-info\" ng-click=\"login('twitter')\">\n" +
    "                                <i class=\"fa fa-twitter\"></i> Twitter</a>\n" +
    "                            <a href=\"#\" class=\"btn btn-default\" ng-click=\"login('google')\">\n" +
    "                                <i class=\"fa fa-google-plus-square\"></i> Google</a>\n" +
    "                            <a href=\"#\" class=\"btn btn-danger\" ng-click=\"login('guest')\">Guest</a>\n" +
    "                        </div>\n" +
    "                	</div>\n" +
    "                	<p ng-show=\"err\" class=\"error\">{{err}}</p>\n" +
    "                </form>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <script type=\"text/ng-template\" id=\"xywResetPass.html\">\n" +
    "        <div class=\"modal-header\">\n" +
    "            <h3 class=\"modal-title\">Reset Password</h3>\n" +
    "            <button class=\"btn close\" ng-click=\"close()\">\n" +
    "              <span aria-hidden=\"true\">×</span>\n" +
    "              <span class=\"sr-only\">Close</span>\n" +
    "            </button>\n" +
    "        </div>\n" +
    "        <div class=\"modal-body\">\n" +
    "            Please provide your email address: \n" +
    "            <input type=\"text\" ng-model=\"reset.email\">\n" +
    "            <button class-\"btn btn-info\" ng-click=\"resetPassword(reset.email)\">Send Password</button>\n" +
    "            <p>{{reset.msg}}</p>\n" +
    "        </div>\n" +
    "        <div class=\"modal-footer tipsFooter\">\n" +
    "        </div>\n" +
    "    </script>\n" +
    "</section>");
}]);

angular.module("public/public-nav.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("public/public-nav.tpl.html",
    "    <div class=\"clearfix\">\n" +
    "        <ul class=\"nav nav-tabs pull-right\">\n" +
    "            <li ng-class=\"{active: title == 'Login'}\"><a href=\"#!/login\">Log in</a></li>\n" +
    "            <li ng-class=\"{active: title == 'About Us'}\"><a href=\"#!/ambers-world\">About Us</a></li>\n" +
    "            <li ng-class=\"{active: title == 'Faq'}\"><a href=\"#!/faq\">FAQ</a></li>\n" +
    "        </ul>\n" +
    "    </div>");
}]);

angular.module('templates.common', ['directives/pagination.tpl.html']);

angular.module("directives/pagination.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("directives/pagination.tpl.html",
    "<div class=\"lst-main\">\n" +
    "	<ul class=\"list-inline\">\n" +
    "		<li ng-transclude class=\"lst-item\">\n" +
    "		<li>\n" +
    "	</ul>\n" +
    "</div>\n" +
    "<ul class=\"list-inline lst-footer\">\n" +
    "	<li><a href=\"javascript:;\" class=\"prev\" ng-click=\"prev()\" ng-show=\"preVisble\"/></li>\n" +
    "	<li><a href=\"javascript:;\" class=\"next\" ng-click=\"next()\" ng-show=\"nexVisble\"/></li>\n" +
    "</ul>\n" +
    "");
}]);
