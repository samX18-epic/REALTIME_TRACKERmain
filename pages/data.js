export default function handler(req, res) {
  // Set CORS headers to allow requests from other origins
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle the API request and send a response
  res.status(200).json({ message: 'CORS is enabled for this route!' });
}