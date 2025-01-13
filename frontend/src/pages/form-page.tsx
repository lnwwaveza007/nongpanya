import React, { useEffect, useState } from "react";
import {
  Pill,
  AlertCircle,
  Weight,
  UserCog,
  // Toilet,
  // BicepsFlexed
} from "lucide-react";
import { User, Mail, Phone } from "lucide-react";
import CustomCheckbox from "@/components/form/CustomCheckbox";
import { CustomInput, CustomTextArea } from "@/components/form/CustomInput";
import { useNavigate } from "react-router-dom";
import ModalBox from "@/components/form/ModalBox";

import { axiosInstance } from "@/utils/axiosInstance";
import { useValidateCode } from "@/hooks/validateCode";
import TermsCheckbox from "@/components/form/TermCheckBox";

interface Symptom {
  id: string;
  icon: React.ReactNode;
  name: string;
}

interface UserInt {
  id: string;
  fullname: string;
  email: string;
}

const NongpanyaVending = () => {
  const navigate = useNavigate();
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [user, setUser] = useState<UserInt>();
  const [symptomsList, setSymptomsList] = useState<Symptom[]>([]);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [age, setAge] = useState<number | null>(null);
  const [weight, setWeight] = useState<number | null>(null);
  const [allergies, setAllergies] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showTerms, setShowTerms] = useState<boolean>(false);
  const getSearchParams = new URLSearchParams(window.location.search);
  const code = getSearchParams.get("code");

  useValidateCode(code);

  const fetchFrom = async () => {
    try {
      const resUser = await axiosInstance.get("/user");
      const resSymp = await axiosInstance.get("/med/symptoms");

      setUser(resUser.data.data);
      setSymptomsList(resSymp.data.data);
    } catch (error) {
      return error;
    }
  };
  useEffect(() => {
    fetchFrom();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.target.name === "name") {
      setName(e.target.value);
    }
    if (e.target.name === "email") {
      setEmail(e.target.value);
    }
    if (e.target.name === "phone") {
      setPhone(e.target.value);
    }
    if (e.target.name === "age") {
      setAge(parseInt(e.target.value));
    }
    if (e.target.name === "weight") {
      setWeight(parseInt(e.target.value));
    }
    if (e.target.name === "allergies") {
      setAllergies(e.target.value);
    }
    if (e.target.name === "note") {
      setNote(e.target.value);
    }
    if (e.target.name === "terms") {
      setShowTerms((e.target as HTMLInputElement).checked);
    }
  };

  const handleSymptomToggle = (id: string) => {
    if (symptoms.includes(id)) {
      setSymptoms((prevSymptoms) => {
        const newSymptoms = prevSymptoms.filter((symptom) => symptom !== id);
        return newSymptoms;
      });
    } else {
      setSymptoms((prevSymptoms) => {
        const newSymptoms = [...prevSymptoms, id];
        return newSymptoms;
      });
    }
  };

  const postAPI = async () => {
    if (!showTerms) {
      alert("Please accept the terms and conditions.");
      return;
    }

    if (showModal) return;
    setShowModal(true);
    try {
      const formData = {
        code: code,
        name: name,
        email: email,
        phone: phone,
        age: age,
        weight: weight,
        allergies: allergies,
        symptoms: symptoms,
        additional_notes: note,
      };
      const response = await axiosInstance.post(
        "/med/symptoms/submit",
        formData
      );
      
      if (response.status === 201 && response.data.success) {
        navigate("/loading");
      }
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 403) {
          alert("QR Code Timeout. Please try again.");
          navigate('/');
        } else {
          alert(
            "An error occurred while submitting your data. Please try again."
          );
        }
      } else {
        alert(
          "Unable to connect. Please check your internet connection and try again."
        );
      }
      setShowModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Animated Robot Face Header */}
      <div className="text-center mb-8 animate-fade-in">
        <div
          className="text-6xl font-bold transition-all duration-300 hover:scale-110 cursor-pointer"
          style={{ color: "#FF4B28" }}
        >
          {symptoms.length > 0 ? "( ^o^ )" : "( ^.^ )"}
        </div>
        <h1
          className="text-4xl font-bold mt-4 animate-bounce"
          style={{ color: "#FF4B28" }}
        >
          Nongpanya
        </h1>
        <p className="text-xl mt-2" style={{ color: "#919191" }}>
          Your Friendly Medical Assistant
        </p>
      </div>

      {/* Warning Message */}
      <div className="max-w-4xl mx-auto mb-6 p-4 bg-yellow-100 rounded-lg flex items-center gap-2">
        <AlertCircle className="text-yellow-600" />
        <p className="text-yellow-700">
          For mild symptoms only. If symptoms are severe or persist, please
          visit the HCU.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-5">
        <CustomInput
          icon={<User size={20} />}
          type="text"
          name="name"
          placeholder="Your Name"
          value={user?.fullname}
          // value="Nongpanya Nim"
          onChange={handleInputChange}
          readOnly={true}
        />
        <CustomInput
          icon={<Mail size={20} />}
          type="email"
          name="email"
          placeholder="Email Address"
          value={user?.email}
          // value="nongpanya@nim.com"
          onChange={handleInputChange}
          readOnly={true}
        />
        <CustomInput
          icon={<Phone size={20} />}
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={phone}
          onChange={handleInputChange}
          readOnly={true}
        />
        <CustomInput
          icon={<UserCog size={20} />}
          type="number"
          name="age"
          placeholder="Your Age (years)"
          value={age}
          onChange={handleInputChange}
        />
        <CustomInput
          icon={<Weight size={20} />}
          type="number"
          name="weight"
          placeholder="Your Weight (kg)"
          value={weight}
          onChange={handleInputChange}
        />
        <CustomInput
          icon={<Pill size={20} />}
          type="text"
          name="allergies"
          placeholder="Any Allergies"
          value={allergies}
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

      {/* Note Textarea */}
      <div className="md:col-span-2 mt-5">
        <CustomTextArea
          name="note"
          placeholder="Other symptoms or notes"
          value={note}
          onChange={handleInputChange}
        />
      </div>

      <TermsCheckbox checked={showTerms} onChange={handleInputChange} />

      {/* Submit Button */}
      <div className="text-center mt-8">
        <button
          className="bg-primary text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300"
          onClick={() => postAPI()}
        >
          Submit
        </button>
      </div>
      {/* Add this before the closing div */}
      <ModalBox isOpen={showModal} />
    </div>
  );
};

export default NongpanyaVending;
