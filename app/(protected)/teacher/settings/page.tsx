import { SharedSettingsPage } from "@/components/settings/shared-settings-page";

export default function SettingsPage() {
  return (
    <SharedSettingsPage 
      customTitle="Teacher Settings"
      customDescription="Manage your teacher profile, security, and account settings."
      hideAccountTab={true}
    />
  );
}
