-- Create 10 study blocks for IUHS
-- First get the IUHS school ID
DO $$
DECLARE
    iuhs_id UUID;
BEGIN
    -- Get IUHS school ID
    SELECT id INTO iuhs_id
    FROM schools
    WHERE name = 'International University of the Health Sciences';

    -- Insert 10 blocks if they don't exist
    INSERT INTO blocks (school_id, block_number, name, is_review)
    VALUES
        (iuhs_id, 1, 'Block 1', false),
        (iuhs_id, 2, 'Block 2', false),
        (iuhs_id, 3, 'Block 3', false),
        (iuhs_id, 4, 'Block 4', false),
        (iuhs_id, 5, 'Block 5', false),
        (iuhs_id, 6, 'Block 6', false),
        (iuhs_id, 7, 'Block 7', false),
        (iuhs_id, 8, 'Block 8', false),
        (iuhs_id, 9, 'Block 9 - Review', true),
        (iuhs_id, 10, 'Block 10 - Review', true)
    ON CONFLICT (school_id, block_number) DO NOTHING;
END $$;

-- Verify blocks were created
SELECT
    b.block_number,
    b.name,
    b.is_review,
    s.name as school_name
FROM blocks b
JOIN schools s ON b.school_id = s.id
WHERE s.name = 'International University of the Health Sciences'
ORDER BY b.block_number;
