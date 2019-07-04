# CheeseBoard (also Scrumbo)

This repository is an attempt to consolidate and store code. It is not in a deployable state as of yet. A version is working at https://www.tekphoria.co.uk/scrumbo to access use demo@tekphoria.co.uk / demo123. 

It is a one-page scrumboard app created in 2014 to try and understand how that model of development worked in more detail. This was mainly an experimental project to hand build a one page app with routing and without a massive infrastructure behind it. For the .net project it used a form of json rpc and the dynamic type in the one page api. The api is an ashx resource file and processes a 'payload' containing a description and data. For security a custom encrypted token in the db is used. Looking to use JWT.

Migrated to nodejs and sqllite db to 'kick the tyres'. It uses a similar approach, with sequelise as the data layer, handlebars. Hosted on a raspberry pi successfully.

Todo: 
 - Make core version
 - Make deployable
 - Integrate JWT authentication from some auth service

