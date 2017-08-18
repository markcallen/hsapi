# hsapi

## Use

Create a new HS App and request API keys.

Create variables for hs_client_id, hs_client_secret, username, password

````
var hsapi = new HsApi({hs_client_id, hs_client_secret, username, password});
hsapi.socialProfiles().then(function(data) {
  console.log(data);
})
.catch(function(err) {
  console.error(err);
});
````

## test

Requires setting up a spec/healper.js file in the format:

````
module.exports = {
  hs_client_id: "<clientid>,
  hs_client_secret: "<clientsecret>",
  memberId: <memberid>,
  organizationId: <orgid>,
  username: "<username>",
  password: "<password>"
}
````

````
npm test
````
