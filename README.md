# React Photo Portfolio

The goal of this photo portfolio is to provide a simple, easily modifiable photo portfolio solution. The main feature is the ability to dynamically update website content from anywhere with no programming background. You can see a live example [here](https://rnorwood.com)

## Architecture

This application uses the **Repository Pattern** to create a clean abstraction layer between the React UI and backend services, making the codebase backend-agnostic, highly testable, and maintainable.

### Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    REACT COMPONENTS                          │
│              (NavigationBar, AllAlbums, etc.)               │
│  • Pure presentation logic                                   │
│  • No direct backend dependencies                            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ Uses custom hooks
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                    CUSTOM HOOKS                              │
│         (useAuth, useAlbums, useAlbum, useStorage)          │
│  • Provide React-friendly API                               │
│  • Handle loading states                                    │
│  • Manage component lifecycle                               │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ Calls repository methods
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                    REPOSITORIES                              │
│    (AuthRepository, AlbumRepository, ImageRepository)       │
│  • Business logic layer                                     │
│  • Validation and transformation                            │
│  • Caching strategies (5-min albums, 1-min auth tokens)     │
│  • Error handling                                           │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ Delegates to adapters
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                    ADAPTERS                                  │
│  (AmplifyAuthAdapter, AmplifyApiAdapter, etc.)             │
│  • Translate generic operations to specific backend         │
│  • Handle backend-specific logic                            │
│  • SSR-safe (MemoryStorageAdapter during server-side)       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ Makes actual API calls
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND                                   │
│         (AWS Amplify, Cognito, AppSync, S3)                 │
└─────────────────────────────────────────────────────────────┘
```

### Benefits of Repository Pattern

- **Backend Independence**: Swap AWS for Firebase/REST API by changing adapters only
- **Easy Testing**: Use mock adapters for testing without AWS infrastructure
- **Built-in Caching**: 1-minute auth token cache, 5-minute album cache
- **SSR Safe**: Automatic fallback to MemoryStorage during server-side rendering
- **Maintainable**: Clear separation of concerns across layers

## Backend Services

This backend uses the following AWS products
- Amplify
- AppSync
- Lambda
- S3
- Cognito
- Cloudfront

![resource diagram](https://github.com/bobby060/photoportfolio/blob/dev/ResourceDiagrams.jpg)
The front end is built with React and Next.js.

## Features
- Utilize the high availability and scalability of AWS services. Fixed cost to host is to basically the cost to store the website data. Other costs directly proportional to how many people view your website.
- Responsive photo albums with [Yet Another React Lightbox](https://yet-another-react-lightbox.com/)
- Ability to dynamically update photo content from anywhere via the admin user
- Configurable list of Featured albums that display on the homescreen
- Create custom tags to organize albums (Can only view one tag at once, but one album can have multiple tags)
- Custom highlighted albums that display on the home page
- Use AWS CloudFront CDN to ensure that anyone all over the globe can quickly access any of your photos
- Signed in users can download full-size images directly from the website.

# Usage and modification


## Build instructions

### Deploy back end and run app

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
```npm run dev```

To run in production mode:
```npm run build```

6. Configure an admin user in AWS Cognito and add them to the user group 'portfolio-admin.' Once you log in with that user, you should be able to create albums, upload pictures, and create public tags.

7. You will need to run the `function createDefaultTags()` from `helpers/upgrade_database.js` in order for the website to run. At this point, you also have to manually pull the ID of the 'featured' Tag and paste it in line 60 of `components/Carousel.js`. Future iterations will solve this problem in the setup script, but for now you are stuck with it.

## Testing

This project includes a comprehensive test suite covering all repositories and hooks using the Repository Pattern.

### Setup Testing Environment

1. Install the required testing dependencies:

```bash
npm install --save-dev jest-environment-jsdom
```

**Note**: As of Jest 28, `jest-environment-jsdom` is no longer shipped by default. If you see the error:

```
Test environment jest-environment-jsdom cannot be found
```

Simply run the install command above to fix it.

2. Run the tests:

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test suite
npx jest src/__tests__/hooks/useAuth.test.js

# Run tests in watch mode
npm test -- --watch
```

### Test Structure

The test suite includes:

- **Hook Tests** (50 tests): Complete coverage of useAuth, useAlbums, useAlbum, useStorage
- **Repository Tests** (77 tests): Full coverage of AuthRepository, AlbumRepository, ImageRepository, StorageRepository
- **Total**: 127 comprehensive tests

All tests use mock adapters (MockAuthAdapter, MockApiAdapter, MemoryStorageAdapter) to avoid external API calls, ensuring fast and reliable test execution.

### Database Design
![database design](https://github.com/bobby060/photoportfolio/blob/dev/photoportfoliouml.jpg)
### Authentication
This app is designed to use an Amplify Graphql API with primary mode set to Cognito User pool and secondary mode set to AWS API. This means that by default, a query run in a component will be authenticated using Cognito unless you specifiy to use AWS API. The default is the secure option.

### API Key timeouts
See this for what to do if your API key expires and is deleted. If the key expires and is not deleted, simply redeploying in Amplify should renew.
https://github.com/aws-amplify/amplify-cli/issues/808#issuecomment-596217380


### Useful References:
- [mdb react components](https://mdbootstrap.com/docs/standard)
- [react router quick start](https://reactrouter.com/en/main/start/tutorial)
- [lightbox documentation](https://yet-another-react-lightbox.com/documentation)
- [mozilla responsive images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)
