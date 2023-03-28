import { Conversation } from "types/index";
import { IconFileExport, IconMoon, IconSun } from "@tabler/icons-react";
import { FC } from "react";
import { ClearConversations } from "./ClearConversations";
import { Import } from "./Import";
import { SidebarButton } from "./SidebarButton";
import { useRouter } from "next/router";
import { IconTopologyStar3} from "@tabler/icons-react";

interface Props {
  lightMode: "light" | "dark";
  apiKey: string;
  onToggleLightMode: (mode: "light" | "dark") => void;
  onApiKeyChange: (apiKey: string) => void;
  onClearConversations: () => void;
  onExportConversations: () => void;
  onImportConversations: (conversations: Conversation[]) => void;
}

export const SidebarSettings: FC<Props> = ({ lightMode, apiKey, onToggleLightMode, onApiKeyChange, onClearConversations, onExportConversations, onImportConversations }) => {
  const router = useRouter();
  
  return (
    <div className="flex flex-col pt-1 items-center border-t border-white/20 text-sm space-y-1">
      <ClearConversations onClearConversations={onClearConversations} />

      <Import onImport={onImportConversations} />

      <SidebarButton
        text="Export conversations"
        icon={<IconFileExport size={16} />}
        onClick={() => onExportConversations()}
      />

      <SidebarButton
        text={lightMode === "light" ? "Dark mode" : "Light mode"}
        icon={lightMode === "light" ? <IconMoon size={16} /> : <IconSun size={16} />}
        onClick={() => onToggleLightMode(lightMode === "light" ? "dark" : "light")}
      />

      <SidebarButton
        text="Integrations"
        icon={<IconTopologyStar3 size={16} />}
        onClick={() => router.push('/partners/integrations')}
      />









    </div>
  );
};
