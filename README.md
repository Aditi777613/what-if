# What If Machine

Explore alternate life paths through AI-generated narratives. "What if I'd studied art instead?" See a day-in-the-life story, complete with fictional but plausible details.

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the root directory with:

```env
# Optional: Hugging Face API Token (recommended for better rate limits)
# Get free token at: https://huggingface.co/settings/tokens
HF_API_KEY=your_hf_token_here

# Optional: Custom Hugging Face text model for story generation
# Default: mistralai/Mistral-7B-Instruct-v0.2
HUGGINGFACE_TEXT_MODEL=mistralai/Mistral-7B-Instruct-v0.2

# Optional: Custom Hugging Face image model
# Default: runwayml/stable-diffusion-v1-5
HUGGINGFACE_MODEL=runwayml/stable-diffusion-v1-5
```

### 2. Everything is FREE! 🎉

**Both story AND image generation now use Hugging Face Inference API - FREE forever!**
- ✅ No quota limits
- ✅ No payment required
- ✅ Works without API token (though token increases rate limits)
- ✅ No OpenAI account needed
- ✅ Uses free Stable Diffusion models for images
- ✅ Uses free Mistral/LLM models for stories

**Note:** You can use the app immediately without any API keys! Adding a free Hugging Face token just improves rate limits.

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

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

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
