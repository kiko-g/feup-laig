function postGameRequest(requestString, onSuccess, onError) {
    let request = new XMLHttpRequest();
    request.open('POST', 'game/prolog', true);

    request.onload = onSuccess || function (data) { console.log("Request successful. Reply: " + data.target.response); };
    request.onerror = onError || function () { console.log("Error waiting for response"); };

    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send('requestString=' + encodeURIComponent(requestString));
}

function test(reply) {
    let response = JSON.parse(reply.target.response);
    console.log(response);
}