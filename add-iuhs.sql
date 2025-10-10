-- Add International University of the Health Sciences (IUHS)
INSERT INTO schools (name, domain) VALUES
  ('International University of the Health Sciences', 'iuhs.edu')
ON CONFLICT (name) DO NOTHING;
