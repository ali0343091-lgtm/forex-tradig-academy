import React, { createContext, useContext, useState, useEffect } from 'react';
import { AcademySettings } from '../types/index.ts';

interface SettingsContextType {
  settings: AcademySettings;
  loading: boolean;
  refreshSettings: () => Promise<void>;
  updateSettings: (newSettings: Partial<AcademySettings>) => Promise<boolean>;
}

const DEFAULT_SETTINGS: AcademySettings = {
  academyName: 'FOREX TRADING ACADEMY',
  tagline: 'Learn. Practice. Trade with Discipline.',
  originalPrice: 50000,
  discountedPrice: 15000,
  currency: 'PKR',
  easypaisaNumber: '03135279108',
  easypaisaAccountTitle: 'Forex Trading Academy',
  jazzcashNumber: '03430919084',
  jazzcashAccountTitle: 'Forex Trading Academy',
  contactEmail: 'ali0343091@gmail.com',
  contactPhone: '03430919084',
  whatsappNumber: '03430919084',
  instructorName: 'Forex Trading Academy Lead Instructor',
  instructorBio: 'Professional currency trader with over 8 years in financial markets, focusing on pure Price Action, Liquidity Order Blocks, and strict 1:3 Risk Management.',
  instructorAvatar: '',
  announcement: 'Special Discount: Enroll now for only PKR 15,000 (Originally PKR 50,000). Limited seats per monthly batch.',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AcademySettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  const refreshSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  const updateSettings = async (newSettings: Partial<AcademySettings>): Promise<boolean> => {
    const token = localStorage.getItem('fta_token');
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newSettings)
      });
      if (res.ok) {
        const data = await res.json();
        setSettings(data.settings);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to update settings:', err);
      return false;
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
