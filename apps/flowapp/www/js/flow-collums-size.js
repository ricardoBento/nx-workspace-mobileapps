// Snip to make the ui - block - a with the same size the ui - block - b

// workbooks
    $(document).ready(function () {

        var biggestHeight = 0;
        var $blockM;
        var $blockN;
        $(function () {
            $blockM = $("#workbooks-page").find('.flow-block-1');
            $blockN = $("#workbooks-page").find('.flow-block-2');
            getBiggestHeight();
            $blockN.height(biggestHeight);
            $blockM.height(biggestHeight);
        });
        function getBiggestHeight() {
            $blockM.each(function (i, e) {
                if ($(e).height() > biggestHeight) biggestHeight = $(e).height()
            });
            $blockN.each(function (i, e) {
                if ($(e).height() > biggestHeight) biggestHeight = $(e).height()
            });
        }


        	// Same size collums
			var biggestHeight = 0;
			var $blockM;
			var $blockN;
			$(function () {
				$blockM = $("#appraisals-page").find('.flow-block-1');
				$blockN = $("#appraisals-page").find('.flow-block-2');
				getBiggestHeight();
				$blockN.height(biggestHeight);
				$blockM.height(biggestHeight);
			});
			function getBiggestHeight() {
				$blockM.each(function (i, e) {
					if ($(e).height() > biggestHeight) biggestHeight = $(e).height()
				});
				$blockN.each(function (i, e) {
					if ($(e).height() > biggestHeight) biggestHeight = $(e).height()
				});
            }
            

    });
