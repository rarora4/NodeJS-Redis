// Establishing the socket.io connection with the server
var server_name = "http://127.0.0.1:3000/";
var server = io.connect(server_name);

server.on('tweet-count', function(result){
		updateTable(result);
});

function updateTable(result){
	var JSONLength = Object.keys(result.tweets).length;
	if(JSONLength >= 1){
		var c = $("#myTable tr:first td").length;
			$("#myTable tr:first").append("<th>"+result.tweets[JSONLength-1].slot+"</th>");
			$("#myTable tr:eq(1)").append("<td>"+result.tweets[JSONLength-1].count+"</td>");
			$("#myTable tr:eq(2)").append("<td>"+result.tweets[JSONLength-1].positive+"</td>");
			$("#myTable tr:eq(3)").append("<td>"+result.tweets[JSONLength-1].negative+"</td>");

		/*if(JSONLength >= 13){
			$('table tr:first').find('th:eq(0)').remove();
			$("#myTable tr:eq(1)").find('td:eq(0)').remove();
			$("#myTable tr:eq(2)").find('td:eq(0)').remove();
			$("#myTable tr:eq(3)").find('td:eq(0)').remove();
		}*/
		$('.visualize').trigger('visualizeRefresh');
	}
}

/*result.tweets.forEach(function(column)
	{
        	console.log(result.tweets.slot);
		console.log(result.tweets.count);
		
});*/
