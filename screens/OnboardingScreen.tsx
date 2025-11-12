import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { JournalIcon, GrowthIcon, ChatIcon } from '../components/Icons';

const CustomSelect: React.FC<{
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    placeholder: string;
}> = ({ value, onChange, options, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);
    
    const handleOptionClick = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    const selectedLabel = options.find(o => o.value === value)?.label || placeholder;

    return (
        <div className="custom-select-container" ref={wrapperRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`custom-select-trigger ${isOpen ? 'open' : ''}`}
            >
                <span className={!value ? 'opacity-70' : ''}>{selectedLabel}</span>
                <div className="custom-select-arrow">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </div>
            </button>
            {isOpen && (
                <div className="custom-select-options">
                    {options.map(option => (
                        <div
                            key={option.value}
                            onClick={() => handleOptionClick(option.value)}
                            className="custom-select-option"
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

const OnboardingScreen: React.FC = () => {
  const { setUserName, setUserCountry, setUserAge, setUserGender, addGoal, completeOnboarding, userName } = useAppContext();
  const [step, setStep] = useState(0);
  const [nameInput, setNameInput] = useState('');
  const [countryInput, setCountryInput] = useState('');
  const [ageInput, setAgeInput] = useState('');
  const [genderInput, setGenderInput] = useState('');
  const [goalInput, setGoalInput] = useState('');
  const [showCustomGoalInput, setShowCustomGoalInput] = useState(false);

  const features = [
    { icon: JournalIcon, title: "Reflect & Understand", subtitle: "Write in a private journal to explore your thoughts." },
    { icon: GrowthIcon, title: "Grow & Evolve", subtitle: "Set and track meaningful personal goals." },
    { icon: ChatIcon, title: "Talk & Connect", subtitle: "Chat with me anytime you need a listening ear." },
  ];

  const countries = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
    "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
    "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo, Democratic Republic of the", "Congo, Republic of the", "Costa Rica", "Cote d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czech Republic",
    "Denmark", "Djibouti", "Dominica", "Dominican Republic",
    "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
    "Fiji", "Finland", "France",
    "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
    "Haiti", "Honduras", "Hungary",
    "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Italy",
    "Jamaica", "Japan", "Jordan",
    "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan",
    "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
    "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
    "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway",
    "Oman",
    "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
    "Qatar",
    "Romania", "Russia", "Rwanda",
    "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
    "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
    "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan",
    "Vanuatu", "Vatican City", "Venezuela", "Vietnam",
    "Yemen",
    "Zambia", "Zimbabwe",
    "Other"
  ];

  const genders = [ "Male", "Female", "Prefer not to mention" ];
  
  const handleNameSubmit = () => {
    if (nameInput.trim()) {
      setUserName(nameInput.trim());
      setStep(1);
    }
  };
  
  const handleProfileSubmit = () => {
    const age = parseInt(ageInput, 10);
    if (!isNaN(age) && genderInput) {
        setUserAge(age);
        setUserGender(genderInput);
        setStep(2);
    } else if (ageInput === '' && genderInput) { // Allow skipping age
        setUserAge(null);
        setUserGender(genderInput);
        setStep(2);
    } else if (genderInput === 'Prefer not to mention') { // Allow skipping with prefer not to say
        setUserAge(isNaN(age) ? null : age);
        setUserGender(genderInput);
        setStep(2);
    }
  };

  const handleCountrySubmit = () => {
      setUserCountry(countryInput);
      setStep(3);
  };

  const handleGoalSelect = (goal: string) => {
    addGoal({
        goalName: goal,
        targetDate: new Date(new Date().setDate(new Date().getDate() + 30)),
        type: 'daily'
    });
    setStep(5);
  };
  
  const handleCustomGoalSubmit = () => {
    if (goalInput.trim()) {
        handleGoalSelect(goalInput.trim());
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="animate-fade-in-up text-center w-full max-w-sm">
            <h1 className="text-4xl font-sans font-bold text-[--text-header] mb-2">Welcome to Lehsa</h1>
            <p className="text-lg text-[--text-secondary] mb-8">Your personal companion for mental wellness.</p>
            <div className="w-full space-y-4">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleNameSubmit()}
                placeholder="What should I call you?"
                className="w-full text-center p-4 glassmorphism rounded-full focus:ring-2 focus:ring-[--accent-color] outline-none text-[--text-on-glass] placeholder:text-[--text-on-glass]/60 transition-all"
              />
              <button
                onClick={handleNameSubmit}
                disabled={!nameInput.trim()}
                className="w-full bg-[--accent-color] text-[--accent-color-text] py-4 rounded-full font-semibold hover:bg-[--accent-color-hover] transition-all disabled:opacity-50 active:scale-95"
              >
                Continue
              </button>
            </div>
          </div>
        );
      case 1:
        return (
            <div className="animate-fade-in-up text-center w-full max-w-sm">
                <h1 className="text-3xl font-sans font-bold text-[--text-header] mb-2">Tell me a bit about you</h1>
                <p className="text-md text-[--text-secondary] mb-8">This is optional and helps me understand you better.</p>
                <div className="w-full space-y-6">
                    <div>
                        <p className="text-md text-[--text-secondary] mb-3">What is your gender?</p>
                        <div className="flex justify-center space-x-3">
                            {genders.map(g => (
                                <button
                                    key={g}
                                    onClick={() => setGenderInput(g)}
                                    className={`gender-option flex-1 py-3 px-2 glassmorphism rounded-full font-semibold text-sm ${genderInput === g ? 'active' : ''}`}
                                >
                                    {g}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <p className="text-md text-[--text-secondary] mb-3">What is your age?</p>
                        <CustomSelect
                            value={ageInput}
                            onChange={setAgeInput}
                            placeholder="Select your age (optional)"
                            options={Array.from({ length: 99 - 13 + 1 }, (_, i) => ({
                                value: String(13 + i),
                                label: String(13 + i),
                            }))}
                        />
                    </div>
                    
                    <button
                        onClick={handleProfileSubmit}
                        disabled={!genderInput}
                        className="w-full bg-[--accent-color] text-[--accent-color-text] py-4 rounded-full font-semibold hover:bg-[--accent-color-hover] transition-all disabled:opacity-50 active:scale-95"
                    >
                        Continue
                    </button>
                </div>
            </div>
        );
      case 2:
        return (
           <div className="animate-fade-in-up text-center w-full max-w-sm">
            <h1 className="text-3xl font-sans font-bold text-[--text-header] mb-2">Where are you joining from?</h1>
            <p className="text-md text-[--text-secondary] mb-8">This helps provide relevant local support resources if you ever need them. Your privacy is my top priority.</p>
            <div className="w-full space-y-4">
                <CustomSelect
                    value={countryInput}
                    onChange={setCountryInput}
                    placeholder="Select your country"
                    options={countries.map(c => ({ value: c, label: c }))}
                />
              <button
                onClick={handleCountrySubmit}
                disabled={!countryInput}
                className="w-full bg-[--accent-color] text-[--accent-color-text] py-4 rounded-full font-semibold hover:bg-[--accent-color-hover] transition-all disabled:opacity-50 active:scale-95"
              >
                Continue
              </button>
            </div>
          </div>
        );
      case 3:
        return (
            <div className="animate-fade-in-up text-center w-full max-w-sm flex flex-col">
                <header className="flex-shrink-0 pb-8">
                    <h1 className="text-3xl font-sans font-bold text-[--text-header]">Here's how I can help, {userName}.</h1>
                </header>
                <main className="flex-grow space-y-4 text-left">
                    {features.map(({ icon: Icon, title, subtitle }, index) => (
                         <div
                            key={title}
                            className={`flex items-center glassmorphism p-4 rounded-2xl transition-all duration-500 animate-fade-in-up`}
                            style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'forwards' }}
                         >
                            <Icon className="w-8 h-8 mr-4 text-[--accent-color] flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold text-[--text-primary]">{title}</h3>
                                <p className="text-sm text-[--text-secondary]">{subtitle}</p>
                            </div>
                        </div>
                    ))}
                </main>
                <footer className="flex-shrink-0 w-full pt-8">
                    <button
                        onClick={() => setStep(4)}
                        className="w-full bg-[--accent-color] text-[--accent-color-text] py-3 rounded-full font-semibold hover:bg-[--accent-color-hover] transition-all animate-fade-in-up active:scale-95"
                        style={{ animationDelay: `600ms`, animationFillMode: 'forwards' }}
                    >
                        Get Started
                    </button>
                </footer>
            </div>
        );
        
      case 4:
        const suggestedGoals = [
            "Practice daily mindfulness",
            "Write in my journal regularly",
            "Disconnect from screens before bed",
            "Take a short walk each day",
        ];
        return (
            <div className="animate-fade-in-up text-center w-full max-w-md">
                <h1 className="text-3xl font-sans font-bold text-[--text-header] mb-2">Let's set your first intention.</h1>
                <p className="text-lg text-[--text-secondary] mb-8">What's one small step you'd like to take?</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {suggestedGoals.map(goal => (
                        <button key={goal} onClick={() => handleGoalSelect(goal)} className="p-4 text-left glassmorphism rounded-xl hover:bg-white/20 transition-colors">
                            <p className="font-semibold text-[--text-on-glass]">{goal}</p>
                        </button>
                    ))}
                    <button onClick={() => setShowCustomGoalInput(true)} className="p-4 text-left glassmorphism rounded-xl hover:bg-white/20 transition-colors">
                        <p className="font-semibold text-[--text-on-glass]">Write my own...</p>
                    </button>
                </div>
                {showCustomGoalInput && (
                    <div className="mt-4 flex space-x-2 animate-fade-in-up">
                        <input
                            type="text"
                            value={goalInput}
                            onChange={(e) => setGoalInput(e.target.value)}
                            onKeyPress={e => e.key === 'Enter' && handleCustomGoalSubmit()}
                            placeholder="Type your goal..."
                            className="flex-grow p-3 glassmorphism rounded-full focus:ring-2 focus:ring-[--accent-color] outline-none text-[--text-on-glass] placeholder:text-[--text-on-glass]/60 transition-all"
                        />
                         <button
                            onClick={handleCustomGoalSubmit}
                            disabled={!goalInput.trim()}
                            className="bg-[--accent-color] text-[--accent-color-text] px-6 rounded-full font-semibold hover:bg-[--accent-color-hover] transition-colors disabled:opacity-50 active:scale-95"
                        >
                            Set
                        </button>
                    </div>
                )}
            </div>
        );

        case 5:
            return (
                <div className="animate-fade-in-up text-center w-full max-w-sm">
                     <h1 className="text-4xl font-sans font-bold text-[--text-header] mb-2">You're all set, {userName}!</h1>
                     <p className="text-lg text-[--text-secondary] mb-8">I'm here for you on your journey.</p>
                     <button
                        onClick={completeOnboarding}
                        className="w-full mt-4 bg-[--accent-color] text-[--accent-color-text] py-3 rounded-full font-semibold hover:bg-[--accent-color-hover] transition-colors active:scale-95"
                    >
                        Start Exploring
                    </button>
                </div>
            )

      default:
        return null;
    }
  };

  return (
    <div className="h-full w-full onboarding-mode day-mode-bg text-[--text-primary]">
        <div 
            className="h-full flex flex-col items-center justify-center p-6 relative" 
            style={{ paddingTop: 'env(safe-area-inset-top, 0px)', paddingBottom: `calc(2.5rem + env(safe-area-inset-bottom, 0px))` }}
        >
            {renderStep()}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex space-x-2" style={{ bottom: `calc(2.5rem + env(safe-area-inset-bottom, 0px))` }}>
                {[...Array(6)].map((_, i) => (
                    <div key={i} className={`w-2 h-2 rounded-full transition-colors duration-300 ${i === step ? 'bg-[--text-primary]' : 'bg-[--text-secondary]/50'}`}></div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default OnboardingScreen;