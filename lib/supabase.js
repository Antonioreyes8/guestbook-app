// lib/supabase.js

"use client"; // Next.js directive: ensures this code runs only in the browser (client-side)

/**
 * Supabase client setup.
 * 
 * This file creates and exports a single Supabase client instance
 * which can be imported and used throughout the application to:
 * - Upload files to Supabase Storage
 * - Query and modify database tables
 * - Call RPC (remote procedure) functions
 * 
 * Important:
 * - Uses environment variables for URL and public anon key
 * - Throws an error if these environment variables are missing
 * - Ensures security by using the PUBLIC key only for client-side operations
 */

import { createClient } from "@supabase/supabase-js";

// Fetch Supabase URL and anonymous public key from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseKey) {
  // This prevents runtime errors and informs the developer immediately
  throw new Error("Supabase environment variables are missing. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in your .env.local file.");
}

/**
 * Supabase client instance
 * 
 * - `supabase` is the main interface for interacting with Supabase services.
 * - It can be imported anywhere in the project.
 * - Supports:
 *    - Database operations (select, insert, update, delete)
 *    - Storage operations (upload, download, get public URLs)
 *    - Authentication (if needed)
 */
export const supabase = createClient(supabaseUrl, supabaseKey);
