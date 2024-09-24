import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define public route for UploadThing
const isPublicRoute = createRouteMatcher([
  "/api/uploadthing", // Ensure this route is public for file uploads
]);

export default clerkMiddleware((auth, req) => {
  console.log("Middleware triggered for route: ", req.nextUrl.pathname);

  // Skip authentication for public routes
  if (isPublicRoute(req)) {
    return; // Allow access without authentication
  }

  const { userId } = auth(); // Ensure auth is called properly
  if (!userId) {
    throw new Error("User not authenticated");
  }

  // Proceed with your logic for authenticated routes
});
