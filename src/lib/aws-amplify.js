import { Amplify } from 'aws-amplify';
import amplifyconfig from '../amplify_outputs.json';

// Initialize Amplify
Amplify.configure(amplifyconfig);

export default Amplify; 