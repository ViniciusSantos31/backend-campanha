import 'dotenv';
import WiseAPI from 'wise-api';

const wiseAPI = WiseAPI({
  baseUrl: process.env.WISE_API_BASEURL as string,
  domain: process.env.WISE_API_DOMAIN as string,
  apiKey: process.env.WISE_API_KEY as string,
}).catch((error) => { 
  console.error('Failed to create WiseAPI instance:', error);
  process.exit(1);
});

export { wiseAPI };
