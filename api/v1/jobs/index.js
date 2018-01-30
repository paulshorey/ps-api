// data
let jobsDB = {};
if (process.fs.existsSync("/www/db/v1_jobs")) {
    process.fs.readFile("/www/db/v1_jobs", 'utf8', function (err, data) {
        if (data) {
            jobsDB = JSON.parse(data);
        }
    });
} else {
    process.fs.writeFile("/www/'db/v1_jobs", jobsDB);
};



////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
// RECEIVE POST DATA
process.app.get('/v1/jobs/all', function(request, response) {
    
    // format response
    var data = Object.values(jobsDB);
    data = filterJobs(data);
    data.sort(function(a,b) {
        return b.rating - a.rating;
    });

    // success response
    response.setHeader('Content-Type', 'application/json');
    response.writeHead(200);
    response.write(JSON.stringify({results: data.length, data:data, error:0},null,"\t"));
    response.end();

});

// sort and search
var filterJobs = function(arr){
    return arr;
}



////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
// RECEIVE POST DATA
process.app.post('/v1/jobs/apify-webhook', function(request, response) {
    // dev env
    if (!request.body._id) {
        request.body._id = "D7BRpidKGMqHSPXeJ";
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
                for (var rD in resultsData) {
                    processJobs(resultsData[rD].pageFunctionResult);
                }
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

// magic
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

        // rating
        res.rating = 100000;

        // [ - ] location
        if (/, IN|, OH|, VA|, FL|, SC|, NC|, MD|, MO|, WI|, MN|, IL/i.test(res.location)) {
            continue;
        }

        // [ + ] location
        if (/San Diego|South Jordan|Draper, UT|remote|denver/i.test(res.location)) {
            res.rating += 5000;
        }
        if (/, CA|, AZ|, UT|, CO|, ID|remote/i.test(res.location)) {
            res.rating += 1000;
        }
        if (/New York|Philadelphia|phoenix/i.test(res.location)) {
            res.rating += 1000;
        }

        // [ - ] text
        if (/entry level|junior|intern/i.test(res.name) && ! (/mid|senior/i.test(res.name))) { // in NAME, exclusive
            continue;
        }
        if (/full stack/i.test(res.name)) { // in NAME
            res.rating -= 1000;
        }
        if (/ASP\.NET|client|full stack|entry level/i.test(res.text)) { 
            res.rating -= 1000;
        }
        if (/software/i.test(res.name) || (/angular/i.test(res.text) && ! (/react/i.test(res.text))) ) { // 1 in NAME or 2,3 exclusive
            res.rating -= 1000;
        }
        if (/Java/i.test(res.text) && /JSP/i.test(res.text)) { // both match
            res.rating -= 1000;
        }
        if (/TDD|test driven/i.test(res.text)) { // nothing against normal strategy of unit-testing to make sure stuff doesn't break... lets talk!
            res.rating -= 750;
        }
        if (/synergy|financial|bank|invest|account|lend|credit union|drupal|joomla/i.test(res.text)) { // ok with fin-tech, just don't want to work at a bank
            res.rating -= 500;
        }
        if ( ! (/html|css|sass|style/i.test(res.text)) ) { // !
            res.rating -= 250;
        }
        if ( ! (/front/i.test(res.text)) ) { // !
            res.rating -= 125;
        }

        // [ + ] text
        if (/front|ui/i.test(res.name)) { // in NAME
            res.rating += 2000;
        }
        if (/ux/i.test(res.name)) { // in NAME
            res.rating += 1000;
        }
        if (/react|es6|ui/i.test(res.text)) {
            res.rating += 1000;
        }
        if (/react|es6|node|front|ux|art|music|design/i.test(res.text)) {
            res.rating += 500;
        }
        if (/flexible|php|ux|designer|illustrator|responsive/i.test(res.text)) {
            res.rating += 250;
        }
        if (/iot|embedded/i.test(res.location)) {
            res.rating += 125;
        }


        // save to DB
        res._id = process.crypto.createHash('md5').update(res.name+" "+res.company).digest('hex');
        jobsDB[ res._id ] = res;
    }

    // pretending this is a db
    process.fs.writeFile("/www/db/v1_jobs", JSON.stringify(jobsDB), function(err) {
        if(err) {
            return process.console.error(err);
        }
        process.console.info("The file was saved!");
    });

    return results;

};