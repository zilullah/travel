-- ==============================================================================
-- SEEDER: ADMIN USER ACCOUNT
-- Description: Creates default admin user in auth.users and public.profiles
-- Password:   admin123456 (or change as desired)
-- ==============================================================================

DO $$
DECLARE
  admin_uid UUID := gen_random_uuid();
  admin_email TEXT := 'admin@lomboktravel.com';
  admin_pass TEXT := 'admin123456'; -- Plaintext password to hash
  encrypted_pass TEXT;
BEGIN
  -- Generate bcrypt hash for password
  encrypted_pass := crypt(admin_pass, gen_salt('bf'));

  -- 1. Insert into auth.users if not exists
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = admin_email) THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      admin_uid,
      'authenticated',
      'authenticated',
      admin_email,
      encrypted_pass,
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"full_name":"Lombok Admin Master","role":"admin"}'::jsonb,
      now(),
      now(),
      ''
    );

    -- 2. Upsert into public.profiles with role = 'admin'
    INSERT INTO public.profiles (id, email, full_name, role, created_at, updated_at)
    VALUES (
      admin_uid,
      admin_email,
      'Lombok Admin Master',
      'admin',
      now(),
      now()
    )
    ON CONFLICT (id) DO UPDATE
      SET role = 'admin',
          full_name = 'Lombok Admin Master',
          updated_at = now();

    RAISE NOTICE 'Admin user created successfully: %', admin_email;
  ELSE
    -- If user already exists in auth.users, ensure profile has role = 'admin'
    SELECT id INTO admin_uid FROM auth.users WHERE email = admin_email;

    -- Update password just in case
    UPDATE auth.users
    SET encrypted_password = encrypted_pass,
        email_confirmed_at = COALESCE(email_confirmed_at, now())
    WHERE id = admin_uid;

    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (admin_uid, admin_email, 'Lombok Admin Master', 'admin')
    ON CONFLICT (id) DO UPDATE SET role = 'admin';

    RAISE NOTICE 'Existing user % updated to admin role and password reset', admin_email;
  END IF;
END $$;
