import { app } from "electron";

/**
 * Sets Fiddle's About panel options on Linux and macOS
 *
 * @returns
 */
export const setupAboutPanel = () => {
  app.setAboutPanelOptions({
    applicationName: "Synvert",
    applicationVersion: app.getVersion(),
    authors: [{ name: "Richrd Huang" }],
    copyright: `© ${new Date().getFullYear()} Xinmin Labs`,
    version: "",
    authors: ["Richard Huang <flyerhzm@gmail.com>"],
    website: "https://synvert.net",
  });
};
