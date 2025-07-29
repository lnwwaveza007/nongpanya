INSERT INTO symptoms (name, description)
VALUES
('Diarrhea', 'Frequent, loose, or watery bowel movements that may be accompanied by abdominal discomfort.'),
('Headache', 'Pain or discomfort in the head or upper neck, often described as throbbing, sharp, or dull.'),
('Fever', 'An increase in body temperature above the normal range, often a sign of infection or inflammation.'),
('Menstrual Pain', 'Cramping or aching in the lower abdomen associated with menstruation, sometimes radiating to the back or thighs.'),
('Back/Shoulder/Muscle/Joint Pain', 'Pain or discomfort in the back, shoulders, muscles, or joints, which can be caused by strain, injury, or inflammation.'),
('Muscle Pain', 'Soreness or aching in muscles due to overuse, tension, or injury.'),
('Small wound', 'A minor wound has resulted from either an abrasion or a cut caused by a sharp object.');

INSERT INTO medicines (name, image_url, type, description, strength)
VALUES
('Activated medicines Charcoal 260 mg', 'https://i.ibb.co/N2rSLMXT/carbon.jpg', 'Capsule', 'Activated Charcoal 260 mg is used to treat diarrhea, bloating, and to absorb toxins in the digestive system.', 260),
('Paracetamol 500 mg', 'https://i.ibb.co/Fbxwyysg/tyrinal.jpg', 'Tablet', 'Paracetamol 500 mg is used to reduce fever and relieve general pain such as headaches. Suitable for adults and children aged 12 years and above.', 500),
('Norgesic', 'https://i.ibb.co/W4bhRHVD/norgesic.jpg', 'Tablet', 'Orphenadrine 35 mg and Paracetamol 450 mg are used to relieve muscle pain in areas such as the neck, legs, and back caused by muscle tension or spasms.', 485),
('Ponstan 500 mg','https://i.ibb.co/Cp035t9X/ponstan.png','Tablet','Mefenamic Acid 500 mg is used to relieve menstrual pain and other moderate pain such as toothache.',500),
('Mini First Aid Kit','https://i.ibb.co/Hfz652xF/firstAid.jpg', 'Pack','A basic small wound cleaning kit includes iodine, alcohol, and adhesive bandages.',0);

INSERT INTO medicine_instructions (medicine_id, content, type)
VALUES
-- Activated Charcoal
-- Instruction
(1, 'For adults and children over 12 years old.', 'Instruction'),
(1, 'Take 3–4 capsules per dose, 3–4 times a day.', 'Instruction'),
(1, 'Take this medicine at least 2 hours before or after other medications.', 'Instruction'),
(2, 'Take every 4-6 hours.', 'Instruction'),
(1, 'You can stop taking the medicine if symptoms improve.', 'Instruction'),
-- Warning
(1, 'Do not take this medicine at the same time as other medications.', 'Warning'),
(1, 'If diarrhea does not improve within 2–3 days after taking the medicine, consult a doctor.', 'Warning'),
(1, 'Who have gastrointestinal conditions should consult a pharmacist before use.', 'Warning'),
-- Side Effect
(1, 'Stools may have dark color after taking activated charcoal.', 'Side Effect'),
(1, 'For some cases, allergic reactions may occur, such as rash, itching, swelling, difficulty breathing, or severe dizziness.', 'Side Effect');

INSERT INTO medicine_instructions (medicine_id, content, type)
VALUES
-- Paracetamol
-- Instruction
(2, 'Weight 34–50 kg: Take 1 tablet.', 'Instruction'),
(2, 'Weight 51–67 kg: Take 1.5 tablets.', 'Instruction'),
(2, 'Weight 68 kg and above: Take 2 tablets.', 'Instruction'),
(2, 'Take every 6 hours as needed.', 'Instruction'),
(2, 'Do not exceed 4 doses per day.', 'Instruction'),
-- Warning
(2, 'Do not use this medicine continuously for more than 5 days.', 'Warning'),
(2, 'Avoid using this medicine together with other medications.', 'Warning'),
(2, 'Patients with liver disease should consult a doctor before using.', 'Warning'),
(2, 'If an allergic reaction occurs, consult a doctor immediately.', 'Warning'),
-- Side Effect
(2, 'Overdose may be life-threatening.', 'Side Effect');

INSERT INTO medicine_instructions (medicine_id, content, type)
VALUES
-- Norgesic
-- Instruction
(3, 'For individuals aged over 16 years.', 'Instruction'),
(3, 'Can be taken before or after meals.', 'Instruction'),
(3, 'Take 2 tablets per dose, 3 times daily.', 'Instruction'),
(3, 'You can stop taking the medicine if symptoms improve.', 'Instruction'),
-- Warning
(3, 'Patients with liver, kidney, glaucoma, or urinary tract conditions should consult a pharmacist before use.', 'Warning'),
(3, 'Pregnant or breastfeeding women should consult a pharmacist before use.', 'Warning'),
(3, 'Do not take continuously for more than 3 days.', 'Warning'),
-- Side Effect
(3, 'May cause drowsiness.', 'Side Effect'),
(3, 'For some may have stomach discomfort.', 'Side Effect'),
(3, 'In case of allergy, symptoms may include dry mouth/throat, constipation, blurred vision, or palpitations.', 'Side Effect');

INSERT INTO medicine_instructions (medicine_id, content, type)
VALUES
-- Ponstan
-- Instruction
(4, 'For individuals over 14 years old.', 'Instruction'),
(4, 'Take 1 tablet every 6 hours.', 'Instruction'),
(4, 'You can stop taking the medicine if symptoms improve.', 'Instruction'),
-- Warning
(4, 'Do not take more than 3 doses per day.', 'Instruction'),
(4, 'Those allergic to NSAIDs should consult a pharmacist before use.', 'Instruction'),
(4, 'People with stomach or intestinal conditions should consult a pharmacist before use.', 'Instruction'),
(4, 'Those with heart disease, kidney disease, or high blood pressure should consult a pharmacist before use.', 'Instruction'),
-- Side Effect
(4, 'For some may have stomach irritation.', 'Instruction'),
(4, 'If abdominal pain, nausea, vomiting, or palpitations occur, seek medical attention immediately.', 'Instruction');

INSERT INTO medicine_instructions (medicine_id, content, type)
VALUES
-- Ponstan
-- Instruction
(5, 'Clean the wound with saline solution or clean water.', 'Instruction'),
(5, 'Dry the wound and clean around it with alcohol.', 'Instruction'),
(5, 'Apply Betadine to the wound.', 'Instruction'),
(5, 'Cover the wound with adhesive bandages.', 'Instruction'),
-- Warning
(5, 'For external use only. Do not ingest.', 'Instruction');

INSERT INTO medicine_symptoms (medicine_id, symptom_id, effectiveness)
VALUES
-- Activated Charcoal (medicine_id = 1)
(1, 1, 90.00), -- Effective for Diarrhea

-- Paracetamol (medicine_id = 2)
(2, 2, 95.00), -- Effective for Headache
(2, 3, 90.00), -- Effective for Fever

-- Norgesic (medicine_id = 3)
(3, 5, 85.00), -- Effective for Back/Shoulder/Muscle/Joint Pain
(3, 6, 90.00), -- Effective for Muscle Pain

-- Ponstan (medicine_id = 4)
(4, 4, 95.00), -- Effective for Back/Shoulder/Muscle/Joint Pain

-- Mini First Aid Kit (medicine_id = 5)
(5, 7, 95.00); -- Effective for Back/Shoulder/Muscle/Joint Pain

-- Stock
INSERT INTO medicine_stocks (medicine_id, stock_amount, expire_at)
VALUES
  (1, 20, '2025-12-31'),
  (1, 10, '2026-06-30'),
  (2, 15, '2025-11-15'),
  (3, 30, '2025-09-01'),
  (3, 10, '2026-01-01');
--
