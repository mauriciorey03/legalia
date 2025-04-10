import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface Profile {
  id: string;
  full_name: string | null;
  subscription_plan: string;
  subscription_status: string;
}

interface AuthState {
  user: any | null;
  profile: Profile | null;
  loading: boolean;
  setUser: (user: any) => void;
  setProfile: (profile: Profile) => void;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  loading: true,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, profile: null });
  },
}));

// Initialize auth state
supabase.auth.getSession().then(({ data: { session } }) => {
  useAuthStore.getState().setUser(session?.user ?? null);
  if (session?.user) {
    supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()
      .then(({ data }) => {
        useAuthStore.getState().setProfile(data);
      });
  }
});

// Listen for auth changes
supabase.auth.onAuthStateChange(async (event, session) => {
  useAuthStore.getState().setUser(session?.user ?? null);
  if (session?.user) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    useAuthStore.getState().setProfile(data);
  }
});