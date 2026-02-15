import PageMeta from "../../components/common/PageMeta";
import { FAQ } from "../../features/FAQS/Faqs";

export default function FAQPage() {
  return (
    <>
      <PageMeta
        title="FAQS | TailAdmin - Bengal faqs"
        description="This is frequently asked questions page for bengal properties"
      />
      <FAQ />
    </>
  );
}
