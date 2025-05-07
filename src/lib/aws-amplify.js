import { Amplify } from 'aws-amplify';
import amplifyconfig from '../amplifyconfiguration.json';

// Initialize Amplify
Amplify.configure(amplifyconfig);

export default Amplify; 