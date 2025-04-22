import { CompanyInfo as CompanyInfoType } from "@/types/invoice"

interface CompanyInfoProps {
  companyInfo: CompanyInfoType
}

export function CompanyInfo({ companyInfo }: CompanyInfoProps) {
  return (
    <div className="mb-8 text-center">
      <h1 className="text-3xl font-bold">{companyInfo.name}</h1>
      <p className="text-sm text-muted-foreground">{companyInfo.description}</p>
      <p className="text-sm">{companyInfo.location}</p>
      <p className="text-sm">{companyInfo.contact}</p>
      <a
        href={`https://${companyInfo.website}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-blue-600 hover:underline"
      >
        {companyInfo.website}
      </a>
    </div>
  )
}