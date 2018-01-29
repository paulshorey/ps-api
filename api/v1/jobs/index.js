////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
// RECEIVE POST DATA
process.app.get('/v1/jobs/apify-client', function(request, response) {

    // "https://api.apify.com/v1/execs/eoySKuYBwdArZdTTD/results";
    
    // success response
    response.setHeader('Content-Type', 'application/json');
    response.writeHead(200);
    response.write(JSON.stringify({data:[], error:0},null,"\t"));
    response.end();

});




////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
// RECEIVE POST DATA
process.app.post('/v1/jobs/apify-webhook', function(request, response) {
    // dev env
    if (!request.body._id) {
        request.body._id = "mYaiqsEjzer7G7TB3";
    }

    // simply save to memory
    // bad idea for a real app, but I'll use this for a temporary solution, AND to practice Javascript data structures
    // process.jobsDB = process.jobsDB || {};

    // fetch data
    const resultsUrl = "https://api.apify.com/v1/execs/"+request.body._id+"/results";
    process.https.get(resultsUrl, res => {
        res.setEncoding("utf8");
        let body = "";
        res.on("data", data => {
            body += data;
        });
        res.on("end", () => {

            // finally...
            resultsData = JSON.parse(body);
            if (resultsData && resultsData[0] && resultsData[0].pageFunctionResult) {
                processJobs(resultsData[0].pageFunctionResult);
            } else {
                process.console.error("Apify-WEBHOOK FAILED to return data: "+resultsUrl);
            }

        });
    });

	// success response without waiting for async data above
	response.setHeader('Content-Type', 'application/json');
	response.writeHead(200);
	response.write(JSON.stringify({data:"OK", error:0},null,"\t"));
    response.end();

});






const processJobs = function(results){

    for (var r in results) {
        results[r] = (typeof results[r]);
        // if (typeof results[r] === "string") {
        //     results[r] = results[r].replace(/\w/g, ' ');
        //     results[r] = results[r].trim();
        // }
        process.console.log(typeof results[r]);
        process.console.log(results[r]);
    }

    return results;

};