import MobHeader from "./MobHeader";
import DeskHeader from "./DeskHeader";
import "./Header.css";
import { getServerLocale } from "../../../lib/locale/getServerLocale";
import { buildLocalizedUrl } from "../../../lib/locale/localizedUrl";

async function fetchData(locale) {
  try {
    const response = await fetch(buildLocalizedUrl(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/header`, locale), {
      cache: "no-store", // Ensure fresh data
    });
    const result = await response.json();

    if (result.status === "success") {
      return {
        contents: result.data,
        socialLinks: result.data?.socialMediaLinks,
        links: result.data?.quickLinks,
        error: null,
      };
    }
    return { contents: null, socialLinks: null, links: null, error: result.message };
  } catch (error) {
    return { contents: null, socialLinks: null, links: null, error: "Failed to fetch header data" };
  }
}

export default async function Header() {
  const locale = await getServerLocale();
  const { contents: headerData, socialLinks, links, error } = await fetchData(locale);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <div className="hidden lg:block">
        <DeskHeader headerData={headerData} locale={locale} />
      </div>
      <div className="block lg:hidden">
        <MobHeader
          socialLinks={socialLinks}
          logo={headerData?.content?.logo}
          links={links}
          title={headerData?.content?.button_1_text}
          modes={headerData?.modes}
          locale={locale}
        />
      </div>
    </>
  );
}
