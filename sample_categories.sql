-- Sample waste categories for EcoSort AI
-- Run these SQL commands in your Supabase SQL editor

INSERT INTO waste_categories (name, description, bin_color, disposal_instructions, environmental_impact, points_value, icon_url) VALUES
('Plastic', 'Plastic bottles, containers, bags, and packaging materials', 'Blue', 'Clean and dry plastics. Remove caps and rings. Check recycling number 1-7.', 'Takes 450+ years to decompose, harms marine life', 10, '/icons/plastic.png'),
('Paper', 'Newspapers, cardboard, office paper, and paper products', 'Green', 'Keep dry and clean. Remove plastic windows from envelopes. Flatten cardboard boxes.', 'Saves trees, reduces landfill space', 8, '/icons/paper.png'),
('Metal', 'Aluminum cans, steel cans, foil, and metal containers', 'Yellow', 'Rinse containers. Crush cans to save space. Remove food residue.', 'Infinitely recyclable, saves energy vs new production', 12, '/icons/metal.png'),
('Glass', 'Glass bottles, jars, and other glass containers', 'Red', 'Rinse and remove lids. Separate by color if required. No broken glass.', '100% recyclable, can be recycled endlessly', 15, '/icons/glass.png'),
('Organic', 'Food waste, yard waste, and compostable materials', 'Brown', 'Compost food scraps and yard waste. No meat or dairy in home compost.', 'Reduces methane, creates nutrient-rich soil', 5, '/icons/organic.png'),
('E-waste', 'Electronic devices, batteries, and electrical equipment', 'Purple', 'Take to special e-waste facilities. Remove batteries. Do not put in regular trash.', 'Contains toxic materials, valuable for recycling', 20, '/icons/ewaste.png');
