const request = require('request');

let networkList = ['192.168.0.11', '172.16.230.59', '172.16.228.24', '172.16.233.139', '172.16.238.221', '172.16.232.26', '172.16.239.44', '172.16.230.139', '172.16.230.250', '172.16.230.67'];

let num = 1;
let count = 0;

function reqParticipation() {
  const options = {
    uri: `http://${networkList[count]}:65006/reqParticipation`,
    method: 'POST',
  };
  request.post(options, function (error, response, body) {
    console.log(body);
  });

  ++count !== num ? setTimeout(reqParticipation, 5000) : undefined;
}

reqParticipation();
