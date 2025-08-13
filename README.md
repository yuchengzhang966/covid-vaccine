# COVID-19 Data Visualization Project

A comprehensive data visualization dashboard showing COVID-19 statistics worldwide, including vaccination rates, stringency indices, and case trends.

## Features

- Interactive world map showing COVID-19 data by country
- Time series charts for cases, deaths, and vaccinations
- Stringency index analysis (lockdown measures)
- Comparative analysis between countries
- Responsive design with modern UI

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- React.js
- D3.js (Data visualization)
- TopoJSON (Geographic data)

## Data Sources

- COVID-19 statistics from Our World in Data
- Geographic data from Natural Earth
- Country codes from ISO-3166

## Deployment Options

### Option 1: GitHub Pages (Recommended)
1. Push your code to a GitHub repository
2. Go to Settings > Pages
3. Select source branch (usually `main` or `master`)
4. Your site will be available at `https://yourusername.github.io/repository-name`

### Option 2: Netlify
1. Drag and drop the project folder to [Netlify](https://netlify.com)
2. Or connect your GitHub repository for automatic deployments

### Option 3: Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project directory
3. Follow the prompts

### Option 4: Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Run `firebase init hosting`
3. Deploy with `firebase deploy`

## Local Development

Simply open `index.html` in a web browser or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

## Project Structure

```
covid-vaccine/
├── index.html          # Main HTML file
├── main.js            # React components and D3 visualizations
├── styles.css         # Styling
├── dataset/           # CSV data files
│   ├── covid1.csv
│   ├── covid2.csv
│   └── countries.json
└── README.md          # This file
```

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## License

This project is open source and available under the MIT License.
