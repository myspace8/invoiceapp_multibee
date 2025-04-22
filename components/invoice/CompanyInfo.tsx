"use client"
import { CompanyInfo as CompanyInfoType } from "@/types/invoice"

interface CompanyInfoProps {
  companyInfo: CompanyInfoType
}

export function CompanyInfo({ companyInfo }: CompanyInfoProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 print:flex-row print:items-end">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">{companyInfo.name || "N/A"}</h2>
        <p className="text-sm text-muted-foreground">
          {companyInfo.description || "No description available"}
        </p>
        <p className="text-sm">{companyInfo.location || "No location provided"}</p>
        <p className="text-sm">{companyInfo.contact || "No contact provided"}</p>
        {companyInfo.website && (
          <p className="text-sm">
            <a href={companyInfo.website} target="_blank" rel="noopener noreferrer" className="underline">
              {companyInfo.website}
            </a>
          </p>
        )}
      </div>
      <div className="mt-4 md:mt-0 print:mt-0">
        <img
          src="/logo_test_7.png"
          alt="Company Logo"
          className="h-16 w-auto print:h-16"
          onError={(e) => {
            e.currentTarget.src = "/logo_test_7.png" // Fallback image
          }}
        />
      </div>
    </div>
  )
}