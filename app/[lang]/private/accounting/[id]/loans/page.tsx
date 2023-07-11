import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import { Locale } from "@/i18n-config";

interface Props {
  params: { lang: Locale, id: string }
};

const page = (): React.ReactElement => (
  <>
    <Breadcrumb />
    Loans page
  </>
);

export default page;