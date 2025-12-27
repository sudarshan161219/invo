import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDocumentStore } from "@/store/documentStore/useDocumentStore";

export const TypeTabs: React.FC = () => {
  const { form, setIssuerType } = useDocumentStore();

  return (
    <div className="flex flex-col gap-4 mb-2">
      <Tabs
        value={form.issuerMode}
        onValueChange={(val) => setIssuerType(val as "freelancer" | "business")}
        className="cursor-pointer w-full"
      >
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger className="cursor-pointer" value="freelancer">
            Freelancer
          </TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="business">
            Business
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
