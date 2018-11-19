### Building the site
gcloud init     //this will setup the project, pick one as default etc.
gcloud app deploy   //this will deploy the app

Details from google to create static site
https://cloud.google.com/appengine/docs/standard/python/getting-started/hosting-a-static-website#before_you_begin

### tie up the project with google domain from google cloud
Go to google cloud, pick that particular project https://console.cloud.google.com/appengine/settings/domains
Select custom domains and enter the domain purchased

Go to google domain and select config DNS:
https://domains.google.com
At Custom resource records section, enter CNAME, A, AAA config
