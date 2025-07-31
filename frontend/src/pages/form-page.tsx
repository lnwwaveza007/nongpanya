import React, { useEffect, useState } from "react";
import {
  Pill,
  AlertCircle,
  HeartPulse,
  Calendar,
  // Toilet,
  // BicepsFlexed
} from "lucide-react";
import { User, Mail, Phone } from "lucide-react";
import CustomCheckbox from "@/components/form/CustomCheckbox";
import { CustomInput, CustomTextArea } from "@/components/form/CustomInput";
import { useNavigate } from "react-router-dom";
import ModalBox from "@/components/form/ModalBox";
import { AxiosError } from "axios";

import { useValidateCode } from "@/hooks/validateCode";
import TermsCheckbox from "@/components/form/TermCheckBox";
import { getSymptoms, getUser, getUserQuota, submitSymptoms, getAllMedicines } from "@/api";
import { useTranslation } from "react-i18next";
import LanguageToggle from "@/components/ui/language-toggle";
import { FormDataset, Medicine } from "@/types";
import TabSelector from "@/components/form/TabSelector";
import MedicineSelector from "@/components/form/MedicineSelector";

interface Symptom {
  id: string;
  icon: React.ReactNode;
  name: string;
}

const NongpanyaVending = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [symptomsList, setSymptomsList] = useState<Symptom[]>([]);
  const [medicines, setMedicines] = useState<string[]>([]);
  const [medicinesList, setMedicinesList] = useState<Medicine[]>([]);
  const [activeTab, setActiveTab] = useState<"symptoms" | "medicines">("symptoms");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [allergies, setAllergies] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showTerms, setShowTerms] = useState<boolean>(false);
  const getSearchParams = new URLSearchParams(window.location.search);
  const code = getSearchParams.get("code");
  const [quota, setQuota] = useState<number>(0);

  useValidateCode(code);

    const getQuota = async () => {
      const response = await getUserQuota();
      if (response.status === 200 && response.data.success) {
        setQuota(response.data.data);
      }
    };

  useEffect(() => {
    getQuota();
  });

  const fetchFrom = async () => {
    try {
      const resUser = await getUser();
      const resSymp = await getSymptoms();
      const resMed = await getAllMedicines();

      setName(resUser.data.data.fullname);
      setEmail(resUser.data.data.email);
      setPhone(resUser.data.data.phone || "");
      setAllergies(resUser.data.data.allergies || "");
      setSymptomsList(resSymp.data.data);
      setMedicinesList(resMed.data.data);
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

  const handleMedicineToggle = (id: string) => {
    if (medicines.includes(id)) {
      setMedicines((prevMedicines) => {
        const newMedicines = prevMedicines.filter((medicine) => medicine !== id);
        return newMedicines;
      });
    } else {
      setMedicines((prevMedicines) => {
        const newMedicines = [...prevMedicines, id];
        return newMedicines;
      });
    }
  };

  const postAPI = async () => {
    if (!showTerms) {
      alert(t("form.pleaseAcceptTerms"));
      return;
    }

    if (showModal) return;
    setShowModal(true);
    try {
      const formData: FormDataset = {
        code: code?.toString() || "",
        name: name,
        email: email,
        phone: phone,
        allergies: allergies,
        additional_notes: note,
      };
      if (activeTab === "symptoms") {
        formData.symptoms = symptoms;
      } else {
        formData.medicines = medicines;
      }
      const response = await submitSymptoms(formData);
      if (response.status === 201 && response.data.success) {
        navigate("/loading");
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      if (axiosError.response) {
        if (axiosError.response.status === 403) {
          if (axiosError.response.data.message === "QR code timeout") {
            alert(t("form.invalidQR"));
          } else if (axiosError.response.data.message === "Limit Reach") {
            alert(t("form.limitReached"));
          }
          navigate('/');
        } else {
          alert(t("form.submitError"));
        }
      } else {
        alert(t("form.connectionError"));
      }
      setShowModal(false);
    }
  };

  const studentQuota = {
    used: quota,
    maxPerMonth: 3,
    resetDate: new Date(new Date(new Date().setMonth(new Date().getMonth() + 1)).setDate(1)).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 md:mx-6 lg:mx-10 max-w-[1248px] xl:mx-auto">
      <LanguageToggle variant="floating" />
      
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
          {t("form.title")}
        </h1>
        <p className="text-lg mt-2" style={{ color: "#919191" }}>
          {t("form.subtitle")}
        </p>
      </div>

     {/* Quota Card */}
     <div className="max-w-md mx-auto mb-6 bg-white rounded-lg shadow-md p-4 border border-primary">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-[#FF4B28]">{t("result.monthlyQuota")}</h2>
          <HeartPulse className="text-[#FF4B28]" size={18} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-2 bg-[#F5F7F9] rounded-lg">
            <p className="text-xs text-gray-600">{t("result.used")}</p>
            <p className="text-xl font-bold text-[#FF4B28]">
              {studentQuota.used}/{studentQuota.maxPerMonth}
            </p>
          </div>
          <div className="text-center p-2 bg-[#F5F7F9] rounded-lg">
            <p className="text-xs text-gray-600">{t("result.remaining")}</p>
            <p className="text-xl font-bold text-[#FFC926]">
              {studentQuota.maxPerMonth - studentQuota.used}
            </p>
          </div>
        </div>
        <div className="mt-3 flex items-center text-xs text-gray-600">
          <Calendar className="w-3 h-3 mr-1" />
          <span>{t("result.resetsOn")} {studentQuota.resetDate}</span>
        </div>
      </div> 

      {/* Warning Message */}
      <div className="max-w-4xl mx-auto mb-4 p-3 bg-yellow-100 rounded-lg flex items-center gap-2">
        <AlertCircle className="text-yellow-600" size={16} />
        <p className="text-yellow-700 text-sm">
          {t("form.warning")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-5">
        <CustomInput
          icon={<User size={20} />}
          type="text"
          name="name"
          placeholder={t("form.name")}
          value={name}
          // value="Nongpanya Nim"
          onChange={handleInputChange}
          readOnly={true}
        />
        <CustomInput
          icon={<Mail size={20} />}
          type="email"
          name="email"
          placeholder={t("form.email")}
          value={email}
          // value="nongpanya@nim.com"
          onChange={handleInputChange}
          readOnly={true}
        />
        <CustomInput
          icon={<Phone size={20} />}
          type="tel"
          name="phone"
          placeholder={t("form.phone")}
          value={phone}
          onChange={handleInputChange}
        />
        <CustomInput
          icon={<Pill size={20} />}
          type="text"
          name="allergies"
          placeholder={t("form.allergies")}
          value={allergies}
          onChange={handleInputChange}
        />
      </div>

      {/* Tab Selector */}
      <TabSelector
        activeTab={activeTab}
        onTabChange={setActiveTab}
        symptomsCount={symptoms.length}
        medicinesCount={medicines.length}
      />

      {/* Tab Content */}
      {activeTab === "symptoms" && (
        <CustomCheckbox
          checkboxprops={{ label: t("form.symptoms") }}
          symptomsList={symptomsList}
          symptoms={symptoms}
          handleSymptomToggle={handleSymptomToggle}
        />
      )}

      {activeTab === "medicines" && (
        <MedicineSelector
          medicinesList={medicinesList}
          selectedMedicines={medicines}
          onMedicineToggle={handleMedicineToggle}
        />
      )}

      {/* Note Textarea */}
      <div className="md:col-span-2 mt-5">
        <CustomTextArea
          name="note"
          placeholder={t("form.additionalNotesPlaceholder")}
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
          {t("form.submit")}
        </button>
      </div>
      {/* Add this before the closing div */}
      <ModalBox isOpen={showModal} />
    </div>
  );
};

export default NongpanyaVending;
