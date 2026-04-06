import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTheme } from "../../theme";
import type { ThemeMode } from "../../theme";

type AddLeadPageProps = {
  mode: ThemeMode;
};

type LeadFormData = {
  fullName: string;
  leadType: string;
  companyName: string;
  profession: string;
  preferredLanguage: string;
  leadStatus: string;
  priority: string;

  mobile: string;
  alternateMobile: string;
  whatsapp: string;
  email: string;
  contactMode: string;
  bestTimeToContact: string;
  city: string;
  area: string;
  address: string;

  interestLevel: string;
  buyingIntent: string;
  minBudget: string;
  maxBudget: string;
  financeType: string;
  decisionMaker: string;
  firstTimeBuyer: string;
  urgencyReason: string;

  requirementType: string;
  propertyType: string;
  preferredLocation: string;
  subLocation: string;
  minSqft: string;
  maxSqft: string;
  furnishing: string;
  possession: string;
  facing: string;
  floorPreference: string;
  parking: string;
  amenities: string[];
  specialRequirements: string[];

  leadSource: string;
  importedFrom: string;
  campaignName: string;
  referralName: string;
  brokerName: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  enquiryDate: string;
  enquiryTime: string;

  assignedTo: string;
  team: string;
  pipelineStage: string;
  nextFollowUpDate: string;
  nextFollowUpTime: string;
  followUpType: string;
  reminder: string;
  expectedClosureDate: string;
  tags: string[];

  leadSummary: string;
  conversationNotes: string;
  objections: string;
  internalRemarks: string;
};

const defaultForm: LeadFormData = {
  fullName: "",
  leadType: "Individual",
  companyName: "",
  profession: "",
  preferredLanguage: "Tamil",
  leadStatus: "New",
  priority: "Medium",

  mobile: "",
  alternateMobile: "",
  whatsapp: "",
  email: "",
  contactMode: "Call",
  bestTimeToContact: "Anytime",
  city: "",
  area: "",
  address: "",

  interestLevel: "Warm",
  buyingIntent: "Just Exploring",
  minBudget: "",
  maxBudget: "",
  financeType: "Not Decided",
  decisionMaker: "Yes",
  firstTimeBuyer: "No",
  urgencyReason: "",

  requirementType: "Buy",
  propertyType: "Apartment",
  preferredLocation: "",
  subLocation: "",
  minSqft: "",
  maxSqft: "",
  furnishing: "Unfurnished",
  possession: "Flexible",
  facing: "",
  floorPreference: "",
  parking: "No",
  amenities: [],
  specialRequirements: [],

  leadSource: "Manual Entry",
  importedFrom: "Manual Entry",
  campaignName: "",
  referralName: "",
  brokerName: "",
  utmSource: "",
  utmMedium: "",
  utmCampaign: "",
  enquiryDate: new Date().toISOString().split("T")[0],
  enquiryTime: "",

  assignedTo: "",
  team: "",
  pipelineStage: "New Lead",
  nextFollowUpDate: "",
  nextFollowUpTime: "",
  followUpType: "Call",
  reminder: "15 mins before",
  expectedClosureDate: "",
  tags: [],

  leadSummary: "",
  conversationNotes: "",
  objections: "",
  internalRemarks: "",
};

const amenityOptions = [
  "Lift",
  "Car Parking",
  "Security",
  "Gym",
  "Swimming Pool",
  "Power Backup",
  "Garden",
  "Club House",
];

const specialRequirementOptions = [
  "Vastu",
  "Corner Plot",
  "Gated Community",
  "Loan Eligible",
  "High Rental Yield",
  "Near Metro",
];

const tagOptions = [
  "Hot Lead",
  "Investor",
  "Premium",
  "NRI",
  "Repeat Customer",
  "Referral Lead",
];

export default function AddLeadPage({ mode }: AddLeadPageProps) {
  const theme = getTheme(mode);
  const navigate = useNavigate();

  const [form, setForm] = useState<LeadFormData>(defaultForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sameAsMobile, setSameAsMobile] = useState(true);

  const quickSummary = useMemo(() => {
    return {
      source: form.leadSource || "-",
      budget:
        form.minBudget || form.maxBudget
          ? `₹${form.minBudget || "0"} - ₹${form.maxBudget || "0"}`
          : "-",
      type: `${form.requirementType || "-"} / ${form.propertyType || "-"}`,
      location: form.preferredLocation || "-",
      assignee: form.assignedTo || "-",
    };
  }, [form]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === "mobile" && sameAsMobile) {
        updated.whatsapp = value;
      }

      return updated;
    });

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCheckboxArray = (
    field: "amenities" | "specialRequirements" | "tags",
    value: string
  ) => {
    setForm((prev) => {
      const exists = prev[field].includes(value);
      return {
        ...prev,
        [field]: exists
          ? prev[field].filter((item) => item !== value)
          : [...prev[field], value],
      };
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.fullName.trim()) newErrors.fullName = "Lead name is required";
    if (!form.mobile.trim()) newErrors.mobile = "Mobile number is required";
    if (!form.leadType.trim()) newErrors.leadType = "Lead type is required";
    if (!form.leadStatus.trim()) newErrors.leadStatus = "Status is required";
    if (!form.priority.trim()) newErrors.priority = "Priority is required";
    if (!form.requirementType.trim()) {
      newErrors.requirementType = "Requirement type is required";
    }
    if (!form.propertyType.trim()) {
      newErrors.propertyType = "Property type is required";
    }
    if (!form.preferredLocation.trim()) {
      newErrors.preferredLocation = "Preferred location is required";
    }
    if (!form.leadSource.trim()) newErrors.leadSource = "Lead source is required";
    if (!form.assignedTo.trim()) newErrors.assignedTo = "Assigned to is required";
    if (!form.pipelineStage.trim()) {
      newErrors.pipelineStage = "Pipeline stage is required";
    }
    if (!form.nextFollowUpDate.trim()) {
      newErrors.nextFollowUpDate = "Next follow-up date is required";
    }

    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (form.mobile && !/^\d{10}$/.test(form.mobile)) {
      newErrors.mobile = "Enter a valid 10-digit mobile number";
    }

    if (form.whatsapp && !/^\d{10}$/.test(form.whatsapp)) {
      newErrors.whatsapp = "Enter a valid 10-digit WhatsApp number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveLead = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const existingLeads = JSON.parse(localStorage.getItem("mei-crm-leads") || "[]");

    const newLead = {
      id: Date.now(),
      ...form,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "mei-crm-leads",
      JSON.stringify([newLead, ...existingLeads])
    );

    navigate("/leads");
  };

  const handleSaveAndAddAnother = () => {
    if (!validateForm()) return;

    const existingLeads = JSON.parse(localStorage.getItem("mei-crm-leads") || "[]");

    const newLead = {
      id: Date.now(),
      ...form,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "mei-crm-leads",
      JSON.stringify([newLead, ...existingLeads])
    );

    setForm(defaultForm);
    setErrors({});
    setSameAsMobile(true);
  };

  const sectionCardStyle: React.CSSProperties = {
    background: theme.cardBg,
    border: `1px solid ${theme.border}`,
    borderRadius: 20,
    padding: 20,
    boxShadow: mode === "dark" ? "none" : "0 8px 24px rgba(15,23,42,0.05)",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: `1px solid ${theme.border}`,
    background: theme.inputBg,
    color: theme.text,
    outline: "none",
    fontSize: 14,
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    marginBottom: 8,
    fontSize: 13,
    fontWeight: 600,
    color: theme.text,
  };

  const helperStyle: React.CSSProperties = {
    fontSize: 12,
    color: theme.subText,
    marginTop: -4,
    marginBottom: 16,
  };

  const errorStyle: React.CSSProperties = {
    color: "#dc2626",
    fontSize: 12,
    marginTop: 6,
  };

  const renderField = (
    label: string,
    name: keyof LeadFormData,
    type: "text" | "email" | "date" | "time" = "text",
    placeholder = ""
  ) => (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        name={name}
        type={type}
        value={form[name] as string}
        onChange={handleChange}
        placeholder={placeholder}
        style={inputStyle}
      />
      {errors[name] && <div style={errorStyle}>{errors[name]}</div>}
    </div>
  );

  const renderSelect = (
    label: string,
    name: keyof LeadFormData,
    options: string[]
  ) => (
    <div>
      <label style={labelStyle}>{label}</label>
      <select
        name={name}
        value={form[name] as string}
        onChange={handleChange}
        style={inputStyle}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {errors[name] && <div style={errorStyle}>{errors[name]}</div>}
    </div>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme.pageBg,
        color: theme.text,
        padding: 24,
      }}
    >
      <form onSubmit={handleSaveLead}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 16,
            flexWrap: "wrap",
            marginBottom: 24,
          }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800 }}>
              Add New Lead
            </h1>
            <p style={{ margin: "8px 0 0", color: theme.subText, fontSize: 14 }}>
              Capture and qualify a new lead for follow-up and conversion
            </p>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => navigate("/leads")}
              style={{
                padding: "12px 18px",
                borderRadius: 12,
                border: `1px solid ${theme.border}`,
                background: theme.cardBg,
                color: theme.text,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSaveAndAddAnother}
              style={{
                padding: "12px 18px",
                borderRadius: 12,
                border: `1px solid ${theme.border}`,
                background: theme.cardBgSoft,
                color: theme.text,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Save & Add Another
            </button>

            <button
              type="submit"
              style={{
                padding: "12px 18px",
                borderRadius: 12,
                border: "none",
                background: theme.primary,
                color: "#fff",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              Save Lead
            </button>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) 340px",
            gap: 20,
            alignItems: "start",
          }}
        >
          <div style={{ display: "grid", gap: 20 }}>
            <section style={sectionCardStyle}>
              <h2 style={{ marginTop: 0, marginBottom: 6, fontSize: 18 }}>
                Basic Information
              </h2>
              <p style={helperStyle}>
                Add the primary identity and classification of the lead.
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 16,
                }}
              >
                {renderField("Lead Full Name *", "fullName", "text", "Enter full name")}
                {renderSelect("Lead Type *", "leadType", [
                  "Individual",
                  "Investor",
                  "Family Buyer",
                  "Tenant",
                  "Business / Commercial",
                  "Broker / Channel Partner",
                ])}
                {renderField("Company Name", "companyName")}
                {renderField("Profession", "profession")}
                {renderSelect("Preferred Language", "preferredLanguage", [
                  "Tamil",
                  "English",
                  "Hindi",
                ])}
                {renderSelect("Lead Status *", "leadStatus", [
                  "New",
                  "Attempted Contact",
                  "Contacted",
                  "Qualified",
                  "Site Visit Scheduled",
                  "Negotiation",
                  "Won",
                  "Lost",
                  "Junk",
                ])}
                {renderSelect("Priority *", "priority", [
                  "Low",
                  "Medium",
                  "High",
                  "Hot",
                ])}
              </div>
            </section>

            <section style={sectionCardStyle}>
              <h2 style={{ marginTop: 0, marginBottom: 6, fontSize: 18 }}>
                Contact Information
              </h2>
              <p style={helperStyle}>
                Add communication details and best contact preferences.
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 16,
                }}
              >
                {renderField("Mobile Number *", "mobile", "text", "10-digit mobile")}
                {renderField("Alternate Mobile", "alternateMobile")}
                <div>
                  <label style={labelStyle}>WhatsApp Number</label>
                  <input
                    name="whatsapp"
                    value={form.whatsapp}
                    onChange={handleChange}
                    placeholder="WhatsApp number"
                    style={inputStyle}
                  />
                  <div style={{ marginTop: 8 }}>
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        fontSize: 13,
                        color: theme.subText,
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={sameAsMobile}
                        onChange={(e) => {
                          setSameAsMobile(e.target.checked);
                          if (e.target.checked) {
                            setForm((prev) => ({ ...prev, whatsapp: prev.mobile }));
                          }
                        }}
                      />
                      Same as mobile number
                    </label>
                  </div>
                  {errors.whatsapp && <div style={errorStyle}>{errors.whatsapp}</div>}
                </div>

                {renderField("Email Address", "email", "email", "Enter email")}
                {renderSelect("Preferred Contact Mode", "contactMode", [
                  "Call",
                  "WhatsApp",
                  "SMS",
                  "Email",
                ])}
                {renderSelect("Best Time To Contact", "bestTimeToContact", [
                  "Morning",
                  "Afternoon",
                  "Evening",
                  "Anytime",
                ])}
                {renderField("Current City", "city")}
                {renderField("Current Area / Locality", "area")}
              </div>

              <div style={{ marginTop: 16 }}>
                <label style={labelStyle}>Full Address</label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Enter full address"
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </div>
            </section>

            <section style={sectionCardStyle}>
              <h2 style={{ marginTop: 0, marginBottom: 6, fontSize: 18 }}>
                Lead Qualification
              </h2>
              <p style={helperStyle}>
                Qualify the lead based on intent, budget, and urgency.
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 16,
                }}
              >
                {renderSelect("Interest Level", "interestLevel", [
                  "Cold",
                  "Warm",
                  "Hot",
                ])}
                {renderSelect("Buying Intent", "buyingIntent", [
                  "Immediate",
                  "Within 30 Days",
                  "Within 3 Months",
                  "Within 6 Months",
                  "Just Exploring",
                ])}
                {renderField("Min Budget", "minBudget", "text", "e.g. 5000000")}
                {renderField("Max Budget", "maxBudget", "text", "e.g. 8000000")}
                {renderSelect("Finance Type", "financeType", [
                  "Self Funded",
                  "Loan Required",
                  "Pre-approved Loan",
                  "Not Decided",
                ])}
                {renderSelect("Decision Maker", "decisionMaker", [
                  "Yes",
                  "No",
                  "Joint Decision",
                ])}
                {renderSelect("First Time Buyer", "firstTimeBuyer", [
                  "Yes",
                  "No",
                ])}
                {renderField("Urgency Reason", "urgencyReason", "text", "Investment / Self Use")}
              </div>
            </section>

            <section style={sectionCardStyle}>
              <h2 style={{ marginTop: 0, marginBottom: 6, fontSize: 18 }}>
                Requirement Details
              </h2>
              <p style={helperStyle}>
                Capture the exact property requirement and preferences.
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 16,
                }}
              >
                {renderSelect("Requirement Type *", "requirementType", [
                  "Buy",
                  "Rent",
                  "Lease",
                  "Sell",
                  "Invest",
                ])}
                {renderSelect("Property Type *", "propertyType", [
                  "Apartment",
                  "Villa",
                  "Plot",
                  "Commercial Shop",
                  "Office Space",
                  "Warehouse",
                  "Land",
                ])}
                {renderField("Preferred Location *", "preferredLocation")}
                {renderField("Sub-location / Area", "subLocation")}
                {renderField("Min Sqft", "minSqft")}
                {renderField("Max Sqft", "maxSqft")}
                {renderSelect("Furnishing", "furnishing", [
                  "Unfurnished",
                  "Semi Furnished",
                  "Fully Furnished",
                ])}
                {renderSelect("Possession", "possession", [
                  "Ready to Move",
                  "Under Construction",
                  "Flexible",
                ])}
                {renderField("Facing Preference", "facing")}
                {renderField("Floor Preference", "floorPreference")}
                {renderSelect("Parking Requirement", "parking", ["Yes", "No"])}
              </div>

              <div style={{ marginTop: 20 }}>
                <label style={labelStyle}>Amenities Required</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {amenityOptions.map((item) => {
                    const active = form.amenities.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => handleCheckboxArray("amenities", item)}
                        style={{
                          padding: "10px 14px",
                          borderRadius: 999,
                          border: `1px solid ${active ? theme.primary : theme.border}`,
                          background: active ? theme.primary : theme.cardBg,
                          color: active ? "#fff" : theme.text,
                          cursor: "pointer",
                          fontSize: 13,
                          fontWeight: 600,
                        }}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ marginTop: 20 }}>
                <label style={labelStyle}>Special Requirements</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {specialRequirementOptions.map((item) => {
                    const active = form.specialRequirements.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() =>
                          handleCheckboxArray("specialRequirements", item)
                        }
                        style={{
                          padding: "10px 14px",
                          borderRadius: 999,
                          border: `1px solid ${active ? theme.primary : theme.border}`,
                          background: active ? theme.primary : theme.cardBg,
                          color: active ? "#fff" : theme.text,
                          cursor: "pointer",
                          fontSize: 13,
                          fontWeight: 600,
                        }}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            <section style={sectionCardStyle}>
              <h2 style={{ marginTop: 0, marginBottom: 6, fontSize: 18 }}>
                Source Details
              </h2>
              <p style={helperStyle}>
                Track where the lead came from and measure source performance.
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 16,
                }}
              >
                {renderSelect("Lead Source *", "leadSource", [
                  "Manual Entry",
                  "Website",
                  "Facebook",
                  "Instagram",
                  "Google Ads",
                  "WhatsApp",
                  "Referral",
                  "Walk-in",
                  "Broker",
                  "Property Portal",
                  "Cold Call",
                  "Event / Expo",
                ])}
                {renderSelect("Imported From", "importedFrom", [
                  "Manual Entry",
                  "Website Form",
                  "CSV Import",
                  "API",
                  "Meta Lead Ads",
                ])}
                {renderField("Campaign Name", "campaignName")}
                {renderField("Referral Name", "referralName")}
                {renderField("Broker Name", "brokerName")}
                {renderField("UTM Source", "utmSource")}
                {renderField("UTM Medium", "utmMedium")}
                {renderField("UTM Campaign", "utmCampaign")}
                {renderField("Enquiry Date", "enquiryDate", "date")}
                {renderField("Enquiry Time", "enquiryTime", "time")}
              </div>
            </section>

            <section style={sectionCardStyle}>
              <h2 style={{ marginTop: 0, marginBottom: 6, fontSize: 18 }}>
                Internal Notes
              </h2>
              <p style={helperStyle}>
                Save important notes for sales context and future follow-up.
              </p>

              <div style={{ display: "grid", gap: 16 }}>
                <div>
                  <label style={labelStyle}>Lead Summary</label>
                  <textarea
                    name="leadSummary"
                    value={form.leadSummary}
                    onChange={handleChange}
                    rows={3}
                    style={{ ...inputStyle, resize: "vertical" }}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Conversation Notes</label>
                  <textarea
                    name="conversationNotes"
                    value={form.conversationNotes}
                    onChange={handleChange}
                    rows={4}
                    style={{ ...inputStyle, resize: "vertical" }}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Objections</label>
                  <textarea
                    name="objections"
                    value={form.objections}
                    onChange={handleChange}
                    rows={3}
                    style={{ ...inputStyle, resize: "vertical" }}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Internal Remarks</label>
                  <textarea
                    name="internalRemarks"
                    value={form.internalRemarks}
                    onChange={handleChange}
                    rows={3}
                    style={{ ...inputStyle, resize: "vertical" }}
                  />
                </div>
              </div>
            </section>
          </div>

          <aside style={{ display: "grid", gap: 20, position: "sticky", top: 20 }}>
            <section style={sectionCardStyle}>
              <h3 style={{ marginTop: 0, marginBottom: 6 }}>Assignment & Follow-up</h3>
              <p style={helperStyle}>
                Set ownership and the next follow-up action.
              </p>

              <div style={{ display: "grid", gap: 16 }}>
                {renderField("Assigned To *", "assignedTo")}
                {renderField("Team / Department", "team")}
                {renderSelect("Pipeline Stage *", "pipelineStage", [
                  "New Lead",
                  "Contacted",
                  "Qualified",
                  "Site Visit",
                  "Negotiation",
                  "Won",
                  "Lost",
                ])}
                {renderField("Next Follow-up Date *", "nextFollowUpDate", "date")}
                {renderField("Next Follow-up Time", "nextFollowUpTime", "time")}
                {renderSelect("Follow-up Type", "followUpType", [
                  "Call",
                  "WhatsApp",
                  "Meeting",
                  "Site Visit",
                  "Email",
                ])}
                {renderSelect("Reminder", "reminder", [
                  "15 mins before",
                  "1 hour before",
                  "Same day morning",
                ])}
                {renderField("Expected Closure Date", "expectedClosureDate", "date")}
              </div>
            </section>

            <section style={sectionCardStyle}>
              <h3 style={{ marginTop: 0, marginBottom: 12 }}>Tags</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {tagOptions.map((item) => {
                  const active = form.tags.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => handleCheckboxArray("tags", item)}
                      style={{
                        padding: "10px 14px",
                        borderRadius: 999,
                        border: `1px solid ${active ? theme.primary : theme.border}`,
                        background: active ? theme.primary : theme.cardBg,
                        color: active ? "#fff" : theme.text,
                        cursor: "pointer",
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </section>

            <section style={sectionCardStyle}>
              <h3 style={{ marginTop: 0, marginBottom: 12 }}>Quick Summary</h3>

              <div style={{ display: "grid", gap: 14 }}>
                <SummaryRow label="Source" value={quickSummary.source} theme={theme} />
                <SummaryRow label="Budget" value={quickSummary.budget} theme={theme} />
                <SummaryRow label="Type" value={quickSummary.type} theme={theme} />
                <SummaryRow label="Location" value={quickSummary.location} theme={theme} />
                <SummaryRow label="Assigned To" value={quickSummary.assignee} theme={theme} />
              </div>
            </section>
          </aside>
        </div>
      </form>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  theme,
}: {
  label: string;
  value: string;
  theme: ReturnType<typeof getTheme>;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 12,
        borderBottom: `1px solid ${theme.borderSoft || theme.border}`,
        paddingBottom: 10,
      }}
    >
      <span style={{ color: theme.subText, fontSize: 13 }}>{label}</span>
      <span
        style={{
          color: theme.text,
          fontSize: 13,
          fontWeight: 700,
          textAlign: "right",
        }}
      >
        {value}
      </span>
    </div>
  );
}