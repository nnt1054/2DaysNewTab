function start() {
  // 2. Initialize the JavaScript client library.
  gapi.client.init({
    'apiKey': 'YOUR_API_KEY',
    'discoveryDocs': ['https://people.googleapis.com/calendar/v3'],
    // clientId and scope are optional if auth is not required.
    'clientId': 993464514830-bs0hqjvqe1t4p1ksskjv6i3k506vptuc.apps.googleusercontent.com,
    'scope': 'profile',
  }).then(function() {
    // 3. Initialize and make the API request.
    return gapi.client.people.people.get({
      resourceName: 'people/me'
    });
  }).then(function(resp) {
    console.log(resp.result);
  }, function(reason) {
    console.log('Error: ' + reason.result.error.message);
  });
};
// 1. Load the JavaScript client library.
gapi.load('client', start);
