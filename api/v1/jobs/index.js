////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
// RECEIVE POST DATA
process.app.post('/v1/jobs', function(request, response) {

    // simply save to memory
    // bad idea for a real app, but I'll use this for a temporary solution, AND to practice Javascript data structures
    process.jobsDB = process.jobsDB || {};

    // data
    process.console.log(request.body);

	// success response
	response.setHeader('Content-Type', 'application/json');
	response.writeHead(200);
	response.write(JSON.stringify({data:"OK", error:0},null,"\t"));
    response.end();
    

});




