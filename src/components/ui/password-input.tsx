"use client";

import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { EyeIcon, EyeOffIcon, LockIcon } from "lucide-react";
import React, { useState } from "react";

export function PasswordInput(props: React.ComponentProps<typeof Input>) {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <InputGroup className="bg-background">
      <InputGroupAddon>
        <LockIcon />
      </InputGroupAddon>
      <InputGroupInput {...props} />
      <InputGroupAddon align="inline-end">
        <InputGroupButton onClick={togglePasswordVisibility}>
          {showPassword ? <EyeIcon /> : <EyeOffIcon />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}
