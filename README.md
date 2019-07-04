# CheeseBoard (also scrumbo)
A one-page scrumboard app created in 2014 to try and undertand how that model of devlopment worked in more detail. This was mainly an experimantal project to hand build a one page app with routing and without a massive infrastructure behind it. For the .net project it used a form of json rpc and the dynamic type in the one page api. The api is an ashx resource file and processese a 'payload' containing a description and data. 

A version is working at https://www.tekphoria.co.uk/scrumbo to access use demo@tekphoria.co.uk / demo123.  

Migrated to nodejs and sqllite db to 'kick the tyres'. It uses a similar apporach, with sqlise as the data layer.

The code is currently not deployable but I am working on getting both to a deployable state.
