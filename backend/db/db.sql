
CREATE TYPE user_role AS ENUM ('CLIENT', 'WORKER', 'ADMIN');


CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255), 
    
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    
    role user_role NOT NULL DEFAULT 'CLIENT', 
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE workers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    profession VARCHAR(100) NOT NULL,
    bio TEXT,
    experience_years INT NOT NULL,
    rating FLOAT DEFAULT 0.0,
    skills TEXT[],
    city VARCHAR(100),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE gigs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Worker ka reference (Kaun yeh Gig/Post de raha hai)
    worker_id UUID NOT NULL REFERENCES workers(user_id) ON DELETE CASCADE, 
    
    -- Gig/Post details
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    
    -- Service Specifics
    category VARCHAR(100) NOT NULL, -- e.g., 'House Design', 'Plumbing Repair', 'Electrician Service'
    price_base NUMERIC(10, 2) NOT NULL, -- Starting Price (e.g., 50.00 for $50)
    
    -- Location/Availability
    is_remote BOOLEAN DEFAULT FALSE, -- Kya yeh service remote di ja sakti hai?
    service_areas TEXT[],            -- Jin cities mein service available hai (Array of strings)
    
    -- Images/Media (AWS S3 Links)
    image_urls TEXT[],               -- Gig ki images ke links (Array of S3 URLs)
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE, -- Gig active hai ya pause kar diya gaya hai
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);