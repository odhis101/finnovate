import { create } from 'zustand';
import type { Organisation, AssociatedOrg, GenderOption, Group } from '../services/api/types';

interface OnboardingState {
  // LookupScreen
  phone: string;

  // Associated orgs returned from /auth/get-associated-orgs
  associatedOrgs: AssociatedOrg[];

  // SaccoSelectionScreen — the org the user tapped
  selectedOrg: AssociatedOrg | null;

  // SelectGroupScreen
  selectedGroup: Group | null;

  // KYCScreen — reference data loaded on mount
  genders: GenderOption[];

  // KYCScreen — email stored here, forwarded to createClientFinal
  email: string;

  // KYCScreen — form_id returned by /client/create/basic/initial
  kycFormId: number | null;

  // UploadIDScreen — local file URIs from image picker
  idFrontUri: string | null;
  idBackUri: string | null;

  // Username returned from /client/create/basic/final — used in changeDefaultPin
  username: string;

  // Actions
  setPhone: (phone: string) => void;
  setAssociatedOrgs: (orgs: AssociatedOrg[]) => void;
  setSelectedOrg: (org: AssociatedOrg) => void;
  setSelectedGroup: (group: Group) => void;
  setGenders: (genders: GenderOption[]) => void;
  setEmail: (email: string) => void;
  setKycFormId: (formId: number) => void;
  setIdPhotos: (frontUri: string, backUri: string) => void;
  setUsername: (username: string) => void;
  reset: () => void;
}

const initialState = {
  phone: '',
  associatedOrgs: [],
  selectedOrg: null,
  selectedGroup: null,
  genders: [],
  email: '',
  kycFormId: null,
  idFrontUri: null,
  idBackUri: null,
  username: '',
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  ...initialState,

  setPhone: (phone) => set({ phone }),
  setAssociatedOrgs: (orgs) => set({ associatedOrgs: orgs }),
  setSelectedOrg: (org) => set({ selectedOrg: org }),
  setSelectedGroup: (group) => set({ selectedGroup: group }),
  setGenders: (genders) => set({ genders }),
  setEmail: (email) => set({ email }),
  setKycFormId: (formId) => set({ kycFormId: formId }),
  setIdPhotos: (frontUri, backUri) => set({ idFrontUri: frontUri, idBackUri: backUri }),
  setUsername: (username) => set({ username }),
  reset: () => set(initialState),
}));
