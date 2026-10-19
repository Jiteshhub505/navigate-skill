#!/bin/bash

echo "================================================"
echo "  DATABASE MIGRATION SETUP"
echo "================================================"
echo ""

echo "Step 1: Clearing existing database..."
npm run db:clear

echo ""
echo "Step 2: Pushing new schema to database..."
npm run db:push

echo ""
echo "Step 3: Creating admin user..."
npm run db:create-admin

echo ""
echo "Step 4: Seeding basic data (durations & timings)..."
npm run db:seed

echo ""
echo "================================================"
echo "  SETUP COMPLETE!"
echo "================================================"
echo ""
echo "Next Steps:"
echo "1. Create 'course' bucket in Supabase Storage"
echo "2. Create folders: categories, courses, teachers"
echo "3. Upload images to Supabase storage"
echo "4. Insert your categories and courses data"
echo ""
echo "For detailed instructions, see DATABASE_SCHEMA.md"
echo ""
