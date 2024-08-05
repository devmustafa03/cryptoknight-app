import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://prezmvsffmtpntkkjnrm.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByZXptdnNmZm10cG50a2tqbnJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjE4MTkyMDIsImV4cCI6MjAzNzM5NTIwMn0.XUauPJqZGSrF_7zvV7_3js93pQrQKDZafH71O7-Fs0M";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false
    }
});