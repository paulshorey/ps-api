////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
// RECEIVE POST DATA
process.app.get('/v1/jobs/all', function(request, response) {

    process.jobsDB = process.jobsDB || {};
    
    // success response
    response.setHeader('Content-Type', 'application/json');
    response.writeHead(200);
    response.write(JSON.stringify({data:process.jobsDB, error:0},null,"\t"));
    response.end();

});




////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
// RECEIVE POST DATA
process.app.post('/v1/jobs/apify-webhook', function(request, response) {
    // dev env
    if (!request.body._id) {
        request.body._id = "tgY7FtsXTgbjBrd5R";
    }

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

    // simply save to memory
    // bad idea for a real app, but I'll use this for a temporary solution, AND to practice Javascript data structures
    process.jobsDB = process.jobsDB || {};

    // format
    for (var r in results) {
        var res = results[r];
        for (var k in res) {
            if (typeof res[k] === "string") {
                res[k] = res[k].replace(/\s/g, ' ');
                res[k] = res[k].trim();
            }
        }
        // filter
        res.posted = process.chrono.parseDate(res.posted);
        // save
        process.jobsDB[ process.crypto.createHash('md5').update(res.name+" "+res.company).digest('hex') ] = res;
    }

    return results;

};