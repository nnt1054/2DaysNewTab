<script type="text/javascript">
      function handleClientLoad() {
        // Load the API client and auth2 library
        gapi.load('client:auth2', initClient);
      }

      function initClient() {
        gapi.client.init({
            apiKey: AIzaSyAKcCdHczwl3_1FTHm3TTxzTWQDoxTjM4Q,
            discoveryDocs: ["https://people.googleapis.com/$discovery/rest?version=v1"],
            clientId: 993464514830-bs0hqjvqe1t4p1ksskjv6i3k506vptuc.apps.googleusercontent.com,
            scope: 'profile'
        }).then(function () {
          // Listen for sign-in state changes.
          gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

          // Handle the initial sign-in state.
          updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        });
      }

      function updateSigninStatus(isSignedIn) {
        if (isSignedIn) {
          makeApiCall();
        }
      }

      function handleAuthClick(event) {
        gapi.auth2.getAuthInstance().signIn();
      }

      function handleSignoutClick(event) {
        gapi.auth2.getAuthInstance().signOut();
      }

      function makeApiCall() {
        gapi.client.people.people.get({
          resourceName: 'people/me'
        }).then(function(resp) {
          console.log('Hello, ' + resp.result.names[0].givenName);
        }, function(reason) {
          console.log('Error: ' + reason.result.error.message);
        });
      }
    </script>
    <script async defer src="https://apis.google.com/js/api.js"
      onload="this.onload=function(){};handleClientLoad()"
      onreadystatechange="if (this.readyState === 'complete') this.onload()">
    </script>
    <button id="authorize-button" onclick="handleAuthClick()">Authorize</button>
    <button id="signout-button" onclick="handleSignoutClick()">Sign Out</button>
