(function( $ ){
	"use strict";

	$.fn.createRoundedList = function(listItems) {
		var self = this;
		var type, li, imgContainer, upperRow, lowerRow;
		
		listItems.reverse();

		$(this).append('<ul class="rounded-list"></u>');
		var list = $(this).children(".rounded-list").first();

		for (var i = listItems.length - 1; i >= 0; i--) {

			// Get the item type so we know what we're dealing with
			type = getItemType(listItems[i]);
			
			// Add the type of item to the list - function are below
			if(type == "module" || type == "resource"){
				list.append(createBasicItem(listItems[i]));
			} else if (type == "forumTopicPost") {
				list.append(createTopicPostItem(listItems[i]));
			} else if (type == "forumTopic") {
				list.append(createTopicItem(listItems[i]));
			}
		}

		function createRow(type = "upper"){

			var flexClasses = "flex";

			if(type == "lower")
				flexClasses = "flex sub"

			// Creating the container for the row
			var container = $("<div/>", { "class" : "row"});
			var flex = $("<div/>", { "class": flexClasses});
			container.append(flex);

			// Creating the left cell
			var cell = $("<div/>", { "class" : "cell"});
			flex.append(cell);

			// Add cell right if required
			var cellRight = $("<div/>", { "class" : "cell right" });
			flex.append(cellRight);

			return container;
		}

		// This function will filter, sort and return the type of item passed to it
		function getItemType(item) {

			var itemType = item.type;

			switch (item.type) {

				case "module" :
					itemType = "module";
				break ;

				case 0 :
					itemType = "forumTopic";
				break;

				case "post" :
					itemType = "forumTopicPost";
				break;

				default : 
					itemType = "resource";
				break;
			};

			return itemType;
		}

		function getImage(src = "") {

			if(src == "")
				src = "./img/gravatar.jpg";

			return '<img src="' + src + '" alt="user profile picture">';
		}

		function getSvg(src = "") {

			if(src == "")
				src = "./img/library.svg";

			return '<object data="'+ src +'" type="image/svg+xml"></object>';
		}

		function createBasicItem(item) {
			// Creating the item conatiner
			li = $("<li/>");

			// Creating the image/icon/svg 
			imgContainer = $("<div/>", { "class" : "circle" });
			li.append(imgContainer);

			// Getting the image/icon/svg and adding it to the img container
			imgContainer.append(getSvg("./img/newsfeed.svg"));

			// Creating the upper row
			upperRow = createRow("upper");
			upperRow.first().css("backgroundColor", "grey");
			upperRow.find(".cell").first().text(item.title);
			upperRow.find(".right").first().text(moment(item.keydate).format("DD.MM.YYYY"));
			li.append(upperRow);

			// Creating the lower row
			lowerRow = createRow("lower");
			lowerRow.first().css("backgroundColor", "rgba(200, 200, 200, 0.6)");
			lowerRow.find(".cell").first().text(item.description);
			li.append(lowerRow);

			return li;
		}

		function createTopicPostItem(item) {
			// Creating the item conatiner
			li = $("<li/>");

			// Creating the image/icon/svg 
			imgContainer = $("<div/>", { "class" : "circle" });
			li.append(imgContainer);

			// Getting the image/icon/svg and adding it to the img container
			imgContainer.append(getSvg("./img/library.svg"));

			// Creating the upper row
			upperRow = createRow("upper");
			upperRow.first().css("backgroundColor", "grey");
			upperRow.find(".cell").first().text(item.subject);
			upperRow.find(".right").first().text(moment(item.last_post_on).format("DD.MM.YYYY h:mma"));
			li.append(upperRow);

			// Creating the lower row
			lowerRow = createRow("lower");
			lowerRow.first().css("backgroundColor", "rgba(200, 200, 200, 0.6)");
			lowerRow.find(".cell").first().text(item.poster_username);
			lowerRow.find(".right").first().text(moment(item.last_post_on).fromNow());
			li.append(lowerRow);

			return li;
		}

		function createTopicItem(item) {
			// Creating the item conatiner
			li = $("<li/>");

			// Creating the image/icon/svg 
			imgContainer = $("<div/>", { "class" : "circle" });
			li.append(imgContainer);

			// Getting the image/icon/svg and adding it to the img container
			imgContainer.append(getImage("./img/gravatar.jpg"));

			// Creating the upper row
			upperRow = createRow("upper");
			upperRow.first().css("backgroundColor", "grey");
			upperRow.find(".cell").first().text(item.subject);
			li.append(upperRow);

			// Creating the lower row
			lowerRow = createRow("lower");
			lowerRow.first().css("backgroundColor", "rgba(200, 200, 200, 0.6)");
			lowerRow.find(".cell").first().html('<i class="fa fa-clock-o" aria-hidden="true"></i> '+ item.poster_username +' ' + moment(item.last_post_on).fromNow() + '</div>');
			lowerRow.find(".right").first().html('<i class="fa fa-heart" aria-hidden="true"></i> '+ item.topic_likes_count +' <i class="fa fa-comments" aria-hidden="true"></i> ' + (item.posts.length - 1));
			li.append(lowerRow);

			return li;
		}
	};

})( jQuery );