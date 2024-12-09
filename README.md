## Project name: Game Project Viewer

Description: This repository includes the source code for assignment 4 in the course Data-Intensive Systems and this will eventually include a short video where I demonstrate the basic functionalities of the app. 

## How to run the project:

## Setting up the databases:
CompanyA db
Add db called CompanyA_DB in MongoDB (mongo Compass) and import the db files there.

CompanyB
Create Postgresql server in Pg Admin 4 and create one database: CompanyB_DB.

Then restore the corresponding db backup file which is in path db/db_backups/companyB_DB. (Note: PostgreSQL version has to be version 17 in order to restore these files successfully)

Note: You need to add login/group roles called tester (password: x) for each db and change that user to be the owner of each database. Additionally, you might need to change the port in each database JavaScript file if your db server is running in other port than 5433. (This is because this is just a practice assignment and simple prototype, so database connections are hard coded for now)

## Starting the app: Open the src folder in terminal (through VSCode) and run following commands:

cd src

npm install (this command installs the needed dependencies)

npm run dev Go to address localhost:3000 and the app should be running there

## Demonstration video: 
Link to demovideo: https://lut-my.sharepoint.com/:v:/g/personal/aino_rakkolainen_student_lut_fi/EQp_GEiVko5GonzdTo2sDBoBuAsmCXW-OSopZUvv1UGBaw?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJPbmVEcml2ZUZvckJ1c2luZXNzIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXciLCJyZWZlcnJhbFZpZXciOiJNeUZpbGVzTGlua0NvcHkifX0&e=qYVlkp

## Learning goals with this project:

Practice how to implement a platform that uses multiple databases in its SQL queries and multiple different kinds of databases (Relational and NoSQL database)

## Project status: 
The current version mostly meets the requirements of the given assignment but it could be made more realistic platform and the logic for updates between databases could be improved because it works in some cases but not in all.
