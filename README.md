# EFFATA - Universal Product Health & Safety Scanner

**Open your eyes to what touches you.**

EFFATA is a next-generation web application designed to help users make safer decisions about any product that could touch their skin, enter their mouth, or be absorbed by their body. The app leverages advanced AI (Gemini 2.5) to instantly scan, analyze, and rate everything from food to cosmetics, creams, oils, toothpaste, and other personal care products.

## 🎯 Core Mission

EFFATA acts as a real-time guardian for your health, helping you avoid cancerous, toxic, allergenic, or banned ingredients—before you eat, apply, or buy.

## 🔍 What We Scan

- **Food & Beverages** - Processed foods, additives, E-numbers, preservatives
- **Makeup & Cosmetics** - INCI-listed ingredients, colorants, fragrances, parabens
- **Personal Care** - Creams, oils, lotions, serums (body, face, hair)
- **Oral Care** - Toothpaste, mouthwash, whitening products
- **Any Product** - That can be eaten, applied to skin, or enter the body

## ✨ Key Features

### 🤖 AI-Powered Analysis
- **Gemini 2.5 Vision API** for advanced image understanding
- Real-time ingredient extraction and recognition
- Cross-reference with global regulatory databases

### 🏆 Smart Grading System
- **A-E Grade Scale** with emoji visualization
- 😍 A = Excellent (all ingredients safe)
- 😊 B = Good (mostly safe, minor concerns)
- 😐 C = Average (mixed safety profile)
- 😟 D = Bad (multiple safety concerns)
- 🤢 E = Very Bad (dangerous/banned ingredients)

### 🔒 Privacy-First Design
- **No photo storage** unless user consents
- **End-to-end encrypted** communication
- **GDPR/CCPA compliant** data handling
- **Local processing** when possible

### 🎨 Modern UI/UX
- **iOS 18 inspired** glassy dark mode design
- **Responsive** mobile-first interface
- **Smooth animations** and haptic feedback
- **Accessibility focused** with high contrast

## 🚀 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Shadcn/ui** for component library
- **React Router** for navigation
- **TanStack Query** for state management

### AI & Analysis
- **Google Gemini 2.5 Flash** for image analysis
- **Advanced prompting** for ingredient recognition
- **Multi-language support** for global products

### Scanning Capabilities
- **Camera integration** for real-time scanning
- **Barcode recognition** for product identification
- **Ingredient label OCR** for text extraction
- **File upload** for existing photos

## 🏗️ Project Structure

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/f8c4a2c7-9e22-4d19-b020-9870871e0547) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
