import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})

async function setupAdmin() {
    const email = process.env.ADMIN_EMAIL!
    const password = process.env.ADMIN_PASSWORD!

    console.log(`Setting up admin user: ${email}`)

    // 1. Create the user in Auth
    const { data: userData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true
    })

    if (authError) {
        if (authError.message.includes('already registered')) {
            console.log('User already exists in Auth, updating profile...')
            // Get user ID
            const { data: users } = await supabase.auth.admin.listUsers()
            const user = users.users.find(u => u.email === email)
            if (user) {
                await updateProfile(user.id, email)
            }
        } else {
            console.error('Error creating auth user:', authError)
        }
    } else if (userData.user) {
        console.log('Auth user created successfully')
        await updateProfile(userData.user.id, email)
    }
}

async function updateProfile(userId: string, email: string) {
    // 2. Update the profile to be an admin
    const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
            id: userId,
            email: email,
            role: 'admin'
        })

    if (profileError) {
        console.error('Error updating profile:', profileError)
    } else {
        console.log('Profile updated to admin successfully!')
    }
}

setupAdmin()
