# Google Maps Integration Setup

This guide will help you set up Google Maps integration for the car rental marketplace dealer location feature.

## Prerequisites

- Google Cloud Platform account
- Credit card (required for Google Maps API, but has generous free tier)

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note your project ID

## Step 2: Enable Required APIs

1. Navigate to **APIs & Services** > **Library**
2. Enable the following APIs:
   - **Maps JavaScript API** (required)
   - **Places API** (optional, for enhanced features)
   - **Geocoding API** (optional, for address conversion)

## Step 3: Create API Key

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **API Key**
3. Copy the generated API key

## Step 4: Secure Your API Key (Recommended)

1. Click on your API key to edit it
2. Under **Application restrictions**:
   - Select **HTTP referrers (web sites)**
   - Add your domain(s):
     - `localhost:3000/*` (for development)
     - `localhost:3001/*` (for development)
     - `yourdomain.com/*` (for production)
3. Under **API restrictions**:
   - Select **Restrict key**
   - Choose the APIs you enabled above
4. Save the restrictions

## Step 5: Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and replace the placeholder:
   ```env
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   ```

## Step 6: Test the Integration

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to the search page: `http://localhost:3001/search`
3. Click "Select Pickup Location" on any vehicle
4. You should see an interactive Google Map with dealer locations

## Features

- **Interactive Map**: Click and zoom on the map
- **Dealer Markers**: Color-coded markers (green = available, red = unavailable, blue = selected)
- **Info Windows**: Click markers to see dealer details
- **Responsive Design**: Works on desktop and mobile

## Troubleshooting

### Map Not Loading
- Check if your API key is correct in `.env`
- Verify the Maps JavaScript API is enabled
- Check browser console for error messages
- Ensure your domain is whitelisted in API key restrictions

### "API Key Required" Message
- Make sure `.env` file exists and contains the API key
- Restart the development server after adding the API key
- Verify the environment variable name is exactly `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

### Markers Not Showing
- Check browser console for JavaScript errors
- Verify dealer data has valid `lat` and `lng` coordinates

## Cost Considerations

- Google Maps has a generous free tier (28,000 map loads per month)
- Monitor usage in Google Cloud Console
- Set up billing alerts to avoid unexpected charges

## Security Best Practices

- Never commit your actual API key to version control
- Use domain restrictions on your API key
- Regularly rotate your API keys
- Monitor API usage for unusual activity

## Support

For Google Maps API issues, refer to:
- [Google Maps JavaScript API Documentation](https://developers.google.com/maps/documentation/javascript)
- [Google Cloud Support](https://cloud.google.com/support)