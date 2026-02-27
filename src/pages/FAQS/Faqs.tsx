import PageMeta from "../../components/common/PageMeta";
import { FAQ } from "../../features/FAQS/Faqs";

export default function FAQPage() {
  return (
    <>
      <PageMeta
        title="FAQS | TailAdmin - Property4India faqs"
        description="This is frequently asked questions page for property4india properties"
      />
      <FAQ />
    </>
  );
}
