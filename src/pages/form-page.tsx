import React, { useState } from 'react';
import {
    Pill, AlertCircle,
    Weight,
    UserCog,
    Toilet,
    BicepsFlexed
} from 'lucide-react';
import { User, Mail, Phone } from 'lucide-react';
import CustomCheckbox from '@/components/form/CustomCheckbox';
import { CustomInput, CustomTextArea } from '@/components/form/CustomInput';

interface Symptom {
    id: string;
    icon: React.ReactNode;
    name: string;
}

const NongpanyaVending = () => {
    const [symptoms, setSymptoms] = useState<string[]>([]);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        description: '',
        age: '',
        weight: '',
        allergies: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const symptomsList: Symptom[] = [
        {
            id: 'headache',
            name: 'Headache',
            icon: <Pill className="animate-bounce-custom" />,
        },
        {
            id: 'diarrhea',
            name: 'Diarrhea',
            icon: <Toilet className="animate-wobble" />,
        },
        {
            id: 'muscle-pain',
            name: 'Muscle Pain',
            icon: <BicepsFlexed className="animate-float" />,
        }
    ];

    const handleSymptomToggle = (id: string) => {
        setSymptoms(prev =>
            prev.includes(id)
                ? prev.filter(s => s !== id)
                : [...prev, id]
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            {/* Animated Robot Face Header */}
            <div className="text-center mb-8 animate-fade-in">
                <div className="text-6xl font-bold transition-all duration-300 hover:scale-110 cursor-pointer"
                    style={{ color: '#FF4B28' }}>
                    {symptoms.length > 0 ? '( ^o^ )' : '( ^.^ )'}
                </div>
                <h1 className="text-4xl font-bold mt-4 animate-bounce"
                    style={{ color: '#FF4B28' }}>
                    Nongpanya
                </h1>
                <p className="text-xl mt-2" style={{ color: '#919191' }}>
                    Your Friendly Medical Assistant
                </p>
            </div>

            {/* Warning Message */}
            <div className="max-w-4xl mx-auto mb-6 p-4 bg-yellow-100 rounded-lg flex items-center gap-2">
                <AlertCircle className="text-yellow-600" />
                <p className="text-yellow-700">
                    For mild symptoms only. If symptoms are severe or persist, please visit the HCU.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-5">
                <CustomInput
                    icon={<User size={20} />}
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    // value={formData.name}
                    value="Nongpanya Nim"
                    onChange={handleInputChange}
                    readOnly={true}
                />
                <CustomInput
                    icon={<Mail size={20} />}
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    // value={formData.email}
                    value="nongpanya@nim.com"
                    onChange={handleInputChange}
                    readOnly={true}
                />
                <CustomInput
                    icon={<Phone size={20} />}
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    // value={formData.phone}
                    value="012-3456789"
                    onChange={handleInputChange}
                    readOnly={true}
                />
                <CustomInput
                    icon={<UserCog size={20} />}
                    type="number"
                    name="age"
                    placeholder="Your Age (years)"
                    value={formData.age}
                    onChange={handleInputChange}
                />
                <CustomInput
                    icon={<Weight size={20} />}
                    type="number"
                    name="weight"
                    placeholder="Your Weight (kg)"
                    value={formData.weight}
                    onChange={handleInputChange}
                />
                <CustomInput
                    icon={<Pill size={20} />}
                    type="text"
                    name="allergies"
                    placeholder="Any Allergies"
                    value={formData.allergies || ''}
                    onChange={handleInputChange}
                />
            </div>

            {/* Custom Checkbox Component */}
            <CustomCheckbox
                checkboxprops={{ label: "Symptoms" }}
                symptomsList={symptomsList}
                symptoms={symptoms}
                handleSymptomToggle={handleSymptomToggle}
            />

            {/* Description Textarea */}
            <div className="md:col-span-2 mt-5">
                    <CustomTextArea
                        name="others"
                        placeholder="Other symptoms or notes"
                        value={formData.description}
                        onChange={handleInputChange}
                    />
                </div>

            {/* Submit Button */}
            <div className="text-center mt-8">
                <button
                    className="bg-primary text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300"
                    onClick={() => alert('Symptoms submitted!')}
                >
                    Submit
                </button>
            </div>
        </div>
    );
};

export default NongpanyaVending;