// persistent data store - really needs to be redone...
// bad idea for a real app, but I'll use this for a temporary solution, AND to practice Javascript data structures
// process.jobsDB = process.jobsDB || {};
process.fs.open("/www/db/v1_jobs", 'wx', (err, fd) => {
    if (err) {
        if (err.code === 'EEXIST') {
        // file exists
        // read file to list
        process.fs.readFile("/www/db/v1_jobs", 'utf8', function (err, data) {
            if (err) { 
                throw err; 
            }
            if (data) {
                process.jobsDB = JSON.parse(data);
            } else {
                process.jobsDB = {};
            }
        });

        return;
        }
    }

    // file does not exist
    // make it, write empty list
    process.jobsDB = {};
    process.fs.writeFile("/www/'db/v1_jobs", process.jobsDB);
});



////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
// RECEIVE POST DATA
process.app.get('/v1/jobs/all', function(request, response) {
    
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

        // save to DB
        process.jobsDB[ process.crypto.createHash('md5').update(res.name+" "+res.company).digest('hex') ] = res;
    }

    // pretending this is a db
    process.fs.writeFile("/www/db/v1_jobs", JSON.stringify(process.jobsDB), function(err) {
        if(err) {
            return process.console.error(err);
        }
        process.console.info("The file was saved!");
    });

    return results;

};