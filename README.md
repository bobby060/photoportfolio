# React Photo Portfolio

A full stack web app built with React, GraphQL, AWS Amplify, AWS AppSync, AWS Cognito, and AWS S3.

## Features
- Responsive photo albums with [Yet Another React Lightbox](https://yet-another-react-lightbox.com/)
- Ability to dynamically update photo content from anywhere via the admin user
- Configurable list of Featured albums that display on the homescreen
- Custom highlighted albums 
#### Create, edit, and delete photo albums for admin user
#### Cloudfront content delivery network to rapidly deliver responsive images. Implementation is a vanilla version of [this AWS example](https://github.com/aws-samples/image-optimization)

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
3. Initialize CloudFront Content Delivery setup with the S3 storage bucket created in step 2 using [these instructions](https://github.com/aws-samples/image-optimization). At some point this will ideally be collected a single create script

4. Upload any images you want to show in the header carousel to your AWS S3 photo bucket with the prefix 'highlights/h'. This will allow them to be automatically pulled into the header carousel


5. Start the app. Featured portion of the screen won't appear until you create a featured tag (need to add instructions on how to do that)
```npm start```

6. Configure an admin user in AWS Cognito and add them to the user group 'portfolio-admin.' Once you log in with that user, you should be able to create albums, upload pictures, and create public tags.




### Authentication
This app is designed to use an Amplify Graphql API with primary mode set to Cognito User pool and secondary mode set to AWS API. This means that by default, a query run in a component will be authenticated using Cognito unless you specifiy to use AWS API. The default is the secure option.


# Useful References:
<!-- - [react-dropzone documentation](https://react-dropzone.js.org/) -->
- [mdb react components](https://mdbootstrap.com/docs/standard)
- [react router quick start](https://reactrouter.com/en/main/start/tutorial)
- [lightbox documentation](https://yet-another-react-lightbox.com/documentation)
- [mozilla responsive images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)