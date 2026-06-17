import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { studentSchema } from "./student.schema";
import { mapStudentToApi } from "./student.mapper";
import { createStudent } from "../../api/studentApi";
import toast from "react-hot-toast";
import { useState, useEffect, useRef } from "react";

// ─────────────────────────────────────────────
// STATIC DATA
// ─────────────────────────────────────────────
const GENDERS = [
  { value: "male",   label: "Male" },
  { value: "female", label: "Female" },
  { value: "other",  label: "Other" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
];

const COUNTRIES = [
  { code: "AF", name: "Afghanistan",          dial: "+93"  },
  { code: "AL", name: "Albania",               dial: "+355" },
  { code: "DZ", name: "Algeria",               dial: "+213" },
  { code: "AD", name: "Andorra",               dial: "+376" },
  { code: "AO", name: "Angola",                dial: "+244" },
  { code: "AR", name: "Argentina",             dial: "+54"  },
  { code: "AM", name: "Armenia",               dial: "+374" },
  { code: "AU", name: "Australia",             dial: "+61"  },
  { code: "AT", name: "Austria",               dial: "+43"  },
  { code: "AZ", name: "Azerbaijan",            dial: "+994" },
  { code: "BH", name: "Bahrain",               dial: "+973" },
  { code: "BD", name: "Bangladesh",            dial: "+880" },
  { code: "BY", name: "Belarus",               dial: "+375" },
  { code: "BE", name: "Belgium",               dial: "+32"  },
  { code: "BZ", name: "Belize",                dial: "+501" },
  { code: "BJ", name: "Benin",                 dial: "+229" },
  { code: "BT", name: "Bhutan",                dial: "+975" },
  { code: "BO", name: "Bolivia",               dial: "+591" },
  { code: "BA", name: "Bosnia and Herzegovina",dial: "+387" },
  { code: "BW", name: "Botswana",              dial: "+267" },
  { code: "BR", name: "Brazil",                dial: "+55"  },
  { code: "BN", name: "Brunei",                dial: "+673" },
  { code: "BG", name: "Bulgaria",              dial: "+359" },
  { code: "BF", name: "Burkina Faso",          dial: "+226" },
  { code: "BI", name: "Burundi",               dial: "+257" },
  { code: "KH", name: "Cambodia",              dial: "+855" },
  { code: "CM", name: "Cameroon",              dial: "+237" },
  { code: "CA", name: "Canada",                dial: "+1"   },
  { code: "CV", name: "Cape Verde",            dial: "+238" },
  { code: "CF", name: "Central African Republic", dial: "+236" },
  { code: "TD", name: "Chad",                  dial: "+235" },
  { code: "CL", name: "Chile",                 dial: "+56"  },
  { code: "CN", name: "China",                 dial: "+86"  },
  { code: "CO", name: "Colombia",              dial: "+57"  },
  { code: "KM", name: "Comoros",               dial: "+269" },
  { code: "CG", name: "Congo",                 dial: "+242" },
  { code: "CR", name: "Costa Rica",            dial: "+506" },
  { code: "HR", name: "Croatia",               dial: "+385" },
  { code: "CU", name: "Cuba",                  dial: "+53"  },
  { code: "CY", name: "Cyprus",                dial: "+357" },
  { code: "CZ", name: "Czech Republic",        dial: "+420" },
  { code: "DK", name: "Denmark",               dial: "+45"  },
  { code: "DJ", name: "Djibouti",              dial: "+253" },
  { code: "DO", name: "Dominican Republic",    dial: "+1"   },
  { code: "EC", name: "Ecuador",               dial: "+593" },
  { code: "EG", name: "Egypt",                 dial: "+20"  },
  { code: "SV", name: "El Salvador",           dial: "+503" },
  { code: "GQ", name: "Equatorial Guinea",     dial: "+240" },
  { code: "ER", name: "Eritrea",               dial: "+291" },
  { code: "EE", name: "Estonia",               dial: "+372" },
  { code: "ET", name: "Ethiopia",              dial: "+251" },
  { code: "FJ", name: "Fiji",                  dial: "+679" },
  { code: "FI", name: "Finland",               dial: "+358" },
  { code: "FR", name: "France",                dial: "+33"  },
  { code: "GA", name: "Gabon",                 dial: "+241" },
  { code: "GM", name: "Gambia",                dial: "+220" },
  { code: "GE", name: "Georgia",               dial: "+995" },
  { code: "DE", name: "Germany",               dial: "+49"  },
  { code: "GH", name: "Ghana",                 dial: "+233" },
  { code: "GR", name: "Greece",                dial: "+30"  },
  { code: "GT", name: "Guatemala",             dial: "+502" },
  { code: "GN", name: "Guinea",                dial: "+224" },
  { code: "GW", name: "Guinea-Bissau",         dial: "+245" },
  { code: "GY", name: "Guyana",                dial: "+592" },
  { code: "HT", name: "Haiti",                 dial: "+509" },
  { code: "HN", name: "Honduras",              dial: "+504" },
  { code: "HU", name: "Hungary",               dial: "+36"  },
  { code: "IS", name: "Iceland",               dial: "+354" },
  { code: "IN", name: "India",                 dial: "+91"  },
  { code: "ID", name: "Indonesia",             dial: "+62"  },
  { code: "IR", name: "Iran",                  dial: "+98"  },
  { code: "IQ", name: "Iraq",                  dial: "+964" },
  { code: "IE", name: "Ireland",               dial: "+353" },
  { code: "IL", name: "Israel",                dial: "+972" },
  { code: "IT", name: "Italy",                 dial: "+39"  },
  { code: "JM", name: "Jamaica",               dial: "+1"   },
  { code: "JP", name: "Japan",                 dial: "+81"  },
  { code: "JO", name: "Jordan",                dial: "+962" },
  { code: "KZ", name: "Kazakhstan",            dial: "+7"   },
  { code: "KE", name: "Kenya",                 dial: "+254" },
  { code: "KW", name: "Kuwait",                dial: "+965" },
  { code: "KG", name: "Kyrgyzstan",            dial: "+996" },
  { code: "LA", name: "Laos",                  dial: "+856" },
  { code: "LV", name: "Latvia",                dial: "+371" },
  { code: "LB", name: "Lebanon",               dial: "+961" },
  { code: "LS", name: "Lesotho",               dial: "+266" },
  { code: "LR", name: "Liberia",               dial: "+231" },
  { code: "LY", name: "Libya",                 dial: "+218" },
  { code: "LI", name: "Liechtenstein",         dial: "+423" },
  { code: "LT", name: "Lithuania",             dial: "+370" },
  { code: "LU", name: "Luxembourg",            dial: "+352" },
  { code: "MG", name: "Madagascar",            dial: "+261" },
  { code: "MW", name: "Malawi",                dial: "+265" },
  { code: "MY", name: "Malaysia",              dial: "+60"  },
  { code: "MV", name: "Maldives",              dial: "+960" },
  { code: "ML", name: "Mali",                  dial: "+223" },
  { code: "MT", name: "Malta",                 dial: "+356" },
  { code: "MR", name: "Mauritania",            dial: "+222" },
  { code: "MU", name: "Mauritius",             dial: "+230" },
  { code: "MX", name: "Mexico",                dial: "+52"  },
  { code: "MD", name: "Moldova",               dial: "+373" },
  { code: "MC", name: "Monaco",                dial: "+377" },
  { code: "MN", name: "Mongolia",              dial: "+976" },
  { code: "ME", name: "Montenegro",            dial: "+382" },
  { code: "MA", name: "Morocco",               dial: "+212" },
  { code: "MZ", name: "Mozambique",            dial: "+258" },
  { code: "MM", name: "Myanmar",               dial: "+95"  },
  { code: "NA", name: "Namibia",               dial: "+264" },
  { code: "NP", name: "Nepal",                 dial: "+977" },
  { code: "NL", name: "Netherlands",           dial: "+31"  },
  { code: "NZ", name: "New Zealand",           dial: "+64"  },
  { code: "NI", name: "Nicaragua",             dial: "+505" },
  { code: "NE", name: "Niger",                 dial: "+227" },
  { code: "NG", name: "Nigeria",               dial: "+234" },
  { code: "NO", name: "Norway",                dial: "+47"  },
  { code: "OM", name: "Oman",                  dial: "+968" },
  { code: "PK", name: "Pakistan",              dial: "+92"  },
  { code: "PA", name: "Panama",                dial: "+507" },
  { code: "PG", name: "Papua New Guinea",      dial: "+675" },
  { code: "PY", name: "Paraguay",              dial: "+595" },
  { code: "PE", name: "Peru",                  dial: "+51"  },
  { code: "PH", name: "Philippines",           dial: "+63"  },
  { code: "PL", name: "Poland",                dial: "+48"  },
  { code: "PT", name: "Portugal",              dial: "+351" },
  { code: "QA", name: "Qatar",                 dial: "+974" },
  { code: "RO", name: "Romania",               dial: "+40"  },
  { code: "RU", name: "Russia",                dial: "+7"   },
  { code: "RW", name: "Rwanda",                dial: "+250" },
  { code: "SA", name: "Saudi Arabia",          dial: "+966" },
  { code: "SN", name: "Senegal",               dial: "+221" },
  { code: "RS", name: "Serbia",                dial: "+381" },
  { code: "SL", name: "Sierra Leone",          dial: "+232" },
  { code: "SG", name: "Singapore",             dial: "+65"  },
  { code: "SK", name: "Slovakia",              dial: "+421" },
  { code: "SI", name: "Slovenia",              dial: "+386" },
  { code: "SO", name: "Somalia",               dial: "+252" },
  { code: "ZA", name: "South Africa",          dial: "+27"  },
  { code: "KR", name: "South Korea",           dial: "+82"  },
  { code: "SS", name: "South Sudan",           dial: "+211" },
  { code: "ES", name: "Spain",                 dial: "+34"  },
  { code: "LK", name: "Sri Lanka",             dial: "+94"  },
  { code: "SD", name: "Sudan",                 dial: "+249" },
  { code: "SR", name: "Suriname",              dial: "+597" },
  { code: "SZ", name: "Eswatini",              dial: "+268" },
  { code: "SE", name: "Sweden",                dial: "+46"  },
  { code: "CH", name: "Switzerland",           dial: "+41"  },
  { code: "SY", name: "Syria",                 dial: "+963" },
  { code: "TW", name: "Taiwan",                dial: "+886" },
  { code: "TJ", name: "Tajikistan",            dial: "+992" },
  { code: "TZ", name: "Tanzania",              dial: "+255" },
  { code: "TH", name: "Thailand",              dial: "+66"  },
  { code: "TL", name: "Timor-Leste",           dial: "+670" },
  { code: "TG", name: "Togo",                  dial: "+228" },
  { code: "TT", name: "Trinidad and Tobago",   dial: "+1"   },
  { code: "TN", name: "Tunisia",               dial: "+216" },
  { code: "TR", name: "Turkey",                dial: "+90"  },
  { code: "TM", name: "Turkmenistan",          dial: "+993" },
  { code: "UG", name: "Uganda",                dial: "+256" },
  { code: "UA", name: "Ukraine",               dial: "+380" },
  { code: "AE", name: "United Arab Emirates",  dial: "+971" },
  { code: "GB", name: "United Kingdom",        dial: "+44"  },
  { code: "US", name: "United States",         dial: "+1"   },
  { code: "UY", name: "Uruguay",               dial: "+598" },
  { code: "UZ", name: "Uzbekistan",            dial: "+998" },
  { code: "VE", name: "Venezuela",             dial: "+58"  },
  { code: "VN", name: "Vietnam",               dial: "+84"  },
  { code: "YE", name: "Yemen",                 dial: "+967" },
  { code: "ZM", name: "Zambia",                dial: "+260" },
  { code: "ZW", name: "Zimbabwe",              dial: "+263" },
];

const COURSES = [
  "Accounting & Finance",
  "Architecture",
  "Artificial Intelligence",
  "Biotechnology",
  "Business Administration (MBA)",
  "Chemical Engineering",
  "Civil Engineering",
  "Computer Science",
  "Cybersecurity",
  "Data Science",
  "Dentistry",
  "Economics",
  "Education",
  "Electrical Engineering",
  "Environmental Science",
  "Fashion Design",
  "Film & Media Studies",
  "Graphic Design",
  "Health Sciences",
  "Hospitality & Tourism",
  "Human Resources",
  "Information Technology",
  "Interior Design",
  "International Relations",
  "Journalism",
  "Law (LLB / LLM)",
  "Logistics & Supply Chain",
  "Marketing",
  "Mathematics",
  "Mechanical Engineering",
  "Medicine (MBBS)",
  "Nursing",
  "Pharmacy",
  "Physics",
  "Political Science",
  "Project Management",
  "Psychology",
  "Public Health",
  "Social Work",
  "Software Engineering",
  "Statistics",
  "UX / UI Design",
  "Veterinary Science",
];

const STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "active", label: "Active" },
  { value: "enrolled", label: "Enrolled" },
  { value: "inactive", label: "Inactive" },
];

// flag emoji from country code
const flag = (code) =>
  code
    .toUpperCase()
    .split("")
    .map((c) => String.fromCodePoint(127397 + c.charCodeAt(0)))
    .join("");

// ─────────────────────────────────────────────
// REUSABLE SELECT DROPDOWN (searchable)
// ─────────────────────────────────────────────
const SelectDropdown = ({ label, value, onChange, options, placeholder, error, renderOption, renderSelected }) => {
  const [open, setOpen]     = useState(false);
  const [query, setQuery]   = useState("");
  const containerRef        = useRef(null);
  const inputRef            = useRef(null);

  const filtered = options.filter((o) =>
    (o.label ?? o).toLowerCase().includes(query.toLowerCase())
  );

  // close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // focus search input when opened
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const handleSelect = (opt) => {
    onChange(opt.value ?? opt);
    setOpen(false);
    setQuery("");
  };

  const displayValue = value
    ? renderSelected
      ? renderSelected(options.find((o) => (o.value ?? o) === value))
      : options.find((o) => (o.value ?? o) === value)?.label ?? value
    : null;

  return (
    <div className="relative space-y-1" ref={containerRef}>
      {label && (
        <label className="text-sm font-medium text-slate-700">{label}</label>
      )}

      {/* trigger */}
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={`
          w-full rounded-xl border bg-white px-4 py-2.5 text-left
          text-slate-800 shadow-sm outline-none transition flex items-center justify-between
          hover:border-slate-400
          ${open ? "border-indigo-500 ring-4 ring-indigo-100" : "border-slate-300"}
          ${error ? "border-red-400" : ""}
        `}
      >
        <span className={displayValue ? "text-slate-800" : "text-slate-400"}>
          {displayValue ?? placeholder ?? "Select…"}
        </span>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* dropdown panel */}
      {open && (
        <div className="absolute z-9999 top-full mt-1 w-full rounded-xl border border-slate-200 bg-white shadow-xl overflow-hidden">
          {/* search */}
          <div className="px-3 py-2 border-b border-slate-100">
            <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-1.5">
              <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search…"
                className="flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* options list */}
          <ul className="max-h-52 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-4 py-2 text-sm text-slate-400">No results</li>
            ) : (
              filtered.map((opt) => {
                const val = opt.value ?? opt;
                const isSelected = val === value;
                return (
                  <li
                    key={val}
                    onMouseDown={() => handleSelect(opt)}
                    className={`
                      flex items-center gap-2 px-4 py-2 text-sm cursor-pointer transition
                      ${isSelected
                        ? "bg-indigo-50 text-indigo-700 font-medium"
                        : "text-slate-700 hover:bg-slate-50"}
                    `}
                  >
                    {renderOption ? renderOption(opt) : (opt.label ?? opt)}
                    {isSelected && (
                      <svg className="ml-auto w-3.5 h-3.5 text-indigo-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}

      {error && (
        <p className="text-xs text-red-500 font-medium">{error.message}</p>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// PHONE FIELD WITH COUNTRY CODE PREFIX
// ─────────────────────────────────────────────
const PhoneField = ({ dialValue, dialOnChange, phoneReg, error }) => {
  const [open, setOpen]   = useState(false);
  const [query, setQuery] = useState("");
  const containerRef      = useRef(null);
  const inputRef          = useRef(null);

  const filtered = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.dial.includes(query)
  );

  const selected = COUNTRIES.find((c) => c.dial === dialValue && c.code === (dialValue === "+1" ? "US" : undefined)) ?? COUNTRIES.find((c) => c.dial === dialValue);

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  return (
    <div className="relative space-y-1" ref={containerRef}>
      <label className="text-sm font-medium text-slate-700">Phone</label>

      <div className={`flex rounded-xl border bg-white shadow-sm transition overflow-hidden
        ${error ? "border-red-400" : "border-slate-300 hover:border-slate-400 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100"}`}>

        {/* dial code trigger */}
        <button
          type="button"
          onClick={() => setOpen((p) => !p)}
          className="flex items-center gap-1.5 px-3 py-2.5 border-r border-slate-200 bg-slate-50 hover:bg-slate-100 transition shrink-0"
        >
          <span className="text-base leading-none">{selected ? flag(selected.code) : "🌐"}</span>
          <span className="text-sm font-medium text-slate-700">{dialValue || "+1"}</span>
          <svg className={`w-3 h-3 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* phone number input */}
        <input
          {...phoneReg}
          type="tel"
          placeholder="Phone number"
          className="flex-1 px-3 py-2.5 text-slate-800 text-sm outline-none bg-transparent"
        />
      </div>

      {/* dial dropdown */}
      {open && (
        <div className="absolute z-9999 top-full mt-1 w-full rounded-xl border border-slate-200 bg-white shadow-xl overflow-hidden">
          <div className="px-3 py-2 border-b border-slate-100">
            <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-1.5">
              <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Country or code…"
                className="flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>
          <ul className="max-h-52 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-4 py-2 text-sm text-slate-400">No results</li>
            ) : (
              filtered.map((c) => (
                <li
                  key={c.code}
                  onMouseDown={() => { dialOnChange(c.dial); setOpen(false); setQuery(""); }}
                  className={`flex items-center gap-2 px-4 py-2 text-sm cursor-pointer transition
                    ${c.dial === dialValue ? "bg-indigo-50 text-indigo-700 font-medium" : "text-slate-700 hover:bg-slate-50"}`}
                >
                  <span className="text-base shrink-0">{flag(c.code)}</span>
                  <span className="flex-1 truncate">{c.name}</span>
                  <span className="text-slate-400 shrink-0">{c.dial}</span>
                  {c.dial === dialValue && (
                    <svg className="w-3.5 h-3.5 text-indigo-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </li>
              ))
            )}
          </ul>
        </div>
      )}

      {error && <p className="text-xs text-red-500 font-medium">{error.message}</p>}
    </div>
  );
};

// ─────────────────────────────────────────────
// SHARED INPUT & SECTION
// ─────────────────────────────────────────────
const Input = ({ label, error, ...props }) => (
  <div className="space-y-1">
    {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
    <input
      {...props}
      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5
        text-slate-800 shadow-sm outline-none transition
        focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100
        hover:border-slate-400"
    />
    {error && <p className="text-xs text-red-500 font-medium">{error.message}</p>}
  </div>
);

const Textarea = ({ label, error, ...props }) => (
  <div className="space-y-1">
    {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
    <textarea
      {...props}
      className="min-h-24 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5
        text-slate-800 shadow-sm outline-none transition
        focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100
        hover:border-slate-400"
    />
    {error && <p className="text-xs text-red-500 font-medium">{error.message}</p>}
  </div>
);

const Section = ({ title, children }) => (
  <div className="rounded-2xl border bg-white shadow-sm p-5 space-y-4">
    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</h3>
    {children}
  </div>
);

// ─────────────────────────────────────────────
// MAIN DRAWER
// ─────────────────────────────────────────────
const FORM_DEFAULT_VALUES = {
  first_name: "",
  middle_name: "",
  last_name: "",
  email: "",
  dial_code: "+977",
  phone: "",
  date_of_birth: "",
  gender: "",
  address: "",
  nationality: "",
  passport_number: "",
  passport_expiry: "",
  preferred_country: "",
  preferred_course: "",
  status: "pending",
};

export default function CreateStudentDrawer({ open, onClose, onSuccess }) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(studentSchema),
    defaultValues: FORM_DEFAULT_VALUES,
  });

  const [render, setRender]   = useState(open);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => setRender(true), 0);
      return () => clearTimeout(t);
    }

    const t = setTimeout(() => {
      setAnimate(false);
      setRender(false);
    }, 300);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!render) return;
    const id = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(id);
  }, [render]);

  const handleClose = () => {
    reset(FORM_DEFAULT_VALUES);
    onClose();
  };

  const onSubmit = async (data) => {
    try {
      const rawPhone = data.phone?.trim().replace(/\s+/g, "");
      const phone = rawPhone
        ? rawPhone.startsWith("+")
          ? rawPhone
          : `${data.dial_code ?? ""}${rawPhone}`
        : undefined;

      const merged = {
        ...data,
        phone,
      };
      const payload = mapStudentToApi(merged);
      const student = await createStudent(payload);
      const studentName = [payload.first_name, payload.last_name]
        .filter(Boolean)
        .join(" ")
        .trim();

      toast.success(
        studentName
          ? `${studentName} has been added successfully.`
          : "Student created successfully."
      );
      onSuccess?.(student);
      reset(FORM_DEFAULT_VALUES);
      handleClose();
    } catch (err) {
      console.error("Create student failed:", err);
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to create student"
      );
    }
  };

  if (!render) return null;

  return (
    <>
      {/* BACKDROP */}
      <div
        onClick={handleClose}
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${animate ? "opacity-100" : "opacity-0"}`}
      />

      {/* DRAWER */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-190
          bg-linear-to-b from-slate-50 to-slate-100 z-50 shadow-2xl flex flex-col
          will-change-transform transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${animate ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* HEADER */}
        <div className="flex items-start justify-between border-b bg-white/80 backdrop-blur-md px-6 py-5">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Create Student</h2>
            <p className="text-sm text-slate-500 mt-1">Add a new student profile to the system</p>
          </div>
          <button onClick={handleClose}
            className="h-10 w-10 rounded-xl flex items-center justify-center hover:bg-slate-100 text-slate-500 text-lg">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">

            {/* PERSONAL INFO */}
            <Section title="Personal Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="First Name"  {...register("first_name")}  error={errors.first_name} />
                <Input label="Middle Name" {...register("middle_name")} />
                <Input label="Last Name"   {...register("last_name")}   error={errors.last_name} />
              </div>
            </Section>

            {/* CONTACT */}
            <Section title="Contact Details">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Email" {...register("email")} error={errors.email} />

                {/* Phone with country-code prefix */}
                <Controller
                  name="dial_code"
                  control={control}
                  render={({ field: dialField }) => (
                    <PhoneField
                      dialValue={dialField.value}
                      dialOnChange={dialField.onChange}
                      phoneReg={register("phone")}
                      error={errors.phone}
                    />
                  )}
                />
              </div>
            </Section>

            {/* PROFILE */}
            <Section title="Profile Details">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input type="date" label="Date of Birth" {...register("date_of_birth")} />

                {/* Gender dropdown */}
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <SelectDropdown
                      label="Gender"
                      value={field.value}
                      onChange={field.onChange}
                      options={GENDERS}
                      placeholder="Select gender"
                      error={errors.gender}
                    />
                  )}
                />

                {/* Nationality dropdown */}
                <Controller
                  name="nationality"
                  control={control}
                  render={({ field }) => (
                    <SelectDropdown
                      label="Nationality"
                      value={field.value}
                      onChange={field.onChange}
                      options={COUNTRIES.map((c) => ({ value: c.name, label: c.name, code: c.code }))}
                      placeholder="Select nationality"
                      error={errors.nationality}
                      renderOption={(opt) => (
                        <span className="flex items-center gap-2">
                          <span className="text-base">{flag(opt.code)}</span>
                          {opt.label}
                        </span>
                      )}
                      renderSelected={(opt) =>
                        opt ? (
                          <span className="flex items-center gap-2">
                            <span className="text-base">{flag(opt.code)}</span>
                            {opt.label}
                          </span>
                        ) : null
                      }
                    />
                  )}
                />

                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <SelectDropdown
                      label="Status"
                      value={field.value}
                      onChange={field.onChange}
                      options={STATUSES}
                      placeholder="Select status"
                      error={errors.status}
                    />
                  )}
                />
              </div>

              <Textarea label="Address" {...register("address")} error={errors.address} />
            </Section>

            {/* PASSPORT */}
            <Section title="Passport Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Passport Number" {...register("passport_number")} />
                <Input type="date" label="Passport Expiry" {...register("passport_expiry")} />
              </div>
            </Section>

            {/* STUDY PREFERENCES */}
            <Section title="Study Preferences">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Preferred Country dropdown */}
                <Controller
                  name="preferred_country"
                  control={control}
                  render={({ field }) => (
                    <SelectDropdown
                      label="Preferred Country"
                      value={field.value}
                      onChange={field.onChange}
                      options={COUNTRIES.map((c) => ({ value: c.name, label: c.name, code: c.code }))}
                      placeholder="Select country"
                      error={errors.preferred_country}
                      renderOption={(opt) => (
                        <span className="flex items-center gap-2">
                          <span className="text-base">{flag(opt.code)}</span>
                          {opt.label}
                        </span>
                      )}
                      renderSelected={(opt) =>
                        opt ? (
                          <span className="flex items-center gap-2">
                            <span className="text-base">{flag(opt.code)}</span>
                            {opt.label}
                          </span>
                        ) : null
                      }
                    />
                  )}
                />

                {/* Preferred Course dropdown */}
                <Controller
                  name="preferred_course"
                  control={control}
                  render={({ field }) => (
                    <SelectDropdown
                      label="Preferred Course"
                      value={field.value}
                      onChange={field.onChange}
                      options={COURSES.map((c) => ({ value: c, label: c }))}
                      placeholder="Select course"
                      error={errors.preferred_course}
                    />
                  )}
                />
              </div>
            </Section>

          </div>

          {/* FOOTER */}
          <div className="shrink-0 border-t bg-white/90 backdrop-blur-md px-6 py-4 flex justify-between items-center">
            <p className="text-xs text-slate-400">All fields are securely stored</p>
            <div className="flex gap-3">
              <button type="button" onClick={handleClose}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100">
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 text-white font-medium shadow-md hover:shadow-lg transition disabled:opacity-50">
                {isSubmitting ? "Creating..." : "Create Student"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
