import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define public route for UploadThing
const isPublicRoute = createRouteMatcher([
  "/api/uploadthing", // Ensure this route is public for file uploads
]);

export default clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) {
    auth(); // Ensure auth is applied for protected routes
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
