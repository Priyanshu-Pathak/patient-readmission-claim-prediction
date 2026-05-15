# Deployment Guide

AdmitGuard is currently a local prototype, but its architecture is fundamentally structured for modern cloud deployment. 

## Suggested Deployment Strategy

### Frontend (Next.js)
- **Hosting**: Vercel or AWS Amplify
- **Process**: Connect the GitHub repository directly. The frontend utilizes static generation where possible, with client-side fetching for the actual API data. 
- **Environment**: Set `NEXT_PUBLIC_API_BASE_URL` to point to the deployed FastAPI instance.

### Backend (FastAPI)
- **Hosting**: AWS Elastic Beanstalk, Google Cloud Run, or Render.
- **Dockerization**: The `backend/` directory should be containerized using a `Dockerfile` utilizing a slim Python base image.
- **Artifact Management**: Since `.joblib` models are Git-ignored, a CI/CD pipeline should ideally fetch trained model binaries from secure blob storage (e.g., AWS S3) during the build phase before serving the API. 
- **Environment**: Ensure CORS is strictly configured in production to only allow the Vercel/Amplify frontend domain.
