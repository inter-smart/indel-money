import { headers } from "next/headers";
import MobHeader from "./MobHeader";
import DeskHeader from "./DeskHeader";
import "./Header.css";
import { getServerLocale } from "../../../lib/locale/getServerLocale";
import { buildLocalizedUrl } from "../../../lib/locale/localizedUrl";

function isMobileDevice(userAgent) {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
}

async function fetchData(locale) {
  try {
    const response = await fetch(
      buildLocalizedUrl(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/header`,
        locale,
      ),
      {
        next: { revalidate: 60 },
      },
    );
    const result = await response.json();

    if (result.status === "success") {
      return {
        contents: result.data,
        socialLinks: result.data?.socialMediaLinks,
        links: result.data?.quickLinks,
        error: null,
      };
    }
    return {
      contents: null,
      socialLinks: null,
      links: null,
      error: result.message,
    };
  } catch (error) {
    return {
      contents: null,
      socialLinks: null,
      links: null,
      error: "Failed to fetch header data",
    };
  }
}

export default async function Header() {
  const locale = await getServerLocale();
  const headersList = await headers();
  const isMobile = isMobileDevice(headersList.get("user-agent") || "");
  const {
    contents: headerData,
    socialLinks,
    links,
    error,
  } = await fetchData(locale);

  if (error) {
    return <div>{error}</div>;
  }

  if (isMobile) {
    return (
      <MobHeader
        socialLinks={socialLinks}
        logo={headerData?.content?.logo}
        links={links}
        title={headerData?.content?.button_1_text}
        modes={headerData?.modes}
        locale={locale}
      />
    );
  }

  return (
    <div id="header">
      <DeskHeader headerData={headerData} locale={locale} />
    </div>
  );
}
