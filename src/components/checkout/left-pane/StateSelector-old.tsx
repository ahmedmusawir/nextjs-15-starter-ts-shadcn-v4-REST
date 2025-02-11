"use client";

import React, { useState } from "react";
import { StateSelect } from "react-country-state-city";
// Import the default CSS if needed:
import "react-country-state-city/dist/react-country-state-city.css";

type StateSelectorProps = {
  /** The currently selected state code (e.g. "CA") */
  value?: string;
  /** Called whenever the user picks a new state */
  onChange: (newState: string | null) => void;
};

const StateSelector = ({ value, onChange }: StateSelectorProps) => {
  // Local state to manage the selected state code
  const [selectedState, setSelectedState] = useState<string | null>(
    value ?? null
  );

  const handleStateChange = (newValue: string | null) => {
    setSelectedState(newValue);
    onChange(newValue);
  };

  return (
    <StateSelect
      countryid={233}
      value={(selectedState ?? "") as any}
      onChange={(val) => handleStateChange(val as any)}
    />
  );
};

export default StateSelector;
