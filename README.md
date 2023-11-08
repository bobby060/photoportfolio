# React Photo Portfolio

A full stack web app built with React, GraphQL, AWS Amplify, AWS AppSync, AWS Cognito, and AWS S3.

## Features
Public:
- Responsive photo albums with lightbox
Private:
- Create, edit, and delete photo albums

# Build instructions

## Deploy back end and run app

1. Clone repo and install dependencies

```
~ git clone https://github.com/bobby060/photoportfolio.git
~ cd photoportfolio
~ npm install
```

2. Initialize and deploy Amplify project

Ensure you have properly configured Amplify CLI, see [here](https://docs.amplify.aws/cli/start/install/)
```
~ amplify init
? Enter a name for the environment: dev (or whatever you would like to call this env)
? Choose your default editor: <YOUR_EDITOR_OF_CHOICE>
? Do you want to use an AWS profile? Y

~ amplify push
? Are you sure you want to continue? Y
? Do you want to generate code for your newly created GraphQL API? Y
```
3. Start the app
```npm start```

## Deploy the front end
1. Create a new repo with your git service of choice

2. Push project to new repo
```
~ git remote add origin <your_new_repository>
~ git push --set-upstream master`
```

### Authentication
This app is designed to use an Amplify Graphql API with primary mode set to Cognito User pool and secondary mode set to AWS API. This means that by default, a query run in a component will be authenticated using Cognito unless you specifiy to use AWS API. The default is the secure option.


# Features to add:
- Lightbox using [Yet Another React Lightbox](https://yet-another-react-lightbox.com/)


# Useful References:
<!-- - [react-dropzone documentation](https://react-dropzone.js.org/) -->
- [mdb react components](https://mdbootstrap.com/docs/standard)
- [react router quick start](https://reactrouter.com/en/main/start/tutorial)
- [lightbox documentation](https://yet-another-react-lightbox.com/documentation)
