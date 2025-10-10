-- Insert common medical schools for users to select during onboarding
INSERT INTO schools (name, domain) VALUES
  ('Indiana University School of Medicine', 'iu.edu'),
  ('Harvard Medical School', 'hms.harvard.edu'),
  ('Johns Hopkins School of Medicine', 'jhmi.edu'),
  ('Stanford School of Medicine', 'stanford.edu'),
  ('University of Pennsylvania Perelman School of Medicine', 'upenn.edu'),
  ('Columbia University Vagelos College of Physicians and Surgeons', 'columbia.edu'),
  ('Duke University School of Medicine', 'duke.edu'),
  ('University of California San Francisco School of Medicine', 'ucsf.edu'),
  ('Yale School of Medicine', 'yale.edu'),
  ('University of Michigan Medical School', 'umich.edu'),
  ('Washington University School of Medicine', 'wustl.edu'),
  ('Cornell Medicine', 'cornell.edu'),
  ('University of Chicago Pritzker School of Medicine', 'uchicago.edu'),
  ('Northwestern University Feinberg School of Medicine', 'northwestern.edu'),
  ('University of Pittsburgh School of Medicine', 'pitt.edu'),
  ('Vanderbilt University School of Medicine', 'vanderbilt.edu'),
  ('Mayo Clinic Alix School of Medicine', 'mayo.edu'),
  ('Icahn School of Medicine at Mount Sinai', 'mssm.edu'),
  ('NYU Grossman School of Medicine', 'nyu.edu'),
  ('Other', NULL)
ON CONFLICT (name) DO NOTHING;
