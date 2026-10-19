export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    email: string
                    role: 'admin' | 'user'
                    created_at: string
                }
                Insert: {
                    id: string
                    email: string
                    role?: 'admin' | 'user'
                    created_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    role?: 'admin' | 'user'
                    created_at?: string
                }
            }
            courses: {
                Row: {
                    id: string
                    title: string
                    description: string
                    price: number
                    category: string
                    image_url: string
                    instructor: string
                    duration: string
                    level: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    description: string
                    price: number
                    category: string
                    image_url: string
                    instructor: string
                    duration: string
                    level: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    description?: string
                    price?: number
                    category?: string
                    image_url?: string
                    instructor?: string
                    duration?: string
                    level?: string
                    created_at?: string
                    updated_at?: string
                }
            }
            orders: {
                Row: {
                    id: string
                    user_id: string
                    course_id: string
                    amount: number
                    status: 'pending' | 'completed' | 'failed'
                    razorpay_order_id: string | null
                    razorpay_payment_id: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    course_id: string
                    amount: number
                    status?: 'pending' | 'completed' | 'failed'
                    razorpay_order_id?: string | null
                    razorpay_payment_id?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    course_id?: string
                    amount?: number
                    status?: 'pending' | 'completed' | 'failed'
                    razorpay_order_id?: string | null
                    razorpay_payment_id?: string | null
                    created_at?: string
                }
            }
        }
    }
}
