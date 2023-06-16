import { BrowserRouter } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { NavigationMenu } from "@shopify/app-bridge-react";
import Routes from "./Routes";

import {
  AppBridgeProvider,
  QueryProvider,
  PolarisProvider,
} from "./components";
import { I18nContext, I18nManager } from '@shopify/react-i18n';

export default function App() {
  // Any .tsx or .jsx files in /pages will become a route
  // See documentation for <Routes /> for more info
  const pages = import.meta.globEager("./pages/**/!(*.test.[jt]sx)*.([jt]sx)");
  const { t } = useTranslation();

  const locale = 'en';
  const i18nManager = new I18nManager({
    locale,
    onError(error) {
      Bugsnag.notify(error);
    },
  });

  return (
    <PolarisProvider>
      <BrowserRouter>
        <AppBridgeProvider>
          <QueryProvider>
            <I18nContext.Provider value={ i18nManager }>
              <NavigationMenu
                navigationLinks={[
                  {
                    label: t("NavigationMenu.pageName"),
                    destination: "/pagename",
                  },
                ]}
              />
            
            <Routes pages={pages} />
            </I18nContext.Provider>
          </QueryProvider>
        </AppBridgeProvider>
      </BrowserRouter>
    </PolarisProvider>
  );
}
