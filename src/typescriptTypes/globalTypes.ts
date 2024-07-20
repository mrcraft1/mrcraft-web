import { ReactElement, ReactNode } from "react";

export interface LayoutProps {
  children: ReactNode;
}

export interface LocationState {
  lat: number | null;
  lng: number | null;
}

export interface RootState {
  Location: LocationState;
  // Add other state slices here
}

// Define a type for the resources object
export interface Resources {
  [key: string]: {
    translation: Record<string, string>;
  };
}

export interface WebSettings {
  landing_page_logo: string;
  landing_page_title: string;
  landing_page_backgroud_image: string;
  process_flow_title: string;
  process_flow_description: string;
  step_1_title: string;
  step_1_description: string;
  step_1_image: string;
  step_2_title: string;
  step_2_description: string;
  step_2_image: string;
  step_3_title: string;
  step_3_description: string;
  step_3_image: string;
  step_4_title: string;
  step_4_description: string;
  step_4_image: string;
}

export interface HowItWorksItem {
  id: string;
  title: string;
  desc: string;
  img: string;
}

export interface Settings {
  web_settings?: WebSettings;
}

export interface ShareDialogProps {
  open: boolean;
  setOpen: (isOpen: boolean) => void;
  link: string;
}

export interface NotificationData {
  [key: string]: any;
}

export interface Profile {
  fcm_id?: string;
  // Add other profile properties as needed
}

export interface ProfileRootState {
  UserData: {
    profile: {
      data: Profile;
    };
  };
}

export interface PushNotificationLayoutProps {
  children: ReactElement;
}

export interface Location {
  lat: number;
  lng: number;
  formatted_address?: string;
  city?: string;
  country?: string;
  state?: string;
  areaName?: string;
}

export interface GoogleMapRootState {
  Location: {
    lat: number;
    lng: number;
  };
}

export interface GoogleMapBoxProps {
  onSelectLocation: (location: Location) => void;
  apiKey: string;
  isLocationPass: boolean;
  locationlat: number;
  locationlng: number;
}

export interface UpdateGoogleMapBoxProps {
  onSelectLocation: (location: Location) => void;
  apiKey: string;
  onMarkerDrag?: (location: Location) => void;
  editLatitude: string;
  editLongitude: string;
}

export interface FooterSettings {
  web_settings?: {
    footer_logo?: string;
    footer_description?: string;
    social_media?: Array<{
      url: string;
      file: string;
    }>;
    app_section_status?: boolean;
    web_title?: string;
    playstore_url?: string;
    applestore_url?: string;
  };
  general_settings?: {
    support_email?: string;
    phone?: string;
    support_hours?: string;
    address?: string;
    copyright_details?: string;
  };
}

export interface FooterRootState {
  Settings: {
    settings: FooterSettings;
  };
}

export interface EdemandSettingProps {
  changeLight: () => void;
  changeDark: () => void;
  setOpenSetting: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface ThemeState {
  data: string;
}

export interface ThemeRootState {
  theme: ThemeState;
  // other slices of your state...
}
