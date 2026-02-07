# 🔗 LinkSnap - Quick Link Shortener

A fast and simple URL shortener built with Next.js that includes custom aliases, QR code generation, and click tracking.

## Features

- ✨ **URL Shortening** - Quickly shorten any URL
- 🏷️ **Custom Aliases** - Create memorable short links with custom aliases
- 📱 **QR Code Generation** - Generate QR codes for easy sharing
- 📊 **Click Tracking** - Track clicks with detailed analytics
- 📈 **Dashboard** - View all your links and their statistics
- 🎨 **Modern UI** - Beautiful, responsive design

## Getting Started

### Installation

1. Install dependencies:
```bash
npm install
```

2. (Optional) For production, create a `.env.local` file:
```bash
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Production Deployment

When deploying to production, set the `NEXT_PUBLIC_BASE_URL` environment variable to your production domain. This ensures that shortened links use your production domain instead of localhost.

**Example:**
- Development: `http://localhost:3000/abc123`
- Production: `https://linksnap.com/abc123`

If `NEXT_PUBLIC_BASE_URL` is not set, the app will automatically use the request origin (works for both dev and production).

## Usage

1. Enter a URL you want to shorten
2. Optionally add a custom alias (3-20 characters, letters, numbers, hyphens, underscores)
3. Click "Shorten URL"
4. Copy your short link or download the QR code
5. View all your links in the dashboard

## API Endpoints

### POST `/api/shorten`
Create a new short link
```json
{
  "url": "https://example.com",
  "alias": "my-link" // optional
}
```

### GET `/api/shorten`
Get all shortened links

### GET `/api/links/[shortCode]`
Get details of a specific link

### DELETE `/api/links/[shortCode]`
Delete a link

### GET `/api/qr?url=[url]`
Generate QR code for a URL

### GET `/[shortCode]`
Redirect to original URL (tracks clicks)

## Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **QRCode** - QR code generation
- **In-memory storage** - Can be easily replaced with a database

## Future Enhancements

- Database integration (PostgreSQL, MongoDB, etc.)
- User authentication
- Expiration dates for links
- Password protection
- Analytics dashboard with charts
- Bulk URL shortening
- API authentication

## License

MIT

