
INSERT INTO nongpanya.symptoms (name, description)
VALUES
('Diarrhea', 'Frequent, loose, or watery bowel movements that may be accompanied by abdominal discomfort.'),
('Bloating', 'A feeling of fullness or swelling in the abdomen, often accompanied by gas or discomfort.'),
('Headache', 'Pain or discomfort in the head or upper neck, often described as throbbing, sharp, or dull.'),
('Fever', 'An increase in body temperature above the normal range, often a sign of infection or inflammation.'),
('Toothache', 'Pain or discomfort in or around a tooth, often due to decay, infection, or injury.'),
('Menstrual Pain', 'Cramping or aching in the lower abdomen associated with menstruation, sometimes radiating to the back or thighs.'),
('Back/Shoulder/Muscle/Joint Pain', 'Pain or discomfort in the back, shoulders, muscles, or joints, which can be caused by strain, injury, or inflammation.'),
('Muscle Pain', 'Soreness or aching in muscles due to overuse, tension, or injury.'),
('Tremors (Parkinson\'s Disease)', 'Involuntary rhythmic shaking or trembling, often in the hands, arms, legs, or head, commonly associated with Parkinson\'s disease.');


INSERT INTO nongpanya.medicines (name, image_url, type, description, strength)
VALUES
('Activated Charcoal 260 mg', 'https://i.ibb.co/CB2zvF7/carbon.jpg', 'Capsule', 'Activated Charcoal 260 mg is used to treat diarrhea, bloating, and to absorb toxins in the digestive system. It is suitable for both children and adults.', 260),
('Paracetamol 500 mg (Acetaminophen)', 'https://i.ibb.co/nsgyrQX/para.jpg', 'Tablet', 'Paracetamol 500 mg tablet is used to reduce fever and relieve mild to moderate pain, such as headaches, toothaches, and muscle pain. Suitable for adults and children above 12 years. Store in a cool, dry place below 30°C.', 500),
('Tolperisone 50 mg', 'https://i.ibb.co/L13F3t8/tero.jpg', 'Tablet', 'Tolperisone 50 mg is a muscle relaxant used to relieve pain caused by muscle tension or spasms and to treat tremors in conditions like Parkinson’s disease.', 50);

INSERT INTO nongpanya.medicine_instructions (medicine_id, content, type)
VALUES
-- Activated Charcoal
-- Instruction
(1, 'Take on an empty stomach approximately 1–2 hours before or after meals.', 'Instruction'),
(1, 'Can be taken 2 hours before or after other medications.', 'Instruction'),
(1, 'Can be mixed with water in an appropriate ratio for children to take.', 'Instruction'),
(1, 'Drink water after taking the medication.', 'Instruction'),
-- Warning
(1, 'Do not take this medicine at the same time as other medications.', 'Warning'),
(1, 'May cause black stools, which is harmless as the black color is from the medicine.', 'Warning'),
(1, 'May cause bloating, flatulence, or abdominal discomfort in some individuals, which is a normal effect of the medicine absorbing toxins in the body.', 'Warning'),
(1, 'If diarrhea does not improve within 2-3 days after taking the medicine, consult a doctor.', 'Warning'),
(1, 'Pregnant or breastfeeding women, those recovering from surgery, or individuals with gastrointestinal diseases should consult a doctor or pharmacist before use.', 'Warning'),
(1, 'Avoid consuming dairy products, syrups, alcohol, or fermented foods after taking the medicine.', 'Warning'),
(1, 'Not suitable for individuals exposed to severe toxic substances such as strong acids or alkalis, as it may be difficult to neutralize the toxins.', 'Warning'),
-- Side Effect
(1, 'Overuse may lead to constipation.', 'Side Effect'),
(1, 'Overuse may cause excessive thirst.', 'Side Effect'),
(1, 'In severe cases, overuse may result in intestinal blockage.', 'Side Effect');

INSERT INTO nongpanya.medicine_instructions (medicine_id, content, type)
VALUES
-- Paracetamol
-- Instruction
(2, 'Paracetamol can be taken before or after meals.', 'Instruction'),
(2, 'Dosage should be appropriate to body weight.', 'Instruction'),
(2, 'Take at least 4-6 hours apart, and do not exceed 8 tablets (4,000 mg) per day in the 500 mg form.', 'Instruction'),
(2, 'Drink water after taking the medication.', 'Instruction'),
(2, 'If you forget a dose, take it as soon as you remember without doubling the dose for the next intake.', 'Instruction'),
-- Warning
(2, 'If the fever does not subside within 3 days of use, consult a doctor for further diagnosis.', 'Warning'),
(2, 'Do not take the medication continuously for more than 5 days. If symptoms persist, consult a doctor for further diagnosis.', 'Warning'),
(2, 'Avoid using this medication with other products containing paracetamol, as it may lead to overdose.', 'Warning'),
(2, 'If an allergic reaction occurs, such as rash, itching, swelling of the face, eyelids, or lips, hives, dizziness, or difficulty breathing, seek immediate medical attention.', 'Warning'),
(2, 'Individuals who regularly consume alcohol or have liver and kidney diseases should consult a doctor or pharmacist before use.', 'Warning'),
(2, 'Do not take the medication if you do not have the listed symptoms.', 'Warning'),
-- Side Effect
(2, 'Overdose (more than 150 mg/kg of body weight) may cause nausea.', 'Side Effect'),
(2, 'Overdose may lead to vomiting.', 'Side Effect'),
(2, 'Overdose may cause drowsiness and low blood pressure.', 'Side Effect'),
(2, 'Overdose may impair liver and kidney function.', 'Side Effect');

INSERT INTO nongpanya.medicine_instructions (medicine_id, content, type)
VALUES
-- Tolperisone
-- Instruction
(3, 'Take the medicine with or after meals.', 'Instruction'),
(3, 'Do not chew or break the tablet.; swallow it whole.', 'Instruction'),
(3, 'Take the medicine only when symptoms occur.', 'Instruction'),
-- Warning
(3, 'Do not take more than 9 tablets (450 mg) per day.', 'Warning'),
(3, 'Some patients may experience drowsiness after taking this medicine.', 'Warning'),
(3, 'Avoid use if you have a history of allergy to Tolperisone or its components, or if you have Myasthenia Gravis.', 'Warning'),
(3, 'If allergic reactions occur, such as rash, itching, swelling of the face, eyelids, or lips, hives, dizziness, or difficulty breathing, seek immediate medical attention.', 'Warning'),
(3, 'Pregnant or breastfeeding individuals, or those with chronic diseases such as liver or kidney problems, should consult a doctor or pharmacist before use.', 'Warning'),
(3, 'If there is no pain, you can stop the medication; there is no need to continue taking it.', 'Warning'),
(3, 'If you forget to take a dose, take it as soon as you remember without doubling the next dose.', 'Warning'),
(3, 'Avoid using this medication with other centrally acting muscle relaxants, Methocarbamol, or medications metabolized by the CYP2D6 enzyme, such as Thioridazine and Venlafaxine.', 'Warning'),
(3, 'Do not use this medication with NSAIDs or Niflumic Acid.', 'Warning'),
-- Side Effect
(3, 'Overdose may cause drowsiness.', 'Side Effect'),
(3, 'Overdose may lead to dry mouth.', 'Side Effect'),
(3, 'Overdose may result in nausea.', 'Side Effect'),
(3, 'Overdose may cause vomiting.', 'Side Effect'),
(3, 'Overdose may trigger rashes or hives.', 'Side Effect');

INSERT INTO nongpanya.medicine_symptoms (medicine_id, symptom_id, effectiveness)
VALUES
-- Activated Charcoal (medicine_id = 1)
(1, 1, 90.00), -- Effective for Diarrhea
(1, 2, 85.00), -- Effective for Bloating

-- Paracetamol (medicine_id = 2)
(2, 3, 95.00), -- Effective for Headache
(2, 4, 90.00), -- Effective for Fever
(2, 5, 85.00), -- Effective for Toothache
(2, 6, 80.00), -- Effective for Menstrual Pain
(2, 7, 75.00), -- Effective for Back/Shoulder/Muscle/Joint Pain

-- Tolperisone (medicine_id = 3)
(3, 7, 85.00), -- Effective for Back/Shoulder/Muscle/Joint Pain
(3, 8, 90.00), -- Effective for Muscle Pain
(3, 9, 70.00); -- Effective for Tremors (Parkinson's Disease)



-- Mock user
INSERT INTO users (id, email, fullname, role, auth_provider) VALUES
('USR00000001', 'alice@example.com', 'Alice Smith', 'user', 'local'),
('USR00000002', 'bob@example.com', 'Bob Johnson', 'user', 'local');


-- Alice
INSERT INTO requests (code, user_id, weight, additional_notes, allergies, status)
VALUES
(1, 'USR00000001', 54.5, 'Fever and headache after travel', '', 'completed'),
(2, 'USR00000001', 53.8, 'Occasional bloating', 'None', 'completed'),
(3, 'USR00000001', 54.1, 'Needs pain relief only, no clear symptom', '', 'pending');

INSERT INTO request_medicines (request_code, medicine_id) VALUES
(1, 2), -- Paracetamol for Fever & Headache
(2, 1), -- Activated Charcoal for Bloating
(3, 3); -- Tolperisone for general pain (no symptom recorded)

INSERT INTO request_symptoms (request_code, symptom_id) VALUES
(1, 3), -- Headache
(1, 4), -- Fever
(2, 2); -- Bloating
-- (3) has no symptoms


-- Bob
INSERT INTO requests (code, user_id, weight, additional_notes, allergies, status)
VALUES
(4, 'USR00000002', 72.0, 'Toothache with mild fever', '', 'completed'),
(5, 'USR00000002', 70.5, 'Back tightness – uses muscle relaxant only', '', 'completed'),
(6, 'USR00000002', 71.3, 'Diarrhea symptoms', 'Lactose', 'pending');

INSERT INTO request_medicines (request_code, medicine_id) VALUES
(4, 2), -- Paracetamol for Toothache & Fever
(5, 3), -- Tolperisone for muscle tension (no symptom recorded)
(6, 1); -- Activated Charcoal for Diarrhea

INSERT INTO request_symptoms (request_code, symptom_id) VALUES
(4, 4), -- Fever
(4, 5), -- Toothache
(6, 1); -- Diarrhea
-- (5) has no symptoms

-- Stock
INSERT INTO medicine_stocks (medicine_id, stock_amount, expire_at)
VALUES
  (1, 20, '2025-12-31'),
  (1, 10, '2026-06-30'),
  (2, 15, '2025-11-15'),
  (3, 30, '2025-09-01'),
  (3, 10, '2026-01-01');
--
