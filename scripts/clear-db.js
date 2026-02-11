const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const env = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        env[key.trim()] = value.trim();
    }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function clearDatabase() {
    console.log('Starting database clearance...');

    const tables = [
        'order_items',
        'orders',
        'product_reviews',
        'product_specifications',
        'products',
        'categories',
        'banners',
        'inquiries',
        'users_profile' // Be careful with this one if it's linked to auth.users
    ];

    for (const table of tables) {
        console.log(`Clearing table: ${table}...`);
        const { error } = await supabase
            .from(table)
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows

        if (error) {
            console.error(`Error clearing ${table}:`, error.message);
        } else {
            console.log(`Cleared ${table}.`);
        }
    }

    console.log('Database clearance complete.');
}

clearDatabase();
