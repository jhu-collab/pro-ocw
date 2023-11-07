"use client";
import type { FormEvent } from "react";
import { useCallback, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import IconCircle from "./IconCircle";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Role, ROLES } from "@/constants";

export type StepProps = {
  title: string;
  fieldType: "text" | "dropdown";
  placeholder: string;
  onSubmit?: (value: any) => Promise<void>;
  icon: React.ReactNode;
  dropdownItems?: string[];
};

export default function Steps({
  title,
  icon,
  fieldType,
  placeholder,
  onSubmit,
  dropdownItems,
}: StepProps) {
  const [input, setInput] = useState("");
  const step = { title, fieldType, placeholder };
  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      await onSubmit?.(input);
      setInput("");
    },
    [onSubmit, input]
  );

  return (
    <div className="w-full max-w-lg">
      <IconCircle>{icon}</IconCircle>
      <h2 className="mt-4 mb-8 text-xl font-semibold lg:text-3xl">
        {step.title}
      </h2>
      <form
        className="flex max-w-[360px] flex-col items-start gap-y-6"
        onSubmit={handleSubmit}
      >
        {step.fieldType === "text" && (
          <Input
            key={title}
            autoFocus
            placeholder={step.placeholder}
            className="w-full"
            onChange={(e) => setInput(e.target.value)}
          />
        )}
        {step.fieldType === "dropdown" && (
          <Select onValueChange={(value) => setInput(value)} value={input}>
            <SelectTrigger className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {dropdownItems!.map((r) => {
                return (
                  <SelectItem value={r} key={r}>
                    {r}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        )}
        <Button className="w-full" disabled={!input}>
          Next
        </Button>
      </form>
    </div>
  );
}
