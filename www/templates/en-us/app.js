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
