// Local development'ta nodejs runtime kullan (Prisma Client için gerekli)
// Production'da edge runtime kullan (Cloudflare Pages)
export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Database Initialization</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
        button { background: #0070f3; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; }
        button:hover { background: #0051cc; }
        .result { margin-top: 20px; padding: 10px; border-radius: 5px; }
        .success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
      </style>
    </head>
    <body>
      <h1>Database Initialization</h1>
      <p>Click the button below to initialize the D1 database with tables and sample data.</p>
      
      <button onclick="initDatabase()">Initialize Database</button>
      
      <div id="result"></div>
      
      <script>
        async function initDatabase() {
          const resultDiv = document.getElementById('result');
          resultDiv.innerHTML = '<p>Initializing database...</p>';
          
          try {
            const response = await fetch('/api/init-db', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            
            const data = await response.json();
            
            if (data.success) {
              resultDiv.innerHTML = \`
                <div class="result success">
                  <h3>✅ Success!</h3>
                  <p>\${data.message}</p>
                  <p><strong>Tables:</strong> \${JSON.stringify(data.tables, null, 2)}</p>
                  <p><strong>Counts:</strong></p>
                  <ul>
                    <li>Products: \${data.counts.products}</li>
                    <li>Brands: \${data.counts.brands}</li>
                    <li>Categories: \${data.counts.categories}</li>
                  </ul>
                </div>
              \`;
            } else {
              resultDiv.innerHTML = \`
                <div class="result error">
                  <h3>❌ Error</h3>
                  <p>\${data.error}</p>
                  <p><strong>Details:</strong> \${data.details}</p>
                </div>
              \`;
            }
          } catch (error) {
            resultDiv.innerHTML = \`
              <div class="result error">
                <h3>❌ Network Error</h3>
                <p>\${error.message}</p>
              </div>
            \`;
          }
        }
      </script>
    </body>
    </html>
  `;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}
